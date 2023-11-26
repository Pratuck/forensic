import { defineConfig, devices,PlaywrightTestConfig} from 'playwright/test';

const config: PlaywrightTestConfig={
  testMatch:["scrapes/auth.setup.ts"],
  use:{
    headless: false,
    screenshot:"off",
    video:"off"
  },
  reporter:[["dot"],["json",{
    outputFile: "jsonReports/jsonReport.json"
  }],["html",{
    open:"never"
  }]]
};

export default config; 