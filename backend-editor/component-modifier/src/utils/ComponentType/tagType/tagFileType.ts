import { FileTypeEditable } from "../../FileTypeEditable";
import { readYamlFile } from "../../fileUtils";
import { convertToYamlWithRefs } from "../../Yaml Converter/yamlRefConvert";
import { overrideYaml } from "../../yamlUtils";
import {
  mergeTagObjectRecords,
  RecordOfTagArrays,
  TagObject,
  tagsFromApi,
  tagsToNested,
} from "./tagsUtils";

type TagDel = Record<string, TagObject[] | string>;

export class TagFileType extends FileTypeEditable {
  static REGISTER_ID = "TAG_FILE";
  getRegisterID(): string {
    return TagFileType.REGISTER_ID;
  }
  constructor(path: string, name: string) {
    super(path, name);
  }

  async getData(): Promise<Record<string, TagObject[]>> {
    return tagsFromApi(await readYamlFile(this.yamlPathLong));
  }

  async add(dataToAdd: Record<string, TagObject[]>) {
    this.setMissingReferences(dataToAdd);
    const data = await this.getData();
    const newData = mergeTagObjectRecords(data, dataToAdd);
    const yml = tagsToNested(newData);
    await overrideYaml(this.yamlPathLong, convertToYamlWithRefs(yml));
  }

  async remove(dataToDel: TagDel) {
    const data = await this.getData();
    for (const key in dataToDel) {
      const val = dataToDel[key];
      if (data.hasOwnProperty(key)) {
        if (typeof val === "string") {
          delete data[key];
        } else if (Array.isArray(val)) {
          data[key] = data[key].filter((d) => {
            return !val.some((del) => del.path === d.path);
          });
        }
      }
    }
    const yml = tagsToNested(data);
    await overrideYaml(this.yamlPathLong, convertToYamlWithRefs(yml));
  }

  async update(
    dataToUpdate: RecordOfTagArrays | { oldName: string; newName: string }
  ) {
    const data = await this.getData();
    if (
      dataToUpdate.hasOwnProperty("oldName") &&
      dataToUpdate.hasOwnProperty("newName") &&
      !Array.isArray(dataToUpdate.newName) &&
      !Array.isArray(dataToUpdate.oldName)
    ) {
      data[dataToUpdate.newName] = data[dataToUpdate.oldName];
      delete data[dataToUpdate.oldName];
    } else {
      for (const key in dataToUpdate) {
        if (data.hasOwnProperty(key)) {
          data[key] = data[key].map((d) => {
            const updated = dataToUpdate[key].find((u) => u.path === d.path);
            return updated ? updated : d;
          });
        }
      }
    }
    const yml = tagsToNested(data);
    await overrideYaml(this.yamlPathLong, convertToYamlWithRefs(yml));
  }

  private setMissingReferences(dataToAdd: Record<string, TagObject[]>) {
    for (const key in dataToAdd) {
      for (const data of dataToAdd[key]) {
        data.tag.forEach((e) => {
          if (!e.reference) {
            e.reference = "<PR/Issue/Discussion Links md format text";
          }
          e.list.forEach((l) => {
            if (!l.reference) {
              l.reference = "<PR/Issue/Discussion Links md format text";
            }
          });
        });
      }
    }
  }
}
