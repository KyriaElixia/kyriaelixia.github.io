
nowPlayingStation = "none";
playlist = [];
barWidth = 400;
volume = 0.2;

findJingle = new RegExp(/Jingle/);

K_DST = ["Barracuda","Eminence Front","Free Bird","Get Down To It","Hold The Line","Horse With No Name","Jingle 1","Jingle 2","Jingle 3","Jingle 4","Jingle 5","Jingle 6","Jingle 7","Jingle 8","Runnin Down A Dream","Slow Ride","Smokin","Some Kind of Wonderful","Somebody Up There Likes Me","Strutter","Two Tickets to Paradise","White Wedding","Woman to Woman","Young Turks"];

checker = function() {

    volume = document.getElementById("volume").value;
    document.getElementById("player").volume = volume;

    songPos = timeConverter(Math.floor(document.getElementById("player").currentTime));
    songLength = timeConverter(Math.floor(document.getElementById("player").duration));
    songLeft = Math.floor(document.getElementById("player").currentTime) - Math.floor(document.getElementById("player").duration);

    document.getElementById("now").innerHTML = songPos;
    
    if (nowPlayingStation != "none") {

        document.getElementById("end").innerHTML = "-" + timeConverter(Math.abs(songLeft));
    }
    else {

        document.getElementById("end").innerHTML = "-0:00"
    }

    document.getElementById("bar").style.width = document.getElementById("player").currentTime/document.getElementById("player").duration * barWidth;

    if (nowPlayingStation != "none") {

        if (document.getElementById("player").paused == true && songPos == songLength) {

            if (playlist.length > 1) {

                playlist.splice(0,1);
                playSong(playlist[0]);
            }
            else {

                play(nowPlayingStation);
            }
        }
    }
}

play = function(station) {

    nowPlayingStation = station;
    playlist = [];
    shuffle = [];
    if (station == "K-DST") {
        for(i = 0; i < K_DST.length; i++) {
            shuffle.push(K_DST[i])
        }
    }
    console.log("run")
    l = shuffle.length;
    for (i = 0; i < l; i++) {

        r = Math.floor(Math.random()*shuffle.length);
        playlist.push(shuffle[r]);
        shuffle.splice(r,1);
    }
    console.table(playlist)

    playSong(playlist[0]);
}

playSong = function(song) {

    document.getElementById("player").src = nowPlayingStation+"/"+song+".mp3";
    document.getElementById("station").innerHTML = "on "+ nowPlayingStation;
    document.getElementById("player").volume = volume;

    if (findJingle.test(playlist[0]) == false) {

        document.getElementById("playing").innerHTML = song;
    }
    else {
        
        document.getElementById("playing").innerHTML = nowPlayingStation;
    }

    makeQueue();
}

function timeConverter(seconds) {    

    min = Math.floor(seconds / 60);
    sec = seconds % 60;

    if (min == 0) {

        if (sec < 10) {
            
            minSec = "0:0"+sec;
        }
        else {
            
            minSec = "0:"+sec;
        }
    }
    else {

        if (sec == 0) {

            minSec = min + ":00";
        }
        else if (sec < 10) {

            minSec = min + ":0"+sec;
        }
        else {

            minSec = min + ":" + sec;
        }
    }
    return minSec;
}

makeQueue = function() {

    document.getElementById("queue").removeChild(document.getElementById("queueContainer"))

    queueContainer = document.createElement("table");
    queueContainerId = document.createAttribute("id");
    queueContainerId.value = "queueContainer";
    queueContainer.setAttributeNode(queueContainerId);
    document.getElementById("queue").appendChild(queueContainer);

    for (q = 1; q < playlist.length; q++) {

        if (findJingle.test(playlist[q]) == false) {
            
            row = document.createElement("tr");
            queueContainer.appendChild(row);

            data = document.createElement("td");
            row.appendChild(data);

            dataAlign = document.createAttribute("align");
            dataAlign.value = "center";
            data.setAttributeNode(dataAlign);

            data.innerHTML = playlist[q];
        }
    }
}

updater = setInterval(checker,1000/60);