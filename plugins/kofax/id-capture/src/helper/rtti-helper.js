// The RTTI Extraction URL
var rttiURL = "https://mobiledemoemea2.kofax.com/RTTI/api/MobileIDCapture";

// Region for ID (possible values: Africa, Asia, Australia, Canada, Europe, Latin AMerica, United States)
var idRegion = "United States";

// Document Type (possible values: ID, Passport)
var idType = "ID";

// ID Verification
var doIdVerification = false;

// FaceRecognition (only if ID Verification is done)
var doFaceRecognition = false;

// Enable Clarity Engine
var enableClarityEngine = false;

// Should the Image Review also be shown for pictures captured with Standard Camera?
var showReviewAlsoForStandardCamera = false;

// Release Camera immediately after captured image has been accepted?
var releaseCameraImmediately = false;

// The array holding the captured images
var imagesArray = [];

// The Ids of the containers
var advancedImageCaptureId = "image-capture";
var imageReviewId = "image-review";
var captureButtonId = "capture-button";
var extractButtonId = "extract-button";
var infoMessageId = "info-message";
var textMessageId = "text-message";
var extractionResultsId = "extractionResult";
var extractedDataId = "extractedData";

var verificationStatusOk = false;
var transactionID = "";

// The Image Review Control
var reviewCtrl = new KfxWebSDK.ReviewControl(imageReviewId);

// The extracted fields which should not be shown
var ignoredFieldsArr = ["ProductVersion", "IsBarcodeRead", "IsOcrRead", "IsIDVerified", "DocumentVerificationConfidenceRating", "VerificationTransactionID", "VerificationResult"];
// The extracted fields which shouöd be shown
var showFieldsArr = [];

// List of fields that must not be empty
var mustNotbeEmptyFieldsForIDsArr = ["LastName", "FirstName", "IDNumber"];
var mustNotbeEmptyFieldsForPassportsArr = ["LastName", "FirstName", "PassportNumber", "ExpirationDate", "MRZ1", "MRZ2"];

// Check if Document has expired
var doExpirationCheck = true;


// If set to true, only a summary of the extracted fields is shown
var showSummaryOnly = false;

// Sides to capture (0 ... select, 1 ... front side only, 2 ... front side and abck side)
var sidesToCapture = 0;

var isCameraCreated = false;
var isAutoCaptureSupported = false;

// Hide Loader
hideLoader();

// Initially hide some containers
document.getElementById(advancedImageCaptureId).style.visibility = 'hidden';
document.getElementById(imageReviewId).style.visibility = 'hidden';
document.getElementById(extractButtonId).style.visibility = 'hidden';
document.getElementById(captureButtonId).style.visibility = 'visible';
document.getElementById(infoMessageId).style.visibility = 'hidden';
document.getElementById(extractionResultsId).style.visibility = 'hidden';

// Set idRegion, idType and verification if passed as URl Query parameter
var tmpIdRegion = getUrlParameter('idRegion');
if (tmpIdRegion) {
    if (tmpIdRegion.toUpperCase() == "AFRICA") {
        idRegion = "Africa";
    }
    if (tmpIdRegion.toUpperCase() == "ASIA") {
        idRegion = "Asia";
    }
    if (tmpIdRegion.toUpperCase() == "AUSTRALIA") {
        idRegion = "Australia";
    }
    if (tmpIdRegion.toUpperCase() == "CANADA") {
        idRegion = "Canada";
    }
    if (tmpIdRegion.toUpperCase() == "EUROPE") {
        idRegion = "Europe";
    }
    if (tmpIdRegion.toUpperCase() == "LATIN AMERICA") {
        idRegion = "Latin America";
    }
    if ((tmpIdRegion.toUpperCase() == "UNITED STATES") || (tmpIdRegion.toUpperCase() == "US")) {
        idRegion = "United States";
    }
}

