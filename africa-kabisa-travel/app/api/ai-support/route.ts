import { NextResponse } from "next/server";
import {
  AI_SUPPORT_MODEL,
  buildAISupportInstructions,
  getGuideSupportContext,
  type AISupportMessage,
} from "@/lib/ai-support";

type AISupportRequestBody = {
  guideSlug?: string;
  messages?: AISupportMessage[];
};

const MAX_MESSAGES = 10;
const MAX_MESSAGE_LENGTH = 2000;

function sanitizeMessages(messages: AISupportMessage[] | undefined) {
  return (messages ?? [])
    .filter(
      (message): message is AISupportMessage =>
        Boolean(message) &&
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string"
    )
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, MAX_MESSAGE_LENGTH),
    }))
    .filter((message) => message.content.length > 0)
    .slice(-MAX_MESSAGES);
}

function extractOutputText(responsePayload: Record<string, unknown>) {
  if (typeof responsePayload.output_text === "string") {
    return responsePayload.output_text.trim();
  }

  const output = Array.isArray(responsePayload.output)
    ? responsePayload.output
    : [];

  const textParts: string[] = [];

  for (const item of output) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const content = Array.isArray((item as { content?: unknown[] }).content)
      ? (item as { content: unknown[] }).content
      : [];

    for (const block of content) {
      if (
        block &&
        typeof block === "object" &&
        (block as { type?: string }).type === "output_text" &&
        typeof (block as { text?: string }).text === "string"
      ) {
        textParts.push((block as { text: string }).text);
      }
    }
  }

  return textParts.join("\n").trim();
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "AI support is not configured yet. Please add OPENAI_API_KEY on the server.",
      },
      { status: 503 }
    );
  }

  let body: AISupportRequestBody;

  try {
    body = (await request.json()) as AISupportRequestBody;
  } catch {
    return NextResponse.json(
      { error: "We could not read the AI support request." },
      { status: 400 }
    );
  }

  const messages = sanitizeMessages(body.messages);

  if (!messages.some((message) => message.role === "user")) {
    return NextResponse.json(
      { error: "Please send a question before asking for AI help." },
      { status: 400 }
    );
  }

  const { guide, relatedJourney } = getGuideSupportContext(body.guideSlug);
  const activeGuide = guide ?? null;
  const instructions = buildAISupportInstructions(
    activeGuide,
    relatedJourney?.title
  );

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: AI_SUPPORT_MODEL,
        instructions,
        input: messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
        text: {
          format: {
            type: "text",
          },
        },
        max_output_tokens: 600,
      }),
    });

    const payload = (await response.json().catch(() => null)) as
      | Record<string, unknown>
      | null;

    if (!response.ok) {
      const apiError =
        payload &&
        typeof payload === "object" &&
        payload.error &&
        typeof payload.error === "object" &&
        typeof (payload.error as { message?: string }).message === "string"
          ? (payload.error as { message: string }).message
          : "The AI support service could not reply right now.";

      return NextResponse.json({ error: apiError }, { status: response.status });
    }

    const answer = payload ? extractOutputText(payload) : "";

    if (!answer) {
      return NextResponse.json(
        {
          error:
            "The AI support service did not return a usable answer. Please try again.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ answer });
  } catch {
    return NextResponse.json(
      {
        error:
          "We could not reach the AI support service right now. Please try again shortly.",
      },
      { status: 502 }
    );
  }
}
