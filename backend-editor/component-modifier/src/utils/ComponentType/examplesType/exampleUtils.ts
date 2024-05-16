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
    const path = `${addExample.folderPath}/${addExample.folderApi}`;
    await fs_p.mkdir(path, { recursive: true });
    await fs_p.writeFile(
      `${path}/${addExample.exampleName}.yaml`,
      yaml.dump(addExample.exampleValue)
    );
  } catch (e) {
    throw new Error(`Error adding example: ${e}`);
  }
}

export async function DeleteExampleFolder(folderPath: string) {
  try {
    await fs_p.rm(folderPath, { recursive: true });
  } catch (e) {
    throw new Error(`Error deleting example: ${e}`);
  }
}

export async function AddForm(
  formName: string,
  formHtml: string,
  folderPath: string
) {
  try {
    const path = `${folderPath}/forms`;
    await fs_p.mkdir(path, { recursive: true });
    await fs_p.writeFile(`${folderPath}/forms/${formName}.html`, formHtml);
  } catch (e) {
    throw new Error(`Error adding form: ${e}`);
  }
}

export async function GetFormData(folderPath: string) {
  try {
    const path = `${folderPath}/forms`;
    if (!fs.existsSync(path)) {
      return undefined;
    }
    const files = await fs_p.readdir(path);
    const formFiles = files.filter((file) => file.endsWith(".html"));
    if (formFiles.length === 0) return undefined;
    const formData = [];
    for (const file of formFiles) {
      const data = await fs_p.readFile(`${path}/${file}`, "utf8");
      formData.push({
        formName: file.replace(".html", ""),
        formHtml: data,
      });
    }
    return formData;
  } catch (e) {
    throw new Error(`Error getting form data: ${e}`);
  }
}