var tmpIdType = getUrlParameter('idType');
if (tmpIdType) {
    if (tmpIdType.toUpperCase() == "PASSPORT") {
        idType = "Passport";
    } else {
        idType = "ID";
    }
}

showCaptureTexts();

var tmpIdVerification = getUrlParameter('verification');
if (tmpIdVerification) {
    if (tmpIdVerification.toUpperCase() == "TRUE") {
        doIdVerification = true;
    } else {
        doIdVerification = false;
    }
}

var tmpFaceRecognition = getUrlParameter('faceRecognition');
if (tmpFaceRecognition) {
    if (tmpFaceRecognition.toUpperCase() == "TRUE") {
        doFaceRecognition = true;
    } else {
        doFaceRecognition = false;
    }
}

var tmpEnableClarityEngine = getUrlParameter('enableClarityEngine');
if (tmpEnableClarityEngine) {
    if (tmpEnableClarityEngine.toUpperCase() == "TRUE") {
        enableClarityEngine = true;
    } else {
        enableClarityEngine = false;
    }
}

var tmpSidesToCapture = getUrlParameter('sides');
if (tmpSidesToCapture) {
    if (tmpSidesToCapture == "1") {
        sidesToCapture = 1;
    }
    if (tmpSidesToCapture == "2") {
        sidesToCapture = 2;
    }
}

var tmpShowSummaryOnly = getUrlParameter('summaryOnly');
if (tmpShowSummaryOnly) {
    if (tmpShowSummaryOnly.toUpperCase() == "TRUE") {
        showSummaryOnly = true;
    } else {
        showSummaryOnly = false;
    }
}
if (showSummaryOnly == true) {
    showFieldsArr = ["DocumentType", "VerificationResult", "LastName", "FirstName", "IDNumber", "PassportNumber", "ExpirationDate", "MRZ1", "MRZ2", "MRZ3"];
}


document.title = idType + " - " + idRegion;


function prepareCamera() {
    // Check if Browser/Device supports Auto Capture (using WebRTC)
    KfxWebSDK.Utilities.supportsAutoCapture(function () {
        // Auto Capture is supported
        isAutoCaptureSupported = true;
        createCamera();
    }, function () {
        // Auto Capture is not supported
        isAutoCaptureSupported = false;
        createCamera();
    });
}

// Create Camera object
function createCamera() {
    var showForceCaptureButton = 5;
    if (idType == "Passport") {
        showForceCaptureButton = 0;
    }

    var frameRatio = 1.590;
    if (idType == "Passport") {
        frameRatio = 0.703;
    }
    // The Advanced Camera options (see API reference)
    var cameraOptions = {
        containerId: advancedImageCaptureId,
        preference: 'camera',
        useVideoStream: isAutoCaptureSupported,
        preview: false,
        frameAspectRatio: frameRatio,
        framePadding: 5,
        frameCornerHeight: 10,
        frameCornerWidth: 60,
        frameCornerColor: '#00FF00',
        outOfFrameTransparency: 0.5,
        showEdges: false,
        edgesColor: '#FFFF00',
        edgesWidth: 4,
        guidanceSize: 150,
        useTargetFrameCrop: false,
        criteria: {
            minFillFraction: 0.65,
            maxFillFraction: 1.8,
            longAxisThreshold: 85,
            shortAxisThreshold: 60,
            centerToleranceFraction: 0.19,
            captureTimeout: 1000, // 1000
            turnSkewAngleTolerance: 10,
            pitchThreshold: 15,
            rollThreshold: 15
        },
        lookAndFeel: {
            documentSample: '',
            forceCapture: showForceCaptureButton,
            gallery: false
        }
    };

    KfxWebSDK.Capture.create(cameraOptions,
        function (createSuccess) {
            isCameraCreated = true;
            takePicture();
        },
        function (error) {
            // Error creating the capture control
            alert("Error creating Camera Object!\nError " + error);
            isCameraCreated = false;
        }
    );
};

// Get URl Query parameter
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)', 'i');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

