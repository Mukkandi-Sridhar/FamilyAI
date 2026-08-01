import "dotenv/config";
import express from "express";
import cors from "cors";
import recipeRouter from "./routes/recipe.js";
import tutorRouter from "./routes/tutor.js";
import financeRouter from "./routes/finance.js";
import followupRouter from "./routes/followup.js";
import documentRouter from "./routes/document.js";
import supportRouter from "./routes/support.js";
import languageRouter from "./routes/language.js";
import homeworkRouter from "./routes/homework.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "12mb" }));

app.use("/api/recipe", recipeRouter);
app.use("/api/tutor", tutorRouter);
app.use("/api/finance", financeRouter);
app.use("/api/followup", followupRouter);
app.use("/api/document", documentRouter);
app.use("/api/support", supportRouter);
app.use("/api/language", languageRouter);
app.use("/api/homework", homeworkRouter);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Server error" });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Family AI Workspace server on :${port}`));
