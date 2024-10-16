import fs_p from "fs/promises";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";

import { overrideYaml } from "./yamlUtils";
import { loadYamlWithRefs, readYamlFile } from "./fileUtils";
import { ExampleFolderType } from "./ComponentType/examplesType/exampleFolderType";
import { ExampleDomainFolderType } from "./ComponentType/examplesType/ExampleDomainFolderType";
import { ComponentsType } from "./ComponentType/ComponentsFolderTypeEditable";
import { EditableRegistry } from "./EditableRegistry";
export class ComponentLoader {
  static async loadComponent(componentPath: string, name: string) {
    const comp: ComponentsType = (await EditableRegistry.create(
      "COMPONENTS-FOLDER",
      componentPath,
      name
    )) as ComponentsType;

    // console.log("Loading Component:", comp.folderPath);
    let compFiles = await fs_p.readdir(comp.folderPath, {
      withFileTypes: true,
    });

    for (const file of compFiles) {
      if (!file.isDirectory()) continue;
      if (file.name === "enums") {
        await fs.renameSync(
          `${comp.folderPath}/enums`,
          `${comp.folderPath}/enum`
        );
      }
    }
    compFiles = await fs_p.readdir(comp.folderPath, {
      withFileTypes: true,
    });
    // console.log(await EditableRegistry.extractExampleDescripitons(comp));

    for (const file of compFiles) {
      if (!file.isDirectory()) continue;
      await ComponentLoader.loadAttributes(file, comp);
      await ComponentLoader.loadEnums(file, comp);
      await ComponentLoader.loadTags(file, comp);
      await ComponentLoader.loadFlows(file, comp);
      await ComponentLoader.loadExamplesNew(file, comp);
      await ComponentLoader.loadTlc(file, comp);
    }

    return comp;
  }

  private static async loadTags(file: fs.Dirent, comp: ComponentsType) {
    if (file.name === "tags") {
      const defExists = fs.existsSync(`${comp.folderPath}/tags/default`);
      const ymlPath = `${comp.folderPath}/tags/index.yaml`;
      const indexExists = fs.existsSync(ymlPath);
      let data: any = "";
      console.log(`Yml exists: ${indexExists} def exists: ${defExists}`);
      if (indexExists) {
        data = await loadYamlWithRefs(ymlPath);
      }
      await comp.add({ ID: "TAG_FOLDER" });
      const tagFolder = comp.getTarget("TAG_FOLDER", "tags", comp);
      const tagFiles = await fs_p.readdir(tagFolder.folderPath, {
        withFileTypes: true,
      });
      if (!defExists) {
        if (data !== "") {
          await overrideYaml(
            tagFolder.folderPath + "/default/index.yaml",
            yaml.dump(data)
          );
        }
      }
      for (const tagFile of tagFiles) {
        if (tagFile.isDirectory() && tagFile.name !== "default") {
          await tagFolder.add({
            ID: "TAG_FILE",
            name: tagFile.name,
          });
        }
      }
    }
  }

  private static async loadFlows(file: fs.Dirent, comp: ComponentsType) {
    if (file.name === "flows") {
      await comp.add({
        ID: "FLOW_FOLDER",
      });
      const attr = comp.getTarget("FLOW_FOLDER", "flows", comp);
      const attrFiles = await fs_p.readdir(attr.folderPath, {
        withFileTypes: true,
      });

      for (const attrFile of attrFiles) {
        if (attrFile.isDirectory()) {
          await attr.add({
            ID: "FLOW_FILE",
            name: attrFile.name,
          });
        }
      }
    }
  }
  private static async loadEnums(file: fs.Dirent, comp: ComponentsType) {
    if (file.name === "enum") {
      const defExists = fs.existsSync(`${comp.folderPath}/enum/default`);
      const ymlPath = `${comp.folderPath}/enum/index.yaml`;
      const indexExists = fs.existsSync(ymlPath);
      let data: any = "";
      console.log(`Yml exists: ${indexExists} def exists: ${defExists}`);
      if (indexExists) {
        data = await loadYamlWithRefs(ymlPath);
      }
      await comp.add({ ID: "ENUM_FOLDER" });
      const enumFolder = comp.getTarget("ENUM_FOLDER", "enum", comp);
      const enumFiles = await fs_p.readdir(enumFolder.folderPath, {
        withFileTypes: true,
      });
      if (!defExists) {
        if (data !== "") {
          await overrideYaml(
            enumFolder.folderPath + "/default/index.yaml",
            yaml.dump(data)
          );
        }
      }
      for (const enumFile of enumFiles) {
        if (enumFile.isDirectory() && enumFile.name !== "default") {
          await enumFolder.add({
            ID: "ENUM_FILE",
            name: enumFile.name,
          });
        }
      }
    }
  }