// Take Picture
function takePicture() {
    if (isAutoCaptureSupported) {
        // Show Advanced Camera Container (full screen)
        document.getElementById(advancedImageCaptureId).style.visibility = 'visible';
    }
    KfxWebSDK.Capture.takePicture(
        function (imageData) {

            // Hide Advanced Camera Container
            document.getElementById(advancedImageCaptureId).style.visibility = 'hidden';

            // Stop image capture
            KfxWebSDK.Capture.stopCapture(
                function () {
                }, function (error) {
                    alert("Camera could not be stopped! Error: " + error)
                }
            );

            // The captured image
            var img = imageData;


            try {

                if ((isAutoCaptureSupported) || (showReviewAlsoForStandardCamera)) {
                    // Shoe Image Review
                    reviewDocument(img);
                } else {
                    // Standard Capture used and Review should not be shown
                    addImageToImageArray(img);
                }

            } catch (error) {
                // If image processing exception occurred, re-capture image
                alert("Error occurred!\n" + error);
                captureDocument();
            };

        },
        function (error) {
            // Error while taking the picture occurred

            // Stop image capture
            KfxWebSDK.Capture.stopCapture(
                function () { },
                function (error) { }
            );

            alert("Image could not be captured!\nError " + error);

            // Hide Advanced Camera Container and capture image again
            document.getElementById(advancedImageCaptureId).style.visibility = 'hidden';
            captureDocument();
        }
    );
}

// Capture Document - launched by the Capture button
export function captureDocument() {
    // if iPhone or iPad ... no WebRTC / Auto Capture
    //var userAgent = window.navigator.userAgent;
    //if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
    //	isAutoCaptureSupported = false;
    //}

    if (isCameraCreated == false) {
        // Create Camera Object and take picture 
        prepareCamera();
    } else {
        // Camera object is already created, just take picture
        takePicture();
    }

};

// Destroy Advanced Camera
function destroyCamera() {
    isCameraCreated = false;

    KfxWebSDK.Capture.destroy(
        function () {
        },
        function (error) {
        }
    );
}

// Show Image Review
function reviewDocument(imageData) {
    document.getElementById(imageReviewId).style.visibility = 'visible';
    reviewCtrl.review(imageData,
        function () { // Image Accepted
            document.getElementById(imageReviewId).style.visibility = 'hidden';
            addImageToImageArray(imageData);

            // Destroy Camera after image has been accept?
            if (releaseCameraImmediately == true) {
                destroyCamera();
            }
        },
        function () { // "Retake image"
            document.getElementById(imageReviewId).style.visibility = 'hidden';
            captureDocument();
        }
    );
};

// scale captured image and return a base64 encoded jpeg
function addImageToImageArray(imageData) {
    // Set dpi and add resulting JPEG image to images array							
    KfxWebSDK.ImageProcessor.setDPI(imageData, { dpi: 96 },
        function (img) {
            // Add image to array
            addImageToArray(img);
        },
        function (error) {
            // Error occurred
            alert("dpi of Image could not be set! Capture page again.\nError: " + error);
        });
};

