import playList from './playList.js';
let date = new Date();
const time = document.querySelector(".time");
const day = document.querySelector(".date");
const greeting = document.querySelector(".greeting");
const name = document.querySelector(".name");
const slidePrev = document.querySelector(".slide-prev");
const slideNext = document.querySelector(".slide-next");
const langs = document.querySelector("#langs");
const currentTime = document.querySelector(".current-time");
// Выводим ВРЕМЯ========================================================================
function showTime() {
    const date = new Date(),
          currentTime = date.toLocaleTimeString(),
          options = {
             weekday: 'long',
             month: 'long',
             day: 'numeric',
          },
          currentDate = date.toLocaleDateString(`${langs.value}-${langs.value.toUpperCase()}`, options);
       time.textContent = currentTime;
       day.textContent = currentDate;
       setTimeout(showTime, 1000);
       showGreeting();
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
    localStorage.setItem("langs", langs.value);
    localStorage.setItem("lang", lang);
}
window.addEventListener('beforeunload', setLocalStorage)

function getLocalStorage() {                                   // Получение имени пользователя из localStorage
    if (localStorage.getItem('name')) {                     //метод получающий данные из localStorage. Параметр метода - имя, под которым сохраняется значение.
        name.value = localStorage.getItem('name');
    }
    if (localStorage.getItem('langs')) {
        langs.value = localStorage.getItem('langs');
        lang = localStorage.getItem('langs');
    }
}
window.addEventListener('load', getLocalStorage)
//Язык=======================================================================================================
let lang = '';

function language() {
    langs.addEventListener("change", event => {
        langs.value = event.target.value;
        lang = event.target.value;
        getWeather();
        return lang;
    })
}
language();

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
const weather = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const city = document.querySelector('.city');
const windSpeed = document.querySelector(".wind");
const humidity = document.querySelector(".humidity");
const weatherError = document.querySelector(".weather-error");

async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${lang}&appid=52b137b3580a6f9b5376c400275474c2&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    try {
        weather.className = 'weather-icon owf';
        weather.classList.add(`owf-${data.weather[0].id}`);
        temperature.textContent = `${Math.round(data.main.temp.toFixed(0))}°C`;
        weatherDescription.textContent = data.weather[0].description;
        windSpeed.textContent = `Wind speed: ${Math.round(data.wind.speed)} m/s`;
        humidity.textContent = `Humidity: ${Math.round(data.main.humidity)}%`;
    } catch (error) {
        throw err();
    }
}
function err() {
    weatherError.textContent = "No location";
    weather.classList.remove = 'owf';
    temperature.textContent = ` `;
    weatherDescription.textContent = " ";
    windSpeed.textContent = " ";
    humidity.textContent = ` `;
    city.value = "";
}
function setCity(event) {
    if (event.code === 'Enter') {
        getWeather();
        city.blur();
    }
}
document.addEventListener('DOMContentLoaded', getWeather);
city.addEventListener('keypress', setCity);
city.addEventListener('click', setLocalStorageCity)

function setLocalStorageCity() {
    localStorage.setItem('city', city.value);                   //метод сохраняющий данные в localStorage. Два параметра метода: имя значения, которое сохраняется и само значение, которое сохраняется
}

function getLocalStorageCity() {
    if (localStorage.getItem('city')) {                     //метод получающий данные из localStorage. Параметр метода - имя, под которым сохраняется значение.
        city.value = localStorage.getItem('city');
    }
}
window.addEventListener('load', getLocalStorageCity)

// Цитата дня======================================================================================================================================
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const btnChangeQuote = document.querySelector('.change-quote');

async function getQuotes() {
    try {
        const quotes = `https://type.fit/api/quotes`;
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
const play = document.querySelector('.play');
const prevBtn = document.querySelector('.play-prev');
const nextBtn = document.querySelector('.play-next');


const  playListContainer = document.querySelector(".play-list"),
    audioName = document.querySelector(".audio-name"),
    duration = document.querySelector(".duration"),
    volume = document.querySelector(".seek-slider");
const vol = document.querySelector(".volume-slider");

let playNum = 0;
let isPlay = false;
let audio = new Audio();

function playAudio() {
    audio.src = playList[playNum]["src"];
    if (!isPlay) {
        audio.play();
        playLi[playNum].classList.add("item-active");
        audioName.textContent = playList[playNum]["title"];
        duration.textContent = playList[playNum]["duration"];
        durationAudio();
        currentAudio();
        regular();
    } else {
        playLi[playNum].classList.remove("item-active");
        audio.pause();
        audioName.textContent = playList[playNum]["title"];
        duration.textContent = playList[playNum]["duration"];
    }
    audio.addEventListener('ended', playNext);
}

function toggleBtn() {
    play.classList.toggle('pause');
    isPlay = !play.classList.contains("pause");
    playAudio();
}

play.addEventListener('click', toggleBtn);
nextBtn.addEventListener("click", playNext);
prevBtn.addEventListener("click", playPrev);

function playNext() {
    playLi[playNum].classList.remove("item-active");
    if (playNum === playList.length - 1) {
        playNum = 0;
    } else {
        playNum++;
    }
    playAudio()
}

function playPrev() {
    playLi[playNum].classList.remove("item-active");
    if (playNum === 0) {
        playNum = playList.length - 1;
    } else {
        playNum--;
    }
    playAudio()
}

function creatList() {
    for (let i = 0; i < playList.length; i++) {
        const li = document.createElement('li');
        li.textContent = playList[i]["title"];
        li.classList.add("play-item");
        playListContainer.append(li);
    }
}
creatList();
const playLi = document.querySelectorAll("li");

const noMuteBtn =document.querySelector(".mute-Btn");

function noMute () {
    noMuteBtn.addEventListener ("click", event => {
        if (event.target.classList.contains("icono-volumeHigh")) {
            noMuteBtn.classList.remove("icono-volumeHigh");
            noMuteBtn.classList.add("icono-volumeMute");
            audio.volume = 0;
            vol.value = 0;
        } else {
            noMuteBtn.classList.remove("icono-volumeMute");
            noMuteBtn.classList.add("icono-volumeHigh");
            audio.volume = 0.5;
            vol.value = 0.5;
        }
    })
}
noMute();


function addVol () {
    vol.addEventListener("change", ()=>{
        audio.volume = vol.value;
    })
    setTimeout(addVol, 50);
}
addVol()

function durationAudio () {
    let min = Math.floor(audio.currentTime / 60),
        sec = Math.floor(audio.currentTime % 60);
    const returnedSec = sec < 10 ? `0${sec}` : `${sec}`;
    currentTime.textContent = `0${min}:${returnedSec} /`;
    setTimeout(durationAudio, 500)
}


function regular() {
    volume.addEventListener("click", (e) => {
        audio.currentTime = e.offsetX * audio.duration / 100;
        currentAudio();
    })
}

function currentAudio () {
    volume.value = audio.currentTime / audio.duration*100;
    setTimeout(currentAudio, 50);
}