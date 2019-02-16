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

// test
const logDelay = (delay) => new Promise((resolve) => setTimeout(() => {
  resolve(delay)
}, delay))


const orderedLog = queueWrapper(logDelay)

orderedLog(1005).then(console.log).then(() => orderedLog(105).then(console.log))
orderedLog(2001).then(console.log).then(() => orderedLog(1002).then(console.log))
orderedLog(1000).then(console.log).then(() => orderedLog(101).then(console.log))
orderedLog(1003).then(console.log)
