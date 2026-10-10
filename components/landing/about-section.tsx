
"use client";

import { FadeIn } from "@/components/animations/fade-in";

export function AboutSection() {
  return (
    <section id="about" className="px-6 py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
        <FadeIn>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
              About GeminiChat
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Built to make AI conversations simple and useful.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              GeminiChat is a modern AI conversation platform designed around
              a clean interface, secure server-side AI requests, and an
              organized conversation experience.
            </p>

            <p className="mt-4 leading-7 text-slate-600">
              The project combines Next.js, TypeScript, Tailwind CSS,
              authentication, database persistence, and Google&apos;s Gemini API
              into a scalable application architecture.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="rounded-3xl border border-white/70 bg-white/65 p-8 shadow-sm backdrop-blur-sm">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-3xl font-bold text-indigo-600">AI</p>
                <p className="mt-2 font-semibold text-slate-950">
                  Gemini Powered
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Intelligent responses through Google&apos;s Gemini models.
                </p>
              </div>

              <div>
                <p className="text-3xl font-bold text-indigo-600">24/7</p>
                <p className="mt-2 font-semibold text-slate-950">
                  Conversations
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Keep your conversations organized and accessible.
                </p>
              </div>

              <div>
                <p className="text-3xl font-bold text-indigo-600">100%</p>
                <p className="mt-2 font-semibold text-slate-950">
                  Responsive
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Designed to work across desktop, tablet, and mobile.
                </p>
              </div>

              <div>
                <p className="text-3xl font-bold text-indigo-600">Secure</p>
                <p className="mt-2 font-semibold text-slate-950">
                  Server-side AI
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Sensitive API credentials stay on the server.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
