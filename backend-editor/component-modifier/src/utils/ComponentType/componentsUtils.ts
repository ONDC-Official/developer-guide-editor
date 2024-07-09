import { EditableRegistry } from "../EditableRegistry";
import { AttributeFile } from "./AttributeType/AttributeRow";
import { AttributesFolderTypeEditable } from "./AttributeType/AttributesFolderTypeEditable";
import { getSheetsObj } from "./AttributeType/attributeYamlUtils";
import { ComponentsType } from "./ComponentsFolderTypeEditable";
import path from "path";
import fs from "fs";
import { initRegistry } from "../RegisterList";
import { EnumFolderType } from "./enumType/enumFolderType";
import { EnumFileType } from "./enumType/enumFileType";
import { enumsFromObj } from "./enumType/enumUtils";
import { TagsFolderType } from "./tagType/tagsFolderType";
import { TagFileType } from "./tagType/tagFileType";
import { tagsFromApiObj } from "./tagType/tagsUtils";
import { ExampleDomainFolderType } from "./examplesType/ExampleDomainFolderType";
import { ExampleFolderType } from "./examplesType/exampleFolderType";
import { FlowFolderType } from "./flowType/flowFolderType";
import { FlowFileType } from "./flowType/flowFileType";
import yaml from "js-yaml";

type X_ATTRIBUTES = Record<string, { attribute_set: Record<string, any> }>;
type X_ENUM = Record<string, any>;
type X_TAGS = Record<string, any>;
type X_FLOWS = {
  summary: string;
  details: any;
  references: string;
  steps: {
    summary: string;
    api: string;
    details: { description: string; mermaid: string }[];
    references: string;
    example: {
      value: any;
    };
  }[];
}[];
type X_EXAMPLES = Record<
  string,
  {
    summary: string;
    description: string;
    example_set: Record<
      string,
      { examples: { summary: string; description: string; value: any }[] }
    >;
  }
>;
type exampleCache = {
  $ref: string;
  value: string;
}[];

interface RAW_DATA {
  "x-enum"?: X_ENUM;
  "x-tags"?: X_TAGS;
  "x-flows"?: X_FLOWS;
  "x-examples"?: X_EXAMPLES;
  "x-attributes"?: X_ATTRIBUTES;
}

export const BuildCompenetsWithRawBuild = async (
  data: RAW_DATA,
  comp: ComponentsType
) => {
  //   const comp: ComponentsType = await EditableRegistry.create(
  //     "COMPONENTS-FOLDER",
  //     "../../../../backend-editor/component-modifier/test",
  //     "components"
  //   );
  for (const key of comp.childrenEditables) {
    await comp.remove({ folderName: key.name });
  }

  //   data = yaml.load(data) as R;

  const example_cache: exampleCache = [];
  await createAttributes(data, comp);
  await createEnums(data, comp);
  await createTags(data, comp);
  await createExamples(data, comp, example_cache);
  await createFlows(data, comp, example_cache);

  //   return comp;
};

