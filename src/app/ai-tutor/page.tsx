import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AITutorView } from "@/components/ai/AITutorView";

export default function AITutorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <AITutorView />
      </main>
      <Footer />
    </div>
  );
}