  private static async loadAttributes(file: fs.Dirent, comp: ComponentsType) {
    if (file.name === "attributes") {
      await comp.add({
        ID: "ATTRIBUTE_FOLDER",
      });
      const attr = comp.getTarget("ATTRIBUTE_FOLDER", "attributes", comp);
      const attrFiles = await fs_p.readdir(attr.folderPath, {
        withFileTypes: true,
      });
      for (const attrFile of attrFiles) {
        if (attrFile.isDirectory()) {
          await attr.add({
            ID: "ATTRIBUTE_FILE",
            name: attrFile.name,
          });
        }
      }
    }
  }

  private static async loadExamplesNew(file: fs.Dirent, comp: ComponentsType) {
    if (file.name !== "examples") return;
    let existingIndexData = {};
    const descriptionData = await ComponentLoader.extractExampleDescripitons(
      comp
    );
    const indexPath = `${comp.folderPath}/examples/index.yaml`;
    if (fs.existsSync(indexPath)) {
      existingIndexData = await loadYamlWithRefs(indexPath);
      existingIndexData = existingIndexData || {};
    }
    console.log("adding example folder");
    await comp.add({ ID: "EXAMPLE_FOLDER" });
    const exampleFolder = comp.getTarget(
      "EXAMPLE_FOLDER",
      "examples",
      comp
    ) as ExampleFolderType;
    const exampleFolders = await fs_p.readdir(exampleFolder.folderPath, {
      withFileTypes: true,
    });

    // iterating domains in Example folder
    for (const domainFolder of exampleFolders) {
      if (!domainFolder.isDirectory()) continue;

      let description = "TBD";
      let summary = "TBD";

      if (existingIndexData[domainFolder.name]) {
        description = existingIndexData[domainFolder.name].description;
        summary = existingIndexData[domainFolder.name].summary;
      }

      await exampleFolder.add({
        ID: "EXAMPLE_DOMAIN_FOLDER",
        name: domainFolder.name,
        description: description,
        summary: summary,
      });
      const domainPath = `${exampleFolder.folderPath}/${domainFolder.name}`;
      const apiFolders = await fs_p.readdir(domainPath, {
        withFileTypes: true,
      });
      const addedExample = exampleFolder.getTarget(
        "EXAMPLE_DOMAIN_FOLDER",
        domainFolder.name,
        exampleFolder
      ) as ExampleDomainFolderType;

      for (const apiFolder of apiFolders) {
        if (!apiFolder.isDirectory()) continue;
        if (apiFolder.name === "forms") continue;
        const apiPath = `${domainPath}/${apiFolder.name}`;

        const apiFiles = await fs_p.readdir(apiPath, {
          withFileTypes: true,
        });
        // console.log("apiFiles", apiFiles);
        for (const exampleYaml of apiFiles) {
          if (!exampleYaml.isFile()) {
            console.log("skipping", exampleYaml.name);
            continue;
          }
          console.log("exampleYaml", exampleYaml.name);
          const examplePath = `${apiPath}/${exampleYaml.name}`;
          let exampleData = undefined;
          try {
            exampleData = yaml.load(await readYamlFile(examplePath));
          } catch (e) {
            console.log("cannot load", examplePath);
          }
          if (!exampleData) continue;

          let description = "TBD";
          let summary = exampleYaml.name.split(".")[0];
          const entryKey =
            domainFolder.name + `./${apiFolder.name}/${exampleYaml.name}`;
          if (descriptionData[entryKey]) {
            console.log("found description", entryKey);
            description = descriptionData[entryKey].description;
            summary = descriptionData[entryKey].summary;
          }

          await addedExample.add({
            ID: "JSON",
            name: apiFolder.name,
            examples: {
              [apiFolder.name]: [
                {
                  ID: "JSON",
                  name: apiFolder.name,
                  exampleName: exampleYaml.name.split(".")[0],
                  summary: summary,
                  description: description,
                  exampleValue: exampleData,
                },
              ],
            },
          });
        }
      }
    }
  }

  private static async loadTlc(file: fs.Dirent, comp: ComponentsType) {
    if (file.name !== "tlc") return;
    await comp.add({ ID: "TLC_FOLDER" });
  }

  private static async extractExampleDescripitons(comp: ComponentsType) {
    const examplePath = `${comp.folderPath}/examples`;
    const indexPath = `${comp.folderPath}/examples/index.yaml`;
    const returnData: Record<string, { summary; description }> = {};
    if (!fs.existsSync(indexPath)) return {};

    let rawIndexData: Record<string, { example_set: { $ref: string } }>;
    rawIndexData = yaml.load(await readYamlFile(indexPath)) as any;
    if (!rawIndexData) return {};

    for (const key in rawIndexData) {
      const ref = rawIndexData[key].example_set.$ref;
      if (!ref) continue;
      const subPath = path.resolve(examplePath, ref);
      const fileData = await readYamlFile(subPath);
      const subYamlData: Record<
        string,
        {
          examples: {
            summary: string;
            description: string;
            value: { $ref: string };
          }[];
        }
      > = yaml.load(fileData) as any;
      if (!subYamlData) continue;
      for (const subKey in subYamlData) {
        for (const example of subYamlData[subKey].examples) {
          returnData[key + example.value.$ref] = {
            summary: example.summary,
            description: example.description,
          };
        }
      }
    }
    return returnData;
  }
}
