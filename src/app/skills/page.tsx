"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function SkillsPage() {
  const router = useRouter();
  const [skills] = useState([
    {
      name: "JavaScript",
      confidence: 92,
      category: "Programming",
      icon: "computer-svgrepo-com",
      color: "#F59E0B"
    },
    {
      name: "React",
      confidence: 88,
      category: "Framework",
      icon: "network-svgrepo-com",
      color: "#10B981"
    },
    {
      name: "UI/UX Design",
      confidence: 85,
      category: "Design",
      icon: "trending-up-svgrepo-com",
      color: "#8B5CF6"
    },
    {
      name: "Communication",
      confidence: 90,
      category: "Soft Skills",
      icon: "conversation-svgrepo-com",
      color: "#EC4899"
    },
    {
      name: "Problem Solving",
      confidence: 87,
      category: "Soft Skills",
      icon: "trophy-svgrepo-com",
      color: "#F59E0B"
    },
    {
      name: "Leadership",
      confidence: 82,
      category: "Soft Skills",
      icon: "business-svgrepo-com",
      color: "#3A7D44"
    },
  ]);

  useEffect(() => {
    const processingId = localStorage.getItem("processingId");
    if (!processingId) {
      router.push("/record");
    }
  }, [router]);

  const categories = Array.from(new Set(skills.map((s) => s.category)));
  const overallScore = Math.round(skills.reduce((acc, s) => acc + s.confidence, 0) / skills.length);

  return (
    <div className="min-h-screen bg-[#F7F9F4] dark:bg-gray-900 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#A3B18A]/10 dark:bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animation: "float 6s ease-in-out infinite" }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#3A7D44]/5 dark:bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animation: "float 8s ease-in-out infinite 1s" }} />
      </div>

      {/* Grid background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: "linear-gradient(0deg, transparent 24%, rgba(58, 125, 68, 0.05) 25%, rgba(58, 125, 68, 0.05) 26%, transparent 27%, transparent 74%, rgba(58, 125, 68, 0.05) 75%, rgba(58, 125, 68, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(58, 125, 68, 0.05) 25%, rgba(58, 125, 68, 0.05) 26%, transparent 27%, transparent 74%, rgba(58, 125, 68, 0.05) 75%, rgba(58, 125, 68, 0.05) 76%, transparent 77%, transparent)",
        backgroundSize: "50px 50px"
      }} />

      <div className="relative max-w-4xl mx-auto px-4 py-4 sm:py-6">
        {/* ThemeToggle in top-right corner */}
        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="business-svgrepo-com" size={32} color="#3A7D44" />
            <h1 className="text-2xl font-bold text-white dark:text-gray-100">Your Verified Skills</h1>
          </div>
          <p className="text-sm text-[#344E41]/8000 dark:text-gray-300">Skills identified and verified from your video</p>
        </div>

        {/* Overall Score */}
        <div className="grid md:grid-cols-3 gap-3 mb-6">
          <div className="bg-[#A3B18A]/10 dark:bg-gray-800/50 backdrop-blur-xl rounded-lg p-4 border border-[#A3B18A]00/50 dark:border-gray-700">
            <div className="text-sm text-[#3A7D44]200 dark:text-gray-300 font-semibold mb-2 flex items-center gap-2">
              <Icon name="trophy-svgrepo-com" size={18} color="#3A7D44" />
              Overall Score
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20">
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="#1E40AF" strokeWidth="8" />
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="#3A7D44"
                    strokeWidth="8"
                    strokeDasharray={`${(overallScore / 100) * 565.48} 565.48`}
                    strokeLinecap="round"
                    transform="rotate(-90 100 100)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-[#3A7D44]00 dark:text-blue-400">{overallScore}%</span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#3A7D44]200 dark:text-gray-100">{overallScore}/100</p>
                <p className="text-sm text-[#3A7D44]00 dark:text-gray-400 mt-1">Professional Level</p>
              </div>
            </div>
          </div>

          <div className="bg-emerald-500/20 dark:bg-emerald-900/30 border border-emerald-400/50 dark:border-emerald-700 rounded-lg p-6 backdrop-blur-xl">
            <div className="text-sm text-emerald-200 dark:text-emerald-300 font-semibold mb-3 flex items-center gap-2">
              <Icon name="check-circle-svgrepo-com" size={18} color="#10B981" />
              Verified
            </div>
            <p className="text-3xl font-bold text-emerald-300 dark:text-emerald-400">{skills.length}</p>
            <p className="text-sm text-emerald-200 dark:text-emerald-300 mt-1">Skills identified</p>
          </div>

          <div className="bg-violet-500/20 dark:bg-violet-900/30 border border-violet-400/50 dark:border-violet-700 rounded-lg p-6 backdrop-blur-xl">
            <div className="text-sm text-violet-200 dark:text-violet-300 font-semibold mb-3 flex items-center gap-2">
              <Icon name="column-chart-svgrepo-com" size={18} color="#8B5CF6" />
              Categories
            </div>
            <p className="text-3xl font-bold text-violet-300 dark:text-violet-400">{categories.length}</p>
            <p className="text-sm text-violet-200 dark:text-violet-300 mt-1">Skill areas</p>
          </div>
        </div>

        {/* Skills by Category */}
        <div className="space-y-6">
          {categories.map((category) => {
            const categorySkills = skills.filter((s) => s.category === category);
            return (
              <div key={category}>
                <h2 className="text-lg font-semibold text-white dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Icon name="trending-up-svgrepo-com" size={20} color="#3A7D44" />
                  {category}
                </h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {categorySkills.map((skill) => (
                    <div key={skill.name} className="bg-white/30 dark:bg-gray-800/30 border border-[#A3B18A]00/50 dark:border-gray-700 rounded-md p-3 hover:border-slate-600/80 dark:hover:border-gray-600 transition-all duration-200 backdrop-blur-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Icon name={skill.icon} size={20} color={skill.color} />
                            <p className="font-semibold text-white dark:text-gray-100">{skill.name}</p>
                          </div>
                          <p className="text-xs text-[#344E41]/6000 dark:text-gray-400 mt-1">{skill.category}</p>
                        </div>
                        <Icon name="check-circle-svgrepo-com" size={20} color="#10B981" />
                      </div>

                      {/* Confidence Bar */}
                      <div className="space-y-2">
                        <div className="w-full bg-slate-700/50 dark:bg-gray-600/50 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300`}
                            style={{ 
                              width: `${skill.confidence}%`,
                              backgroundColor: skill.color
                            }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-[#344E41]/6000 dark:text-gray-400">Confidence</span>
                          <span className="font-semibold text-[#344E41]/8000 dark:text-gray-300">{skill.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-3 mt-8 pt-6 border-t border-[#A3B18A]00/50 dark:border-gray-700">
          <button
            onClick={() => router.push("/jobs")}
            className="px-4 py-2 text-sm bg-gradient-to-r from-[#3A7D44] to-[#2D5F34] hover:from-[#2D5F34] hover:to-[#25492A] text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Icon name="trending-up-svgrepo-com" size={18} color="white" />
            Find Matching Jobs
          </button>

          <button
            onClick={() => router.push("/start")}
            className="px-4 py-2 text-sm bg-slate-700/50 dark:bg-gray-700/50 hover:bg-slate-700 dark:hover:bg-gray-600 border border-slate-600/50 dark:border-gray-600 hover:border-slate-500 dark:hover:border-gray-500 text-white dark:text-gray-100 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Icon name="arrow-left-svgrepo-com" size={18} color="white" />
            Back to Dashboard
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-400/50 dark:border-emerald-700 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex gap-3 items-start">
            <Icon name="check-circle-svgrepo-com" size={20} color="#10B981" className="flex-shrink-0 mt-0.5" />
            <div className="text-sm text-emerald-100 dark:text-emerald-200">
              <p className="font-semibold mb-1">Your Profile is Ready!</p>
              <p>Share your verified skills with employers and apply to matching jobs.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
