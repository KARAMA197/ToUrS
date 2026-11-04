"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle2,
  Expand,
  MapPinned,
  MessageCircle,
  Pause,
  Play,
  X,
} from "lucide-react";
import {
  buildTravelMomentPlanHref,
  travelMoments,
} from "@/lib/travel-moments";

export default function TravelMomentsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const activeMoment = travelMoments[activeIndex];
  const viewerMoment =
    viewerIndex === null ? null : travelMoments[viewerIndex];

  useEffect(() => {
    if (paused) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % travelMoments.length);
    }, 5200);

    return () => window.clearInterval(interval);
  }, [paused]);

  useEffect(() => {
    if (viewerIndex === null) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setViewerIndex(null);
      }

      if (event.key === "ArrowLeft") {
        setViewerIndex(
          (currentIndex) =>
            ((currentIndex ?? 0) - 1 + travelMoments.length) %
            travelMoments.length
        );
      }

      if (event.key === "ArrowRight") {
        setViewerIndex(
          (currentIndex) => ((currentIndex ?? 0) + 1) % travelMoments.length
        );
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [viewerIndex]);

  const showPreviousMoment = () => {
    setActiveIndex(
      (currentIndex) =>
        (currentIndex - 1 + travelMoments.length) % travelMoments.length
    );
  };

  const showNextMoment = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % travelMoments.length);
  };

  const showPreviousViewerMoment = () => {
    setViewerIndex(
      (currentIndex) =>
        ((currentIndex ?? activeIndex) - 1 + travelMoments.length) %
        travelMoments.length
    );
  };

  const showNextViewerMoment = () => {
    setViewerIndex(
      (currentIndex) => ((currentIndex ?? activeIndex) + 1) % travelMoments.length
    );
  };

  return (
    <section className="px-5 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 sm:gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Travel moments
            </p>
            <h2 className="font-display mt-3 max-w-3xl text-3xl text-[var(--forest)] sm:text-5xl">
              The trip should feel memorable before it ever feels complicated.
            </h2>
          </div>

          <div className="max-w-2xl lg:justify-self-end">
            <p className="text-base leading-8 text-[color:rgba(19,32,24,0.72)]">
              These are the moments we plan around: wildlife at the right hour, mountain days with
              a steady rhythm, Zanzibar time that actually feels restful, and local stops that give
              the journey more meaning.
            </p>
          </div>
        </div>

        <div
          className="mt-8 overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--forest)] shadow-[0_34px_100px_-54px_rgba(8,18,15,0.68)] sm:mt-12 sm:rounded-[34px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="relative min-h-[38rem] overflow-hidden sm:min-h-[34rem] lg:min-h-[42rem]">
            <button
              type="button"
              onClick={() => {
                setViewerIndex(activeIndex);
                setPaused(true);
              }}
              className="absolute inset-0 z-10 cursor-zoom-in"
              aria-label={`View ${activeMoment.title} image larger`}
            />

            {travelMoments.map((moment, index) => (
              <div
                key={moment.title}
                aria-hidden={index !== activeIndex}
                className={`absolute inset-0 transition duration-700 ${
                  index === activeIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={moment.image}
                  alt={moment.alt}
                  fill
                  priority={index === 0}
                  sizes="(min-width: 1024px) 1180px, 100vw"
                  className="object-cover"
                />
              </div>
            ))}

            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(8,18,15,0.92),rgba(8,18,15,0.62)_42%,rgba(8,18,15,0.2)),linear-gradient(180deg,rgba(8,18,15,0.04),rgba(8,18,15,0.84))]" />

            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-4 p-5 sm:p-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-black/24 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
                <Camera size={14} />
                Moment {activeIndex + 1} of {travelMoments.length}
              </span>

              <button
                type="button"
                onClick={() => setPaused((currentPaused) => !currentPaused)}
                className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/16 bg-white/12 text-white backdrop-blur transition hover:bg-white/20"
                aria-label={paused ? "Play travel moments slideshow" : "Pause travel moments slideshow"}
              >
                {paused ? <Play size={17} /> : <Pause size={17} />}
              </button>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 grid gap-5 p-4 text-white sm:gap-8 sm:p-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-end">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold-soft)] backdrop-blur">
                  <MapPinned size={14} />
                  {activeMoment.location}
                </div>
                <h3 className="font-display mt-4 text-3xl leading-none sm:mt-5 sm:text-5xl lg:text-6xl">
                  {activeMoment.title}
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/76 sm:mt-5 sm:text-base sm:leading-8">
                  {activeMoment.description}
                </p>
                <div className="mt-4 grid max-w-2xl gap-2 sm:mt-5 sm:grid-cols-2 sm:gap-3">
                  <div className="rounded-[20px] border border-white/12 bg-white/10 p-4 backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold-soft)]">
                      Best for
                    </p>
                    <p className="mt-2 text-sm leading-7 text-white/76">
                      {activeMoment.bestFor}
                    </p>
                  </div>
                  <div className="rounded-[20px] border border-white/12 bg-white/10 p-4 backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold-soft)]">
                      Route fit
                    </p>
                    <p className="mt-2 text-sm leading-7 text-white/76">
                      {activeMoment.routeFit}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setViewerIndex(activeIndex);
                    setPaused(true);
                  }}
                  className="pointer-events-auto mt-5 inline-flex items-center gap-3 rounded-full border border-white/16 bg-white/12 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                >
                  <Expand size={17} />
                  View image
                </button>
              </div>

              <div className="pointer-events-auto lg:justify-self-end">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={showPreviousMoment}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/16 bg-white/12 text-white backdrop-blur transition hover:bg-white/20"
                    aria-label="Show previous travel moment"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={showNextMoment}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/16 bg-white/12 text-white backdrop-blur transition hover:bg-white/20"
                    aria-label="Show next travel moment"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>

                <div className="mt-4 grid gap-2 sm:mt-5 sm:grid-cols-2 lg:w-[30rem]">
                  {travelMoments.map((moment, index) => (
                    <button
                      key={moment.title}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`rounded-[18px] border p-3 text-left backdrop-blur transition sm:rounded-[22px] sm:p-4 ${
                        index === activeIndex
                          ? "border-[var(--gold-soft)] bg-white/18 text-white"
                          : "border-white/12 bg-white/8 text-white/68 hover:bg-white/12 hover:text-white"
                      }`}
                      aria-current={index === activeIndex}
                    >
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold-soft)]">
                        0{index + 1}
                      </span>
                      <span className="mt-2 block text-sm font-semibold">
                        {moment.title}
                      </span>
                      <span className="mt-2 block text-xs leading-5 text-white/62">
                        {moment.routeFit}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-4 sm:gap-4">
          {travelMoments.map((moment, index) => (
            <button
              key={moment.title}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative h-24 overflow-hidden rounded-[20px] border text-left shadow-[0_18px_46px_-34px_rgba(8,18,15,0.42)] transition sm:h-28 sm:rounded-[22px] ${
                index === activeIndex
                  ? "border-[var(--gold)]"
                  : "border-[rgba(16,37,28,0.12)] hover:border-[var(--gold)]"
              }`}
              aria-label={`Show ${moment.title}`}
            >
              <Image
                src={moment.image}
                alt={moment.alt}
                fill
                sizes="(min-width: 640px) 25vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,18,15,0.08),rgba(8,18,15,0.72))]" />
              <span className="absolute inset-x-0 bottom-0 px-4 py-3 text-sm font-semibold text-white">
                {moment.title}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-[28px] border border-[var(--border)] bg-[rgba(255,250,243,0.9)] p-5 shadow-[0_24px_70px_-50px_rgba(8,18,15,0.42)] backdrop-blur sm:rounded-[34px] sm:p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                Build your version
              </p>
              <h3 className="font-display mt-3 text-2xl text-[var(--forest)] sm:text-3xl">
                Add the feeling you want. We will turn it into a route that makes sense.
              </h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  "Choose one or more moments",
                  "Add a route or travel style",
                  "Get a first plan built around it",
                ].map((step) => (
                  <div key={step} className="flex items-start gap-3 rounded-[20px] bg-white p-4">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-[var(--gold)]" size={18} />
                    <p className="text-sm leading-6 text-[var(--forest)]">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={buildTravelMomentPlanHref(activeMoment)}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[var(--forest)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--gold)] hover:text-[var(--forest)]"
              >
                <MessageCircle size={17} />
                Add this moment to my trip
              </Link>
              <Link
                href="/journeys"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-[rgba(16,37,28,0.14)] bg-white px-6 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
              >
                Browse journeys
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {viewerMoment && (
        <div
          className="fixed inset-0 z-[100] bg-[rgba(8,18,15,0.94)] px-4 py-5 text-white backdrop-blur-md sm:px-6"
          role="dialog"
          aria-modal="true"
          aria-label={`${viewerMoment.title} image viewer`}
        >
          <button
            type="button"
            className="absolute inset-0 cursor-zoom-out"
            onClick={() => setViewerIndex(null)}
            aria-label="Close image viewer"
          />

          <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold-soft)]">
                  Moment {(viewerIndex ?? 0) + 1} of {travelMoments.length}
                </p>
                <h3 className="font-display mt-2 text-2xl sm:text-3xl">
                  {viewerMoment.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setViewerIndex(null)}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/16 bg-white/12 text-white transition hover:bg-white/20"
                aria-label="Close image viewer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative min-h-0 flex-1 overflow-hidden rounded-[28px] border border-white/12 bg-black">
              <Image
                src={viewerMoment.image}
                alt={viewerMoment.alt}
                fill
                sizes="100vw"
                className="object-contain"
              />

              <button
                type="button"
                onClick={showPreviousViewerMoment}
                className="absolute left-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/16 bg-black/36 text-white backdrop-blur transition hover:bg-black/52"
                aria-label="View previous image"
              >
                <ArrowLeft size={19} />
              </button>
              <button
                type="button"
                onClick={showNextViewerMoment}
                className="absolute right-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/16 bg-black/36 text-white backdrop-blur transition hover:bg-black/52"
                aria-label="View next image"
              >
                <ArrowRight size={19} />
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-4 rounded-[24px] border border-white/10 bg-white/8 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold-soft)]">
                  <MapPinned size={14} />
                  {viewerMoment.location}
                </p>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-white/76">
                  {viewerMoment.description}
                </p>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-white/76">
                  <span className="font-semibold text-[var(--gold-soft)]">Best for:</span>{" "}
                  {viewerMoment.bestFor}
                </p>
                <p className="mt-1 max-w-3xl text-sm leading-7 text-white/76">
                  <span className="font-semibold text-[var(--gold-soft)]">Route fit:</span>{" "}
                  {viewerMoment.routeFit}
                </p>
              </div>

              <Link
                href={buildTravelMomentPlanHref(viewerMoment)}
                className="inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-[var(--gold)] px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:brightness-105"
              >
                Plan this feeling
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
