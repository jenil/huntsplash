<template>
<div id="app">
    <bg />
    <sidebar />
</div>
</template>

<script>
import bg from './bg.vue'
import sidebar from './ph-bar.vue'

export default {
  name: 'app',
  components: {
    bg,
    sidebar
  },
  created() {
    console.info('VERSION', process.env.VERSION);
  }
}
</script>

<style lang="scss" module>
@import "../scss/proxima-nova";

body,
html {
    height: 100%;
}

body {
  background-color: #333;
  font-family: 'proxima-nova', 'Arial', sans-serif;
  color: white;
  text-shadow: 0 0 1px rgba(0, 0, 0, 0.7);
  padding: 0;
  margin: 0;
  font-size: 16px;
}

* {
  box-sizing: border-box;
}

a {
  color: rgb(213, 181, 255);
  text-decoration: none;
}

p {
  margin: 0;
}

:global(#app) {
    height: 100%;
    position: relative;
}
</style>
