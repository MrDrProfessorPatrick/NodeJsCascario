var p1 = Promise.resolve(3);
var p2 = 1337;
var p3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, "foo");
});

let arr = [p1,p2,p3];

function arrayPromiseResolver(promises){
  let result = []
  let fulfilledCount = 0;
  let conurrency = 2
  // need to stop cycle if > concurrency and then continue;
  
  return new Promise((resolve, reject) => {
    for(let promise of promises){
      promise.then((data)=>{
        fulfilledCount++;
        result.push(data);
  
        if(fulfilledCount === promises.length){
            resolve(result)
        }
      })
    }
  }) 
}

function promiseAll(promisesArr){
  // need to return Promise wich return array result
    let promisesQueue = [];

    for(let value of promisesArr){
      promisesQueue.push(new Promise((resolve, reject)=>{
          resolve(value);
      }))
    }

return arrayPromiseResolver(promisesQueue)

}

promiseAll(arr).then((result)=>{console.log('final result', result)});

