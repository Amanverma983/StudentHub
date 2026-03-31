import Navbar from '@/components/ui/Navbar';
import Hero from '@/components/landing/Hero';

export const metadata = {
  title: 'StudentHub — Earn. Build. Grow.',
};

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
    </>
  );
}
