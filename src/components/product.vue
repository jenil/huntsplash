<template>
<a :class="$style.post" :href="post.redirect_url" target="_blank">
  <div :class="$style.thumb">
    <img :src="post.thumbnail.image_url" alt="">
  </div>
  <div :class="$style.content">
    <h4>{{post.name}}</h4>
    <p>{{post.tagline}}</p>
    <div :class="$style.meta">
      <svg height="8" viewBox="0 0 15 14" xmlns="http://www.w3.org/2000/svg"><title>Rectangle 24</title><g fill="none" fill-rule="evenodd"><g fill="#fff"><g><g><path d="M0 14h15L7.17.103 0 14z"/></g></g></g></g></svg>
      <small>{{post.votes_count}}</small> &nbsp;&nbsp;
      <svg height="8" viewBox="0 0 16 14" xmlns="http://www.w3.org/2000/svg"><title>Oval 28</title><g fill="none" fill-rule="evenodd"><g fill="#fff"><g><g><path d="M1.87 10.06C.702 8.996 0 7.623 0 6.125 0 2.742 3.582 0 8 0s8 2.742 8 6.125-3.582 6.125-8 6.125c-1.098 0-2.145-.17-3.097-.476-1.56.845-4.607 1.962-4.607 1.962s1.02-2.298 1.573-3.676z"/></g></g></g></g></svg>
      <small>{{post.comments_count}}</small>
    </div>
  </div>
</a>
</template>

<script>
export default {
  name: 'product',
  props: ['post'],
  methods: {
    open() {
      window.location.href = this.post.redirect_url;
    }
  }
}
</script>

<style lang="scss" module>
.post {
    display: flex;
    padding: 1rem;
    align-items: center;
    cursor: pointer;
    transition: all 300ms ease-in;
    &:not(:last-child) {
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }
    &:first-child {
        border-top: 3px solid rgba(255, 255, 255, 0.2);
    }
    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
}
.thumb {
    width: 64px;
    height: 64px;
    overflow: hidden;
    position: relative;
    margin-right: 0.5rem;
    flex: 0 0 64px;
    background-color: white;
    cursor: pointer;

    img {
        width: 100%;
        height: auto;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}
.content {
    cursor: pointer;
    h4 {
        margin: 0;
    }
    p {
        font-size: 0.875rem;
    }
    small {
        font-size: 0.75rem;
    }
}
</style>
