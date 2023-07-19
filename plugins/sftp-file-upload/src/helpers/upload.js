import { Client } from 'ssh2'
import 'fs'

const upload = async (pluginData, file) => {
    // Extract the necessary information from the pluginData object
    const { host, port, username, password } = config
    const { remotePath } = pluginData;

    console.log('Uploading file to SFTP server...');

    const conn = new Client();

    conn.on('ready', () => {
        conn.sftp((err, sftp) => {
            if (err) {
                console.error('Error creating SFTP connection:', err);
                conn.end();
                return;
            }

            const remoteFileName = remotePath + '/' + localFilePath.split('/').pop();

            sftp.fastPut(localFilePath, remoteFileName, (err) => {
                if (err) {
                    console.error('Error uploading file:', err);
                    conn.end();
                    return;
                }

                // Generate the download link
                const downloadLink = `sftp://${username}:${password}@${host}:${port}${remoteFileName}`;

                console.log('File uploaded successfully!');
                console.log('Download link:', downloadLink);

                conn.end();
            });
        });
    }).connect({
        host: host,
        port: port,
        username: username,
        password: password,
        compress: "pako"
    });
}
export { upload }