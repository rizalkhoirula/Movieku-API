const express = require("express");
const expressGateway = require("express-gateway");
const router = express.Router();
const moviesRoutes = require("./routes/moviesRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const gateway = express();
const { connectToDatabase } = require("./config/database");

// Panggil fungsi untuk menghubungkan ke database
connectToDatabase();

// Parser Data Json
gateway.use(express.json());

// Konfigurasi gateway
const gatewayConfig = {
  apiEndpoints: [
    {
      name: "movies",
      host: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE"],
      paths: ["/movies/**"],
    },
    {
      name: "user",
      host: "http://localhost:3001",
      methods: ["GET", "POST", "PUT", "DELETE"],
      paths: ["/user/**"],
    },
    {
      name: "auth",
      host: "http://localhost:3002",
      methods: ["GET", "POST", "PUT", "DELETE"],
      paths: ["/user/**"],
    },
  ],
  serviceEndpoints: {
    movies: "http://localhost:3000",
    user: "http://localhost:3001",
    auth: "http://localhost:3002",
  },
};

// Konfigurasi dan jalankan Express Gateway
expressGateway(gatewayConfig, gateway);

// Gunakan router yang ada pada iklanRoutes dan penjualanRoutes
gateway.use("/movies", moviesRoutes);
gateway.use("/user", userRoutes);
gateway.use("/auth", authRoutes);

// Jalankan gateway pada port 8080
gateway.listen(8080, () => {
  console.log("Gateway berjalan pada port 8080");
});
