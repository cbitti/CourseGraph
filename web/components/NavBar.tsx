'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

type Item = { href: string; label: string; match?: RegExp };

const ITEMS: Item[] = [
  { href: '/', label: 'Home', match: /^\/$/ },
  { href: '/courses', label: 'Courses', match: /^\/courses/ },
  { href: '/graph', label: 'Graph', match: /^\/graph/ },
  { href: '/plan', label: 'Planner', match: /^\/plan/ },   // ← added
  { href: '/docs', label: 'API Docs', match: /^\/docs/ },
];

function NavLink({ item, pathname }: { item: Item; pathname: string }) {
  const active = item.match ? item.match.test(pathname) : pathname === item.href;
  return (
    <Link
      href={item.href}
      aria-current={active ? 'page' : undefined}
      className={[
        'px-3 py-2 rounded-lg text-sm transition',
        active ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100',
      ].join(' ')}
    >
      {item.label}
    </Link>
  );
}

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:m-2 focus:rounded-md focus:bg-black focus:px-3 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between py-3">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="font-semibold tracking-tight text-lg">
              CourseGraph
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {ITEMS.map((it) => (
                <NavLink key={it.href} item={it} pathname={pathname} />
              ))}
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Link
              href="/courses"
              className="px-3 py-2 rounded-lg text-sm text-white bg-emerald-500 hover:bg-emerald-600"
            >
              Open demo
            </Link>
            <a
              href="https://github.com/cbitti/CourseGraph"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
            >
              GitHub
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden px-3 py-2 rounded-lg border hover:bg-gray-50"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-3">
            <nav className="flex flex-col gap-1">
              {ITEMS.map((it) => (
                <NavLink key={it.href} item={it} pathname={pathname} />
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
