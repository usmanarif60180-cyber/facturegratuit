import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, User, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { languages } from "../mock";

export default function Navbar({ dark, setDark }) {
  const [lang, setLang] = useState(languages[0]);
  useLocation();

  const navLinks = [
    { label: "Tableau de bord", to: "/dashboard" },
    { label: "Factures", to: "/invoices" },
    { label: "Clients", to: "/clients" },
    { label: "Paramètres", to: "/settings" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/70 dark:bg-neutral-950/70 border-b border-neutral-200/60 dark:border-neutral-800/60">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center font-semibold text-sm shadow-md shadow-indigo-500/30">PA</div>
          <span className="font-semibold text-neutral-900 dark:text-neutral-50">ProFacture AI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link key={l.label} to={l.to} className="px-3.5 py-2 text-sm text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded-md hover:bg-neutral-100/80 dark:hover:bg-neutral-800/60 transition-colors">{l.label}</Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              <span>{lang.flag}</span>
              <span className="font-medium">{lang.name}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {languages.map((l) => (
                <DropdownMenuItem key={l.name} onClick={() => setLang(l)} className="gap-2 cursor-pointer">
                  <span>{l.flag}</span> <span>{l.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button onClick={() => setDark(!dark)} aria-label="Toggle theme" className="h-9 w-9 rounded-full flex items-center justify-center border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
            {dark ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-neutral-700" />}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger className="h-9 w-9 rounded-full flex items-center justify-center bg-gradient-to-br from-sky-400 to-indigo-500 text-white">
              <User className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem className="cursor-pointer">Sign in</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Create one</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
