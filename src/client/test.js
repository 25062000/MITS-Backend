const {
    Worker, isMainThread, parentPort, workerData,
  } = require('node:worker_threads');

test2 = (req, res) =>{
    let counter=1;
    for(i=0; i<6; i++){
        counter++
    }
    res.send({"status": true, "data":counter});

}

module.exports ={  test2 };