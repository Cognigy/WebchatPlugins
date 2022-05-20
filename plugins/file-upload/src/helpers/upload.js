import Axios from "axios";
import FormData from "form-data";

export const upload = async (config, file) => {
	const { service } = config;

	switch (service) {
		case "amazon-s3": {
			const { uploadUrl, downloadUrl } = config;

			return fetch(uploadUrl, {
				method: "PUT",
				body: file,
			})
				.then(() => {
					return { success: true, url: downloadUrl };
				})
				.catch(err => {
					return { success: false, reason: `Upload failed. Error: ${err.message}` };
				});
		}
		case "azure": {
			const { baseURL, sasSignature, containerName } = config;
			const uploadUrl = baseURL + containerName + "/" + file.name + sasSignature;
			const downloadUrl = uploadUrl;

			return fetch(uploadUrl, {
				method: "PUT",
				body: file,
				headers: {
					"x-ms-blob-type": "BlockBlob",
				},
			})
				.then(() => {
					return { success: true, url: downloadUrl };
				})
				.catch(err => {
					return { success: false, reason: `Upload failed. Error: ${err.message}` };
				});
		}
		case "live-agent": {
			const { inboxIdentifier, host, conversationId, contactIdentifier } = config;
			const uploadUrl = `${host}/public/api/v1/inboxes/${inboxIdentifier}/contacts/${contactIdentifier}/conversations/${conversationId}/messages`;
			const form = new FormData();
			form.append("attachments[]", file);
			form.append("content", "file successfully uploaded");

			return Axios.post(uploadUrl, form, {
				headers: {
					"Content-Type": "multipart/form-data",
					Accept: "*/*",
				},
			})
				.then(res => {
					return { success: true, url: res.data.attachments[0].data_url };
				})
				.catch(err => {
					return {
						success: false,
						reason: `Your file upload failed. Please verify your file is less than 40MB large and is of type jpg, jpeg, png, pdf, doc or docx.`,
					};
				});
		}
	}
};
