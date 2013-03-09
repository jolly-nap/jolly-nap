
window.addEventListener("load", function() {
  return setTimeout(function() {
    return window.scrollTo(0, 1);
  }, 0);
});

$(function() {
  var scrollTo, sleepNow;
  $("#sleep-now").click(function(e) {
    e.preventDefault();
    return sleepNow();
  });
  $('#calculate-wake-time').click(function(e) {
    e.preventDefault();
    return $('#wake-up-time').focus();
  });
  $('#wake-up-time').change(function(e) {
    var $input;
    $input = $(e.target);
    return $('.wake-up-container').toggleClass('set');
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
      $wakeTimes.append("<div>          <input class='wake-time' type='time' value='" + wakeTime + "' disabled data-wellness='" + i + "'/>         </div>");
    }
    $('.btn-container').fadeOut();
    return $(".wake-time-explanation, .wake-up-at, .share").fadeIn(function() {
      return scrollTo('.wake-up-at');
    });
  };
  return scrollTo = function(element) {
    return $('body').animate({
      scrollTop: $(element).offset().top - 10
    }, 200);
  };
});
