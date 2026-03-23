import { Outlet } from 'react-router-dom';
import { Navbar } from './navbar';
import { Footer } from './footer';

export function Layout() {
  return (
    <div className="relative min-h-[calc(100vh+3rem)] flex flex-col bg-gradient-to-br from-[#d7e3ff] via-[#f3f5ff] to-[#e8ecff] dark:from-[#0f1729] dark:via-[#111b30] dark:to-[#0f1729]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_rgba(237,242,255,0.55))] dark:bg-[radial-gradient(circle_at_top,_rgba(20,30,60,0.9),_rgba(15,23,41,0.55))]" />
      <Navbar />
      <div className="flex-1 flex flex-col w-full">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
