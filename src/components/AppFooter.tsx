import Link from "next/link";

export function AppFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#A3B18A]/40 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-4 text-xs text-[#344E41]/7000 dark:text-gray-400 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} Praxis. Building evidence for every skill story.</p>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/login" className="hover:text-[#3A7D44] dark:hover:text-[#A3B18A] transition-colors">
            Access Account
          </Link>
          <Link href="/signup" className="hover:text-[#3A7D44] dark:hover:text-[#A3B18A] transition-colors">
            Join Praxis
          </Link>
          <a href="mailto:hello@praxis.work" className="hover:text-[#3A7D44] dark:hover:text-[#A3B18A] transition-colors">
            hello@praxis.work
          </a>
        </div>
      </div>
    </footer>
  );
}