export function doExtraction() {

    document.getElementById(captureButtonId).style.visibility = 'hidden';
    document.getElementById(extractButtonId).style.visibility = 'hidden';
    document.getElementById(infoMessageId).style.visibility = 'hidden';
    document.getElementById(textMessageId).innerHTML = '';

    // Destroy Camera
    destroyCamera();

    showLoader();

    // RTTI Extraction Parameters
    var rttiOptions = {
        url: rttiURL,
        images: imagesArray,
        serverParameters: {
            xApplication: "SimpleDemoID - HTML5 Capture",
            xRegion: idRegion,
            xIdType: idType,
            xVerification: doIdVerification,
            xEnableClarityEngine: enableClarityEngine,
            processImage: true,
            imageResult: true,
            xExtractSignatureImage: true,
            xExtractFaceImage: true
        },
        timingInfo: true
    };

    // Call server-side data extraction
    KfxWebSDK.DocumentExtractor.extractionWithRttiServer(rttiOptions,
        function (result, timingInfoValues) {


            // Extraction call was successful
            let errorCode = result[0].errorCode;

            if (window.parent) {
                if (errorCode == 0) {
                    window.parent.handlePersonalData(result);
                }
            }

            if (errorCode == 0) {
                // RTTI returned errorCode = 0 -> Success							

                var extractedDataHTMLList = "";

                verificationStatusOk = false;

                document.getElementById(extractedDataId).innerHTML = "";

                var emptyFieldFoundWhichMustNotBeEmpty = false;

                var documentHasExpired = false;


                // Get extracted fields
                for (var i = 0; i < result.length; i++) { // Loop through extracted Classes (normally only one)

                    var extractedResults = result[i].fields; // the extracted fields as array
                    // Loop through the extracted fields array
                    for (var o = 0; o < extractedResults.length; o++) {

                        var fieldName = extractedResults[o].name; // get field name
                        var fieldValue = extractedResults[o].text; // get field value

                        fieldName = htmlEntities(fieldName);
                        fieldValue = htmlEntities(fieldValue);

                        // Check if a field which must not be empty is empty
                        var mustNotBeEmptyField;
                        if (idType == "ID") {
                            mustNotBeEmptyField = (mustNotbeEmptyFieldsForIDsArr.indexOf(fieldName) > -1);
                        } else {
                            mustNotBeEmptyField = (mustNotbeEmptyFieldsForPassportsArr.indexOf(fieldName) > -1);
                        }
                        if (mustNotBeEmptyField == true) {
                            if (fieldValue.length == 0) {
                                emptyFieldFoundWhichMustNotBeEmpty = true;
                            }
                        }

                        if (fieldValue) {
                            if (fieldName == "VerificationResult") {
                                if (fieldValue.toLowerCase().startsWith("pass")) {
                                    verificationStatusOk = true;
                                }
                                if (fieldValue.toLowerCase() == "attention") {
                                    verificationStatusOk = true;
                                }
                                verificationResult = fieldValue;
                            }
                            if (fieldName == "VerificationTransactionID") {
                                transactionID = fieldValue;
                            }

                            // Correct Irish Nationality
                            if ((fieldName == "Nationality") && (fieldValue.toUpperCase() == "BRITISH INDIAN OCEAN TERRITORY")) {
                                fieldValue = "IRELAND";
                            }
                            if ((fieldName == "NationalityShort") && (fieldValue.toUpperCase() == "IOT")) {
                                fieldValue = "IRL";
                            }

                            // Correct wrong country of Erika Mustermanns Passport
                            if ((fieldName == "Nationality") && (fieldValue.toUpperCase() == "O") && (idType == "Passport")) {
                                fieldValue = "GERMANY";
                            }
                            if ((fieldName == "Country") && (fieldValue.toUpperCase() == "O") && (idType == "Passport")) {
                                fieldValue = "GERMANY";
                            }

                            // Check if Document has expired
                            if (fieldName == "ExpirationDate") {
                                if (doExpirationCheck == true) {
                                    if (fieldValue.length != 10) //yyyy-mm-dd
                                    {
                                        emptyFieldFoundWhichMustNotBeEmpty = true;
                                    } else {
                                        var dToday = new Date();
                                        var dDocument = new Date(fieldValue);
                                        if (dToday.getTime() > dDocument.getTime()) {
                                            documentHasExpired = true;
                                        }
                                    }
                                }
                            }

                            if (fieldValue.length > 0) {

                                var ignoreField = (ignoredFieldsArr.indexOf(fieldName) > -1);
                                if (ignoreField == false) {
                                    var showField = true;
                                    if (showFieldsArr.length > 0) {
                                        showField = (showFieldsArr.indexOf(fieldName) > -1);
                                    }
                                    if (showField == true) {
                                        if ((fieldName == "MRZ1") || (fieldName == "MRZ2") || (fieldName == "MRZ3")) {
                                            extractedDataHTMLList = extractedDataHTMLList + "<div style=\"font-size:1.2em !important; color: black;font-weight: bold;\">" + fieldName + "</div><div style=\"font-size:1.0em !important; color: #000000; font-family: monospace;padding-bottom: 20px;\">" + fieldValue + "</div>";
                                        } else {
                                            extractedDataHTMLList = extractedDataHTMLList + "<div style=\"font-size:1.2em !important; color: black;font-weight: bold;\">" + fieldName + "</div><div style=\"font-size:1.0em !important; color: #000000;padding-bottom: 20px;padding-top: 10px;\">" + fieldValue + "</div>";
                                        }
                                    }
                                }

                            }
                        }
                    }
                }

                // Timing info (duration of extraction)
                if (showSummaryOnly == false) {
                    if (rttiOptions.timingInfo) {
                        extractedDataHTMLList = extractedDataHTMLList + "<div style=\"font-size:1.2em !important; color: black;font-weight: bold;\">" + "Timing Info:" + "</div><div style=\"font-size:1.0em !important; color: #000000;padding-bottom: 20px;padding-top: 10px;\">" + timingInfoValues.message + "</div>";
                    }
                }

                if (doIdVerification == true) {
                    extractedDataHTMLList = "<div style=\"font-size:1.2em !important; color: black;\">" + "Verification Result" + "</div><div style=\"font-size:1.0em !important; color: #000000;padding-bottom: 20px;padding-top: 10px;\">" + verificationResult + "</div>" + extractedDataHTMLList;
                }

                hideLoader();

                // Remove all images
                imagesArray.length = 0;

                // Error if empty field was found
                if (emptyFieldFoundWhichMustNotBeEmpty == true) {
                    // Error if empty field was found
                    alert("Processing of the captured document failed!\n\n" + "Unable to extract all needed data.\n\nEither you have captured a wrong document or the image quality was too bad.");
                    verificationStatusOk = false;
                } else {
                    if (documentHasExpired == true) {
                        // Error Document has expired
                        alert("The Document has expired!");
                        verificationStatusOk = false;
                    } else {
                        if ((verificationStatusOk == false) && (doIdVerification == true)) {
                            // Error if empty field was found
                            alert("ID Verification failed!\n\nResult: " + verificationResult);
                        }
                    }
                }

                // Show Extraction Result
                document.getElementById(extractedDataId).innerHTML = extractedDataHTMLList;
                document.getElementById(extractionResultsId).scrollTop = 0;
                document.getElementById(extractionResultsId).style.visibility = 'visible';

            } else {
                // RTTI returned errorCode != 0 -> Error

                hideLoader();

                var ErrorDescription = result[0].errorDescription;

                if (errorCode == 301) {
                    ErrorDescription = "Unable to classify the captured document as valid Identity document.\n\nEither you have captured a wrong document or the image quality was too bad.";
                }

                alert("Processing of the captured document failed!\n\n" + ErrorDescription);

                // Remove all images
                imagesArray.length = 0;
                document.getElementById(captureButtonId).style.visibility = 'visible';
                document.getElementById(infoMessageId).style.visibility = 'hidden';
                showCaptureTexts();
                showNumberOfPagesCaptured();
            }

        },
        function (error) {
            // Extraction Call failed

            hideLoader();

            alert("Extraction call failed!\nError: " + error);

            // Remove all images
            imagesArray.length = 0;
            document.getElementById(captureButtonId).style.visibility = 'visible';
            document.getElementById(infoMessageId).style.visibility = 'hidden';
            showCaptureTexts();
            showNumberOfPagesCaptured();
        }
    );

};

