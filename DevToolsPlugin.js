export class RecorderPlugin {
    async stringify(recording) {
      const startString = 
      `describe("ui5 query filter", () => {
        it("filter from url query hash", async () => {`
      const endString = `});});`
      let stringArray = []
      stringArray.push(startString)
      let constCount = 1;
      console.log(recording);
      for (let i = 0; i < recording.steps.length; i++) {
        const step = recording.steps[i]
        if(step.type === "navigate"){
          stringArray.push(`await browser.goTo({ sHash: "${step.url}" });`)
        }
        if(step.type === "click"){
          // filter out in the array everything that starts with aria 
          const selectors = step.selectors.filter(element => !element[0].startsWith('aria/'))
          if(selectors.length > 0){
            for (let j = 0; j < selectors.length; j++) {
              const selector = selectors[j]
              stringArray.push(`const element${constCount} = await $("${selector}");`)
              stringArray.push(`element${constCount}.press()`)
              constCount++;
            }
          }
        }

      }
      stringArray.push(endString)
      return stringArray.join('\n')
      // return JSON.stringify(recording, null, 2);
    }
    // async stringifyStep(step) {
    //   console.log(step);
    //   return JSON.stringify(step, null, 2);
    // }
  }
  
  /* eslint-disable no-undef */
  chrome.devtools.recorder.registerRecorderExtensionPlugin(
    new RecorderPlugin(),
    /* name=*/ 'wdio script',
    /* mediaType=*/ 'text/javascript'
  );