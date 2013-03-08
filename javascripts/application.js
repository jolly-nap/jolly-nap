var updateClock;

$(function() {
  var $clock;
  $clock = $('#active.clock');
  updateClock($clock);
  return setInterval(function() {
    return updateClock($clock);
  }, 1000);
});

updateClock = function($clock) {
  var $clockColon, $clockHours, $clockMeridian, $clockMinutes, $clockSeconds, colon, date, hours, meridian, minutes, seconds;
  $clockHours = $clock.children('.hours');
  $clockMinutes = $clock.children('.minutes');
  $clockSeconds = $clock.children('.seconds');
  $clockMeridian = $clock.children('.meridian');
  $clockColon = $clock.children('.colon');
  date = new Date();
  hours = date.getHours();
  minutes = date.getMinutes();
  seconds = date.getSeconds();
  meridian = hours >= 12 ? 'PM' : 'AM';
  hours = hours > 12 ? hours - 12 : hours;
  hours = hours === 0 ? 12 : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  colon = seconds % 2 === 0 ? '&#58;' : '&nbsp;';
  $clockMeridian.html(meridian);
  $clockSeconds.html(seconds);
  $clockMinutes.html(minutes);
  $clockHours.html(hours);
  return $clockColon.html(colon);
};
