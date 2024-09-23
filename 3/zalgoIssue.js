import { readFile } from 'fs'

const cache = new Map()

function inconsistentRead (filename, cb) {

    if (cache.has(filename)) {
    // invoked synchronously
    // zalgo issue with this cb
        cb(cache.get(filename))
    } else {
    // asynchronous function
        readFile(filename, 'utf8', (err, data) => {
            cache.set(filename, data)
            cb(data)
    })
 }
}

function createFileReader (filename) {
    const listeners = [];

    inconsistentRead(filename, value => {
        listeners.forEach(listener => listener(value))
        })

    return {
        // push listener cb of .onDataReady to listeners array before inconsistentRead launch it, as cb is called asynchronous in readFile
        // and thath's why it works if asynchronous and doesn't work if synchronous
        onDataReady: listener => listeners.push(listener)
    }
}

const reader1 = createFileReader('data.txt');

reader1.onDataReady(data => {
    console.log(`First call data: ${data}`)
// ...sometime later we try to read again from
// the same file
    const reader2 = createFileReader('data.txt');

    reader2.onDataReady(data => {
        console.log(`Second call data: ${data}`)
    })
})