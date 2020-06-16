import * as React from 'react';
import licencePlateTemplate from '../assets/licence-plate-template.png';
import { getStyles } from '../../file-upload/src/styles';

const LicencePlate = (props) => {

    // get plugin configuration from Cognigy
    const { message, onSendMessage, theme } = props;
    const { data } = message;
    const { _plugin } = data;
    const { countryCode, label, buttonText } = _plugin;

    // state for licence plate values
    const [first, setFirst] = React.useState("");
    const [second, setSecond] = React.useState("");
    const [third, setThird] = React.useState("");

    const button = theme => ({
        color: theme.primaryContrastColor,
        background: theme.primaryGradient,
        cursor: "pointer",
        border: "none",
        height: 40,
        width: "50%",
        padding: `${theme.unitSize}px ${theme.unitSize * 2}px`,
        borderRadius: theme.unitSize * 2,
    })

    const sendButton = theme => ({
        ...button(theme),
        flexGrow: 1,
        marginBottom: "2%"
    })

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                background: "white"
            }}
        >
            <span
                style={{
                    marginBottom: "2%",
                    marginLeft: "2%",
                    fontSize: "20",
                    fontFamily: "Helvetica",
                    fontWeight: "bold",
                    paddingTop: "2%"
                }}
            >
                {label}
            </span>
            <div
                style={{
                    backgroundImage: `url(${licencePlateTemplate})`,
                    backgroundSize: 'contain',
                    height: '100px',
                    backgroundRepeat: 'no-repeat',
                    display: "flex",
                    flexDirection: "row",
                    width: "100%"
                }}
            >
                <span
                    style={{
                        color: "white",
                        fontWeight: "bold",
                        marginLeft: "5%",
                        marginTop: "14%"
                    }}
                >
                    {countryCode}
                </span>
                <input
                    type="text"
                    id="first"
                    name="first"
                    maxLength={2}
                    style={{
                        width: "70px",
                        marginLeft: "5%",
                        height: "60px",
                        marginTop: "2.5%",
                        border: "none",
                        fontWeight: "bold",
                        fontFamily: "Helvetica",
                        fontSize: 60,
                        textTransform: "uppercase"
                    }}
                    onChange={e => setFirst(e.target.value)}
                ></input>
                <input
                    type="text"
                    id="second"
                    name="second"
                    maxLength={2}
                    style={{
                        width: "70px",
                        marginLeft: "7%",
                        height: "60px",
                        marginTop: "2.5%",
                        border: "none",
                        fontWeight: "bold",
                        fontFamily: "Helvetica",
                        fontSize: 60,
                        textTransform: "uppercase"
                    }}
                    onChange={e => setSecond(e.target.value)}
                ></input>
                <input
                    type="text"
                    id="third"
                    name="third"
                    maxLength={2}
                    style={{
                        width: "90px",
                        marginLeft: "6%",
                        height: "60px",
                        marginTop: "2.5%",
                        border: "none",
                        fontWeight: "bold",
                        fontFamily: "Helvetica",
                        fontSize: 60,
                        textTransform: "uppercase"
                    }}
                    onChange={e => setThird(e.target.value)}
                ></input>
            </div>
            <div
                style={{
                    textAlign: "center"
                }}
            >
                <button
                    onClick={() => onSendMessage("",
                        {
                            "licencePlate": `${first}-${second}-${third}`,
                            "countryCode": countryCode
                        })}
                    style={sendButton(theme)}
                >{buttonText}</button>
            </div>

        </div>

    );
}

const licencePlatePlugin = {
    match: 'licence-plate',
    component: LicencePlate,
    options: {
        fullwidth: true
    }
}

if (!window.cognigyWebchatMessagePlugins) {
    window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(licencePlatePlugin);