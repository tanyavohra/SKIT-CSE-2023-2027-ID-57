// src/pages/Dashboard.jsx
//
// Landing page shown after login / registration. The header and footer come
// from AppLayout, so this file only contains the page content.

import { Link } from "react-router-dom";
import { ArrowRight, Brain, BadgeCheck, GraduationCap, Network, UserSearch, Users } from "lucide-react";

const FEATURES = [
  {
    icon: Brain,
    title: "Peer & Executive Mentorship",
    text: "Pair with seasoned alumni working at frontier organizations for career roadmap consultations and interview preparation.",
  },
  {
    icon: Users,
    title: "Global Chapter Events",
    text: "Participate in curated meetups, venture showcases, and annual homecoming ceremonies hosted both locally and virtually.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Credentials",
    text: "Connect within a trusted enclave of verified alumni, university faculty, and current department cohorts.",
  },
];

export default function Dashboard() {
  return (
    <div className="relative isolate overflow-hidden py-12 md:py-24">
      {/* Soft background glows */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-[#dbe1ff]/30 rounded-full blur-[140px] opacity-70" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[400px] bg-[#dce9ff]/60 rounded-full blur-[100px] opacity-80" />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-6 w-full">
        {/* Hero */}
        <section className="relative w-full max-w-4xl mx-auto rounded-xl bg-gradient-to-br from-[#131b2e] via-[#213145] to-[#0a234f] text-white shadow-xl overflow-hidden border border-[#0051d5]/30 p-8 sm:p-12 md:p-16">
          <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-[#316bf3]/20 blur-3xl pointer-events-none" />
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

          <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#0051d5]/30 border border-[#b4c5ff]/30 backdrop-blur-md text-[#b4c5ff] text-xs font-semibold mb-6 shadow-sm">
              <Network size={16} />
              <span>Bridging Generations &amp; Careers</span>
            </div>

            <h1 className="text-[28px] leading-9 md:text-[40px] md:leading-[48px] font-bold tracking-tight text-white mb-4">
              Connecting Our Past, Empowering Every Future
            </h1>

            <p className="text-[15px] md:text-lg text-[#d3e4fe] max-w-xl mx-auto leading-relaxed mb-8">
              Alumni Connect bridges past graduates with current students to cultivate meaningful
              mentorship, open career avenues, coordinate industry symposiums, and sustain lifelong
              community bonds across the globe.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link
                to="/alma-mater"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#0051d5] hover:bg-[#316bf3] text-white font-semibold text-base px-8 py-3.5 rounded-lg shadow-md transition-all active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-[#b4c5ff]/40"
              >
                <GraduationCap size={22} className="group-hover:rotate-6 transition-transform" />
                <span>Alma Mater</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/directory"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white/80 hover:text-white font-semibold text-base px-6 py-3.5 rounded-lg border border-white/15 hover:bg-white/10 transition-colors"
              >
                <UserSearch size={20} />
                <span>Explore Directory</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature cards */}
        <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="bg-white border border-[#c6c6cd]/40 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-[#c6c6cd] transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-lg bg-[#eff4ff] text-[#0051d5] flex items-center justify-center mb-4 border border-[#c6c6cd]/20">
                <Icon size={24} />
              </div>
              <h3 className="text-base font-bold text-[#0b1c30] mb-1">{title}</h3>
              <p className="text-[13px] leading-5 text-[#45464d]">{text}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}