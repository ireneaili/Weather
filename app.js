var placesLocation;
var loader = document.getElementById("loader");
var main = document.getElementById("main");
var searchInput = document.querySelector('#input-styling-address input');

var placesAutocomplete = places({
    appId: "plCMVU9X67E7",
    apiKey: "f553c15de39642507fe9516600aff5ed",
    container: document.querySelector('#input-styling-address input')
});

placesAutocomplete.on("change", function (result) {
    placesLocation = result.suggestion.name;
    var coords = result.suggestion.latlng.lat + "," + result.suggestion.latlng.lng;
    getWeather(coords);
})

function showPosition(position) {
    "use strict";
    var location = "" + position.coords.latitude + "," + position.coords.longitude;
    getLocationFromLatLng(location);
}

function clearCard() {
    if (document.getElementById("icon") !== null) {
        var child = document.getElementById("icon"),
            temp = document.getElementById("temperature"),
            summary = document.getElementById("summary"),
            location = document.getElementById("location");
        main.removeChild(child);
        main.removeChild(summary);
        main.removeChild(temp);
        main.removeChild(location);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    "use strict";
    var getloc = document.getElementById("getloc");
    getloc.addEventListener("click", function () {
        clearCard();
        if (navigator.geolocation) {
            loader.style.display = "block";
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            x.innerHTML = "Geolocation is not supported.";
        }
    });
});

function getLocationFromLatLng(location) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            writeLocation(location, this);
        }
    };
    xhttp.open("GET", "https://places-dsn.algolia.net/1/places/reverse?aroundLatLng=" + location + "&hitsPerPage=1&language=en", true);
    xhttp.send();
}

function writeLocation(location, jsonData) {
    jsonData = JSON.parse(jsonData.responseText);
    console.log(jsonData);
    placesLocation = jsonData.hits[0].city[0];
    searchInput.value = placesLocation + ", " + jsonData.hits[0].administrative[0];
    getWeather(location);
}

function getWeather(location) {
    //    var xhttp = new XMLHttpRequest();
    //    xhttp.onreadystatechange = function () {
    //        if (this.readyState === 4 && this.status === 200) {
    //            showWeather(this);
    //        }
    //    };
    //    xhttp.open("GET", "https://api.darksky.net/forecast/27bedc8345e1b05fb862552f1d448620/" + location, true);
    //    xhttp.send();
    //    const url = "https://api.darksky.net/forecast/27bedc8345e1b05fb862552f1d448620/" + location;
    //    fetch(url, {
    //        method: 'GET',
    //        mode: 'cors'
    //    })
    //    .then(response=> response.json())
    //    .then(json=> {showWeather(json)})
    var script = document.createElement('script');
    script.src = `https://api.darksky.net/forecast/27bedc8345e1b05fb862552f1d448620/${location}?callback=showWeather`;

    document.head.appendChild(script);
}

function showWeather(jsonData) {
    "use strict";
    clearCard();
    
    loader.style.display = "none";
    var location = document.createElement('p');
    location.innerHTML = placesLocation;
    location.setAttribute('id', "location");
    main.appendChild(location);
    const icon = chooseIcon(jsonData.currently.icon);
    main.insertAdjacentHTML('beforeend', icon);
    var temp = document.createElement("p");
    temp.innerHTML = jsonData.currently.temperature + " F";
    temp.setAttribute("id", "temperature");
    var summary = document.createElement("p");
    summary.innerHTML = jsonData.currently.summary;
    summary.setAttribute("id", "summary");
    main.appendChild(temp);
    main.appendChild(summary);

    function chooseIcon(icon) {
        switch (icon) {
            case "clear-day":
                return '<i class="current-icon wi wi-day-sunny" id="icon" style="color:rgba(255, 235, 84, 0.5)"></i>';
            case "clear-night":
                return '<i class="current-icon wi wi-night-clear" id="icon" style="color:rgb(59, 121, 206, 0.5)"></i>';
            case "rain":
                return '<i class="current-icon wi wi-rain" id="icon" style="color:rgba(98, 184, 234, 0.5)"></i>';
            case "snow":
                return '<i class="current-icon wi wi-snow" id="icon" style="color:rgb(224, 243, 255)"></i>';
            case "sleet":
                return '<i class="current-icon wi wi-sleet" id="icon" style="color:rgb(206, 217, 224)"></i>';
            case "wind":
                return '<i class="current-icon wi wi-windy" id="icon" style="color:rgb(206, 206, 224)"></i>';
            case "fog":
                return '<i class="current-icon wi wi-fog" id="icon" style="color:rgb(183, 183, 201)"></i>';
            case "cloudy":
                return '<i class="current-icon wi wi-cloudy" id="icon" style="color:rgba(154, 166, 183, 0.7)"></i>';
            case "partly-cloudy-day":
                return '<i class="current-icon wi wi-day-cloudy" id="icon" style="color:rgb(224, 223, 199)"></i>';
            case "partly-cloudy-night":
                return '<i class="current-icon wi wi-night-partly-cloudy" id="icon" style="color:rgba(124, 149, 193, 0.7)"></i>';
            default:
                return '<p></p>';
        }
    }
}
