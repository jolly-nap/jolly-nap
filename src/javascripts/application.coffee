$("#sleep-now").click (e) ->
  e.preventDefault()
  sleepNow()

$("#new-bedtime").submit (e) ->
  e.preventDefault()
  console.log e


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
      "<input class='wake-time' type='time' value='#{wakeTime}' disabled data-wellness='#{i}'/>")
  console.log wakeTimes
