const express = require('express');
const app = express();

// مسیر اصلی سایت
app.get('/', (req, res) => {
  res.send('سلام! سایت Node.js شما کار می‌کند 😄');
});

// پورت که هاست اختصاص می‌دهد
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
