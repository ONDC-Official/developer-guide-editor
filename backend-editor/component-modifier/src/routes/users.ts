import express from "express";
import session from "express-session";
import { initRegistry } from "../utils/RegisterList";
import { EditableRegistry } from "../utils/EditableRegistry";
import { Editable } from "../utils/Editable";
import { folderTypeEditable } from "../utils/folderTypeEditable";
import { FileTypeEditable } from "../utils/FileTypeEditable";

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

app.all("/guide/*", async (req: any, res, next) => {
  const fullPath = req.params[0];
  const pathSegments = fullPath.split("/");
  if (pathSegments.length < 1) {
    console.log(pathSegments);
    res.status(400).json({
      error: "Invalid path",
      errorMessage: "Invalid path",
    });
    return;
  }
  const sessionID = pathSegments[0];
  if (!sessionInstances[sessionID]) {
    sessionInstances[sessionID] = await EditableRegistry.loadComponent(
      `../../../ONDC-NTS-Specifications/api/${sessionID}`,
      sessionID
    );
  }
  next();
});

let target: Editable = undefined;

app.all("/guide/*", async (req: any, res, next) => {
  const fullPath = req.params[0];
  const pathSegments: string[] = fullPath.split("/");
  target = sessionInstances[pathSegments[0]];
  // comp/attribute/credit
  console.log(pathSegments);
  for (const item of pathSegments.slice(1)) {
    if (target instanceof folderTypeEditable) {
      const sub = target.chilrenEditables.find((child) => child.name === item);
      if (sub) {
        target = sub;
      } else {
        res.status(404).json({
          error: "PATH DONT EXIST",
          errorMessage: "could not find path",
        });
        return;
      }
    } else if (target instanceof FileTypeEditable) {
      res.status(404).json({
        error: "PATH DONT EXIST",
        errorMessage: "could not find path",
      });
      return;
    }
  }
  console.log(target);
  next();
});

app.get("/guide/*", async (req: any, res, next) => {
  try {
    res.status(200).send(await target.getData());
  } catch (e) {
    res.status(500).json({
      error: "Internal Server Error",
      errorMessage: e.message,
    });
  }
});

app.post("/guide/*", async (req: any, res, next) => {
  try {
    // console.log("POSTING");
    await target.add(req.body);
    return res.status(200).send("DATA ADDED");
  } catch (e) {
    console.log("CATCH");
    res.status(500).json({
      error: "Internal Server Error",
      errorMessage: e.message,
    });
  }
});
