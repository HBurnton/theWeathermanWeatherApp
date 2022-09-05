var APIKey = "316a4a8f9d4163ffc80129de442a5dcd";
var city;
var button = document.querySelector('#submitButton');
var cityInput = document.querySelector('#cityName');
var cardContainer = document.querySelector('#cardContainer');
var currentContainer = document.querySelector('#currentWeatherContainer')
var h2Header = document.querySelector('#fiveDay')
var priorSearchList = document.querySelector('#priorSearchList')
var priorSearches = [];


function buttonHandler(event){
    event.preventDefault();
    city = cityInput.value.trim().toUpperCase();

    if(city == ''){
        alert('Text field is Blank');
        return
    }
    getLatLong(city);
    clearAll();
    
}

function linkHandler(event){
    event.preventDefault;
    city = event.target.textContent;
    getLatLong(city);
    clearAll();
}

function clearAll(){
    cardContainer.innerHTML = '';
    h2Header.textContent = '';
    cityInput.value = '';
    currentContainer.textContent = '';
}

function getLatLong(city){
    
    var APIGeoCall = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIKey}`
    if(!priorSearches.includes(city)){
        priorSearches.push(city);
        window.localStorage.setItem('storedSearches', JSON.stringify(priorSearches));
        printPriorSearches();
    }


    fetch(APIGeoCall)
        .then(function (response){
            return response.json();
        })
        .then(function (data){
            if (data.length != 0){
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
            console.log(data.current);
            displayCurrentData(data.current);
            displayFiveForecast(data.daily);

        })
}

function displayFiveForecast(data){
    h2Header.textContent = '5-Day Forecast';
    for(i=1; i<6; i++){
        var card = document.createElement('div');
        card.setAttribute('class', 'text-bg-dark card rounded shadow my-2');
        //card.setAttribute('style', 'width: 190px;')
        card.innerHTML = `<div class="card-body ">
                            <h5 class="card-header">${convertDate(data[i].dt)}</h5>
                            <img src=http://openweathermap.org/img/wn/${data[i].weather[0].icon}@2x.png />
                            <ul class="card-text list-unstyled">
                                <li>Max Temperature: ${data[i].temp.max} F</li>
                                <li>Wind Speed: ${data[i].wind_speed} MPH</li>
                                <li>Humidity: ${data[i].humidity}%</li>
                            </ul>`
        cardContainer.appendChild(card);
    }
}

function displayCurrentData(data){
    var cityCurrentInfo = document.createElement('div');
    var uvColor = getUVColor(data.uvi);
    cityCurrentInfo.setAttribute('class', 'w-100')
    cityCurrentInfo.innerHTML = `<div class='d-flex align-items-center'>
                                <h2>${city}</h2>
                                 <img src=http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png />
                                 </div>
                                 <h3 class='text-secondary'>Current Conditions</h3>
                                    <ul class="list-unstyled">
                                        <li>Current Temperature: ${data.temp}</li>
                                        <li>Wind Speed: ${data.wind_speed} MPH</li>
                                        <li>Humidity: ${data.humidity}%</li>
                                        <li>UV Index: <span class="uvIcon" id='${uvColor}'>${data.uvi}</span></li>
                                    </ul>`
    currentContainer.append(cityCurrentInfo);

}

function getUVColor(uvIndex){
    if(uvIndex < 3){
        return 'low';
    }
    if(uvIndex<7){
        return 'medium';
    }
    else{
        return 'high';
    }
}

function convertDate(unixDate){
    return moment.unix(unixDate).format("MM/DD/YYYY");
}

function loadPriorSearches(){
    var storedSearches = window.localStorage.getItem("storedSearches")
    if(storedSearches){
        priorSearches = JSON.parse(storedSearches);
        printPriorSearches();
    }
}

function printPriorSearches(){
    priorSearchList.innerHTML = '';
    for(var i = 0; i < priorSearches.length; i++){
            var searchLocationLink = document.createElement('li');
            searchLocationLink.textContent = priorSearches[i];
            priorSearchList.appendChild(searchLocationLink);
    }
}


button.addEventListener('click', buttonHandler)
loadPriorSearches();
priorSearchList.addEventListener('click', linkHandler)
