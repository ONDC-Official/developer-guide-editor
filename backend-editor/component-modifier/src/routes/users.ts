import express from "express";
import session from "express-session";
import { initRegistry } from "../utils/RegisterList";
import { EditableRegistry } from "../utils/EditableRegistry";
import { Editable } from "../utils/Editable";
import { folderTypeEditable } from "../utils/folderTypeEditable";
import { FileTypeEditable } from "../utils/FileTypeEditable";

import {
  deleteFolderSync,
  getTargetPath,
  overwriteFolder,
} from "../utils/fileUtils";
import { HistoryUtil, SessionLoadedLog } from "../utils/histroyUtils";

import { ComponentsType } from "../utils/ComponentType/ComponentsFolderTypeEditable";
import { Request, Response, NextFunction } from "express";
import { buildWrapper } from "../utils/build/build";
import { isBinary } from "../utils/fileUtils";
import path from "path";

interface EditableMap<T> {
  [key: string]: T;
}
const sessionInstances: EditableMap<ComponentsType> = {};
let currentSessionID: string = "";
const history = new HistoryUtil(5);

// const forkedCompPath = isBinary
//   ? path.join(path.dirname(process.execPath), "./FORKED_REPO/api/components")
//   : `../../../FORKED_REPO/api/components`;

initRegistry();

export const app = express();
app.use(express.json());

app.use(
  session({
    secret: "key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.all("/guide/*", async (req: any, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (
    !apiKey ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      apiKey
    )
  ) {
    res.status(400).json({
      error: "Invalid API Key",
      errorMessage: "Invalid API Key",
    });
    return;
  }
  console.log("API KEY", apiKey);
  if (!apiKey) {
    res.status(401).json({
      error: "Unauthorized",
      errorMessage: "Unauthorized",
    });
    return;
  }
  if (typeof apiKey !== "string") {
    res.status(400).json({
      error: "Invalid API Key",
      errorMessage: "Invalid API Key",
    });
  }
  next();
});

app.post("/CREATE_SESSION", async (req, res, next) => {
  try {
    console.log("creating session");
    const secretKey = req.headers["x-api-key"] as string;
    if (sessionInstances[secretKey]) {
      res.status(400).send("SESSION ALREADY EXISTS");
      return;
    }
    sessionInstances[secretKey] = await EditableRegistry.loadComponent(
      getTargetPath(secretKey),
      "components"
    );
    res.status(201).send("SESSION CREATED");
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: "Internal Server Error",
      errorMessage: e.message,
    });
  }
});

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
  const secretKey = req.headers["x-api-key"] as string;
  currentSessionID = secretKey;
  if (!sessionInstances[currentSessionID]) {
    res.status(404).json({
      error: "session not found",
      errorMessage: "session not found",
    });
    return;
  }
  if (!sessionInstances[currentSessionID] && req.method !== "DELETE") {
    try {
      sessionInstances[currentSessionID] = await EditableRegistry.loadComponent(
        getTargetPath(secretKey),
        currentSessionID
      );
      SessionLoadedLog(currentSessionID);
    } catch (e) {
      console.log(e);
      res.status(404).json({
        error: "Could not Load Component",
        errorMessage: "Could not Load Component",
      });
      return;
    }
  }
  next();
});

let parent: Editable = undefined;
let target: Editable = undefined;

app.all("/guide/*", async (req: any, res, next) => {
  const fullPath = req.params[0];
  const pathSegments: string[] = fullPath.split("/");
  const secretKey = req.headers["x-api-key"] as string;
  target = sessionInstances[secretKey];
  for (const item of pathSegments.slice(1)) {
    if (target instanceof folderTypeEditable) {
      // console.log("children", target.chilrenEditables);
      const sub = target.childrenEditables.find((child) => child.name === item);
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
    console.log("query", query);
    res.status(200).send(await target.getData(query));
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: "Internal Server Error",
      errorMessage: e.message,
    });
  }
});

app.post("/reload", async (req, res, next) => {
  try {
    console.log(sessionInstances);
    const secretKey = req.headers["x-api-key"] as string;
    for (const key in sessionInstances) {
      sessionInstances[key] = await EditableRegistry.loadComponent(
        getTargetPath(secretKey),
        "components"
      );
    }
    res.status(200).send("DATA RELOADED");
  } catch (e) {
    console.error(e);
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
    //`../../../FORKED_REPO/api/${targetName}`
    const secretKey = req.headers["x-api-key"] as string;

    sessionInstances["components"] = await EditableRegistry.loadComponent(
      getTargetPath(secretKey),
      "components"
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

app.delete("/sessions", async (req, res, next) => {
  try {
    for (const key in sessionInstances) {
      delete sessionInstances[key];
    }
    res.status(200).send("SESSION DELETED");
  } catch (e) {
    res.status(500).json({
      error: "Internal Server Error",
      errorMessage: e.message,
    });
  }
});

app.post("/build", async (req: Request, res: Response, next: NextFunction) => {
  console.log("BUILDING....");
  try {
    console.log("inside try...");
    const result: any = await buildWrapper();
    if (!result) {
      return res.status(500).json(result);
    }
    res.send(result);
  } catch (e) {
    res.status(500).json({
      error: "Internal Server Error",
      errorMessage: e.message,
    });
  }
});
