/* =====================================================
   BRAINRUSH QUIZ
   ===================================================== */


/* =====================================================
   CONFIG
   ===================================================== */

const QUESTION_TIME = 15; // seconds allowed per question


/* =====================================================
   GAME VARIABLES
   ===================================================== */

let selectedSubject = "";
let selectedDifficulty = "";
let questions = [];
let currentQuestion = 0;
let score = 0;
let streak = 0;
let correctCount = 0;
let wrongCount = 0;
let timeLeft = QUESTION_TIME;
let timer = null;

let answered = false;       // guards against double-advancing a question
let timerPaused = false;    // true while a confirm modal is covering the timer

let modalAction = null;
let modalResumeOnCancel = false;


/* =====================================================
   QUESTION DATABASE
   ===================================================== */

const questionBank = {

    Math: {
        easy: [
            { q: "What is 5 + 7?", a: ["10", "11", "12", "13"], correct: 2 },
            { q: "What is 8 × 3?", a: ["21", "24", "26", "28"], correct: 1 },
            { q: "What is 100 ÷ 10?", a: ["5", "10", "20", "25"], correct: 1 },
            { q: "What is 15 - 6?", a: ["7", "8", "9", "10"], correct: 2 },
            { q: "What is 7²?", a: ["14", "21", "49", "56"], correct: 2 },
            { q: "What is half of 50?", a: ["20", "25", "30", "35"], correct: 1 },
            { q: "How many sides does a triangle have?", a: ["2", "3", "4", "5"], correct: 1 },
            { q: "What is 20% of 100?", a: ["10", "15", "20", "25"], correct: 2 },
            { q: "What is 9 + 6?", a: ["13", "14", "15", "16"], correct: 2 },
            { q: "What is 4 × 5?", a: ["15", "20", "25", "30"], correct: 1 }
        ],
        medium: [
            { q: "Solve: 2x + 6 = 14", a: ["2", "3", "4", "5"], correct: 2 },
            { q: "What is the square root of 144?", a: ["10", "11", "12", "14"], correct: 2 },
            { q: "What is 25% of 200?", a: ["25", "40", "50", "75"], correct: 2 },
            { q: "What is the area of a rectangle 8 cm × 5 cm?", a: ["13 cm²", "26 cm²", "40 cm²", "45 cm²"], correct: 2 },
            { q: "What is 3³?", a: ["9", "18", "27", "36"], correct: 2 },
            { q: "What is 15% of 300?", a: ["30", "35", "45", "50"], correct: 2 },
            { q: "If x = 5, what is 2x + 3?", a: ["10", "11", "12", "13"], correct: 3 },
            { q: "What is the perimeter of a square with side 6 cm?", a: ["12 cm", "18 cm", "24 cm", "36 cm"], correct: 2 },
            { q: "What is 7 × 8 - 10?", a: ["36", "46", "56", "66"], correct: 1 },
            { q: "What is the mean of 4, 6, and 8?", a: ["5", "6", "7", "8"], correct: 1 }
        ],
        hard: [
            { q: "Solve: 3x - 7 = 20", a: ["7", "8", "9", "10"], correct: 2 },
            { q: "What is the derivative of x²?", a: ["x", "2x", "x²", "2"], correct: 1 },
            { q: "What is sin(90°)?", a: ["0", "0.5", "1", "2"], correct: 2 },
            { q: "What is the probability of rolling a 6 on a fair dice?", a: ["1/2", "1/3", "1/6", "1/12"], correct: 2 },
            { q: "What is 2⁵ × 2²?", a: ["32", "64", "128", "256"], correct: 2 },
            { q: "If f(x)=2x+1, what is f(4)?", a: ["7", "8", "9", "10"], correct: 2 },
            { q: "What is the gradient of y = 5x + 2?", a: ["2", "3", "5", "7"], correct: 2 },
            { q: "What is √225?", a: ["12", "13", "15", "25"], correct: 2 },
            { q: "What is 10⁻²?", a: ["0.1", "0.01", "0.001", "100"], correct: 1 },
            { q: "What is the sum of angles in a quadrilateral?", a: ["180°", "270°", "360°", "540°"], correct: 2 }
        ]
    },

    Chemistry: {
        easy: [
            { q: "What is the chemical symbol for oxygen?", a: ["O", "Ox", "Og", "C"], correct: 0 },
            { q: "What is the chemical symbol for hydrogen?", a: ["He", "H", "Hy", "Hg"], correct: 1 },
            { q: "What is H₂O commonly known as?", a: ["Salt", "Water", "Oxygen", "Hydrogen"], correct: 1 },
            { q: "What is the atomic number of hydrogen?", a: ["1", "2", "8", "10"], correct: 0 },
            { q: "Which gas do humans breathe in?", a: ["Carbon dioxide", "Oxygen", "Hydrogen", "Helium"], correct: 1 },
            { q: "What is NaCl commonly called?", a: ["Sugar", "Salt", "Water", "Acid"], correct: 1 },
            { q: "Which particle has a negative charge?", a: ["Proton", "Neutron", "Electron", "Nucleus"], correct: 2 },
            { q: "What is the pH of pure water?", a: ["0", "5", "7", "14"], correct: 2 },
            { q: "Which element has the symbol Fe?", a: ["Fluorine", "Iron", "Francium", "Fermium"], correct: 1 },
            { q: "What is CO₂?", a: ["Carbon monoxide", "Carbon dioxide", "Calcium oxide", "Cobalt"], correct: 1 }
        ],
        medium: [
            { q: "How many protons does carbon have?", a: ["4", "6", "8", "12"], correct: 1 },
            { q: "Which element has atomic number 8?", a: ["Nitrogen", "Oxygen", "Carbon", "Fluorine"], correct: 1 },
            { q: "What type of bond involves sharing electrons?", a: ["Ionic", "Covalent", "Metallic", "Hydrogen"], correct: 1 },
            { q: "What is the formula of methane?", a: ["CH₄", "CO₂", "C₂H₆", "CH₃OH"], correct: 0 },
            { q: "Which gas turns limewater milky?", a: ["Oxygen", "Hydrogen", "Carbon dioxide", "Nitrogen"], correct: 2 },
            { q: "What is the charge of a proton?", a: ["Negative", "Positive", "Neutral", "Variable"], correct: 1 },
            { q: "Which group contains the noble gases?", a: ["Group 1", "Group 2", "Group 17", "Group 18"], correct: 3 },
            { q: "What is the formula for sulfuric acid?", a: ["HCl", "H₂SO₄", "HNO₃", "NaOH"], correct: 1 },
            { q: "Which substance is an alkali?", a: ["HCl", "NaOH", "CO₂", "O₂"], correct: 1 },
            { q: "What happens to atoms during a chemical reaction?", a: ["They disappear", "They rearrange", "They become energy", "They stop moving"], correct: 1 }
        ],
        hard: [
            { q: "What is Avogadro's constant approximately?", a: ["6.02 × 10²³", "3.14 × 10²³", "9.81 × 10²³", "1.60 × 10²³"], correct: 0 },
            { q: "What is the oxidation state of oxygen usually?", a: ["+1", "+2", "-1", "-2"], correct: 3 },
            { q: "Which particle determines the element's atomic number?", a: ["Electron", "Proton", "Neutron", "Ion"], correct: 1 },
            { q: "What is the empirical formula of C₆H₁₂O₆?", a: ["CH₂O", "C₂H₄O₂", "C₆H₁₂O₆", "CHO"], correct: 0 },
            { q: "Which equation represents neutralization?", a: ["Acid + base → salt + water", "Metal + oxygen → acid", "Salt + water → acid", "Base + metal → gas"], correct: 0 },
            { q: "What is the molar mass of H₂O approximately?", a: ["16 g/mol", "18 g/mol", "20 g/mol", "22 g/mol"], correct: 1 },
            { q: "Which element is the most electronegative?", a: ["Oxygen", "Chlorine", "Fluorine", "Nitrogen"], correct: 2 },
            { q: "What type of reaction is A + B → AB?", a: ["Decomposition", "Synthesis", "Displacement", "Combustion"], correct: 1 },
            { q: "What is the electron configuration of sodium?", a: ["2,8,1", "2,7,2", "2,8,8", "2,1,8"], correct: 0 },
            { q: "Which factor generally increases reaction rate?", a: ["Lower temperature", "Lower concentration", "Higher temperature", "Removing reactants"], correct: 2 }
        ]
    },

    Biology: {
        easy: [
            { q: "What is the basic unit of life?", a: ["Organ", "Cell", "Tissue", "Atom"], correct: 1 },
            { q: "Which organ pumps blood?", a: ["Lung", "Brain", "Heart", "Kidney"], correct: 2 },
            { q: "What gas do plants take in during photosynthesis?", a: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], correct: 2 },
            { q: "Which organ is mainly responsible for breathing?", a: ["Heart", "Lungs", "Kidney", "Stomach"], correct: 1 },
            { q: "What is the green pigment in plants?", a: ["Hemoglobin", "Chlorophyll", "Melanin", "Keratin"], correct: 1 },
            { q: "Which organ controls the body?", a: ["Heart", "Brain", "Liver", "Stomach"], correct: 1 },
            { q: "What do red blood cells carry?", a: ["Oxygen", "Food", "Hormones only", "Bones"], correct: 0 },
            { q: "Which structure controls what enters a cell?", a: ["Nucleus", "Cell membrane", "Ribosome", "Vacuole"], correct: 1 },
            { q: "What do plants produce during photosynthesis?", a: ["Glucose and oxygen", "Protein", "Nitrogen", "Salt"], correct: 0 },
            { q: "Which system digests food?", a: ["Digestive system", "Nervous system", "Skeletal system", "Respiratory system"], correct: 0 }
        ],
        medium: [
            { q: "Where does aerobic respiration mainly occur?", a: ["Nucleus", "Mitochondria", "Ribosome", "Cell wall"], correct: 1 },
            { q: "What is the function of the ribosome?", a: ["Protein synthesis", "Photosynthesis", "DNA storage", "Digestion"], correct: 0 },
            { q: "What is diffusion?", a: ["Movement from high to low concentration", "Movement from low to high concentration", "Movement of water only", "Movement using ATP only"], correct: 0 },
            { q: "What is osmosis?", a: ["Movement of glucose", "Movement of water through a partially permeable membrane", "Movement of oxygen", "Movement of proteins"], correct: 1 },
            { q: "Which blood cells fight pathogens?", a: ["Red blood cells", "White blood cells", "Platelets", "Plasma"], correct: 1 },
            { q: "What molecule stores genetic information?", a: ["ATP", "DNA", "Glucose", "Protein"], correct: 1 },
            { q: "What is the function of stomata?", a: ["Gas exchange", "Absorb minerals", "Transport sugar", "Produce seeds"], correct: 0 },
            { q: "Which organ filters blood and produces urine?", a: ["Liver", "Kidney", "Heart", "Lung"], correct: 1 },
            { q: "What is an enzyme?", a: ["A biological catalyst", "A carbohydrate", "A mineral", "A hormone only"], correct: 0 },
            { q: "Where does photosynthesis occur?", a: ["Mitochondria", "Chloroplasts", "Nucleus", "Ribosomes"], correct: 1 }
        ],
        hard: [
            { q: "What is the complementary base to adenine in DNA?", a: ["Cytosine", "Guanine", "Thymine", "Uracil"], correct: 2 },
            { q: "What is the role of mRNA?", a: ["Carries genetic instructions to ribosomes", "Stores fat", "Produces ATP directly", "Digests proteins"], correct: 0 },
            { q: "Which stage of mitosis involves chromosomes lining up at the equator?", a: ["Prophase", "Metaphase", "Anaphase", "Telophase"], correct: 1 },
            { q: "What is the function of ATP?", a: ["Energy transfer", "Genetic storage", "Protein digestion", "Oxygen transport"], correct: 0 },
            { q: "What is natural selection?", a: ["Organisms choose their mutations", "Better-adapted organisms tend to survive and reproduce", "All organisms become identical", "Species stop evolving"], correct: 1 },
            { q: "Which organelle modifies and packages proteins?", a: ["Golgi apparatus", "Mitochondria", "Nucleus", "Chloroplast"], correct: 0 },
            { q: "What is a mutation?", a: ["A change in DNA sequence", "A type of protein", "A type of cell", "A form of respiration"], correct: 0 },
            { q: "Which process produces genetically identical cells?", a: ["Meiosis", "Mitosis", "Fertilization", "Mutation"], correct: 1 },
            { q: "How many chromosomes are normally found in a human somatic cell?", a: ["23", "44", "46", "48"], correct: 2 },
            { q: "What is the main purpose of meiosis?", a: ["Growth", "Repair", "Production of gametes", "Energy production"], correct: 2 }
        ]
    },

    Physics: {
        easy: [
            { q: "What is the SI unit of force?", a: ["Joule", "Newton", "Watt", "Pascal"], correct: 1 },
            { q: "What is the speed of light approximately?", a: ["3 × 10⁶ m/s", "3 × 10⁸ m/s", "3 × 10¹⁰ m/s", "300 m/s"], correct: 1 },
            { q: "What force pulls objects toward Earth?", a: ["Friction", "Gravity", "Magnetism", "Tension"], correct: 1 },
            { q: "What is the unit of energy?", a: ["Newton", "Joule", "Watt", "Volt"], correct: 1 },
            { q: "What instrument measures temperature?", a: ["Barometer", "Thermometer", "Ammeter", "Voltmeter"], correct: 1 },
            { q: "What is the unit of electric current?", a: ["Volt", "Ampere", "Ohm", "Watt"], correct: 1 },
            { q: "What is speed?", a: ["Distance ÷ time", "Time ÷ distance", "Mass × acceleration", "Force ÷ area"], correct: 0 },
            { q: "What type of energy does a moving object have?", a: ["Potential", "Kinetic", "Chemical", "Nuclear"], correct: 1 },
            { q: "What is the freezing point of water?", a: ["0°C", "10°C", "50°C", "100°C"], correct: 0 },
            { q: "Which device measures electric current?", a: ["Voltmeter", "Ammeter", "Thermometer", "Barometer"], correct: 1 }
        ],
        medium: [
            { q: "What is Newton's second law?", a: ["F = ma", "E = mc²", "V = IR", "P = IV"], correct: 0 },
            { q: "What is the unit of power?", a: ["Joule", "Newton", "Watt", "Pascal"], correct: 2 },
            { q: "What is acceleration?", a: ["Change in velocity per unit time", "Distance per unit time", "Mass per unit volume", "Force per unit area"], correct: 0 },
            { q: "What happens to pressure when force increases over the same area?", a: ["It decreases", "It increases", "It becomes zero", "It stays exactly the same"], correct: 1 },
            { q: "What is Ohm's law?", a: ["V = IR", "F = ma", "P = IV²", "E = mc"], correct: 0 },
            { q: "What type of wave is sound?", a: ["Electromagnetic", "Mechanical", "Nuclear", "Static"], correct: 1 },
            { q: "What happens to frequency if wavelength decreases while wave speed stays constant?", a: ["Frequency decreases", "Frequency increases", "Frequency becomes zero", "Nothing"], correct: 1 },
            { q: "What is density?", a: ["Mass ÷ volume", "Volume ÷ mass", "Mass × volume", "Force ÷ area"], correct: 0 },
            { q: "Which form of energy is stored in a stretched spring?", a: ["Kinetic", "Elastic potential", "Nuclear", "Thermal"], correct: 1 },
            { q: "What is the approximate acceleration due to gravity on Earth?", a: ["1.8 m/s²", "5.0 m/s²", "9.8 m/s²", "20 m/s²"], correct: 2 }
        ],
        hard: [
            { q: "What is Einstein's famous equation?", a: ["F = ma", "E = mc²", "V = IR", "P = IV"], correct: 1 },
            { q: "What is momentum?", a: ["Mass × velocity", "Mass × acceleration", "Force × area", "Energy × time"], correct: 0 },
            { q: "What is the unit of momentum?", a: ["kg m/s", "N", "J", "W"], correct: 0 },
            { q: "What is gravitational potential energy?", a: ["mgh", "½mv²", "ma", "Fd/t"], correct: 0 },
            { q: "What is kinetic energy?", a: ["mgh", "½mv²", "ma", "mv"], correct: 1 },
            { q: "If velocity doubles, what happens to kinetic energy?", a: ["It doubles", "It triples", "It becomes four times larger", "It becomes half"], correct: 2 },
            { q: "What is the relationship between frequency and period?", a: ["T = f", "T = 1/f", "T = f²", "T = 2f"], correct: 1 },
            { q: "What is the unit of resistance?", a: ["Volt", "Ampere", "Ohm", "Watt"], correct: 2 },
            { q: "What does conservation of energy state?", a: ["Energy can be created", "Energy can be destroyed", "Energy cannot be created or destroyed", "Energy always disappears"], correct: 2 },
            { q: "What happens to the resistance of a metal wire when its temperature increases?", a: ["Usually increases", "Usually decreases", "Becomes zero", "Never changes"], correct: 0 }
        ]
    }

};


