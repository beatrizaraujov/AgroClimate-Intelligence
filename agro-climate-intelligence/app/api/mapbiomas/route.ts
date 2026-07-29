import { NextResponse } from "next/server";

const MAPBIOMAS_API = "https://plataforma.alerta.mapbiomas.org/api/v2/graphql";

// Query fixa e definida no servidor: o endpoint nunca repassa o corpo da
// requisição do cliente, evitando que esta rota seja usada como um proxy
// aberto para a API do MapBiomas usando o token secreto do servidor.
const ALERTS_QUERY = `
  query {
    alerts(limit: 500) {
      collection {
        id
        alertCode
        areaHa
        crossedStates
        publishedAt
      }
    }
  }
`;

export const revalidate = 300;

export async function GET() {
  try {
    const response = await fetch(MAPBIOMAS_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MAPBIOMAS_TOKEN}`,
      },
      body: JSON.stringify({ query: ALERTS_QUERY }),
      next: { revalidate },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[API Proxy] Erro ao chamar MapBiomas:", error);
    return NextResponse.json(
      { error: "Falha ao conectar com MapBiomas" },
      { status: 502 }
    );
  }
}