// Add captured image to array
function addImageToArray(img) {
    // Convert base64 encoded image to binary
    var imgAsUInt8 = convertDataURIToBinary(img);

    // Add image binary to array
    imagesArray.push(imgAsUInt8);
    showNumberOfPagesCaptured();
    var ctr = imagesArray.length;

    if ((ctr == 1) && (idType == "ID") && (sidesToCapture == 0)) {
        document.getElementById(extractButtonId).style.visibility = 'visible';
    } else {
        document.getElementById(extractButtonId).style.visibility = 'hidden';
    }

    if (idType == "ID") {
        if ((ctr == 2) || (sidesToCapture == 1)) {
            document.getElementById(captureButtonId).style.visibility = 'hidden';

            doExtraction();

        } else {
            document.getElementById(captureButtonId).style.visibility = 'visible';
        }
    } else { // Passport - only 1 page
        if (ctr == 1) {
            document.getElementById(captureButtonId).style.visibility = 'hidden';

            doExtraction();

        } else {
            document.getElementById(captureButtonId).style.visibility = 'visible';
        }
    }

};

// Convert base64 encoded file to binary
function convertDataURIToBinary(dataURI) {
    var BASE64_MARKER = ';base64,';
    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
    }
    return array;
};

// Show number of captured pages
function showNumberOfPagesCaptured() {
    var ctr = imagesArray.length;

    document.getElementById(infoMessageId).style.visibility = 'visible';
    if ((ctr == 0) || (sidesToCapture == 2)) {
        document.getElementById(infoMessageId).innerHTML = '';
    } else {
        window.navigator.language === 'de'
            ?
            document.getElementById(infoMessageId).innerHTML = 'Seiten gescannt: ' + '<strong>' + ctr + '</strong>'
            :
            document.getElementById(infoMessageId).innerHTML = 'Scanned: ' + '<strong>' + ctr + '</strong>'

    }

    if ((ctr == 0) || (sidesToCapture == 1)) {
        if (idType == "Passport") {
            document.getElementById(captureButtonId).innerHTML = "Capture Info Page";
        } else {
            window.navigator.language === 'de'
                ?
                document.getElementById(captureButtonId).innerHTML = "Vorderseite"
                :
                document.getElementById(captureButtonId).innerHTML = "Front"

        }
    } else {
        window.navigator.language === 'de'
            ?
            document.getElementById(captureButtonId).innerHTML = "Rückseite"
            :
            document.getElementById(captureButtonId).innerHTML = "Back"
    }
}

