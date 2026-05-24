import { getBusinessSchema } from "@/lib/business";

export default function BusinessJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getBusinessSchema()),
      }}
    />
  );
}
