import {readdir, statSync} from 'fs';

function listNestedFiles (dir) { 

  let filesList = [];

    readdir(dir, {withFileTypes:true, recursive:true}, (err, files) => {
        files.forEach(file => {
            // let filePath = join(dir, file)
            if(!file.isDirectory()) filesList.push(file.name);
        });
      });
      return filesList
}

console.log(listNestedFiles('../4'))