import React from "react";
import './index.css';

const ITEMS_URL = "https://raw.githubusercontent.com/ao-data/ao-bin-dumps/master/items.json";
const API_BASE = "https://www.albion-online-data.com/api/v2/stats";
const CAERLEON = "Caerleon";

function getItemName(item) {
  return item.LocalizedNames?.['PT-BR'] || item.LocalizedNames?.['EN-US'] || item.UniqueName;
}

function chunkArray(arr, size) {
  const res = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}

export default function App() {
  const [flips, setFlips] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  async function loadFlips() {
    setLoading(true);
    setError(null);
    try {
      // 1. Buscar todos os itens
      const itemsRes = await fetch(ITEMS_URL);
      const items = await itemsRes.json();
      // Filtrar apenas itens comerciáveis (com SellPriceMin ou BuyPriceMax)
      const itemIds = items.map(i => i.UniqueName).filter(Boolean);
      // 2. Buscar preços em lote (API permite muitos itens por vez)
      const chunkSize = 100; // Para evitar URLs muito grandes
      let marketData = [];
      for (const chunk of chunkArray(itemIds, chunkSize)) {
        const url = `${API_BASE}/prices/${chunk.join(",")}.json?locations=${CAERLEON}`;
        const res = await fetch(url);
        const data = await res.json();
        marketData = marketData.concat(data);
      }
      // 3. Buscar preços do Black Market
      let bmData = [];
      for (const chunk of chunkArray(itemIds, chunkSize)) {
        const url = `${API_BASE}/blackmarket/${chunk.join(",")}.json`;
        const res = await fetch(url);
        const data = await res.json();
        bmData = bmData.concat(data);
      }
      // 4. Mapear para {item, marketSell, bmBuy, lucro}
      const bmMap = {};
      bmData.forEach(bm => {
        if (!bmMap[bm.item_id]) bmMap[bm.item_id] = bm;
      });
      const flipsList = marketData.map(md => {
        const bm = bmMap[md.item_id];
        const lucro = bm && bm.buy_price_max && md.sell_price_min ? bm.buy_price_max - md.sell_price_min : null;
        return {
          id: md.item_id,
          name: getItemName(items.find(i => i.UniqueName === md.item_id) || { UniqueName: md.item_id }),
          marketSell: md.sell_price_min,
          bmBuy: bm?.buy_price_max,
          lucro,
        };
      }).filter(f => f.lucro && f.lucro > 0 && f.marketSell > 0 && f.bmBuy > 0);
      // 5. Ordenar por lucro
      flipsList.sort((a, b) => b.lucro - a.lucro);
      setFlips(flipsList);
    } catch (e) {
      setError("Erro ao carregar dados. Tente novamente.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-900 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">Albion Online Flipper - Caerleon & Black Market</h1>
        <p className="text-sm mt-1">Veja os melhores flips em tempo real. Para dados mais precisos, rode o client do Albion Data Project enquanto navega nos mercados do jogo.</p>
      </div>
      <div className="p-4 flex flex-col items-center">
        <button
          onClick={loadFlips}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold mb-4 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Carregando..." : "Carregar Lista de Flips"}
        </button>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {flips.length > 0 && (
          <div className="overflow-x-auto w-full max-w-5xl">
            <table className="min-w-full border bg-white">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-2 py-1">Item</th>
                  <th className="border px-2 py-1">Venda Caerleon</th>
                  <th className="border px-2 py-1">Compra Black Market</th>
                  <th className="border px-2 py-1">Lucro</th>
                </tr>
              </thead>
              <tbody>
                {flips.slice(0, 100).map(item => (
                  <tr key={item.id}>
                    <td className="border px-2 py-1">{item.name}</td>
                    <td className="border px-2 py-1">{item.marketSell?.toLocaleString() || '-'}</td>
                    <td className="border px-2 py-1">{item.bmBuy?.toLocaleString() || '-'}</td>
                    <td className="border px-2 py-1 text-green-700 font-bold">{item.lucro?.toLocaleString() || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-xs text-gray-500 mt-2">Mostrando os 100 melhores flips. Use o client do Albion Data Project para garantir dados atualizados.</div>
          </div>
        )}
      </div>
    </div>
  );
}
