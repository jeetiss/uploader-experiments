import { base, info } from "./base.mjs";
import { poll } from "./poll.mjs";

let upload = (file, {
  progress,
  cancel,
  publicKey,
  filename = "image.png"
}) =>
  base({
    file,
    progress,
    cancel,
    publicKey,
    filename
  })
.then(({ file: fileId }) =>
  poll({
    check: cancel =>
      info({ publicKey, fileId, cancel }).then(info =>
        info.isReady ? info : false
      ),
    interval: 200,
    cancel
  })
)


export { upload }