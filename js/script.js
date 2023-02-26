import playList from './playList.js';
let date = new Date();
const time = document.querySelector(".time");
const day = document.querySelector(".date");
const greeting = document.querySelector(".greeting");
const name = document.querySelector(".name");
const slidePrev = document.querySelector(".slide-prev");
const slideNext = document.querySelector(".slide-next");

// Выводим ВРЕМЯ========================================================================
function showTime() {
    let date = new Date();
    time.textContent = `${date.toLocaleTimeString()}`;
    setTimeout(showTime, 1000);
    setTimeout(showGreeting);
}

showTime(showDate())

//Выводим ДАТУ===========================================================================
function showDate() {
    const options = {weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC'};
    const currentDate = date.toLocaleDateString('en-US', options);                //'ru-RU', 'en-US', 'be-BY'
    return day.textContent = currentDate;
}

// ПРИВЕТСТВИЕ=========================================================================
function getTimeOfDay(date) {             // функция, возвращая время суток
    const time = date.getHours()
    if (time >= 4 && time <= 12) {
        return "morning";
    } else if (time >= 12 && time <= 18) {
        return "afternoon";
    } else if (time >= 18 && time <= 24) {
        return "evening";
    } else if (time >= 0 && time <= 4) {
        return "night";
    }
}

function showGreeting() {                       // функция, которая выводит приветствие
    greeting.textContent = `Good ${getTimeOfDay(date)},`
}

// ИМЯ пользавателя=====================================================================
function setLocalStorage() {                                    // Сохранение имени пользователя в localStorage
    localStorage.setItem('name', name.value);                   //метод сохраняющий данные в localStorage. Два параметра метода: имя значения, которое сохраняется и само значение, которое сохраняется
}
window.addEventListener('beforeunload', setLocalStorage)

function getLocalStorage() {                                   // Получение имени пользователя из localStorage
    if (localStorage.getItem('name')) {                     //метод получающий данные из localStorage. Параметр метода - имя, под которым сохраняется значение.
        name.value = localStorage.getItem('name');
    }
}
window.addEventListener('load', getLocalStorage)

// СЛАЙДЕР ИЗОБРАЖЕНИЙ=======================================================================
function getRandomNum() {               // функция, возвращающая рандомное число от 1 до 20 включительно
    return Math.floor(Math.random() * 20) + 1;
}

let randomNum = getRandomNum();

function setBg() {                          // функция для изменения дефолтного фонового изображения, полученного из интернета
    const timeOfDay = getTimeOfDay(date);   // текущее время суток
    const strNum = String(randomNum);
    const bgNum = strNum.padStart(2, '0');               // добавим ноль впереди
    let img = document.createElement('img');
    img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`
    img.onload = () => {
        document.body.style.backgroundImage = `url(${img.src})`;
    }
    return strNum;
}

// ПЕРЕЛИСТЫВАНИЕ ИЗОБРАЖЕНИЙ===============================================================================================

function getSlideNext() {                                   // функция увеличивает рандомное число на 1
    randomNum >= 20 ? randomNum = 1 : randomNum++;
    setBg();
    return randomNum;
}
getSlideNext()

function getSlidePrev() {                                   // функция уменьшает рандомное число на 1
    randomNum <= 1 ? randomNum = 20 : randomNum--;
    setBg();
    return randomNum;
}
getSlidePrev()

slidePrev.addEventListener('click', getSlidePrev);
slideNext.addEventListener('click', getSlideNext);

// Виджеты погоды=================================================================================================================
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const windSpeed = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');

const city = document.querySelector('.city');


async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=ru&appid=52b137b3580a6f9b5376c400275474c2&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data)
    console.log(city.value)


    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].main;
    windSpeed.textContent = `Wind speed: ${Math.round(data.wind.speed)}m/s`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
}

city.addEventListener('keypress', setCity);

function setLocalStorageCity() {
    localStorage.setItem('city', city.value);                   //метод сохраняющий данные в localStorage. Два параметра метода: имя значения, которое сохраняется и само значение, которое сохраняется
}

window.addEventListener('beforeunload', setLocalStorageCity)

function getLocalStorageCity() {
    // const city = document.querySelector('.city');
    if (localStorage.getItem('city')) {                     //метод получающий данные из localStorage. Параметр метода - имя, под которым сохраняется значение.
        return city.value = localStorage.getItem('city');
    } else {
        city.value = "Минск";
    }
}
window.addEventListener('load', getLocalStorageCity)
function setCity(event) {
    if (event.code === 'Enter') {
        getWeather()
        city.blur();
    }
}
document.addEventListener('DOMContentLoaded', getWeather);

// getWeather()

city.addEventListener("change", getWeather)

// Цитата дня======================================================================================================================================
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const btnChangeQuote = document.querySelector('.change-quote');

async function getQuotes() {
    try {
        const quotes = './data.json';
        const response = await fetch(quotes)
         .then (response => response.json())
        let randomQuote = Math.floor(Math.random() * (response.length));
        quote.textContent = response[randomQuote].text;
        author.textContent = response[randomQuote].author;
    } catch (error) {
        console.log(error)
    }
}
getQuotes().then(r => r)
btnChangeQuote.addEventListener("click", getQuotes)

// Аудиоплеер============================================================================================================================================
const playAudioBtn = document.querySelector('.play');
const playPrevBtn = document.querySelector('.play-prev');
const playNextBtn = document.querySelector('.play-next');

let playNum = 0;
let isPlay = false;
let audio = new Audio();


function playAudio() {
    audio.src = playList[playNum].src;
    audio.currentTime = 0;                                  //аудиотрек при каждом запуске функции playAudio() будет проигрываться с начала
    if (!isPlay) {
        isPlay = true;
        audio.play();
        playAudioBtn.classList.add('pause');
    } else {
        isPlay = false;
        audio.pause();
        playAudioBtn.classList.remove('pause');
    }
}
playAudioBtn.addEventListener("click", playAudio);


function playNext() {
    playNum++;
    // playAudioBtn.classList.add('pause');
    audio.play();
    playAudio();
    isPlay = false;
    // playAudioBtn.classList.remove('pause');
}

function playPrev() {
    playNum--;
    audio.play();
    playAudio();
    isPlay = false;
    // playAudioBtn.classList.remove('pause');
}

playNextBtn.addEventListener('click', playNext)
playPrevBtn.addEventListener('click', playPrev)