﻿var gameController = (function() {
    var gameTimerIntervalId;
    var pointTransferIntervalId;
    var textIterator = 0;
    var gameActive = false;
    var playersTurn = false;

    var _soundEffectHelper = {
        playSoundEffectDing: function() {
            var soundEffectDing = $("#soundEffectDing");
            if (soundEffectDing)
                soundEffectDing[0].play();
        },
        playSoundEffectBuzzer: function() {
            var soundEffectBuzzer = $("#soundEffectBuzzer");
            if (soundEffectBuzzer)
                soundEffectBuzzer[0].play();
        },
        playSoundEffectBeep: function() {
            var soundEffectBeep = $("#soundEffectBeep");
            if (soundEffectBeep)
                soundEffectBeep[0].play();
        },
        playSoundEffectWinner: function() {
            var soundEffectWinner = $("#soundEffectWinner");
            if (soundEffectWinner)
                soundEffectWinner[0].play();
        }
    };

    var _gamePlayHelper = {
        isGameActive: function() {
            return gameActive;
        },
        getTextIterator: function () {
            return textIterator;
        },
        endGame: function (soundBuzzer) {
            if (gameTimerIntervalId)
                clearInterval(gameTimerIntervalId);

            gameActive = false;
            this.updateTurnIndicator("reset");

            if (soundBuzzer)
                _soundEffectHelper.playSoundEffectBuzzer();
        },
        updateTurnIndicator: function(state) {
            var turnIndicator = $("#turnIndicator");
            if (turnIndicator) {
                if (state === "left") {
                    _soundEffectHelper.playSoundEffectDing();
                    turnIndicator.removeClass("glyphicon-remove");
                    turnIndicator.addClass("glyphicon-arrow-left");
                    turnIndicator.removeClass("glyphicon-arrow-right");
                } else if (state === "right") {
                    _soundEffectHelper.playSoundEffectDing();
                    turnIndicator.removeClass("glyphicon-remove");
                    turnIndicator.addClass("glyphicon-arrow-right");
                    turnIndicator.removeClass("glyphicon-arrow-left");
                } else {
                    turnIndicator.addClass("glyphicon-remove");
                    turnIndicator.removeClass("glyphicon-arrow-right");
                    turnIndicator.removeClass("glyphicon-arrow-left");
                }
            }
        },
        resetChallengeText: function () {
            this.setChallengeTextValue("");
            this.setRemainingLetters("");
            this.setCorrectLetters("");
        },
        setChallengeTextValue: function (text) {
            var challengeText = $("#challengeText");
            if (challengeText) {
                challengeText.attr("value", text);
            }
        },
        setRemainingLetters: function (value) {
            var remainingLetters = $("#remainingLetters");
            if (remainingLetters)
                remainingLetters.text(value);
        },
        setCorrectLetters: function (text) {
            var correctLetters = $("#correctLetters");
            if (correctLetters)
                correctLetters.text(text);
        },
        resetStatsAndIndicators: function () {
            this.setCompletionPercentage("0");
            this.setHitPercentage("0");
            this.setScore("0");
            this.clearChangeIndicators();
        },
        setCompletionPercentage: function(value) {
            var completionPercentage = $("#completionPercentage");

            var percentage = parseFloat(value);

            if (completionPercentage)
                completionPercentage.text(percentage.toFixed(0));
        },
        setHitPercentage: function (value) {
            var hitPercentageText = $("#hitPercentage");

            hitPercentageText.text(value);
        },
        setScore: function (value) {
            var scoreText = $("#score");

            if (scoreText)
                scoreText.text(value);
        },
        clearChangeIndicators: function () {
            this.updateHitPercentageChangeIndicator("clear");
            this.updateScoreChangeIndicator("clear");
        },
        enableScreenSelectionButtons: function () {
            var leftScreenButton = $("#leftScreenButton");
            var rightScreenButton = $("#rightScreenButton");

            leftScreenButton.removeAttr("disabled");
            rightScreenButton.removeAttr("disabled");
        },
        updateHitPercentage: function(hitPercentage) {
            var currentPercentage = this.getHitPercentage();

            this.setHitPercentage(hitPercentage);

            if (parseFloat(currentPercentage) > parseFloat(hitPercentage)) {
                this.updateHitPercentageChangeIndicator("increase");
            } else {
                this.updateHitPercentageChangeIndicator("decrease");
            }
        },
        getHitPercentage: function () {
            return $("#hitPercentage").text();
        },
        updateHitPercentageChangeIndicator: function (action) {
            var hitPercentageChangeIndicator = $("#hitPercentageChangeIndicator");
            if (hitPercentageChangeIndicator) {
                if (action === "increase") {
                    hitPercentageChangeIndicator.removeClass("glyphicon-plus");
                    hitPercentageChangeIndicator.addClass("glyphicon-minus");
                } else if (action === "decrease") {
                    hitPercentageChangeIndicator.removeClass("glyphicon-minus");
                    hitPercentageChangeIndicator.addClass("glyphicon-plus");
                } else {
                    hitPercentageChangeIndicator.removeClass("glyphicon-plus");
                    hitPercentageChangeIndicator.removeClass("glyphicon-minus");
                }
            }
        },
        updateScore: function (score) {
            var currentScore = this.getScore();
            this.setScore(score);

            if (parseFloat(currentScore) > parseFloat(score)) {
                this.updateScoreChangeIndicator("increase");
            } else {
                this.updateScoreChangeIndicator("decrease");
            }
        },
        getScore: function () {
            var scoreText = $("#score");

            if (scoreText) {
                return scoreText.text();
            } else {
                return "0";
            }
        },
        updateScoreChangeIndicator: function(action) {
            var scoreChangeIndicator = $("#scoreChangeIndicator");
            if (scoreChangeIndicator) {
                if (action === "increase") {
                    scoreChangeIndicator.removeClass("glyphicon-plus");
                    scoreChangeIndicator.addClass("glyphicon-minus");
                } else if (action === "decrease") {
                    scoreChangeIndicator.removeClass("glyphicon-minus");
                    scoreChangeIndicator.addClass("glyphicon-plus");
                } else {
                    scoreChangeIndicator.removeClass("glyphicon-plus");
                    scoreChangeIndicator.removeClass("glyphicon-minus");
                }
            }
        },
        getExpectedCharacter: function() {
            var challengeText = this.getChallengeTextValue();
            var expected = challengeText.charAt(textIterator);

            return expected;
        },
        getChallengeTextValue: function () {
            var challengeTextValue = $("#challengeText").attr("value");
            if (challengeTextValue) {
                return challengeTextValue;
            } else {
                return "";
            }
        },
        getRemainingLetters: function () {
            var remainingLetters = $("#remainingLetters");
            if (remainingLetters) {
                return remainingLetters.text();
            } else {
                return "";
            }
        },
        appendCorrectLetters: function(value) {
            var correctLetters = $("#correctLetters");
            if (correctLetters)
                correctLetters.append(value);
        },
        refreshPlayerSelectionModalState: function() {
            var leftScreenButtonAttr = $("#leftScreenButton").attr("disabled");
            var rightScreenButtonAttr = $("#rightScreenButton").attr("disabled");;

            if (typeof leftScreenButtonAttr !== "undefined" &&
                leftScreenButtonAttr !== false &&
                typeof rightScreenButtonAttr !== "undefined" &&
                rightScreenButtonAttr !== false) {
                this.updatePlayerSelectionModalState("hide");
            }
        },
        updatePlayerSelectionModalState: function(action) {
            var playerSelectionModal = $("#playerSelectionModal");
            if (action === "show") {
                playerSelectionModal.modal("show");
            } else {
                playerSelectionModal.modal("hide");
            }
        }
    };

    var _timerHelper = {
        startGameTimer: function(duration) {
            _timerHelper.setTimerValue(duration);
            if (gameTimerIntervalId)
                clearInterval(gameTimerIntervalId);

            gameTimerIntervalId = setInterval(function() {
                    --duration;
                    _timerHelper.setTimerValue(duration);
                },
                1000);
        },
        setTimerValue: function(timer) {
            var countdownTimerText = $("#countdownTimerText");
            var minutes = parseInt(timer / 60, 10);
            var seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            countdownTimerText.text(minutes + ":" + seconds);

            if (minutes === "00" && parseInt(seconds) < 10) {
                _soundEffectHelper.playSoundEffectBeep();
                countdownTimerText.addClass("finalCountdown");
            } else {
                countdownTimerText.removeClass("finalCountdown");
            }

            if (minutes === "00" && seconds === "00") {
                _gamePlayHelper.endGame(true);
            }
        },
        transferTimeToPoints: function(remainingTime) {
            var countdownTimerText = $("#countdownTimerText");
            pointTransferIntervalId = setInterval(function() {
                    --remainingTime;

                    var minutes = parseInt(remainingTime / 60, 10);
                    minutes = minutes < 10 ? "0" + minutes : minutes;

                    var seconds = parseInt(remainingTime % 60, 10);
                    seconds = seconds < 10 ? "0" + seconds : seconds;

                    countdownTimerText.text(minutes + ":" + seconds);

                    var currentScore = parseInt(_gamePlayHelper.getScore());
                    currentScore++;
                    _gamePlayHelper.setScore(currentScore);

                    if (minutes === "00" && seconds === "00") {
                        clearInterval(pointTransferIntervalId);
                    }
                },
                100);
        }
    };

    return {
        isGameActive: function() {
            return _gamePlayHelper.isGameActive();
        },
        getTextIterator: function() {
            return _gamePlayHelper.getTextIterator();
        },
        setPlayersTurn: function(value) {
            playersTurn = value;
        },
        startGame: function(gameTime) {
            textIterator = 0;
            gameActive = true;
            this.updateStartGameButtonState("disabled");
            _timerHelper.startGameTimer(gameTime);
        },
        updateStartGameButtonState: function(state) {
            var startGameButton = $("#startGameButton");
            if (state === "enabled") {
                startGameButton.removeAttr("disabled");
            } else {
                startGameButton.attr("disabled", "disabled");
            }
        },
        endGame: function(soundBuzzer) {
            _gamePlayHelper.endGame(soundBuzzer);
        },
        endGameForEarlyWinner: function (remainingTime) {
            _gamePlayHelper.endGame(false);
            _timerHelper.transferTimeToPoints(remainingTime);
            _soundEffectHelper.playSoundEffectWinner();
        },
        resetGame: function () {
            if (pointTransferIntervalId)
                clearInterval(pointTransferIntervalId);

            this.updateStartGameButtonState("disabled");
            this.updateGameControlsDisplay("hide");
            this.updateResetGameButtonState("disabled");

            _gamePlayHelper.resetChallengeText(this);
            _gamePlayHelper.resetStatsAndIndicators();
            _gamePlayHelper.enableScreenSelectionButtons();
        },
        updateGameControlsDisplay: function(action) {
            var gameControls = $("#gameControls");
            if (action === "show") {
                gameControls.show();
            } else {
                gameControls.hide();
            }
        },
        updateResetGameButtonState: function(state) {
            var resetGameButton = $("#resetGameButton");
            if (state === "enabled") {
                resetGameButton.removeAttr("disabled");
            } else {
                resetGameButton.attr("disabled", "disabled");
            }
        },
        updateDisplayForLateComer: function(timeRemaining,
            challengeTextValue,
            iterator,
            screenSelected,
            hitPercentage,
            completionPercentage,
            score) {
            this.loadChallengeText(challengeTextValue);
            this.updateTextValues(iterator);
            this.updateTurnIndicator(screenSelected);
            _timerHelper.startGameTimer(timeRemaining);

            _gamePlayHelper.updateHitPercentage(hitPercentage);
            _gamePlayHelper.setCompletionPercentage(completionPercentage);
            _gamePlayHelper.updateScore(score);
        },
        loadChallengeText: function(challengeText) {
            _gamePlayHelper.setChallengeTextValue(challengeText);
            _gamePlayHelper.setRemainingLetters(challengeText);
        },
        updateTextValues: function(iterator) {
            textIterator = iterator;
            var challengeText = _gamePlayHelper.getChallengeTextValue();
            var correctText = challengeText.substring(0, iterator);
            var remainingText = challengeText.substring(iterator);

            _gamePlayHelper.setCorrectLetters(correctText);
            _gamePlayHelper.setRemainingLetters(remainingText);
        },
        updateTurnIndicator: function (state) {
            _gamePlayHelper.updateTurnIndicator(state);
        },
        isCorrectKeyStroke: function(keyStroke) {
            var expectedCharacter = _gamePlayHelper.getExpectedCharacter();
            var correct;

            if (keyStroke === expectedCharacter && playersTurn) {
                var remainingLetters = _gamePlayHelper.getRemainingLetters();
                _gamePlayHelper.appendCorrectLetters(remainingLetters.charAt(0));
                _gamePlayHelper.setRemainingLetters(remainingLetters.substring(1));

                correct = true;
                textIterator++;
            } else {
                correct = false;
            }

            return correct;
        },
        updateStats: function(hitPercentage, completionPercentage, score) {
            _gamePlayHelper.updateHitPercentage(hitPercentage);
            _gamePlayHelper.setCompletionPercentage(completionPercentage);
            _gamePlayHelper.updateScore(score);
        },
        setScreenSelected: function(screenSelected) {
            var screenButton;
            if (screenSelected === "left") {
                screenButton = $("#leftScreenButton");
            } else {
                screenButton = $("#rightScreenButton");
            }
            screenButton.attr("disabled", "disabled");

            _gamePlayHelper.refreshPlayerSelectionModalState();
        },
        updatePlayerSelectionModal: function(action) {
            _gamePlayHelper.updatePlayerSelectionModalState(action);
        },
        flashBackground: function(isActivePlayer) {
            var body = $("html body");
            if (isActivePlayer) {
                body.animate({ "background-color": "green" }, 50);
                body.animate({ "background-color": "" }, 50);
            } else {
                body.animate({ "background-color": "red" }, 50);
                body.animate({ "background-color": "" }, 50);
            }
        }
    };
}());