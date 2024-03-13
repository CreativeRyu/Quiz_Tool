var turns = 0;
var correctAnswers;
var button_lock = true;
var score = 0;
var questions = [];
let questionCount;
var idCount;
var selectionContainer = document.querySelector(".selection-container");
let correctAnswerFlags = [];
var isCodePresented = false;
var upButton = document.getElementById("up");
var downButton = document.getElementById("down");
var leftButton = document.getElementById("left");
var rightButton = document.getElementById("right");
const menuEnum = {
    1: "title",
    2: "main",
    3: "exam"
};
let menu = menuEnum[1];

// JSON Importer
function loadJSON(filename) {
    if (menu !== "main") { return; }
    fetch(filename)
        .then(current_data => current_data.json())
        .then(question_data => {
            questions = question_data;
            questionCount = questions.length;
        })
        .catch(error => console.error('Fehler beim Laden der JSON-Datei:', error));
}

// TODO: Zurück zum Hauptmenü
// TODO: mit Steuerkreuz zwischen den JSON Dateien auf dem Bildschirm wählen

function control_menu() {
    switch (menu) {
        case "title":
            enter_main_menu();
            toggleJSONFilesDisplay();
            break;
        case "main":
            start_new_turn();
            break;
        case "exam":
            start_new_turn();
            break;

        default:
            break;
    }
}

function enter_main_menu() {
    menu = menuEnum[2];
    // Hauptmenübereich später auslagern in eigene Funktion
    document.getElementById("Title").innerHTML = "Choose your Exam";
    document.getElementById("Question").classList.remove("blink");
    document.getElementById("Question").innerHTML = "";
    document.body.classList.add("main-menu");
    createMediaElements();

    if (document.getElementById("icon")) {
        iconElement = document.getElementById("icon");
        iconElement.parentNode.removeChild(iconElement);
        iconElement.classList.remove("icon");
    }
}

function start_new_turn() {
    if (isCodePresented) { return; }
    menu = menuEnum[3];

    document.body.classList.remove("main-menu");
    document.querySelector('.text-panel').classList.add('fadeIn');
    selectionContainer.innerHTML = "";
    button_lock = false;
    current_question = questions.shift();
    document.getElementById("questions-left").innerHTML = (questionCount) ? `von ${questionCount}` : " ";

    prepareQuestion(current_question);
    createAnswerPanels(possibleAnswers, answerType);

    for (var i = 1; i <= 5; i++) {
        if (!possibleAnswers[i]) {
            break;
        }
        var id = `${i}`;
        document.getElementById(id).style.background = (answerType == "code") ? "#241f22" : "#f6fff0";
    }
}

function tap_button(current_button) {
    if (button_lock) { return; }
    if (isCodePresented) {
        toggleCodeSnippet();
    }

    let buttonId = parseInt(current_button.getAttribute("id"));

    if (correctAnswers.includes(buttonId)) {
        correctAnswerFlags.push(1);
        current_button.style.background = "#7ede51";
        score += current_question.score;
        if (correctAnswerFlags.length == correctAnswers.length) {
            button_lock = true;
            correctAnswerFlags = [];
        }
    }
    else {
        current_button.style.background = "#ff6161";
        button_lock = true;
        correctAnswers.forEach(answerId => {
            document.getElementById(answerId.toString()).style.border = "solid 3px #86C06C";
            document.getElementById(answerId.toString()).style.background = "#c4ffbc";
            document.getElementById(answerId.toString()).style.color = "#241f22";
        });
    }
}

function prepareQuestion(current_question) {
    document.getElementById("Score").innerHTML = `Score: ${score}`;
    document.getElementById("Number").innerHTML = `Frage ${current_question.id}`;
    document.getElementById("Title").innerHTML = current_question.title;
    document.getElementById("Question").innerHTML = current_question.question;
    answerType = current_question.answer_type;
    correctAnswers = current_question.correct_answer;
    possibleAnswers = current_question.possible_answers;
}

function createAnswerPanels(possibleAnswers, answerType) {
    idCount = 1;
    for (var key in possibleAnswers) {
        if (possibleAnswers.hasOwnProperty(key)) {
            var answer = possibleAnswers[key];
            var pElement = document.createElement("p");
            pElement.textContent = answer;
            pElement.id = idCount; // Erstelle eine eindeutige ID für jedes <p>-Element
            if (answerType == "code") {
                pElement.innerHTML = answer;
                selectionContainer.style.display = "grid";
                // Setze das Grid-Layout entsprechend deiner Anforderungen
                selectionContainer.style.gridTemplateColumns = "1fr 1fr"; // Zwei Spalten
                selectionContainer.style.gridTemplateRows = "1fr 1fr"; // Zwei Zeilen

                pElement.classList.add("selection-code");
            }
            else {
                selectionContainer.style.display = "flex";
                pElement.classList.add("selection"); // Füge der answerklasse "auswahl" hinzu
            }
            pElement.onclick = function () { tap_button(this); }; // Füge dem Element einen Klick-Handler hinzu
            selectionContainer.appendChild(pElement);
            idCount++; // Inkrementiere den ID-Zähler
        }
    }
}

function toggleCodeSnippet() {
    if (current_question.question_type !== "code") {
        return; // Beende die Funktion, wenn die Frage nicht vom Typ "code" ist
    }
    var codePanel = document.getElementById("code-panel");

    if (!codePanel) {
        // Erstelle das Code-Panel im Text-Panel
        codePanel = document.createElement("div");
        codePanel.id = "code-panel";
        document.querySelector('.text-panel').appendChild(codePanel);
        codePanel.classList.remove("fadeIn");
        codePanel.classList.add("fadeOut");

        // Holt den Code aus dem aktuellen Fragenobjekt
        var code = current_question.code;

        // Erstelle das Code-Element und füge es zum Code-Panel hinzu
        var codeElement = document.createElement("pre");
        codeElement.innerHTML = code;
        codeElement.classList.add("code-snippet"); // Fügen Sie eine Klasse für die Formatierung hinzu
        codePanel.appendChild(codeElement);
        isCodePresented = true;
    } else {
        codePanel.parentNode.removeChild(codePanel);
        isCodePresented = false;
    }
}

function loadAvailableJSONFiles() {
    return ["Web_Developement.json", "Test.json","PCEP", "PCAP", "PCAP2"]; 
}

function createMediaElements() {
    var availableJSONFiles = loadAvailableJSONFiles();

    var mediaScroller = document.querySelector('.media-scroller');
    mediaScroller.innerHTML = '';

    availableJSONFiles.forEach(function(fileName, index) {
        var mediaElement = document.createElement('div');
        mediaElement.classList.add('media-element');
        
        var imageBox = document.createElement('div');
        imageBox.classList.add('image-box');
        mediaElement.appendChild(imageBox);

        var img = document.createElement('img');
        img.classList.add('box-img');
        img.src = './test.png';
        imageBox.appendChild(img);

        var p = document.createElement('p');
        p.textContent = fileName.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
        mediaElement.appendChild(p);

        mediaElement.addEventListener('click', function() {
            loadJSON(fileName);
        });

        mediaScroller.appendChild(mediaElement);
    });
}