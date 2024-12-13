'use client';

import SectionHeaders from "@/components/layout/SectionHeaders";

const features = [
  {
    imgSrc: "/3.jpg",
    alt: "Fresh Ingredients",
    title: "Fresh Ingredients",
    description: "We use only the freshest ingredients in our drinks."
  },
  {
    imgSrc: "/1.jpg",
    alt: "Customizable Drinks",
    title: "Customizable Drinks",
    description: "Create your perfect drink just the way you like it."
  },
  {
    imgSrc: "/2.jpg",
    alt: "Relaxing Ambiance",
    title: "Relaxing Ambiance",
    description: "Enjoy your drink in a cozy and relaxing environment."
  },
  {
    imgSrc: "/4.jpg",
    alt: "Always Ready to Serve",
    title: "Always Ready to Serve",
    description: "Enjoy your drink in a cozy and relaxing environment."
  },
  {
    imgSrc: "/5.jpg",
    alt: "Family Friendly",
    title: "Family Friendly",
    description: "Enjoy your drink in a cozy and relaxing environment."
  },
  {
    imgSrc: "/6.jpg",
    alt: "Sales for You",
    title: "Sales for You",
    description: "Enjoy your drink in a cozy and relaxing environment."
  }
];

export default function HomeMenu() {
  return (
    <section className="relative min-h-screen w-full bg-gradient-to-br from-green-400 via-green-500 to-green-600 p-8 rounded-lg shadow-lg text-white overflow-hidden flex flex-col justify-center items-center">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-white/20 rounded-full blur-3xl transform -translate-x-10 -translate-y-10"></div>
      <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/10 rounded-full blur-3xl transform translate-x-16 translate-y-16"></div>
      <div className="absolute inset-0 w-full h-full bg-pattern bg-opacity-10 pointer-events-none"></div>

      {/* New Aesthetic Overlay */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-600 to-green-700 opacity-30 animate-pulse pointer-events-none"></div>

      {/* Header Section */}
      <div className="text-center mb-10 relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="/tealerinlogo.png"
            alt="Tealerin Milktea Logo"
            className="w-32 h-32 rounded-full shadow-xl hover:scale-105 transition-transform duration-300"
          />
        </div>
        {/* Section Headers */}
        <SectionHeaders
          subHeader="Refreshing Flavors Await"
          mainHeader={<span className="text-white">Welcome to Tealerin Milktea</span>} 
        />
      </div>

      {/* Feature List with Images */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 mb-10">
        {features.map((feature, index) => (
          <div key={index} className="p-4 bg-white/10 rounded-lg text-center shadow-lg transition-transform duration-300 hover:scale-105">
            <img
              src={feature.imgSrc}
              alt={feature.alt}
              className="w-full h-40 object-cover rounded-lg mb-4 shadow-md"
            />
            <h3 className="text-lg font-semibold">{feature.title}</h3>
            <p className="text-sm">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      
    </section>
  );
}