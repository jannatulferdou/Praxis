"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { ThemeToggle } from "@/components/ThemeToggle";

const COUNTRIES = [
  { code: "+93", name: "Afghanistan", flag: "🇦🇫" },
  { code: "+355", name: "Albania", flag: "🇦🇱" },
  { code: "+213", name: "Algeria", flag: "🇩🇿" },
  { code: "+1", name: "United States", flag: "🇺🇸" },
  { code: "+376", name: "Andorra", flag: "🇦🇩" },
  { code: "+244", name: "Angola", flag: "🇦🇴" },
  { code: "+54", name: "Argentina", flag: "🇦🇷" },
  { code: "+374", name: "Armenia", flag: "🇦🇲" },
  { code: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "+43", name: "Austria", flag: "🇦🇹" },
  { code: "+994", name: "Azerbaijan", flag: "🇦🇿" },
  { code: "+973", name: "Bahrain", flag: "🇧🇭" },
  { code: "+880", name: "Bangladesh", flag: "🇧🇩" },
  { code: "+375", name: "Belarus", flag: "🇧🇾" },
  { code: "+32", name: "Belgium", flag: "🇧🇪" },
  { code: "+501", name: "Belize", flag: "🇧🇿" },
  { code: "+229", name: "Benin", flag: "🇧🇯" },
  { code: "+975", name: "Bhutan", flag: "🇧🇹" },
  { code: "+591", name: "Bolivia", flag: "🇧🇴" },
  { code: "+387", name: "Bosnia", flag: "🇧🇦" },
  { code: "+55", name: "Brazil", flag: "🇧🇷" },
  { code: "+673", name: "Brunei", flag: "🇧🇳" },
  { code: "+359", name: "Bulgaria", flag: "🇧🇬" },
  { code: "+226", name: "Burkina Faso", flag: "🇧🇫" },
  { code: "+257", name: "Burundi", flag: "🇧🇮" },
  { code: "+855", name: "Cambodia", flag: "🇰🇭" },
  { code: "+237", name: "Cameroon", flag: "🇨🇲" },
  { code: "+1", name: "Canada", flag: "🇨🇦" },
  { code: "+56", name: "Chile", flag: "🇨🇱" },
  { code: "+86", name: "China", flag: "🇨🇳" },
  { code: "+57", name: "Colombia", flag: "🇨🇴" },
  { code: "+506", name: "Costa Rica", flag: "🇨🇷" },
  { code: "+385", name: "Croatia", flag: "🇭🇷" },
  { code: "+53", name: "Cuba", flag: "🇨🇺" },
  { code: "+357", name: "Cyprus", flag: "🇨🇾" },
  { code: "+420", name: "Czech Republic", flag: "🇨🇿" },
  { code: "+45", name: "Denmark", flag: "🇩🇰" },
  { code: "+253", name: "Djibouti", flag: "🇩🇯" },
  { code: "+593", name: "Ecuador", flag: "🇪🇨" },
  { code: "+20", name: "Egypt", flag: "🇪🇬" },
  { code: "+503", name: "El Salvador", flag: "🇸🇻" },
  { code: "+372", name: "Estonia", flag: "🇪🇪" },
  { code: "+251", name: "Ethiopia", flag: "🇪🇹" },
  { code: "+679", name: "Fiji", flag: "🇫🇯" },
  { code: "+358", name: "Finland", flag: "🇫🇮" },
  { code: "+33", name: "France", flag: "🇫🇷" },
  { code: "+995", name: "Georgia", flag: "🇬🇪" },
  { code: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "+233", name: "Ghana", flag: "🇬🇭" },
  { code: "+30", name: "Greece", flag: "🇬🇷" },
  { code: "+502", name: "Guatemala", flag: "🇬🇹" },
  { code: "+224", name: "Guinea", flag: "🇬🇳" },
  { code: "+509", name: "Haiti", flag: "🇭🇹" },
  { code: "+504", name: "Honduras", flag: "🇭🇳" },
  { code: "+852", name: "Hong Kong", flag: "🇭🇰" },
  { code: "+36", name: "Hungary", flag: "🇭🇺" },
  { code: "+354", name: "Iceland", flag: "🇮🇸" },
  { code: "+91", name: "India", flag: "🇮🇳" },
  { code: "+62", name: "Indonesia", flag: "🇮🇩" },
  { code: "+98", name: "Iran", flag: "🇮🇷" },
  { code: "+964", name: "Iraq", flag: "🇮🇶" },
  { code: "+353", name: "Ireland", flag: "🇮🇪" },
  { code: "+972", name: "Israel", flag: "🇮🇱" },
  { code: "+39", name: "Italy", flag: "🇮🇹" },
  { code: "+81", name: "Japan", flag: "🇯🇵" },
  { code: "+962", name: "Jordan", flag: "🇯🇴" },
  { code: "+7", name: "Kazakhstan", flag: "🇰🇿" },
  { code: "+254", name: "Kenya", flag: "🇰🇪" },
  { code: "+965", name: "Kuwait", flag: "🇰🇼" },
  { code: "+996", name: "Kyrgyzstan", flag: "🇰🇬" },
  { code: "+856", name: "Laos", flag: "🇱🇦" },
  { code: "+371", name: "Latvia", flag: "🇱🇻" },
  { code: "+961", name: "Lebanon", flag: "🇱🇧" },
  { code: "+231", name: "Liberia", flag: "🇱🇷" },
  { code: "+218", name: "Libya", flag: "🇱🇾" },
  { code: "+370", name: "Lithuania", flag: "🇱🇹" },
  { code: "+352", name: "Luxembourg", flag: "🇱🇺" },
  { code: "+853", name: "Macau", flag: "🇲🇴" },
  { code: "+261", name: "Madagascar", flag: "🇲🇬" },
  { code: "+265", name: "Malawi", flag: "🇲🇼" },
  { code: "+60", name: "Malaysia", flag: "🇲🇾" },
  { code: "+960", name: "Maldives", flag: "🇲🇻" },
  { code: "+223", name: "Mali", flag: "🇲🇱" },
  { code: "+356", name: "Malta", flag: "🇲🇹" },
  { code: "+52", name: "Mexico", flag: "🇲🇽" },
  { code: "+377", name: "Monaco", flag: "🇲🇨" },
  { code: "+976", name: "Mongolia", flag: "🇲🇳" },
  { code: "+382", name: "Montenegro", flag: "🇲🇪" },
  { code: "+212", name: "Morocco", flag: "🇲🇦" },
  { code: "+258", name: "Mozambique", flag: "🇲🇿" },
  { code: "+95", name: "Myanmar", flag: "🇲🇲" },
  { code: "+264", name: "Namibia", flag: "🇳🇦" },
  { code: "+977", name: "Nepal", flag: "🇳🇵" },
  { code: "+31", name: "Netherlands", flag: "🇳🇱" },
  { code: "+64", name: "New Zealand", flag: "🇳🇿" },
  { code: "+505", name: "Nicaragua", flag: "🇳🇮" },
  { code: "+227", name: "Niger", flag: "🇳🇪" },
  { code: "+234", name: "Nigeria", flag: "🇳🇬" },
  { code: "+47", name: "Norway", flag: "🇳🇴" },
  { code: "+968", name: "Oman", flag: "🇴🇲" },
  { code: "+92", name: "Pakistan", flag: "🇵🇰" },
  { code: "+970", name: "Palestine", flag: "🇵🇸" },
  { code: "+507", name: "Panama", flag: "🇵🇦" },
  { code: "+595", name: "Paraguay", flag: "🇵🇾" },
  { code: "+51", name: "Peru", flag: "🇵🇪" },
  { code: "+63", name: "Philippines", flag: "🇵🇭" },
  { code: "+48", name: "Poland", flag: "🇵🇱" },
  { code: "+351", name: "Portugal", flag: "🇵🇹" },
  { code: "+974", name: "Qatar", flag: "🇶🇦" },
  { code: "+40", name: "Romania", flag: "🇷🇴" },
  { code: "+7", name: "Russia", flag: "🇷🇺" },
  { code: "+250", name: "Rwanda", flag: "🇷🇼" },
  { code: "+966", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+221", name: "Senegal", flag: "🇸🇳" },
  { code: "+381", name: "Serbia", flag: "🇷🇸" },
  { code: "+65", name: "Singapore", flag: "🇸🇬" },
  { code: "+421", name: "Slovakia", flag: "🇸🇰" },
  { code: "+386", name: "Slovenia", flag: "🇸🇮" },
  { code: "+252", name: "Somalia", flag: "🇸🇴" },
  { code: "+27", name: "South Africa", flag: "🇿🇦" },
  { code: "+82", name: "South Korea", flag: "🇰🇷" },
  { code: "+34", name: "Spain", flag: "🇪🇸" },
  { code: "+94", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "+249", name: "Sudan", flag: "🇸🇩" },
  { code: "+46", name: "Sweden", flag: "🇸🇪" },
  { code: "+41", name: "Switzerland", flag: "🇨🇭" },
  { code: "+963", name: "Syria", flag: "🇸🇾" },
  { code: "+886", name: "Taiwan", flag: "🇹🇼" },
  { code: "+992", name: "Tajikistan", flag: "🇹🇯" },
  { code: "+255", name: "Tanzania", flag: "🇹🇿" },
  { code: "+66", name: "Thailand", flag: "🇹🇭" },
  { code: "+228", name: "Togo", flag: "🇹🇬" },
  { code: "+216", name: "Tunisia", flag: "🇹🇳" },
  { code: "+90", name: "Turkey", flag: "🇹🇷" },
  { code: "+993", name: "Turkmenistan", flag: "🇹🇲" },
  { code: "+256", name: "Uganda", flag: "🇺🇬" },
  { code: "+380", name: "Ukraine", flag: "🇺🇦" },
  { code: "+971", name: "UAE", flag: "🇦🇪" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+598", name: "Uruguay", flag: "🇺🇾" },
  { code: "+998", name: "Uzbekistan", flag: "🇺🇿" },
  { code: "+58", name: "Venezuela", flag: "🇻🇪" },
  { code: "+84", name: "Vietnam", flag: "🇻🇳" },
  { code: "+967", name: "Yemen", flag: "🇾🇪" },
  { code: "+260", name: "Zambia", flag: "🇿🇲" },
  { code: "+263", name: "Zimbabwe", flag: "🇿🇼" }
];

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);
  const [countryCode, setCountryCode] = useState("+880");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<"phone" | "google">("phone");

  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.code.includes(searchQuery)
  );

  const isValidPhone = (phoneNumber: string): boolean => {
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    return (
      (cleanPhone.length === 11 && cleanPhone.startsWith("01")) ||
      (cleanPhone.length === 13 && cleanPhone.startsWith("880"))
    );
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
    setError(null);
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidPhone(phone)) {
      setError("Please enter a valid phone number (01XXXXXXXXX or +8801XXXXXXXXX)");
      return;
    }

    setLoading(true);

    try {
      const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("userId", userId);
      localStorage.setItem("userPhone", phone);

      setTimeout(() => {
        router.push("/start");
      }, 500);
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("userId", userId);
      localStorage.setItem("userPhone", "google-user");
      
      setTimeout(() => {
        router.push("/start");
      }, 500);
    } catch (err) {
      setError("Google login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9F4] dark:bg-gray-900 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#A3B18A]/20 dark:bg-[#3A7D44]/10 rounded-full blur-3xl" style={{ animation: "float 6s ease-in-out infinite" }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#3A7D44]/10 dark:bg-[#A3B18A]/5 rounded-full blur-3xl" style={{ animation: "float 8s ease-in-out infinite 1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#3A7D44]/5 rounded-full blur-3xl" style={{ animation: "pulse-slow 10s ease-in-out infinite" }} />
        {/* Floating particles */}
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#3A7D44] dark:bg-[#A3B18A]"
            style={{
              width: `${(i % 4) + 2}px`,
              height: `${(i % 4) + 2}px`,
              top: `${(i * 17 + 5) % 90}%`,
              left: `${(i * 23 + 3) % 95}%`,
              opacity: 0.15 + (i % 5) * 0.07,
              animation: `drift ${5 + (i % 5)}s ease-in-out infinite ${i * 0.4}s`,
            }}
          />
        ))}
        {/* Floating rings */}
        <div className="absolute top-20 left-16 w-24 h-24 border border-[#3A7D44]/15 dark:border-[#A3B18A]/10 rounded-full" style={{ animation: "spin-slow 20s linear infinite" }} />
        <div className="absolute bottom-32 right-20 w-16 h-16 border border-[#A3B18A]/20 dark:border-[#3A7D44]/10 rounded-full" style={{ animation: "spin-slow 15s linear infinite reverse" }} />
        <div className="absolute top-1/3 right-1/4 w-8 h-8 border border-[#3A7D44]/20 rounded-full" style={{ animation: "spin-slow 12s linear infinite" }} />
      </div>

      {/* Grid background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(0deg, transparent 24%, rgba(58, 125, 68, 0.05) 25%, rgba(58, 125, 68, 0.05) 26%, transparent 27%, transparent 74%, rgba(58, 125, 68, 0.05) 75%, rgba(58, 125, 68, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(58, 125, 68, 0.05) 25%, rgba(58, 125, 68, 0.05) 26%, transparent 27%, transparent 74%, rgba(58, 125, 68, 0.05) 75%, rgba(58, 125, 68, 0.05) 76%, transparent 77%, transparent)",
        backgroundSize: "50px 50px"
      }} />

      {/* Content */}
      <div className="relative flex items-center justify-center min-h-screen px-4 py-4">
        {/* ThemeToggle in top-right corner */}
        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        
        <div className="w-full max-w-4xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Section - Form */}
            <div
              className="w-full max-w-md mx-auto lg:mx-0"
              style={{
                animation: mounted ? "slideInLeft 0.7s cubic-bezier(0.16,1,0.3,1) both" : "none",
                opacity: mounted ? undefined : 0,
              }}
            >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <Icon name="business-svgrepo-com" size={40} color="#3A7D44" />
            </div>
            <h1 className="text-2xl font-bold text-green dark:text-gray-100 mb-1">Praxis</h1>
            <p className="text-sm text-[#344E41]/8000 dark:text-gray-300">Verify your skills, land your future</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3">
              <Icon name="warning-circle-svgrepo-com" size={20} color="#EF4444" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Auth Method Tabs */}
          <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-white/30 dark:bg-gray-800/30 rounded-lg backdrop-blur-sm border border-[#A3B18A]00/50 dark:border-gray-700">
            <button
              onClick={() => setAuthMethod("phone")}
              className={`py-1 px-2 rounded-md font-semibold text-xs transition-all duration-200 ${
                authMethod === "phone"
                  ? "bg-[#A3B18A]/10 dark:bg-gray-700 text-[#3A7D44]00 dark:text-gray-100 border border-[#A3B18A]00/50 dark:border-gray-600"
                  : "text-[#344E41]/6000 dark:text-gray-400 hover:text-[#344E41]/8000 dark:hover:text-gray-200"
              }`}
            >
              Phone
            </button>
            <button
              onClick={() => setAuthMethod("google")}
              className={`py-2 px-3 rounded-md font-semibold text-sm transition-all duration-200 ${
                authMethod === "google"
                  ? "bg-[#A3B18A]/10 dark:bg-gray-700 text-[#3A7D44]00 dark:text-gray-100 border border-[#A3B18A]00/50 dark:border-gray-600"
                  : "text-[#344E41]/6000 dark:text-gray-400 hover:text-[#344E41]/8000 dark:hover:text-gray-200"
              }`}
            >
              Google
            </button>
          </div>

          {/* Phone Login */}
          {authMethod === "phone" && (
            <form onSubmit={handlePhoneLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-green-500 dark:text-gray-200 mb-2 flex items-center gap-2">
                  <Icon name="user-svgrepo-com" size={18} color="#217d2f" />
                  Phone Number
                </label>
                <div className="flex gap-2">
                  {/* Custom Country Code Dropdown with Search */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowDropdown(!showDropdown)}
                      disabled={loading}
                      className="px-3 py-3 bg-green-500/50 dark:bg-gray-800/50 border border-[#A3B18A]00/50 dark:border-gray-700 rounded-lg text-white dark:text-gray-100 focus:outline-none focus:border-[#A3B18A]00 dark:focus:border-gray-600 focus:ring-1 focus:ring-blue-400/50 transition-all disabled:opacity-50 flex items-center gap-2 min-w-[120px]"
                    >
                      <span>{COUNTRIES.find(c => c.code === countryCode)?.flag} {countryCode}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {showDropdown && (
                      <div className="absolute z-50 mt-2 w-80 bg-white dark:bg-gray-800 border border-[#A3B18A]/40 dark:border-gray-700 rounded-lg shadow-xl max-h-96 overflow-hidden">
                        {/* Search Input */}
                        <div className="p-3 border-b border-[#A3B18A]/30 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
                          <input
                            type="text"
                            placeholder="Search country or code..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-[#344E41] dark:text-gray-100 text-sm focus:outline-none focus:border-[#3A7D44] dark:focus:border-blue-500"
                            autoFocus
                          />
                        </div>

                        {/* Country List */}
                        <div className="overflow-y-auto max-h-80">
                          {filteredCountries.length > 0 ? (
                            filteredCountries.map((country) => (
                              <button
                                key={country.code + country.name}
                                type="button"
                                onClick={() => {
                                  setCountryCode(country.code);
                                  setShowDropdown(false);
                                  setSearchQuery("");
                                  setError(null);
                                }}
                                className={`w-full text-left px-4 py-2.5 hover:bg-[#3A7D44]/10 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors ${
                                  countryCode === country.code ? "bg-[#3A7D44]/20 dark:bg-gray-700" : ""
                                }`}
                              >
                                <span className="text-2xl">{country.flag}</span>
                                <div className="flex-1">
                                  <span className="text-[#344E41] dark:text-gray-100 text-sm font-medium">{country.name}</span>
                                </div>
                                <span className="text-[#344E41]/60 dark:text-gray-400 text-sm font-mono">{country.code}</span>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-8 text-center text-[#344E41]/60 dark:text-gray-400 text-sm">
                              No countries found
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="relative flex-1">
                    <input
                      type="tel"
                      placeholder={countryCode === "+880" ? "01XXXXXXXXX" : "Phone number"}
                      value={phone}
                      onChange={handlePhoneChange}
                      disabled={loading}
                      className="w-full px-4 py-3 pl-10 bg-green-500/50 dark:bg-gray-800/50 border border-[#A3B18A]00/50 dark:border-gray-700 rounded-lg text-white dark:text-gray-100 placeholder-slate-500 dark:placeholder-gray-400 focus:outline-none focus:border-[#A3B18A]00 dark:focus:border-gray-600 focus:ring-1 focus:ring-blue-400/50 transition-all disabled:opacity-50"
                    />
                    <Icon name="mail-svgrepo-com" size={18} color="#94A3B8" className="absolute left-3 top-3.5" />
                  </div>
                </div>
                <p className="text-xs text-[#344E41]/6000 dark:text-gray-400 mt-2">
                  {countryCode === "+880" ? "✓ Enter your 11-digit phone number (01XXXXXXXXX)" : "✓ Enter your phone number"}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#3A7D44] to-[#2D5F34] hover:from-[#2D5F34] hover:to-[#25492A] disabled:from-slate-500 disabled:to-slate-500 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <Icon name="arrow-right-svgrepo-com" size={20} color="white" />
                    Continue with Phone
                  </>
                )}
              </button>
            </form>
          )}

          {/* Google Login */}
          {authMethod === "google" && (
            <div className="space-y-6">
              <p className="text-sm text-[#344E41]/8000 dark:text-gray-300 text-center">
                Sign in with your Google account to get started
              </p>

              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-white/50 dark:bg-gray-800/50 hover:bg-slate-700/50 dark:hover:bg-gray-700/50 disabled:bg-slate-700/30 dark:disabled:bg-gray-800/30 border-2 border-[#A3B18A]00/50 dark:border-gray-700 hover:border-[#A3B18A]00 dark:hover:border-gray-600 text-white dark:text-gray-100 font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>
            </div>
          )}

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#A3B18A]00/50 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-[#F7F9F4] dark:bg-gray-900 text-[#344E41]/6000 dark:text-gray-400">or</span>
            </div>
          </div>

          <div className="mt-8 space-y-5">
            <div className="bg-white/40 dark:bg-gray-800/40 border border-[#A3B18A]/40 dark:border-gray-700 rounded-2xl p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-[#344E41] dark:text-gray-100">What you unlock after signing in</h2>
              <p className="text-sm text-[#344E41]/8000 dark:text-gray-300 mt-2 leading-relaxed">
                The Praxis secure workspace guides you through evidence capture, interview readiness, and opportunity matching. Every interaction is timestamped so you can prove progress when applying to accelerators, training cohorts, or funders.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-[#344E41]/7000">
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#3A7D44]" />
                  Track each recording attempt with context tags, reviewer feedback, and exportable receipts.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#3A7D44]" />
                  Receive AI-generated talking points that translate your lived experience into employer-ready language.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#3A7D44]" />
                  Unlock your Praxis Skill Wallet to showcase verified evidence in a single shareable link.
                </li>
              </ul>
            </div>

            <div className="bg-[#3A7D44]/10 dark:bg-gray-800/50 border border-[#3A7D44]/30 dark:border-gray-700 rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-[#344E41] dark:text-gray-100">Our data stewardship pledge</h3>
              <p className="text-sm text-[#344E41]/8000 dark:text-gray-300 mt-2 leading-relaxed">
                Login credentials only identify you inside Praxis. Video proofs stay encrypted, every share request creates an audit log, and partners sign accountable use agreements. You remain the owner of your narrative, and you can revoke any employer&rsquo;s access at any time.
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-xs text-[#344E41]/6000 dark:text-gray-400 text-center mt-8">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

        {/* Right Section - Visual */}
        <div
          className="hidden lg:flex flex-col items-center justify-center relative gap-8"
          style={{
            animation: mounted ? "slideInRight 0.7s cubic-bezier(0.16,1,0.3,1) both 0.1s" : "none",
            opacity: mounted ? undefined : 0,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#3A7D44] to-[#A3B18A]500/20 to-slate-600/20 rounded-3xl blur-3xl" />
          <div className="relative group w-80 h-80">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#3A7D44] to-[#A3B18A]600 to-slate-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-all duration-300 animate-pulse" />
            <div className="relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-[#A3B18A]00/50 dark:border-gray-700 flex items-center justify-center w-full h-full">
              <Icon name="earth-svgrepo-com" size={160} color="#3A7D44" />
            </div>
          </div>

          {/* Feature badges */}
          <div className="grid gap-4 w-full max-w-sm relative z-10">
            {[
              { icon: "check-circle-svgrepo-com", text: "Secure Login", color: "#10B981" },
              { icon: "shield-empty-svgrepo-com", text: "Data Protected", color: "#8B5CF6" },
              { icon: "accelerate-svgrepo-com", text: "Fast Access", color: "#F59E0B" }
            ].map((badge, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white/30 dark:bg-gray-800/30 p-4 rounded-lg border border-[#A3B18A]00/50 dark:border-gray-700 hover:border-slate-600/80 dark:hover:border-gray-600 transition-all"
              >
                <Icon name={badge.icon} size={24} color={badge.color} />
                <span className="text-white dark:text-gray-100 font-semibold text-sm">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(30px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes drift {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33%  { transform: translateY(-12px) translateX(6px); }
          66%  { transform: translateY(8px) translateX(-4px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.04; transform: scale(1); }
          50%  { opacity: 0.08; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
