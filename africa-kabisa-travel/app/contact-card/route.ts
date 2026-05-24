import { businessConfig } from "@/lib/business";
import { siteConfig } from "@/lib/site";

function escapeVcardValue(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function GET() {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVcardValue(businessConfig.name)}`,
    `ORG:${escapeVcardValue(businessConfig.name)}`,
    "TITLE:Tanzania Trip Planning",
    `TEL;TYPE=CELL,VOICE:${escapeVcardValue(businessConfig.phoneDisplay)}`,
    `URL:${escapeVcardValue(siteConfig.url)}`,
    "ADR;TYPE=WORK:;;;Tanzania;;;",
    `NOTE:${escapeVcardValue(
      "Private Tanzania trip planning for safari, Kilimanjaro, Zanzibar, and combined journeys."
    )}`,
  ];

  if (businessConfig.publicEmail) {
    lines.splice(6, 0, `EMAIL;TYPE=INTERNET:${escapeVcardValue(businessConfig.publicEmail)}`);
  }

  lines.push("END:VCARD");

  return new Response(`${lines.join("\r\n")}\r\n`, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="brilliant-explore-safaris-contact.vcf"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
