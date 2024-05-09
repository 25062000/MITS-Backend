const {
   parentPort
  } = require('node:worker_threads');

let counter=0;
for(i=0; i<690000000000000000000; i++){
    counter++
}
counter++;

parentPort.postMessage({ status: true, data: counter });