import { tr } from "date-fns/locale";
import { ArrowRight, Home, TriangleAlert, Upload, Users2 } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
 
const roster = [
  { initials: "DC", color: "bg-blue-600" },
  { initials: "RG", color: "bg-violet-600" },
  { initials: "AR", color: "bg-amber-600" },
  { initials: "JB", color: "bg-emerald-600" },
  { initials: "ML", color: "bg-pink-600" },
  { initials: "KS", color: "bg-cyan-600" },
];
 
const features = [
  {
    icon: Users2,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    title: "Client records that follow the person",
    body: "Intake, housing status, and case notes stay attached to each client, not scattered across whoever last updated the file.",
  },
  {
    icon: TriangleAlert,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    title: "Urgent cases surface first",
    body: "A client waiting on a shelter bed or a benefits deadline shows up on the dashboard the moment they're flagged, not buried in a thread.",
  },
  {
    icon: Upload,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    title: "Bring your existing spreadsheet",
    body: "Upload a CSV of current clients and the tracker maps it into records, no re-typing a caseload you've already built.",
  },
];
 
const stats = [
  { n: "4", l: "Total clients tracked" },
  { n: "2", l: "Urgent cases due" },
  { n: "4", l: "Follow-ups this month" },
  { n: "5", l: "Housed this year" },
];
 
function NavBar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-blue-600">
            <Home className="h-4 w-4 text-white" strokeWidth={2} />
          </div>
          <span className="text-sm font-bold text-slate-900">
            Shelter Resource Tracker
          </span>
        </div>
 
        <div className="hidden gap-8 text-sm font-medium text-slate-500 md:flex">
          <a href="#features" className="hover:text-slate-900">Features</a>
          <a href="#how" className="hover:text-slate-900">How it works</a>
          <a href="#trust" className="hover:text-slate-900">Who it's for</a>
        </div>
 
        <div className="flex items-center gap-2.5">
          <a href="#" className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-900">
            Sign in
          </a>
          <a href="#" className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-800">
            Request a demo
          </a>
        </div>
      </div>
    </nav>
  );
}
 
