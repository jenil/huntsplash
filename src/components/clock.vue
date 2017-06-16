<!-- From https://github.com/dangvanthanh/vue-clock -->

<template>
  <div class="center">
    <div class="clock">
      <div class="clock__hours">{{hours}}</div>
      <div class="clock__minutes">:{{minutes}}</div>
      <span class="clock__hourtime">{{hourtime}}</span>
      <div class="clock__greeting">{{greeting}}</div>
    </div>
  </div>
</template>

<script>
import { getHourTime, getZeroPad, getGreeting } from '../filters'
export default {
  data () {
    return {
      hours: '',
      minutes: '',
      seconds: '',
      hourtime: ''
    }
  },
  created() {
    this.updateDateTime();
  },
  mounted () {
    setInterval(this.updateDateTime, 1000)
  },
  methods: {
    updateDateTime () {
      let now = new Date()
      this.hours = now.getHours()
      this.minutes = getZeroPad(now.getMinutes())
      this.seconds = getZeroPad(now.getSeconds())
      this.hourtime = getHourTime(this.hours)
      this.greeting = getGreeting(this.hours)
      this.hours = this.hours % 12 || 12
    }
  }
}
</script>

<style>
.center {
    position: fixed;
    bottom: 0.5rem;
    left: 50%;
    -webkit-transform: translate(-50%, 0%);
}
.clock {
  display: inline-block;
  text-align: center;
}
.clock__hours,
.clock__minutes,
.clock__seconds,
.clock__hourtime {
  display: inline-block;
  color: #fff;
  font-size: 5rem;
  font-weight: 500;
  line-height: 1;
  padding: 0 0;
  text-align: center;
  position: relative;
}
.clock__greeting {
  display: block;
  color: #fff;
  font-size: 1.5rem;
  font-weight: 500;
  padding: 0 0;
  text-align: center;
  position: relative;
}
.clock__hours {
}
.clock__minutes {
}
.clock__seconds {
}
.clock__hourtime {
  font-size: 1.0rem;
}

</style>
