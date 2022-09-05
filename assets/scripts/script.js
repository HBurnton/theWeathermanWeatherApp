var APIKey = "316a4a8f9d4163ffc80129de442a5dcd";
var city;
var button = document.querySelector('#submitButton');
var cityInput = document.querySelector('#cityName');
var cardContainer = document.querySelector('#cardContainer');
var currentContainer = document.querySelector('#currentWeatherContainer')


function buttonHandler(event){
    event.preventDefault();
    cardContainer.innerHTML = '';

    city = cityInput.value.trim();

    if(city == ''){
        alert('Text field is Blank');
        return
    }

    getLatLong(city);
    
}

function getLatLong(city){
    
    var APIGeoCall = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIKey}`

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
            console.log(data);
            displayCurrentData(data.current);
            displayFiveForecast(data.daily);
        })

}

function displayFiveForecast(data){
    cardContainer.before(forecastHead)
    for(i=1; i<6; i++){

        var card = document.createElement('div');
        card.setAttribute('class', 'card w-20');
        card.innerHTML = `<div class="card-body">
                            <h5 class="card-header">${convertDate(data[i].dt)}</h5>
                            <img src=http://openweathermap.org/img/wn/${data[i].weather[0].icon}@2x.png />
                            <ul class="card-text">
                                <li>Max Temperature: ${data[i].temp.max}</li>
                                <li>Wind Speed: ${data[i].wind_speed}</li>
                                <li>Humidity: ${data[i].humidity}</li>
                            </ul>`
        cardContainer.appendChild(card);
    }
}

function displayCurrentData(data){
    currentContainer.textContent = '';
    var cityCurrentInfo = document.createElement('div');
    cityCurrentInfo.innerHTML = `<h2>${city}</h2>`
    currentContainer.append(cityCurrentInfo);

}

function convertDate(unixDate){
    return moment.unix(unixDate).format("MM/DD/YYYY");
}

button.addEventListener('click', buttonHandler)
