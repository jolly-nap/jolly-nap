var humanDateString;

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
    minutes = (value.substr(3, 5) / 10) * 10;
    return findBedtime(hours, minutes);
  });
  sleepNow = function() {
    var $wakeTimes, i, minutes, now, sleepPrep, wakeTime, wakeTimeStrings, wakeTimes, _i, _j, _len;
    $wakeTimes = $('#wake-times');
    sleepPrep = 14;
    now = new Date();
    now.setMinutes(Math.round(now.getMinutes() / 10) * 10);
    wakeTimes = [];
    for (i = _i = 0; _i < 6; i = ++_i) {
      minutes = now.getMinutes();
      if (i === 0) {
        now.setMinutes(minutes + sleepPrep + 90);
      } else {
        now.setMinutes(minutes + 90);
      }
      wakeTimes.push(humanDateString(now));
    }
    $wakeTimes.html('');
    wakeTimeStrings = "";
    for (i = _j = 0, _len = wakeTimes.length; _j < _len; i = ++_j) {
      wakeTime = wakeTimes[i];
      wakeTimeStrings = ("<div class='time-container'>          <div class='wake-time' data-wellness='" + i + "'>" + wakeTime + "</div>         </div>") + wakeTimeStrings;
    }
    return $('.site-footer').fadeOut(150, function() {
      $wakeTimes.append(wakeTimeStrings);
      $(".wrapper").addClass("no-footer");
      return $(".wake-time-explanation, .wake-up-at, .share").fadeIn(150, function() {
        return scrollTo('.wake-up-at');
      });
    });
  };
  findBedtime = function(wakeHour, wakeMinute) {
    var $bedTimes, bedTime, bedTimeStrings, bedTimes, compensatedWakeTime, i, sleepCycle, sleepWarmup, wakeTime, _i, _j, _len;
    $bedTimes = $('#bed-times');
    sleepCycle = 60000 * 90;
    sleepWarmup = 60000 * 15;
    wakeMinute = Math.round(wakeMinute / 10) * 10;
    wakeTime = new Date();
    wakeTime.setHours(wakeHour);
    wakeTime.setMinutes(wakeMinute);
    bedTimes = [];
    for (i = _i = 0; _i < 6; i = ++_i) {
      wakeTime.setTime(wakeTime.getTime() - sleepCycle);
      compensatedWakeTime = new Date(wakeTime.getTime());
      compensatedWakeTime.setTime(compensatedWakeTime.getTime() - sleepWarmup);
      if (!(i < 2)) {
        bedTimes.push(humanDateString(compensatedWakeTime));
      }
    }
    $bedTimes.html('');
    bedTimeStrings = "";
    for (i = _j = 0, _len = bedTimes.length; _j < _len; i = ++_j) {
      bedTime = bedTimes[i];
      bedTimeStrings = ("<div class='time-container'>          <div class='bed-time' data-wellness='" + (i + 2) + "'>" + bedTime + "</div>         </div>") + bedTimeStrings;
    }
    return $('.get-up.blurb').fadeOut(150, function() {
      $bedTimes.append(bedTimeStrings);
      return $(".sleep-at, .bed-time-explanation.blurb, .share").fadeIn(150, function() {
        return scrollTo(".wake-up-container");
      });
    });
  };
  return scrollTo = function(element) {
    return $('body').animate({
      scrollTop: $(element).offset().top - 10
    }, 150);
  };
});

humanDateString = function(date) {
  var am, hours, meridian, minutes;
  hours = date.getHours();
  minutes = date.getMinutes();
  am = true;
  if (hours > 12) {
    am = false;
    hours -= 12;
  } else if (hours === 12) {
    am = false;
  } else if (hours === 0) {
    hours = 12;
  }
  if (hours < 10) {
    hours = '0' + hours;
  }
  meridian = am ? 'AM' : 'PM';
  return "" + hours + ":" + minutes + " " + meridian;
};
