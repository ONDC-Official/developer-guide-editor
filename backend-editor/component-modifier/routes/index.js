const express = require("express");
const session = require("express-session");
const { initRegistry } = require("../utils/EditableRegister");
const EditableRegistry = require("../utils/Editable").EditableRegistry;

const sessionInstances = {};
initRegistry();

const app = express();
app.use(express.json());

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // set to true if you're using HTTPS
  })
);

app.use(async (req, res, next) => {
  if (!sessionInstances[req.body.sessionID]) {
    console.log("Session ID:", req.body.sessionID);

    sessionInstances[req.body.sessionID] = await EditableRegistry.create(
      "COMPONENTS-FOLDER",
      "../../ONDC-NTS-Specifications/api/cp0",
      "cp0"
    );
    console.log(sessionInstances);
  }
  next();
});

/**
 * body needs to have the following fields:
 * sessionID: string
 * targetID: string
 * targetName: string
 */
app.use(async (req, res, next) => {
  if (req.body.targetID && req.body.targetName) {
    const comp = sessionInstances[req.body.sessionID];
    let target = null;
    try {
      target = await comp.getTarget(
        req.body.targetID,
        req.body.targetName,
        comp
      );
    } catch {
      res.status(404).send("Editable Not Found!");
    }
    req.target = target;
  }
  next();
});

app.get("/guide", async (req, res) => {
  const data = await req.target.getData();
  res.status(200).send(data);
});

/**
 * body needs to have the following fields:
 * Add: object for relevant addition
 */
app.post("/guide", async (req, res) => {
  await req.target.add(req.body.Add);
  res.status(200).send("Data Added!");
});

/**
 * body needs to have the following fields:
 * Update: object for relevant updation
 */
app.put("/guide", async (req, res) => {
  await req.target.update(req.body.Update);
  res.status(200).send("Data Updated!");
});

/**
 * body needs to have the following fields:
 * Delete: object for relevant deletion
 */
app.delete("/guide", async (req, res) => {
  await req.target.remove(req.body.Delete);
  res.status(200).send("Data Deleted!");
});

module.exports = app;
