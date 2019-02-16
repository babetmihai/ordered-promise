const assert = require('assert')
const orderedPromise = require('./dist').default

const delay = (time) => new Promise((resolve) => setTimeout(() => resolve(time), time))
const orderedLog = orderedPromise(delay)

describe('test order promise', () => {
  it('should resolve everything in order', () => {
    const result = []
    return Promise.all([
      orderedLog(500).then((res) => result.push(res)),
      orderedLog(100).then((res) => result.push(res)),
      delay(200).then(() => orderedLog(1000).then((res) => result.push(res))),
      delay(300).then(() => orderedLog(400).then((res) => result.push(res)))
    ])
      .then(() => assert.deepEqual(result, [500, 100, 1000, 400]))
  })
})