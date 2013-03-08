window.addEventListener "load", ->
  setTimeout ->
    window.scrollTo(0, 1)
  , 0

$("#sleep-now").click (e) ->
  $(@).parent('.btn-container').slideUp()
  e.preventDefault()
  sleepNow()

$('#calculate-wake-time').click (e) ->
  e.preventDefault()
  $('#wake-up-time').focus()

$('#wake-up-time').change (e) ->
  $input = $(e.target)
  $('.wake-up-container').toggleClass('set')

sleepNow = ->
  $wakeTimes = $('#wake-times')
  # 14 minutes to sleep.
  sleepPrep = 14

  now = new Date()
  wakeTimes = []

  i = 0
  while i < 6
    minutes = now.getMinutes()
    if i == 0
      now.setMinutes(minutes + sleepPrep + 90)
    else
      now.setMinutes(minutes + 90)

    wakeTimes.push(now.toTimeString().substr(0,5))
    i++

  $wakeTimes.html('')
  for wakeTime, i in wakeTimes
    $wakeTimes.append(
      "<div>
        <input class='wake-time' type='time' value='#{wakeTime}' disabled data-wellness='#{i}'/>
       </div>")

  $(".wake-time-explanation, .bed-time").fadeIn()
  # console.log wakeTimes
