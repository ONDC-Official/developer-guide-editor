const path = require("path");
const fs = require("fs")
import { isBinary } from "../fileUtils";
const unzipper = require('unzipper');

//paths
const base_yaml = isBinary? path.join(path.dirname(process.execPath),"./FORKED_REPO/api/components/beckn_yaml.yaml"): "../FORKED_REPO/api/components/beckn_yaml.yaml"; //beckn yaml
const example_yaml = isBinary? path.join(path.dirname(process.execPath),"./FORKED_REPO/api/components/index.yaml"):"../FORKED_REPO/api/components/index.yaml"; //  main file of the yamls
const outputPath = isBinary? path.join(path.dirname(process.execPath), "./FORKED_REPO/api/build/build.yaml") : "../FORKED_REPO/api/build/build.yaml"; // build.yaml output
const uiPath = isBinary? path.join(path.dirname(process.execPath), "./FORKED_REPO/ui/build.js") : "../FORKED_REPO/ui/build.js"; // build.js output
const docs = isBinary? path.join(path.dirname(process.execPath), "./FORKED_REPO/api/components/docs") : "../FORKED_REPO/api/components/docs"; // docs folder path

const tempPath = `./temp.yaml`;
const {ondc_build} = require("ondc-build-utility")


export async function buildWrapper() {
  try {
    await  becknCore() // extract beckn core
    const result = await ondc_build(base_yaml,example_yaml,outputPath,uiPath,docs)
      if(!result){
        return false
      }
      return true;
  } catch (e) {
    console.log(e);
  }
}


async function becknCore(){
  return new Promise((resolve,reject)=>{


// argument example
var zipFilePath = isBinary? path.join(path.dirname(process.execPath),`./FORKED_REPO/api/components/index.yaml`):`../FORKED_REPO/beckn-core.zip`; //args[1]; //  main file of the yamls
const outFolderPath = isBinary? path.join(path.dirname(process.execPath),`./FORKED_REPO/api/components/index.yaml`):`../FORKED_REPO/`; //args[1]; //  main file of the yamls
// const zipFilePath = './beckn-core.zip'; // Path to your ZIP file
// const outFolderPath = './'; // Directory where you want to extract the files



if(!fs.existsSync(outFolderPath+"beckn-core") || fs.readdirSync(`${outFolderPath}beckn-core`).length < 5){ // check if files exists in beckn core folder or not
  if(!fs.existsSync(zipFilePath)){ // use common beckn core if not available in forked folder
    zipFilePath = isBinary? path.join(path.dirname(process.execPath),`./FORKED_REPO/api/components/index.yaml`):`./beckn-core.zip`; //args[1]; //  main file of the yamls
  }
  fs.createReadStream(zipFilePath)
  .pipe(unzipper.Parse())
  .on('entry', function (entry) {
    const fileName = entry.path;
    const type = entry.type; // 'Directory' or 'File'
    const fullPath = path.join(outFolderPath, fileName);

    if (fileName.startsWith('__MACOSX')) {
      // Skip macOS metadata directories
      entry.autodrain();
    } else {
      if (type === 'Directory') {
        fs.mkdirSync(fullPath, { recursive: true });
        entry.autodrain();
      } else {
        entry.pipe(fs.createWriteStream(fullPath));
      }
    }
  })
  .on('close', () => {
    console.log('Beckn-core extraction complete');
    resolve("")

  })
  .on('error', (err) => {
    reject("")
    console.error('Error extracting ZIP file:', err);
  });
}
console.log("Beckn Core is already extracted")
resolve('')
})
}