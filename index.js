const fs = require('fs');
const path = require('path');

const core = require('@actions/core');

const { WebClient } = require('@slack/web-api');

try {

  const web = new WebClient(core.getInput('SLACK_BOT_TOKEN'));
  let messagePath = core.getInput('message');
  let messageJSON;
  if (fs.existsSync(messagePath)){
    messageJSON = fs.readFileSync(messagePath, 'utf-8');
  } else {
    messageJSON = messagePath;
  }
  let envregx = /\${{\s?([A-Z_]*)\s?}}/gm;

  messageJSON = messageJSON.replace(envregx, (_, env) => process.env[env]);

  let message = JSON.parse(messageJSON);

  (async () => {

    try {
      await web.chat.postMessage(message);
    } catch (error) {
      core.setFailed(error.message);
    }
  })();

} catch (error) {
  core.setFailed(error.message);
}
