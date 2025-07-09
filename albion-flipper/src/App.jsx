import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function Home() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Albion Online Market & Black Market Flipper</h1>
      <p className="mb-2">Acompanhe preços, oportunidades de flip e maximize seus lucros no Albion Online!</p>
      <p className="text-sm text-gray-500">Projeto demo - dados simulados</p>
    </div>
  );
}

function Busca() {
  const [items, setItems] = React.useState([]);
  React.useEffect(() => {
    fetch("http://localhost:3001/api/items")
      .then((res) => res.json())
      .then(setItems);
  }, []);
  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Buscar Itens</h2>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Item</th>
            <th className="border px-2 py-1">Market</th>
            <th className="border px-2 py-1">Black Market</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="border px-2 py-1">{item.name}</td>
              <td className="border px-2 py-1">{item.market.toLocaleString()}</td>
              <td className="border px-2 py-1">{item.blackMarket.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Flips() {
  const [flips, setFlips] = React.useState([]);
  React.useEffect(() => {
    fetch("http://localhost:3001/api/flips")
      .then((res) => res.json())
      .then(setFlips);
  }, []);
  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Oportunidades de Flip</h2>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Item</th>
            <th className="border px-2 py-1">Market</th>
            <th className="border px-2 py-1">Black Market</th>
            <th className="border px-2 py-1">Lucro</th>
          </tr>
        </thead>
        <tbody>
          {flips.map((item) => (
            <tr key={item.id}>
              <td className="border px-2 py-1">{item.name}</td>
              <td className="border px-2 py-1">{item.market.toLocaleString()}</td>
              <td className="border px-2 py-1">{item.blackMarket.toLocaleString()}</td>
              <td className="border px-2 py-1 text-green-600 font-bold">{item.profit.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <nav className="bg-blue-900 text-white p-4 flex gap-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/busca" className="hover:underline">Buscar Itens</Link>
        <Link to="/flips" className="hover:underline">Flips</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/busca" element={<Busca />} />
        <Route path="/flips" element={<Flips />} />
      </Routes>
    </Router>
  );
}
