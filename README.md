wrapper that makes asynchronous services return in the order they were called

#### Setup
```
const orderedPromise = require('ordered-promise)
const delay = (time) => new Promise((resolve) => setTimeout(() => resolve(time), time))
const orderedLog = orderedPromise(delay)
```

#### Example
```
orderedLog(100).then(console.log)
orderedLog(2000).then(console.log)
orderedLog(1000).then(console.log)
orderedLog(500).then(console.log)
delay(300).then(() => orderedLog(1300).then(console.log))
delay(400).then(() => orderedLog(400).then(console.log))
```
```
100
2000
1000
500
1300
400
```
