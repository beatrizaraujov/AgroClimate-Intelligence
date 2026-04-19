export default function Header() {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 sm:gap-0">
      <div className="w-full sm:w-auto">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Dashboard Principal
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Dados consolidados do mercado agrícola brasileiro e impacto ambiental.
        </p>
      </div>
      
      
    
    </header>
  );
}