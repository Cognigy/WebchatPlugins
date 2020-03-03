import React from 'react';

const Capture = (props) => {

    const {
        styles,
        rttiUrl,
        scannedText,
        captureButtonText
    } = props;









    return (
        <div style={styles}>
            <div id="text-message" style={{
                textAlign: 'center'
            }}>
                <h1></h1>
            </div>
            {/* The Capture Button */}
            <div 
                style={{
                    textAlign: 'center',
                    paddingTop: '10px',
                    paddingBottom: '10px'
                }}
            >
                <button 
                    id="capture-button" 
                    className="capture-button" 
                    //onClick={captureDocument}
                >
                    {captureButtonText || "Capture"}
                </button>
            </div>
            {/* Info text */}
            <div 
                id="info-message" 
                style={{
                    textAlign: 'center'
                }}
            >
                {scannedText || "Scanned Sited: "}
                <strong>0</strong>
            </div>
            
            {/* The advanced Capture Container */}
            <div id="image-capture"></div>
            {/* The Review Container */}
            <div id="image-review"></div>

            <div id="loader"></div>
        </div>
    );

}

export default Capture;