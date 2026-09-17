  // Initialize variables
var pressCount = 0;
var activescreen;
var giftimeout;
var PlayCount = 0;
var firstTime = false;
var gifreply = 4000;
var giflength = 2000;
var DataScreenPress = 1;
var FinishI = 1;
var ButtonData = [
  ["Sclick", "Hclick", "Fclick", "Aclick"],
  [0, 0, 0, 0]
  ];
var dataArray = [];

var stageodr;
var stagenameodr;
var onmobile = false;
// Array of speaker button IDs
var speakerButtons = [
  "SpeakerButton1", "SpeakerButton2", "SpeakerButton3", "SpeakerButton4",
  "SpeakerButton5", "SpeakerButton6", "SpeakerButton7", "SpeakerButton8",
  "SpeakerButton9", "SpeakerButton10", "SpeakerButton11", "SpeakerButton12",
  "SpeakerButton13", "SpeakerButton14", "SpeakerButton15", "SpeakerButton16"
];

var CorrectSFX = [
  "assets/Correct-Good-Job.mp3",
  "assets/Excellent.mp3.mp3",
  "assets/Fantastic.mp3",
  "assets/Way-to-go.mp3"
  ];
  
var WrongSFX = [
  "assets/A-different-way.mp3",
  "assets/Almost-there.mp3",
  "assets/Wrong-Try-Again.mp3",
  "assets/Hmmm.mp3"];
// Array of corresponding sound files
var soundFiles = [
  "assets/Sad-sounds.mp3", 
  "assets/Happy-Sound.mp3", 
  "assets/scared-sounds.mp3", 
  "assets/Angry.mp3", 
  "assets/Sad-sounds.mp3", 
  "assets/Happy-Sound.mp3", 
  "assets/scared-sounds.mp3", 
  "assets/Angry.mp3", 
  "assets/Sad-sounds.mp3", 
  "assets/Happy-Sound.mp3", 
  "assets/scared-sounds.mp3", 
  "assets/Angry.mp3", 
  "assets/Sad-sounds.mp3", 
  "assets/Happy-Sound.mp3", 
  "assets/scared-sounds.mp3", 
  "assets/Angry.mp3"
];

for (var i = 1; i < 5; i++)
{
  for (var n = 1; n < 5; n++)
  {
    ChangeAllData(i, n, "text-color", "rgb(91, 183, 231)");
  }
}
var prev = ["Left1", "Left2", "Left3", "Left4"];
var next = ["Right1", "Right2", "Right3", "Right4"];
function Prev(Bid){
  onEvent(Bid, "click", function(){
    if (DataScreenPress > 1){
      DataScreenPress -= 1;
      setScreen("DataScreen" + DataScreenPress);
    }
    else{
      return;
    }
  });
}
for (var i = 0; i < prev.length; i++)
{
  Prev(prev[i]);
}
function Next(Bid){
  onEvent(Bid, "click", function(){
    if (DataScreenPress < 4){
      DataScreenPress += 1;
      setScreen("DataScreen" + DataScreenPress);
    }
    else{
      return;
    }
  });
}
for (var i = 0; i < next.length; i++)
{
  Next(next[i]);
}

var OuttoMain = ["Xout", "button16", "button17", "button24", "button20"];

function Xout(buttonid) {
  this.BId = buttonid;

  this.setupEvent = function() {
    onEvent(this.BId, "click", function() {
      setScreen("EnterScreen");
    });
  };
} 
for (var i = 0; i < OuttoMain.length; i++){
  var Xbutton = new Xout(OuttoMain[i]);
  Xbutton.setupEvent();
}

onEvent("Right1", "click", function(){
  setScreen("DataScreen2");
});
// Start
// Function to set the greeting value
function setGreetingValue(Name) {
  if (firstTime == false){
    setProperty("Greeting", "font-family", "Impact");
    setProperty("Greeting", "font-size", 32);
    setProperty("Greeting", "text-align", "center");
    setProperty("Greeting", "width", 280);
    setProperty("Greeting", "height", 60);
    setProperty("Greeting", "x", 20);
    setProperty("Greeting", "y", 55);
  }
  setProperty("Greeting", "text", "Welcome, " + Name + "!");
}

// Event handler for entering the main screen
onEvent("MainEnterButton", "click", function() {
  playSound("assets/button-click-sound-fx.mp3", false);
  setScreen("StartingScreen");
  var userName = getText("NameEnter");
  setGreetingValue(userName);
});

// Event handler for the begin button
onEvent("BeginButton", "click", function() {
  stageodr = StageOrder();
  stagenameodr = [];
  onButtonPress();
  gifplayer();
  firstTime = true;
  if (PlayCount >= 4){
    PlayCount = 1;
    
  }
  else{
      PlayCount += 1;
  }

  for (var i = 0;i < 4;i++){
    var DDM = new DDMsetup("DDM" + (i + 1), (i + 1));
    DDM.setupEvent();
    
  }
});

