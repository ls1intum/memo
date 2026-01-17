import { Outlet } from 'react-router-dom';
import { Navbar } from './navbar';
import { Footer } from './footer';

export function Layout() {
  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-[#d7e3ff] via-[#f3f5ff] to-[#e8ecff] dark:bg-slate-950">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_rgba(237,242,255,0.55))]" />
      <Navbar />
      <div className="flex-1 flex flex-col w-full">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
