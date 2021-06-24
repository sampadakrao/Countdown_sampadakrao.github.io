const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdownForm');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span'); //returns an array of html span elements

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');
//global variables
let countdownTitle = ''; //using 'let' keyword because the value is going to change
let countdownDate = '';
let countdownValue = Date; //variable 'countdownValue is of type Date(function from JS) for readability and having cleaner code. And the type of the variable is maintained throughout
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

//Set date input min with today's date
const today = new Date().toISOString().split('T')[0]; //create a new Date object
dateEl.setAttribute('min', today);

//Populate countdown / Complete UI
function updateDOM(){
    countdownActive = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownValue - now;
        console.log('distance', distance); //we get a positive number which is to be broken down to days, hours, mins, secs
    
        const days = Math.floor (distance / day);
        const hours = Math.floor((distance % day) / hour);
        const minutes = Math.floor((distance % hour) / minute);
        const seconds = Math.floor((distance % minute) / second);
        console.log(days, hours, minutes, seconds);

        //Hide input
        inputContainer.hidden = true;

        //If the countdown has ended, show complete
        if(distance < 0){
            countdownEl.hidden = true;
            clearInterval(countdownActive);
            completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
            completeEl.hidden = false;
        }
        else{
            //Else show the countdown in progress
            //Populate countdown
            countdownElTitle.textContent = `${countdownTitle}`; //using 'text content'.  Secure way to change text value of html element
            //template string - passing a variable that will be converted to a string.
            timeElements[0].textContent = `${days}`;
            timeElements[1].textContent = `${hours}`;
            timeElements[2].textContent = `${minutes}`;
            timeElements[3].textContent = `${seconds}`;
            completeEl.hidden = true;
            countdownEl.hidden = false;
        }
    }, second); //function will run every second
}

//take values from form input
function updateCountdown(e) {
    e.preventDefault();
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;
    savedCountdown = {
        title: countdownTitle,
        date: countdownDate
    }; //key value pair for object
    console.log(savedCountdown);
    //storing title and date in local storage for it to be present even when user refreshes the page
    //converting key value pair of object to a string
    localStorage.setItem('countdown', JSON.stringify(savedCountdown));
    console.log(countdownTitle, countdownDate);
    //Check for valid date to make sure that user has properly selected a date
    if(countdownDate === '')  //checking the value
    {
        alert('Please select a date for the countdown.');
    }
    else{
        //Get number version of current date, update DOM
        countdownValue = new Date(countdownDate).getTime(); //'countdownValue' is now getting assigned a value
        console.log('countdown value:', countdownValue);
        updateDOM();
    }  
}

//Reset all values
function reset(){
    //Hide countdowns, show input
    countdownEl.hidden = true;
    completeEl.hidden = true;
    inputContainer.hidden = false;
    //Stop countdown
    clearInterval(countdownActive);
    //Reset values
    countdownTitle = '';
    countdownDate = '';
    localStorage.removeItem('countdown');
}

function restorePreviousCountdown() {
    //Get countdown from local storage if available
    if(localStorage.getItem('countdown')){
        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}

//Event listeners
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

//On load, check localStorage
restorePreviousCountdown();