$ ->
  $clock = $('#active.clock')

  # Don't want to render nothing in the first second.
  updateClock($clock)


  setInterval ->
    updateClock($clock)
  , 1000

updateClock = ($clock) ->
  $clockHours    = $clock.children('.hours')
  $clockMinutes  = $clock.children('.minutes')
  $clockSeconds  = $clock.children('.seconds')
  $clockMeridian = $clock.children('.meridian')
  $clockColon    = $clock.children('.colon')

  date = new Date()

  hours = date.getHours()
  minutes = date.getMinutes()
  seconds = date.getSeconds()

  meridian = if hours >= 12 then 'PM' else 'AM'

  hours = if hours > 12 then hours - 12 else hours
  hours = if hours == 0 then 12 else hours

  minutes = if minutes < 10 then '0' + minutes else minutes
  seconds = if seconds < 10 then '0' + seconds else seconds
  colon = if seconds % 2 == 0 then '&#58;' else '&nbsp;'

  $clockMeridian.html meridian
  $clockSeconds.html seconds
  $clockMinutes.html minutes
  $clockHours.html hours
  $clockColon.html colon
