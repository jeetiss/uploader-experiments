import request from "./request.node.mjs";

let info = ({ publicKey, fileId, cancel, baseURL = "https://upload.uploadcare.com" }) =>
  request({
    method: "GET",
    url: `${baseURL}/info/?jsonerrors=1&pub_key=${publicKey}&file_id=${fileId}`,
    cancel
  }).then(prettify);

let base = ({
  publicKey,
  file,
  filename,
  progress,
  cancel,
  baseURL = "https://upload.uploadcare.com"
}) =>
  request({
    method: "POST",
    url: `${baseURL}/base/?jsonerrors=1`,
    progress,
    form: {
      UPLOADCARE_PUB_KEY: publicKey,
      file
    },
    filename,
    cancel
  }).then(prettify);


function prettify(result) {
  return camelizeKeys(JSON.parse(result.data));
};

let SEPARATOR = /\W|_/g;
function camelize(text) {
  return text
    .split(SEPARATOR)
    .map(
      (word, index) =>
        word.charAt(0)[index > 0 ? "toUpperCase" : "toLowerCase"]() +
        word.slice(1)
    )
    .join("");
}

function camelizeKeys(source) {
  if (!source || typeof source !== "object") {
    return source;
  }

  return Object.keys(source).reduce((accumulator, key) => {
    accumulator[camelize(key)] =
      typeof source[key] === "object" ? camelizeKeys(source[key]) : source[key];

    return accumulator;
  }, {});
}

export { info, base };
