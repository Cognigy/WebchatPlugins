import React from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { googleBtn, googleIcon, googleIconWrapper, btnText, root } from './style';

const GoogleFirebaseAuthenticationMessage = (props) => {

    const { message, onSendMessage } = props;
    const { data } = message;
    const { _plugin } = data;
    const { firebase } = _plugin;
    const { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId } = firebase;

    // Initialize Firebase
    const app = initializeApp({
        apiKey,
        authDomain,
        projectId,
        storageBucket,
        messagingSenderId,
        appId
    });
    // Initialize Firebase Authentication and get a reference to the service
    const auth = getAuth(app);

    const provider = new GoogleAuthProvider();


    return (
        <div style={root}>
            <div style={googleBtn} onClick={() => {
                signInWithPopup(auth, provider)
                    .then((result) => {
                        // This gives you a Google Access Token. You can use it to access the Google API.
                        const credential = GoogleAuthProvider.credentialFromResult(result);
                        const token = credential.accessToken;
                        const user = result.user;

                        onSendMessage("", {
                            token,
                            user
                        });
                    }).catch((error) => {
                        onSendMessage("", {
                            error: error.message,
                            errorCode: error.code,
                            email: error.customData.email
                        });
                    });
            }}>
                <div style={googleIconWrapper}>
                    <img style={googleIcon} src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" />
                </div>
                <p style={btnText}><b>Sign in with Google</b></p>
            </div>
        </div>

    )
}


const googleFirebaseAuthenticationMessagePlugin = {
    match: 'google-firebase-authentication',
    component: GoogleFirebaseAuthenticationMessage,
    options: {
        fullwidth: true
    }
}

if (!window.cognigyWebchatMessagePlugins)
    window.cognigyWebchatMessagePlugins = [];

window.cognigyWebchatMessagePlugins.push(googleFirebaseAuthenticationMessagePlugin);