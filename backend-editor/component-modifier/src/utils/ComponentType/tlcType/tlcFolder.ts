import { readYamlFile } from "../../fileUtils.ts";
import { folderTypeEditable, UpdateObj } from "../../folderTypeEditable.ts";
import yaml from "js-yaml";
import { TLC_DATA, TLC_ROW } from "../tlcType/tlcUtils.ts";

export class TlcFolder extends folderTypeEditable {
  static REGISTER_ID = "TLC_FOLDER";
  constructor(path: string, name: string) {
    super(path, name);
    this.allowedList = [];
  }
  async add(addData: { ID: string; name: string; rows: TLC_ROW[] }) {
    const data = await this.getData({});
  }
  async getData(query: any) {
    const yml = await readYamlFile(this.yamlPathLong);
    return yaml.load(yml) as TLC_DATA;
  }
  async remove(deleteTarget: { folderName: string }) {
    await super.remove(deleteTarget);
  }
  async update(update: UpdateObj) {
    await super.update(update);
  }
  getRegisterID(): string {
    return TlcFolder.REGISTER_ID;
  }
}
