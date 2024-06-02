const { Worker, workerData, parentPort } = require('node:worker_threads');
const { spawn, spawnSync } = require('child_process');
const { config } = require('node:process');


shapeScriptPath= './submodules/SMAC-M/bin/generate_shapefiles.py';
mapScriptPath ='./submodules/SMAC-M/chart-installation/generate_map_files/generate_map_config.py';
configPath='./submodules/SMAC-M/noaa/config.enc.noaa.toml';
const python = spawnSync('python3', [shapeScriptPath,configPath]);
const python2 = spawnSync('python3', [mapScriptPath, configPath]);

// python.stderr.on('error',(error)=>{
//     console.log("Stderr", error)
// });
// python.on('error', (err) => {
//     console.error('Failed to start subprocess.', err);
// });

// python2.stderr.on('error',(error)=>{
//     console.log("Stderr", error)
// });
// python2.on('error', (err) => {
//     console.error('Failed to start subprocess.', err);
// });

parentPort.postMessage("Success");