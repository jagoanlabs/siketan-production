import HomeLayout from "../../../layouts/HomeLayout";
import { Footer } from "../components/Footer";
import { Hero } from "../components/Hero";
import { Navbar } from "../../../components/NavBar";
import { SectionInfoPertanian } from "../components/SectionInfoPertanian";
import { SectionTokoPertanian } from "../components/SectionTokoPertanian";
import { SectionDataPertanian } from "../components/SectionDataPertanian";
import { HeroCard } from "../components/HeroCard";
function HomePage() {
  return (
    <>
      <HomeLayout>
        <Navbar index={0} />
        <Hero />
        <div className="px-2 mt-5 mb-20 lg:hidden">
          <HeroCard />
        </div>
        <SectionDataPertanian />
        <SectionInfoPertanian />
        <SectionTokoPertanian />
      </HomeLayout>
      <Footer />
    </>
  );
}

export default HomePage;
