const upload = (config, file) => {
    const { service } = config;

    switch (service) {
        case 'aws-s3': {
            const { uploadUrl, downloadUrl } = config;

            return fetch(uploadUrl, {
                method: 'PUT',
                body: file
            })
            .then(() => downloadUrl)
        }
    }
}

module.exports = {
    upload
}