// show capture texts
function showCaptureTexts() {
    if (idType == "Passport") {
        document.getElementById(captureButtonId).innerHTML = "Capture Info Page";
        document.getElementById(textMessageId).innerHTML = "<p>Please capture your Passport</p>";
    } else {
        window.navigator.language === 'de'
            ?
            document.getElementById(captureButtonId).innerHTML = "Vorderseite"
            :
            document.getElementById(captureButtonId).innerHTML = "Front"

        document.getElementById(textMessageId).innerHTML = "";
    }
}

// Show Busy indicator
function showLoader() {
    document.getElementById("loader").style.display = "inline";
};

// Hide Busy Indicator
function hideLoader() {
    document.getElementById("loader").style.display = "none";
};

// HTML Encode String
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function goNext() {
    document.getElementById(extractionResultsId).style.visibility = 'hidden';

    document.getElementById(captureButtonId).style.visibility = 'visible';
    document.getElementById(infoMessageId).style.visibility = 'visible';
    showCaptureTexts();
    showNumberOfPagesCaptured();

    // If verification & success -> move to Selfie Capture
    if ((verificationStatusOk == true) && (transactionID) && (doFaceRecognition == true)) {

        var queryParams = window.location.search;
        if (queryParams) {
            queryParams = queryParams + "&transactionID=" + transactionID;
        } else {
            queryParams = "?transactionID=" + transactionID;
        }

        window.location.href = "selfie.htm" + queryParams;
    } else {
        window.location.href = "index.htm"
    }

}




