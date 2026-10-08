require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[server] AI Resume Builder API listening on port ${PORT}`);
  console.log(`[server] Health check: http://localhost:${PORT}/api/health`);
});
