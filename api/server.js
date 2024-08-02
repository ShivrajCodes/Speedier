const express = require('express');
const cors = require('cors');
const FastSpeedtest = require('fast-speedtest-api');
const app = express();
const port = 5000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Speed Test API');
});

app.get('/api/speedtest', async (req, res) => {
  let speedtest = new FastSpeedtest({
    token: 'YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm',
    verbose: false,
    timeout: 10000,
    https: true,
    urlCount: 5,
    bufferSize: 8,
    unit: FastSpeedtest.UNITS.Mbps
  });

  try {
    const downloadSpeed = await speedtest.getSpeed();
    const uploadSpeed = await simulateUploadSpeed(speedtest);
    res.status(200).json({ downloadSpeed: downloadSpeed.toFixed(2), uploadSpeed: uploadSpeed.toFixed(2) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const simulateUploadSpeed = async (speedtest) => {
  let totalSpeed = 0;
  const attempts = 2; 

  for (let i = 0; i < attempts; i++) {
    totalSpeed += await speedtest.getSpeed();
  }

  const averageSpeed = totalSpeed / attempts;
  return averageSpeed;
};

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
