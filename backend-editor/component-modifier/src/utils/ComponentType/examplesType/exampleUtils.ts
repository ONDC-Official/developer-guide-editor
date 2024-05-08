import fs from "fs";
import yaml from "js-yaml";
import fs_p from "fs/promises";

interface AddExample {
  folderApi: string;
  exampleName: string;
  exampleValue: Record<string, any>;
  folderPath: string;
}
export async function AddExampleJson(addExample: AddExample) {
  try {
    const path = `${addExample.folderPath}/${addExample.folderApi}}`;
    await fs_p.mkdir(path, { recursive: true });
    await fs_p.writeFile(
      `${path}/${addExample.exampleName}.yaml`,
      yaml.dump(addExample.exampleValue)
    );
  } catch (e) {
    throw new Error(`Error adding example: ${e}`);
  }
}
