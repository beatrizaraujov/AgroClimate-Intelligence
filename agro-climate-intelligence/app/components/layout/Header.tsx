"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

interface EstadoIBGE {
  nome: string;
  sigla: string;
}

interface HeaderProps {
  onSelectEstado?: (sigla: string) => void;
}

export default function Header({ onSelectEstado }: HeaderProps) {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);
  const [pesquisa, setPesquisa] = useState("");
  const [todosEstados, setTodosEstados] = useState<EstadoIBGE[]>([]);
  const [sugestoes, setSugestoes] = useState<EstadoIBGE[]>([]);

  useEffect(() => {
    const carregarEstados = async () => {
      try {
        const response = await fetch(
          "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
        );
        if (!response.ok) throw new Error("Falha na rede");
        const dados = await response.json();
        
        const listaFormatada = dados.map((est: any) => ({
          nome: est.nome,
          sigla: est.sigla,
        }));
        setTodosEstados(listaFormatada);
      } catch (error) {
        console.error("Erro ao buscar IBGE:", error);
      }
    };
    carregarEstados();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (pesquisa.trim().length > 0) {
        const filtrados = todosEstados.filter((estado) =>
          estado.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
          estado.sigla.toLowerCase().includes(pesquisa.toLowerCase())
        );
        setSugestoes(filtrados.slice(0, 5)); 
      } else {
        setSugestoes([]);
      }
    }, 300); 

    return () => clearTimeout(timer); 
  }, [pesquisa, todosEstados]);

  const selecionarEstado = (estado: EstadoIBGE) => {
    setPesquisa(""); 
    setSugestoes([]);
    
    if (onSelectEstado) {
      onSelectEstado(`BR${estado.sigla}`);
    }
    
    console.log(`[AgroClimate] Focando no mapa: ${estado.sigla}`);
  };

  // --- FUNÇÃO PARA O ENTER ---
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && sugestoes.length > 0) {
      // Se apertar Enter, seleciona o primeiro da lista de sugestões automaticamente
      selecionarEstado(sugestoes[0]);
    }
  };

  return (
    <section className="bg-white w-full border-b border-slate-100 py-4 relative z-50">
      <div className="flex justify-between px-4 max-w-7xl mx-auto items-center">
        
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Ícone" className="w-8 h-8 cursor-pointer" />
          <img src="/agroClimate.svg" alt="AgroClimate" className="h-10 hidden md:block" />
        </div>

        <nav className="hidden md:flex gap-8">
          {["impactoAgricola", "dashboard", "comparativo", "metodologia"].map((item) => (
            <Link
              key={item}
              href={`/${item}`}
              className={`text-sm font-medium transition-colors relative py-1 ${
                pathname === `/${item}` ? "text-black" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {item === "impactoAgricola" ? "impacto agrícola" : item}
              {pathname === `/${item}` && (
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-emerald-500 rounded-full animate-in slide-in-from-left-full duration-300" />
              )}
            </Link>
          ))}
        </nav>

        {/* Barra de Busca com Suporte a Teclado */}
        <div className="relative md:flex-none md:mx-0 md:max-w-xs flex flex-1 justify-center items-center rounded-full bg-slate-100 px-4 py-2 gap-2 border border-transparent focus-within:border-emerald-500/30 focus-within:bg-white focus-within:shadow-sm transition-all max-w-[220px] mx-auto">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            onKeyDown={handleKeyDown} // <-- O SEGREDO ESTÁ AQUI
            placeholder="Buscar estado..."
            className="bg-transparent outline-none text-sm text-slate-600 placeholder:text-slate-400 w-full"
          />

          {sugestoes.length > 0 && (
            <div className="absolute top-[120%] left-0 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden py-2 z-[60] animate-in fade-in zoom-in-95 duration-200">
              <p className="px-4 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sugestões</p>
              {sugestoes.map((estado) => (
                <button
                  key={estado.sigla}
                  onClick={() => selecionarEstado(estado)}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center justify-between"
                >
                  {estado.nome}
                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-400">{estado.sigla}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button onClick={() => setAberto(!aberto)} className="md:hidden z-[110] p-2 -mr-2">
          {aberto ? <X size={24} className="text-slate-600" /> : <Menu size={24} className="text-slate-600" />}
        </button>

        {/* Menu Mobile */}
        {aberto && (
          <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center gap-10 md:hidden animate-in fade-in slide-in-from-bottom-5">
             <img src="/logo.svg" alt="Ícone" className="w-12 h-12 mb-4" />
            {["impactoAgricola", "dashboard", "comparativo", "metodologia"].map((item) => (
               <Link
               key={item}
               href={`/${item}`}
               onClick={() => setAberto(false)}
               className={`text-2xl font-semibold ${
                 pathname === `/${item}` ? "text-emerald-600" : "text-slate-400"
               }`}
             >
               {item === "impactoAgricola" ? "Impacto Agrícola" : item.charAt(0).toUpperCase() + item.slice(1)}
             </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}