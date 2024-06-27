import path from "path";
import { deleteFolderSync, loadYamlWithRefs } from "../fileUtils";
import fs, { copyFileSync, mkdir } from "fs";
import yaml from "js-yaml";
import { overrideYaml } from "../yamlUtils";
import { describe } from "node:test";
type exampleSet = Record<
  string,
  {
    examples: {
      summary: string;
      description: string;
      value: any;
    }[];
  }
>;

type exampleData = Record<
  string,
  {
    summary: string;
    description: string;
    example_set: exampleSet;
  }
>;

async function formatExampleSummary(yamlPath: string) {
  console.log("hello");
  const yamlData: Record<
    string,
    {
      examples: {
        summary: string;
        description: string;
        value: { $ref: string };
      }[];
    }
  > = yaml.load(fs.readFileSync(yamlPath, "utf-8")) as any;
  const newData = {};
  for (const api in yamlData) {
    const apiData = yamlData[api];
    for (const item of apiData.examples) {
      const ref = item.value.$ref;
      console.log(ref);
      const newSummary = ref.split("/")[2];
      item.summary = newSummary;
    }
    newData[api] = apiData;
  }
  console.log(yaml.dump(newData));
  fs.writeFileSync(yamlPath, yaml.dump(newData), "utf-8");
}

async function formatExampleFolder(examplePath: string) {
  const yamlData: exampleData = (await loadYamlWithRefs(
    examplePath + "/index.yaml"
  )) as exampleData;
  console.log(yamlData);
  const newPath = path.resolve(
    __dirname,
    "../../../../FORKED_REPO/api/components/NEWexamples"
  );
  if (fs.existsSync(newPath)) {
    await deleteFolderSync(newPath);
  }
  await fs.mkdirSync(newPath);

  const indexData = {};
  const flowRefs: Record<string, string> = {};
  for (const domain in yamlData) {
    const domainData = yamlData[domain];
    const domainPath = newPath + "/" + domain;
    fs.mkdirSync(domainPath);
    indexData[domain] = {
      summary: domainData.summary,
      description: domainData.description,
      example_set: { $ref: `./${domain}/index.yaml` },
    };
    const domainIndexData = {};
    for (const api in domainData.example_set) {
      if (api === "forms") continue;
      console.log(api);
      domainIndexData[api] = {
        examples: [],
      };
      const examplePath = domainPath + "/" + api;
      fs.mkdirSync(examplePath);
      let index = 1;
      for (const ex of domainData.example_set[api].examples) {
        const sum: string = ex.summary.split(" ").join("_");
        const fileName = `${sum}`;
        domainIndexData[api].examples.push({
          summary: `${fileName}`,
          description: ex.description,
          value: {
            $ref: `./${api}/${fileName}`,
          },
        });
        const orignalRef = `../../examples/personal-loans/${api}/${fileName}`;
        const newRef = `../../examples/${domain}/${api}/${fileName}`;
        flowRefs[orignalRef] = newRef;
        fs.writeFileSync(
          examplePath + "/" + fileName,
          yaml.dump(ex.value),
          "utf-8"
        );
        index += 1;
      }
    }
    console.log(domainPath + "/index.yaml");
    fs.writeFileSync(
      domainPath + "/index.yaml",
      yaml.dump(domainIndexData),
      "utf-8"
    );
  }
  //   overrideYaml;
  await fs.writeFileSync(
    newPath + "/index.yaml",
    yaml.dump(indexData),
    "utf-8"
  );

  const flowFolder = path.resolve(
    __dirname,
    "../../../../FORKED_REPO/api/components/flows/personal-loan"
  );
  const newPathFlow = path.resolve(
    __dirname,
    "../../../../FORKED_REPO/api/components/NEWflows"
  );
  if (fs.existsSync(newPathFlow)) {
    await deleteFolderSync(newPathFlow);
  }
  await fs.mkdirSync(newPathFlow);
  console.log(flowRefs);
  const subFiles = fs.readdirSync(flowFolder, { withFileTypes: true });
  const flowIndexData = [];
  for (const file of subFiles) {
    const data: {
      summary: string;
      details: any;
      refrences: string;
      steps: {
        summary: string;
        api: string;
        details: any;
        refernce: string;
        example: {
          value: {
            $ref: string;
          };
        };
      }[];
    } = (await yaml.load(
      fs.readFileSync(flowFolder + "/" + file.name, "utf-8")
    )) as any;

    // fix the steps $ref

    for (const step of data.steps) {
      const orignalRef = step.example.value.$ref;
      if (orignalRef.split("/").includes("forms")) continue;
      if (Object.keys(flowRefs).includes(orignalRef)) {
        console.log("HIT!");
        step.example.value.$ref = flowRefs[orignalRef];
      } else {
        console.log("MISS!");
        const remaingPath = orignalRef.split("../../examples")[1];
        const src = path.resolve(
          __dirname,
          `./../../../../FORKED_REPO/api/components/examples/${remaingPath}`
        );
        const dest = path.resolve(
          __dirname,
          `./../../../../FORKED_REPO/api/components/NEWexamples/${remaingPath}`
        );
        copyFileSync(src, dest);
      }
    }

    const newSubFolderName = data.summary.split(" ").join("_");
    const newSubFolderPath = `${newPathFlow}/${newSubFolderName}`;
    console.log(newSubFolderName);
    await fs.mkdirSync(newSubFolderPath, { recursive: true });
    await fs.writeFileSync(`${newSubFolderPath}/index.yaml`, yaml.dump(data));
    flowIndexData.push({ $ref: `./${newSubFolderName}/index.yaml` });
  }
  fs.writeFileSync(`${newPathFlow}/index.yaml`, yaml.dump(flowIndexData));
}

(async () => {
  // await formatExampleSummary(
  //   path.resolve(
  //     __dirname,
  //     "../../../../FORKED_REPO/api/components/examples/personal-loans/personal-loan.yaml"
  //   )
  // );
  // await formatExampleSummary(
  //   path.resolve(
  //     __dirname,
  //     "../../../../FORKED_REPO/api/components/examples/personal-loans/purchase-finance.yaml"
  //   )
  // );
  await formatExampleFolder(
    path.resolve(__dirname, "../../../../FORKED_REPO/api/components/examples")
  );
  // const str =
  //   "../../examples/personal-loans/on_search/on_search-request-pf_1.yaml";
  // console.log(str.split("../../"));
})();
