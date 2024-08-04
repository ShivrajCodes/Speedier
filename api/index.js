const express = require('express');
const cors = require('cors');
const FastSpeedtest = require('fast-speedtest-api');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Express on Vercel');
});

app.get('/api/speedtest', async (req, res) => {
  let speedtest = new FastSpeedtest({
    token: process.env.SPEEDTEST_API_TOKEN || 'YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm',
    verbose: false,
    timeout: 10000,
    https: true,
    urlCount: 3, 
    bufferSize: 4, 
    unit: FastSpeedtest.UNITS.Mbps
  });

  const start = Date.now();

  try {
    const downloadSpeed = await speedtest.getSpeed();
    const uploadSpeed = await simulateUploadSpeed(speedtest);
    const end = Date.now();
    const timeTaken = end - start;

    res.status(200).json({
      downloadSpeed: downloadSpeed.toFixed(2),
      uploadSpeed: uploadSpeed.toFixed(2),
      timeTaken: `${timeTaken} ms`
    });
  } catch (e) {
    console.error('Speed test error:', e); 
    res.status(500).json({ error: e.message });
  }
});

const simulateUploadSpeed = async (speedtest) => {
  let totalSpeed = 0;
  const attempts = 1;

  for (let i = 0; i < attempts; i++) {
    const speed = await speedtest.getSpeed();
    totalSpeed += speed;
  }

  const averageSpeed = totalSpeed / attempts;
  return averageSpeed;
};

app.listen(port, () => {
  console.log(`Server ready on port ${port}`);
});

module.exports = app;
