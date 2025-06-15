require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const ipCheckRouter = require('./routes/ipCheck');
const cors = require('cors');
const dns = require('dns');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', ipCheckRouter);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.error('Error conectando a MongoDB:', err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

app.get('/api/resolve/:domain', async (req, res) => {
  try {
    const addresses = await dns.resolve4(req.params.domain);
    res.json({ ips: addresses });
  } catch (err) {
    res.status(400).json({ error: 'Could not resolve domain', details: err.message });
  }
});