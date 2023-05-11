var fps = 60.5;
var states = Object.freeze({
 SplashScreen: 0,
 GameScreen: 1,
 ScoreScreen: 2
});
var currentstate;
var gravity = 0.25;
var velocity = 0;
var position = 180;
var rotation = 0;
var jump = -4.77;
var flyArea = $("#flyarea").height();
var score = 0;
var highscore = 0;
var pipeheight = 106;
var pipewidth = 52;
var pipes = new Array();
var replayclickable = false;
var volume = 60;
var soundJump = new buzz.sound("assets/sounds/sfx_wing.ogg");
var soundScore = new buzz.sound("assets/sounds/sfx_point.ogg");
var soundHit = new buzz.sound("assets/sounds/sfx_hit.ogg");
var soundDie = new buzz.sound("assets/sounds/sfx_die.ogg");
var soundSwoosh = new buzz.sound("assets/sounds/sfx_swooshing.ogg");
buzz.all().setVolume(volume);
var loopGameloop;
var loopPipeloop;
$(document).ready(function () {
 var savedscore = getCookie("highscore");
 if (savedscore != "")
  highscore = parseInt(savedscore);
 showSplash();
});
function getCookie(cname) {
 var name = cname + "=";
 var ca = document.cookie.split(';');
 for (var i = 0; i < ca.length; i++) {
  var c = ca[i].trim();
  if (c.indexOf(name) == 0)
   return c.substring(name.length, c.length);
 }
 return "";
}
function setCookie(cname, cvalue, exdays) {
 var d = new Date();
 d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
 var expires = "expires=" + d.toGMTString();
 document.cookie = cname + "=" + cvalue + "; " + expires;
}
function showSplash() {
 currentstate = states.SplashScreen;
 document.querySelector('#copyright').style.display = 'block'
 velocity = 0;
 position = 180;
 rotation = 0;
 score = 0;
 $("#player").css({
  y: 0,
  x: 0
 });
 updatePlayer($("#player"));
 soundSwoosh.stop();
 soundSwoosh.play();
 $(".pipe").remove();
 pipes = new Array();
 $(".animated").css('animation-play-state', 'running');
 $(".animated").css('-webkit-animation-play-state', 'running');
 $("#splash").transition({
  opacity: 1
 }, 2000, 'ease');
}
function startGame() {
 currentstate = states.GameScreen;
 document.querySelector('#copyright').style.display = 'none'
 $("#splash").stop();
 $("#splash").transition({
  opacity: 0
 }, 500, 'ease');
 setBigScore();
 var updaterate = 1000.0 / fps;
 loopGameloop = setInterval(gameloop, updaterate);
 loopPipeloop = setInterval(updatePipes, 1340);
 playerJump();
}
function updatePlayer(player) {
 if (currentstate === states.GameScreen) {
  if (velocity <= 3) {
   rotation = -22;
  } else {
   rotation = Math.min((velocity / 4) * 110, 190) - 100;
  }
  if (velocity > 4) {
    gravity = .17
  } else {
    gravity = .25
  }
 } else {
  rotation = 0;
 }
 $(player).css({
  rotate: rotation,
  top: position
 });
}
function gameloop() {
 var player = $("#player");
 velocity += gravity;
 position += velocity;
 updatePlayer(player);
 var box = document.getElementById('player').getBoundingClientRect();
 var origwidth = 34.0;
 var origheight = 24.0;
 var boxwidth = origwidth - (Math.sin(Math.abs(rotation) / 100) * 11);
 var boxheight = ((origheight + box.height) / 2) - 1;
 var boxleft = (((box.width - boxwidth) / 2) + box.left) - 12;
 var boxtop = ((box.height - boxheight) / 2) + box.top + 2;
 var boxright = boxleft + boxwidth + 11;
 var boxbottom = boxtop + boxheight - 3;
 if (box.bottom >= $("#land").offset().top) {
  playerDead();
  return;
 }
 if (pipes[0] == null)
  return;
 var nextpipe = pipes[0];
 var nextpipeupper = nextpipe.children(".pipe_upper");
 var pipetop = nextpipeupper.offset().top + nextpipeupper.height();
 var pipeleft = nextpipeupper.offset().left - 2;
 var piperight = pipeleft + pipewidth;
 var pipebottom = pipetop + pipeheight;
 if (boxleft < piperight && boxright > pipeleft) {
  if (boxtop > pipetop && boxbottom < pipebottom) { } else {
   playerDead();
   return;
  }
 }
 if (boxleft + 20 > piperight) {
  pipes.splice(0, 1);
  playerScore();
 }
}
$(document).keydown(function (e) {
 if (e.keyCode == 32) {
  if (currentstate == states.ScoreScreen)
   $("#replay").click();
  else
   screenClick();
 }
});
if ("ontouchstart" in window)
 $(document).on("touchstart", screenClick);
else
 $(document).on("mousedown", screenClick);
