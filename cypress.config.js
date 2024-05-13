const { defineConfig } = require("cypress");

module.exports = defineConfig({
  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
  },

  e2e: {
    baseUrl: "https://mediflow-lnmh.onrender.com",  // Frontend base URL
    env: {
      backendUrl: "https://mediflow-cse416.onrender.com"  // Backend base URL
    },
  },
});
