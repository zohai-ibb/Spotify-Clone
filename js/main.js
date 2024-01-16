// console.log("Lets Begin!")
let songs;
let currentSong = new Audio();
let currFolder;

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = ""
    // console.log(songs)
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `
        <li>
            <div class = "maintain2">
                <div><img class="invert svg" src="svg/music.svg" alt=""></div>
                <div class="info">
                    <div class="Sname">${song.replaceAll("(PagalWorld).mp3", "")}</div>
                    <div class="Sartist">${currFolder.replaceAll("song/","").replaceAll("%20", " ")}</div>
                </div>
            </div>
            <div class="playNow">
                <span>Play Now</span>
                <img class="svg pause3" src="svg/pause3.svg" alt="">
            </div>
        </li>`;
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").getElementsByTagName("div")[0].innerHTML.trim())
            // console.log(e.querySelector(".info").getElementsByTagName("div")[0].innerHTML.trim())

        })
    })

    return songs;
}

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

const playMusic = (track => {
    currentSong.src = `/${currFolder}/` + track + "(PagalWorld).mp3";
    currentSong.play();
    document.querySelector(".pause2").src = "svg/playM.svg"
    document.querySelector(".currentTime").innerHTML = "00:00"
    document.querySelector(".duration").innerHTML = "00:00"
    document.querySelector(".songInfo").innerHTML = track

    // console.log(currentSong.src)
})

const playMusic2 = (track => {
    currentSong.src = `/${currFolder}/` + track;
    currentSong.play();
    document.querySelector(".pause2").src = "svg/playM.svg"
    document.querySelector(".currentTime").innerHTML = "00:00"
    document.querySelector(".duration").innerHTML = "00:00"
    document.querySelector(".songInfo").innerHTML = track.replace("(PagalWorld).mp3", "")

})

async function getAlbums(){

    let a = await fetch(`http://127.0.0.1:3000/song/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 
        if (e.href.includes("/song") && !e.href.includes(".htaccess")) {
           let folder = e.href.split("/").slice(-2)[0];
            // console.log(e.href.split("/").slice(-2)[0])
        let a = await fetch(`/song/${folder}/info.json`)
            let response = await a.json();
            cardContainer.innerHTML = cardContainer.innerHTML + `<div class="card">
            <div data-folder="${folder}" class="play">
                <img src="svg/play.svg" alt="">
            </div>
            <img src="/song/${folder}/cover.jpeg" alt="">
            <p id="p1">${response.title}</p>
            <p id="p2">${response.description}</p>
        </div>`
    }
    } 
}

async function main() {
    await getSongs("song/Arjit");   //songs = await getSongs("song/pika2");
    // console.log(songs); 
    await getAlbums();
    
    document.querySelector(".pause").addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            if(currentSong.src != ""){
                document.querySelector(".pause2").src = "svg/playM.svg"
            } 
        } else {
            currentSong.pause();
            document.querySelector(".pause2").src = "svg/pause.svg"
        }
    })

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".currentTime").innerHTML = secondsToMinutesSeconds(currentSong.currentTime);
        document.querySelector(".duration").innerHTML = secondsToMinutesSeconds(currentSong.duration);
        // document.querySelector(".songInfo").innerHTML = track;
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%";
    })

    document.querySelector(".seekBar").addEventListener("click", e =>{
        percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration*percent)/100;
    })

    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0";
        document.querySelector(".playbar").style.display = "none";
    })
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-120%";
        document.querySelector(".playbar").style.display = "flex";
    })

    document.querySelector(".previuos").addEventListener("click", ()=>{
        // console.log("Previuos Click");
        index = songs.indexOf(currentSong.src.substring(currentSong.src.indexOf(`/${currFolder}/`) + `/${currFolder}/`.length));
        if(index-1 >= 0){
            playMusic2(songs[index-1])
        }
    }) 
    document.querySelector(".next").addEventListener("click", ()=>{
        index = songs.indexOf(currentSong.src.substring(currentSong.src.indexOf(`/${currFolder}/`) + `/${currFolder}/`.length));
        if(index+1 < songs.length){
            playMusic2(songs[index+1])
        }
    })

    document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        currentSong.volume = parseInt(e.target.value)/100;
        if(currentSong.volume !== 0){
            document.querySelector(".vol").src = "svg/sound.svg"
        }else{
            document.querySelector(".vol").src = "svg/mute.svg"
        }
    })
    document.querySelector(".vol").addEventListener("click", ()=>{
        // currentVol = currentSong.volume;
        if(currentSong.volume !== 0){
            document.querySelector(".vol").src = "svg/mute.svg"
            currentSong.volume = 0;
            document.querySelector(".volume").getElementsByTagName("input")[0].value = 0;
        }else{
            document.querySelector(".vol").src = "svg/sound.svg"
            currentSong.volume = 0.5;
            document.querySelector(".volume").getElementsByTagName("input")[0].value = 50;

        }
    })

    Array.from(document.getElementsByClassName("play")).forEach(e =>{
        e.addEventListener("click", async item=>{
            console.log(item.currentTarget.dataset)
            console.log(item.currentTarget.dataset.folder)
            songs = await getSongs(`song/${item.currentTarget.dataset.folder}`)
            console.log("Play Clicked")
        })
    })



}

main(); 





