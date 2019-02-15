const queueWrapper = (fn) => {
  const promiseQueue = []
  return (...args) => new Promise((resolve, reject) => {
    const lastPromise = promiseQueue[promiseQueue.length - 1]
    let queueResolve
    promiseQueue.push(new Promise((_queueResolve) => {
      queueResolve = _queueResolve
    }))
    
    if (lastPromise) {
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
    } else {
      fn(...args)
        .then((res) => {
          promiseQueue.shift()
          queueResolve()
          resolve(res)
        })
        .catch((error) => {
          promiseQueue.shift() 
          queueResolve()
          reject(error)
        })
      }
    })
  }

const delayedLog = (delay) => new Promise((resolve) => setTimeout(() => {
  resolve(delay)
}, delay))


const orderedLog = queueWrapper(delayedLog)

orderedLog(1005).then(console.log).then(() => orderedLog(105).then(console.log))
orderedLog(2001).then(console.log).then(() => orderedLog(1002).then(console.log))
orderedLog(1000).then(console.log).then(() => orderedLog(101).then(console.log))
orderedLog(1003).then(console.log)
