// Initialize variables
var pressCount = 0;
var activescreen = ""; // Initialize to an empty string
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

// Array of speaker button IDs (Consider using classes for easier selection)
var speakerButtons = [
    "SpeakerButtonSad",
    "SpeakerButtonAngry",
    "SpeakerButtonScared",
    "SpeakerButtonHappy"
];

var CorrectSFX = [
    "assets/Correct-Good-Job.mp3",
    "assets/Excellent.mp3",
    "assets/Fantastic.mp3",
    "assets/Way-to-go.mp3"
];

var WrongSFX = [
    "assets/A-different-way.mp3",
    "assets/Almost-there.mp3",
    "assets/Wrong-Try-Again.mp3",
    "assets/Hmmm.mp3"
];

// Array of corresponding sound files for emotions
var soundFiles = [
    "assets/Sad-sounds.mp3",
    "assets/Angry.mp3",
    "assets/scared-sounds.mp3",
    "assets/Happy-Sound.mp3"
];

// --- Utility Functions ---

// Function to show a screen and hide others
function showScreen(screenId) {
    $(".screen").hide();
    $("#" + screenId).show();
    activescreen = screenId;
    console.log("Showing screen:", screenId); // Debugging
}

// Function to play a sound
function playSound(soundFile) {
    var audio = new Audio(soundFile);
    audio.play();
}

// --- Device Selection ---

$("#Desktop").click(function() {
    onmobile = false;
    $(".speaker-button").hide();
    showScreen("NameInputScreen");
});

$("#Mobile").click(function() {
    onmobile = true;
    $(".speaker-button").show();
    showScreen("NameInputScreen");
});

// --- Name Input Screen ---

$("#name-enter-button").click(function() {
    let userName = $("#name-input-field").val();
    let greetingText = userName ? "Hi, " + userName + "!" : "Hi!"; // Ternary operator
    $("#greeting-message").text(greetingText);
    showScreen("GreetingScreen");
    if (!userName) {
        alert("Please enter your name!");
    }
});

$("#credits-button").click(function() {
    showScreen("CreditsScreen");
});

$("#data-button").click(function() {
    showScreen("DataDisplayScreen");
});

// --- Greeting Screen ---

$("#begin-button").click(function() {
    showScreen("Gsad");
});

// --- Emotion Screens ---

function handleEmotionClick(selectedEmotion, correctEmotion, nextScreen) {
    if (selectedEmotion === correctEmotion) {
        playSound(CorrectSFX[Math.floor(Math.random() * CorrectSFX.length)]);
        showScreen("CorrectScreen");
        $("#continue-button").data("nextScreen", nextScreen);
    } else {
        playSound(WrongSFX[Math.floor(Math.random() * WrongSFX.length)]);
    }
}

$("#SadButton").click(function() {
    handleEmotionClick("Sad", "Sad", "Gangry");
});

$("#AngryButton").click(function() {
    handleEmotionClick("Angry", "Angry", "Gscared");
});

$("#ScaredButton").click(function() {
    handleEmotionClick("Scared", "Scared", "Ghappy");
});

$("#HappyButton").click(function() {
    handleEmotionClick("Happy", "Happy", "CorrectScreen");
});

// --- Speaker Buttons ---

function attachSpeakerSound(buttonId, soundFile) {
    $("#" + buttonId).click(function() {
        playSound(soundFile);
    });
}

speakerButtons.forEach((buttonId, index) => {
    attachSpeakerSound(buttonId, soundFiles[index]);
});

// --- Correct Screen ---

$("#continue-button").click(function() {
    let nextScreen = $(this).data("nextScreen");
    if (nextScreen) {
        showScreen(nextScreen);
    } else {
        showScreen("FinishScreen");
    }
});

// --- Finish Screen ---

$("#restart-button").click(function() {
    showScreen("MorD");
});

// --- "X" Buttons ---
$("#CreditX").click(function() {
    showScreen("NameInputScreen"); // Or "MorD" if you want to go back to the beginning
});

$("#DataX").click(function() {
    showScreen("NameInputScreen"); // Or "MorD"
});

// --- Initialization ---

$(document).ready(function() {
    showScreen("MorD");
});