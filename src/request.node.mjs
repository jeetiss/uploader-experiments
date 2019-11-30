import * as http from "http";
import * as https from "https";
import { parse } from "url";
import { Transform } from "stream";
import FormData from "form-data";

let createformData = (form, filename) =>
  Object.entries(form).reduce((formData, [key, value]) => {
    formData.append(key, value, key === "file" ? filename : undefined);

    return formData;
  }, new FormData());

let getLength = formData =>
  new Promise((resolve, reject) => {
    formData.getLength((error, length) => {
      if (error) reject(error);
      else resolve(length);
    });
  });

let request = ({
  method,
  url,
  headers,
  form,
  filename,
  progress,
  cancel
}) =>
  Promise.resolve(form ? createformData(form, filename) : undefined)
    .then(formData =>
      formData ? Promise.all([formData, getLength(formData)]) : []
    )
    .then(
      ([formData, length]) =>
        new Promise((resolve, reject) => {
          let aborted = false;
          let options = parse(url);

          options.method = method;
          options.headers = formData
            ? Object.assign({}, formData.getHeaders(), headers)
            : headers;

          if (formData) {
            options.headers["Content-Length"] = length;
          }

          let req =
            options.protocol !== "https:"
              ? http.request(options)
              : https.request(options);

          if (cancel) {
            cancel.onCancel(() => {
              aborted = true;
              req.abort();

              reject(new Error("cancel"));
            });
          }

          req.on("response", res => {
            if (aborted) return;

            const resChunks = [];

            res.on("data", data => {
              resChunks.push(data);
            });

            res.on("end", () =>
              resolve({
                data: Buffer.concat(resChunks).toString("utf8"),
                status: res.statusCode,
                headers: res.headers
              })
            );
          });

          req.on("error", err => {
            if (aborted) return;

            reject(err);
          });

          if (formData) {
            if (progress) {
              formData.pipe(new ProgressEmitter(progress)).pipe(req);
            } else {
              formData.pipe(req)
            }
          } else {
            req.end(formData);
          }
        })
    );

// ProgressEmitter is a simple PassThrough-style transform stream which keeps
// track of the number of bytes which have been piped through it and will
// invoke the `onprogress` function whenever new number are available.
class ProgressEmitter extends Transform {
  constructor(onprogress) {
    super();
    
    this._onprogress = onprogress;
    this._position = 0;
  }

  _transform(chunk, encoding, callback) {
    this._position += chunk.length;
    this._onprogress({
      lengthComputable: true,
      loaded: this._position
    });
    callback(null, chunk);
  }
}

export default request
