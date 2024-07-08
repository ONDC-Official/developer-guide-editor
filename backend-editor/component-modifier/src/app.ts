import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import { app as indexRouter } from "./routes/index";
import { app as pathRouter } from "./routes/users";
import { app as gitRouter } from "./routes/git";
import { app as uploadRouter } from "./routes/upload";
import { app as helperRouter } from "./routes/helpers";
import { isBinary } from "./utils/fileUtils";
import fs from "fs";

const app = express();
app.use(cors());
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Serve React build files

// Define your API routes
// app.use("/direct", indexRouter);
app.use("/tree", pathRouter);
app.use("/git", gitRouter);
app.use("/local", uploadRouter);
app.use("/helper", helperRouter);

// If no Express routes match, serve React app's index.html
if (isBinary) {
  app.use(express.static(path.join(__dirname, "../react-build")));
  app.get("*", (req, res) => {
    console.log("Serving React build");
    res.sendFile(path.join(__dirname, "react-build", "index.html"));
  });
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const port = process.env.PORT || 1000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
