import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { AICopilotDrawer } from "@/components/AICopilotDrawer";

export const metadata: Metadata = {
  title: "CityVerse AI - Autonomous Smart City Operating System",
  description: "Enterprise Digital Twin & Multi-Agent AI Smart City Operating System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-darkBg text-white antialiased min-h-screen flex flex-col relative">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>
        </div>
        
        {/* Universal Floating AI Copilot Mounted Globally */}
        <AICopilotDrawer />
      </body>
    </html>
  );
}
