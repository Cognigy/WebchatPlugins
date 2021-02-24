# Get User Location

Get the user geolocation and send it to Cognigy.AI in order to use it for further steps. For example, one could use the [Google Maps Webchat Plugin](../google-maps/) Webchat Plugin and display the user location in the webchat.

For some use-cases it could be helpful to have access to the user's geolocation, such as `longitude` and `latitude`. In order to use this information, two steps are required:

1. Ask the user for permission
2. Send the location information to Cognigy.AI

Therefore, the first step is to display the **Location Persmission Pop-Up Window** in the web browser. This window is displayed by using the [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API):

<img src="./docs/askForPermissionUserLocation.png"></img>


## How to use the plugin

In a Cognigy.AI Flow, create a SAY Node and insert the following JSON data into the **Data** field:

```json
{
  "_plugin": {
    "type": "location"
  }
}
```

After the above SAY node was executed by Cognigy.AI, it should send the folloing DATA_ONLY message:

- `{{input.data.location}}`

```json
{
  "location": {
    "longitude": "...",
    "latitude": "..."
  }
}
```

that could be displayed in the chat such as:

<img src="./docs/successUserBrowserLocation.png"></img>