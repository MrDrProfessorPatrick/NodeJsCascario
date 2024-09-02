function spiderLinks (currentUrl, body, nesting, cb) {
    if (nesting === 0) {
        return process.nextTick(cb)
    }

    const links = getPageLinks(currentUrl, body);

    if (links.length === 0) {
        return process.nextTick(cb)
    }

    let completed = 0;
    let hasErrors = false;

        function done (err) {
            if (err) {
                hasErrors = true
                return cb(err)
            }
            if (++completed === links.length && !hasErrors) {
                return cb()
            }
        }

    links.forEach(link => spider(link, nesting - 1, done))
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


    // *** PATTERN ***

    const tasks = [ /* ... */ ]
    let completed = 0

    tasks.forEach(task => {
        task(() => {
            if (++completed === tasks.length) {
                finish()
        }
        })
    })

    function finish () {
    // all the tasks completed
    }