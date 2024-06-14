import { FileTypeEditable } from "../../FileTypeEditable";
import { readYamlFile } from "../../fileUtils";
import { convertToYamlWithRefs } from "../../extraUtils/yamlRefConvert";
import { overrideYaml } from "../../yamlUtils";
import {
  mergeFlowObjectRecords,
  RecordOfFlowArrays,
  FlowObject,
  flowFromApi,
  flowToNested,
} from "./flowUtils";

type FlowDel = Record<string, FlowObject[] | string>;

export class FlowFileType extends FileTypeEditable {
  static REGISTER_ID = "FLOW_FILE";
  getRegisterID(): string {
    return FlowFileType.REGISTER_ID;
  }
  constructor(path: string, name: string) {
    super(path, name);
  }

  async getData(): Promise<Record<string, FlowObject[]>> {
    const response = flowFromApi(await readYamlFile(this.yamlPathLong));
    return response;
  }

  async add(dataToAdd: Record<string, FlowObject[]>) {
    // this.setMissingReferences(dataToAdd);
    let data = await this.getData();
    data = data == undefined ? {} : data;
    for (const key in dataToAdd) {
      data[key] = dataToAdd[key];
    }

    // const newData = mergeFlowObjectRecords(data, dataToAdd);

    // const yml = flowToNested(data);
    await overrideYaml(this.yamlPathLong, convertToYamlWithRefs(data));
  }

  async remove(dataToDel: FlowDel) {
    const data = await this.getData();
    for (const key in dataToDel) {
      const val = dataToDel[key];
      if (data.hasOwnProperty(key)) {
        if (typeof val === "string") {
          delete data[key];
        } else if (Array.isArray(val)) {
          data[key] = data[key].filter((d, index) => {
            // return !val.some((del) => del.path === d.path);
            return index !== +val[0];
          });
        }
      }
    }
    // const yml = flowToNested(data);
    await overrideYaml(this.yamlPathLong, convertToYamlWithRefs(data));
  }

  async update(
    dataToUpdate: RecordOfFlowArrays | { oldName: string; newName: string }
  ) {
    const data = await this.getData();
    for (const key in dataToUpdate) {
      data[key] = dataToUpdate[key];
    }
    await overrideYaml(this.yamlPathLong, convertToYamlWithRefs(data));
  }

  private setMissingReferences(dataToAdd: Record<string, FlowObject[]>) {
    for (const key in dataToAdd) {
      for (const data of dataToAdd[key]) {
        data.Flow.forEach((e) => {
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
