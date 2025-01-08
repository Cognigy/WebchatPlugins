import FormData from "form-data";

export const upload = async (config, file) => {
  const { service } = config;

  if (["amazon-s3", "azure"].includes(service)) {
    const uploadUrl =
      service === "amazon-s3"
        ? config.uploadUrl
        : `${config.baseURL}${config.containerName}/${file.name}${config.sasSignature}`;
    const downloadUrl =
      service === "amazon-s3" ? config.downloadUrl : uploadUrl;

    return fetch(uploadUrl, {
      method: "PUT",
      body: file,
    })
      .then(() => ({ success: true, url: downloadUrl }))
      .catch((err) => ({
        success: false,
        reason: `Upload failed. Error: ${err.message}`,
      }));
  } else {
    const { inboxIdentifier, host, conversationId, contactIdentifier } = config;
    const uploadUrl = `${host}/public/api/v1/inboxes/${inboxIdentifier}/contacts/${contactIdentifier}/conversations/${conversationId}/messages`;
    const form = new FormData();
    form.append("attachments[]", file);

    return fetch(uploadUrl, {
      method: "POST",
      body: form,
      headers: {
        Accept: "*/*",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to upload. HTTP status: ${response.status} - ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((data) => ({
        success: true,
        url: data.attachments[0].data_url,
      }))
      .catch(() => ({
        success: false,
        reason:
          "File upload failed. Ensure the file is less than 40MB and of type jpg, jpeg, png, pdf, doc, or docx.",
      }));
  }
};
