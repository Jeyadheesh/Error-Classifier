[
  {
    feature:
      "As a user I should get notification when I'm mentioned in post reply",
    scenarios: [
      {
        name: "Scenario: User is mentioned in a post reply",
        tags: ["tag1", "tag2"],
        lists: [
          {
            status: "Failed",
            keyword: "Given",
            description: "someone mentions user in reply of a post",
            duration: "30s 2ms",
            error:
              "<pre class='info show-modal'>locator.click: Timeout 30000ms exceeded...</pre>",
          },
          {
            status: "Skipped",
            keyword: "When",
            description: "user clicks In-app notification",
            duration: "< 1ms",
            error: null,
          },
          // Other steps...
        ],
      },
      // Other scenarios...
    ],
  },
  {
    feature: "As a user I should get notification when I'm celebrated",
    scenarios: [
      {
        name: "Scenario: User is celebrated",
        tags: ["tag3"],
        lists: [
          {
            status: "Failed",
            keyword: "Given",
            description: "someone mentions user in Description",
            duration: "30s 2ms",
            error:
              "<pre class='info show-modal'>locator.click: Timeout 30000ms exceeded...</pre>",
          },
          {
            status: "Skipped",
            keyword: "Then",
            description: "user must be notified via In-app notification",
            duration: "< 1ms",
            error: null,
          },
          // Other steps...
        ],
      },
      // Other scenarios...
    ],
  },
];

// Template

[
  {
    feature: "Feature Name1",
    scenarios: [
      {
        name: "Scenario: Scenario Name1",
        tags: ["tag1", "tag2"], // tags for the Scenario Name 1
        steps: [
          {
            status: "Failed",
            keyword: "Given",
            description: "Given description",
            duration: "30s 2ms",
            error:
              "<pre class='info show-modal'>locator.click: Timeout 30000ms exceeded...</pre>",
          },
          {
            status: "Skipped",
            keyword: "When",
            description: "When description",
            duration: "< 1ms",
            error: null,
          },
          // Other steps for Scenario Name1
        ],
      },
      // Other scenarios for Feature Name1
    ],
  },
  // Other features
];
