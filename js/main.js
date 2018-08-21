function getShortDateFromUnixTime(unixSeconds) {
    let d = new Date(0);
    d.setUTCSeconds(unixSeconds);
    options = { 
        weekday: 'short',
        month: 'long',
        day: 'numeric'
    };
    return d.toLocaleDateString('en-GB', options)
}

function getTimeFromUnixTime(unixSeconds) {
    let d = new Date(0);
    d.setUTCSeconds(unixSeconds);
    options = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    return d.toLocaleTimeString(undefined, options)
}


let weatherConditions = new XMLHttpRequest();
weatherConditions.open('GET', 'weather_info.txt', true);
weatherConditions.responseType = 'text';
weatherConditions.send();

weatherConditions.onload = function() {
    if (weatherConditions.status === 200) {
        let weatherObj = JSON.parse(weatherConditions.responseText);
        console.log(weatherObj);
        let localTime = new Date(0);
        localTime.setUTCSeconds(weatherObj.dt);
        document.getElementById('dt').innerHTML =  `${getTimeFromUnixTime(weatherObj.dt)}, ${getShortDateFromUnixTime(weatherObj.dt)}`;
        document.getElementById('weatherIcon').setAttribute("src", `http://openweathermap.org/img/w/${weatherObj.weather["0"].icon}.png`);
        document.getElementById('todaysWeather').innerHTML += ` ${weatherObj.main.temp}&#8451`;
        document.getElementById('todaysWeatherDescription').innerHTML = weatherObj.weather["0"].description; 
        document.getElementById('wind').innerHTML = `${weatherObj.wind.speed}m/s`;
        document.getElementById('cloudiness').innerHTML = `${weatherObj.clouds.all}%`;
        document.getElementById('pressure').innerHTML = `${weatherObj.main.pressure}hPa`;
        document.getElementById('humidity').innerHTML = `${weatherObj.main.humidity}%`;
        document.getElementById('geoCoords').innerHTML = `[${weatherObj.coord.lat}, ${weatherObj.coord.lon}]`;
    }
}

// creates a list with 40 meteorological readings from the forecastObj
function createForecastEveryThreeHourObj(forecastObj) {
    
    let forecastEveryThreeHours = [];

    for (var i = 0; i < forecastObj.list.length; i++) {
        forecastEveryThreeHours.push(new Object);
        forecastEveryThreeHours[i].dt = forecastObj.list[i].dt;
        forecastEveryThreeHours[i].temp = `${forecastObj.list[i].main.temp}&#8451`;
        forecastEveryThreeHours[i].description = `http://openweathermap.org/img/w/${forecastObj.list[i].weather["0"].icon}.png`;
        forecastEveryThreeHours[i].wind = `${forecastObj.list[i].wind.speed}m/s`;
        forecastEveryThreeHours[i].pressure = `${forecastObj.list[i].main.pressure}hPa`;
        forecastEveryThreeHours[i].humidity = `${forecastObj.list[i].main.humidity}%`; 
    };
    return forecastEveryThreeHours;
};

// creates the forecast table from the forecastEveryThreeHoursDay list
function createForecastTable(forecastEveryThreeHoursDay) {
    forecastTable = Array.from(document.getElementById('forecastTableBody').children);
    console.log(forecastTable);
    for (let i = 0; i < forecastTable.length; i++) {
        forecastTable[i].innerHTML = "";
        for (let key in forecastEveryThreeHoursDay[i]) {
            let tdTag = document.createElement('td');
            if (key === 'dt') {
                tdTag.innerHTML = getTimeFromUnixTime(forecastEveryThreeHoursDay[i][key]);
                forecastTable[i].appendChild(tdTag);
            } else if (key === 'description') {
                let imgTag = document.createElement('img');
                imgTag.setAttribute("src", forecastEveryThreeHoursDay[i][key]);
                imgTag.setAttribute("alt", "icon");
                imgTag.setAttribute("title", key);
                forecastTable[i].appendChild(imgTag);
            } else {      
                tdTag.innerHTML = forecastEveryThreeHoursDay[i][key];
                tdTag.setAttribute("title", key);
                forecastTable[i].appendChild(tdTag);
            }
        }
    } 
}


function getForecast (index1, index2) {
    let forecastWeather = new XMLHttpRequest();
    forecastWeather.open('GET', 'forecast_info.txt', true);
    forecastWeather.responseType = 'text';
    forecastWeather.send();

    forecastWeather.onload = function() {
        if (forecastWeather.status === 200) {
            let forecastObj = JSON.parse(forecastWeather.responseText);
            console.log(forecastObj);

            forecastEveryThreeHours = createForecastEveryThreeHourObj(forecastObj);
            console.log(forecastEveryThreeHours);
            console.log(forecastEveryThreeHours[8].dt);
            console.log(getShortDateFromUnixTime(forecastEveryThreeHours[8].dt));
            document.getElementById('tomorrow').innerHTML = getShortDateFromUnixTime(forecastEveryThreeHours[8].dt);
            document.getElementById('theDayAfterTomorrow').innerHTML = getShortDateFromUnixTime(forecastEveryThreeHours[16].dt);
            document.getElementById('theDayAfterThat').innerHTML = getShortDateFromUnixTime(forecastEveryThreeHours[24].dt);
            
            forecastEveryThreeHoursDay = forecastEveryThreeHours.slice(index1, index2);
            console.log(forecastEveryThreeHoursDay);

            document.getElementById('forecastDay').innerHTML = getShortDateFromUnixTime(forecastEveryThreeHoursDay[0]['dt']);
            
            createForecastTable(forecastEveryThreeHoursDay);
        }
    }
}


getForecast(0, 8);

document.getElementById('tomorrow').addEventListener('click', function() {getForecast(8,16)});
document.getElementById('theDayAfterTomorrow').addEventListener('click', function() {getForecast(16, 24)});
document.getElementById('theDayAfterThat').addEventListener('click', function() {getForecast(24, 32)});
