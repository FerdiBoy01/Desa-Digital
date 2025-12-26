import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/Database.js";
import UserRoute from "./routes/UserRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import Users from "./models/UserModel.js"; // Import model untuk dipancing saat sync
import Biodata from "./models/BiodataModel.js";
import Program from "./models/ProgramModel.js";
import BiodataRoute from "./routes/BiodataRoute.js";
import FileUpload from "express-fileupload";
import ProgramRoute from "./routes/ProgramRoute.js";
import DashboardRoute from "./routes/DashboardRoute.js";

dotenv.config();

const app = express();


// --- DATABASE SYNC ---
// Jalankan ini SEKALI saja saat pertama kali run project.
// Setelah tabel 'users' muncul di database, berikan komentar (//) pada baris di bawah ini.

// (async()=>{
//     await Biodata.sync({ alter: true }); 
//     console.log("Database berhasil di-update!");
// })();


// ---------------------

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173' // Sesuaikan dengan port frontend React nanti
}));

app.use(express.json());
app.use(FileUpload());
app.use(express.static("public"));

// Routes
app.use(AuthRoute);
app.use(UserRoute);
app.use(BiodataRoute);
app.use(ProgramRoute);
app.use(DashboardRoute);


// Port dari .env
const PORT = process.env.APP_PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
});