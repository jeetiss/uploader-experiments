import fs from "fs";
import { promisify } from "util";
import { upload, uploadUrl } from "./upload.mjs";
import CancelController from "./cancel.mjs";

let read = promisify(fs.readFile);

// onProgress: console.log,
// publicKey: "e817444de392775585a3",
// file,
// filename: "image.png"

// read("/Users/jeetiss/Projects/secret-uploader/image.png")
//   .then(file => upload(file, { publicKey: "e817444de392775585a3" }))
//   .then(console.log)
//   .catch(console.log);

let imageUrl =
  "https://mir24.tv/uploaded/images/2019/October/1efba0ca7e9634e8b05b0ab889aaaf3cf58c669ebd46a70f2dce4fe19a445a31.jpg";

let cntr = new CancelController()

uploadUrl(imageUrl, { publicKey: "e817444de392775585a3", progress: console.log, cancel: cntr })
  .then(console.log)
  .catch(console.log);

process.on('SIGINT', () => {
  console.log()
  console.log("upload canceled");

  cntr.cancel()
});

// request({
//   method: "GET",
//   url: "https://upload.uploadcare.com/info/?jsonerrors=1&pub_key=e817444de392775585a3&file_id=266e3f8e-835d-4520-8981-0df7a184f982",
// })
//   .then(console.log)
//   .catch(console.log);
