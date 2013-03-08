var sleepNow;

$("#sleep-now").click(function(e) {
  e.preventDefault();
  return sleepNow();
});

$("#new-bedtime").submit(function(e) {
  e.preventDefault();
  return console.log(e);
});

sleepNow = function() {
  var $wakeTimes, i, minutes, now, sleepPrep, wakeTime, wakeTimes, _i, _len;
  $wakeTimes = $('#wake-times');
  sleepPrep = 14;
  now = new Date();
  wakeTimes = [];
  i = 0;
  while (i < 6) {
    minutes = now.getMinutes();
    if (i === 0) {
      now.setMinutes(minutes + sleepPrep + 90);
    } else {
      now.setMinutes(minutes + 90);
    }
    wakeTimes.push(now.toTimeString().substr(0, 5));
    i++;
  }
  $wakeTimes.html('');
  for (i = _i = 0, _len = wakeTimes.length; _i < _len; i = ++_i) {
    wakeTime = wakeTimes[i];
    $wakeTimes.append("<input class='wake-time' type='time' value='" + wakeTime + "' disabled data-wellness='" + i + "'/>");
  }
  return console.log(wakeTimes);
};
