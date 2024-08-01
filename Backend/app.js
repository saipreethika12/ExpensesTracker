const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const userRouter = require("./routes/userRouter");
const errorHandler = require("./middlewares/errorHandlerMiddleWare");
const categoryRouter = require("./routes/categoryRouter");
const transactionRouter = require("./routes/transactionRouter");
//saipreethika1207
//thuoNu0tPNz7fj8m
mongoose
  .connect(
    "mongodb+srv://saipreethika1207:thuoNu0tPNz7fj8m@cluster0.lcizkfq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("DB Connected"))
  .catch((e) => console.log(e));

const corsOptions = {
  origin: ["http://localhost:5173"],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use("/", userRouter);
app.use("/", categoryRouter);
app.use("/", transactionRouter);
app.use(errorHandler);
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`Server running on port..${PORT}`));
