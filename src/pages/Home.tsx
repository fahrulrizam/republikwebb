import Hero from '../components/Hero';
import About from '../components/About';
import Positions from '../components/Positions';
import ApplicationForm from '../components/ApplicationForm';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Positions />
      <ApplicationForm />
      <Gallery />
      <Testimonials />
      <FAQ />
      <Contact />
    </>
  );
}
