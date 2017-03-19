<template>
<div :id="$style.bg" v-if="BG" :style="{ 'background-color': imgColor}">
  <img :src="BG" alt="" @load="bgLoaded = true" :class="{ [$style.loaded]: bgLoaded }">
  <div :class="$style.meta" v-if="author.name">
    <svg width="16px" viewBox="0 0 104 90" version="1.1" aria-label="Unsplash" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <title>Unsplash</title>
        <defs></defs>
        <g id="365-photos-later" sketch:type="MSLayerGroup" transform="translate(1.000000, 0.000000)" fill="#ffffff">
            <path d="M51.2,36.1 C42.7,36.1 35.7,43 35.7,51.6 C35.7,60.2 42.7,67 51.2,67 C59.7,67 66.7,60.1 66.7,51.5 C66.7,42.9 59.8,36.1 51.2,36.1 L51.2,36.1 Z M89,13.7 L77,13.7 L74.3,6.4 C72.9,2.9 68.7,0 65,0 L37.5,0 C33.7,0 29.6,2.9 28.2,6.4 L25.5,13.7 L13.5,13.7 C5.9,13.7 -0.2,19.9 -0.2,27.4 L-0.2,75.5 C-0.2,83.1 6,89.2 13.5,89.2 L89,89.2 C96.6,89.2 102.7,83 102.7,75.5 L102.7,27.5 C102.8,19.9 96.6,13.7 89,13.7 L89,13.7 Z M51.2,75.6 C37.9,75.6 27.2,64.8 27.2,51.6 C27.2,38.4 38,27.6 51.2,27.6 C64.5,27.6 75.2,38.4 75.2,51.6 C75.2,64.8 64.5,75.6 51.2,75.6 L51.2,75.6 Z" id="Shape" sketch:type="MSShapeGroup"></path>
        </g>
    </svg>
    <p>Photo by <a :href="author.link" title="Unsplash">{{ author.name }}</a> </p>
  </div>
</div>
</template>

<script>
export default {
  name: 'bg',
  created() {
    this.checkImage();
  },
  data() {
    return {
      bgLoaded: false,
      BG: localStorage.BG || '',
      imgColor: localStorage.imgColor || '#333',
      author: localStorage.author ? JSON.parse(localStorage.author) : {}
    }
  },
  methods: {
    checkImage() {
      let then = localStorage.tsUpdatedImage ? JSON.parse(localStorage.tsUpdatedImage) : null;
      let now = new Date().getTime();
      console.log('image since:', (now - then) / 1000, 'secs -', (now - then) / 1000 / 3600, 'hrs');
      if (then && (now - then) / 1000 < 12 * 3600) {
        console.log('using old image');
      } else {
        console.log('getting new image');
        this.getImage();
      }
    },
    getImage() {
      this.$http.get(`https://api.unsplash.com/photos/random`, {
          params: {
            client_id: process.env.UNSPLASH_APP_ID,
            orientation: 'landscape',
            featured: true,
            w: window.innerWidth
          }
        })
        .then(response => {
          // console.log('unsplash response', response.body);
          console.log('got new image');
          const img = response.body;

          this.BG = img.urls.full;
          localStorage.BG = img.urls.full;

          this.imgColor = img.color;
          localStorage.imgColor = img.color;

          let author = {
            name: img.user.name,
            link: img.links.html
          };
          this.author = author;
          localStorage.author = JSON.stringify(author);

          localStorage.image = img.id
          localStorage.tsUpdatedImage = new Date().getTime();
        }, err => {
          // error callback
          console.error('Unsplash:', err.body);
          delete localStorage.clear();

          // fallback
          this.BG = 'https://source.unsplash.com/random';
          localStorage.BG = 'https://source.unsplash.com/random';
        });
    }
  }
}
</script>

<style lang="scss" module>
#bg {
    height: 100%;
    width: 100%;

    background: #333 no-repeat center center fixed;

    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;

        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        opacity: 0;
        transition: all 300ms ease-in;
        &.loaded {
            opacity: 1;
        }
    }

    .meta {
        position: fixed;
        bottom: 0;
        left: 0;
        margin: 0.5rem;
        display: flex;
        align-items: center;
        z-index: 2;
        p {
            color: white;
            text-shadow: 0 0 2px rgba(#000000, 0.5);
            margin-left: 5px;
        }
        a {
            color: white;
            text-decoration: underline;
        }
    }
}
</style>