/* =====================================================
   SUBJECT SELECTION
   ===================================================== */

function selectSubject(subject) {

    selectedSubject = subject;
    document.getElementById("selectedSubject").textContent = subject;

    const icons = {
        Math: "📐",
        Chemistry: "⚗️",
        Biology: "🧬",
        Physics: "⚡"
    };

    document.getElementById("selectedIcon").textContent = icons[subject];

    showScreen("difficultyScreen");
}


/* =====================================================
   START QUIZ
   ===================================================== */

function startQuiz(difficulty) {

    selectedDifficulty = difficulty;
    questions = questionBank[selectedSubject][difficulty];

    currentQuestion = 0;
    score = 0;
    streak = 0;
    correctCount = 0;
    wrongCount = 0;

    document.getElementById("score").textContent = score;
    document.getElementById("streak").textContent = streak;
    document.getElementById("quizSubject").textContent = selectedSubject;

    showScreen("quizScreen");
    showQuestion();
}


/* =====================================================
   SHOW QUESTION
   ===================================================== */

function showQuestion() {

    clearInterval(timer);
    timerPaused = false;
    answered = false; // reset the guard for the new question

    if (currentQuestion >= questions.length) {
        endQuiz();
        return;
    }

    const current = questions[currentQuestion];

    document.getElementById("questionNumber").textContent =
        `Question ${currentQuestion + 1} / ${questions.length}`;

    document.getElementById("question").textContent = current.q;

    document.getElementById("difficultyLabel").textContent =
        selectedDifficulty.toUpperCase();

    const answers = document.getElementById("answers");
    answers.innerHTML = "";

    current.a.forEach((answer, index) => {

        const button = document.createElement("button");
        button.className = "answer-btn";
        button.textContent = answer;

        button.onclick = function () {
            checkAnswer(index, button);
        };

        answers.appendChild(button);
    });

    document.getElementById("feedback").textContent = "";

    startTimer();
}


