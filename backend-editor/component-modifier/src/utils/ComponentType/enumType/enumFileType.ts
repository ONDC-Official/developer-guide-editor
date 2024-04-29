import { FileTypeEditable } from "../../FileTypeEditable";
import { convertToYamlWithRefs } from "../../Yaml Converter/yamlRefConvert";
import { readYamlFile } from "../../fileUtils";
import { overrideYaml } from "../../yamlUtils";
import {
  convertDetailedPathsToNestedObjects,
  enumObject,
  listDetailedPaths,
} from "./enumUtils";

export class EnumFileType extends FileTypeEditable {
  static REGISTER_ID = "ENUM_FILE";
  getRegisterID(): string {
    return EnumFileType.REGISTER_ID;
  }
  constructor(path: string, name: string) {
    super(path, name);
  }
  async getData(): Promise<enumObject[]> {
    return listDetailedPaths(await readYamlFile(this.yamlPathLong));
  }
  async add(dataToAdd: enumObject[]) {
    for (const data of dataToAdd) {
      data.enums.forEach((e) => {
        if (!e.reference) {
          e.reference = "<PR/Issue/Discussion Links md format text";
        }
      });
    }
    const data = await this.getData();
    data.push(...dataToAdd);
    const yml = convertDetailedPathsToNestedObjects(data);
    overrideYaml(this.yamlPathLong, convertToYamlWithRefs(yml));
  }
  async remove(dataToDel: enumObject[]) {
    const data = await this.getData();
    const newData = data.filter((d) => {
      return !dataToDel.some((del) => del.path === d.path);
    });
    const yml = convertDetailedPathsToNestedObjects(newData);
    overrideYaml(this.yamlPathLong, convertToYamlWithRefs(yml));
  }
  async update(dataToUp: enumObject[]) {
    const data = await this.getData();
    const newData = data.map((d) => {
      const updated = dataToUp.find((u) => u.path === d.path);
      return updated ? updated : d;
    });
    const yml = convertDetailedPathsToNestedObjects(newData);
    overrideYaml(this.yamlPathLong, convertToYamlWithRefs(yml));
  }
}
