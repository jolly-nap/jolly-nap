
window.addEventListener("load", function() {
  return setTimeout(function() {
    return window.scrollTo(0, 1);
  }, 0);
});

$(function() {
  var findBedtime, scrollTo, sleepNow;
  $("#sleep-now").click(function(e) {
    e.preventDefault();
    return sleepNow();
  });
  $('#calculate-wake-time').click(function(e) {
    e.preventDefault();
    return $('#wake-up-time').focus();
  });
  $('#wake-up-time').change(function(e) {
    var $input, hours, minutes, value;
    $input = $(e.target);
    value = $input.val();
    hours = value.substr(0, 2);
    minutes = Math.round(value.substr(3, 5) / 10) * 10;
    return findBedtime(hours, minutes);
  });
  sleepNow = function() {
    var $wakeTimes, i, minutes, now, sleepPrep, wakeTime, wakeTimeStrings, wakeTimes, _i, _len;
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
    wakeTimeStrings = "";
    for (i = _i = 0, _len = wakeTimes.length; _i < _len; i = ++_i) {
      wakeTime = wakeTimes[i];
      wakeTimeStrings += "<div>          <input class='wake-time' type='time' value='" + wakeTime + "' disabled data-wellness='" + i + "'/>         </div>";
    }
    return $('.btn-container').fadeOut(150, function() {
      $wakeTimes.append(wakeTimeStrings);
      return $(".wake-time-explanation, .wake-up-at, .share").fadeIn(150, function() {
        return scrollTo('.wake-up-at');
      });
    });
  };
  findBedtime = function(wakeHour, wakeMinute) {
    var $bedTimes, bedTime, bedTimeStrings, bedTimes, i, sleepCycle, wakeTime, _i, _len;
    $bedTimes = $('#bed-times');
    sleepCycle = 60000 * 90;
    wakeTime = new Date();
    wakeTime.setHours(wakeHour);
    wakeTime.setMinutes(wakeMinute);
    bedTimes = [];
    i = 0;
    while (i < 6) {
      wakeTime.setTime(wakeTime.getTime() - sleepCycle);
      if (!(i < 2)) {
        bedTimes.push(wakeTime.toTimeString().substr(0, 5));
      }
      i++;
    }
    bedTimes.reverse();
    $bedTimes.html('');
    bedTimeStrings = "";
    for (i = _i = 0, _len = bedTimes.length; _i < _len; i = ++_i) {
      bedTime = bedTimes[i];
      bedTimeStrings += "<div>          <input class='bed-time' type='time' value='" + bedTime + "' disabled data-wellness='" + (i + 2) + "'/>         </div>";
    }
    return $('.get-up.blurb').fadeOut(150, function() {
      $bedTimes.append(bedTimeStrings);
      return scrollTo(".wake-up-container");
    });
  };
  return scrollTo = function(element) {
    return $('body').animate({
      scrollTop: $(element).offset().top - 10
    }, 150);
  };
});
