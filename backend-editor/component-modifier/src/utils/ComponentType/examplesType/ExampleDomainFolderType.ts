import { folderTypeEditable } from "../../folderTypeEditable";
import { overrideYaml, updateYamlRefExampleDomain } from "../../yamlUtils";
import { ValidateJsonSchema, deleteFile, readYamlFile } from "../../fileUtils";
import yaml from "js-yaml";
import { ExampleDomainIndexYml } from "./exampleFolderType";
import {
  AddExampleJson,
  AddForm,
  DeleteExampleFolder,
  GetFormData,
} from "./exampleUtils";
import path from "path";

interface NewExample {
  ID: string; // use ID to determine FORM or JSON
  name: string; // api folder name
  exampleName: string; // api inside api folder
  summary: string;
  description: string;
  exampleValue: Record<string, any> | string; // html code or json
}

type AddNewExamples = {
  ID: string;
  name: string;
  examples: Record<string, NewExample[]>;
};

export class ExampleDomainFolderType extends folderTypeEditable {
  static REGISTER_ID = "EXAMPLE_DOMAIN_FOLDER";

  constructor(path: string, name: string) {
    super(path, name);
  }

  getRegisterID(): string {
    return ExampleDomainFolderType.REGISTER_ID;
  }

  async add(newExamples: AddNewExamples) {
    for (const key in newExamples.examples) {
      for (const example of newExamples.examples[key]) {
        const generatedName =
          key + "_" + example.summary.trim().split(" ").join("_");
        example.exampleName = generatedName;
        example.name = key;
        await this.addSingleExample(example);
      }
    }
  }

  async addSingleExample(newEditable: NewExample) {
    if (newEditable.name === "forms" && newEditable.ID !== "FORM") {
      throw new Error("To use form please select form type");
    }
    if (newEditable.ID === "FORM") {
      await AddForm(
        newEditable.exampleName,
        newEditable.exampleValue as string,
        this.folderPath
      );
      return;
    }

    if (newEditable.ID === "JSON") {
      // console.log("validating json", newEditable.exampleValue);
      if (typeof newEditable.exampleValue === "string") {
        newEditable.exampleValue = JSON.parse(
          newEditable.exampleValue
        ) as Record<string, any>;
      }
      const validExample = await ValidateJsonSchema(newEditable.exampleValue);
      if (!validExample) {
        throw new Error("Invalid Example JSON");
      }
      console.log("validated json");
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
      getData[key] = [];

      for (const e of parsedData[key].examples) {
        const p = path.resolve(this.folderPath, e.value.$ref);
        const fileData = await readYamlFile(p);
        getData[key].push({
          summary: e.summary,
          description: e.description,
          apiName: e.value.$ref.split("/").pop().split(".")[0],
          $ref: e.value.$ref,
          exampleJson: yaml.load(fileData),
        });
      }
    }
    const formData = await GetFormData(this.folderPath);
    if (formData) {
      getData["forms"] = formData;
    }

    return getData;
  }

  async remove(deleteTarget: {
    folderName: string;
    exampleName?: string;
    formName?: string;
  }) {
    console.log(deleteTarget);
    if (deleteTarget.formName) {
      console.log("deleting form", deleteTarget.formName);
      await deleteFile(this.folderPath + `/form/${deleteTarget.formName}.html`);
      return;
    }
    if (deleteTarget.exampleName) {
      const data = yaml.load(
        await readYamlFile(this.yamlPathLong)
      ) as ExampleDomainIndexYml;

      data[deleteTarget.folderName].examples = data[
        deleteTarget.folderName
      ].examples.filter((e) => {
        return (
          e.value.$ref !==
          `./${deleteTarget.folderName}/${deleteTarget.exampleName}.yaml`
        );
      });
      await overrideYaml(this.yamlPathLong, yaml.dump(data));
      await deleteFile(
        this.folderPath +
          `/${deleteTarget.folderName}/${deleteTarget.exampleName}.yaml`
      );
    } else {
      // await super.remove(deleteTarget);
      DeleteExampleFolder(this.folderPath + `/${deleteTarget.folderName}`);
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
    type: string;
  }) {
    if (update.type === "EXAMPLE") {
      const exName =
        update.oldName + "_" + update.summary.trim().split(" ").join("_");
      let exValue = await readYamlFile(
        `${this.folderPath}/${update.oldName}/${exName}.yaml`
      );
      exValue = yaml.load(exValue);
      await this.remove({
        folderName: update.oldName,
        exampleName: exName,
      });
      await this.add({
        ID: "",
        name: "",
        examples: {
          [update.oldName]: [
            {
              ID: "JSON",
              name: update.oldName,
              exampleName: "",
              summary: update.newName,
              description: update.description,
              exampleValue: exValue,
            },
          ],
        },
      });
      return;
    }
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
