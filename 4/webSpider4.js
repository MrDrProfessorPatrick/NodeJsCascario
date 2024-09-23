export class TaskQueue {
  constructor (concurrency) {
    this.concurrency = concurrency
    this.running = 0
    this.queue = []
  }
  pushTask (task) {
    this.queue.push(task)
    process.nextTick(this.next.bind(this))
    return this
  }
  next () {
    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift()
      task(() => {
        this.running--
        process.nextTick(this.next.bind(this))
      })
      this.running++
    }
  }
}

function spiderTask (url, nesting, queue, cb) {
    const filename = urlToFilename(url)
        fs.readFile(filename, 'utf8', (err, fileContent) => {
            if (err) {
            if (err.code !== 'ENOENT') {
                return cb(err)
            }

                return download(url, filename, (err, requestContent) => {
                    if (err) {
                        return cb(err)
                    }

                    spiderLinks(url, requestContent, nesting, queue)
                    return cb()
                })
            }   

    spiderLinks(url, fileContent, nesting, queue)
    return cb()
    })
}

function spiderLinks (currentUrl, body, nesting, queue) {
    if (nesting === 0) {
        return
    }

    const links = getPageLinks(currentUrl, body);

    if (links.length === 0) {
        return
    }
    links.forEach(link => spider(link, nesting - 1, queue))
}


const spidering = new Set()
export function spider (url, nesting, queue) {
    if (spidering.has(url)) {
        return
    }

    spidering.add(url)
    queue.pushTask((done) => {
        spiderTask(url, nesting, queue, done)
    })
}

// *** USAGE ***

const url = process.argv[2]
const nesting = Number.parseInt(process.argv[3], 10) || 1
const concurrency = Number.parseInt(process.argv[4], 10) || 2
const spiderQueue = new TaskQueue(concurrency)
spiderQueue.on('error', console.error)
spiderQueue.on('empty', () => console.log('Download complete'))
spider(url, nesting, spiderQueue)