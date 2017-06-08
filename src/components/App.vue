<template>
<div id="app">
  <bg :position="sidebarPosition == 'right' ? 'left' : 'right'" :rate="refreshRate" />
  <sidebar :position="sidebarPosition" />
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
  data() {
    return {
      sidebarPosition: localStorage.sidebarPosition || 'left',
      refreshRate: localStorage.refreshRate || '24'
    }
  },
  created() {
    console.info('VERSION', process.env.VERSION);
    if (localStorage.version && process.env.VERSION != localStorage.version) {
      console.info('[App] There is an updated, clearing storage...');
      localStorage.clear();
    }
    localStorage.version = process.env.VERSION;

    if (chrome.storage) {
      console.log('[App] syncing ⚙️...');
      chrome.storage.sync.get({
        sidebarPosition: 'right',
        refreshRate: '24'
      }, function(options) {
        this.sidebarPosition = options.sidebarPosition;
        this.refreshRate = options.refreshRate;
        localStorage.sidebarPosition = options.sidebarPosition;
        localStorage.refreshRate = options.refreshRate;
        console.info('[App] ⚙️ synced!');
      }.bind(this));
    }

    (function(i, s, o, g, r, a, m) {
      i['GoogleAnalyticsObject'] = r;
      i[r] = i[r] || function() {
        (i[r].q = i[r].q || []).push(arguments)
      }, i[r].l = 1 * new Date();
      a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m)
    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga'); // Note: https protocol here
    ga('create', 'UA-24419037-8', 'auto');
    ga('set', 'checkProtocolTask', function() {}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
    ga('require', 'displayfeatures');
    ga('send', 'pageview', '/newtab.html');
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
    color: rgba(#fff, 0.9);
    text-decoration: none;
    &:hover {
        color: rgba(#fff, 1);
    }
}

p {
    margin: 0;
}

:global(#app) {
    height: 100%;
    position: relative;
}
</style>
