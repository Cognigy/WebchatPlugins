import React from 'react';
import GoogleMapReact from 'google-map-react';

class GoogleMapsMessage extends React.Component {
    render() {
        const message = this.props.message;
        const mapsData = message.data._plugin;
        const apikey = mapsData.bootstrapURLKeys;
        
        return (
            
            <div style={{ height: '200px', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: apikey }}
                    defaultCenter={mapsData.center}
                    defaultZoom={mapsData.zoom}
                >
                
                </GoogleMapReact>
            </div>       
        )
    }
}

const googleMapsMessagePlugin = {
    match: 'google-maps',
    component: GoogleMapsMessage,
    options: {
        fullwidth: true
    }
}

if (!window.cognigyWebchatMessagePlugins)
    window.cognigyWebchatMessagePlugins = [];

window.cognigyWebchatMessagePlugins.push(googleMapsMessagePlugin);