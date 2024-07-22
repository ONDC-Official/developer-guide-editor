import path from "path";
import fs from "fs";
import fsExtra from "fs-extra";
import { isBinary } from "../fileUtils";
import unzipper from "unzipper";
import { ondc_build } from "ondc-build-utility";

const example_yaml = isBinary
  ? path.join(
      path.dirname(process.execPath),
      "./FORKED_REPO/api/components/index.yaml"
    )
  : "../FORKED_REPO/api/components/index.yaml"; //  main file of the yamls

const outputFolderPath = isBinary
  ? path.join(path.dirname(process.execPath), "./FORKED_REPO/api/build")
  : "../FORKED_REPO/api/build"; // build.yaml output folder

const outputPath = isBinary
  ? path.join(
      path.dirname(process.execPath),
      "./FORKED_REPO/api/build/build.yaml"
    )
  : "../FORKED_REPO/api/build/build.yaml"; // build.yaml output

const uiPath = isBinary
  ? path.join(path.dirname(process.execPath), "./FORKED_REPO/ui/build.js")
  : path.resolve(__dirname, "../../../BECKN_CORES/build.js"); // build.js output

const docs = isBinary
  ? path.join(
      path.dirname(process.execPath),
      "./FORKED_REPO/api/components/docs"
    )
  : path.resolve(__dirname, "../../../../FORKED_REPO/api/components/docs");

const tempPath = `./temp.yaml`;

export async function buildWrapper(domain = "fis") {
  const base_yaml = isBinary
    ? path.join(
        path.dirname(process.execPath),
        `../../../BECKN_CORES/${domain}/beckn_yaml.yaml`
      )
    : path.resolve(__dirname, `../../../BECKN_CORES/${domain}/beckn_yaml.yaml`);
  try {
    await becknCore(domain); // extract beckn core
    fsExtra.copyFileSync(
      base_yaml,
      path.resolve(
        __dirname,
        "../../../../FORKED_REPO/api/components/beckn_yaml.yaml"
      )
    );
    fsExtra.ensureDirSync(docs);
    fs.mkdirSync(outputFolderPath, { recursive: true });
    const result = await ondc_build(
      base_yaml,
      example_yaml,
      outputPath,
      uiPath,
      docs
    );
    if (!result) {
      return false;
    }
    return true;
  } catch (e) {
    console.log(e);
  }
}

async function becknCore(domain: string) {
  return new Promise((resolve, reject) => {
    // argument example
    var zipFilePath = isBinary
      ? path.join(
          path.dirname(process.execPath),
          `../../../BECKN_CORES/${domain}/beckn-core.zip`
        )
      : path.resolve(
          __dirname,
          `../../../BECKN_CORES/${domain}/beckn-core.zip`
        );

    const outFolderPath = isBinary
      ? path.join(
          path.dirname(process.execPath),
          `./FORKED_REPO/api/components/index.yaml`
        )
      : `../FORKED_REPO/`; //args[1]; //  main file of the yamls

    console.log("zipFilePath", zipFilePath, fs.existsSync(zipFilePath));

    if (
      !fs.existsSync(outFolderPath + "beckn-core") ||
      fs.readdirSync(`${outFolderPath}beckn-core`).length < 5
    ) {
      // check if files exists in beckn core folder or not
      if (!fs.existsSync(zipFilePath)) {
        // use common beckn core if not available in forked folder
        zipFilePath = isBinary
          ? path.join(
              path.dirname(process.execPath),
              `./FORKED_REPO/api/components/index.yaml`
            )
          : `./beckn-core.zip`; //args[1]; //  main file of the yamls
      }
      fs.createReadStream(zipFilePath)
        .pipe(unzipper.Parse())
        .on("entry", function (entry) {
          const fileName = entry.path;
          const type = entry.type; // 'Directory' or 'File'
          const fullPath = path.join(outFolderPath, fileName);

          if (fileName.startsWith("__MACOSX")) {
            // Skip macOS metadata directories
            entry.autodrain();
          } else {
            if (type === "Directory") {
              fs.mkdirSync(fullPath, { recursive: true });
              entry.autodrain();
            } else {
              entry.pipe(fs.createWriteStream(fullPath));
            }
          }
        })
        .on("close", () => {
          console.log("Beckn-core extraction complete");
          resolve("");
        })
        .on("error", (err) => {
          reject("");
          console.error("Error extracting ZIP file:", err);
        });
    } else {
      console.log("Beckn Core is already extracted");
      resolve("");
    }
  });
}
