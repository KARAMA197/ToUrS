import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const inquiryRoute = "app/api/custom-itinerary/route.ts";
const quotationRoute = "app/api/admin/requests/[referenceId]/quotation/route.ts";
const sourceFiles = new Set([
  inquiryRoute,
  quotationRoute,
  "lib/email-delivery.ts",
  "lib/contact.ts",
  "lib/lead.ts",
  "lib/site.ts",
  "lib/request-quotation.ts",
  "lib/request-pipeline.ts",
]);
const compiledSources = new Map();

function compileSource(file) {
  assert.ok(sourceFiles.has(file), `Unexpected source dependency: ${file}`);
  if (!compiledSources.has(file)) {
    const source = readFileSync(path.join(projectRoot, file), "utf8");
    compiledSources.set(file, ts.transpileModule(source, {
      fileName: file,
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.CommonJS,
        esModuleInterop: true,
      },
    }).outputText);
  }
  return compiledSources.get(file);
}

const accepted = () => ({ data: { id: "mock-email-id" }, error: null });
const rejected = () => ({ data: null, error: { message: "Mock provider rejection" } });
const missingId = () => ({ data: {}, error: null });
const thrown = () => { throw new Error("Mock network failure"); };

function requestRecord(overrides = {}) {
  return {
    referenceId: "BES-TEST-1234",
    name: "Test Traveler",
    email: "traveler@example.com",
    phone: "+255700000000",
    selectedRequest: "Test safari",
    travelers: "2",
    tripLength: "7 days",
    tripStyleLabel: "",
    budget: "Not specified",
    travelDate: "Not specified",
    contactPreference: "Email",
    tripPlanSummary: "Not provided",
    tripPlan: [],
    leadStatus: "Quotation in progress",
    quotation: {
      status: "Draft ready",
      subject: "Test quotation",
      body: "Your test itinerary",
      sentAt: "",
    },
    ...overrides,
  };
}

// Execute the real handlers and pure helpers. Side-effect dependencies are
// replaced and all unexpected imports/network calls fail closed.
function harness({ emailResults = [accepted, accepted], saveFailures = 0,
  updateFailure = false, updateMissing = false, record = requestRecord(), authenticated = true,
  environment = {} } = {}) {
  const sentEmails = [];
  const savedRequests = [];
  const updates = [];
  const errors = [];
  let saveAttempts = 0;
  const env = {
    RESEND_API_KEY: "re_mock_only",
    RESEND_FROM_EMAIL: "sender@example.com",
    CONTACT_EMAIL: "business@example.com",
    NEXT_PUBLIC_SITE_URL: "https://example.com",
    ...environment,
  };
  const mocks = {
    "next/server": { NextResponse: { json: (body, init) => Response.json(body, init) } },
    "@/lib/admin-auth": { isAdminRequestAuthenticated: () => authenticated },
    "@/lib/trip-styles": {
      getTripStyleByValue: () => null,
      isTripStyleValue: () => false,
    },
    "@/lib/request-inbox": {
      saveReceivedRequest: async (value) => {
        saveAttempts += 1;
        if (saveAttempts <= saveFailures) throw new Error("Mock storage failure");
        savedRequests.push(structuredClone(value));
        return value;
      },
      findReceivedRequest: async () => record,
      updateReceivedRequest: async (referenceId, value) => {
        updates.push({ referenceId, ...structuredClone(value) });
        if (updateFailure) throw new Error("Mock storage failure");
        if (updateMissing) return null;
        return { ...record, ...value };
      },
    },
    resend: {
      Resend: class {
        constructor() {
          this.emails = { send: async (payload) => {
            const result = emailResults[sentEmails.length];
            sentEmails.push(structuredClone(payload));
            assert.ok(result, "Unexpected additional email submission");
            return result();
          } };
        }
      },
    },
  };
  const context = vm.createContext({
    process: { env },
    console: { error: (...args) => errors.push(args) },
    Error, Request, Response, URL, URLSearchParams,
    fetch: () => { throw new Error("Network access is forbidden in these tests"); },
  });
  const cache = new Map();
  function load(file) {
    if (cache.has(file)) return cache.get(file);
    const loadedModule = { exports: {} };
    cache.set(file, loadedModule.exports);
    const requireMock = (specifier) => {
      if (Object.hasOwn(mocks, specifier)) return mocks[specifier];
      assert.ok(specifier.startsWith("@/"), `Unmocked dependency: ${specifier}`);
      return load(`${specifier.slice(2)}.ts`);
    };
    const execute = vm.runInContext(
      `(function(require, module, exports) {\n${compileSource(file)}\n})`,
      context,
      { filename: file },
    );
    execute(requireMock, loadedModule, loadedModule.exports);
    return loadedModule.exports;
  }
  return { load, sentEmails, savedRequests, updates, errors,
    get saveAttempts() { return saveAttempts; } };
}

