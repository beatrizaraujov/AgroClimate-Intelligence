"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
export default function Header() {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);

  return (
    <section className="bg-white w-full border-b border-slate-100 py-4 relative z-50">
      <div className="flex justify-between px-4 max-w-7xl mx-auto items-center">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Ícone" className="w-8 h-8" />
          <img
            src="/agroClimate.svg"
            alt="AgroClimate"
            className="h-10 hidden md:block"
          />
        </div>

        <div className="hidden md:flex gap-8">
          <Link
            href="/impactoAgricola"
            className={`text-sm font-medium transition-colors relative py-1 ${
              pathname === "/impactoAgricola" ? "text-black" : "text-[#64748B]"
            }`}
          >
            impacto agrícola
            {pathname === "/impactoAgricola" && (
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-emerald-500 rounded-full" />
            )}
          </Link>

          <Link
            href="/dashboard"
            className={`text-sm font-medium transition-colors relative py-1 ${
              pathname === "/dashboard" ? "text-black" : "text-[#64748B]"
            }`}
          >
            dashboard
            {pathname === "/dashboard" && (
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-emerald-500 rounded-full" />
            )}
          </Link>

          <Link
            href="/comparativo"
            className={`text-sm font-medium transition-colors relative py-1 ${
              pathname === "/comparativo" ? "text-black" : "text-[#64748B]"
            }`}
          >
            comparativo
          </Link>

          <Link
            href="/metodologia"
            className={`text-sm font-medium transition-colors relative py-1 ${
              pathname === "/metodologia" ? "text-black" : "text-[#64748B]"
            }`}
          >
            metodologia
          </Link>
        </div>

        <div className="md:flex-none  md:mx-0 md:max-w-xs flex flex-1 justify-center items-center rounded-full bg-[#F1F5F9] px-4 py-2 gap-2 border border-transparent focus-within:border-emerald-500/30 focus-within:bg-white transition-all max-w-[200px] mx-auto">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por estado..."
            className="bg-transparent outline-none text-sm text-slate-600 placeholder:text-slate-400 w-32"
          />
        </div>
        <button
          onClick={() => setAberto(!aberto)}
          className="md:hidden z-[110] relative"
        >
          {aberto ? (
            <X size={28} className="text-slate-600" />
          ) : (
            <Menu size={28} className="text-slate-600" />
          )}
        </button>
        {aberto && (
          <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center gap-8 md:hidden animate-in fade-in zoom-in-95">
            <Link
              href="/impactoAgricola"
              onClick={() => setAberto(false)}
              className={`text-2xl font-medium transition-colors relative py-1 ${
                pathname === "/impactoAgricola"
                  ? "text-black"
                  : "text-[#64748B]"
              }`}
            >
              impacto agrícola
              {pathname === "/impactoAgricola" && (
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-emerald-500 rounded-full" />
              )}
            </Link>

            <Link
              href="/dashboard"
              onClick={() => setAberto(false)}
              className={`text-2xl font-medium transition-colors relative py-1 ${
                pathname === "/dashboard" ? "text-black" : "text-[#64748B]"
              }`}
            >
              dashboard
              {pathname === "/dashboard" && (
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-emerald-500 rounded-full" />
              )}
            </Link>

            <Link
              href="/comparativo"
              onClick={() => setAberto(false)}
              className={`text-2xl font-medium transition-colors relative py-1 ${
                pathname === "/comparativo" ? "text-black" : "text-[#64748B]"
              }`}
            >
              comparativo
            </Link>

            <Link
              href="/metodologia"
              onClick={() => setAberto(false)}
              className={`text-2xl font-medium transition-colors relative py-1 ${
                pathname === "/metodologia" ? "text-black" : "text-[#64748B]"
              }`}
            >
              metodologia
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
