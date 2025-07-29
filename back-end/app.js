const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const protect = require("./middlewares/authMiddleware");
const path = require("path");
const fs = require("fs");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors({
    origin: "*",
}));
app.use(express.json());

app.use("/api/dashboard", protect, require("./routes/dashboardRoutes"));
app.use("/api/house", protect, require("./routes/houseRoutes"));
app.use("/api/festivals", protect, require("./routes/festovalRoutes"));
app.use("/api/expenses", protect, require("./routes/expenseRoutes")); // TODO: Need to get make update
app.use("/api/estimates", protect, require("./routes/estimateRoutes")); // TODO: Need to get make update
app.use("/api/funds", protect, require("./routes/fundRoutes")); // TODO: Need to make update API
app.use("/api/volunteers", protect, require("./routes/volunteerRoutes")); // TODO: Need to make update and delete API
app.use("/api/reports", protect, require("./routes/reportRoutes"));
app.use("/api/todos", protect, require("./routes/todoRoutes"));

app.use("/api/auth", require("./routes/authRoutes"));

app.use('/receipts', express.static(path.join(__dirname, 'public/receipts')));

app.get("/", (req, res) => {
    res.send("Festival Expense API is running");
})

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on port ${PORT}`);
})