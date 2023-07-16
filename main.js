// select elements
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-btn");
let resultsContent = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

// set option
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestions() {
    let myRequest = new XMLHttpRequest();
    
    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionsObject = JSON.parse(this.responseText);
            let qCount = questionsObject.length;

            // create bullets + questions count
            createBullets(qCount);

            // add questions data
            addQuestionsData(questionsObject[currentIndex], qCount);

            // countdown
            countdown(15, qCount);

            // click on submit
            submitButton.onclick = () => {
                
                // get right answer
                let theRightAnswer = questionsObject[currentIndex].right_answer;
                
                // increase index
                currentIndex++;

                // check the answer
                checkAnswer(theRightAnswer, qCount);

                // remove previous question
                quizArea.innerHTML = "";
                answersArea.innerHTML = "";

                // add questions data
                addQuestionsData(questionsObject[currentIndex], qCount);
                
                // handel bullets class
                handelBullets();

                // countdown
                clearInterval(countdownInterval);
                countdown(15, qCount);

                // show results
                showResulets(qCount);

            };
        }
    };

    myRequest.open("GET", "football_questions.json", true);
    myRequest.send();
}
getQuestions();

function createBullets(num) {
    countSpan.innerHTML = num;

    // create spans
    for (let i = 0; i < num; i++) {
        
        // create bullet
        let theBullet = document.createElement("span");

        // check is if first span
        if (i === 0) {
            theBullet.className = "on";
        }
        
        // append bullets to main bullet container
        bulletsSpanContainer.appendChild(theBullet);
    }
};

function addQuestionsData(obj, count) {
    if (currentIndex < count) {
        // create question title
        let questionTitle = document.createElement("h2");

        // create question text
        let questionText = document.createTextNode(obj.title);

        // append text to title
        questionTitle.appendChild(questionText);

        // append title to quize area
        quizArea.appendChild(questionTitle);

        // create answers
        for (i = 1; i <= 4; i++){
            // create main div (answer)
            let mainDiv = document.createElement("div");
            
            // add class to main div
            mainDiv.className = "answer";

            // craete radio input
            let radioInput = document.createElement("input");

            // add type + name + id + data atribute
            radioInput.name = "question";
            radioInput.type = "radio";
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = obj[`answer_${i}`];

            // first option selected
            if (i === 1) {
                radioInput.checked = true;
            }

            // create label
            let theLabel = document.createElement("label");

            // add for attribute
            theLabel.htmlFor = `answer_${i}`;

            // create text label
            let labelText = document.createTextNode(obj[`answer_${i}`]);

            // add text to label 
            theLabel.appendChild(labelText);

            // add input + label to main div
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLabel);

            // add all divs to answers area
            answersArea.appendChild(mainDiv);
        }
    }
}

function checkAnswer(rAnswer, count) {
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;

    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }

    if (rAnswer === theChoosenAnswer) {
        rightAnswers++;
    }
}

function handelBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = "on";
        }
    });
}

function showResulets(count) {
    let theResults;
    if (currentIndex === count) {
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();

        if (rightAnswers > (count / 2) && rightAnswers < count) {
            theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count} Is Good`;
        } else if (rightAnswers === count) {
            theResults = `<span class="perfect">Perfect</span>, All Answers Is Right`;
        } else {
            theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count} Is Bad`;
        }

        resultsContent.innerHTML = theResults;
    }
}

function countdown(duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countdownInterval = setInterval(function () {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countdownElement.innerHTML = `${minutes} : ${seconds}`;

            if (--duration < 0) {
                clearInterval(countdownInterval);
                submitButton.click();
            }
        }, 1000);
    }
}