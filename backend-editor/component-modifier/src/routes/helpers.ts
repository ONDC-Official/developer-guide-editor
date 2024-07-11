import express from "express";
import axios from "axios";
import { ExtractAttributesFromExample } from "../utils/extraUtils/ExToAtt";
import fs from "fs";
import path from "path";
export const app = express();
app.use(express.json());

type compareResponse = {
  missingNumber: number;
  missingAttributes: string[];
};

app.post("/compareExample", async (req, res) => {
  try {
    const exampleString = req.body.exampleString;

    // Validate exampleString
    if (!exampleString || typeof exampleString !== "string") {
      return res.status(400).json({
        error: "Bad Request",
        errorMessage: "exampleString is not provided or is not a string",
      });
    }

    const exampleObject = JSON.parse(exampleString);
    console.log(exampleObject);

    // Make HTTP request
    const response = await axios.get(
      "http://localhost:1000/tree/guide/components/attributes?type=pathSet"
    );

    // Extract and filter attributes
    const extracted = ExtractAttributesFromExample(exampleObject);
    const filtered = extracted.map((obj) => obj.path);
    const filteredSet = new Set(filtered);

    // Compare with response data
    const extraAttributes = Array.from(filteredSet).filter(
      (obj) => !response.data.includes(obj)
    );
    const missingNumber = extraAttributes.length;

    // Prepare response
    const compareResponse = {
      missingNumber: missingNumber,
      missingAttributes: extraAttributes,
    };

    res.status(200).json(compareResponse);
  } catch (e) {
    res.status(500).json({
      error: "Internal Server Error",
      errorMessage: e.message,
    });
  }
});

app.get("/userGuide", async (req, res) => {
  const data = fs.readFileSync(path.resolve(__dirname, "../../userGuide.md"));
  res.status(200).send(data);
});
