const express = require('express');
const cors = require('cors');
const FastSpeedtest = require('fast-speedtest-api');
const ping = require('ping');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Express on Vercel');
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
    const latency = await getPingLatency();
    const networkProvider = await getNetworkProvider();

    res.status(200).json({
      downloadSpeed: downloadSpeed.toFixed(2),
      uploadSpeed: uploadSpeed.toFixed(2),
      latency: latency.toFixed(2),
      networkProvider,
    });
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

const getPingLatency = async () => {
  const pingResult = await ping.promise.probe('google.com');
  return pingResult.time;
};

const getNetworkProvider = async () => {
  try {
    const response = await axios.get('https://ipinfo.io/json?token=884d0fd3e2a980');
    return response.data.org || 'Unknown';
  } catch (error) {
    return 'Unknown';
  }
};

app.listen(port, () => {
  console.log(`Server ready on port ${port}`);
});

module.exports = app;
