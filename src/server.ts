import cors from "cors";
import express from "express";
import adminRoutes from "./routes/admin.routes";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});