import express from "express";
import session from "express-session";
import { initRegistry } from "../utils/RegisterList";
import { EditableRegistry } from "../utils/EditableRegistry";
import { Editable } from "../utils/Editable";
import { folderTypeEditable } from "../utils/folderTypeEditable";
import { FileTypeEditable } from "../utils/FileTypeEditable";
import { AttributeFile } from "../utils/ComponentType/AttributeType/AttributeRow";
import { error } from "console";
import { copyDir, deleteFolderSync, overwriteFolder } from "../utils/fileUtils";
import { HistoryUtil } from "../utils/histroyUtils";
import { Session } from "inspector";
import { ComponentsType } from "../utils/ComponentType/ComponentsFolderTypeEditable";

interface EditableMap<T> {
  [key: string]: T;
}
const sessionInstances: EditableMap<ComponentsType> = {};
let currentSessionID: string = "";
const history = new HistoryUtil(5);

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
  currentSessionID = pathSegments[0];
  if (!sessionInstances[currentSessionID] && req.method !== "DELETE") {
    sessionInstances[currentSessionID] = await EditableRegistry.loadComponent(
      `../../../ONDC-NTS-Specifications/api/${currentSessionID}`,
      currentSessionID
    );
  }
  next();
});

let parent: Editable = undefined;
let target: Editable = undefined;

app.all("/guide/*", async (req: any, res, next) => {
  const fullPath = req.params[0];
  const pathSegments: string[] = fullPath.split("/");
  target = sessionInstances[pathSegments[0]];
  for (const item of pathSegments.slice(1)) {
    if (target instanceof folderTypeEditable) {
      // console.log("children", target.chilrenEditables);
      const sub = target.chilrenEditables.find((child) => child.name === item);
      if (sub) {
        parent = target;
        target = sub;
      } else {
        console.log("PATH DONT EXIST");
        res.status(404).json({
          error: "PATH DONT EXIST",
          errorMessage: "could not find path",
        });
        return;
      }
    } else if (target instanceof FileTypeEditable) {
      console.log("PATH DONT EXIST", target);
      res.status(404).json({
        error: "PATH DONT EXIST",
        errorMessage: "could not find path",
      });
      return;
    }
  }
  next();
});

app.get("/guide/*", async (req, res, next) => {
  try {
    let query = { ...req.query };
    query = query ? query : {};
    res.status(200).send(await target.getData(query));
  } catch (e) {
    res.status(500).json({
      error: "Internal Server Error",
      errorMessage: e.message,
    });
  }
});

app.post("/guide/*", async (req, res, next) => {
  try {
    await history.addHistory(sessionInstances[currentSessionID]);
    await target.add(req.body);
    return res.status(201).send("DATA ADDED");
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: "Internal Server Error",
      errorMessage: e.message,
    });
  }
});

app.put("/guide/*", async (req, res, next) => {
  try {
    // const query = { ...req.query };
    console.log("UNDOING");
    const source = await history.undoLastAction();
    const targetName = req.params[0].split("/")[0];
    console.log(targetName);
    const comp = sessionInstances[targetName];
    const folderPath = comp.folderPath;
    await comp.destroy();
    await overwriteFolder(source, folderPath);
    await deleteFolderSync(source);
    console.log("COPY DONE");
    sessionInstances[targetName] = await EditableRegistry.loadComponent(
      `../../../ONDC-NTS-Specifications/api/${targetName}`,
      targetName
    );
    res.status(200).send("DATA UNDONE");
  } catch (e) {
    console.log("CAUGHT ERROR");
    console.error(e);
    res.status(500).json({
      error: "Internal Server Error",
      errorMessage: e.message,
    });
  }
});

app.patch("/guide/*", async (req, res, next) => {
  try {
    await history.addHistory(sessionInstances[currentSessionID]);
    console.log("updating");

    await target.update(req.body);
    return res.status(200).send("DATA UPDATED");
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: "Internal Server Error",
      errorMessage: e.message,
    });
  }
});

app.delete("/guide/*", async (req, res, next) => {
  try {
    await history.addHistory(sessionInstances[currentSessionID]);
    console.log("query", req.query);
    if (Object.keys(req.query).length > 0) {
      const body: any = { ...req.query };
      await target.remove(body);
      res.status(200).send("DATA DELETED");
      return;
    }
    const comp = sessionInstances[req.params[0].split("/")[0]];
    if (comp === target) {
      comp.destroy();
      delete sessionInstances[req.params[0].split("/")[0]];
    } else {
      await parent.remove({ folderName: target.name });
    }
    res.status(200).send("DATA DELETED");
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: "Internal Server Error",
      errorMessage: e.message,
    });
  }
});