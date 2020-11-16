import React from 'react';
import GoogleMapReact from 'google-map-react';
import { style } from './style.js';

const Marker = ({ text }) => <div style={style}>{text}</div>;

const GoogleMapsMessage = (props) => {

    const { message } = props;
    const { data, text } = message;
    const { _plugin } = data;
    const { center, zoom, apikey } = _plugin;
    const { lat, lng } = center;

    return (

        <div style={{ height: '200px', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: apikey }}
                defaultCenter={center}
                defaultZoom={zoom}
            >
                <Marker
                    lat={lat}
                    lng={lng}
                    text={text}
                />
            </GoogleMapReact>
        </div>

    )
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