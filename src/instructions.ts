const startButton:HTMLButtonElement=document.querySelector(".start-button")as HTMLButtonElement;
const yearSelector: HTMLSelectElement = document.querySelector(".year-selector") as HTMLSelectElement;
const questions: string = `../questions/${yearSelector.value}.json`;


startButton.addEventListener('click',()=>{
    const year=yearSelector.value;
    window.location.href=`../questions.html?year=${year}`;
});


export default questions;