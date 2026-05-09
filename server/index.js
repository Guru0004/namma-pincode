const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Mock DB of Bangalore Pincodes and Areas
const pincodeData = [
  { pincode: '560001', area: 'M.G. Road' },
  { pincode: '560001', area: 'Brigade Road' },
  { pincode: '560001', area: 'Vidhana Soudha' },
  { pincode: '560004', area: 'Basavanagudi' },
  { pincode: '560004', area: 'V.V. Puram' },
  { pincode: '560008', area: 'HAL 2nd Stage' },
  { pincode: '560008', area: 'Indiranagar' },
  { pincode: '560010', area: 'Rajajinagar' },
  { pincode: '560011', area: 'Jayanagar' },
  { pincode: '560025', area: 'Richmond Town' },
  { pincode: '560025', area: 'Shanti Nagar' },
  { pincode: '560029', area: 'SG Palya' },
  { pincode: '560034', area: 'Koramangala' },
  { pincode: '560034', area: 'Agara' },
  { pincode: '560037', area: 'Marathahalli' },
  { pincode: '560038', area: 'Indiranagar (100 Ft Road)' },
  { pincode: '560038', area: 'Defense Colony' },
  { pincode: '560039', area: 'Nayandahalli' },
  { pincode: '560041', area: 'Jayanagar 9th Block' },
  { pincode: '560066', area: 'Whitefield' },
  { pincode: '560066', area: 'Brookefield' },
  { pincode: '560076', area: 'BTM Layout' },
  { pincode: '560078', area: 'JP Nagar' },
  { pincode: '560078', area: 'Puttenahalli' },
  { pincode: '560085', area: 'Banashankari' },
  { pincode: '560095', area: 'Koramangala 8th Block' },
  { pincode: '560100', area: 'Electronic City' },
  { pincode: '560102', area: 'HSR Layout' },
  { pincode: '560103', area: 'Bellandur' }
];

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Search by pincode or area
app.get('/api/search', (req, res) => {
  const { query } = req.query;

  let results = [];

  if (!query) {
    results = pincodeData; // return all data if empty
  } else {
    const normalizedQuery = query.toLowerCase().trim();
    const isPincode = /^\d+$/.test(normalizedQuery);

    if (isPincode) {
      // Exact or partial pincode match
      results = pincodeData.filter(item => item.pincode.includes(normalizedQuery));
    } else {
      // Area match
      results = pincodeData.filter(item => item.area.toLowerCase().includes(normalizedQuery));
    }
  }

  // Add artificial delay to show off beautiful loading states
  // We reduce delay for full load to feel snappier.
  setTimeout(() => {
    res.json(results);
  }, !query ? 200 : 600);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
