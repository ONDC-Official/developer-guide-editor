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
    const string = await readYamlFile(this.yamlPathLong);
    const data = yaml.load(string) as ExampleFolderYaml;
    console.log(data);
    return data;
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
