
width = 16;
height = 16;
mines = 40;
minesLeft = mines;

scale = 40;
time = 0;
timeCounter = 0;
borderWidth = 2;

dark_mode = false;
restartButton_state = "happy";
clickDown = false;
firstClick = true;
maybe = false;
playing = true;
clearing = false;
fastOpening = false;
restartHover = false;
keyDown = false;
flagWarning = true;
freeBorder = false;
peeking = false;
retrying = false;
currentDifficulty = "Intermediate";

editing = false;
document.getElementById("toggleEditor").checked = false;

mx = -1;
my = -1;
peek_x = 0;
peek_y = 0;

clearList = [];
recordedGame = [];

grid = new Array(width);
field = new Array(width);
for (i = 0; i < width; i++) {
    grid[i] = new Array(height);
    field[i] = new Array(height);
    for (j = 0; j < height; j++) {
        grid[i][j] = "tile";
        field[i][j] = "tile";
    }
}

compressor = new cmp();

imgSrc = {}
updateImgSrc = function() {

    mode = dark_mode ? "dark_mode" : "light_mode";
    imgSrc = {
        "tile":             "sprites/" + mode + "/tiles/tile.png",
        "0-tile":           "sprites/" + mode + "/tiles/open-tile.png",
        "1-tile":           "sprites/" + mode + "/tiles/1-tile.png",
        "2-tile":           "sprites/" + mode + "/tiles/2-tile.png",
        "3-tile":           "sprites/" + mode + "/tiles/3-tile.png",
        "4-tile":           "sprites/" + mode + "/tiles/4-tile.png",
        "5-tile":           "sprites/" + mode + "/tiles/5-tile.png",
        "6-tile":           "sprites/" + mode + "/tiles/6-tile.png",
        "7-tile":           "sprites/" + mode + "/tiles/7-tile.png",
        "8-tile":           "sprites/" + mode + "/tiles/8-tile.png",
        "error-1":          "sprites/" + mode + "/tiles/error-1.png",
        "error-2":          "sprites/" + mode + "/tiles/error-2.png",
        "error-3":          "sprites/" + mode + "/tiles/error-3.png",
        "error-4":          "sprites/" + mode + "/tiles/error-4.png",
        "error-5":          "sprites/" + mode + "/tiles/error-5.png",
        "error-6":          "sprites/" + mode + "/tiles/error-6.png",
        "error-7":          "sprites/" + mode + "/tiles/error-7.png",
        "error-8":          "sprites/" + mode + "/tiles/error-8.png",
        "bomb":             "sprites/" + mode + "/tiles/bomb.png",
        "not-bomb":         "sprites/" + mode + "/tiles/not-bomb.png",
        "exploded-bomb":    "sprites/" + mode + "/tiles/exploded-bomb.png",
        "flag":             "sprites/" + mode + "/tiles/flag.png",
        "maybe":            "sprites/" + mode + "/tiles/maybe.png",
        "line-v":           "sprites/" + mode + "/frame/line-v.png",
        "line-h":           "sprites/" + mode + "/frame/line-h.png",
        "cross-nes":        "sprites/" + mode + "/frame/cross-nes.png",
        "cross-nsw":        "sprites/" + mode + "/frame/cross-nsw.png",
        "corner-ne":        "sprites/" + mode + "/frame/corner-ne.png",
        "corner-nw":        "sprites/" + mode + "/frame/corner-nw.png",
        "corner-es":        "sprites/" + mode + "/frame/corner-es.png",
        "corner-sw":        "sprites/" + mode + "/frame/corner-sw.png",
        "divider":          "sprites/" + mode + "/digits/digit-divider.png",
        "blank-digit":      "sprites/" + mode + "/digits/blank-digit.png",
        "happy":            "sprites/" + mode + "/buttons/happy.png",
        "dead":             "sprites/" + mode + "/buttons/dead.png",
        "cool":             "sprites/" + mode + "/buttons/cool.png",
        "kiss":             "sprites/" + mode + "/buttons/kiss.png",
        "settings":         "sprites/" + mode + "/buttons/settings.png",
        "retry":            "sprites/" + mode + "/buttons/retry-overlay.png",
        "happy_pushed":     "sprites/" + mode + "/buttons/happy_pushed.png",
        "dead_pushed":      "sprites/" + mode + "/buttons/dead_pushed.png",
        "cool_pushed":      "sprites/" + mode + "/buttons/cool_pushed.png",
        "kiss_pushed":      "sprites/" + mode + "/buttons/kiss_pushed.png",
        "settings_pushed":  "sprites/" + mode + "/buttons/settings_pushed.png"     
    }
}

gameWindow = document.getElementById("game");
gameWindowBar = document.getElementById("game_bar");