import { Link, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { NAV, SITE } from "~/site";

/** Three ruled lines on a page, the last one marked. */
function Mark() {
  return (
    <span
      aria-hidden="true"
      className="grid h-9 w-9 shrink-0 content-center justify-items-start gap-[3px] rounded-[4px] border border-[#C2283C]/60 bg-[#1C2942] pl-[7px]"
    >
      <span className="block h-[2px] w-[18px] rounded-full bg-white/70" />
      <span className="block h-[2px] w-[13px] rounded-full bg-white/70" />
      <span className="block h-[2px] w-[9px] rounded-full bg-[#C2283C]" />
    </span>
  );
}

export function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  // The SPA shell is prerendered at "/", so the first client render must match
  // it. Only mark the current page once we are mounted.
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Close the mobile panel whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (to: string) =>
    mounted && (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <header className="sticky top-0 z-50 bg-[#111A2E] text-white">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6" aria-label="Main">
        <div className="flex h-[68px] items-center justify-between gap-6">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-2.5 rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C2283C]"
          >
            <Mark />
            <span className="font-serif text-[22px] font-semibold leading-none tracking-[-0.01em]">
              {SITE.name}
            </span>
          </Link>

          {/* Links */}
          <ul className="hidden items-center gap-1 md:flex">
            {NAV.map(({ to, label }) => {
              const active = isActive(to);
              return (
                <li key={to}>
                  <Link
                    to={to}
                    aria-current={active ? "page" : undefined}
                    className={`relative flex h-[68px] items-center px-3.5 text-[14.5px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#C2283C] ${
                      active ? "font-medium text-white" : "text-[#9BA7BF] hover:text-white"
                    }`}
                  >
                    {label}
                    {/* Always rendered so the markup matches on hydration. */}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-3 bottom-0 h-[3px] bg-[#C2283C] ${
                        active ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Action */}
          <div className="flex items-center gap-2">
            <Link
              to="/analyze-resume"
              className="hidden rounded-[4px] bg-[#C2283C] px-4 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#A81F32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:block"
            >
              Analyze my resume
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="-mr-2 grid h-10 w-10 place-items-center rounded-[4px] text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C2283C] md:hidden"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
                {open ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <>
                    <path d="M4 7h16" />
                    <path d="M4 12h16" />
                    <path d="M4 17h16" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile panel */}
      {open && (
        <div id="mobile-nav" className="border-t border-white/10 bg-[#1C2942] md:hidden">
          <ul className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
            {NAV.map(({ to, label }) => {
              const active = isActive(to);
              return (
                <li key={to}>
                  <Link
                    to={to}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center justify-between border-l-[3px] py-3.5 pl-4 text-[15px] ${
                      active
                        ? "border-[#C2283C] font-medium text-white"
                        : "border-transparent text-[#AFB9CD]"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
            <li className="px-0 py-3">
              <Link
                to="/analyze-resume"
                className="block rounded-[4px] bg-[#C2283C] px-4 py-3 text-center text-[15px] font-semibold text-white"
              >
                Analyze my resume
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
