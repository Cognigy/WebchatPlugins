# Microsoft Teams Webchat Plugin

Invite a user to a Microsoft Teams meeting in your webchat conversation.

## How to use this plugin:

1. You need to copy the plugin's code and run the following commands:
    - `npm i`
    - `npm run build`
2. Now, you should find a folder called `dist` which contains a `microsoft-teams.webchat-plugin.js` file. This file whether needs to be included into your `index.html` file which opens the webchat or uploaded to a cloud storage to add it to the Cognigy Webchat Configuration in the Webchat Endpoint.
3. In your Cognigy.AI agent, you need to define a Flow that starts the webchat plugin. Therefore, use the following JSON data as Data informatoin in the SAY Node:

**Configuration:**

- `meetingLink`
  - The personal meeting link
- `title`
  - The title of the plugin message that is diplayed in the webchat
- `subtitle`
  - The subtitle of the plugin message
- `joinButtonText`
  - The text of the button that needs to be clicked in order to join the meeting

```json
{
    "_plugin": {
        "type": "microsoft-teams",
        "title": "Microsoft Teams meeting",
        "subtitle": "Join on your computer or mobile app",
        "meetingLink": "https://teams.microsoft.com/l/meetup-join/..."
    }
}
```

After the above SAY node was executed by Cognigy.AI, it should show one of the following contents in your webchat:

<img src="./docs/joinTeamsMeeting.png">