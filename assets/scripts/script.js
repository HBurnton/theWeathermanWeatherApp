//One Call Does Not Work
//https://api.openweathermap.org/data/3.0/onecall?lat=33.44&lon=-94.04&exclude=hourly&appid=316a4a8f9d4163ffc80129de442a5dcd&units=imperial
//https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&appid=${APIKEY}units=imperial

//GeoForLatLong
//https://api.openweathermap.org/geo/1.0/direct?q={CityName}&limit=1&appid=316a4a8f9d4163ffc80129de442a5dcd


var APIKey = "316a4a8f9d4163ffc80129de442a5dcd";
var city;
var button = document.querySelector('#submitButton');
var heading = document.querySelector('h1');
var cityInput = document.querySelector('#cityName');



function buttonHandler(){

    city = cityInput.value.trim();

    if(city == ''){
        alert('Text field is Blank');
        return
    }

    console.log(city);
    heading.textContent = 'Button Working'

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
            console.log(data)
            displayCurrentData(data.current);
            displayForecast(data.daily);
        })

}

function displayForecast(data){


}

function displayCurrentData(data){
    var dateString = moment.unix(data.dt).format("MM/DD/YYYY");
    console.log(dateString)

}

button.addEventListener('click', buttonHandler)
