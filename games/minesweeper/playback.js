
milli = 1000;
replayPlayback = function(replayStr, autoPlay = true) {
    
    retry();
    replayTime = -1;
    playbackCounter = 0;
    playbackFPS = 120;
    timeIndex = 0;
    actionIndex = 0;
    actionDiv = 0;
    
    playing = false;
    playbacking = true;
    toReplay = replayStr.split("!");
    
    if (autoPlay) {

        if (toReplay.length <= 2) {
            return false;
        }
        
        doubles = false;
        sliceLen = 3;
        if (width > 35 || height > 35) {
            doubles = true;
            sliceLen = 5;
        }
    
        playbackTime = [];
        playbackList = [];
        for (r = 1; r < toReplay.length; r++) {
            
            playbackTime.push(parseInt(radix.convert(toReplay[r].slice(0,2), 36, 10)));
            astr = toReplay[r].slice(2, toReplay[r].length);
            alist = [["M", 0, 0]];
            for (s = 0; s < astr.length/sliceLen; s++) {
                
                sstr = astr.slice(s * sliceLen, sliceLen * (s + 1));
                
                s1 = sstr.slice(1, 1 + (sliceLen-1)/2);
                s2 = sstr.slice(1 + (sliceLen-1)/2, sliceLen);
                if (!(astr.length/sliceLen > 5 && (sstr[0] == "P" || sstr[0] == "C"))) {
                    alist.push([sstr[0], parseInt(radix.convert(s1, 36, 10)), parseInt(radix.convert(s2, 36, 10))])
                }
            }
            if (alist.length > 1) {
    
                alist[0][1] = alist[1][1];
                alist[0][2] = alist[1][2];
            }
            playbackList.push(alist);
        }
    }
    
    actionDiv = playbackFPS/(playbackList[0].length)
    action_x = playbackList[0][0][1];
    action_y = playbackList[0][0][2];
    cursor_x = action_x * scale + cursor_x_offset;
    cursor_y = action_y * scale + cursor_y_offset;
    moveCursor(cursor_x, cursor_y);
    document.getElementById("playbackSlider").max = playbackTime[playbackTime.length-1];
    
    if (autoPlay) {
        
        document.getElementById("playback_cursor").style.display = "";
        togglePlayback(true);
        disablePlaybackPanel(!playbacking);
    }
}



moveCursor = function(mcx, mcy) {

    document.getElementById("playback_cursor").style.left = mcx;
    document.getElementById("playback_cursor").style.top = mcy;
}

togglePlayback = function(setVal = "toggle") {

    if (setVal == true) {

        playbackTimer = setInterval(playbackPlayer, milli/playbackFPS);
        replaying = true;
        document.getElementById("togglePlayback").innerHTML = "Pause";
        document.getElementById("playback_cursor").style.display = "";
    }
    else if (setVal == false) {

        clearInterval(playbackTimer);
        replaying = false;
        document.getElementById("togglePlayback").innerHTML = "Play";
    }
    else {

        if (document.getElementById("playbackSlider").max == document.getElementById("playbackSlider").value) {
            playbackFrom(0);
            document.getElementById("playback_cursor").style.display = "";
        }
        else if (!replaying && !playbacking) {

            playbackFrom(0);
            document.getElementById("playback_cursor").style.display = "";
        }
        else {

            if (replaying) {
    
                clearInterval(playbackTimer);
                replaying = false;
                document.getElementById("togglePlayback").innerHTML = "Play";
                // console.warn("PAUSED")
            }
            else {
    
                playbackTimer = setInterval(playbackPlayer, milli/playbackFPS);
                replaying = true;
                document.getElementById("togglePlayback").innerHTML = "Pause";
                document.getElementById("playback_cursor").style.display = "";
                // console.warn("PLAYING")
            }
        }
    }
}

setPlaybackSpeed = function() {

    if (!replaying) {

        milli = 1000/parseFloat(document.getElementById("playbackSpeed").value);
    } 
    else {
        
        togglePlayback(false);
        milli = 1000/parseFloat(document.getElementById("playbackSpeed").value);
        togglePlayback(true);
    }
    
    // console.warn(milli, "newspeed")
}

disablePlaybackPanel = function(setPanel) {

    if (setPanel == true) {

        document.getElementById("togglePlayback").disabled = true;
        document.getElementById("playbackSlider").disabled = true;
        document.getElementById("playbackSpeed").disabled = true;
        document.getElementById("playback_control_disable").style.backgroundColor = dark_mode ? "#8B6565" : "#EEC8C8";
        document.getElementById("timeSliderUp").innerHTML = "0";
        document.getElementById("timeSliderDown").innerHTML = "-0";
    }
    else if (setPanel == false) {
        
        document.getElementById("togglePlayback").disabled = false;
        document.getElementById("playbackSlider").disabled = false;
        document.getElementById("playbackSpeed").disabled = false;
        document.getElementById("playback_control_disable").style.backgroundColor = dark_mode ? "#777777" : "#EBEBEB";
    }
}
disablePlaybackPanel(true);

