import { folderTypeEditable } from "../../folderTypeEditable";
import { updateYamlRefExamples } from "../../yamlUtils";
import { readYamlFile } from "../../fileUtils";
import yaml from "js-yaml";
import { ExampleDomainFolderType } from "./ExampleDomainFolderType";

type ExampleFolderYaml = Record<
  string,
  { summary: string; description: string }
>;

export class ExampleFolderType extends folderTypeEditable {
  static REGISTER_ID = "EXAMPLE_FOLDER";

  constructor(path: string, name: string) {
    super(path, name);
    this.allowedList = [ExampleDomainFolderType.REGISTER_ID];
  }

  getRegisterID(): string {
    return ExampleFolderType.REGISTER_ID;
  }

  async add(newEditable: {
    ID: string;
    name: string;
    description: string;
    summary: string;
  }) {
    if (!this.allowedList.includes(newEditable.ID)) {
      throw new Error(`Enums only allow ${this.allowedList} as children.`);
    }
    try {
      await super.add({ ID: newEditable.ID, name: newEditable.name });
      await updateYamlRefExamples({
        section: newEditable.name,
        summary: newEditable.summary,
        description: newEditable.description,
        filePath: this.yamlPathLong,
      });
    } catch (e) {
      throw new Error(`Error adding example: ${e}`);
    }
  }
  //q:

  async getData(query: any) {
    if (query.type === "reference") {
      return await this.getReferenceData();
    }
    const string = await readYamlFile(this.yamlPathLong);
    const data = yaml.load(string) as ExampleFolderYaml;
    console.log(data);
    return data;
  }
  async getReferenceData() {
    const refs: string[] = [];
    console.log("getting reference data");
    for (const child of this.childrenEditables) {
      const data: Record<
        string,
        { $ref: string; apiName: string; formName?: string }[]
      > = await child.getData({});
      for (const key in data) {
        for (const ex of data[key]) {
          if (ex.formName) {
            refs.push(
              `../../examples/${child.name}/${key}/${ex.formName}.html`
            );
          }
          refs.push(`../../examples/${child.name}/${key}/${ex.apiName}.yaml`);
        }
      }
    }
    return refs;
  }
  async remove(deleteTarget: { folderName: string }) {
    await super.remove(deleteTarget);
    await updateYamlRefExamples(
      {
        section: deleteTarget.folderName,
        summary: "",
        description: "",
        filePath: this.yamlPathLong,
      },
      true
    );
  }
  async update(update: {
    oldName: string;
    newName: string;
    description: string;
    summary: string;
  }) {
    await super.update(update);
    await updateYamlRefExamples(
      {
        section: update.oldName,
        summary: "",
        description: "",
        filePath: this.yamlPathLong,
      },
      true
    );
    await updateYamlRefExamples({
      section: update.newName,
      summary: update.summary,
      description: update.description,
      filePath: this.yamlPathLong,
    });
  }
}

export type ExampleDomainIndexYml = Record<
  string,
  {
    examples: {
      summary: string;
      description: string;
      value: { $ref: string };
    }[];
  }
>;
