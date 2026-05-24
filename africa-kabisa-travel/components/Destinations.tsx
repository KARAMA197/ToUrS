import Image from "next/image";
import Link from "next/link";
import { Building2, Mountain, Trees } from "lucide-react";
import { destinations } from "@/destinations-data";

const featuredDestinations = destinations.slice(0, 3);
const extendedDestinations = destinations.slice(3);

const routeIdeas = [
  "Northern safari circuit",
  "Kilimanjaro plus recovery",
  "Safari and Zanzibar",
  "Southern Tanzania safari",
  "Family-friendly safari flow",
  "Honeymoon safari and beach",
];

function getDestinationIcon(category: string) {
  if (category === "Mountain") {
    return Mountain;
  }

  if (category === "Culture" || category === "Coast") {
    return Building2;
  }

  return Trees;
}

export default function Destinations() {
  return (
    <section id="destinations" className="scroll-mt-24 bg-[#0b1814] px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
              Places to visit
            </p>
            <h2 className="font-display mt-3 text-4xl sm:text-5xl">
              Tanzania gives you more than one kind of journey.
            </h2>
          </div>
          <div className="max-w-2xl lg:justify-self-end">
            <p className="text-base leading-8 text-white/70">
              Some travelers want classic safari. Others want mountain, beach, quieter southern
              parks, or a mix that feels balanced from start to finish. These are some of the
              places worth considering as you shape the route.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Link
            href={`/destinations/${featuredDestinations[0].slug}`}
            className="group relative min-h-[460px] overflow-hidden rounded-[36px] border border-white/10"
          >
            <Image
              src={featuredDestinations[0].image}
              alt={featuredDestinations[0].title}
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/80" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
                {featuredDestinations[0].accent}
              </p>
              <h3 className="font-display mt-3 text-4xl">{featuredDestinations[0].title}</h3>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/74">
                {featuredDestinations[0].summary}
              </p>
              <p className="mt-4 text-sm font-semibold text-white transition group-hover:text-[var(--gold-soft)]">
                Explore this place
              </p>
            </div>
          </Link>

          <div className="grid gap-6">
            {featuredDestinations.slice(1).map((destination) => (
              <Link
                key={destination.slug}
                href={`/destinations/${destination.slug}`}
                className="group relative min-h-[217px] overflow-hidden rounded-[32px] border border-white/10"
              >
                <Image
                  src={destination.image}
                  alt={destination.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/12 via-black/20 to-black/78" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
                    {destination.accent}
                  </p>
                  <h3 className="font-display mt-3 text-3xl">{destination.title}</h3>
                  <p className="mt-3 max-w-md text-sm leading-7 text-white/74">
                    {destination.summary}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {extendedDestinations.map((destination) => {
              const Icon = getDestinationIcon(destination.category);

              return (
                <Link
                  key={destination.slug}
                  href={`/destinations/${destination.slug}`}
                  className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] p-5 transition hover:border-white/24 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.06))]"
                >
                  <div className="mb-4 inline-flex rounded-full bg-white/10 p-3 text-[var(--gold-soft)]">
                    <Icon size={18} />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold-soft)]">
                    {destination.category}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-white">{destination.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/72">
                    {destination.summary}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-6 rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
                Route ideas these places can shape
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {routeIdeas.map((routeIdea) => (
                  <span
                    key={routeIdea}
                    className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/78"
                  >
                    {routeIdea}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-sm leading-7 text-white/70">
                If you are unsure which places belong together, we can help you compare the route
                flow and choose the combination that feels right for your time, pace, and budget.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/destinations"
                className="inline-flex items-center justify-center rounded-full border border-white/14 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/8"
              >
                Explore all destinations
              </Link>
              <Link
                href="/custom-itinerary"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--forest)] transition hover:bg-[var(--gold-soft)]"
              >
                Create my route
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