// Game Settings
// Sets the order for the stages
function StageOrder(){
  var numbers = [];
  var arraylen = 4;
  do{
  var hello = randomNumber(1, arraylen);
  for (var i = 0; i <= numbers.length; i++)
  {
    if (numbers[i] === hello)
    {
      break;
    }
    else if(i === numbers.length)
    {
      numbers[numbers.length] = hello;
      break;
    }
  }
} while (numbers.length < arraylen);
  return numbers;
}

// Function to handle button press for sequential screens
function onButtonPress() {
  dataArray.push([activescreen, "stage " + pressCount + 1]);
  
  // Change screens based on the press count
  if (stageodr[pressCount] === 1) {
    startGame("Gangry");
    
  } else if (stageodr[pressCount] === 2) {
    startGame("Gsad");
  } else if (stageodr[pressCount] === 3) {
    startGame("Gfear");
  } else if(stageodr[pressCount] === 4){
    startGame("Ghappy");
  } else if(pressCount === 4){
    setScreen("FinalScreen1");
    FinishI += 1;
    console.log(dataArray);
    playSound("audiomass-output-(1).mp3", false);
    playSound("audiomass-output-(mp3cut.net).mp3", true);
    return;
  }
  stagenameodr.push(activescreen);
  pressCount++;
}

// Add an event listener to the button for screen change
onEvent("button1", "click", function() {
  stopCWsound(true, false);
  onButtonPress();
  gifplayer(activescreen);
});


// Function to start a game screen
function startGame(screen) {
  playSound("assets/button-click-sound-fx.mp3", false);
  setScreen(screen);
  activescreen = screen;
  
  playSound("assets/WhatEmotionIsThisPersonFeeling.wav", false);
  setupButtonSounds(screen);
}

// Event handler for GameScreen3 button (not necessary with the new logic)
onEvent("button10", "click", function() {
  setScreen("EnterScreen");
  stopSound("audiomass-output-(1).mp3");
  stopSound("audiomass-output-(mp3cut.net).mp3");
  pressCount = 0;
  InputData(PlayCount);
  setProperty("LoopIteration" + PlayCount, "text", "Play Through "+ (FinishI - 1));
  setProperty("DataDropDown" + PlayCount, "options", stagenameodr);
  dataArray = [];
});

// Function to set up sounds based on the screen
function setupButtonSounds(screen) {
  var buttons;
  if (screen === "Gangry") {
    buttons = ["SadButton", "HappyButton", "ScaredButton", "AngryButton"];
    setButtons(false, false, false, true, buttons);
  } else if (screen === "Gsad") {
    buttons = ["button2", "button3", "button4", "button5"];
    setButtons(true, false, false, false, buttons);
  } else if (screen === "Gfear") {
    buttons = ["button6", "button7", "button8", "button9"]; // Update with your actual button IDs
    setButtons(false, false, true, false, buttons);
  }
    else if (screen === "Ghappy") {
    buttons = ["button11", "button12", "button13", "button14"]; // Update with your actual button IDs
    setButtons(false, true, false, false, buttons);
  }
}

// Function to assign sounds to buttons
function setButtons(Sad, Happy, Scared, Angry, buttons) {
  if (onmobile === false){
    playsounds(buttons[0], "assets/Sad-sounds.mp3");
    playsounds(buttons[1], "assets/Happy-Sound.mp3");
    playsounds(buttons[2], "assets/scared-sounds.mp3");
    playsounds(buttons[3], "assets/Angry.mp3");
    for (var i = 0; i < 16; i++){
      setProperty(speakerButtons[i], "hidden", true);
    }
  }
  checkWrongOrRight(Sad, Happy, Scared, Angry, buttons);
}

// Function to play sounds on button hover
function playsounds(buttonId, soundFile) {
  onEvent(buttonId, "mouseover", function() {
    stopbsound();
    playSound(soundFile, false);
  });
  onEvent(buttonId, "mouseout", function() {
    stopSound(soundFile, false);
  });
}

// Function to announce whether the answer is correct
function announceAnswer(ListOfAnswers, ListNum) {
  if (ListOfAnswers[ListNum] == true) {
    for (var i = 0; i < 4; i++)
    {
      if (ButtonData[1][i] == 1){
        dataArray[pressCount - 1].push((ButtonData[1][i]));
      }
      else{
        dataArray[pressCount - 1].push((ButtonData[1][i] / FinishI));
      }
    }
    ButtonData = [
    ["Sclick", "Hclick", "Fclick", "Aclick"],
    [0, 0, 0, 0]
    ];
    setScreen("CorrectScreen");
    stopbsound();
    RandomSoundFiles(CorrectSFX);
  } else {
    stopbsound();
    RandomSoundFiles(WrongSFX);
  }
}

// Function to check if the answer is right or wrong
function checkWrongOrRight(Sad, Happy, Scared, Angry, buttons) {
  var SWR = [Sad, Happy, Scared, Angry];

  onEvent(buttons[0], "click", function() {    
    ButtonData[1][0] += 1;
    announceAnswer(SWR, 0);

  });
  onEvent(buttons[1], "click", function() {
    ButtonData[1][1] += 1;
    announceAnswer(SWR, 1);

  });
  onEvent(buttons[2], "click", function() {   
    ButtonData[1][2] += 1;
    announceAnswer(SWR, 2);

  });
  onEvent(buttons[3], "click", function() {
    ButtonData[1][3] += 1;
    announceAnswer(SWR, 3);

  });
}

