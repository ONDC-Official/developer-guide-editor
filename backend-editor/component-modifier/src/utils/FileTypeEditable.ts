import path from "path";
import { Editable } from "./Editable";

export abstract class FileTypeEditable extends Editable {
  constructor(path, name) {
    super(path, name);
  }
}
