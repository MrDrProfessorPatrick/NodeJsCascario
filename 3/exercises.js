import { EventEmitter } from "events";

function ticker(n, cb) {
  let eventsEmitted = 0;
  let eventEmitter = new EventEmitter();
  let timeLeft = n;

  process.nextTick(() => {
    eventEmitter.emit("tick");
  });

  setTimeout(function outerTick() {
    eventEmitter.emit("tick");
    eventsEmitted += 1;
    let timerId = setTimeout(outerTick, 1000);
    timeLeft -= 1000;
    if (timeLeft <= 0) {
      clearTimeout(timerId);
      setTimeout(() => {
        cb(eventsEmitted);
      }, 0);
    }
  }, n);

  return eventEmitter;
}

ticker(3000, (n) => {
  console.log("done", `${n} times`);
}).on("tick", () => console.log("TICK"));
