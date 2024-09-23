import {readFile, writeFile} from 'fs';

let textAccumulator = '';

function concatFiles(...args){
    let pathes = args.slice(0, args.length-2);
    let destinationFilePath = args[args.length-2];
    let cb = args[args.length - 1];
console.log('cb in concatFiles', cb)
    iterateFiles(pathes, 0, cb.bind(null,destinationFilePath));
}

function iterateFiles(pathes, idx, finalCb){
    if(idx >= pathes.length) {
        finalCb()
        return;
    };
    let currentPath = pathes[idx];
    getTextFromFile(currentPath, iterateFiles.bind(null, pathes, idx+1, finalCb));
}

function getTextFromFile(path, cb){
    console.log('cb', cb)
    readFile(path, (error, data)=>{
        if(error){
            console.error('ERROR', error);
            return;
        }
        textAccumulator+=data
        cb()
    });
}

concatFiles('./files/bar.txt', './files/foo.txt', './files/result.txt', (resultFile)=>{

    writeFile(resultFile, textAccumulator, (error)=>{

        if(error){
            console.log('Error catched', error)
        }
        console.log('WRITED')
    })
});