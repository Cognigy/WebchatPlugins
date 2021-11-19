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
            const uploadUrl = `https//${host}/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`;
            const downloadUrl = uploadUrl;
            return fetch(uploadUrl, {
                method: 'POST',
                body: {
                    content: 'file-upload',
                    attachments: [file]
                },
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'api_access_token': userApiKey
                }
            })
                .then(() => downloadUrl )
        }
    }
}
