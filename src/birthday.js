const util = require('util');
const { WebClient } = require('@slack/client');

const token = process.env.SLACK_OAUTH_TOKEN;

const client = new WebClient(token);

// Initialize using signing secret from environment variables
const { createEventAdapter } = require('@slack/events-api');
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);
const port = process.env.PORT || 3000;

// Attach listeners to events by Slack Event "type". See: https://api.slack.com/events/message.im
slackEvents.on('team_join', (event) => {
  console.log(util.inspect({ event }, { colors: true, depth: null }));
  // console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
  client.chat.postMessage({ channel: event.user.id, text: `Welcome to the Team, ${event.user.real_name}!` })
  .then(res => {
    console.log('post response:', util.inspect(res, { colors: true, depth: null }));
  })
  .catch(err => {
    console.error('posting error:', err);
  });
});

// Handle errors (see `errorCodes` export)
slackEvents.on('error', console.error);

// Start a basic HTTP server
slackEvents.start(port).then(() => {
  console.log(`server listening on port ${port}`);
});
