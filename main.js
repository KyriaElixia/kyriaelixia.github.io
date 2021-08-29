

img_width = 213;
img_height = 120;

card_width = 500;
card_height = 130;

offset_left = 20;
offset_top = 50;

card_spacer = 20;



cards = [];


card = function(title, dict, xpos, ypos, width, height) {

    this.title = title;
    this.author = dict["author"];
    this.url = dict["url"];
    this.preview = dict["preview"];
    this.date = dict["date"];

    this.x = xpos;
    this.y = ypos;
    this.dx = 0;
    this.dy = 0;
    this.width = width;
    this.height = height;

    this.move = function() {

        this.x += this.dx;
        this.y += this.dy;
    }
}

createButtons = function() {    

    btnsid = "buttons";
    document.getElementById(btnsid).remove();
    btns = document.createElement("div");
    btns.id = btnsid;
    document.getElementById("button_holder").appendChild(btns);


    for ([k, v] of Object.entries(data)) {

        btn = document.createElement("button");
        btn.innerHTML = k;
        btn.id = "btn_" + k;
        btn.page = k;
        btn.onclick = function() { renderPage(this.page); }

        btns.appendChild(btn);
    }
}

renderPage = function(page) {

    cards = [];
    chid = "cards";
    document.getElementById(chid).remove();
    ch = document.createElement("div");
    ch.id = chid;
    document.getElementById("card_holder").appendChild(ch);

    index = 0;
    for ([k, v] of Object.entries(data[page])) {

        crd = document.createElement("a");
        tbl = document.createElement("table");
        tblr = document.createElement("tr");
        
        imgd = document.createElement("td");
        img = document.createElement("img");
        img.src = v["preview"];
        img.className = "preview";
        img.alt = k + " preview";
        
        
        infod = document.createElement("td");
        ttl = document.createElement("h1");
        athr = document.createElement("span");
        
        
        tblr.appendChild(imgd);
        tblr.appendChild(infod);
        tbl.appendChild(tblr);
        imgd.appendChild(img);
        infod.appendChild(ttl);
        infod.appendChild(athr);

        ttl.innerHTML = k;
        infod.className = "card_title";
        athr.innerHTML = "by " + v["author"];

        crd.appendChild(tbl);


        crd.className = "card";
        crd.style.fontType = "menloFont"
        crd.id = "card_" + k;
        crd.href = v["url"];
        crd.onclick = function() { location.href = this.href; }
        crd.style.top = index % 2 == 0 ? index * (card_height + card_spacer)/2 + offset_top  : (index - 1) * (card_height + card_spacer)/2 + offset_top;
        crd.style.left = index % 2 == 0 ? offset_left : card_width + offset_left + card_spacer;


        ch.appendChild(crd);
        ch.appendChild(document.createElement("br"));
        index++; 
    }
    
}

window.onload = function() {

    createButtons();
}