// game.js
// Quantum Shift quiz engine with simple streak + progress logic and sound effects.

/* global $, document */

(function () {
    "use strict";

    var questions = [
        {
            text: "Which keyword declares a variable that can change value?",
            choices: ["const", "let", "define", "static"],
            correctIndex: 1,
            topic: "JavaScript"
        },
        {
            text: "Which CSS property controls the space inside an element's border?",
            choices: ["margin", "padding", "border-radius", "gap"],
            correctIndex: 1,
            topic: "CSS"
        },
        {
            text: "What does DOM stand for?",
            choices: [
                "Document Object Model",
                "Data Object Map",
                "Dynamic Output Manager",
                "Document Order Matrix"
            ],
            correctIndex: 0,
            topic: "DOM & Events"
        },
        {
            text: "Which selector targets a class named 'btn-primary'?",
            choices: [".btn-primary", "#btn-primary", "btn-primary", "@btn-primary"],
            correctIndex: 0,
            topic: "CSS"
        },
        {
            text: "Which operator is used for strict equality comparison in JavaScript?",
            choices: ["=", "==", "===", "!=="],
            correctIndex: 2,
            topic: "JavaScript"
        },
        {
            text: "In JavaScript, which method writes a message to the browser's console?",
            choices: ["print()", "console.log()", "alert()", "log.console()"],
            correctIndex: 1,
            topic: "JavaScript"
        },
        {
            text: "Which CSS layout tool makes it easy to align items horizontally and vertically?",
            choices: ["float", "grid", "flexbox", "inline-block"],
            correctIndex: 2,
            topic: "CSS"
        }
    ];

    var index = 0;
    var score = 0;
    var streak = 0;
    var acceptingAnswers = true;

    var questionNumberSpan;
    var totalQuestionsSpan;
    var scoreSpan;
    var streakSpan;
    var questionTopicSpan;
    var questionTextHeading;
    var answerList;
    var nextButton;
    var restartButton;
    var srStatus;
    var progressFill;
    var finalScoreDialog;
    var finalScoreText;

    var correctSound;
    var wrongSound;

    function loadSounds() {
        try {
            correctSound = new Audio("audio/correct.wav");
            wrongSound = new Audio("audio/wrong.wav");
        } catch (e) {
            correctSound = null;
            wrongSound = null;
        }
    }

    function cacheElements() {
        questionNumberSpan = document.getElementById("questionNumber");
        totalQuestionsSpan = document.getElementById("totalQuestions");
        scoreSpan = document.getElementById("score");
        streakSpan = document.getElementById("streak");
        questionTopicSpan = document.getElementById("questionTopic");
        questionTextHeading = document.getElementById("questionText");
        answerList = document.getElementById("answerList");
        nextButton = document.getElementById("nextQuestionBtn");
        restartButton = document.getElementById("restartGameBtn");
        srStatus = document.getElementById("sr-status");
        progressFill = document.getElementById("progressFill");
        finalScoreDialog = $("#finalScoreDialog");
        finalScoreText = document.getElementById("finalScoreText");
    }

    function updateScreenReaderStatus(message) {
        if (srStatus) {
            srStatus.textContent = message;
        }
    }

    function updateProgressBar() {
        var progress = 0;
        if (questions.length > 0) {
            progress = (score / questions.length) * 100;
        }
        if (progressFill) {
            progressFill.style.width = Math.max(5, progress) + "%";
        }
    }

    function renderQuestion() {
        var q = questions[index];

        if (!q) {
            return;
        }

        questionNumberSpan.textContent = (index + 1).toString();
        questionTopicSpan.textContent = "Topic: " + q.topic;
        questionTextHeading.textContent = q.text;

        answerList.innerHTML = "";
        q.choices.forEach(function (choice, i) {
            var li = document.createElement("li");
            var btn = document.createElement("button");

            btn.type = "button";
            btn.className = "btn text-left";
            btn.textContent = choice;
            btn.dataset.index = i.toString();

            btn.addEventListener("click", onAnswerClick);

            li.appendChild(btn);
            answerList.appendChild(li);
        });

        acceptingAnswers = true;
        nextButton.disabled = true;
        updateScreenReaderStatus("Question " + (index + 1) + " of " + questions.length + " loaded.");
    }

    function playSound(isCorrect) {
        var sound = isCorrect ? correctSound : wrongSound;
        if (!sound) {
            return;
        }
        try {
            sound.currentTime = 0;
            sound.play();
        } catch (e) {
            // If audio cannot play, fail silently.
        }
    }

    function onAnswerClick(event) {
        if (!acceptingAnswers) {
            return;
        }

        var btn = event.currentTarget;
        var chosenIndex = parseInt(btn.dataset.index, 10);
        var q = questions[index];

        acceptingAnswers = false;

        var correct = chosenIndex === q.correctIndex;
        var buttons = answerList.querySelectorAll("button");

        buttons.forEach(function (b, i) {
            b.disabled = true;
            if (i === q.correctIndex) {
                b.classList.add("btn-primary");
            }
        });

        if (correct) {
            score += 1;
            streak += 1;
            scoreSpan.textContent = score.toString();
            streakSpan.textContent = streak.toString();
            btn.classList.add("btn-primary");
            playSound(true);
            updateScreenReaderStatus("Correct. Score " + score + ".");
        } else {
            streak = 0;
            streakSpan.textContent = "0";
            btn.classList.add("btn-ghost");
            playSound(false);
            updateScreenReaderStatus("Incorrect. The correct answer has been highlighted.");
        }

        updateProgressBar();

        nextButton.disabled = false;
    }

    function showFinalScore() {
        if (!finalScoreDialog.data("uiDialog")) {
            finalScoreDialog.dialog({
                modal: true,
                buttons: {
                    "Play again": function () {
                        $(this).dialog("close");
                        restartGame();
                    },
                    "Close": function () {
                        $(this).dialog("close");
                    }
                }
            });
        }

        finalScoreText.textContent = "You scored " + score + " out of " + questions.length + ".";
        finalScoreDialog.dialog("open");
        updateScreenReaderStatus("Game over. Final score " + score + " out of " + questions.length + ".");
    }

    function nextQuestion() {
        index += 1;

        if (index >= questions.length) {
            showFinalScore();
        } else {
            renderQuestion();
        }
    }

    function restartGame() {
        index = 0;
        score = 0;
        streak = 0;
        scoreSpan.textContent = "0";
        streakSpan.textContent = "0";
        updateProgressBar();
        renderQuestion();
    }

    function wireEvents() {
        nextButton.addEventListener("click", function () {
            nextQuestion();
        });

        restartButton.addEventListener("click", function () {
            restartGame();
        });
    }

    function init() {
        cacheElements();

        if (!questionTextHeading || !answerList) {
            return;
        }

        totalQuestionsSpan.textContent = questions.length.toString();
        loadSounds();
        wireEvents();
        updateProgressBar();
        renderQuestion();
    }

    $(document).ready(function () {
        init();
    });
}());
