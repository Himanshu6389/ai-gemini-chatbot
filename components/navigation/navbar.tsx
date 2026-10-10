"use client";

import Link from "next/link";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { FadeIn } from "@/components/animations/fade-in";

export function Navbar() {
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <FadeIn>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/60 bg-[#faf7f0]/75 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-slate-950"
          >
            Gemini<span className="text-indigo-600">Chat</span>
          </Link>

          <nav className="flex items-center gap-5 sm:gap-8">
            <button
              type="button"
              onClick={() => scrollToSection("features")}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
            >
              Features
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("about")}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
            >
              About
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="hidden rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 sm:block"
                >
                  Sign in
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700 hover:shadow-md"
                >
                  Get started
                </button>
              </SignUpButton>
            </Show>

            <Show when="signed-in">
              <Link
                href="/chat"
                className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 sm:block"
              >
                Open chat
              </Link>

              <UserButton />
            </Show>
          </div>
        </div>
      </header>
    </FadeIn>
  );
}