/* =====================================================
   TIMER
   ===================================================== */

function startTimer() {

    timeLeft = QUESTION_TIME;
    updateTimerDisplay();
    runTimerInterval();
}

function runTimerInterval() {

    clearInterval(timer);

    timer = setInterval(() => {

        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            clearInterval(timer);
            timeUp();
        }

    }, 1000);
}

function updateTimerDisplay() {

    document.getElementById("timer").textContent = timeLeft;

    const percentage = (timeLeft / QUESTION_TIME) * 100;
    document.getElementById("timerProgress").style.width = percentage + "%";
}

/* Pause/resume are used while a confirm modal is covering the quiz,
   so the countdown can't silently finish a question behind the dialog. */

function pauseTimer() {
    clearInterval(timer);
    timerPaused = true;
}

function resumeTimer() {
    if (!timerPaused) return;
    timerPaused = false;
    runTimerInterval();
}


/* =====================================================
   CHECK ANSWER
   ===================================================== */

function checkAnswer(selected, button) {

    if (answered) return; // already handled by a click or the timer
    answered = true;

    clearInterval(timer);

    const current = questions[currentQuestion];
    const buttons = document.querySelectorAll(".answer-btn");

    buttons.forEach(btn => {
        btn.disabled = true;
    });

    if (selected === current.correct) {
        button.classList.add("correct");
        handleCorrect();
    } else {
        button.classList.add("wrong");
        buttons[current.correct].classList.add("correct");
        handleWrong();
    }

    setTimeout(() => {
        currentQuestion++;
        showQuestion();
    }, 1000);
}


