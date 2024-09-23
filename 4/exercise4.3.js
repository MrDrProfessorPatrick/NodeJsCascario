// RECURSIVE FIND
import {readdir, readFile} from 'fs';
import {join} from 'path';
import {EventEmitter} from 'events';

function recursiveFind(dir, keyword) {  

    let filesList = [];
    let filesResult = [];
    let running = 0;

  function findFiles(findByKeyWordsCb){
    readdir(dir, {withFileTypes:true, recursive:true}, (err, files) => {
        files.forEach(file => {
            if(!file.isDirectory()) {
                filesList.push(file)
            }
        });
         findByKeyWordsCb(keyword, filesList, filesResult)
    });
  }

    function findKeywordInFiles(keyword, filesList, filesResult){
        let filesLeft = filesList.length;

            for(let file of filesList){
                let path = join(file.path, file.name);
                readFile(path, 'utf-8', (err, data) => {
                    if(err){
                        console.log(err, 'ERROR')
                        return err
                    }
                    filesLeft--;
    
                    if(data.includes(keyword)){
                        filesResult.push(path);
                    }

                    if(filesLeft === 0){ 
                        console.log('RETURN FINALRESULT', filesResult)
                        return filesResult
                    }
                })
            }      
    }

     findFiles(findKeywordInFiles.bind(null, keyword, filesList, filesResult))
}

 console.log(recursiveFind('./files', 'BAR'))