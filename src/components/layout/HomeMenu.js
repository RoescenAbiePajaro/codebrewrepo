'use client';

import SectionHeaders from "@/components/layout/SectionHeaders";

export default function HomeMenu() {
  return (
    <section className="relative bg-gradient-to-br from-green-400 via-green-500 to-green-600 p-6 rounded-lg shadow-lg">
      {/* Background Decorations */}
      <div className="absolute left-0 right-0 w-full justify-start">
        <div className="absolute left-0 -top-[70px] text-left -z-10 opacity-30">
          <img src="/images/decor1.png" alt="Left Decoration" className="w-40 h-auto" />
        </div>
        <div className="absolute -top-[100px] right-0 -z-10 opacity-30">
          <img src="/images/decor2.png" alt="Right Decoration" className="w-40 h-auto" />
        </div>
      </div>

      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <img src="/images/tealerin-milktea-logo.png" alt="Tealerin Milktea Logo" className="w-24 h-24 rounded-full" />
        </div>
        <SectionHeaders
          subHeader="Refreshing Flavors Await"
          mainHeader="Welcome to Tealerin Milktea"
        />
      </div>
    </section>
  );
}