/* =====================================================
   CORRECT ANSWER
   ===================================================== */

function handleCorrect() {

    correctCount++;
    streak++;

    let points;

    if (selectedDifficulty === "easy") {
        points = 10;
    } else if (selectedDifficulty === "medium") {
        points = 20;
    } else {
        points = 30;
    }

    /* STREAK BONUS */
    if (streak >= 3) {
        points += 5;
    }

    /* SPEED BONUS */
    if (timeLeft >= 10) {
        points += 5;
    }

    score += points;

    document.getElementById("score").textContent = score;
    document.getElementById("streak").textContent = streak;

    document.getElementById("feedback").textContent =
        `✅ Correct! +${points} points`;
}


/* =====================================================
   WRONG ANSWER
   ===================================================== */

function handleWrong() {

    wrongCount++;
    streak = 0;

    document.getElementById("streak").textContent = streak;
    document.getElementById("feedback").textContent = "❌ Wrong answer!";
}


/* =====================================================
   TIME UP
   ===================================================== */

function timeUp() {

    if (answered) return; // a click already handled this question
    answered = true;

    wrongCount++;
    streak = 0;

    document.getElementById("streak").textContent = streak;

    const buttons = document.querySelectorAll(".answer-btn");

    buttons.forEach(button => {
        button.disabled = true;
    });

    buttons[questions[currentQuestion].correct].classList.add("correct");

    document.getElementById("feedback").textContent = "⏰ Time's up!";

    setTimeout(() => {
        currentQuestion++;
        showQuestion();
    }, 1000);
}


