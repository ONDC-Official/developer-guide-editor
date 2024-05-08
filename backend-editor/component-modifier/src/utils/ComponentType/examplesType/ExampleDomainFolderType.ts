import { folderTypeEditable } from "../../folderTypeEditable";
import { updateYamlRefExampleDomain } from "../../yamlUtils";
import { ValidateJsonSchema, deleteFile, readYamlFile } from "../../fileUtils";
import yaml from "js-yaml";
import { ExampleDomainIndexYml } from "./exampleFolderType";
import { FileTypeEditable } from "../../FileTypeEditable";
import { AddExampleJson } from "./exampleUtils";

export class ExampleDomainFolderType extends folderTypeEditable {
  static REGISTER_ID = "EXAMPLE_DOMAIN_FOLDER";

  constructor(path: string, name: string) {
    super(path, name);
  }

  getRegisterID(): string {
    return ExampleDomainFolderType.REGISTER_ID;
  }

  async add(newEditable: {
    ID: string; // use ID to determine FORM or JSON
    name: string; // api folder name
    exampleName: string; // api inside api folder
    summary: string;
    description: string;
    exampleValue: Record<string, any> | string; // html code or json
  }) {
    if (newEditable.ID === "FORM") {
      throw new Error("Form not yet Implemented");
    }

    if (
      newEditable.ID !== "JSON" &&
      typeof newEditable.exampleValue !== "string"
    ) {
      const validExample = await ValidateJsonSchema(newEditable.exampleValue);
      if (!validExample) {
        throw new Error("Invalid Example JSON");
      }
      await updateYamlRefExampleDomain(
        this.yamlPathLong,
        newEditable.name,
        newEditable.summary,
        newEditable.description,
        newEditable.exampleName
      );
      await AddExampleJson({
        folderApi: newEditable.name,
        exampleName: newEditable.exampleName,
        exampleValue: newEditable.exampleValue,
        folderPath: this.folderPath,
      });
    }
  }

  async getData(query: any) {
    const string = await readYamlFile(this.yamlPathLong);
    const data: Record<string, any> = yaml.load(string);
    const parsedData = data as ExampleDomainIndexYml;
    const getData: Record<string, any> = {};
    for (const key in parsedData) {
      getData[key] = parsedData[key].examples.map((e) => {
        return {
          summary: e.summary,
          description: e.description,
          apiName: e.value.$ref.split("/").pop().split(".")[0],
        };
      });
    }
    return getData;
  }

  async remove(deleteTarget: {
    folderName: string;
    exampleName: string | undefined;
  }) {
    if (deleteTarget.exampleName) {
      const data = yaml.load(
        await readYamlFile(this.yamlPathLong)
      ) as ExampleDomainIndexYml;

      data[deleteTarget.folderName].examples = data[
        deleteTarget.folderName
      ].examples.filter((e) => {
        return e.value.$ref !== `./${deleteTarget.exampleName}.yaml`;
      });
      await deleteFile(this.folderPath + `/${deleteTarget.exampleName}.yaml`);
    } else {
      await super.remove(deleteTarget);
      await updateYamlRefExampleDomain(
        this.yamlPathLong,
        deleteTarget.folderName,
        "",
        "",
        "",
        true
      );
    }
  }

  async update(update: {
    oldName: string;
    newName: string;
    exampleName: string;
    summary: string;
    description: string;
  }) {
    const data = yaml.load(
      await readYamlFile(this.yamlPathLong)
    ) as ExampleDomainIndexYml;
    data[update.oldName].examples = data[update.oldName].examples.map((e) => {
      if (e.value.$ref === `./${update.exampleName}.yaml`) {
        return {
          summary: update.summary,
          description: update.description,
          value: { $ref: `./${update.newName}/${update.exampleName}.yaml` },
        };
      }
      return e;
    });
    await updateYamlRefExampleDomain(
      this.yamlPathLong,
      update.oldName,
      "",
      "",
      update.exampleName,
      true
    );
    await updateYamlRefExampleDomain(
      this.yamlPathLong,
      update.newName,
      update.summary,
      update.description,
      update.exampleName
    );
  }
}
