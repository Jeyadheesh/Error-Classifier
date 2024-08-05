const express = require("express");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/errors", (req, res) => {
  // Read the HTML content from a file
  fs.readFile(
    path.join(__dirname, "OriginalReport.html"),
    "utf8",
    (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        return res.status(500).send("Internal Server Error");
      }

      // Load the HTML into Cheerio
      const $ = cheerio.load(data);

      // Initialize an array to hold error steps
      let errorSteps = [];

      // Iterate over each step to find errors
      $(".row.steps").each((index, step) => {
        // Check if the step has an error
        const errorElement = $(step)
          .find('a[data-toggle="collapse"]')
          .filter((i, el) => $(el).text().includes("Show Error"));
        const errorContent = errorElement.next(".collapse").html();

        if (errorContent) {
          const status = $(step).find(".label").attr("title");
          const keyword = $(step).find(".keyword.highlight").text().trim();
          const description = $(step).find(".text").text().trim();
          const duration = $(step).find(".step-duration").text().trim();

          errorSteps.push({
            status,
            keyword,
            description,
            duration,
            error: errorContent,
          });
        }
      });

      // Generate HTML content for errors
      const htmlContent = generateHTMLContent(errorSteps);

      // Write the HTML content to a file
      const outputFilePath = path.join(__dirname, "ErrorsReport.html");
      fs.writeFile(outputFilePath, htmlContent, (err) => {
        if (err) {
          console.error("Error writing file:", err);
          return res.status(500).send("Internal Server Error");
        }

        res.sendFile(outputFilePath);
      });
    }
  );
});

// Function to generate HTML content from error steps
const generateHTMLContent = (errorSteps) => {
  let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Error Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        .step { margin-bottom: 20px; }
        .error { color: red; }
      </style>
    </head>
    <body>
      <h1>Error Report</h1>
      <div class="steps">
  `;

  errorSteps.forEach((step) => {
    html += `<div class="step">
      <div><strong>Status:</strong> ${step.status}</div>
      <div><strong>Keyword:</strong> ${step.keyword}</div>
      <div><strong>Description:</strong> ${step.description}</div>
      <div><strong>Duration:</strong> ${step.duration}</div>
      <div class="error"><strong>Error:</strong> ${step.error}</div>
    </div>`;
  });

  html += `
      </div>
    </body>
    </html>`;

  return html;
};

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
