let task1 = function(){
  console.log('task1 is running')
    return new Promise((resolve, reject)=>{
       return setTimeout(()=>{
          console.log('task1');
           return resolve('task1')
      }, 1000);

    })
  }
      
    let task2 = function(){
      console.log('task1 is running')
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
              console.log('task2');
               return resolve('task2')
          }, 1000);
    
        })
      }
      
    let task3 = function(){
    console.log('task3 is running')
      return new Promise((resolve, reject)=>{
          setTimeout(()=>{
            console.log('task3');
             return resolve('task3')
        }, 3000);

      })
    }
    
      let task4 = function(){
        console.log('task4 is running')
          return new Promise((resolve, reject)=>{
              setTimeout(()=>{
                console.log('task4');
                 return resolve('task4')
            }, 3000);
      
          })
        }
    
      let task5 = function(){
        console.log('task5 is running')
          return new Promise((resolve, reject)=>{
              setTimeout(()=>{
                console.log('task5');
                return  resolve('task5')
            }, 3000);
      
          })
        }
    
    
      let task6 = function(){
        console.log('task6 is running')
          return new Promise((resolve, reject)=>{
              setTimeout(()=>{
                console.log('task6');
                 return resolve('task6')
            }, 3000);
      
          })
        }




export class TaskQueuePC {
    constructor (concurrency) {
        this.taskQueue = []
        this.consumerQueue = []
        // spawn consumers
        for (let i = 0; i < concurrency; i++) {
            this.consumer()
        }
    }

    async consumer () {
        while (true) {
          try {
              const task = await this.getNextTask()
              await task()
              // task() will stop the while and freeze the function if new Promise don't make resolve
          } catch (err) {
              console.error(err)
              }
        }
    }

    async getNextTask () {
        return new Promise((resolve) => {
            if (this.taskQueue.length !== 0) {
                return resolve(this.taskQueue.shift())
            }
        this.consumerQueue.push(resolve)
        })
    }

    runTask (task) {
        return new Promise((resolve, reject) => {
            const taskWrapper = () => {
                const taskPromise = task()
                // taskPromise.then(resolve, reject)
                return taskPromise
              }

            if (this.consumerQueue.length !== 0) {
                const consumer = this.consumerQueue.shift();
                consumer(taskWrapper);
            } else {
                this.taskQueue.push(taskWrapper)
            }
        })
    }
}

let tasks = [task1, task2, task3, task4, task5];

let taskQueue = new TaskQueuePC(3);

for(let task of tasks){
    taskQueue.runTask(task);
}


