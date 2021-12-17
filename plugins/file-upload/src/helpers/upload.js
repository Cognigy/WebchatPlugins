import Axios from 'axios'
import FormData from 'form-data'

export const upload = async (config, file) => {
    const { service } = config;

    switch (service) {
        case 'amazon-s3': {
            const { uploadUrl, downloadUrl } = config;

            return fetch(uploadUrl, {
                method: 'PUT',
                body: file
            })
                .then(() => downloadUrl)
        }
        case 'azure': {
            const { baseURL, sasSignature, containerName } = config;
            const uploadUrl = baseURL + containerName + '/' + file.name + sasSignature
            const downloadUrl = uploadUrl;

            return fetch(uploadUrl, {
                method: 'PUT',
                body: file,
                headers: {
                    'x-ms-blob-type': 'BlockBlob'
                },
            })
                .then(() => downloadUrl)
        }
        case 'live-agent': {
            const { inboxIdentifier, host, conversationId, contactIdentifier } = config;
            const uploadUrl = `${host}/public/api/v1/inboxes/${inboxIdentifier}/contacts/${contactIdentifier}/conversations/${conversationId}/messages`;
            const form = new FormData();
            form.append('attachments[]', file);
            form.append('content', 'file successfully uploaded');

            return Axios.post(uploadUrl, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': '*/*',
                },
            }).then(res => res.data.attachments[0].data_url)
        }
        case 'salesforce': {
            const { salesforceUrl, accessToken, folderId, description } = config;
            const uploadUrl = `${salesforceUrl}/services/data/v53.0/sobjects/Document/`;

            return Axios(
                {
                    method: 'post',
                    url: uploadUrl,
                    formData: {
                        entity_document: {
                            value: JSON.stringify({
                                "Name": file.name,
                                "Description": description,
                                "FolderId": folderId,
                                "Keywords": "File",
                                "Type": file.type
                            }),
                            options: {
                                contentType: "application/json"
                            }
                        },
                        Body: file
                    },
                    headers: {
                        'Content-Type': `multipart/form-data; boundary="boundary_string"`,
                        'Authorization': `Bearer ${accessToken}`,
                        'Accept': '*/*'
                    }
                }
            ).then(res => res.data)
        }
    }
}