//global variables
const onecallAPI = 'https://api.openweathermap.org/data/2.5/onecall';
const geoAPI = 'http://api.openweathermap.org/geo/1.0/direct';
const APIkey = 'abc7f104744d16ea7952cba3fcc512dc';
var lat;
var lon;
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//const X = document.querySelector('.XXX');
//search element variables 
const searchSection = document.querySelector('.leftsearch');
const userInput = document.querySelector('.userInput');
const searchBtn = document.querySelector('.searchBtn');
const historyContainer = document.querySelector('.historyContainer');
//header element variables
const header = document.querySelector('.header');
const greeting = document.querySelector('.greeting');
const dayDate = document.querySelector('.dayDate');
const currentTime = document.querySelector('.currentTime');
//currentContainer element variables 
const currentContainer = document.querySelector('.currentContainer');
const weatherIcon = document.querySelector('.currentWeatherIcon');
const currentCity = document.querySelector('.currentCity');
const currentDate = document.querySelector('.currentDate');
const currentTemp = document.querySelector('.currentTemp');
const currentHumidity = document.querySelector('.currentHumidity');
const currentWind = document.querySelector('.currentWind');
const currentUVIndex = document.querySelector('.currentUVIndex');
//futureContainer element variables 
// const futureContainer = document.querySelector('.futureContainer');
// const futureDate = document.querySelector('.futureDate');
// const futureDay = document.querySelector('.futureDay');
// const futureTemp = document.querySelector('.futureTemp');
// const futureHumidity = document.querySelector('.futureHumidity');
// const futureWind = document.querySelector('.futureWind');


//header: greeting & display current date/time

function getTime () {
    var today = new Date ();
    var timeToday = moment();
//getHours() -- current hour between 0-23
    var hour = today.getHours();
    // var time = (hour - 12) + ":" + minute;
    var time = timeToday.format("dddd, MMMM Do, h:mm");
    
    // conditional statement for am and pm, and greetings
    if (hour < 12){
        currentTime.innerHTML = time + "AM";
        greeting.textContent = "☀️ Good Morning!"
    //current time is 6pm or greater, greet evening
    } else if (hour >= 12 && hour < 18) {
        currentTime.innerHTML = time + "PM";
        greeting.textContent = "🌤 Good Afternoon!"
    } 
    else {
        currentTime.innerHTML = time + "PM";
        greeting.textContent = "🌙 Good Evening!"
    }

}
getTime();

setInterval(function () {
    getTime();
}, 60000)

//function for search bar input/display

//fetch location api

function getWeather(city) {
    fetch(`${geoAPI}?q=${encodeURI(city)}&limit=5&appid=${APIkey}`)
    .then(function (res){
        console.log(`HERE'S THE INFORMATION YOU PULLED`, res);
        return res.json();
    })
    .then(function (data){
        console.log(data);
        var lat = data[0].lat;
        var lon = data[0].lon;
        getWeatherInfo(lat, lon)
        //display city name
        currentCity.textContent = "📍 " + city;
    })
}
//default Location
getWeather("New York")

//fetch weather api

