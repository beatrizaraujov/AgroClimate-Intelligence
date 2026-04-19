export async function getProducaoSoja(sigla: string = "BR") {
  const codigoArea = CODIGOS_IBGE[sigla.toUpperCase()] || "1";
  const nivelTerritorial = sigla.toUpperCase() === "BR" ? "N1" : "N3";

  try {
    const url = `https://servicodados.ibge.gov.br/api/v3/agregados/1612/periodos/2023/variaveis/214?localidades=${nivelTerritorial}[${codigoArea}]&classificacao=31[3939]`;

   
    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
        throw new Error(`Erro IBGE: ${response.status}`);
    }
    
    const data = await response.json();

    if (!data || !data[0]) return null;

    const valorBruto = data[0].resultados[0].series[0].serie["2023"];
    const valorFormatado = (Number(valorBruto) / 1000000).toFixed(1);

    return {
      valor: valorFormatado,
      unidade: "M Ton",
      safra: "2023"
    };
  } catch (error) {
    console.error("Erro no serviço IBGE:", error);
    return null; 
  }
}