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
  </dl>
  <small v-if="status">{{status}}</small>
</div>
</template>

<script>
export default {
  data() {
    return {
      sidebarPosition: '',
      status: ''
    }
  },
  mounted() {
    console.log('loading options..');
    if (chrome.storage) {
      chrome.storage.sync.get({
        sidebarPosition: 'right'
      }, function(options) {
        this.sidebarPosition = options.sidebarPosition;
        console.log(this.sidebarPosition)
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
    }
  }
}
</script>

<style lang="scss">
body {
    font-family: 'Proxima Nova',  -apple-system, BlinkMacSystemFont, Avenir, "Avenir Next", "Segoe UI", sans-serif;
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
