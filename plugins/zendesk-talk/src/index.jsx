import 'idempotent-babel-polyfill';
import * as React from 'react';
import axios from 'axios';

const button = theme => ({
    backgroundColor: theme.greyColor,
    color: theme.greyContrastColor,
    cursor: "pointer",
    border: "none",
    height: '40px',
    padding: `${theme.unitSize}px ${theme.unitSize * 2}px`,
    borderRadius: theme.unitSize * 2,
});

const primaryButton = theme => ({
    ...button(theme),
    background: theme.primaryGradient,
    color: theme.primaryContrastColor
})

const padding = theme => ({
    paddingTop: theme.unitSize,
    paddingBottom: theme.unitSize,
    paddingLeft: theme.unitSize * 2,
    paddingRight: theme.unitSize * 2
})

const ZendeskTalk = props => {

    const {
        isFullscreen,
        onSetFullscreen,
        theme,
        message,
        onDismissFullscreen,
    } = props;

    const {
        text,
        headerTitle,
        submitButtonTitle,
        cancelButtonTitle,
        inputField,
        zendesk
    } = message.data._plugin;

    const {
        placeholder,
    } = inputField

    const {
        auth,
        phoneNumerId
    } = zendesk;

    const {
        subdomain,
        username,
        password
    } = auth;

    const [requesterPhoneNumber, setRequesterPhoneNumber] = React.useState('');
    const [displaySuccessMessage, setDisplaySuccessMessage] = React.useState(false);

    const handleOnClickRequestCallbackButton = async () => {
        const response = await axios({
            method: 'post',
            url: `https://${subdomain}.zendesk.com/api/v2/channels/voice/callback_requests`,
            headers: {
                'Content-Type': 'application/json'
            },
            auth: {
                username,
                password
            },
            data: {
                callback_request: {
                    phone_number_id: phoneNumerId,
                    requester_phone_number: requesterPhoneNumber
                }

            }
        });

        console.log(response)

        // Check if the status code is 201 Created
        if (response.status === 201) {
            setDisplaySuccessMessage(true);
        }
    }

    React.useEffect(() => {
        if (!isFullscreen) {
            onSetFullscreen();
        }
    });

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                height: '100%'
            }}
        >
            <header
                style={{
                    ...padding(theme),
                    display: 'flex',
                    alignItems: 'center',
                    minHeight: theme.blockSize,
                    boxSizing: 'border-box',
                    background: theme.primaryGradient,
                    color: theme.primaryContrastColor,
                    fontWeight: 'bolder',
                    boxShadow: theme.shadow,
                    zIndex: 2
                }}
            >{headerTitle || 'Request a Callback'}
            </header>
            <main
                style={{
                    ...padding(theme),
                    flexGrow: 1,
                    flexDirection: 'column',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <p
                    style={{
                        textAlign: 'justify',
                    }}
                >
                    {text}
                </p>
                <br />
                <input
                    type='tel'
                    id='phone'
                    placeholder={placeholder || '+123456789'}
                    value={requesterPhoneNumber}
                    onChange={(event) => setRequesterPhoneNumber(event.target.value)}
                    style={{
                        backgroundColor: 'white',
                        color: 'black',
                        cursor: "pointer",
                        border: `1px solid ${theme.primaryColor}`,
                        boxShadow: theme.shadow,
                        height: '40px',
                        padding: `${theme.unitSize}px ${theme.unitSize * 2}px`,
                        borderRadius: theme.unitSize * 2
                    }}
                />
                <br />
                <button
                    type='button'
                    onClick={handleOnClickRequestCallbackButton}
                    disabled={requesterPhoneNumber.length === 0}
                    style={{
                        ...primaryButton(theme)
                    }}
                >
                    {submitButtonTitle || 'Request Callback'}
                </button>
                <br />
                {
                    displaySuccessMessage
                        ?
                        <p
                            style={{
                                fontWeight: 'bolder',
                                color: 'darkgreen'
                            }}
                        >
                            Thank you! I successfully requested the callback for you.
                        </p>
                        :
                        null
                }
            </main>
            <footer
                style={{
                    ...padding(theme),
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    boxShadow: theme.shadow,
                }}
            >
                <button
                    type='button'
                    onClick={onDismissFullscreen}
                    style={{
                        ...button(theme),
                        flexGrow: 1
                    }}
                >
                    {cancelButtonTitle || 'cancel'}
                </button>
            </footer>
        </div>
    );
};

const zendeskTalkPlugin = {
    match: 'zendesk-talk',
    component: ZendeskTalk
};

if (!window.cognigyWebchatMessagePlugins) {
    window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(zendeskTalkPlugin);