playbackFrom = function(sec) {

    togglePlayback(false);
    replayPlayback(loadedPlayback, false);
    actionIndex = 0;

    for (ti = 0; ti < playbackTime.length; ti++) {
        if (playbackTime[ti] == sec) {

            timeIndex = ti;
            replayTime = playbackTime[ti] - 1;
            togglePlayback(true);
            document.getElementById("playback_cursor").style.display = "";
            return;
        }
        for (ai = 0; ai < playbackList[ti].length; ai++) {

            action = playbackList[ti][ai][0];
            if (action != "M") {
                action_x = playbackList[ti][ai][1];
                action_y = playbackList[ti][ai][2];

                cursor_x = action_x * scale + cursor_x_offset;
                cursor_y = action_y * scale + cursor_y_offset;
                moveCursor(cursor_x, cursor_y);
            }

            switch(action) {
                
                case "L":
                    leftAction(action_x, action_y);
                break;
                case "R":
                    rightAction(action_x, action_y);
                break;
                case "S":
                    spaceAction(action_x, action_y);
                break;
                case "P":
                    openPeek(action_x, action_y);
                break;
                case "C":
                    closePeek(action_x, action_y);
                break;
                case "M":
                    // console.warn("moving", action_x, action_y);
                break;
            }
        }
    }
}

playbackPlayer = function() {

    if (playbackCounter % playbackFPS == 0) {
        // console.log("sec", playbackCounter, timeIndex, actionIndex)
        replayTime++;
        time = replayTime;
        setTimerDisplay();
        document.getElementById("playbackSlider").value = replayTime;
        document.getElementById("timeSliderUp").innerHTML = replayTime + "s";
        document.getElementById("timeSliderDown").innerHTML = (replayTime - playbackTime[playbackTime.length-1]) + "s";
        
        actionDiv = playbackFPS/(playbackList[timeIndex].length);
        delta_x = (playbackList[timeIndex][actionIndex][1] - action_x)*scale/actionDiv;
        delta_y = (playbackList[timeIndex][actionIndex][2] - action_y)*scale/actionDiv;
    }
    
    if (replayTime == playbackTime[timeIndex]) {
        // console.info("more", playbackCounter, timeIndex, actionIndex)
        if (playbackCounter % actionDiv == 0) {
            // console.warn("pbc:", playbackCounter, " ti:",timeIndex, " ai:", actionIndex, " ad:", actionDiv, " rt:", replayTime, " pbt:", playbackTime[timeIndex], replayTime==playbackTime[timeIndex]);


            action = playbackList[timeIndex][actionIndex][0];
            if (action != "M") {
                action_x = playbackList[timeIndex][actionIndex][1];
                action_y = playbackList[timeIndex][actionIndex][2];

                cursor_x = action_x * scale + cursor_x_offset;
                cursor_y = action_y * scale + cursor_y_offset;
                moveCursor(cursor_x, cursor_y);
            }
            
            switch(action) {
                
                case "L":
                    leftAction(action_x, action_y);
                break;
                case "R":
                    rightAction(action_x, action_y);
                break;
                case "S":
                    spaceAction(action_x, action_y);
                break;
                case "P":
                    openPeek(action_x, action_y);
                break;
                case "C":
                    closePeek(action_x, action_y);
                break;
                case "M":
                    // console.warn("moving", action_x, action_y);
                break;
            }
            
            actionIndex++;
            if (actionIndex == playbackList[timeIndex].length) {
                actionIndex = 0;
                timeIndex++;
                if (timeIndex == playbackTime.length) {
                    togglePlayback(false);
                    return;
                }
            }
            actionDiv = playbackFPS/(playbackList[timeIndex].length);
            delta_x = (playbackList[timeIndex][actionIndex][1] - action_x)*scale/actionDiv;
            delta_y = (playbackList[timeIndex][actionIndex][2] - action_y)*scale/actionDiv;
        }
        else {
            cursor_x += delta_x;
            cursor_y += delta_y;
            moveCursor(cursor_x, cursor_y);
        }
    } 

    playbackCounter++;
    // console.debug("pbc:", playbackCounter, " ti:",timeIndex, " ai:", actionIndex, " ad:", actionDiv, " rt:", replayTime, " pbt:", playbackTime[timeIndex], replayTime==playbackTime[timeIndex]);
}