function getWeatherInfo(latitude, longitude){
    fetch(`${onecallAPI}?lat=${latitude}&lon=${longitude}&units=imperial&appid=${APIkey}`)
    .then(function (res){
        return res.json();
    })
    .then(function (data){
        console.log(data);
        var UTCDate = data.current.dt;
        var locationDate = new Date(UTCDate * 1000)
        var formatedDate = days[locationDate.getDay()]; 
            currentDate.textContent = formatedDate;

     //set vars for weather Information
        var weatherIconMain = data.current.weather[0].icon;
        weatherIcon.src =  `http://openweathermap.org/img/wn/${weatherIconMain}@2x.png`

        var weatherTemp = data.current.temp;
        currentTemp.textContent = `${Math.ceil(weatherTemp)}°`;

        var weatherHumid = data.current.humidity;
        currentHumidity.textContent = `Hum | ${weatherHumid}%`;

        var weatherWind = data.current.wind_speed;
        currentWind.textContent = `Wind | ${Math.ceil(weatherWind)} MPH`;

        var weatherUV = Math.round(data.current.uvi * 10) / 10;
        currentUVIndex.textContent = `UV | ${weatherUV}%`;


        let output = '';
        var timeToday = moment();
        var time = timeToday.format("dddd, MMMM Do");
        //loop through daily forecast
         for (var d = 1; d < 7; d++) {
            var dailyDt = data.daily[d].dt; 
            var dailyDtConvert = new Date(dailyDt * 1000);
            var dailyDtFormat = days[dailyDtConvert.getDay()];
            // var dailyLocalDate = dailyDtConvert.toLocaleDateString();
            var dailyWeather = data.daily[d].temp.max;
            var dailyIcon = data.daily[d].weather[0].icon;
            var futureHumidity = data.daily[d].humidity;
            var futureWind = data.daily[d].wind_speed;
            // <div class="futureDay">${dailyLocalDate}</div>

            output += /*html*/ `
                <div class="eachCard" id="futureContainer">
                    <div class="flex">  
                        <img class="dailyWeatherIcon"  src= "http://openweathermap.org/img/wn/${dailyIcon}@2x.png"alt= "Weather Icon">
                        <div class="futureDate">${dailyDtFormat}</div>
                        <div class="dailyTemp">${Math.ceil(dailyWeather)}°</div>
                        <div class="futureHumidity">Hum | ${futureHumidity}%</div>
                        <div class="futureWind"> Wind | ${Math.ceil(futureWind)} mph</div>

                    </div>
                </div>
            `;
        }
            $('#futureContainer').html(output);
    });
}

// search city function 
function searchCity(event) {
    event.preventDefault();
    var searchValue = userInput.value.trim();
    getWeather(searchValue);
    
    //add to localstorage
    var fromLocal = localStorage.getItem("city");
    var parsedValue = JSON.parse(fromLocal);
    /*If value is null (meaning that we've never saved anything to that 
    spot in localStorage before), use an empty array as our array. 
    Otherwise, just stick with the value we've just parsed out.*/
    var array = parsedValue || [];

    /*If our parsed/empty array doesn't already have this value in it
    put it in the front and pop one off the end if array is too big.*/
    if (array.indexOf(searchValue) === -1){
        array.unshift(searchValue);
        //setting limit in localStorage
            if(array.length > 10) {
                array.pop();
            }

        //turn the array WITH THE NEW VALUE IN IT into a string to prepare it to be stored in localStorage
        var newValue = JSON.stringify(array);

        localStorage.setItem ("city", newValue);
    }
     displayStorage();
}

//adding to local storage

function removeLocal(targetValue) {
    var removeHistory = JSON.parse(localStorage.getItem('city'));

    for (var i = 0; i < removeHistory.length; i++){
          if (removeHistory[i] === targetValue){
              //to remove a value from storage
              removeHistory.splice(i,1);
          };
        }
    localStorage.setItem("city",JSON.stringify(removeHistory))
}

function displayStorage() {
    var displayHistory = JSON.parse(localStorage.getItem('city'));
    //create html element to append
	let output = '';
	if (displayHistory) {
		for (var i = 0; i < displayHistory.length; i++) {
			output += /*html*/ `
            <div class="searchHistory">           
                <button class="historyBtn" data-hover="⚡️" data-id="${displayHistory[i]}">${displayHistory[i]}</button>
                <button class="removeBtn" data-id="${displayHistory[i]}">⚡️</button>
            </div>
        `;
		}
		$('#historyContainer').html(output);
	} else {
		console.log('No History to display');
	}
    //remove from local storage
    $(".removeBtn").on("click",function(){
        var cityRemove=$(this).attr("data-id")
        removeLocal(cityRemove)
       location.reload()
    })
}

displayStorage();

var histBtn = document.getElementsByClassName('historyBtn');
for (var b = 0; b < histBtn.length; b++) {
	histBtn[b].addEventListener('click', function (event) {
		var value = event.target.getAttribute('data-id');
		getWeather(value);
	});
}

//saved search results to local storage & allow user to delete searched cities
searchBtn.addEventListener("click", searchCity);