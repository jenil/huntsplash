<template>
<div id="options">
  <dl>
    <dt>Sidebar position</dt>
    <dd>
      <label for="left">
        <input type="radio" v-model="sidebarPosition" id="left" value="left"> Left
      </label>
      <label for="right">
        <input type="radio" v-model="sidebarPosition" id="right" value="right"> Right
      </label>
    </dd>
    <dt>Refresh photo</dt>
    <dd>
      <select for="refresh" v-model="refreshRate">
        <option value="0.25">every 15 minutes</option>
        <option value="0.5">every 30 minutes</option>
        <option value="1">every 60 minutes</option>
        <option value="6">every 6 hours</option>
        <option value="12">every 12 hours</option>
        <option value="24">every 24 hours</option>
      </select>
    </dd>
  </dl>
  <small v-if="status">{{status}}</small>
</div>
</template>

<script>
export default {
  data() {
    return {
      sidebarPosition: '',
      refreshRate: '',
      status: ''
    }
  },
  mounted() {
    console.log('loading options..');
    if (chrome.storage) {
      chrome.storage.sync.get({
        sidebarPosition: 'right',
        refreshRate: '24'
      }, function(options) {
        this.sidebarPosition = options.sidebarPosition;
        this.refreshRate = options.refreshRate;
        console.log(this.sidebarPosition)
        console.log(this.refreshRate)
      }.bind(this));
    }
  },
  watch: {
    sidebarPosition: function(neu, old) {
      const vm = this;
      if (chrome.storage && old) {
        chrome.storage.sync.set({
          sidebarPosition: vm.sidebarPosition,
        }, function() {
          console.log('Saved!');
          vm.status = 'Options saved.';
          setTimeout(function() {
            vm.status = '';
          }, 1000);
        });
      }
    },
    refreshRate: function(neu, old) {
      const vm = this;
      if (chrome.storage && old) {
        chrome.storage.sync.set({
          refreshRate: vm.refreshRate,
        }, function() {
          console.log('Saved!');
          vm.status = 'Options saved.';
          setTimeout(function() {
            vm.status = '';
          }, 1000);
        });
      }
    }
  }
}
</script>

<style lang="scss">
body {
    font-family: 'Proxima Nova', -apple-system, BlinkMacSystemFont, Avenir, "Avenir Next", "Segoe UI", sans-serif;
    color: #333;
    padding: 0;
    margin: 0;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
}

* {
    box-sizing: border-box;
}

#options {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 1rem;
}

dt {
    font-weight: bold;
    margin-bottom: 0.5rem;
}

dd {
    margin-left: 0;
    margin-bottom: 1rem;
}
dd:last-child {
    margin-bottom: 0;
}
label + label {
    margin-left: 1rem;
}
small {
    color: rgb(0, 168, 88);
}
</style>
