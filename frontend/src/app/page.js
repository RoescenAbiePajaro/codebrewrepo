//src\app\page.js
import Hero from "@/components/layout/Hero";
import HomeMenu from "@/components/layout/HomeMenu";
import SectionHeaders from "@/components/layout/SectionHeaders";

export default function Home() {
  return (
    <>
      <Hero />
      <HomeMenu />
      <section className="text-center my-16" id="about">
        <SectionHeaders
          subHeader={''}
          mainHeader={''}
        />
        
      </section>
      <section className="text-center my-8" id="contact">
        <SectionHeaders
          subHeader={''}
          mainHeader={''}
        />
      </section>
    </>
  )
}