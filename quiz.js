document.addEventListener("DOMContentLoaded", () => {
    const gameContainer = document.getElementById("game-container");
    let currentQuestionIndex = 0;
    let score = 0;
    let questions = [];

    // Load and parse XML
    fetch("quiz.xml")
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(data, "application/xml");

            if (xml.querySelector("parsererror")) {
                throw new Error("Error parsing XML data.");
            }

            questions = Array.from(xml.getElementsByTagName("question"));
            displayQuestion();
        })
        .catch(error => {
            console.error("Failed to load quiz:", error);
            gameContainer.innerHTML = "<p>Error loading quiz. Please try again later.</p>";
        });

    // Display current question
    function displayQuestion() {
        if (currentQuestionIndex >= questions.length) {
            gameContainer.innerHTML = `
                <h2>Quiz Complete!</h2>
                <p>Your score: ${score} / ${questions.length}</p>
                <button onclick="restartGame()">Restart Quiz</button>
            `;
            return;
        }

        const question = questions[currentQuestionIndex];
        const questionText = question.getElementsByTagName("text")[0].textContent;
        const options = Array.from(question.getElementsByTagName("option"));
        const correctAnswer = question.getElementsByTagName("answer")[0].textContent;

        let optionsHtml = options
            .map(option => `
                <button onclick="checkAnswer('${option.textContent.charAt(0)}', '${correctAnswer}')">
                    ${option.textContent}
                </button>
            `)
            .join("");

        gameContainer.innerHTML = `
            <div>
                <h2>Question ${currentQuestionIndex + 1}</h2>
                <p>${questionText}</p>
                ${optionsHtml}
            </div>
        `;
    }

    // Check the answer
    window.checkAnswer = function (selected, correct) {
        if (selected === correct) {
            score++;
            alert("Correct!");
        } else {
            alert(`Wrong! The correct answer was ${correct}.`);
        }
        currentQuestionIndex++;
        displayQuestion();
    };

    // Restart game
    window.restartGame = function () {
        currentQuestionIndex = 0;
        score = 0;
        displayQuestion();
    };
});
