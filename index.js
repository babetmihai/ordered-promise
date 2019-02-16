const queueWrapper = (fn) => {
  const promiseQueue = []
  return (...args) => new Promise((resolve, reject) => {
    const lastPromise = promiseQueue[promiseQueue.length - 1] || Promise.resolve()
    let queueResolve
    promiseQueue.push(new Promise((_resolve) => {
      queueResolve = _resolve
    }))

    fn(...args)
      .then((res) => lastPromise.then(() => {
        promiseQueue.shift()
        queueResolve()
        resolve(res)
      }))
      .catch((error) => lastPromise.then(() => {
        promiseQueue.shift()
        queueResolve()
        reject(error)
      }))
    })
}

// example
const delay = (time) => new Promise((resolve) => setTimeout(() => resolve(time), time))
const orderedLog = queueWrapper(delay)

orderedLog(100).then(console.log)
orderedLog(2000).then(console.log)
orderedLog(1000).then(console.log)
orderedLog(500).then(console.log)
