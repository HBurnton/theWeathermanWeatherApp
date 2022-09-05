var APIKey = "316a4a8f9d4163ffc80129de442a5dcd";
var city;
var button = document.querySelector('#submitButton');
var cityInput = document.querySelector('#cityName');
var cardContainer = document.querySelector('#cardContainer');
var currentContainer = document.querySelector('#currentWeatherContainer')
var h2Header = document.querySelector('#fiveDay')
var priorSearchList = document.querySelector('#priorSearchList')
var priorSearches = [];

//trims entered text from input field and sends it to OpenAPIs GeoCall
function buttonHandler(event){
    event.preventDefault();
    city = cityInput.value.trim().toLowerCase();
    if(city == ''){
        alert('Text field is Blank');
        return
    }
    getLatLong(city);
    
}

//retrieves inner text from clicked li and passes as city to GeoCall
function linkHandler(event){
    city = event.target.textContent;
    getLatLong(city);
}

//function clears all current html content of fields of containers to be rewritten
function clearAll(){
    cardContainer.innerHTML = '';
    h2Header.textContent = '';
    cityInput.value = '';
    currentContainer.textContent = '';
}

function getLatLong(city){

    var APIGeoCall = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIKey}`

    fetch(APIGeoCall)
        .then(function (response){
            return response.json();
        })
        .then(function (data){
            if (data.length != 0){
             //checks waits to see if valid city, if city is valid, then adds to array of cities if new
                if(!priorSearches.includes(city)){
                    priorSearches.push(city);
                    window.localStorage.setItem('storedSearches', JSON.stringify(priorSearches));
                    printPriorSearches();
                }
            //uses retrieved lat and long to call OneCall
            makeOneCall(data[0].lat, data[0].lon);
        }
        })

}

function makeOneCall(lat,lon){

    var APIOneCall = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&appid=${APIKey}&units=imperial`

    fetch(APIOneCall)
        .then(function (response){
            return response.json();
        })
        .then(function (data){
            clearAll();
            //Uses Data from One Call and sends relevant data to functions to print 5 day forecast and current weather
            displayCurrentData(data.current, data.daily);
            displayFiveForecast(data.daily);
        })
}

//create individual cards for next 5 days and appends them to cardContainer Div
function displayFiveForecast(data){
    h2Header.textContent = '5-Day Forecast';
    for(i=1; i<6; i++){
        var card = document.createElement('div');
        card.setAttribute('class', 'text-bg-dark card rounded shadow my-2');
        card.innerHTML = `<div class="card-body ">
                            <h5 class="card-header">${convertDate(data[i].dt)}</h5>
                            <img src=http://openweathermap.org/img/wn/${data[i].weather[0].icon}@2x.png />
                            <ul class="card-text list-unstyled">
                                <li>Max Temperature: ${data[i].temp.max} &degF</li>
                                <li>Wind Speed: ${data[i].wind_speed} MPH</li>
                                <li>Humidity: ${data[i].humidity}%</li>
                            </ul>`
        cardContainer.appendChild(card);
    }
}

//Creates a box to display current temperature and appends to current weather container
function displayCurrentData(data, todaysHigh){
    var cityCurrentInfo = document.createElement('div');
    var uvColor = getUVColor(data.uvi);
    cityCurrentInfo.setAttribute('class', 'w-100')
    cityCurrentInfo.innerHTML = `<div class='d-flex align-items-center'>
                                <h2>${city}</h2>
                                 <img src=http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png />
                                 </div>
                                 <h3 class='text-white'>Current Conditions</h3>
                                    <ul class="list-unstyled list-group">
                                        <li class="list-group-item">Current Temperature: ${data.temp} &degF</li>
                                        <li class="list-group-item">Today's Projected High: ${todaysHigh[0].temp.max} &degF</li>
                                        <li class="list-group-item">Wind Speed: ${data.wind_speed} MPH</li>
                                        <li class="list-group-item">Humidity: ${data.humidity}%</li>
                                        <li class="list-group-item">UV Index: <span class="uvIcon" id='${uvColor}'>${data.uvi}</span></li>
                                    </ul>`
    currentContainer.append(cityCurrentInfo);

}

//simple function that returns a string to corresponding ID that styles number with desired color
function getUVColor(uvIndex){

    if(uvIndex < 2){
        return 'low';
    }
    if(uvIndex < 6){
        return 'medium';
    }
    else{
        return 'high';
    }
}

//utilized to convert OpenWeather's Native Unix timestamps
function convertDate(unixDate){
    return moment.unix(unixDate).format("MM/DD/YYYY");
}

//checks to see if there are any prior stored searches, if so, sends to below function to create and append list items
function loadPriorSearches(){ 
    var storedSearches = window.localStorage.getItem("storedSearches")
    if(storedSearches){
        priorSearches = JSON.parse(storedSearches);
        printPriorSearches();
    }
}

function printPriorSearches(){
    //
    priorSearchList.innerHTML = '';
    for(var i = 0; i < priorSearches.length; i++){
            var searchLocationLink = document.createElement('li');
            searchLocationLink.textContent = priorSearches[i];
            priorSearchList.appendChild(searchLocationLink);
    }
}

//loads prior search history and adds respective handlers
loadPriorSearches();
button.addEventListener('click', buttonHandler)
priorSearchList.addEventListener('click', linkHandler)
