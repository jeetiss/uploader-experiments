import { base, info, url, status } from "./base.mjs";
import { poll } from "./poll.mjs";

let upload = (file, { progress, cancel, publicKey, filename = "image.png" }) =>
  base({
    file,
    progress,
    cancel,
    publicKey,
    filename
  }).then(({ file: fileId }) =>
    poll({
      check: cancel =>
        info({ publicKey, fileId, cancel }).then(info =>
          info.isReady ? info : false
        ),
      interval: 200,
      cancel
    })
  );

let run = (progress, value) => {
  if (progress) {
    progress(value);
  }
};

let uploadUrl = (imageUrl, { publicKey, progress, cancel }) =>
  url({ publicKey, url: imageUrl, cancel })
    .then(result =>
      result.type === "token"
        ? poll({
            cancel,
            check: cancel =>
              status({ token: result.token, cancel })
                .then(
                  status =>
                    run(progress, { done: status.done, total: status.total }) ||
                    status
                )
                .then(status => (status.isReady ? status : false)),
            interval: 500
          })
        : result
    );

export { upload, uploadUrl };
