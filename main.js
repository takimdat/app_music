const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'PLAYER'

const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) ||{},
    songs: [
        {
          name: "Chạy Về Nơi Phía Anh",
          singer: "Khắc Việt",
          path: "./music/ChayVeNoiPhiaAnh-KhacViet-7129688.mp3",
          image: "https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/6/3/0/d/630d20b0a79917e1545b4e2ada081040.jpg"
        },
        {
          name: "Đế Vương",
          singer: "Đình Dũng",
          path: "./music/DeVuong-DinhDungACV-7121634.mp3",
          image:
            "https://kienthucmoi.net/img/thumbnail/2021/12/13/loi-bai-hat-de-vuong-al.jpg"
        },
        {
          name: "Lời Hứa",
          singer: "Nam Cường & Khắc Việt",
          path: "./music/LoiHuaPromise-NamCuong-KhacViet_32p43.mp3",
          image: "https://avatar-ex-swe.nixcdn.com/playlist/2013/11/06/c/c/a/8/1383712492707_500.jpg"
        },
        {
          name: "Mượn Rượu Tỏ Tình",
          singer: "Emily & BigDaddy",
          path: "./music/MuonRuouToTinh-EmilyBigDaddy-5871420.mp3",
          image:
            "https://avatar-ex-swe.nixcdn.com/song/2019/02/12/f/4/4/4/1549959720035_640.jpg"
        },
        {
          name: "Ngày Đầu Tiên",
          singer: "Đức Phúc",
          path: "./music/NgayDauTien-DucPhuc-7129810.mp3",
          image:
            "https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/d/2/2/2/d222783b7861ffd1acef2c9e368561f9.jpg"
        },
        {
          name: "Hãy Trao Cho Anh",
          singer: "Sơn Tùng M-TP",
          path: "./music/HayTraoChoAnh-SonTungMTPSnoopDogg-6010660.mp3",
          image:
            "https://avatar-ex-swe.nixcdn.com/song/2019/07/10/f/2/6/d/1562743430057_640.jpg"
        },
        {
          name: "Tệ Thật Anh Nhớ Em",
          singer: "Thanh Hưng",
          path: "./music/TeThatAnhNhoEm-ThanhHung-7132634.mp3",
          image:
            "https://dj24h.com/wp-content/uploads/2022/03/te-that-anh-nho-em-thanh-hung.jpg"
        }
        
      ],
      setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
      },
      render: function(){
       const htmls = this.songs.map((song, index) =>{
           return `
           <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
           `
       })
       playList.innerHTML = htmls.join('')
      },

      defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
          get: function(){
              return this.songs[this.currentIndex]
          }
        })
      },

      handleEvents: function(){
          const _this = this
          const cdWidth = cd.offsetWidth

          // Xử lý CD quay và dừng
          const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
          ],{
            duration: 10000, // 10 seconds
            iterations: Infinity
          })
          cdThumbAnimate.pause()

          // Xử lý phóng to/ thu nhỏ CD
          document.onscroll = function(){
          const scrollTop = window.scrollY || document.documentElement.scrollTop
          newCdWidth = cdWidth - scrollTop
          cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
          cd.style.opacity = newCdWidth / cdWidth
        }   
  
        // Xử lý khi click play
        playBtn.onclick = function(){
          if(_this.isPlaying){
            audio.pause()
          }else{
            audio.play()
          } 
        }
        // Khi song được playing
        audio.onplay = function(){
          _this.isPlaying= true
          player.classList.add('playing')
          cdThumbAnimate.play()
        }
        // Khi song bị pause
        audio.onpause = function(){
          _this.isPlaying= false
          player.classList.remove('playing')
          cdThumbAnimate.pause()
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
          const progressPercnt = Math.floor (audio.currentTime / audio.duration * 100)
          progress.value = progressPercnt
        }

         // Xử lý khi tua song 
        progress.oninput = function(e){
        const seekTime =audio.duration * e.target.value / 100
        audio.currentTime = seekTime
        }

        // Khi next song
        nextBtn.onclick = function(){
          if(_this.isRandom){
            _this.playRandomSong()
          }else{
            _this.nextSong()
          }
        audio.play()
        _this.render()
        _this.scrollToActiveSong()
      },

      // Khi prev song
      prevBtn.onclick = function(){
        if(_this.isRandom){
          _this.playRandomSong()
        }else{
          _this.prevSong()
        }
      audio.play()
      _this.render()
      _this.scrollToActiveSong()
      },

      //Xử lý random bật/tắt
      randomBtn.onclick = function(e){
        _this.isRandom = !_this.isRandom
        _this.setConfig('isRandom', _this.isRandom)
        randomBtn.classList.toggle('active',_this.isRandom)
      },
        // Xử lý next song khi audio ended
        audio.onended = function(){
          if(_this.isRepeat){
            audio.play()
          }else{
            nextBtn.click()
          }
        },
        
        // Xử lý khi lặp lại một song
        repeatBtn.onclick = function(e){
        _this.isRepeat = !_this.isRepeat
        _this.setConfig('isRepeat', _this.isRepeat)
          repeatBtn.classList.toggle('active',_this.isRepeat) 
        }
        
        // Lắng nghe click vào playlist
        playList.onclick = function(e){
          const songNode = e.target.closest('.song:not(.active)')

          if( songNode || e.target.closest('.option')){
            // Xử lý khi click vào song
            if(songNode){
              _this.currentIndex = Number(songNode.dataset.index)
              _this.loadCurrentSong()
              _this.render()
              audio.play()
            }
            // Xử lý khi click vào song option
            if(e.target.closest('.option')){

            }
          }
        }
    },
      scrollToActiveSong: function(){
        setTimeout(function(){
          $('.song.active').scrollIntoView({
            behavior: 'smooth',
            block: 'end',
          })
        },300)
      },
    
      loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src=this.currentSong.path
      },
      loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
      },
      nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
          this.currentIndex = 0
        }
        this.loadCurrentSong()
      },
      prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0){
          this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
      },
      
      playRandomSong: function(){
        let newIndex
        do{
         newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
      },
      start: function(){
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig()

        // Định nghĩa thuộc tính cho object
        this.defineProperties()

        // Lắng nghe / xử lý các sự kienj (DOM events)
        this.handleEvents()

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()


        // Render playlist
        this.render()

        // Hiển thị trạng thái ban đầu của button repeat và random
        // repeatBtn.classList.toggle('active',this.isRepeat)
        // randomBtn.classList.toggle('active',this.isRandom)
      }, 
}
app.start()
