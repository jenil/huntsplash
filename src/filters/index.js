// From https://github.com/dangvanthanh/vue-clock

export function getHourTime (h) {
  return h >= 12 ? 'PM' : 'AM'
}

export function getZeroPad (n) {
  return (parseInt(n, 10) >= 10 ? '' : '0') + n
}

export function getGreeting(h) {
    // 4-12pm morning, 12-6pm afternoon, 6-4am evening
    var greeting = ""
    if (h < 4) {
      greeting = "Good Evening"
    } else if (h < 12) {
      greeting = "Good Morning"
    } else if (h < 18) {
      greeting = "Good Afternoon"
    } else {
      greeting = "Good Evening"
    }
    return greeting
}
