import { IntroProvider } from "@/components/IntroProvider";
import { Preloader } from "@/components/Preloader";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Philosophy } from "@/components/Philosophy";
import { Engineering } from "@/components/Engineering";
import { Studio } from "@/components/Studio";
import { Collection } from "@/components/Collection";
import { Finale } from "@/components/Finale";
import { Footer } from "@/components/Footer";
import { ScrollRefresh } from "@/components/ScrollRefresh";

export default function HomePage() {
  return (
    <IntroProvider>
      <Preloader />
      <ScrollRefresh />
      <Header />
      <main id="main">
        <Hero />
        <Philosophy />
        <Engineering />
        <Studio />
        <Collection />
        <Finale />
      </main>
      <Footer />
    </IntroProvider>
  );
}
