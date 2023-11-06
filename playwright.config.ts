import { defineConfig, devices,PlaywrightTestConfig} from 'playwright/test';

const config: PlaywrightTestConfig={
  testMatch:["scrapes/post2.test.ts"],
  use:{
    headless: false,
    screenshot:"on",
    video:"on"
  },
  reporter:[["dot"],["json",{
    outputFile: "jsonReports/jsonReport.json"
  }],["html",{
    open:"never"
  }]]
};

export default config; 