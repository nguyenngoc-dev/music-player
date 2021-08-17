const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const player = $('.player')
const list = $('.playlist');
const header = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const togglePlay = $('.btn-toggle-play')
const progress = $('.progress')
const next = $('.btn-next')
const prev = $('.btn-prev')
const random = $('.btn-random')
const repeat = $('.btn-repeat')
const app = {
    isPlaying:false,
    currentIndex : 0,
    isRandom : false,
    isRepeat:false,

     //thông tin các bài hát
    songs: [ {
            name: 'Nước mắt',
            singer: 'Tăng Phúc',
            path: './assets/img/anh1.jpg',
            music: './assets/music/bai1.mp3'
        },
        {
            name: 'Thế giới mất đi một người',
            singer: 'Tăng Phúc',
            path: './assets/img/anh2.png',
            music: './assets/music/bai2.mp3'
        },
        {
            name: 'Tất cả sẽ thay anh',
            singer: 'Tăng Phúc',
            path: './assets/img/anh3.png',
            music: './assets/music/bai3.mp3'
        },
        {
            name: 'Đừng chờ anh nữa',
            singer: 'Tăng Phúc',
            path: './assets/img/anh4.jpg',
            music: './assets/music/bai4.mp3'
        },
        {
            name: 'Vì sao',
            singer: 'Tăng Phúc',
            path: './assets/img/anh5.jpg',
            music: './assets/music/bai5.mp3'
        },
        {
            name: 'Hối hận trong anh',
            singer: 'Tuấn Hưng',
            path: './assets/img/anh6.jpg',
            music: './assets/music/bai6.mp3'
        },
        {
            name: 'Tìm lại bầu trời',
            singer: 'Tuấn Hưng',
            path: './assets/img/anh7.jpg',
            music: './assets/music/bai7.mp3'
        },
        {
            name: 'Nói đi là đi',
            singer: 'Tăng Phúc',
            path: './assets/img/anh8.jpg',
            music: './assets/music/bai8.mp3'
        },
        {
            name: 'Yêu như lần yêu cuối',
            singer: 'Nguyễn Ngọc',
            path: './assets/img/anh9.jpg',
            music: './assets/music/bai9.mp3'
        }
        
    
    ],
    render() {
       const htmls = this.songs.map((song,index) => {
           return `
           <div class="song ${this.currentIndex ===index ? 'active' : ''}" data-index = ${index}>
           <div class="thumb"
           style="background-image: url(${song.path});">
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
       
       list.innerHTML = htmls.join('')
       
    },
    defindProperties() {
        Object.defineProperty(this, 'currentSong' , {
            get() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents() {
      
       
        const cdWidth = cd.offsetWidth;
        //khi dùng phương thức animate thì nó sẽ trả về đối tượng đang dùng 
        // phương thức đó và ghi nhớ trạng thái của nó
        const cdThumbAnimate = cdThumb.animate([
            {
                transform : 'rotate(360deg)'
            }
        ],{
            duration: 10000,
            iterations: Infinity
        
        }
        )
        cdThumbAnimate.pause();
        // phóng to thu nhỏ khi scroll list
        list.onscroll = function() {
            const scrollTop = this.scrollTop;
            const newcdWidth = cdWidth - scrollTop;
            cd.style.width = newcdWidth > 0 ? newcdWidth + 'px' : 0
            cd.style.opacity = newcdWidth / cdWidth    
    }
        //xử lý khi click vào nút play
        togglePlay.onclick = () => {
            //play audio
            //ban đầu this.isPlaying là false nên sẽ lọt vào else trước
            // sau khi vào else nó đc gán lại = true nên sẽ vào if và cứ như thế
            //thành vòng lặp
            if(this.isPlaying) {
                
                audio.pause();
            }
            else 
            {
                audio.play();
            }
        }
            audio.onplay = () => {
                this.isPlaying = true;
                player.classList.add('playing')
                cdThumbAnimate.play();//quay ảnh 
            }
            audio.onpause = () => {
                this.isPlaying = false;
                player.classList.remove('playing')
                cdThumbAnimate.pause();// dừng quay ảnh

            }
           
            //khi tiến độ bài hát thay đổi
            audio.ontimeupdate = function() {
              
                const currentPercent = Math.floor(this.currentTime / this.duration * 100)
                progress.value = currentPercent
            }
            //khi tua input range thì tiến độ bài hát đi theo
            progress.onchange = function() {
                const seekTime = audio.duration * this.value / 100
                audio.currentTime = seekTime
                audio.play()
                
            }
        
        //qua bài
        next.onclick = () => {
            if(this.isRandom)
            {
                this.playRandom() 
               
            }
           else
            {
                this.nextSong();
                
            }
          

            audio.play()
            this.render()
            this.scrollActiveIntoView()
        }
        //lùi bài
        prev.onclick = () => {
            if(this.isRandom)
            {
                this.playRandom() 
               
            }
            else{
                this.prevSong();
               
            }
            audio.play();
            this.render()
            this.scrollActiveIntoView()
        }
        //random bài
        random.onclick = () => {
            this.isRandom = !this.isRandom
            random.classList.toggle('active', this.isRandom)
            
        }
        //repeat bài
        repeat.onclick = () => {
            this.isRepeat = !this.isRepeat;
            repeat.classList.toggle('active', this.isRepeat)
        }
        //next khi hết bài
        audio.onended = () => {
            
            if(this.isRepeat){
                audio.play();
                
            }
            else{
                next.click();
            }
            
        }
        // click vào bài hát trong list
        list.onclick = (e) =>{
            
            const songNote = e.target.closest('.song:not(.active)')
            if( !e.target.closest('.option')) {
                if(songNote) {
                    //songNote.dataset.index trả về chuỗi nên phải 
                    // chuyển thành số để truyền vào mảng
                    this.currentIndex = Number(songNote.dataset.index);
                    this.loadCurrentSong();
                    this.render()
                    audio.play()
                }
                
            }
           
        }
    },
    loadCurrentSong() {
        
        header.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${ this.currentSong.path})`
        audio.src = this.currentSong.music
    },
    nextSong() {
        this.currentIndex ++
        if(this.currentIndex >= this.songs.length )
        {
            this.currentIndex = 0
        }
        this.loadCurrentSong();
    },
    prevSong() {
        this.currentIndex --
        if(this.currentIndex <= 0)
        {
            this.currentIndex = this.songs.length - 1 
        }
        this.loadCurrentSong();
    },
    playRandom() {
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        
        }
        while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong();
    },
    playRepeat() {
        this.currentIndex = this.currentIndex;
        this.loadCurrentSong();
    },
    //kéo bài đang phát vào view
    scrollActiveIntoView() {
        setTimeout(() =>{
            $('.active.song').scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            })
        }

        ,300)
    }
    ,
    start() {
        // Định nghĩa các thuộc tính của app
        this.defindProperties();
        //xử lí các sự kiện của app
        this.handleEvents();
        // load bài hát khi chạy UI
        this.loadCurrentSong();
        //render html playlist
        this.render();
    }
}
app.start();