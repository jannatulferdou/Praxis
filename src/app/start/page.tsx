"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function StartPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!userId);
  }, []);

  const handleStartRecording = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/login");
      return;
    }
    router.push("/record");
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userPhone");
    setIsLoggedIn(false);
  };

  const howItWorks = [
    {
      step: "01",
      title: "Capture your story",
      summary: "Use any connected device to speak naturally about one recent project, gig, or shift.",
      detail: "Praxis coaches you with Bangla and English prompts so you can highlight context, your role, and the measurable change you delivered in under 30 seconds."
    },
    {
      step: "02",
      title: "AI builds a skill graph",
      summary: "Our multi-model pipeline converts your spoken narrative into structured capabilities.",
      detail: "Temporal cues, action verbs, and industry vocabulary are matched against 1,200+ competency rubrics so employers see evidence, not buzzwords."
    },
    {
      step: "03",
      title: "Proof lives in your wallet",
      summary: "Each claim is stamped with confidence scores, source audio, and reviewer notes.",
      detail: "You can reuse the same verified clip when applying to training programs, apprenticeships, or government recognition schemes."
    },
    {
      step: "04",
      title: "Match with opportunities",
      summary: "Praxis compares your profile with live projects from inclusive employers.",
      detail: "Hiring teams receive a concise dossier that links your video moment with recommended interview questions, helping them move straight to offers."
    }
  ];

  const personaHighlights = [
    {
      title: "Skilled workers & freelancers",
      intro: "Electricians, garments technicians, drivers, salon artists, and on-demand platform earners use Praxis to document tacit skills that don&rsquo;t show up on paper CVs.",
      bullets: [
        "Translate day-to-day problem solving into the language recruiters understand.",
        "Attach contextual assets such as workshop photos, safety certifications, or supervisor shout-outs.",
        "Build credibility even if you are re-entering the workforce or switching sectors."
      ]
    },
    {
      title: "Hiring teams & NGOs",
      intro: "Impact investors, BPO operators, and community organizations rely on Praxis to surface trustworthy talent pipelines in days, not months.",
      bullets: [
        "View transparent evidence trails instead of generic CV templates.",
        "Filter by verified competency clusters, location readiness, and language comfort.",
        "Co-brand assessment journeys so your trainees graduate with portable proof."
      ]
    }
  ];

  const successStories = [
    {
      quote: "Praxis helped me move from informal tailoring gigs to a full-time quality inspection role because the recruiter saw my problem-solving clip.",
      person: "Afsana • Readymade Garments Technician",
      meta: "Chattogram Export Processing Zone"
    },
    {
      quote: "I recorded once at a community center and reused the link to win three freelance solar-installation contracts.",
      person: "Kabir • Solar Technician & Field Trainer",
      meta: "Khulna & Jashore"
    },
    {
      quote: "Our NGO cohort shared Praxis wallets with city employers and achieved a 64% placement rate without extra paperwork.",
      person: "Farzana • Workforce Program Lead",
      meta: "Dhaka Urban Lab"
    }
  ];

  const faqs = [
    {
      question: "Do I need perfect English to use Praxis?",
      answer: "No. Speak in Bangla, English, or a mix—Praxis transcribes code-switching, captures tonal emphasis, and mirrors your original words so reviewers understand the nuance."
    },
    {
      question: "What happens to my video after verification?",
      answer: "Videos stay in your encrypted locker. You decide who receives a viewing link, and every share includes an expiry timer plus watermarking to prevent misuse."
    },
    {
      question: "Is Praxis a traditional CV builder?",
      answer: "Praxis is evidence-first. Instead of rewriting your CV, we pair short media clips with structured competency statements that plug directly into employer applicant tracking systems."
    },
    {
      question: "Can teams integrate Praxis data into their dashboards?",
      answer: "Yes. Hiring partners can sync verified skills into ATS or HRIS tools through our REST API, receive webhook alerts, and export audit logs for compliance reviews."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7F9F4] dark:bg-gray-900 overflow-hidden relative transition-colors">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#A3B18A]/10 dark:bg-[#3A7D44]/10 rounded-full blur-3xl animate-pulse" style={{ animation: "float 6s ease-in-out infinite" }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#3A7D44]/5 dark:bg-[#A3B18A]/5 rounded-full blur-3xl animate-pulse" style={{ animation: "float 8s ease-in-out infinite 1s" }} />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-[#A3B18A]/5 dark:bg-[#3A7D44]/5 rounded-full blur-3xl animate-pulse" style={{ animation: "float 7s ease-in-out infinite 2s" }} />
      </div>

      {/* Grid background pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]" style={{
        backgroundImage: "linear-gradient(0deg, transparent 24%, rgba(58, 125, 68, 0.05) 25%, rgba(58, 125, 68, 0.05) 26%, transparent 27%, transparent 74%, rgba(58, 125, 68, 0.05) 75%, rgba(58, 125, 68, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(58, 125, 68, 0.05) 25%, rgba(58, 125, 68, 0.05) 26%, transparent 27%, transparent 74%, rgba(58, 125, 68, 0.05) 75%, rgba(58, 125, 68, 0.05) 76%, transparent 77%, transparent)",
        backgroundSize: "50px 50px"
      }} />

      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#F7F9F4]/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-[#A3B18A]/30 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Icon name="business-svgrepo-com" size={32} color="#3A7D44" />
            <h2 className="text-2xl font-bold text-[#344E41] dark:text-[#A3B18A]">Praxis</h2>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isLoggedIn ? (
              <>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/50 text-red-700 rounded-lg font-semibold text-sm transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push("/login")}
                  className="px-4 py-2 text-[#3A7D44] hover:text-[#2D5F34] font-semibold text-sm transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push("/signup")}
                  className="px-4 py-2 bg-gradient-to-r from-[#3A7D44] to-[#2D5F34] hover:from-[#2D5F34] hover:to-[#25492A] text-[#F7F9F4] rounded-lg font-semibold text-sm transition-all"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative flex items-center justify-center min-h-screen px-4 py-4 pt-28">
        <div className="w-full max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Section - Text */}
            <div className="space-y-5 pt-2">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#A3B18A]/20 dark:bg-[#3A7D44]/20 border border-[#A3B18A]/50 dark:border-[#3A7D44]/50 rounded-full backdrop-blur-sm mb-1">
                <span className="w-2 h-2 bg-[#3A7D44] dark:bg-[#A3B18A] rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-[#3A7D44] dark:text-[#A3B18A]">AI-Powered Verification</span>
              </div>

              {/* Headline */}
              <div>
                <h1 className="text-5xl lg:text-6xl font-black text-[#344E41] dark:text-gray-100 leading-tight mb-2 tracking-tight">
                  Show Your
                  <br />
                  <span className="bg-gradient-to-r from-[#3A7D44] to-[#A3B18A] bg-clip-text text-transparent animate-pulse">
                    True Potential
                  </span>
                </h1>
                <p className="text-base lg:text-lg text-[#344E41]/8000 dark:text-gray-300 leading-relaxed max-w-md">
                  Record a 30-second skills story, receive AI-grade verification, and connect directly with inclusive employers across Bangladesh.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleStartRecording}
                  className="group w-full bg-gradient-to-r from-[#3A7D44] to-[#2D5F34] hover:from-[#2D5F34] hover:to-[#25492A] text-[#F7F9F4] font-bold py-2 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 relative overflow-hidden text-sm"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Icon name="earth-svgrepo-com" size={20} color="white" />
                  <span className="relative">Upload</span>
                </button>

              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#A3B18A]00/50">
                {[
                  { label: "Skills", value: "AI-Verified", icon: "check-circle-svgrepo-com", color: "#10B981" },
                  { label: "Time", value: "30 Seconds", icon: "accelerate-svgrepo-com", color: "#F59E0B" },
                  { label: "Jobs", value: "Instant Match", icon: "trending-up-svgrepo-com", color: "#8B5CF6" }
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="text-center p-4 rounded-2xl aspect-square flex flex-col items-center justify-center gap-1 bg-white/40 dark:bg-gray-800/40 border border-[#A3B18A]/40 dark:border-gray-700 hover:-translate-y-0.5 hover:border-[#3A7D44]/60 transition"
                  >
                    <Icon name={stat.icon} size={22} color={stat.color} className="mb-1" />
                    <p className="text-base font-semibold text-[#344E41] dark:text-gray-100">{stat.value}</p>
                    <p className="text-[11px] uppercase tracking-wide text-[#344E41]/6000 dark:text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Section - Visual */}
            <div className="flex items-center justify-center relative py-8 lg:py-0">
              {/* Ambient glow backdrop */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#3A7D44]/20 via-[#A3B18A]/10 to-emerald-400/10 rounded-3xl blur-3xl animate-pulse" />

              <div className="relative flex items-center justify-center w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">

                {/* Outermost slow-spin dashed ring */}
                <div className="absolute inset-0 rounded-full border border-dashed border-[#3A7D44]/20 animate-[spin_20s_linear_infinite]" />

                {/* Outer orbit ring with dots */}
                <div className="absolute inset-4 rounded-full border border-[#A3B18A]/30 animate-[spin_14s_linear_infinite_reverse]">
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#3A7D44] shadow-[0_0_10px_#3A7D44] animate-pulse" />
                  <span className="absolute top-1/2 -right-2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#A3B18A] shadow-[0_0_8px_#A3B18A] animate-pulse" style={{ animationDelay: "0.5s" }} />
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" style={{ animationDelay: "1s" }} />
                </div>

                {/* Middle orbit ring */}
                <div className="absolute inset-10 rounded-full border border-[#3A7D44]/25 animate-[spin_9s_linear_infinite]">
                  <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#EC4899] shadow-[0_0_10px_#EC4899]" />
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#F59E0B] shadow-[0_0_8px_#F59E0B]" />
                </div>

                {/* Gradient conic spinning arc */}
                <div
                  className="absolute inset-16 rounded-full animate-[spin_5s_linear_infinite]"
                  style={{
                    background: "conic-gradient(from 0deg, transparent 70%, #3A7D44 100%)",
                    mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))",
                    WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))",
                  }}
                />

                {/* Inner pulsing glow */}
                <div className="absolute inset-20 rounded-full bg-gradient-to-br from-[#3A7D44]/20 to-[#A3B18A]/10 blur-md animate-pulse" />

                {/* Card holding the icon */}
                <div className="relative z-10 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 sm:p-8 lg:p-10 border border-[#A3B18A]/50 dark:border-gray-700 shadow-2xl animate-[float_6s_ease-in-out_infinite]">
                  {/* Rotating gradient border glow behind card */}
                  <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#3A7D44] via-[#A3B18A] to-emerald-400 opacity-50 blur-sm animate-[spin_6s_linear_infinite]" style={{ zIndex: -1 }} />

                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 animate-[svgBob_4s_ease-in-out_infinite]">
                    <Icon name="creativity-svgrepo-com" size={160} color="#EC4899" className="w-full h-full drop-shadow-lg" />
                    <div className="absolute inset-0 rounded-full bg-[#EC4899]/10 blur-xl animate-pulse" />
                  </div>
                </div>

                {/* Floating spark particles */}
                {[
                  { top: "8%",  left: "18%", delay: "0s",   size: "w-2 h-2",     color: "bg-[#3A7D44]"  },
                  { top: "15%", left: "75%", delay: "0.8s", size: "w-1.5 h-1.5", color: "bg-[#A3B18A]"  },
                  { top: "70%", left: "10%", delay: "1.4s", size: "w-2 h-2",     color: "bg-emerald-400" },
                  { top: "80%", left: "78%", delay: "0.4s", size: "w-1.5 h-1.5", color: "bg-[#EC4899]"  },
                  { top: "50%", left: "5%",  delay: "2s",   size: "w-1 h-1",     color: "bg-[#F59E0B]"  },
                  { top: "30%", left: "88%", delay: "1s",   size: "w-1.5 h-1.5", color: "bg-sky-400"    },
                ].map((p, i) => (
                  <span
                    key={i}
                    className={`absolute ${p.size} rounded-full ${p.color} opacity-80 animate-[sparkle_3s_ease-in-out_infinite]`}
                    style={{ top: p.top, left: p.left, animationDelay: p.delay }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Narrative Content Sections */}
          <div className="mt-16 space-y-16">
            {/* How It Works */}
            <section>
              <div className="max-w-2xl mb-8">
                <p className="uppercase tracking-[0.2em] text-xs text-[#3A7D44] dark:text-[#A3B18A] font-semibold">Journey</p>
                <h2 className="text-3xl font-extrabold text-[#344E41] dark:text-gray-100 mt-2">How Praxis Works from hello to hired</h2>
                <p className="text-sm text-[#344E41]/7000 dark:text-gray-300 mt-3">
                  The Praxis flow was co-designed with trade workers, training institutes, and recruiters across Dhaka, Khulna, and Chattogram.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {howItWorks.map((item) => (
                  <div key={item.step} className="p-5 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-[#A3B18A]/40 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow">
                    <p className="text-xs font-semibold tracking-[0.3em] text-[#A3B18A] dark:text-[#3A7D44]">STEP {item.step}</p>
                    <h3 className="text-xl font-bold text-[#344E41] dark:text-gray-100 mt-2">{item.title}</h3>
                    <p className="text-sm text-[#344E41]/8000 dark:text-gray-300 mt-3">{item.summary}</p>
                    <p className="text-sm text-[#344E41]/7000 dark:text-gray-400 mt-2 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Personas */}
            <section>
              <div className="max-w-2xl mb-8">
                <p className="uppercase tracking-[0.2em] text-xs text-[#3A7D44] dark:text-[#A3B18A] font-semibold">Who it empowers</p>
                <h2 className="text-3xl font-extrabold text-[#344E41] dark:text-gray-100 mt-2">Built for people proving their craft and teams seeking evidence</h2>
                <p className="text-sm text-[#344E41]/7000 dark:text-gray-300 mt-3">
                  Workers document tacit knowledge that rarely fits standard CV templates, while employers see the context behind every achievement before the first interview.
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {personaHighlights.map((persona) => (
                  <div key={persona.title} className="p-6 rounded-2xl bg-[#F7F9F4] dark:bg-gray-800/70 border border-[#A3B18A]/40 dark:border-gray-700">
                    <h3 className="text-2xl font-semibold text-[#344E41] dark:text-gray-100">{persona.title}</h3>
                    <p className="text-sm text-[#344E41]/8000 dark:text-gray-300 mt-3 leading-relaxed">{persona.intro}</p>
                    <ul className="mt-4 space-y-2">
                      {persona.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-2 text-sm text-[#344E41]/7000 dark:text-gray-400">
                          <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-[#3A7D44] dark:bg-[#A3B18A]" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Success Stories */}
            <section>
              <div className="max-w-2xl mb-8">
                <p className="uppercase tracking-[0.2em] text-xs text-[#3A7D44] dark:text-[#A3B18A] font-semibold">Field notes</p>
                <h2 className="text-3xl font-extrabold text-[#344E41] dark:text-gray-100 mt-2">Stories from workers and program leads</h2>
                <p className="text-sm text-[#344E41]/7000 dark:text-gray-300 mt-3">
                  Praxis deployments already support maker spaces, vocational schools, and fast-growing supply chains. Their feedback keeps us honest and inspires every product iteration.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {successStories.map((story) => (
                  <article key={story.person} className="p-5 rounded-2xl bg-white/70 dark:bg-gray-800/70 border border-[#A3B18A]/30 dark:border-gray-700 flex flex-col">
                    <p className="text-sm text-[#344E41]/8000 dark:text-gray-300 leading-relaxed flex-1">&ldquo;{story.quote}&rdquo;</p>
                    <div className="mt-4 pt-4 border-t border-[#A3B18A]/30 dark:border-gray-700">
                      <p className="text-sm font-semibold text-[#344E41] dark:text-gray-100">{story.person}</p>
                      <p className="text-xs text-[#344E41]/6000 dark:text-gray-400">{story.meta}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* FAQs */}
            <section>
              <div className="max-w-2xl mb-8">
                <p className="uppercase tracking-[0.2em] text-xs text-[#3A7D44] dark:text-[#A3B18A] font-semibold">Questions we hear often</p>
                <h2 className="text-3xl font-extrabold text-[#344E41] dark:text-gray-100 mt-2">Everything you need to know before recording</h2>
                <p className="text-sm text-[#344E41]/7000 dark:text-gray-300 mt-3">
                  Still curious about data ownership, language flexibility, or integrations? These answers come directly from community recording drives and employer onboarding calls.
                </p>
              </div>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.question} className="p-5 rounded-2xl border border-[#A3B18A]/30 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60">
                    <h3 className="text-lg font-semibold text-[#344E41] dark:text-gray-100">{faq.question}</h3>
                    <p className="text-sm text-[#344E41]/8000 dark:text-gray-300 mt-2 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-18px); }
        }
        @keyframes svgBob {
          0%, 100% { transform: scale(1) rotate(-2deg); }
          50%       { transform: scale(1.06) rotate(2deg); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8) translateY(0px); }
          50%       { opacity: 1;   transform: scale(1.4) translateY(-8px); }
        }
      `}</style>
    </div>
  );
}

