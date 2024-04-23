import express from "express";
import session from "express-session";
import { initRegistry } from "../utils/RegisterList";
import { EditableRegistry } from "../utils/EditableRegistry";

const sessionInstances = {};
initRegistry();

export const app = express();
app.use(express.json());

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // set to true if you're using HTTPS
  })
);

function checkQueryParams(req, res, next) {
  const { editableID, editableName, sessionID } = req.query;

  // Check if both query parameters are present
  if (!editableID || !editableName || !sessionID) {
    // If any parameter is missing, send an error response
    console.log("Missing required query parameters");
    res.status(400).json({
      error:
        "Missing required query parameters. Please include all editableID, editableName,sessionID.",
      errorMessage:
        "Missing required query parameters. Please include all editableID, editableName,sessionID.",
    });
    return; // Prevent further execution
  }
  req.editableID = editableID;
  req.editableName = editableName;
  req.sessionID = sessionID;
  next();
}
app.use(checkQueryParams);

app.use(async (req: any, res, next) => {
  if (!sessionInstances[req.sessionID]) {
    sessionInstances[req.sessionID] = await EditableRegistry.loadComponent(
      "../../ONDC-NTS-Specifications/api/cp0",
      "cp0"
    );
  }
  next();
});

app.use(async (req: any, res, next) => {
  const comp = sessionInstances[req.sessionID];
  let target = null;
  try {
    target = await comp.getTarget(req.editableID, req.editableName, comp);
    console.log("target:", target);
    req.target = target;
    next();
  } catch {
    res.status(404).send("Editable Not Found!");
  }
});

app.get("/guide", async (req: any, res) => {
  console.log("test", req.editableID);
  try {
    const data = await req.target.getData();
    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(404).send("Data Not Found!");
  }
});

app.post("/guide", async (req: any, res) => {
  try {
    await req.target.add(req.body);
    res.status(200).send("Data Added!");
  } catch (err) {
    console.log(err);
    res.status(400).send("Data Not Added!");
  }
});

app.put("/guide", async (req: any, res) => {
  await req.target.update(req.body);
  res.status(200).send("Data Updated!");
});

app.delete("/guide", async (req: any, res) => {
  const comp = sessionInstances[req.sessionID];
  const parent = await comp.findParent(req.editableID, req.editableName, comp);
  console.log("PARENT IS ", parent);
  if (parent == "-1") {
    comp.destroy();
    delete sessionInstances[req.sessionID];
  } else if (parent != null) {
    await parent.remove(req.target);
  }
  if (parent == null) {
    res.status(404).send("Editable Not Found!");
  }
  res.status(200).send("Data Deleted!");
});
