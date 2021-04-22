const fs = require('fs');
const path = require('path');
const core = require('@actions/core');
// const github = require('@actions/github');
//
const { WebClient } = require('@slack/web-api');

try {
  const web = new WebClient(core.getInput('SLACK_BOT_TOKEN'));
  let channel = core.getInput('channel')
  let messageJSON = fs.readFileSync(path.join('.github', 'workflows', core.getInput('message')), 'utf-8');
  let ghregx = /\${{\s?GITHUB_([A-Z_]*)\s?}}/gm

  messageJSON = messageJSON.replace(ghregx, (_, env) => process.env[`GITHUB_${env}`]);

  let message = JSON.parse(messageJSON);
  (async () => {

    try {
      // Use the `chat.postMessage` method to send a message from this app
      await web.chat.postMessage(message);
    } catch (error) {
      console.log(error);
    }

    console.log('Message posted!');
  })();

} catch (error) {
  core.setFailed(error.message);
}
