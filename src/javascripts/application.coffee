window.addEventListener "load", ->
  setTimeout ->
    window.scrollTo(0, 1)
  , 0
$ ->
  $("#sleep-now").click (e) ->
    e.preventDefault()
    sleepNow()

  $('#calculate-wake-time').click (e) ->
    e.preventDefault()
    $('#wake-up-time').focus()

  $('#wake-up-time').change (e) ->
    $input = $(e.target)
    value = $input.val()

    hours = value.substr(0,2)
    minutes = (value.substr(3,5) / 10) * 10
    findBedtime hours, minutes

  sleepNow = ->
    $wakeTimes = $('#wake-times')
    # 14 minutes to sleep.
    sleepPrep = 14

    now = new Date()
    now.setMinutes(Math.round(now.getMinutes() / 10) * 10)
    wakeTimes = []

    for i in [0...6]
      minutes = now.getMinutes()

      if i == 0
        now.setMinutes(minutes + sleepPrep + 90)
      else
        now.setMinutes(minutes + 90)
      wakeTimes.push(humanDateString(now))

    $wakeTimes.html('')
    wakeTimeStrings = ""
    for wakeTime, i in wakeTimes
      wakeTimeStrings =
        "<div class='time-container'>
          <div class='wake-time' data-wellness='#{i}'>#{wakeTime}</div>
         </div>" + wakeTimeStrings

    $('.site-footer').fadeOut 150, ->
      $wakeTimes.append(wakeTimeStrings)
      $(".wrapper").addClass("no-footer") # Remove excess padding from viewport.
      $(".wake-time-explanation, .wake-up-at, .share").fadeIn 150, ->
        scrollTo('.wake-up-at')

  findBedtime = (wakeHour, wakeMinute) ->
    $bedTimes = $('#bed-times')

    # Sleep cycles are 90 minutes. 14 minutes are needed to fall asleep.
    sleepCycle  = 60000 * 90 # Minutes to milliseconds
    sleepWarmup = 60000 * 15
    wakeMinute = Math.round(wakeMinute / 10) * 10

    wakeTime = new Date()
    wakeTime.setHours(wakeHour)
    wakeTime.setMinutes(wakeMinute)

    bedTimes = []

    for i in [0...6]
      # Subtract the cycle.
      wakeTime.setTime(wakeTime.getTime() - sleepCycle)
      compensatedWakeTime = new Date(wakeTime.getTime())

      # Subtract the warmup.
      compensatedWakeTime.setTime(compensatedWakeTime.getTime() - sleepWarmup)

      # We don't need the first 2 cycles
      bedTimes.push(humanDateString(compensatedWakeTime)) unless i < 2


    $bedTimes.html('')
    bedTimeStrings = ""
    for bedTime, i in bedTimes
      bedTimeStrings =
        "<div class='time-container'>
          <div class='bed-time' data-wellness='#{i+2}'>#{bedTime}</div>
         </div>" + bedTimeStrings

    $('.get-up.blurb').fadeOut 150, ->
      $bedTimes.append(bedTimeStrings)
      $(".sleep-at, .bed-time-explanation.blurb, .share").fadeIn 150, ->
        scrollTo(".wake-up-container")

  scrollTo = (element) ->
    $('body').animate { scrollTop: $(element).offset().top - 10}, 150


humanDateString = (date) ->
  hours = date.getHours()
  minutes = date.getMinutes()
  am = true

  if hours > 12
    am = false
    hours -= 12
  else if hours == 12
    am = false
  else if hours == 0
    hours = 12

  if hours < 10
    hours = '0' + hours

  if minutes < 10
    minutes = '0' + minutes

  meridian = if am then 'AM' else 'PM'

  return "#{hours}:#{minutes} #{meridian}"