function jsonRequest(body) {
  return new Request("https://example.com/api/test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function submitInquiry(state, overrides = {}) {
  const response = await state.load(inquiryRoute).POST(jsonRequest({
    name: "Test Traveler",
    email: "traveler@example.com",
    phone: "+255700000000",
    contactPreference: "Email",
    ...overrides,
  }));
  return { status: response.status, body: await response.json() };
}

async function sendQuotation(state) {
  const response = await state.load(quotationRoute).POST(
    jsonRequest({ subject: "Test quotation", body: "Test itinerary" }),
    { params: Promise.resolve({ referenceId: "BES-TEST-1234" }) },
  );
  return { status: response.status, body: await response.json() };
}

test("email acceptance requires a provider ID and no provider error", () => {
  const { requireEmailAccepted } = harness().load("lib/email-delivery.ts");
  assert.equal(requireEmailAccepted(accepted()), "mock-email-id");
  for (const result of [rejected(), missingId(), { data: null }, {},
    { data: { id: "   " } }, { data: { id: "id" }, error: { message: "Rejected" } }]) {
    assert.throws(() => requireEmailAccepted(result));
  }
});

test("successful enquiry records provider acceptance, not confirmed delivery", async () => {
  const state = harness();
  const { status, body } = await submitInquiry(state);
  assert.equal(status, 200);
  assert.equal(body.success, true);
  assert.ok(body.referenceId);
  assert.equal(body.deliveryWarning, undefined);
  assert.equal(state.sentEmails.length, 2);
  assert.equal(state.savedRequests.length, 1);
  assert.equal(state.savedRequests[0].deliveryStatus, "Email accepted");
  assert.equal(state.savedRequests[0].referenceId, body.referenceId);
});

test("enquiry replies reach the traveler and traveler confirmations reply to the business", async () => {
  const state = harness();
  const { status } = await submitInquiry(state);
  assert.equal(status, 200);
  assert.equal(state.sentEmails.length, 2);
  assert.equal(state.sentEmails[0].to, "business@example.com");
  assert.equal(state.sentEmails[0].replyTo, "traveler@example.com");
  assert.equal(state.sentEmails[1].to, "traveler@example.com");
  assert.equal(state.sentEmails[1].replyTo, "business@example.com");
});

for (const [label, result] of [["provider rejection", rejected],
  ["missing provider ID", missingId], ["thrown send failure", thrown]]) {
  test(`business email ${label} saves the enquiry with a warning`, async () => {
    const state = harness({ emailResults: [result] });
    const { status, body } = await submitInquiry(state);
    assert.equal(status, 200);
    assert.equal(body.success, true);
    assert.match(body.deliveryWarning, /saved/i);
    assert.equal(state.sentEmails.length, 1);
    assert.equal(state.savedRequests.length, 1);
    assert.equal(state.savedRequests[0].deliveryStatus, "Needs attention");
    assert.ok(state.savedRequests[0].deliveryError);
  });

  test(`traveler email ${label} preserves the enquiry and flags partial failure`, async () => {
    const state = harness({ emailResults: [accepted, result] });
    const { status, body } = await submitInquiry(state);
    assert.equal(status, 200);
    assert.equal(body.success, true);
    assert.ok(body.deliveryWarning);
    assert.equal(state.sentEmails.length, 2);
    assert.equal(state.savedRequests.length, 1);
    assert.equal(state.savedRequests[0].deliveryStatus, "Needs attention");
    assert.ok(state.savedRequests[0].deliveryError);
  });

  test(`quotation ${label} returns an error without marking the quotation sent`, async () => {
    const state = harness({ emailResults: [result] });
    const { status, body } = await sendQuotation(state);
    assert.equal(status, 502);
    assert.ok(body.error);
    assert.notEqual(body.sent, true);
    assert.equal(state.updates.length, 0);
    assert.equal(state.sentEmails.length, 1);
  });
}

test("WhatsApp preference sends only the business email", async () => {
  const state = harness({ emailResults: [accepted] });
  const { status, body } = await submitInquiry(state, { contactPreference: "WhatsApp" });
  assert.equal(status, 200);
  assert.equal(body.deliveryWarning, undefined);
  assert.equal(state.sentEmails.length, 1);
  assert.equal(state.savedRequests[0].deliveryStatus, "Awaiting WhatsApp follow-up");
});

for (const key of ["RESEND_API_KEY", "CONTACT_EMAIL"]) {
  test(`missing ${key} still saves an enquiry and reports the warning`, async () => {
    const state = harness({ environment: { [key]: "" } });
    const { status, body } = await submitInquiry(state);
    assert.equal(status, 200);
    assert.equal(body.success, true);
    assert.ok(body.deliveryWarning);
    assert.equal(state.sentEmails.length, 0);
    assert.equal(state.savedRequests.length, 1);
    assert.equal(state.savedRequests[0].deliveryStatus, "Needs attention");
  });

  test(`missing ${key} blocks quotation sending without changing its status`, async () => {
    const state = harness({ environment: { [key]: "" } });
    const { status, body } = await sendQuotation(state);
    assert.equal(status, 500);
    assert.match(body.error, /not configured/i);
    assert.notEqual(body.emailAccepted, true);
    assert.notEqual(body.sent, true);
    assert.equal(state.sentEmails.length, 0);
    assert.equal(state.updates.length, 0);
  });
}

test("a recovered storage write does not misreport successful email as failed", async () => {
  const state = harness({ saveFailures: 1 });
  const { status, body } = await submitInquiry(state);
  assert.equal(status, 200);
  assert.equal(body.success, true);
  assert.equal(body.deliveryWarning, undefined);
  assert.equal(state.saveAttempts, 2);
  assert.equal(state.sentEmails.length, 2);
  assert.equal(state.savedRequests[0].deliveryStatus, "Email accepted");
  assert.equal(state.savedRequests[0].deliveryError, undefined);
});

test("persistent storage failure after email acceptance does not encourage duplicate submissions", async () => {
  const state = harness({ saveFailures: Infinity });
  const { status, body } = await submitInquiry(state);
  assert.equal(status, 503);
  assert.equal(body.success, false);
  assert.equal(body.emailAccepted, true);
  assert.match(body.error, /WhatsApp/i);
  assert.ok(body.error.includes(body.referenceId));
  assert.equal(state.savedRequests.length, 0);
  assert.equal(state.sentEmails.length, 2);
});

test("failure of both email and storage never reports a saved enquiry", async () => {
  const state = harness({ emailResults: [rejected], saveFailures: Infinity });
  const { status, body } = await submitInquiry(state);
  assert.equal(status, 500);
  assert.equal(body.success, false);
  assert.equal(body.deliveryWarning, undefined);
  assert.equal(state.savedRequests.length, 0);
});

test("business acceptance survives traveler email and storage failure in the enquiry response", async () => {
  const state = harness({ emailResults: [accepted, rejected], saveFailures: Infinity });
  const { status, body } = await submitInquiry(state);
  assert.equal(status, 503);
  assert.equal(body.success, false);
  assert.equal(body.emailAccepted, true);
  assert.ok(body.error.includes(body.referenceId));
  assert.match(body.error, /before submitting again/i);
  assert.equal(body.deliveryWarning, undefined);
  assert.equal(state.savedRequests.length, 0);
  assert.equal(state.sentEmails.length, 2);
});

test("quotation acceptance updates the quotation and active pipeline only after send succeeds", async () => {
  const state = harness({ emailResults: [accepted] });
  const { status, body } = await sendQuotation(state);
  assert.equal(status, 200);
  assert.equal(body.sent, true);
  assert.equal(body.emailAccepted, true);
  assert.equal(body.emailId, "mock-email-id");
  assert.equal(state.sentEmails[0].replyTo, "business@example.com");
  assert.equal(state.updates.length, 1);
  assert.equal(state.updates[0].quotation.status, "Sent");
  assert.equal(state.updates[0].leadStatus, "Quotation sent");
  assert.ok(state.updates[0].quotation.sentAt);
});

for (const [label, options] of [["throws", { updateFailure: true }],
  ["returns no request", { updateMissing: true }]]) {
  test(`accepted quotation is not resent when saving its status ${label}`, async () => {
    const record = requestRecord();
    const state = harness({ emailResults: [accepted], record, ...options });
    const { status, body } = await sendQuotation(state);
    assert.equal(status, 503);
    assert.equal(body.emailAccepted, true);
    assert.equal(body.emailId, "mock-email-id");
    assert.match(body.error, /accepted/i);
    assert.match(body.error, /could not be saved/i);
    assert.match(body.error, /do not resend/i);
    assert.notEqual(body.sent, true);
    assert.equal(body.request, undefined);
    assert.equal(state.sentEmails.length, 1);
    assert.equal(state.updates.length, 1);
    assert.equal(record.quotation.status, "Draft ready");
    assert.equal(record.quotation.sentAt, "");
  });
}

test("quotation acceptance preserves a terminal lead status", async () => {
  const state = harness({ emailResults: [accepted], record: requestRecord({ leadStatus: "Won / Confirmed" }) });
  const { status } = await sendQuotation(state);
  assert.equal(status, 200);
  assert.equal(state.updates[0].leadStatus, "Won / Confirmed");
});

test("quotation email respects WhatsApp preference", async () => {
  const state = harness({ record: requestRecord({ contactPreference: "WhatsApp" }) });
  const { status } = await sendQuotation(state);
  assert.equal(status, 400);
  assert.equal(state.sentEmails.length, 0);
  assert.equal(state.updates.length, 0);
});

test("unauthenticated quotation requests cannot send email", async () => {
  const state = harness({ authenticated: false });
  const { status } = await sendQuotation(state);
  assert.equal(status, 401);
  assert.equal(state.sentEmails.length, 0);
  assert.equal(state.updates.length, 0);
});

test("missing enquiry blocks quotation sending", async () => {
  const state = harness({ record: null });
  const { status, body } = await sendQuotation(state);
  assert.equal(status, 404);
  assert.ok(body.error);
  assert.equal(state.sentEmails.length, 0);
  assert.equal(state.updates.length, 0);
});
