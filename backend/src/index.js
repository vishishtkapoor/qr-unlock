const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

const totpRoutes = require("./routers/totpRouter.js"); // Import routes 
const mqttRoutes = require("./routers/mqttRouter.js");
app.use("/api/totp", totpRoutes);
app.use("/api/mqtt", mqttRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});