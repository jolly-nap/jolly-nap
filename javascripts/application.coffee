$ ->
  $clockHours   = $('#active.clock .hours')
  $clockMinutes = $('#active.clock .minutes')
  $clockSeconds = $('#active.clock .seconds')
  $clockMeridian = $('#active.clock .meridian')


  setInterval ->
    date = new Date()

    hours = date.getHours()
    minutes = date.getMinutes()
    seconds = date.getSeconds()

    meridian = if hours >= 12 then 'PM' else 'AM'

    hours = if hours > 12 then hours - 12 else hours
    hours = if hours == '00' then 12 else hours

    seconds = if seconds < 10 then '0' + seconds else seconds

    $clockMeridian.text meridian
    $clockSeconds.text seconds
    $clockMinutes.text minutes
    $clockHours.text hours
  , 1000