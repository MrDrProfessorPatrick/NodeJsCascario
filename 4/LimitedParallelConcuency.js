let task1 = function(cb){
    console.log('task1 is running')
      setTimeout(()=>{
        console.log('task1');
        cb()
  
      }, 1000);
    };
      
    let task2 = function(cb){
    console.log('task2 is running')
      setTimeout(()=>{
        console.log('task2');
        cb()
  
      }, 1000);
    };
      
    let task3 = function(cb){
    console.log('task3 is running')
        setTimeout(()=>{
        console.log('task3');
        cb()
  
      }, 3000);
    }
    
      let task4 = function(cb){
    console.log('task4 is running')
      
      setTimeout(()=>{
        console.log('task4');
        cb()
  
      }, 3000);
    }
    
      let task5 = function(cb){
    console.log('task5 is running')
      
      setTimeout(()=>{
        console.log('task5');
        cb()
  
      }, 3000);
    }
    
      let task6 = function(cb){
    console.log('task6 is running')
      setTimeout(()=>{
        console.log('task6');
        cb()
  
      }, 3000);
    }
  
  let list = [task1, task2, task3, task4, task5, task6];
  
  function runNext(tasks){
    const concurrency = 3
    let running = 0
    let completed = 0
    let index = 0
  
    function next () {
      while (running < concurrency && index < tasks.length) {
        const task = tasks[index++]
        task(() => {
          if (++completed === tasks.length) {
            return finish()
          }
          running--
          console.log('running', running)
          next()
        })
        running++
      }
    }
    next()
  
    function finish() {
      console.log('FINISHED')
      // is never returned by runNext
      return 'FINISHED RETURNED'
    }
  }
  
  runNext(list)
  
  