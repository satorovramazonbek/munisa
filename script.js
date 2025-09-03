let currentQuestion = 0;
let score = { math: 0, physics: 0 };
let questions = [];

// Загрузка вопросов
fetch("questions.json")
  .then(res => res.json())
  .then(data => {
    questions = data;
  });

const startBtn = document.getElementById("startBtn");
const quiz = document.getElementById("quiz");
const questionBox = document.getElementById("questionBox");
const answers = document.getElementById("answers");
const nextBtn = document.getElementById("nextBtn");
const resultBox = document.getElementById("result");
const resultText = document.getElementById("resultText");
const retryBtn = document.getElementById("retryBtn");
const shareBtn = document.getElementById("shareBtn");

let selectedAnswer = null;

startBtn.addEventListener("click", () => {
  startBtn.style.display = "none";
  quiz.classList.remove("hidden");
  showQuestion();
});

function showQuestion() {
  nextBtn.disabled = true;
  selectedAnswer = null;
  let q = questions[currentQuestion];
  questionBox.innerHTML = `<h3>${q.q}</h3>`;
  answers.innerHTML = "";
  q.options.forEach((opt, index) => {
    let li = document.createElement("li");
    li.textContent = opt;
    li.addEventListener("click", () => selectAnswer(index));
    answers.appendChild(li);
  });
}

function selectAnswer(index) {
  selectedAnswer = index;
  [...answers.children].forEach(li => li.style.background = "white");
  answers.children[index].style.background = "#d4f7d4";
  nextBtn.disabled = false;
}

nextBtn.addEventListener("click", () => {
  if (selectedAnswer === questions[currentQuestion].answer) {
    score[questions[currentQuestion].category]++;
  }

  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  quiz.classList.add("hidden");
  resultBox.classList.remove("hidden");

  let mathPercent = Math.round((score.math / 7) * 100);
  let physPercent = Math.round((score.physics / 8) * 100);

  let ctx = document.getElementById("resultChart");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Математическая логика", "Физическое мышление"],
      datasets: [{
        label: "Результаты (%)",
        data: [mathPercent, physPercent],
        backgroundColor: ["#4CAF50", "#2196F3"]
      }]
    }
  });

  function interp(p) {
    if (p > 70) return "Отличные способности!";
    if (p >= 40) return "Хороший уровень, есть куда расти.";
    return "Требует внимания.";
  }

  resultText.innerHTML = `
    Математика — ${mathPercent}% (${interp(mathPercent)})<br>
    Физика — ${physPercent}% (${interp(physPercent)})
  `;
}

retryBtn.addEventListener("click", () => location.reload());
shareBtn.addEventListener("click", () => {
  alert("Поделиться результатом можно скриншотом :)");
});
