"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function JobsPage() {
  const router = useRouter();
  const [jobs] = useState([
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc",
      location: "San Francisco, CA",
      salary: "$120K - $160K",
      match: 94,
      skills: ["JavaScript", "React", "UI/UX Design"],
      description: "Lead frontend development for our innovative web platform",
      type: "Full-time",
      icon: "computer-svgrepo-com",
      color: "#F59E0B"
    },
    {
      id: 2,
      title: "React Developer",
      company: "StartUp Labs",
      location: "Remote",
      salary: "$90K - $130K",
      match: 89,
      skills: ["React", "JavaScript"],
      description: "Build scalable React applications for growing startup",
      type: "Full-time",
      icon: "network-svgrepo-com",
      color: "#10B981"
    },
    {
      id: 3,
      title: "UI Developer",
      company: "Design Studio",
      location: "New York, NY",
      salary: "$85K - $115K",
      match: 85,
      skills: ["UI/UX Design", "JavaScript"],
      description: "Create beautiful and functional user interfaces",
      type: "Full-time",
      icon: "screen-share-svgrepo-com",
      color: "#8B5CF6"
    },
    {
      id: 4,
      title: "Full Stack Engineer",
      company: "Global Tech",
      location: "Austin, TX",
      salary: "$110K - $150K",
      match: 82,
      skills: ["JavaScript", "React", "Communication"],
      description: "Develop full-stack solutions for enterprise clients",
      type: "Full-time",
      icon: "cast-svgrepo-com",
      color: "#EC4899"
    },
    {
      id: 5,
      title: "Junior Developer",
      company: "Learning Academy",
      location: "Boston, MA",
      salary: "$70K - $100K",
      match: 78,
      skills: ["JavaScript", "Problem Solving"],
      description: "Join our team and grow your development skills",
      type: "Full-time",
      icon: "book-svgrepo-com",
      color: "#06B6D4"
    },
    {
      id: 6,
      title: "Frontend Lead",
      company: "Innovation Hub",
      location: "Seattle, WA",
      salary: "$140K - $180K",
      match: 87,
      skills: ["React", "Leadership", "Communication"],
      description: "Lead our frontend team and shape product direction",
      type: "Full-time",
      icon: "trophy-svgrepo-com",
      color: "#F59E0B"
    },
  ]);

  const [selectedJob, setSelectedJob] = useState<typeof jobs[0] | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Hide sidebar on scroll down, show on scroll up (on mobile)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide sidebar
        setIsSidebarVisible(false);
      } else {
        // Scrolling up - show sidebar
        setIsSidebarVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const getMatchColor = (match: number) => {
    if (match >= 90) return "text-green-400 bg-green-500/20 border border-green-400/50";
    if (match >= 80) return "text-[#3A7D44]00 bg-[#A3B18A]/10 border border-[#A3B18A]00/50";
    if (match >= 70) return "text-yellow-400 bg-yellow-500/20 border border-yellow-400/50";
    return "text-orange-400 bg-orange-500/20 border border-orange-400/50";
  };

  const handleApply = (jobId: number) => {
    if (!appliedJobs.includes(jobId)) {
      setAppliedJobs([...appliedJobs, jobId]);
      setTimeout(() => {
        alert("Application submitted! We'll notify you when the employer reviews it.");
      }, 300);
    }
  };

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

      <div className="relative max-w-6xl mx-auto px-4 py-4 sm:py-6">
        {/* ThemeToggle in top-right corner */}
        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        
        {/* Header */}
        <div className="mb-5 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-lg p-4 border border-[#A3B18A]00/50 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="business-svgrepo-com" size={32} color="#3A7D44" />
            <h1 className="text-2xl font-bold text-white dark:text-gray-100">Job Matches</h1>
          </div>
          <p className="text-sm text-[#344E41]/8000 dark:text-gray-300">Based on your verified skills, here are the best opportunities</p>
          <p className="text-xs text-[#344E41]/6000 dark:text-gray-400 mt-1">Found {jobs.length} matching positions</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Jobs List */}
          <div className="lg:col-span-2 space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`bg-white/30 dark:bg-gray-800/30 border transition-all duration-200 cursor-pointer rounded-lg p-6 backdrop-blur-sm ${
                  selectedJob?.id === job.id
                    ? "border-[#A3B18A]00 dark:border-blue-500 shadow-lg shadow-blue-500/20"
                    : "border-[#A3B18A]00/50 dark:border-gray-700 hover:border-slate-600/80 dark:hover:border-gray-600"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <Icon name={job.icon} size={28} color={job.color} />
                    <div>
                      <h3 className="text-lg font-semibold text-white dark:text-gray-100">{job.title}</h3>
                      <p className="text-[#344E41]/6000 dark:text-gray-400 mt-1">{job.company}</p>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full font-semibold text-sm whitespace-nowrap ${getMatchColor(job.match)}`}
                  >
                    {job.match}% Match
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-4 text-sm text-[#344E41]/8000 dark:text-gray-300">
                  <span className="flex items-center gap-1">
                    <Icon name="address-svgrepo-com" size={16} color="#94A3B8" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="wallet-svgrepo-com" size={16} color="#94A3B8" />
                    {job.salary}
                  </span>
                  <span className="inline-block px-2 py-1 bg-[#A3B18A]/10 dark:bg-gray-700/50 text-[#3A7D44]00 dark:text-blue-400 rounded text-xs font-semibold border border-[#A3B18A]00/50 dark:border-gray-600">
                    {job.type}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-block px-2 py-1 bg-slate-700/50 dark:bg-gray-700/50 text-[#344E41]/8000 dark:text-gray-300 rounded text-xs font-medium border border-slate-600/50 dark:border-gray-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Job Details */}
          <div className="lg:col-span-1">
            {selectedJob ? (
              <div className={`bg-white/30 dark:bg-gray-800/30 rounded-lg p-6 border border-[#A3B18A]00/50 dark:border-gray-700 sticky top-4 space-y-4 transition-transform duration-300 backdrop-blur-sm ${
                isSidebarVisible ? "translate-y-0" : "lg:translate-y-0 -translate-y-full"
              }`}>
                <div>
                  <div className={`px-3 py-1 rounded-full font-semibold text-sm w-fit ${getMatchColor(selectedJob.match)}`}>
                    {selectedJob.match}% Match
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <Icon name={selectedJob.icon} size={32} color={selectedJob.color} />
                    <div>
                      <h2 className="text-2xl font-bold text-white dark:text-gray-100">{selectedJob.title}</h2>
                      <p className="text-[#344E41]/6000 dark:text-gray-400 mt-1">{selectedJob.company}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-[#344E41]/8000 dark:text-gray-300">
                    <Icon name="address-svgrepo-com" size={18} color="#3A7D44" />
                    <span>{selectedJob.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#344E41]/8000 dark:text-gray-300">
                    <Icon name="wallet-svgrepo-com" size={18} color="#10B981" />
                    <span className="font-semibold">{selectedJob.salary}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#344E41]/8000 dark:text-gray-300">
                    <Icon name="calendar-svgrepo-com" size={18} color="#F59E0B" />
                    <span>{selectedJob.type}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#A3B18A]00/50 dark:border-gray-700">
                  <p className="text-sm font-semibold text-white dark:text-gray-100 mb-2">About this role</p>
                  <p className="text-sm text-[#344E41]/6000 dark:text-gray-400">{selectedJob.description}</p>
                </div>

                <div className="pt-4 border-t border-[#A3B18A]00/50 dark:border-gray-700">
                  <p className="text-sm font-semibold text-white dark:text-gray-100 mb-3">Your Skills Match</p>
                  <div className="space-y-2">
                    {selectedJob.skills.map((skill) => (
                      <div key={skill} className="flex items-center gap-2">
                        <Icon name="check-circle-svgrepo-com" size={16} color="#10B981" />
                        <span className="text-sm text-[#344E41]/8000 dark:text-gray-300">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleApply(selectedJob.id)}
                  disabled={appliedJobs.includes(selectedJob.id)}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                    appliedJobs.includes(selectedJob.id)
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#3A7D44] to-[#2D5F34] hover:from-[#2D5F34] hover:to-[#25492A] text-white"
                  }`}
                >
                  {appliedJobs.includes(selectedJob.id) ? (
                    <>
                      <Icon name="check-circle-svgrepo-com" size={18} color="#10B981" />
                      Applied
                    </>
                  ) : (
                    <>
                      <Icon name="arrow-circle-right-svgrepo-com" size={18} color="white" />
                      Apply Now
                    </>
                  )}
                </button>

                <button
                  onClick={() => router.push("/skills")}
                  className="w-full py-2 px-4 rounded-lg font-semibold text-[#344E41]/8000 dark:text-gray-300 hover:text-white dark:hover:text-gray-100 border border-slate-600/50 dark:border-gray-600 hover:border-slate-500 dark:hover:border-gray-500 transition-all"
                >
                  Back to Skills
                </button>
              </div>
            ) : (
              <div className="bg-slate-100 dark:bg-gray-800/50 rounded-lg p-6 border border-slate-200 dark:border-gray-700 text-center">
                <Icon name="notify-svgrepo-com" size={32} color="#64748B" className="mx-auto mb-3" />
                <p className="text-slate-600 dark:text-gray-400 font-medium">Select a job to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
