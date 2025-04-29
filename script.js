// Utility function
function playSound(soundFile) {
    var audio = new Audio(soundFile);
    audio.play();
}

class ScreenManager {
    constructor() {
        this.screens = $(".screen");
        this.activeScreen = "";
    }

    showScreen(screenId) {
        this.screens.hide();
        $("#" + screenId).show();
        this.activeScreen = screenId;
        console.log("Showing screen:", screenId);
        window.game.attachEmotionButtonHandlers(); // Attach handlers after showing screen
    }

    getActiveScreen() {
        return this.activeScreen;
    }
}

class Emotion {
    constructor(name, imageId, questionId, buttonIds, soundFiles, nextScreen) {
        this.name = name;
        this.imageId = imageId;
        this.questionId = questionId;
        this.buttonIds = buttonIds;
        this.soundFiles = soundFiles;
        this.nextScreen = nextScreen;
        this.correctSFX = [
            "assets/Correct-Good-Job.mp3",
            "assets/Excellent.mp3",
            "assets/Fantastic.mp3",
            "assets/Way-to-go.mp3"
        ];
        this.wrongSFX = [
            "assets/A-different-way.mp3",
            "assets/Almost-there.mp3",
            "assets/Wrong-Try-Again.mp3",
            "assets/Hmmm.mp3"
        ];
        this.buttons = {};
        for (const key in buttonIds) {
            this.buttons[key] = $("#" + buttonIds[key]);
            console.log(`  - Emotion ${name}: Button ${key}:`, this.buttons[key]);
        }
    }

    handleButtonClick(clickedButtonName, emotionName) {
        console.log(`---ACTION--- Button ${clickedButtonName} clicked for ${emotionName}`);
        // Direct comparison with emotion name
        if (clickedButtonName === emotionName) {
            playSound(this.correctSFX[Math.floor(Math.random() * this.correctSFX.length)]);
            window.game.screenManager.showScreen("CorrectScreen");
            window.game.nextEmotion();
        } else {
            playSound(this.wrongSFX[Math.floor(Math.random() * this.wrongSFX.length)]);
        }
    }

    attachSpeakerButtonHandlers() {
        for (let i = 0; i < this.buttonIds.length; i++) {
            let speakerButtonId = "SpeakerButton" + (i + 1);
            $("#" + speakerButtonId).off('click').on('click', () => {
                console.log(`Speaker button ${speakerButtonId} clicked`);
                playSound(this.soundFiles[i]);
            });
        }
    }
}

class Game {
    constructor() {
        this.screenManager = new ScreenManager();
        this.userName = "";
        this.onMobile = false;
        this.emotions = {};
        this.emotionOrder = ["Gsad", "Gangry", "Ghappy", "Gscary"];
        this.currentEmotionIndex = 0;
        this.setupEventListeners();
        console.log("Game initialized (constructor)");
        window.game = this;
    }

    createEmotions() {
        this.emotions = {
            "Gsad": new Emotion(
                "Sad",
                "sad-unicorn.png",
                "label3",
                { sad: "SadButton", happy: "HappyButton", scared: "ScaredButton", angry: "AngryButton" },
                ["assets/Sad-sounds.mp3", "assets/Happy-Sound.mp3", "assets/scared-sounds.mp3", "assets/Angry.mp3"],
                "Gangry"
            ),
            "Gangry": new Emotion(
                "Angry",
                "angry-unicorn.png",
                "label4",
                { sad: "SadButton", happy: "HappyButton", scared: "ScaredButton", angry: "AngryButton" },
                ["assets/Sad-sounds.mp3", "assets/Happy-Sound.mp3", "assets/scared-sounds.mp3", "assets/Angry.mp3"],
                "Ghappy"
            ),
            "Ghappy": new Emotion(
                "Happy",
                "happy-unicorn.png",
                "label5",
                { sad: "SadButton", happy: "HappyButton", scared: "ScaredButton", angry: "AngryButton" },
                ["assets/Sad-sounds.mp3", "assets/Happy-Sound.mp3", "assets/scared-sounds.mp3", "assets/Angry.mp3"],
                "Gscary"
            ),
            "Gscary": new Emotion(
                "Scared",
                "scary-unicorn.png",
                "label6",
                { sad: "SadButton", happy: "HappyButton", scared: "ScaredButton", angry: "AngryButton" },
                ["assets/Sad-sounds.mp3", "assets/Happy-Sound.mp3", "assets/scared-sounds.mp3", "assets/Angry.mp3"],
                "FinishScreen"
            )
        };
        console.log("Emotions created:", this.emotions);
    }

    setupEventListeners() {
        $("#Desktop").click(() => {
            this.onMobile = false;
            $(".speaker-button").hide();
            this.screenManager.showScreen("NameInputScreen");
            console.log("Desktop clicked");
        });

        $("#Mobile").click(() => {
            this.onMobile = true;
            $(".speaker-button").show();
            this.screenManager.showScreen("NameInputScreen");
            console.log("Mobile clicked");
        });

        $("#name-enter-button").click(() => this.handleNameEnter());
        $("#credits-button").click(() => this.screenManager.showScreen("CreditsScreen"));
        $("#data-button").click(() => this.screenManager.showScreen("DataDisplayScreen"));
        $("#begin-button").click(() => this.startGame());
        $("#continue-button").click(() => this.nextEmotion());
        $("#restart-button").click(() => this.screenManager.showScreen("MorD"));
        $("#credits-close-button").click(() => this.screenManager.showScreen("NameInputScreen"));
        $("#data-close-button").click(() => this.screenManager.showScreen("NameInputScreen"));
        console.log("Event listeners set up");
    }

    handleNameEnter() {
        this.userName = $("#name-input-field").val();
        let greetingText = this.userName ? "Hi, " + this.userName + "!" : "Hi!";
        $("#greeting-message").text(greetingText);
        this.screenManager.showScreen("GreetingScreen");
        if (!this.userName) {
            alert("Please enter your name!");
        }
    }

    startGame() {
        this.createEmotions();
        this.currentEmotionIndex = 0;
        this.showCurrentEmotion();
        console.log("startGame() called, showing first emotion");
    }

    showCurrentEmotion() {
        this.screenManager.showScreen(this.emotionOrder[this.currentEmotionIndex]);
    }

    nextEmotion() {
        setTimeout(() => {
            this.currentEmotionIndex++;
            if (this.currentEmotionIndex < this.emotionOrder.length) {
                this.showCurrentEmotion();
            } else {
                this.screenManager.showScreen("FinishScreen");
            }
        }, 3000);
    }

    attachEmotionButtonHandlers() {
        const emotionKey = this.emotionOrder[this.currentEmotionIndex];
        const emotion = this.emotions[emotionKey];
        const container = $("#" + emotionKey + " .emotion-button-container"); // Target the container
        container.off('click').on('click', (event) => { // Use event delegation
            if (event.target.classList.contains('emotion-button')) {
                const clickedButtonName = event.target.textContent.replace('!', ''); // Get button text
                emotion.handleButtonClick(clickedButtonName, emotion.name);
            }
        });
        emotion.attachSpeakerButtonHandlers();
    }
}

$(document).ready(() => {
    console.log("---DOM READY--- Started");
    window.game = new Game();
    console.log("Game instance created:", window.game);
    game.screenManager.showScreen("MorD");
    console.log("MorD screen shown");
    console.log("---DOM READY--- Finished");
});
