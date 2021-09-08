let weather = {
    apiKey: "a540d6e179de2377ea467ece97de4b28",
    fetchWeather: function(city) {
        fetch("https://api.openweathermap.org/data/2.5/weather?q="
        + city + 
        "&units=metric&appid="
         + this.apiKey)
        .then(res => res.json())
        .then(data => this.displayWeather(data));
    },

    displayWeather: function(data){
        const {name} = data;
        const {icon, description} = data.weather[0];
        const {temp, humidity} = data.main;
        const {speed} = data.wind;

        document.querySelector('.city').innerText = name;
        document.querySelector('.icon').src = "https://openweathermap.org/img/wn/"+ icon + ".png";
        document.querySelector('.description').innerText = description;
        document.querySelector('.temp').innerText = temp + "°C";
        document.querySelector('.humidity').innerText = "Humidity:" + humidity + "%";
        document.querySelector('.wind').innerText = "Wind speed:" + speed + "km/hr";
        document.querySelector('.weather').classList.remove('loading')
    },

    search: function(){
        this.fetchWeather(document.querySelector('.search-bar').value);
    }
};

let geoCode = {
    reverseGeocode: function(latitude, longitude) {
        var api_key = 'deb150e557174ebea69577b98a4f0293';

  var api_url = 'https://api.opencagedata.com/geocode/v1/json'

  var request_url = api_url
    + '?'
    + 'key=' + api_key
    + '&q=' + encodeURIComponent(latitude + ',' + longitude)
    + '&pretty=1'
    + '&no_annotations=1';

  // see full list of required and optional parameters:
  // https://opencagedata.com/api#forward

  var request = new XMLHttpRequest();
  request.open('GET', request_url, true);

  request.onload = function() {
    // see full list of possible response codes:
    // https://opencagedata.com/api#codes

    if (request.status === 200){ 
      // Success!
      var data = JSON.parse(request.responseText);
      weather.fetchWeather(data.results[0].components.state);

    } else if (request.status <= 500){ 
      // We reached our target server, but it returned an error
                           
      console.log("unable to geocode! Response code: " + request.status);
      var data = JSON.parse(request.responseText);
      console.log('error msg: ' + data.status.message);
    } else {
      console.log("server error");
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
    console.log("unable to connect to server");        
  };

  request.send();  // make the request
    },

    getLocation: function() {
        function success(data) {
            geoCode.reverseGeocode(data.coords.latitude, data.coords.longitude)
        }

        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(success, console.error)
        } 
        else{
            weather.fetchWeather('Lagos');
        }
        
    }
} 

document.querySelector('.search button').addEventListener('click', function(){
    weather.search();
});

document.querySelector('.search-bar').addEventListener('keyup', function(e){
    if(e.key === "Enter"){
        weather.search()
    };
});

geoCode.getLocation();