function Hero() {
  return (
    <header className="px-8 pt-12 pb-24 border-b border-slate-200">
      <div className="mx-auto max-w-3xl text-center">
        <span className="mb-lg inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-800">
          Case Management client and resource tracker
        </span>
 
        <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl">
          Manage shelter clients, referrals, notes, and <em className="italic text-blue-600">next steps</em>.
        </h1>
 
        <p className="mx-auto mt-lg text-center text-lg leading-relaxed text-slate-500">
          Keep intake, follow-ups, and urgent flags organized in one shared dashboard.
        </p>
 
        <div className="mt-12 mb-12 flex flex-wrap justify-center gap-3">
          <a
            href="mailto:massoncorlette07@gmail.com"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-800"
          >
            Request a demo
          </a>
          <Link
            to={'/dashboard'}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-900"
          >
            Try the live demo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
 
        <div className="mt-lg flex justify-center -space-x-2">
          {roster.map((c) => (
            <div
              key={c.initials}
              className={`flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-slate-50 text-[13px] font-bold text-white shadow ${c.color}`}
            >
              {c.initials}
            </div>
          ))}
        </div>
        <p className="mt-lg text-center text-xs text-slate-500">
          Track follow-ups, referrals, flags, housing status, notes, and client history in one place.
        </p>
      </div>
 
      {/* Dashboard preview mock */}
      <div className="mx-auto mt-lg max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
        <div className="bg-gradient-to-br from-blue-800 via-blue-600 to-blue-400 px-6 py-5 text-white">
          <div className="text-[11px] uppercase tracking-wider text-white/70">
            Good morning
          </div>
          <div className="mt-0.5 text-lg font-extrabold">Welcome back, User</div>
        </div>
        <div className="grid grid-cols-2 gap-3 p-6 sm:grid-cols-4">
          {stats.slice(0, 4).map((s) => (
            <div
              key={s.l}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5"
            >
              <div className="text-xl font-extrabold text-slate-900">{s.n}</div>
              <div className="mt-0.5 text-[11px] text-slate-500">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
 
function Features() {
  return (
    <section id="features" className="px-8 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-12 max-w-6xl text-center">
          <span className="mb-3 block text-xs font-bold uppercase tracking-wider text-blue-600">
            What it does
          </span>
          <h2 className="text-2xl text-left font-semibold text-slate-900">
            One place for the work behind every case
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            Track follow-ups, referrals, urgent flags, housing status, notes, and client history without scattered spreadsheets or paper reminders.
          </p>
        </div>
 
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <div
                className={`mb-4 flex h-10 w-10 items-center justify-center rounded-[11px] ${f.iconBg}`}
              >
                <f.icon className={`h-5 w-5 ${f.iconColor}`} strokeWidth={2} />
              </div>
              <h3 className="text-base text-left font-bold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
 
function StatsBand() {
  return (
    <section id="how" className="px-6 pb-14">
      <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-8">
        <div className="grid gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.l}
              className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-6 text-center"
            >
              <div className="text-3xl font-semibold tracking-tight text-slate-900">
                {s.n}
              </div>
              <div className="mt-2 text-sm font-medium text-slate-500">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function Quote() {
  return (
    <section id="trust" className="px-8 pb-24 pt-10">
      <div className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-slate-200/70 bg-white px-10 py-16 text-center shadow-sm">
        
        <img
          src="/demo-graphic.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none hidden md:block absolute bottom-8 -left-12 w-full opacity-20"
        />

        <img
          src="/demo-graphic.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none hidden md:block absolute -left-12 w-full opacity-20"
        />


        <div className="relative z-10">
          <p className="text-2xl italic font-medium leading-snug text-slate-900">
            "Instead of scattered notes and manual check-ins, every client’s progress,
            follow-ups, and case notes live in one shared dashboard."
          </p>

          <div className="mt-5 text-right text-sm text-slate-500">
            — Case manager, regional shelter network
          </div>
        </div>
      </div>
    </section>
  );
}

 
function CTABand( ) {
  return (
    <section className="px-8 pb-24">
      <div className="mx-auto max-w-6xl rounded-3xl bg-gradient-to-br from-blue-800 via-blue-600 to-blue-400 px-10 py-16 text-center text-white">
        <h2 className="text-3xl text-white font-semibold">
          Bring your caseload into one dashboard
        </h2>
        <p className="mx-auto mt-3 text-center text-sm text-white/85">
          Setup takes an afternoon, not a migration project. Start with a CSV or
          a handful of manual entries.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="mailto:massoncorlette07@gmail.com"
            className="rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-blue-800"
          >
            Request a demo
          </Link>
          <Link
            to={'/dashboard'}
            className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-bold text-white hover:bg-orange"
          >
            Try it live <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
 
function Footer() {
  return (
    <footer className="border-t border-slate-200 px-8 py-10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-slate-900">
            <Home className="h-3.5 w-3.5 text-white" strokeWidth={2} />
          </div>
          <span className="text-sm font-bold text-slate-900">
            Shelter Resource Tracker
          </span>
        </div>
        <div className="flex gap-5 text-sm text-slate-500">
          <a href="https://github.com/mass0n30" className="hover:text-slate-900">GitHub</a>
          <a href="https://linkedin.com/in/masson-corlette" className="hover:text-slate-900">LinkedIn</a>
          <a href="#" className="hover:text-slate-900">Privacy</a>
        </div>
        <div className="text-xs text-slate-500">
          Designed and built by Masson Corlette
        </div>
      </div>
    </footer>
  );
}
 
export default function LandingPage() {


  return (
    <div className="min-h-screen bg-background font-sans">
      <NavBar />
      <Hero />
      <Features />
      <StatsBand />
      <Quote />
      <CTABand />
      <Footer />
    </div>
  );
}