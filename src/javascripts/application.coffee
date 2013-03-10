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
    minutes = Math.round(value.substr(3,5) / 10) * 10
    findBedtime hours, minutes

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
    wakeTimeStrings = ""
    for wakeTime, i in wakeTimes
      wakeTimeStrings +=
        "<div>
          <input class='wake-time' type='time' value='#{wakeTime}' disabled data-wellness='#{i}'/>
         </div>"

    $('.btn-container').fadeOut 150, ->
      $wakeTimes.append(wakeTimeStrings)
      $(".wake-time-explanation, .wake-up-at, .share").fadeIn 150, ->
        scrollTo('.wake-up-at')

  findBedtime = (wakeHour, wakeMinute) ->
    $bedTimes = $('#bed-times')

    sleepCycle = 60000 * 90 # 90 minutes in milliseconds

    wakeTime = new Date()
    wakeTime.setHours(wakeHour)
    wakeTime.setMinutes(wakeMinute)

    bedTimes = []

    i = 0
    while i < 6
      wakeTime.setTime(wakeTime.getTime() - sleepCycle)

      # We don't need the first 2 cycles
      bedTimes.push(wakeTime.toTimeString().substr(0,5)) unless i < 2
      i++

    bedTimes.reverse() # The bedtimes are backwards.

    $bedTimes.html('')
    bedTimeStrings = ""
    for bedTime, i in bedTimes
      bedTimeStrings +=
        "<div>
          <input class='bed-time' type='time' value='#{bedTime}' disabled data-wellness='#{i+2}'/>
         </div>"

    $('.get-up.blurb').fadeOut 150, ->
      $bedTimes.append(bedTimeStrings)
      scrollTo(".wake-up-container")

  scrollTo = (element) ->
    $('body').animate { scrollTop: $(element).offset().top - 10}, 150