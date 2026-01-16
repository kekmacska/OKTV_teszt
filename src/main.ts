const questionNumber_h2: HTMLHeadingElement = document.querySelector(".question-number") as HTMLHeadingElement;
const question_h1: HTMLHeadingElement = document.querySelector(".question") as HTMLHeadingElement;
const questionroot_div: HTMLDivElement = document.querySelector(".questionroot") as HTMLDivElement;
const nextQuestion_button: HTMLButtonElement = document.querySelector(".next-question") as HTMLButtonElement;
const questionBack_button: HTMLButtonElement = document.querySelector(".question-back") as HTMLButtonElement;
const backHomepage_button: HTMLButtonElement = document.querySelector(".back-homepage") as HTMLButtonElement;
const explanation_button:HTMLButtonElement=document.querySelector(".explanation-button")as HTMLButtonElement;
const explanation_p:HTMLParagraphElement=document.querySelector(".explanation")as HTMLParagraphElement;

type Question = {
    id: number;
    question: string;
    answers: {
        [key: string]: string;
    };
    topic: string,
    correct: Array<{
        answer: string;
        explanation: string;
    }>;
}

const params:URLSearchParams = new URLSearchParams(window.location.search);
const year:string|null = params.get("year");
if (!year) throw new Error("év nem lett kiválasztva");
const res:Response = await fetch(`../questions/${year}.json`);
const questions: Question[] = await res.json();
const answers: (string | null)[] = Array(questions.length).fill(null);

let pontok: number = 0;
//téma pontok
let ITpontok: number = 0;
let FrontendPontok: number = 0;
let BackendPontok: number = 0;
let SoftDevPontok: number = 0;
//első kérdés
let kerdesSzamlalo: number = 0;

function renderQuestion(): void {
    const q: Question = questions[kerdesSzamlalo];
    questionNumber_h2.textContent = `${kerdesSzamlalo + 1}. kérdés`;
    question_h1.textContent = q.question;
    questionroot_div.replaceChildren();
    Object.entries(q.answers).forEach(([key, text]) => {
        const wrapper: HTMLLabelElement = document.createElement("label");
        wrapper.className = "answer-option";
        wrapper.classList.add(`answer_label_${key}`);
        const radio: HTMLInputElement = document.createElement("input");
        radio.type = "radio";
        radio.classList.add(`answer_input_${key}`);
        radio.name = "answer";
        radio.value = key;
        if (answers[kerdesSzamlalo] === key) radio.checked = true;
        const span: HTMLSpanElement = document.createElement("span");
        span.textContent = text;
        wrapper.appendChild(radio);
        wrapper.appendChild(span);
        questionroot_div.appendChild(wrapper);
    });
} renderQuestion();

function NextButton(): void {
    //pontozás
    const currentQuestion:Question = questions[kerdesSzamlalo];
    const selected:HTMLInputElement|null = document.querySelector<HTMLInputElement>('input[name="answer"]:checked');
    const correctKey:string = currentQuestion.correct[0].answer;

    if (!selected) {
        answers[kerdesSzamlalo] = null;
        kerdesSzamlalo++;
        if (kerdesSzamlalo >= questions.length) {
            window.location.href = "./results.html"; return;
        }
        renderQuestion();
        return;
    }

    if (answers[kerdesSzamlalo] === correctKey) pontok -= 3;
    answers[kerdesSzamlalo] = selected.value;

    if (selected.value === correctKey) {
        pontok += 3;
        localStorage.setItem("Összpontszám",pontok.toString());
        //téma pontok
        switch (currentQuestion.topic) {
            case 'IT': {
                ITpontok += 3;
                console.log("IT pontok", ITpontok);
                localStorage.setItem("IT pontok",ITpontok.toString());
                break;
            }

            case 'Frontend': {
                FrontendPontok += 3;
                console.log("Frontend pontok", FrontendPontok);
                localStorage.setItem("Frontend pontok",FrontendPontok.toString());
                break;
            }

            case 'Backend': {
                BackendPontok += 3;
                console.log("Backend pontok", BackendPontok);
                localStorage.setItem("Backend pontok", BackendPontok.toString());
                break;
            }

            case 'Software development': {
                SoftDevPontok += 3;
                console.log("Szoftverfejlesztő pontok", SoftDevPontok);
                localStorage.setItem("Szoftverfejlesztő pontok",SoftDevPontok.toString());
                break;
            }
        }
    }

    kerdesSzamlalo++;
    if (kerdesSzamlalo >= questions.length) {
        window.location.href = "./results.html"; return;
    }
    renderQuestion();
    console.log("pontok ", pontok);
}

function BackButton(): void {
    if (kerdesSzamlalo === 0) return;
    kerdesSzamlalo--;
    renderQuestion();
}

function ExplanationButton():void{
    explanation_p.textContent=`${questions[kerdesSzamlalo].correct[0].explanation}`;
    explanation_p.style.display='block';
}

explanation_button.addEventListener("click",ExplanationButton);
nextQuestion_button.addEventListener('click', NextButton);
questionBack_button.addEventListener('click', BackButton);

backHomepage_button.addEventListener('dblclick', () => { window.location.href = './index.html' });

export { };