function download (url, filename, cb) {
    console.log(`Downloading ${url}`)
    superagent.get(url).end((err, res) => {
        if (err) {
            return cb(err)
        }

        saveFile(filename, res.text, err => {
            if (err) {
                return cb(err)
            }

            console.log(`Downloaded and saved: ${url}`)
            cb(null, res.text)
        })
    })
}

function spiderLinks (currentUrl, body, nesting, cb) {
    if (nesting === 0) {
    // Remember Zalgo from chapter 3?
        return process.nextTick(cb)
    }

    const links = getPageLinks(currentUrl, body)

    if (links.length === 0) {
        return process.nextTick(cb)
    }

    function iterate (index) {
        if (index === links.length) {
            return cb()
        }
        
        spider(links[index], nesting - 1, function (err) {
            if (err) {
                return cb(err)
            }
            iterate(index + 1)
        })
    }
    iterate(0)
}

export function spider (url, nesting, cb) {
    const filename = urlToFilename(url);

    fs.readFile(filename, 'utf8', (err, fileContent) => {
        if (err) {
            if (err.code !== 'ENOENT') {
                return cb(err)
            }
        // The file doesn't exist, so let's download it
            return download(url, filename, (err, requestContent) => {
                if (err) {
                    return cb(err)
                }
                spiderLinks(url, requestContent, nesting, cb)
            })
        }
        // The file already exists, let's process the links
        spiderLinks(url, fileContent, nesting, cb)
    })
}

// $$$ USAGE $$$

const url = process.argv[2]
const nesting = Number.parseInt(process.argv[3], 10) || 1

spider(url, nesting, err => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log('Download complete')
})

// ## PATTERN $$ SEQUENTIAL EXECUTION

function iterate (index) {
    if (index === tasks.length) {
        return finish()
    }

    const task = tasks[index];
    task(() => iterate(index + 1));
    // IF TASK IS SYNCHRONOUS RECURSION WILL STUCK -> this means without cb i think
    function finish () {
    // iteration completed
}
    iterate(0)
}

    // exercise Sequential Iterator pattern
    let task1 = function(cb){
        setTimeout(()=>{
          console.log('task1');
          cb()
    
        }, 1000);
      };
        
      let task2 = function(cb){
        setTimeout(()=>{
          console.log('task2');
          cb()
    
        }, 1000);
      };
        
      let task3 = function(cb){
        setTimeout(()=>{
          console.log('task3');
          cb()
    
        }, 3000);
      }
    
        let list = [task1, task2, task3];
    
        function iterator(tasksList, finishCb){
    
            function itarate(index){
              if(index === tasksList.length) return finishCb()
              let currentTask = tasksList[index];
              currentTask(()=>{itarate(index+1)})
            }
            itarate(0)
            }
    
    iterator(list, ()=>console.log('FINISHED'))