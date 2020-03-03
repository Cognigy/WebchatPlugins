let PERSONAL_DATA = {};
let IMAGES = {};

/**
 * Capitalize the extracted text to get typical written text.
 * Result = FIRSTNAME -> Firstname
 * @param {String} text 
 */
function capitalizeFLetter(text) {
    try {
        text = text.toLowerCase();
        return text[0].toUpperCase() + text.slice(1);
    } catch (e) {
        return "";
    }

}



/**
 * Function for sending the extracted field values from the iFrame to this component
 * @param {List} results the extracted results
*/
const handlePersonalData = (results) => {

    const { fields, processedImages } = results[0];

    // extract the perso info from result fields
    let persoData = {
        firstname: capitalizeFLetter(fields[8].text),
        lastname: capitalizeFLetter(fields[10].text),
        middlename: capitalizeFLetter(fields[9].text),
        nationality: capitalizeFLetter(fields[14].text),
        city: capitalizeFLetter(fields[22].text),
        zip: fields[24].text,
        birthday: fields[12].text,
        address: capitalizeFLetter(fields[21].text),
        country: capitalizeFLetter(fields[2].text),
        countryshort: fields[3].text,
        nationalityshort: fields[15].text,
        documenttype: fields[0].text,

    };

    // Get the extracted images and store it to the IMAGES object
    IMAGES = {
        id: processedImages,
        face: {
            image: fields[18].text,
            valid: fields[18].valid
        },
        signature: {
            iamge: fields[19].text,
            valid: fields[19].valid
        }
    }

    // Get the extracted personal information and store it to the PERSONAL_DATA object
    PERSONAL_DATA = persoData;
}
