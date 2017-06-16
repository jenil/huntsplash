<template>
<div :id="$style.bg" v-if="BG" :style="{ 'background-color': imgColor}">
  <img :src="BG" alt="" @load="loadedImg" @error="errorImg" :class="{ [$style.loaded]: bgLoaded }" ref="BG" crossOrigin="anonymous">
  <div v-if="author.name" :class="{[$style.meta]: true, [this.position == 'right' ? $style.right: '']: true}">
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
  props: ['position', 'rate'],
  data() {
    return {
      bgLoaded: false,
      BG: localStorage.bgData || localStorage.BG || '',
      imgColor: localStorage.imgColor || '#333',
      author: localStorage.author ? JSON.parse(localStorage.author) : {},

      // Pre-load and cache the next image so we stay 1 ahead at all times
      nextBG: localStorage.nextBgData || localStorage.nextBG || '',
      nextImgColor: localStorage.nextImgColor || '#333',
      nextAuthor: localStorage.nextAuthor ? JSON.parse(localStorage.nextAuthor) : {}
    }
  },
  created() {
    if (!process.env.UNSPLASH_APP_ID) {
      console.error('[USP] No UNSPLASH_APP_ID!');
    }
    this.checkImage();
  },
  mounted() {
    console.time('BG');
  },
  methods: {
    checkImage() {
      let then = localStorage.tsUpdatedImage ? JSON.parse(localStorage.tsUpdatedImage) : null;
      let now = new Date().getTime();
      console.log('[USP] image since:', (now - then) / 1000, 'secs -', (now - then) / 1000 / 3600, 'hrs');
      console.log('[USP] refresh rate: ', this.rate * 3600, ' seconds');
      if (then && (now - then) / 1000 < this.rate * 3600) {
        this.getCurrentImage();
      } else {
        this.getNewImage();
      }
    },
    getCurrentImage() {
      console.log('[USP] using old image');
    },
    swapImages() {
      console.log('[USP] loading next image');
      localStorage.BG = localStorage.nextBG;
      this.BG = localStorage.nextBG;

      localStorage.bgData = localStorage.nextBgData;

      localStorage.imgColor = localStorage.nextImgColor;
      this.imgColor = localStorage.nextImgColor;

      this.author = localStorage.nextAuthor ? JSON.parse(localStorage.nextAuthor) : null;
      localStorage.author = localStorage.nextAuthor;

      localStorage.image = localStorage.nextImage;
    },
    getNewImage() {
      console.log('[USP] getting new image');

      //set the pre-loaded next image as the current if there is one
      if (localStorage.nextBG) {
        this.swapImages();
      }

      localStorage.tsUpdatedImage = new Date().getTime();

      this.$http.get(`https://api.unsplash.com/photos/random`, {
          params: {
            client_id: process.env.UNSPLASH_APP_ID,
            orientation: 'landscape',
            featured: true,
            w: (window.innerWidth * window.devicePixelRatio) // this doesn't work though it is in the API doc
          }
        })
        .then(response => {
          console.log('[USP] got new image');
          const img = response.body;

          localStorage.nextBG = img.urls.full + '&w=' + (window.innerWidth * window.devicePixelRatio); // Fix for width
          this.nextBG = localStorage.nextBG;

          this.nextImgColor = img.color;
          localStorage.nextImgColor = img.color;

          let author = {
            name: img.user.name,
            link: img.links.html
          };
          this.nextAuthor = author;
          localStorage.nextAuthor = JSON.stringify(author);

          localStorage.nextImage = img.id

          this.cacheBG(this.nextBG);

          // If the current bg still hasnt loaded by now, use this one (initial install)
          // There may be a more elegant way to do this
          if (!localStorage.BG) {
            this.swapImages();
          }

        }, err => {
          // error callback
          console.error('[USP] Unsplash:', err.body);
          this.getCurrentImage(); // TODO: default to cached image if unsplash api quota is reached
        });


    },
    loadedImg() {
      console.timeEnd('BG');
      this.bgLoaded = true;
      console.log('[USP] 🏞 loaded from', this.BG.indexOf('data:') === 0 ? 'cache' : 'source');
      console.info('[USP] done. all set!');
      if (this.BG.indexOf('data:') !== 0) {
        this.cacheBG(this.BG);
      }
    },
    cacheBG(cacheBG) {
      console.info('[USP] Lets cache the BG: ', cacheBG);
      var vm = this;
      if (cacheBG.indexOf('data') === -1) {
        this.$http.get(cacheBG, {
          responseType: 'blob'
        }).then(response => {
          return response.blob();
        }).then(blob => {
          var url = window.URL.createObjectURL(blob);
          var img = new Image();
          img.setAttribute('crossOrigin', 'anonymous');
          img.onload = function() {
            var canvas = document.createElement("canvas");
            canvas.width = (window.innerWidth || 1280) * window.devicePixelRatio;
            canvas.height = (this.height / this.width) * canvas.width;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
            var data = canvas.toDataURL("image/jpeg");
            if (cacheBG == localStorage.BG) {
              console.info('BG Cached! 🍺');
              localStorage.bgData = data;
            } else if (cacheBG == localStorage.nextBG) {
              console.info('Next BG Cached! 🍺');
              localStorage.nextBgData = data;
            }
          };
          console.log('[USP] trying to cache from', url);
          img.src = url;
        }).catch(err => {
          console.error('[USP] Failed to Cache BG: ', err);
        });
      }
    },
    errorImg() {
      console.warn('BG Cache missed, fallback to fetch image from source');
      this.BG = localStorage.BG;
      delete localStorage.BGblob;
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
        transition: all 200ms ease-in;
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

    .right {
        left: auto;
        right: 0;
    }
}
</style>
