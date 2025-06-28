const themes = [
  { name: 'Geografia', file: 'projeto2/geografia.json' },
  { name: 'Literatura', file: 'projeto2/literatura.json' },
  { name: 'Ciências', file: 'projeto2/ciencias.json' }
];

let currentQuestion = 0;
let score = 0;
let questions = [];
let selectedTheme = null;

const introScreen = document.getElementById('intro-screen');
const themeScreen = document.getElementById('theme-screen');
const quizScreen = document.getElementById('quiz-screen');
const questionEl = document.getElementById('question');
const answersForm = document.getElementById('answers');
const submitBtn = document.getElementById('submit');
const resultEl = document.getElementById('result');
const resultText = document.getElementById('result-text');
const themeNameEl = document.getElementById('theme-name');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

// Embaralhar array (Fisher-Yates)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Início do jogo
startBtn.addEventListener('click', () => {
  introScreen.classList.add('hidden');
  themeScreen.classList.remove('hidden');

  selectedTheme = themes[Math.floor(Math.random() * themes.length)];
  themeNameEl.textContent = selectedTheme.name;

  setTimeout(() => {
    themeScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    startQuiz(selectedTheme.file);
  }, 3000);
});

// Reiniciar o quiz
restartBtn.addEventListener('click', () => {
  resultEl.classList.add('hidden');
  introScreen.classList.remove('hidden');
});

function startQuiz(themeFile) {
  fetch(themeFile)
    .then(res => res.json())
    .then(data => {
      // Sorteia 10 perguntas aleatórias
      questions = shuffle(data).slice(0, 10);
      currentQuestion = 0;
      score = 0;
      loadQuestion();
    });
}

function loadQuestion() {
  const q = questions[currentQuestion];
  questionEl.textContent = `(${currentQuestion + 1}/10) ${q.question}`;
  answersForm.innerHTML = '';

  // Cria uma lista de opções com chave + texto
  const optionList = Object.entries(q.options);
  const shuffledOptions = shuffle(optionList);

  for (let [key, value] of shuffledOptions) {
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'answer';
    input.id = key;
    input.value = key;

    const label = document.createElement('label');
    label.htmlFor = key;
    label.textContent = value;
    label.classList.add('option-label');

    input.addEventListener('change', () => {
      submitBtn.disabled = false;
    });

    answersForm.appendChild(input);
    answersForm.appendChild(label);
  }

  submitBtn.disabled = true;
}

submitBtn.addEventListener('click', () => {
  const selected = document.querySelector('input[name="answer"]:checked');
  if (!selected) return;

  const answer = selected.value;
  const correctAnswer = questions[currentQuestion].correct;

  submitBtn.disabled = true;
  const inputs = document.querySelectorAll('input[name="answer"]');
  inputs.forEach(input => input.disabled = true);

  const selectedLabel = document.querySelector(`label[for="${answer}"]`);
  const correctLabel = document.querySelector(`label[for="${correctAnswer}"]`);

  if (answer === correctAnswer) {
    score++;
    selectedLabel.classList.add('correct');
  } else {
    selectedLabel.classList.add('incorrect');
    correctLabel.classList.add('correct');
  }

  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion >= questions.length) {
      showResult();
    } else {
      loadQuestion();
    }
  }, 3000);
});

function showResult() {
  quizScreen.classList.add('hidden');
  resultEl.classList.remove('hidden');
  resultText.textContent = `Você acertou ${score} de ${questions.length} perguntas no tema "${selectedTheme.name}".`;
}


