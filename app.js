const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const ramdomBtn = $('.btn-random')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRamdom: false,
    songs: [
        {
            name: 'Bước Qua Nhau',
            singer: 'Vũ',
            path: './assets/music/BuocQuaNhau.mp3',
            image: './assets/img/BuocQuaNhau.jpg'
        },
        {
            name: 'Ái Nộ',
            singer: 'Masew x Khoi Vu x Yến Tatoo',
            path: './assets/music/AiNo.mp3',
            image: './assets/img/AiNo.jpg'
        },
        {
            name: 'Có Hẹn Với Thanh Xuân',
            singer: 'Monstar',
            path: './assets/music/CoHenVoiThanhXuan.mp3',
            image: './assets/img/CoHenVoiThanhXuan.jpg'
        },
        {
            name: 'Thức Giấc',
            singer: 'Da Lab',
            path: './assets/music/ThucGiac.mp3',
            image: './assets/img/ThucGiac.jpg'
        },
    ],
    render: function() {
        const htmls = this.songs.map(song => {
            return `
            <div class="song">
                <div class="thumb" style="background-image: url('${song.image}">
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
        $('.playlist').innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function() {
        const cdWidth = cd.offsetWidth

        // xử lý quay cd
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'},
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()
        //xử lý phóng to thu nhỏ cd
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }
        // sử lý play pause
        playBtn.onclick = function () {
            if(app.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }

            // lắng nghe khi bài hát được phát/dừng
            audio.onplay = function() {
                app.isPlaying = true
                player.classList.add('playing')
                cdThumbAnimate.play()
            }
            audio.onpause = function() {
                app.isPlaying = false
                player.classList.remove('playing')
                cdThumbAnimate.pause()
            }

            //tiến độ
            audio.ontimeupdate = function() {
                if(audio.duration) {
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100) 
                    progress.value = progressPercent
                }
            }

            // xử lý khi tua bài hát
            progress.onchange = function(e) {
                const seekTime = e.target.value/100 * audio.duration
                audio.currentTime = seekTime
            }
            // khi next 
            nextBtn.onclick = function() {
                app.nextSong(),
                audio.play()
            }
            // khi prev
            prevBtn.onclick = function() {
                app.prevSong(),
                audio.play()
            }
            //ramdom bai hat
            ramdomBtn.onclick = function(e) {
                app.isRamdom = !app.isRamdom
                ramdomBtn.classList.toggle('active', app.isRamdom)
            }
        }
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

        console.log(heading, cdThumb, audio)
    },
    nextSong: function () {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        app.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length -1
        }
        app.loadCurrentSong()
    },
    
    start: function() {
        // Định nghĩa các thuộc tính cho object
        this.defineProperties()

        // Lắng nghe / xử lý cái sự kiện (DOM events)
        this.handleEvents()

        // Tải bài hát ban đầu 
        this.loadCurrentSong()

        // Hiển thị danh sách bài hát
        this.render()
    }
}

app.start()