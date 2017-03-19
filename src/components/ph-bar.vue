<template>
<div :class="$style.wrapper" ref="scrollContainer">
  <div :class="$style.sidebar">
    <a :class="$style.header" href="https://producthunt.com">
      <svg class="logo" width="64" height="64" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><circle fill="#DA552F" cx="15" cy="15" r="15"/><path d="M13.944 21v-3.808h2.754c2.55 0 3.944-1.717 3.944-3.757 0-2.057-1.394-3.774-3.944-3.774H11.02V21h2.924zm2.312-6.358h-2.312v-2.43h2.312c.782 0 1.41.44 1.41 1.223 0 .765-.628 1.207-1.41 1.207z" fill="#fff"/></g></svg>
      <section>
        <h3>Product Hunt</h3>
        <h5>The best new products, every day</h5>
      </section>
    </a>
    <div :class="$style.list">
      <product v-for="p in posts" :key="p.id" :post="p" />
      <br v-if="loading">
      <a :class="$style.more" v-if="posts.length" href="https://producthunt.com">Keep hunting</a>
      <div :class="$style.loader" v-if="loading"></div>
    </div>
  </div>
</div>
</template>

<script>
import product from './product.vue'

const base = 'https://api.producthunt.com/v1';

export default {
  name: 'sidebar',
  components: {
    product
  },
  data() {
    return {
      posts: localStorage.posts ? JSON.parse(localStorage.posts) : [],
      loading: false
    }
  },
  created() {
    if (localStorage.phToken) {
      console.log('[PH] phToken cache hit');
      this.getPosts();
    } else {
      console.log('[PH] phToken cache miss');
      this._getAuth();
    }
  },
  methods: {
    _getAuth() {
      this.$http.post(base + '/oauth/token', {
          client_id: process.env.PH_KEY,
          client_secret: process.env.PH_SECRET,
          grant_type: 'client_credentials'
        })
        .then(response => {
          localStorage.phToken = response.body.access_token;
        }, err => {
          localStorage.phToken = process.env.PH_TOKEN;
          console.error('[PH] _getAuth:', err.body);
        }).then(() => {
          if (localStorage.phToken) {
            this.getPosts();
          }
        });
    },
    getPosts() {
      if (!localStorage.phToken) {
        this._getAuth();
      }
      console.log('[PH] getting posts...');
      if (!this.posts.length) {
        this.loading = true;
      }
      this.$http.get(`${base}/posts?days_ago=0`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.phToken
        }
      }).then(response => {
        // console.log('[PH] PH posts:', response.body);
        this.loading = false;
        this.posts = response.body.posts;
        localStorage.posts = JSON.stringify(response.body.posts);
        console.info('[PH] done. all set!');
      }, err => {
        console.error('[PH] error:', err);
        this.loading = false;
        if (err.status == 401) {
          delete localStorage.phToken;
        }
      });
    }
  }
}
</script>

<style lang="scss" module>
.wrapper {
    position: fixed;
    width: 100%;
    height: 100%;
    right: 0;
    top: 0;

    overflow-y: scroll;

    background-color: rgba(#000, 0.2);
    background: linear-gradient(to right, rgba(0,0,0,0) 40%,rgba(0,0,0,0.6) 100%);
}
.sidebar {
    position: absolute;
    right: 0;
    top: 0;
    width: 20rem;
    margin: 0.5rem 0rem;
}
.header {
    display: flex;
    color: white;
    cursor: pointer;

    svg {
        width: 3rem;
        height: 3rem;
    }

    > section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 0.5rem;
        h3,
        h5 {
            margin: 0;
        }
    }
}
.list {
    margin: 0.5rem 0;
}
.loader {
  width: 4rem;
  min-width: 4rem;
  height: 4rem;
  min-height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  border-radius: 50%;
  border-top: 4px solid rgba(255, 255, 255, 0);
  border-right: 4px solid rgba(255, 255, 255, 1);
  border-bottom: 4px solid rgba(255, 255, 255, 1);
  border-left: 4px solid rgba(255, 255, 255, 1);
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: circle-loader-spin 1.2s infinite linear;
  animation: circle-loader-spin 1.2s infinite linear;
}
@keyframes circle-loader-spin {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
.more {
  display: block;
  padding: 1rem;
  text-align: center;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 1px;
  text-decoration: underline;
}
</style>
