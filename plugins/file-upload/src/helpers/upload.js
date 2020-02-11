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
    }
}