// Function to set up speaker buttons
function setupSpeakerButtons() {
  for (var i = 0; i < speakerButtons.length; i++) {
    SpkrChck(i);
  }
}

function SpkrChck(index) {
  // Speaker Check
      onEvent(speakerButtons[index], "click", function() {
        stopbsound();
        playSound(soundFiles[index], false);
      });
    }

// Call the setup function where appropriate
setupSpeakerButtons();

function gifplayer(){
  timedLoop(gifreply, function()
  {
    var screen = activescreen;
    
    switch(screen){
      case "Gangry":
        peekaboogif("Mad.gif", "angry-image");
        break;
      case "Gsad":
        peekaboogif("sad.gif", "sad-image");
        break;
      case "Gfear":
        peekaboogif("image3.gif", "image3");
        break;
      case "Ghappy":
        peekaboogif("happy.gif", "happy-image");
        break;
      default:
        stopTimedLoop();
        break;
    }
  });
}

function stopgif(gif, picture)
{
  giftimeout = setTimeout(function() {
    setProperty(gif, "hidden", true);
    setProperty(picture,"hidden",false);
    clearTimeout(giftimeout);
  }, giflength);
}

function peekaboogif(gif, picture){
  setProperty(picture,"hidden",true);
  setProperty(gif,"hidden",false);
  stopgif(gif, picture);
}
onEvent("Mobile", "click", function( ) {
	onmobile = true;
	setScreen("EnterScreen");
	playSound("GOLDILOCKS-(mp3cut.net)-(1).mp3", true);
});
onEvent("Desktop", "click", function( ) {
	onmobile = false;
	setScreen("EnterScreen");
	playSound("GOLDILOCKS-(mp3cut.net)-(1).mp3", true);
});

function stopbsound(){
  // specificly stops sound of buttons
  for (var i = 0; i < 4; i++){
    stopSound(soundFiles[i]);
  }
  stopCWsound();
  
  
  
}

onEvent("Data", "click", function() {
  setScreen("DataScreen1");
});

function InputData(PlayCount)
{
  for (var i = 0; i< 4; i++){
    setProperty("Title" + PlayCount + ":" + (i + 1),  "text", dataArray[i+ 1][0]);
    SetData("Spress", 2, PlayCount, i);
    SetData("Hpress", 3, PlayCount, i);
    SetData("Fpress", 4, PlayCount, i);
    SetData("Apress", 5, PlayCount, i);

  }
}
function SetData(changed, changer, PlayCount, i)
{
  setProperty(changed + PlayCount + ":" + (i + 1),  "text", dataArray[i][changer]);
}
function RunDDM(Num)
{
  onEvent("DataDropDown" + Num, "change", function(){
    
    var ScreenData = getProperty("DataDropDown" + Num, "value");
    var DDdataindex;
    if (pressCount == 1){
       DDdataindex = stagenameodr.indexOf(ScreenData);
    }
    else{
       DDdataindex = (stagenameodr.indexOf(ScreenData));
    }
    console.log(DDdataindex);
    DDdataindex = DDdataindex += 1;
    ShowDDM((DDdataindex), Num);
  });
}

function DDMsetup(Name, DDMnum){
  this.Name = Name;
  this.DDMnum = DDMnum;
  
  this.setupEvent = function(){
    RunDDM(DDMnum);
  };
}
function ShowDDM(DDdataindex, Num){
  for (var i = 0; i < 4; i++){
    var n = i+1;
    ChangeAllData(Num, n, "hidden", true); 
  }
    ChangeAllData(Num, DDdataindex, "hidden", false);
}
function ChangeAllData(Loop, Scene, Property, Value){
    setProperty("Apress" + Loop + ":" + Scene,  Property, Value);
    setProperty("Spress" + Loop + ":" + Scene,  Property, Value);
    setProperty("Fpress" + Loop + ":" + Scene,  Property, Value);
    setProperty("Hpress" + Loop + ":" + Scene,  Property, Value);
    setProperty("Title" + Loop + ":" + Scene,  Property, Value);
}

onEvent("Website", "click", function(){
  open("https://sites.google.com/stocktonusd.org/roguetitanstudios/features/little-big-emotion");
});
onEvent("Credit", "click", function(){
  setScreen("Credits");
});

function RandomSoundFiles(SoundList){
  var ello = randomNumber(0, 3);
  stopCWsound(true, true);
  stopbsound();
  playSound(SoundList[ello], false);
}

function stopCWsound(Correct, Wrong){
  for(var i = 0; i < 4; i++){
    if (Correct){
      stopSound(CorrectSFX[i]);
    }
    if (Wrong){
      stopSound(WrongSFX[i]);
    }
  }
}