export const openLinkInNewWindow = (url) => {
  window.open(url, "_blank", "toolbar=0,location=0,menubar=0,width=1000,height=800");
};

export const convertBlobToBase64 = (blob) => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);

  return new Promise((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
};
