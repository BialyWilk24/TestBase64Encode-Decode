const { defineConfig } = require("cypress");
module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "https://www.base64-image.de/",
    testIsolation: true
  },
});