function screenClick() {
 if (currentstate == states.GameScreen) {
  playerJump();
 } else if (currentstate == states.SplashScreen) {
  startGame();
 }
}
function playerJump() {
 velocity = jump;
 soundJump.stop();
 soundJump.play();
}
function setBigScore(erase) {
 var elemscore = $("#bigscore");
 elemscore.empty();
 if (erase)
  return;
 var digits = score.toString().split('');
 for (var i = 0; i < digits.length; i++)
  elemscore.append(digits[i]);
}
function setSmallScore() {
 var elemscore = $("#currentscore");
 elemscore.empty();
 var digits = score.toString().split('');
 for (var i = 0; i < digits.length; i++)
  elemscore.append(digits[i]);
}
function setHighScore() {
 var elemscore = $("#highscore");
 elemscore.empty();
 var digits = highscore.toString().split('');
 for (var i = 0; i < digits.length; i++)
  elemscore.append(digits[i]);
}
function setMedal() {
 var elemmedal = $("#medal");
 elemmedal.empty();
 if (score < 10)
  return false;
 if (score >= 10)
  medal = "bronze";
 if (score >= 20)
  medal = "silver";
 if (score >= 30)
  medal = "gold";
 if (score >= 40)
  medal = "platinum";
 elemmedal.append('<img src="assets/medal_' + medal + '.png" alt="' + medal + '">');
 return true;
}
function playerDead() {
 $(".animated").css('animation-play-state', 'paused');
 $(".animated").css('-webkit-animation-play-state', 'paused');
 var playerbottom = $("#player").position().top + $("#player").width();
 var floor = flyArea;
 var movey = Math.max(0, floor - playerbottom);
 $("#player").transition({
  y: movey + 'px',
  rotate: 90
 }, 1000, 'easeInOutCubic');
 currentstate = states.ScoreScreen;
 clearInterval(loopGameloop);
 clearInterval(loopPipeloop);
 loopGameloop = null;
 loopPipeloop = null;
 if (isIncompatible.any()) {
  showScore();
 } else {
  soundHit.play().bindOnce("ended", function () {
   soundDie.play().bindOnce("ended", function () {
    showScore();
   });
  });
 }
}
function showScore() {
 $("#scoreboard").css("display", "block");
 setBigScore(true);
 if (score > highscore) {
  highscore = score;
  setCookie("highscore", highscore, 999);
 }
 setSmallScore();
 setHighScore();
 var wonmedal = setMedal();
 soundSwoosh.stop();
 soundSwoosh.play();
 $("#scoreboard").css({
  y: '40px',
  opacity: 0
 });
 $("#replay").css({
  y: '40px',
  opacity: 0
 });
 $("#scoreboard").transition({
  y: '0px',
  opacity: 1
 }, 600, 'ease', function () {
  soundSwoosh.stop();
  soundSwoosh.play();
  $("#replay").transition({
   y: '0px',
   opacity: 1
  }, 600, 'ease');
  if (wonmedal) {
   $("#medal").css({
    scale: 2,
    opacity: 0
   });
   $("#medal").transition({
    opacity: 1,
    scale: 1
   }, 1200, 'ease');
  }
 });
 replayclickable = true;
}
$("#replay").click(function () {
 if (!replayclickable)
  return;
 else
  replayclickable = false;
 soundSwoosh.stop();
 soundSwoosh.play();
 $("#scoreboard").transition({
  y: '-40px',
  opacity: 0
 }, 1000, 'ease', function () {
  $("#scoreboard").css("display", "none");
  showSplash();
 });
});
function playerScore() {
 score += 1;
 soundScore.stop();
 soundScore.play();
 setBigScore();
}
function updatePipes() {
 $(".pipe").filter(function () {
  return $(this).position().left <= -100;
 }).remove();
 var padding = 50;
 var constraint = flyArea - pipeheight - (padding * 2);
 var topheight = Math.floor((Math.random() * constraint) + padding);
 var bottomheight = (flyArea - pipeheight) - topheight;
 var newpipe = $('<div class="pipe animated"><div class="pipe_upper" style="height: ' + topheight + 'px;"></div><div class="pipe_lower" style="height: ' + bottomheight + 'px;"></div></div>');
 $("#flyarea").append(newpipe);
 pipes.push(newpipe);
}
var isIncompatible = {
 Android: function () {
  return navigator.userAgent.match(/Android/i);
 },
 BlackBerry: function () {
  return navigator.userAgent.match(/BlackBerry/i);
 },
 iOS: function () {
  return navigator.userAgent.match(/iPhone|iPad|iPod/i);
 },
 Opera: function () {
  return navigator.userAgent.match(/Opera Mini/i);
 },
 Safari: function () {
  return (navigator.userAgent.match(/OS X.*Safari/) && !navigator.userAgent.match(/Chrome/));
 },
 Windows: function () {
  return navigator.userAgent.match(/IEMobile/i);
 },
 any: function () {
  return (isIncompatible.Android() || isIncompatible.BlackBerry() || isIncompatible.iOS() || isIncompatible.Opera() || isIncompatible.Safari() || isIncompatible.Windows());
 }
};
