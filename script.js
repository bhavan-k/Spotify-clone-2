const songs = [
    { title: "Believe", artist: "Wanheda", src: "https://res.cloudinary.com/dzr1iivhb/video/upload/v1778071859/believe-by-wanheda_v8lnpe.mp3", cover: "images/album_cover_1_1778072184839.png" },
    { title: "Hyperion", artist: "Scott Buckley", src: "https://res.cloudinary.com/dzr1iivhb/video/upload/v1778071854/hyperion-by-scott-buckley_smcr9h.mp3", cover: "images/album_cover_2_1778072205727.png" },
    { title: "Banana", artist: "Next Route", src: "https://res.cloudinary.com/dzr1iivhb/video/upload/v1778071850/banana-by-next-route_tt9yq6.mp3", cover: "images/album_cover_3_1778072221458.png" },
    { title: "Thatched Villagers v2", artist: "Kevin MacLeod", src: "https://res.cloudinary.com/dzr1iivhb/video/upload/v1778071836/thatched-villagers-v2-by-kevin-macleod_qpfkyq.mp3", cover: "images/album_cover_1_1778072184839.png" },
    { title: "Destiny", artist: "Galaxytones", src: "https://res.cloudinary.com/dzr1iivhb/video/upload/v1778071832/destiny-by-galaxytones_m7taq1.mp3", cover: "images/album_cover_2_1778072205727.png" },
    { title: "With U", artist: "Peyruis", src: "https://res.cloudinary.com/dzr1iivhb/video/upload/v1778071795/with-u-by-peyruis_qqscnt.mp3", cover: "images/album_cover_3_1778072221458.png" },
    { title: "Happy 4 Nothing", artist: "Zimpl", src: "https://res.cloudinary.com/dzr1iivhb/video/upload/v1778071794/happy-4-nothing-by-zimpl_bcnsk4.mp3", cover: "images/album_cover_1_1778072184839.png" },
    { title: "Titan", artist: "Alex Productions", src: "https://res.cloudinary.com/dzr1iivhb/video/upload/v1778071793/titan-by-alex-productions_mhtdgo.mp3", cover: "images/album_cover_2_1778072205727.png" },
    { title: "I Ain't Running", artist: "Limujii", src: "https://res.cloudinary.com/dzr1iivhb/video/upload/v1778071793/i-aint-running-by-limujii_ystmhu.mp3", cover: "images/album_cover_3_1778072221458.png" },
    { title: "Sakura Breeze", artist: "Roa Music", src: "https://res.cloudinary.com/dzr1iivhb/video/upload/v1778071781/sakura-breeze-by-roa-music_xzqbpw.mp3", cover: "images/album_cover_1_1778072184839.png" },
    { title: "Patterns In The Clouds", artist: "Blaudiss", src: "https://res.cloudinary.com/dzr1iivhb/video/upload/v1778071781/patterns-in-the-clouds-by-blaudiss_qyafus.mp3", cover: "images/album_cover_2_1778072205727.png" }
];

const audio = new Audio();
let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

// DOM Elements
const playPauseBtn = document.getElementById('play-pause');
const playIcon = document.getElementById('play-icon');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const shuffleBtn = document.getElementById('shuffle');
const repeatBtn = document.getElementById('repeat');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const volumeBar = document.getElementById('volume-bar');
const volumeIcon = document.getElementById('volume-icon');

const currentCover = document.getElementById('current-cover');
const currentTitle = document.getElementById('current-title');
const currentArtist = document.getElementById('current-artist');
const songListEl = document.getElementById('song-list');

// Initialize App
function init() {
    renderSongList();
    loadSong(currentSongIndex);
    
    // Set initial volume bar state
    audio.volume = volumeBar.value / 100;
    volumeBar.style.setProperty('--progress', `${volumeBar.value}%`);
    progressBar.style.setProperty('--progress', '0%');
}

// Render Song List
function renderSongList() {
    songListEl.innerHTML = '';
    songs.forEach((song, index) => {
        const item = document.createElement('div');
        item.className = 'song-item';
        item.onclick = () => playSong(index);
        item.innerHTML = `
            <div class="song-index-container">
                <span class="song-index">${index + 1}</span>
                <i class="fas fa-play song-play-icon"></i>
            </div>
            <img src="${song.cover}" alt="cover">
            <div class="song-details">
                <div class="title">${song.title}</div>
                <div class="artist">${song.artist}</div>
            </div>
            <div class="album">Single</div>
            <div class="duration">3:00</div>
        `;
        songListEl.appendChild(item);
    });
}

// Load Song
function loadSong(index) {
    currentSongIndex = index;
    const song = songs[index];
    audio.src = song.src;
    currentCover.src = song.cover;
    currentTitle.textContent = song.title;
    currentArtist.textContent = song.artist;
    
    // Update active class in list
    const items = document.querySelectorAll('.song-item');
    items.forEach((item, i) => {
        if (i === index) {
            item.classList.add('playing');
        } else {
            item.classList.remove('playing');
        }
    });

    // Reset progress bar
    progressBar.value = 0;
    progressBar.style.setProperty('--progress', '0%');
    currentTimeEl.textContent = '0:00';
    totalTimeEl.textContent = '0:00'; // Will update on loadedmetadata
}

// Play/Pause
function togglePlay() {
    if (isPlaying) {
        audio.pause();
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
    } else {
        audio.play();
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
    }
    isPlaying = !isPlaying;
}

// Play specific song from list
window.playSong = function(index) {
    if (currentSongIndex === index && isPlaying) {
        togglePlay();
        return;
    }
    loadSong(index);
    audio.play();
    isPlaying = true;
    playIcon.classList.remove('fa-play');
    playIcon.classList.add('fa-pause');
}

// Next Song
function nextSong() {
    if (isShuffle) {
        currentSongIndex = Math.floor(Math.random() * songs.length);
    } else {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
    }
    loadSong(currentSongIndex);
    if (isPlaying) audio.play();
}

// Prev Song
function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    if (isPlaying) audio.play();
}

// Format Time
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Event Listeners
playPauseBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);

audio.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(audio.duration);
    progressBar.max = 100;
});

audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progressPercent;
        currentTimeEl.textContent = formatTime(audio.currentTime);
        progressBar.style.setProperty('--progress', `${progressPercent}%`);
    }
});

progressBar.addEventListener('input', (e) => {
    const seekTime = (e.target.value / 100) * audio.duration;
    audio.currentTime = seekTime;
    progressBar.style.setProperty('--progress', `${e.target.value}%`);
});

volumeBar.addEventListener('input', (e) => {
    audio.volume = e.target.value / 100;
    if (audio.volume === 0) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else if (audio.volume < 0.5) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-up';
    }
    volumeBar.style.setProperty('--progress', `${e.target.value}%`);
});

audio.addEventListener('ended', () => {
    if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
    } else {
        nextSong();
    }
});

shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.style.color = isShuffle ? 'var(--primary)' : 'var(--text-base)';
});

repeatBtn.addEventListener('click', () => {
    isRepeat = !isRepeat;
    repeatBtn.style.color = isRepeat ? 'var(--primary)' : 'var(--text-base)';
});

// Mobile Sidebar Toggle
const mobileMenuBtn = document.getElementById('mobile-menu');
const closeSidebarBtn = document.getElementById('close-sidebar');
const sidebar = document.getElementById('sidebar');

if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.add('active');
    });
}

if (closeSidebarBtn && sidebar) {
    closeSidebarBtn.addEventListener('click', () => {
        sidebar.classList.remove('active');
    });
}

init();
