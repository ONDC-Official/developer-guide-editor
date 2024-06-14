const { exec } = require("child_process");
const fs = require("fs-extra");
const path = require("path");

const frontendEditorPath = path.join(__dirname, "frontend-editor");
const componentModifierPath = path.join(
  __dirname,
  "backend-editor",
  "component-modifier"
);
const distPath = path.join(frontendEditorPath, "react-build");
const destPath = path.join(componentModifierPath, "react-build");

(async () => {
  const ora = (await import("ora")).default;

  const spinner = ora();

  // Step 1: Run `npm run build` inside frontend-editor
  spinner.start("Building project in frontend-editor...");
  exec(
    "npm run build",
    { cwd: frontendEditorPath },
    (error, stdout, stderr) => {
      if (error) {
        spinner.fail("Error running build");
        console.error(`Error running build: ${error}`);
        return;
      }
      spinner.succeed("Build completed");

      // Step 2: Copy the dist folder to component-modifier folder
      spinner.start("Copying react-build folder to component-modifier...");
      fs.copy(distPath, destPath, (copyErr) => {
        if (copyErr) {
          spinner.fail("Error copying react-build folder");
          console.error(`Error copying react-build folder: ${copyErr}`);
          return;
        }
        spinner.succeed("react-build folder copied successfully");

        // Step 3: Run `npm run binary` in the component-modifier folder
        spinner.start("Running binary in component-modifier...");
        exec(
          "npm run binary",
          { cwd: componentModifierPath },
          (binaryError, binaryStdout, binaryStderr) => {
            if (binaryError) {
              spinner.fail("Error running binary");
              console.error(`Error running binary: ${binaryError}`);
              return;
            }
            spinner.succeed("Binary completed");
            console.log(`Binary output: ${binaryStdout}`);
          }
        );
      });
    }
  );
})();
