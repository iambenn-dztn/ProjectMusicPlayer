const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $(".player");
const heading = $("header h2");
const cdThump = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const progress = $("#progress");
const playBtn = $(".btn-toggle-play");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: "Chúng ta của hiện tại",
      singer: "Sơn Tùng M-TP",
      path: "./assets/music/song8.mp3",
      image: "./assets/img/song8.jpg",
    },
    {
      name: "Remember Me",
      singer: "Sơn Tùng M-TP",
      path: "./assets/music/song1.mp3",
      image: "./assets/img/song1.jpg",
    },
    {
      name: "Nơi này có anh",
      singer: "Sơn Tùng M-TP",
      path: "./assets/music/song2.mp3",
      image: "./assets/img/song2.jpg",
    },
    {
      name: "Lạc trôi",
      singer: "Sơn Tùng M-TP",
      path: "./assets/music/song3.mp3",
      image: "./assets/img/song3.jpg",
    },
    {
      name: "Anh sai rồi",
      singer: "Sơn Tùng M-TP",
      path: "./assets/music/song4.mp3",
      image: "./assets/img/song4.jpg",
    },
    {
      name: "Lạc trôi (TripD Remix)",
      singer: "Sơn Tùng M-TP",
      path: "./assets/music/song5.mp3",
      image: "./assets/img/song5.jpg",
    },
    {
      name: "Em của ngày hôm qua",
      singer: "Sơn Tùng M-TP",
      path: "./assets/music/song6.mp3",
      image: "./assets/img/song6.jpg",
    },
    {
      name: "Chắc ai đó sẽ về",
      singer: "Sơn Tùng M-TP",
      path: "./assets/music/song7.mp3",
      image: "./assets/img/song7.jpg",
    },
  ],
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  render: function () {
    const htmls = this.songs.map(function (song, index) {
      return `
            <div class="song ${index === this.currentIndex ? "active" : ""}">
                <div class="thumb" style="background-image: url(${song.image})">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
        `;
    });
    $(".playlist").innerHTML = htmls.join("");
  },

  handleEvents: function () {
    const _this = this;
    // Scroll Top, phóng to thu nhỏ cd
    const cdWidth = cd.offsetWidth;
    document.onscroll = function () {
      const scrollTop = window.scrollY;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    //Xử lý khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // Khi song được play
    audio.onplay = function () {
      cdThumpAnimate.play();
      _this.isPlaying = true;
      player.classList.add("playing");
    };
    // Khi song bị pause
    audio.onpause = function () {
      cdThumpAnimate.pause();
      _this.isPlaying = false;
      player.classList.remove("playing");
    };
    // Khi bài hát chạy
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };
    // Tua
    progress.onchange = function () {
      const seekTime = (audio.duration / 100) * progress.value;
      audio.currentTime = seekTime;
    };
    // Xứ lý CD quay/ dừng
    const cdThumpAnimate = cdThump.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      interation: Infinity,
    });
    cdThumpAnimate.pause();
    // Xử lý next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
        audio.play();
      } else {
        _this.nextSong();
        audio.play();
      }
    };
    // Xuwr lys prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
        audio.play();
      } else {
        _this.prevSong();
        audio.play();
      }
    };
    // Xử lý nút random bật tắt
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle("active");
    };
    // Xứ lý nút repeat bật tắt
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle("active");
    };

    // Xử lý next, repeat khi ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        if (_this.isRandom) {
          _this.playRandomSong();
          audio.play();
        } else {
          _this.nextSong();
          audio.play();
        }
      }
    };
  },
  // Load thông tin bài hát hiện tại lên dashboard
  loadCurentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThump.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  // Xử lý next song
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurentSong();
  },

  // Xử lý prev song
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurentSong();
  },
  // Play random song
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurentSong();
  },

  start: function () {
    // Define các thuộc tính
    this.defineProperties();

    // Xử lý các sự kiện
    this.handleEvents();
    // Tải thông tin bài đầu tiền
    this.loadCurentSong();

    // Render playlist
    this.render();
  },
};
app.start();
