// Example 1: sets up service wrapper, sends initial message, and 
// receives response.

var AssistantV1 = require('watson-developer-cloud/assistant/v1');
var prompt = require('prompt-sync')();

// Set up Assistant service wrapper.
var service = new AssistantV1({
    url:'https://gateway-wdc.watsonplatform.net/assistant/api',
    username: 'brijeshsrivastava21@gmail.com',
    password:'Security@12',
  iam_apikey: '8QlGhSSjUGUk5GDn6-S8R5-mxsC0cTvTp1rR6jNjQLu1', // replace with API key
  version: '2018-11-07'
});

var workspace_id = 'fbfb08f0-00e9-49ef-b9cb-65c620bdc617'; // replace with workspace ID

// Start conversation with empty message.
service.message({
  workspace_id: workspace_id
  }, processResponse);

// Process the service response.
function processResponse(err, response) {
    if (err) {
      console.error(err); // something went wrong
      return;
    }
  
    var endConversation = false;

  // Check for client actions requested by the dialog. Assumes at most a single
  // action.
  if (response.actions) {
    if (response.actions[0].type === 'client') {
      if (response.actions[0].name === 'display_time') {
        // User asked what time it is, so we output the local system time.
        console.log('The current time is ' + new Date().toLocaleTimeString() + '.');
      } else if (response.actions[0].name === 'end_conversation') {
        // User said goodbye, so we're done.
        console.log(response.output.generic[0].text);
        endConversation = true;
      }
    }
  } else {
    // Display the output from dialog, if any. Assumes a single text response.
    if (response.output.generic.length != 0) {
        console.log(response.output.generic[0].text);
    }
  }

  // If we're not done, prompt for the next round of input.
  if (!endConversation) {
    var newMessageFromUser = prompt('>> ');
    service.message({
      workspace_id: workspace_id,
      input: { text: newMessageFromUser },
      // Send back the context to maintain state.
      context : response.context,
    }, processResponse)
  }
}