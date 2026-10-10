
"use client";

import { AnimatedBackground } from "@/components/animations/animated-background";
import { FadeIn } from "@/components/animations/fade-in";

export function HeroSection() {
  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-24">
      <AnimatedBackground />

      <div className="mx-auto w-full max-w-4xl text-center">
        <FadeIn>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
            AI-Powered Conversations
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Your intelligent
            <span className="block text-indigo-600">
              AI conversation partner.
            </span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Ask questions, explore ideas, and get helpful answers powered by
            Google Gemini.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/chat"
              className="rounded-full bg-indigo-600 px-7 py-3.5 font-semibold text-white transition-transform hover:scale-105"
            >
              Start chatting
            </a>

            <button
              type="button"
              onClick={scrollToFeatures}
              className="rounded-full border border-slate-300 bg-white px-7 py-3.5 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Explore features
            </button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}