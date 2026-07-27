import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { AICopilotDrawer } from "@/components/AICopilotDrawer";
import Link from "next/link";
import { Navigation, Box, MapPin, Bot, UserCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "CityVerse AI - Dynamic Location Intelligence & OS",
  description: "Enterprise Dynamic Location Intelligence & Smart City OS Platform",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#090d16",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-darkBg text-white antialiased min-h-screen flex flex-col relative overflow-x-hidden">
        <Navbar />
        
        <div className="flex flex-1 overflow-hidden w-full max-w-full pb-16 lg:pb-0">
          <Sidebar />
          <main className="flex-1 p-2 sm:p-4 md:p-6 w-full max-w-full overflow-y-auto overflow-x-hidden min-h-0">
            {children}
          </main>
        </div>

        {/* Mobile Quick Bottom Navigation Bar */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-darkBg/95 backdrop-blur-md border-t border-white/10 flex items-center justify-around py-2 px-1 text-[10px] font-mono text-gray-400">
          <Link href="/" className="flex flex-col items-center space-y-1 hover:text-cyanGlow">
            <Navigation className="w-4 h-4 text-cyanGlow" />
            <span>Location</span>
          </Link>
          <Link href="/digital-twin" className="flex flex-col items-center space-y-1 hover:text-cyanGlow">
            <Box className="w-4 h-4 text-purple-400" />
            <span>3D Twin</span>
          </Link>
          <Link href="/map" className="flex flex-col items-center space-y-1 hover:text-cyanGlow">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>GIS Map</span>
          </Link>
          <Link href="/agents" className="flex flex-col items-center space-y-1 hover:text-cyanGlow">
            <Bot className="w-4 h-4 text-amber-300" />
            <span>AI Agents</span>
          </Link>
          <Link href="/citizen" className="flex flex-col items-center space-y-1 hover:text-cyanGlow">
            <UserCheck className="w-4 h-4 text-blue-400" />
            <span>Citizen SOS</span>
          </Link>
        </nav>
        
        {/* Universal Floating AI Copilot Mounted Globally */}
        <AICopilotDrawer />
      </body>
    </html>
  );
}
