export default (fn) => {
  let lastPromise = Promise.resolve()
  return (...args) => new Promise((resolve, reject) => {
    const _lastPromise = lastPromise

    let lastResolve
    lastPromise = new Promise((_lastResolve) => {
      lastResolve = _lastResolve
    })

    fn(...args)
      .then((res) => _lastPromise.then(() => resolve(res)))
      .catch((error) => _lastPromise.then(() => reject(error)))
      .finally(() => lastResolve())
  })
}

