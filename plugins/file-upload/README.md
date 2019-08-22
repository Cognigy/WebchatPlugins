# File Upload Plugin
This Plugin enables bots to request files from users.
The User will see a button to open a file upload dialog.
In the Dialog, the user can then select a file to upload (drag n drop is supported).
The File will be uploaded to a predefined destination of a third-party service (e.g. Amazon S3).

![file upload button](./docs/file-upload-button.png)
![file upload dialog](./docs/file-upload-dialog.png)

## Result Message
After uploading, the plugin will send a hidden message to the bot with an URL to the file in `ci.data.file`.
```typescript
{
  data: {
    file: 'https://example.com/url-to-file'
  }
}
```


## Upload to Amazon S3
Allows users to upload a file to an Amazon S3 Bucket using a [Presigned URL](https://docs.aws.amazon.com/AmazonS3/latest/dev/PresignedUrlUploadObject.html).
The Plugin will need a presigned `uploadUrl` for uploading the file, as well as a presigned `downloadUrl` to get read access to the file after uploading.


### Message Data Structure
```typescript
interface UploadToS3BucketData {
  _plugin: {
        type: 'file-upload';
        service: 'amazon-s3';

        // presigned upload url
        uploadUrl: string;
        
        // presigned download url
        downloadUrl: string;
    }
}
```
[Upload to Amazon S3 Example Message](./docs/AmazonS3.message.json)