const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectdb = require("./config/db");

const materialsroutes = require("./routes/materialsroutes");
const userroutes = require("./routes/userroutes");
const orderroutes = require("./routes/orderroutes");
dotenv.config();

const app = express();

connectdb();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use(
  "/api/materials",
  materialsroutes
);

app.use(
  "/api/auth",
  userroutes
);

app.use(
  "/api/orders",
  orderroutes
);

app.get("/", (req, res) => {
  res.send("E-Commerce API is working");
});

const port =
  process.env.PORT || 5600;

app.listen(port, () => {
  console.log(
    `Server is running on port ${port}`
  );
});