

const wrapper = (fn) => {
  const promiseQueue = []
  return (...args) => new Promise((resolve, reject) => {
    const lastPromise = promiseQueue[promiseQueue.length - 1]
    let resolver
    promiseQueue.push(new Promise((queueResolve) => {
      resolver = queueResolve
    }))
    
    if (lastPromise) {
      return fn(...args)
        .then((res) => lastPromise.then(() => {
          resolver()
          promiseQueue.shift()
          resolve(res)
        }))
        .catch((error) => lastPromise.then(() => {
          resolver()
          promiseQueue.shift()
          reject(error)
        }))
    } else {
      return fn(...args)
        .then((res) => {
          resolver()
          promiseQueue.shift()
          resolve(res)
        })
        .catch((error) => {
          resolver()
          promiseQueue.shift()
          reject(error)
        })
      }
    })
  }

const fetch = (delay) => new Promise((resolve) => setTimeout(() => {
  resolve(delay)
}, delay))


const wrappedFetch = wrapper(fetch)

wrappedFetch(3000).then(console.log)
wrappedFetch(2001).then(console.log)
wrappedFetch(1000).then(console.log)
