import axios from "axios";
import FormData from "form-data";
const https = require("https");


export const upload = async (config, file) => {
	const { baseUrl, bearerToken, folderName, rejectCertificate } = config;

	const agent = new https.Agent({
		rejectUnauthorized: false,
		requestCert: false,
		agent: false
	})
	
	let folderId;
	let createFolderData = {
		"name": folderName
	};

	let createFolderConfig = {
		method: 'post',
		maxBodyLength: Infinity,
		url: `https://${baseUrl}/api/v2/files/create-folder`,
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${bearerToken}`
		},
		data: createFolderData,
	};
	
		if (rejectCertificate === false) {
			createFolderConfig["httpsAgent"] = agent
		}
	
	await axios.request(createFolderConfig)
		.then((response) => {
			folderId = response.data.id
			// console.log({ "create_folder_response": response })
		})
		.catch((error) => {
			console.log(error);
			return { success: false, reason: `Folder creation failed failed. Error: ${error.message}` };
		});

	const form = new FormData();
	form.append("file", file);

	let uploadConfig = {
		method: 'post',
		maxBodyLength: Infinity,
		url: `https://${baseUrl}/api/v2/files/${folderId}/upload-file`,
		headers: {
			'Authorization': `Bearer ${bearerToken}`
		},
		data: form,
		httpsAgent: agent
	};

	if (rejectCertificate === false) {
		uploadConfig["httpsAgent"] = agent
	}

	await axios.request(uploadConfig)
		.then(res => {
			// console.log({ "create_folder_response": res })
		})
		.catch(error => {
			console.log(error)
			return { success: false, reason: `Upload failed. Error: ${error.message}` };

		});

	let createDownloadLinkdata = JSON.stringify({
		"noExpiration": false
	});

	let createDownloadLinkConfig = {
		method: 'post',
		maxBodyLength: Infinity,
		url: `https://${baseUrl}/api/v2/files/${folderId}/create-public-download-link`,
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${bearerToken}`,
		},
		data: createDownloadLinkdata,
		httpsAgent: agent
	};

	if (rejectCertificate === false) {
		createDownloadLinkConfig["httpsAgent"] = agent
	}

	return await axios.request(createDownloadLinkConfig)
		.then((result) => {
			//console.log(result)
			return {
				success: true,
				downloadUrl: "https://" + baseUrl + "/" + result.data.url + "&ddl=true",
				url: "https://" + baseUrl + "/" + result.data.url
			}
		})
		.catch((error) => {
			return { success: false, reason: `Create Download Link failed. Error: ${error.message}` },
				console.log(error);
		});
};
