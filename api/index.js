const express = require('express');
const cors = require('cors');
const FastSpeedtest = require('fast-speedtest-api');
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
    console.log('Download Speed:', downloadSpeed);

    const uploadSpeed = await simulateUploadSpeed(speedtest);
    console.log('Upload Speed:', uploadSpeed);

    res.status(200).json({
      downloadSpeed: downloadSpeed.toFixed(2),
      uploadSpeed: uploadSpeed.toFixed(2),
    });
  } catch (e) {
    console.error('Error occurred:', e.message);
    res.status(500).json({ error: e.message });
  }
});

const simulateUploadSpeed = async (speedtest) => {
  let totalSpeed = 0;
  const attempts = 2;

  for (let i = 0; i < attempts; i++) {
    try {
      const speed = await speedtest.getSpeed();
      totalSpeed += speed;
    } catch (e) {
      console.error('Error during upload speed test:', e.message);
      throw e; // Re-throw the error to be caught by the outer try-catch
    }
  }

  const averageSpeed = totalSpeed / attempts;
  return averageSpeed;
};

app.listen(port, () => {
  console.log(`Server ready on port ${port}`);
});

module.exports = app;
