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
            const uploadUrl =  baseURL+containerName+'/'+file.name+sasSignature
            const downloadUrl = uploadUrl;

            return fetch(uploadUrl, {
                method: 'PUT',
                body: file,
                headers: {
                    'x-ms-blob-type': 'BlockBlob'
                },
            })
                .then(() => downloadUrl )
        }
        case 'live-agent': {
            const { userApiKey, host, accountId, conversationId } = config;
            const uploadUrl = `${host}/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`;
            const form = new FormData();
            form.append('attachments[]',file);
            form.append('content','file-upload');

            return Axios.post(uploadUrl, form, {
                headers: {
                    'api_access_token': userApiKey,
                    'Content-Type':'multipart/form-data',
                    'Accept':'*/*',
                },
            }).then(res => res.data.attachments[0].data_url)           
         }
    }
}