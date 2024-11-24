'use client';

import SectionHeaders from "@/components/layout/SectionHeaders";

export default function HomeMenu() {
  return (
    <section className="relative bg-gradient-to-br from-green-400 via-green-500 to-green-600 p-6 rounded-lg shadow-lg text-white overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-white/20 rounded-full blur-3xl transform -translate-x-10 -translate-y-10"></div>
      <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/10 rounded-full blur-3xl transform translate-x-16 translate-y-16"></div>
      <div className="absolute inset-0 w-full h-full bg-pattern bg-opacity-10 pointer-events-none"></div>

      {/* Header Section */}
      <div className="text-center mb-8 relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="/tealerinlogo.png"
            alt="Tealerin Milktea Logo"
            className="w-24 h-24 rounded-full shadow-xl hover:scale-105 transition-transform duration-300"
          />
        </div>
        {/* Section Headers */}
        <SectionHeaders
          subHeader="Refreshing Flavors Await"
          mainHeader="Welcome to Tealerin Milktea"
        />
      </div>

      {/* Feature List with Images */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <div className="p-4 bg-white/10 rounded-lg text-center shadow-lg transition-transform duration-300 hover:scale-105">
          <img
            src="/images/fresh-ingredients.jpg"
            alt="Fresh Ingredients"
            className="w-full h-40 object-cover rounded-lg"
          />
        </div>
        <div className="p-4 bg-white/10 rounded-lg text-center shadow-lg transition-transform duration-300 hover:scale-105">
          <img
            src="/images/customizable-drinks.jpg"
            alt="Customizable Drinks"
            className="w-full h-40 object-cover rounded-lg"
          />
        </div>
        <div className="p-4 bg-white/10 rounded-lg text-center shadow-lg transition-transform duration-300 hover:scale-105">
          <img
            src="/images/relaxing-ambiance.jpg"
            alt="Relaxing Ambiance"
            className="w-full h-40 object-cover rounded-lg"
          />
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-8 text-center">
      </div>
    </section>
  );
}
