
"use client";

import { FadeIn } from "@/components/animations/fade-in";

const features = [
  {
    title: "Gemini Powered",
    description:
      "Get intelligent, helpful responses powered by Google's Gemini models.",
  },
  {
    title: "Fast Conversations",
    description:
      "Designed for smooth interactions with a focused and responsive chat experience.",
  },
  {
    title: "Conversation History",
    description:
      "Keep your conversations organized and return to them whenever you need.",
  },
  {
    title: "Secure by Design",
    description:
      "Authentication and server-side AI requests keep sensitive credentials protected.",
  },
  {
    title: "Responsive Experience",
    description:
      "A clean interface that works across desktop, tablet, and mobile devices.",
  },
  {
    title: "Built for Growth",
    description:
      "A modular architecture designed to support new AI and productivity features.",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="scroll-mt-24 px-6 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
              Why use it
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Everything you need for better AI conversations.
            </h2>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              A modern foundation for asking questions, exploring ideas, and
              getting things done with AI.
            </p>
          </div>
        </FadeIn>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FadeIn key={feature.title} delay={index * 0.08}>
              <article className="h-full rounded-2xl border border-white/70 bg-white/65 p-7 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/80 hover:shadow-lg">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-600">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <h3 className="text-xl font-semibold text-slate-950">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {feature.description}
                </p>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}