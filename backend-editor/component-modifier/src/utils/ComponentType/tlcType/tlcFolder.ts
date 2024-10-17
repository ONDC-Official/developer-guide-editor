import { readYamlFile } from "../../fileUtils";
import { folderTypeEditable, UpdateObj } from "../../folderTypeEditable";
import { overrideYaml } from "../../yamlUtils";
import { TLC_ROW, TLC_DATA } from "./tlcUtils";
import yaml from "js-yaml";

export class TlcFolder extends folderTypeEditable {
  static REGISTER_ID = "TLC_FOLDER";
  constructor(path: string, name: string) {
    super(path, name);
    this.allowedList = [];
  }
  async add(addData: { ID: string; name: string; rows: TLC_ROW[] }) {
    const data = await this.getData({});
    const existingRows = data.code;
    const newRows = addData.rows;
    for (const row of newRows) {
      if (existingRows.find((r) => r.Term === row.Term)) {
        existingRows[existingRows.findIndex((r) => r.Term === row.Term)] = row;
        continue;
      }
      existingRows.push(row);
    }
    data.code = existingRows;
    await overrideYaml(this.yamlPathLong, yaml.dump(data));
  }
  async getData(query: any) {
    const yml = await readYamlFile(this.yamlPathLong);
    const data = yaml.load(yml);
    if (!data) {
      const emptyData: TLC_DATA = {
        code: [],
      };
      await overrideYaml(this.yamlPathLong, yaml.dump(emptyData));
      return emptyData;
    }
    return yaml.load(yml) as TLC_DATA;
  }
  async remove(deleteTarget: { folderName: string; rows: TLC_ROW[] }) {
    const data = await this.getData({});
    const existingRows = data.code;
    const deleteRows = deleteTarget.rows;
    for (const row of deleteRows) {
      const index = existingRows.findIndex((r) => r.Term === row.Term);
      if (index !== -1) {
        existingRows.splice(index, 1);
      }
    }
    data.code = existingRows;
    await overrideYaml(this.yamlPathLong, yaml.dump(data));
  }
  async update(update: { oldName: string; newName: string; rows: TLC_ROW[] }) {
    const data = await this.getData({});
    const existingRows = data.code;
    const updateRows = update.rows;
    for (const row of updateRows) {
      const index = existingRows.findIndex((r) => r.Term === row.Term);
      if (index !== -1) {
        existingRows[index] = row;
      }
    }
    data.code = existingRows;
    await overrideYaml(this.yamlPathLong, yaml.dump(data));
  }
  getRegisterID(): string {
    return TlcFolder.REGISTER_ID;
  }
}
