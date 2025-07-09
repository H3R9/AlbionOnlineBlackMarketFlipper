const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());

// Mock de itens e preços
const items = [
  { id: 1, name: 'Rune Sword', market: 12000, blackMarket: 14500 },
  { id: 2, name: 'Cleric Robe', market: 35000, blackMarket: 41000 },
  { id: 3, name: 'Fiend Cowl', market: 18000, blackMarket: 22000 },
  { id: 4, name: 'Mistcaller', market: 9000, blackMarket: 13000 },
  { id: 5, name: 'Avalonian Sword', market: 120000, blackMarket: 150000 },
];

app.get('/api/items', (req, res) => {
  res.json(items);
});

app.get('/api/flips', (req, res) => {
  // Retorna apenas itens com potencial de flip (blackMarket > market)
  const flips = items.filter(item => item.blackMarket > item.market)
    .map(item => ({
      ...item,
      profit: item.blackMarket - item.market
    }));
  res.json(flips);
});

app.listen(PORT, () => {
  console.log(`Albion Flipper backend rodando na porta ${PORT}`);
});