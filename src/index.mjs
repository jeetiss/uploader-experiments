import fs from "fs";
import { promisify } from "util";

import { upload } from "./upload.mjs";

let read = promisify(fs.readFile);

// onProgress: console.log,
// publicKey: "e817444de392775585a3",
// file,
// filename: "image.png"

read("/Users/jeetiss/Projects/secret-uploader/image.png")
  .then(file => upload(file, { publicKey: "e817444de392775585a3" }))
  .then(console.log)
  .catch(console.log);

// request({
//   method: "GET",
//   url: "https://upload.uploadcare.com/info/?jsonerrors=1&pub_key=e817444de392775585a3&file_id=266e3f8e-835d-4520-8981-0df7a184f982",
// })
//   .then(console.log)
//   .catch(console.log);