/* =====================================================
   FINISH QUIZ
   ===================================================== */

function confirmFinish() {

    pauseTimer();

    openModal(
        "🏁",
        "Finish Quiz?",
        "Are you sure you want to finish? Your current score will be kept.",
        function () {
            endQuiz();
        },
        false // quiz is ending either way, no need to resume on cancel path
    );
}


/* =====================================================
   BACK TO MENU
   ===================================================== */

function confirmBack() {

    pauseTimer();

    openModal(
        "⚠️",
        "Leave Quiz?",
        "Your current quiz progress will be lost if you go back.",
        function () {
            showScreen("difficultyScreen");
        },
        true // if the user cancels, the timer should pick back up
    );
}


/* =====================================================
   END QUIZ
   ===================================================== */

function endQuiz() {

    clearInterval(timer);

    const totalAnswered = correctCount + wrongCount;
    let accuracy = 0;

    if (totalAnswered > 0) {
        accuracy = Math.round((correctCount / totalAnswered) * 100);
    }

    document.getElementById("finalScore").textContent = score;
    document.getElementById("correctAnswers").textContent = correctCount;
    document.getElementById("wrongAnswers").textContent = wrongCount;
    document.getElementById("accuracy").textContent = accuracy + "%";

    giveReward(accuracy);

    showScreen("resultScreen");
}


