document.getElementById("startQuiz").addEventListener("click", fetchQuiz);

function fetchQuiz() {
    fetch("http://localhost:9090/api/questions/random/5")
        .then(response => response.json())
        .then(questions => displayQuiz(questions))
        .catch(error => console.error("Error fetching questions:", error));
}

function displayQuiz(questions) {
    const quizContainer = document.getElementById("quizContainer");
    quizContainer.innerHTML = "";

    questions.forEach((question, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("question");
        questionDiv.innerHTML = `<h3>${index + 1}. ${question.questionText}</h3>`;

        const optionsDiv = document.createElement("div");
        optionsDiv.classList.add("options");

        question.options.forEach(option => {
            const button = document.createElement("button");
            button.textContent = option;
            button.onclick = () => alert(`You selected: ${option}`);
            optionsDiv.appendChild(button);
        });

        questionDiv.appendChild(optionsDiv);
        quizContainer.appendChild(questionDiv);
    });
}
