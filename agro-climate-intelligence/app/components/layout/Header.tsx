"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { getListaEstados, type EstadoIBGE } from "@/services/ibge";

const NAV_ITEMS = ["impactoAgricola", "dashboard", "metodologia"] as const;

const rotuloNav = (item: string) =>
  item === "impactoAgricola" ? "impacto agrícola" : item;

interface IndicatorRect {
  left: number;
  width: number;
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const navLinkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  const [aberto, setAberto] = useState(false);
  const [pesquisa, setPesquisa] = useState("");
  const [todosEstados, setTodosEstados] = useState<EstadoIBGE[]>([]);
  const [sugestoes, setSugestoes] = useState<EstadoIBGE[]>([]);
  const [indiceAtivo, setIndiceAtivo] = useState(-1);
  const [indicator, setIndicator] = useState<IndicatorRect | null>(null);

  useEffect(() => {
    getListaEstados().then(setTodosEstados);
  }, []);

  useEffect(() => {
    const itemAtivo = NAV_ITEMS.find((item) => pathname === `/${item}`);
    const elAtivo = itemAtivo ? navLinkRefs.current.get(itemAtivo) : null;
    setIndicator(elAtivo ? { left: elAtivo.offsetLeft, width: elAtivo.offsetWidth } : null);
  }, [pathname]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (pesquisa.trim().length > 0) {
        const filtrados = todosEstados.filter(
          (estado) =>
            estado.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
            estado.sigla.toLowerCase().includes(pesquisa.toLowerCase())
        );
        setSugestoes(filtrados.slice(0, 5));
        setIndiceAtivo(-1);
      } else {
        setSugestoes([]);
        setIndiceAtivo(-1);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [pesquisa, todosEstados]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSugestoes([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selecionarEstado = (estado: EstadoIBGE) => {
    setPesquisa("");
    setSugestoes([]);
    setIndiceAtivo(-1);
    router.push(`/impactoAgricola?estado=${estado.sigla}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!sugestoes.length) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setIndiceAtivo((i) => (i + 1) % sugestoes.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setIndiceAtivo((i) => (i <= 0 ? sugestoes.length - 1 : i - 1));
        break;
      case "Escape":
        setSugestoes([]);
        setPesquisa("");
        break;
      case "Enter": {
        e.preventDefault();
        const alvo = sugestoes[indiceAtivo] ?? sugestoes[0];
        if (alvo) selecionarEstado(alvo);
        break;
      }
    }
  };

  return (
    <section className="bg-white w-full border-b border-slate-100 py-4 relative z-50">
      <div className="flex justify-between px-4 max-w-7xl mx-auto items-center">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.svg" alt="Ícone AgroClimate" width={32} height={32} className="w-8 h-8 cursor-pointer" />
            <Image src="/agroClimate.svg" alt="AgroClimate" width={0} height={40} className="h-10 w-auto hidden md:block" />
          </Link>
        </div>

        <nav className="hidden md:flex gap-8 relative">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item}
              ref={(el) => {
                if (el) navLinkRefs.current.set(item, el);
                else navLinkRefs.current.delete(item);
              }}
              href={`/${item}`}
              className={`text-sm font-medium transition-colors relative py-1 ${
                pathname === `/${item}` ? "text-black" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {rotuloNav(item)}
            </Link>
          ))}
          {indicator && (
            <div
              className="absolute -bottom-1 h-0.5 bg-emerald-500 rounded-full transition-all duration-300 ease-out"
              style={{ left: indicator.left, width: indicator.width }}
            />
          )}
        </nav>

        <div
          ref={searchRef}
          className="relative md:flex-none md:mx-0 md:max-w-xs flex flex-1 justify-center items-center rounded-full bg-slate-100 px-4 py-2 gap-2 border border-transparent focus-within:border-emerald-500/30 focus-within:bg-white focus-within:shadow-sm transition-all max-w-[220px] mx-auto"
        >
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            role="combobox"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar estado..."
            aria-label="Buscar estado"
            aria-autocomplete="list"
            aria-expanded={sugestoes.length > 0}
            aria-controls="header-search-listbox"
            aria-activedescendant={indiceAtivo >= 0 ? `estado-opcao-${indiceAtivo}` : undefined}
            className="bg-transparent outline-none text-sm text-slate-600 placeholder:text-slate-400 w-full"
          />

          {sugestoes.length > 0 && (
            <ul
              id="header-search-listbox"
              role="listbox"
              className="absolute top-[120%] left-0 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden py-2 z-[60] animate-in fade-in zoom-in-95 duration-200"
            >
              <li className="px-4 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest" aria-hidden="true">
                Sugestões
              </li>
              {sugestoes.map((estado, index) => (
                <li key={estado.sigla} role="presentation">
                  <button
                    id={`estado-opcao-${index}`}
                    role="option"
                    aria-selected={indiceAtivo === index}
                    onClick={() => selecionarEstado(estado)}
                    onMouseEnter={() => setIndiceAtivo(index)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                      indiceAtivo === index
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                  >
                    {estado.nome}
                    <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-400">{estado.sigla}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={() => setAberto(!aberto)}
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={aberto}
          className="md:hidden z-[110] p-2 -mr-2"
        >
          {aberto ? <X size={24} className="text-slate-600" /> : <Menu size={24} className="text-slate-600" />}
        </button>

        <div
          aria-hidden={!aberto}
          inert={!aberto}
          className={`fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center gap-10 md:hidden transition-all duration-300 ease-out ${
            aberto ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <Image src="/logo.svg" alt="Ícone AgroClimate" width={48} height={48} className="w-12 h-12 mb-4" />
          {NAV_ITEMS.map((item) => (
            <Link
              key={item}
              href={`/${item}`}
              onClick={() => setAberto(false)}
              className={`text-2xl font-semibold capitalize transition-colors ${
                pathname === `/${item}` ? "text-emerald-600" : "text-slate-400"
              }`}
            >
              {rotuloNav(item)}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
