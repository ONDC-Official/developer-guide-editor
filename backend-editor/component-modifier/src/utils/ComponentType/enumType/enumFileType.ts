import { FileTypeEditable } from "../../FileTypeEditable";
import { convertToYamlWithRefs } from "../../Yaml Converter/yamlRefConvert";
import { readYamlFile } from "../../fileUtils";
import { overrideYaml } from "../../yamlUtils";
import {
  RecordOfEnumArrays,
  enumObject,
  enumsFromApi,
  enumsToNestes,
  mergeEnumObjectRecords,
} from "./enumUtils";

type EnumDel = Record<string, enumObject[] | string>;

export class EnumFileType extends FileTypeEditable {
  static REGISTER_ID = "ENUM_FILE";
  getRegisterID(): string {
    return EnumFileType.REGISTER_ID;
  }
  constructor(path: string, name: string) {
    super(path, name);
  }
  async getData(): Promise<Record<string, enumObject[]>> {
    return enumsFromApi(await readYamlFile(this.yamlPathLong));
  }
  async add(dataToAdd: Record<string, enumObject[]>) {
    for (const key in dataToAdd) {
      for (const data of dataToAdd[key]) {
        data.enums.forEach((e) => {
          if (!e.reference) {
            e.reference = "<PR/Issue/Discussion Links md format text";
          }
        });
      }
    }
    console.log(dataToAdd);
    const data = await this.getData();
    const newData = mergeEnumObjectRecords(data, dataToAdd);
    console.log(newData);
    const yml = enumsToNestes(newData);
    await overrideYaml(this.yamlPathLong, convertToYamlWithRefs(yml));
  }

  async remove(dataToDel: EnumDel) {
    const data = await this.getData();
    for (const key in dataToDel) {
      const val = dataToDel[key];
      // First, check if `data` actually has the property
      if (data.hasOwnProperty(key)) {
        if (typeof val === "string") {
          // Delete the property if it's a string in `dataToDel`
          delete data[key];
        } else if (Array.isArray(val)) {
          // Correctly handle the array case
          data[key] = data[key].filter((d) => {
            // This should return true if `d` should NOT be deleted, hence we need the negation of some condition
            return !val.some((del) => del.path === d.path);
          });
        }
      }
    }
    const yml = enumsToNestes(data);
    await overrideYaml(this.yamlPathLong, convertToYamlWithRefs(yml));
  }

  async update(
    dataToUp: RecordOfEnumArrays | { oldName: string; newName: string }
  ) {
    const data = await this.getData();
    if (
      dataToUp.hasOwnProperty("oldName") &&
      dataToUp.hasOwnProperty("newName") &&
      !Array.isArray(dataToUp.newName) &&
      !Array.isArray(dataToUp.oldName)
    ) {
      data[dataToUp.newName] = data[dataToUp.oldName];
      delete data[dataToUp.oldName];
    } else {
      for (const key in dataToUp) {
        if (data.hasOwnProperty(key)) {
          data[key] = data[key].map((d) => {
            const updated = dataToUp[key].find((u) => u.path === d.path);
            return updated ? updated : d;
          });
        }
      }
    }
    const yml = enumsToNestes(data);
    await overrideYaml(this.yamlPathLong, convertToYamlWithRefs(yml));
  }
}
