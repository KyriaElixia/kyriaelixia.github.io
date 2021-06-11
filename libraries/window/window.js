
mouseX = 0;
mouseY = 0;
wndw = null;
totalWindows = 0;

createWindow = function(id, x, y, b = true, cb = false) {

    totalWindows++;

    defaultWidth = "400";
    defaultHeight = "400";
    defaultBarHeight = "30";
    defaultBorderSize = "10";

    cWindow = document.createElement("div")
    cWindow.className = "window";
    cWindow.id = id;
    cWindow.style.width = defaultWidth;
    cWindow.style.height = defaultHeight;
    cWindow.style.position = "absolute";

    cBar = document.createElement("div");
    cBar.className = "window_bar";
    cBar.id = id + "_bar";
    cBar.style.width = defaultWidth;
    cBar.style.height = defaultBarHeight;
    cBar.style.position = "relative";
    

    cWindow.style.left = x;
    cWindow.style.top = y;

    cBar.onmousedown = function () {

        dragElement(document.getElementById(id));
    }

    if (b != false) {

        closeButton = document.createElement("button");
        closeButton.style.width = defaultBarHeight;
        closeButton.style.height = defaultBarHeight;
        closeButton.style.left = defaultWidth;
        closeButton.className = "closeButton";
        closeButton.innerHTML = "&#10005";
        closeButton.onclick = function() {

            document.body.removeChild(document.getElementById(id));
            totalWindows--;
        }
        cBar.appendChild(closeButton);
    }

    if (cb != false) {

        customButton = document.createElement("button");
        customButton.style.width = defaultBarHeight;
        customButton.style.height = defaultBarHeight;
        customButton.style.left = defaultWidth;
        customButton.className = "customButton";
        customButton.innerHTML = "&#10005";
        customButton.onclick = function() {

            //custom function here
        }
        cBar.appendChild(customButton); 
    }
    
    cWindow.appendChild(cBar);
    document.body.appendChild(cWindow);

    return cWindow;
}

resizeWindow = function(id ,w, h) {

    rWindow = document.getElementById(id);
    rBar = document.getElementById(id + "_bar");

    rWindow.style.width = w;
    rWindow.style.height = h;
    rBar.style.width = w;
}

// Code below this point is taken from this link.
// https://www.w3schools.com/howto/howto_js_draggable.asp
function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id)) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById(elmnt.id).onmousedown = dragMouseDown;
    } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
        elmnt.onmousedown = null; // Added by me
    }
}

window.onload = function() {

    // w = createWindow("window",50,50);
    // v = createWindow("window2",500,50);
    // u = createWindow("window3",0,0);
    
}