async function createAttributes(data: RAW_DATA, comp: ComponentsType) {
  if (!data["x-attributes"]) return;

  await comp.add({ ID: AttributesFolderTypeEditable.REGISTER_ID });
  const attributes: AttributesFolderTypeEditable = comp.getTarget(
    AttributesFolderTypeEditable.REGISTER_ID,
    "attributes",
    comp
  ) as AttributesFolderTypeEditable;
  for (const domain in data["x-attributes"]) {
    const yamlData = data["x-attributes"][domain];
    const sheetName = domain;
    await attributes.add({ ID: AttributeFile.REGISTER_ID, name: sheetName });
    const attributeFile = attributes.getTarget(
      AttributeFile.REGISTER_ID,
      sheetName,
      attributes
    ) as AttributeFile;
    const attributeSet = getSheetsObj(yamlData.attribute_set);
    await attributeFile.add(attributeSet);
  }
}
async function createEnums(data: RAW_DATA, comp: ComponentsType) {
  if (!data["x-enum"]) return;
  await comp.add({ ID: EnumFolderType.REGISTER_ID });
  const enums = comp.getTarget(
    EnumFolderType.REGISTER_ID,
    "enum",
    comp
  ) as EnumFolderType;
  //   for (const domain in data["x-enum"]) {
  // const yamlData = data["x-enum"][domain];
  const enumFile = enums.getTarget(
    EnumFileType.REGISTER_ID,
    "default",
    enums
  ) as EnumFileType;
  await enumFile.add(enumsFromObj(data["x-enum"]));
  //   }
}
async function createTags(data: RAW_DATA, comp: ComponentsType) {
  if (!data["x-tags"]) return;
  await comp.add({ ID: TagsFolderType.REGISTER_ID });
  const tags = comp.getTarget(
    TagsFolderType.REGISTER_ID,
    "tags",
    comp
  ) as TagsFolderType;
  console.log(tags.childrenEditables);
  const tagFile = tags.getTarget(
    TagFileType.REGISTER_ID,
    "default",
    tags
  ) as TagFileType;

  await tagFile.add(tagsFromApiObj(data["x-tags"]));
}
async function createExamples(
  data: RAW_DATA,
  comp: ComponentsType,
  example_cache: exampleCache
) {
  if (!data["x-examples"]) return;
  await comp.add({ ID: ExampleFolderType.REGISTER_ID });
  const examples = comp.getTarget(
    ExampleFolderType.REGISTER_ID,
    "examples",
    comp
  ) as ExampleFolderType;
  for (const domain in data["x-examples"]) {
    const yamlData = data["x-examples"][domain];
    await examples.add({
      ID: ExampleDomainFolderType.REGISTER_ID,
      name: domain,
      summary: yamlData.summary,
      description: yamlData.description,
    });
    const exampleDomain = examples.getTarget(
      ExampleDomainFolderType.REGISTER_ID,
      domain,
      examples
    ) as ExampleDomainFolderType;
    for (const example in yamlData.example_set) {
      if (example.includes("form")) continue;
      for (const set of yamlData.example_set[example].examples) {
        example_cache.push({
          $ref: `../../examples/${domain}/${example}/${set.summary
            .trim()
            .split(" ")
            .join("_")}.yaml`,
          value: JSON.stringify(set.value),
        });
        await exampleDomain.add({
          ID: "JSON",
          name: example,
          examples: {
            [example]: [
              {
                ID: "JSON",
                name: example,
                exampleName: set.summary.trim().split(" ").join("_"),
                summary: set.summary.trim().split(" ").join("_"),
                description: set.description,
                exampleValue: set.value,
              },
            ],
          },
        });
      }
    }
  }
}
async function createFlows(
  data: RAW_DATA,
  comp: ComponentsType,
  example_cache: exampleCache
) {
  if (!data["x-flows"]) return;
  let examplesFolder: undefined | ExampleFolderType = undefined;
  let extraExamples: undefined | ExampleDomainFolderType = null;
  try {
    console.log(comp.childrenEditables);
    examplesFolder = comp.getTarget(
      ExampleFolderType.REGISTER_ID,
      "examples",
      comp
    ) as ExampleFolderType;
    await examplesFolder.add({
      ID: ExampleDomainFolderType.REGISTER_ID,
      name: "EXTRA",
      summary: "Extra Examples",
      description: "Extra Examples",
    });
    extraExamples = examplesFolder.getTarget(
      ExampleDomainFolderType.REGISTER_ID,
      "EXTRA",
      examplesFolder
    ) as ExampleDomainFolderType;
  } catch (e) {
    console.error(e);
    return;
  }

  await comp.add({ ID: "FLOW_FOLDER" });
  const flowFolder = comp.getTarget(
    "FLOW_FOLDER",
    "flows",
    comp
  ) as FlowFolderType;

  for (const flow of data["x-flows"]) {
    const flowName = makeValidFolderName(flow.summary);
    await flowFolder.add({
      ID: FlowFileType.REGISTER_ID,
      name: flowName,
    });
    const flowFile = flowFolder.getTarget(
      FlowFileType.REGISTER_ID,
      flowName,
      flowFolder
    ) as FlowFileType;

    const ExtraFolderName = "EXTRA";
    let index = 0;
    for (const step of flow.steps) {
      if (step.example) {
        const example = example_cache.find(
          (ex) => ex.value === JSON.stringify(step.example.value)
        );
        if (example) {
          step.example.value = { $ref: example.$ref };
        } else {
          index++;
          const name = `${step.api}_${makeValidFolderName(
            step.summary
          )}_${index}`;
          await extraExamples.add({
            ID: "JSON",
            name: step.api,
            examples: {
              [step.api]: [
                {
                  ID: step.api === "form" ? "FORM" : "JSON",
                  name: ExtraFolderName,
                  exampleName: name,
                  summary: name,
                  description: "TBD",
                  exampleValue: step.example.value,
                },
              ],
            },
          });
          step.example.value = {
            $ref: `../../examples/EXTRA/${name}.yaml`,
          };
        }
      }
    }

    await flowFile.add({
      summary: flow.summary as any,
      details: flow.details as any,
      references: flow.references as any,
      steps: flow.steps as any,
    });
  }
}
function makeValidFolderName(input: string): string {
  // Replace invalid characters with underscores or hyphens
  // Here, we'll replace ':' and spaces with an underscore
  let output = input.replace(/[^a-zA-Z0-9]/g, "_");

  // Convert to lowercase for consistency
  output = output.toLowerCase();

  return output;
}
// (async () => {
//   initRegistry();
//   const data: RAW_DATA = JSON.parse(
//     fs.readFileSync(path.resolve(__dirname, "./build.json"), "utf-8")
//   );
//   await BuildCompenetsWithRawBuild(data);
// })();
