export const upload = async (config, file) => {
  const { uploadUrl } = config;

  return fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "x-ms-blob-type": "BlockBlob",
      // "x-ms-tags": encodeURIComponent(file.name) // Where to put the file name?
    },
  }).then((response) => {
    if (response.ok) {
      return { success: true, url: uploadUrl };
    }
    return { success: false };
  }).catch(error => {
    return { success: false, reason: error.message };
  });
};

// Convert file size in bytes to KiB, MiB, ...
export const formatFileSize = (bytes, decimals = 0) => {
  if (!+bytes) {
    return '';
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}