/* =====================================================
   REWARD SYSTEM
   ===================================================== */

function giveReward(accuracy) {

    let reward;
    let message;
    let trophy;

    if (accuracy === 100) {
        reward = "👑 Grandmaster";
        message = "PERFECT! You mastered every question!";
        trophy = "👑";
    } else if (accuracy >= 80) {
        reward = "🏆 Knowledge Master";
        message = "Amazing! Your knowledge is seriously impressive.";
        trophy = "🏆";
    } else if (accuracy >= 60) {
        reward = "🥇 Smart Thinker";
        message = "Great job! Keep learning and keep improving.";
        trophy = "🥇";
    } else if (accuracy >= 40) {
        reward = "🥈 Rising Scholar";
        message = "Good attempt! You're getting there.";
        trophy = "🥈";
    } else {
        reward = "🎖️ Knowledge Rookie";
        message = "Every expert starts somewhere. Keep going!";
        trophy = "🎖️";
    }

    document.getElementById("reward").textContent = reward;
    document.getElementById("resultMessage").textContent = message;
    document.getElementById("resultTrophy").textContent = trophy;
}


/* =====================================================
   SCREEN SWITCHING
   ===================================================== */

function showScreen(screenId) {

    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });

    document.getElementById(screenId).classList.add("active");

    window.scrollTo(0, 0);
}


/* =====================================================
   GO HOME
   ===================================================== */

function goHome() {

    clearInterval(timer);
    timerPaused = false;
    closeModal(true); // leaving the quiz entirely, no timer to resume
    showScreen("homeScreen");
}


/* =====================================================
   CUSTOM MODAL
   ===================================================== */

function openModal(icon, title, text, action, resumeOnCancel = false) {

    document.getElementById("modalIcon").textContent = icon;
    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalText").textContent = text;

    modalAction = action;
    modalResumeOnCancel = resumeOnCancel;

    document.getElementById("modalConfirm").onclick = function () {
        if (modalAction) {
            modalAction();
        }
        closeModal(true); // confirmed — never resume the old question's timer
    };

    document.getElementById("confirmModal").classList.add("show");
}


/* =====================================================
   CLOSE MODAL
   ===================================================== */

function closeModal(confirmed = false) {

    document.getElementById("confirmModal").classList.remove("show");

    if (!confirmed && modalResumeOnCancel) {
        resumeTimer();
    }

    modalAction = null;
    modalResumeOnCancel = false;
}