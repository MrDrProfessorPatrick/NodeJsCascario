import {readFile} from 'fs';

function concatFiles(...args){
    let textAccumulator = '';
    let destinationFilePath = args[args.length-2];
    let cb = args[args.length - 1];

    for(let path of args){
        getTextFromFile(path, cb())
    }
}

function getTextFromFile(path, cb){
    readFile(path, (error, data)=>{
        if(error){
            console.error(error);
            return;
        }
        cb(data);
    });
}

concatFiles('./files/foo.txt', './files/bar.txt', './files/result.txt', (data)=>console.log(data));