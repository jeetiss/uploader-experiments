class CancelController {
  constructor() {
    this.promise = new Promise((resolve) => {
      this.resolver = resolve
    })
  }

  cancel() {
    this.resolver()
  }

  onCancel(callback) {
    this.promise.then(callback)
  }
}

export default CancelController
