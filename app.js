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

      // Initialize an array to hold the features
      let features = [];

      // Iterate over each panel to find scenarios
      $(".panel.panel-default").each((index, panel) => {
        // Extract feature name from <b>Feature:</b>
        const featureTitle = $(panel)
          .find(".panel-heading .panel-title")
          .find('b:contains("Feature:")')
          .parent()
          .text()
          .replace("Feature:", "")
          .trim();

        if (!featureTitle) return;

        // Initialize feature if not present in the array
        if (!features.find((f) => f.feature === featureTitle)) {
          features.push({ feature: featureTitle, scenarios: [] });
        }

        // Iterate over scenarios within the current panel
        $(panel)
          .find(".panel-collapse.collapse .panel.panel-default")
          .each((collapseIndex, collapse) => {
            // Extract scenario name
            const scenarioTitle = $(collapse)
              .find(".ellipsis")
              .first()
              .text()
              .trim();

            // Find scenario tags
            let tags = [];
            $(collapse)
              .find(".tags .tag")
              .each((i, tag) => {
                tags.push($(tag).text().trim());
              });

            // Find all steps in the scenario
            const steps = $(collapse).find(".row.steps");
            let stepDetails = [];

            steps.each((stepIndex, step) => {
              const status = $(step).find(".label").attr("title");
              const keyword = $(step).find(".keyword.highlight").text().trim();
              const description = $(step).find(".text").text().trim();
              const duration = $(step).find(".step-duration").text().trim();

              // Check if the step has an error
              const errorElement = $(step)
                .find('a[data-toggle="collapse"]')
                .filter((i, el) => $(el).text().includes("Show Error"));
              const errorContent = errorElement.next(".collapse").html();

              const infoElement = $(step)
                .find('a[data-toggle="collapse"]')
                .filter((i, el) => $(el).text().includes("Show Info"));
              const infoContent = infoElement.next(".collapse").html();

              // Add step details to the list
              stepDetails.push({
                status,
                keyword,
                description,
                duration,
                error: errorContent ? errorContent : null,
                info: infoContent ? infoContent : null,
              });
            });

            // Add the scenario details to the corresponding feature
            const feature = features.find((f) => f.feature === featureTitle);
            feature.scenarios.push({
              name: scenarioTitle,
              tags,
              steps: stepDetails,
            });
          });
      });

      // Send the grouped errors as JSON response
      res.json(features);
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
