import type { Metadata } from "next";
import { AppProvider } from "@/context/AppContext";
import { AppFooter } from "@/components/AppFooter";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Praxis - Video Skill Verification",
  description:
    "30-second video to verified skills and job matches.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#F7F9F4] text-[#344E41] dark:bg-gray-900 dark:text-gray-100 transition-colors" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppProvider>
            <div className="min-h-screen relative flex flex-col">
              <div className="flex-1">
                {children}
              </div>
              <AppFooter />
            </div>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
