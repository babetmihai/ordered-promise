const orderedPromise = (fn) => {
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

// example
const delay = (time) => new Promise((resolve) => setTimeout(() => resolve(time), time))
const orderedLog = orderedPromise(delay)

orderedLog(100).then(console.log)
orderedLog(2000).then(console.log)
orderedLog(1000).then(console.log)
orderedLog(500).then(console.log)
delay(300).then(() => orderedLog(1300).then(console.log))
delay(400).then(() => orderedLog(400).then(console.log))
