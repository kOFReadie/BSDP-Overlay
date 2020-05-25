addEventListener("dataRecived", function()
{
    modifiers();
    mapDetails();
    scoreDetails();
});

//#region Score + PreBSR
const time = document.getElementById("time");
const score = document.getElementById("score");
const accuracy = document.getElementById("acc");
const combo = document.getElementById("combo");
const preBSR = document.getElementById("previousBSR");
const health = document.getElementById("healthBar");

var mapLength;
var timerRunning = false;
var elapsed = 0;
function timerIncrement()
{
    if (gameData.LevelFailed || gameData.LevelPaused || gameData.LevelFinished || gameData.LevelQuit) {}
    else if (!gameData.LevelFailed || !gameData.LevelPaused || !gameData.LevelFinished || !gameData.LevelQuit)
    {
        time.innerHTML = Math.floor(elapsed / 60).toString().padStart(2, "0") + ":" + (elapsed - (Math.floor(elapsed / 60) * 60)).toString().padStart(2, "0") + "/"
        + Math.floor(mapLength / 60).toString().padStart(2, "0") + ":" + (mapLength - (Math.floor(mapLength / 60) * 60)).toString().padStart(2, "0");
        elapsed++;
        if (timerRunning) { if ( elapsed < mapLength ) { setTimeout(() => { timerIncrement(); }, 1000); } }
    }
}

function scoreDetails()
{
    health.style.height = `${gameData.PlayerHealth * 100}%`;

    if (gameData.PraticeMode)
    {
        mapLength = Math.trunc(gameData.Length / gameData.PraticeModeModifiers["songSpeedMul"]);
        FS.style = gameData.PraticeModeModifiers["songSpeedMul"] > 1 ? mEnabled : mDisabled;
        SS.style = gameData.PraticeModeModifiers["songSpeedMul"] < 1 ? mEnabled : mDisabled;
    }
    else if (gameData.Modifiers["fasterSong"] || gameData.Modifiers["slowerSong"])
    { mapLength = gameData.Modifiers["fasterSong"] ? Math.trunc(gameData.Length * 0.8) : Math.trunc(gameData.Length * 1.15); }
    else { mapLength = gameData.Length; }

    if (gameData.Timer == 0 && !timerRunning)
    {
        time.style = "color: white";
        timerRunning = true;
        if (gameData.PraticeMode) {elapsed = gameData.PraticeModeModifiers["startSongTime"]; }
        else { elapsed = 0; }
        setTimeout(() => { timerIncrement(); }, 500);
    }

    if (gameData.LevelPaused || gameData.LevelFinished)
    { timerRunning = false; timerIncrement(); time.style = gameData.LevelFinished ? "color: green;" : "color: white;"}
    else if (gameData.LevelFailed || gameData.LevelQuit) { timerRunning = false; time.style = "color: red;" }
    else { if (!timerRunning) { timerRunning = true; setTimeout(() => { timerIncrement(); }, 500); time.style = "color: white;" } }

    score.innerHTML = gameData.Score.toString().replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');
    accuracy.innerHTML = (Math.round(gameData.Accuracy * 10) /10).toString() + "%";
    combo.innerHTML = gameData.Combo.toString().replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ' ');
    preBSR.innerHTML = "Previous BSR: " + gameData.PreviousBSR;
    previousBSRContainer.style.display = gameData.PreviousBSR == null || gameData.PreviousBSR == "" ? "none" : "block";
}
//#endregion

//#region Map 
const coverImage = document.getElementById("beatmapCover");
const bsr = document.getElementById("bsr");
const mapper = document.getElementById("mapper");
const artist = document.getElementById("artist");
const songName = document.getElementById("mapName");

const topCurve = "border-radius: 0px 10px 0px 0px;";
const bottomCurve = "border-radius: 0px 0px 10px 0px;";
const bothCurve = "border-radius: 0px 10px 10px 0px;";
const noCurve = "border-radius: 0px;";
const mapNameExtras = " font-size: xx-large; padding-bottom: 5px;";

function mapDetails()
{
    var mapName = gameData.SongName.length > 35 ? gameData.SongName.substr(0, 35) + "..." : gameData.SongName;

    coverImage.src = gameData.coverImage == null ? "https://pbs.twimg.com/profile_images/1191299666048167936/tyGQRx5x_400x400.jpg" : gameData.coverImage;
    songName.innerHTML = mapName;
    artist.innerHTML = gameData.SongAuthor;
    mapper.innerHTML = gameData.Mapper;
    bsr.innerHTML = "BSR: " + gameData.BSRKey;

    artist.style.display = gameData.SongAuthor == null || gameData.SongAuthor == "" ? "none" : "block";
    mapper.style.display = gameData.Mapper == null || gameData.Mapper == "" ? "none" : "block";
    bsr.style.display = gameData.BSRKey == null ? "none" : "block";

    if (songName.client < artist.offsetWidth / 2) { songName.style = bottomCurve + mapNameExtras; }
    else { songName.style = bothCurve + mapNameExtras; }

    if (artist.offsetWidth > songName.offsetWidth && artist.offsetWidth > mapper.offsetWidth) { artist.style = bothCurve; }
    else if (artist.offsetWidth < songName.offsetWidth && artist.offsetWidth > mapper.offsetWidth) { artist.style = topCurve; }
    else if (artist.offsetWidth > songName.offsetWidth && artist.offsetWidth < mapper.offsetWidth) { artist.style = bottomCurve; }
    else { artist.style = noCurve; } /*Shorter then the above and below containers*/

    if (mapper.offsetWidth > artist.offsetWidth && mapper.offsetWidth > bsr.offsetWidth) { mapper.style = bothCurve; }
    else if (mapper.offsetWidth < artist.offsetWidth && mapper.offsetWidth > bsr.offsetWidth) { mapper.style = topCurve; }
    else if (mapper.offsetWidth > artist.offsetWidth && mapper.offsetWidth < bsr.offsetWidth) { mapper.style = bottomCurve; }
    else { artist.style = noCurve; } /*Shorter then the above and below containers*/

    if (bsr.offsetWidth < mapper.offsetWidth) { bsr.style = topCurve; }
    else { bsr.style = bothCurve; }
}
//#endregion

//#region Modifiers
const mDisabled = "color: rgb(83, 83, 83);";
const mEnabled = "color: white;";

const IF = document.getElementById("IF");
const BE = document.getElementById("BE");
const DA = document.getElementById("DA");
const GN = document.getElementById("GN");
const FS = document.getElementById("FS");
const NF = document.getElementById("NF");
const NO = document.getElementById("NO");
const NB = document.getElementById("NB");
const SS = document.getElementById("SS");
const NA = document.getElementById("NA");

function modifiers()
{
    var gameModifiers = gameData.Modifiers;
    IF.style = gameModifiers["instaFail"] ? mEnabled : mDisabled;
    BE.style = gameModifiers["batteryEnergy"] ? mEnabled : mDisabled;
    DA.style = gameModifiers["disappearingArrows"] ? mEnabled : mDisabled;
    GN.style = gameModifiers["ghostNotes"] ? mEnabled : mDisabled;
    FS.style = gameModifiers["fasterSong"] ? mEnabled : mDisabled;
    NF.style = gameModifiers["noFail"] ? mEnabled : mDisabled;
    NO.style = gameModifiers["noObstacles"] ? mEnabled : mDisabled;
    NB.style = gameModifiers["noBombs"] ? mEnabled : mDisabled;
    SS.style = gameModifiers["slowerSong"] ? mEnabled : mDisabled;
    NA.style = gameModifiers["noArrows"] ? mEnabled : mDisabled;
}
//#endregion