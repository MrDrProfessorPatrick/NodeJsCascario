function TaskQueue(concurrency){
    this.concurrency = concurrency;
    this.queue = [];

    this.next = function () {
        while (this.running < this.concurrency && this.queue.length) {
            const task = this.queue.shift()
            task().finally(() => {
                this.running--
                this.next()
            })
            this.running++
        }
    }
    
    this.runTask = function (task) {
        return new Promise((resolve, reject) => {
            this.queue.push(() => {
                return task().then(resolve, reject)
            })
                process.nextTick(this.next.bind(this))
            })
    }
}

const spidering = new Set();

function download (url, filename) {
    console.log(`Downloading ${url}`)
    let content;
    return superagent.get(url)
    .then((res) => {
        content = res.text
        return mkdirpPromises(dirname(filename))
    })
    .then(() => fsPromises.writeFile(filename, content))
    .then(() => {
        console.log(`Downloaded and saved: ${url}`)
        return content
    })
}

function spiderLinks (currentUrl, content, nesting, queue) {
    if (nesting === 0) {
        return Promise.resolve()
    }

    const links = getPageLinks(currentUrl, content);

    const promises = links.map(link => spiderTask(link, nesting - 1, queue))
    return Promise.all(promises);

    }

    function spiderTask (url, nesting, queue) {
        if (spidering.has(url)) {
            return Promise.resolve()
        }

        spidering.add(url)

        const filename = urlToFilename(url)

        return queue.runTask(() => {
            return fsPromises.readFile(filename, 'utf8').catch((err) => {
                if (err.code !== 'ENOENT') {
                    throw err
                }
                return download(url, filename)
            })
        }).then(content => spiderLinks(url, content, nesting, queue))
    }

export function spider (url, nesting, concurrency) {
    const queue = new TaskQueue(concurrency)
    return spiderTask(url, nesting, queue)
}