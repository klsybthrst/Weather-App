const currentDay = moment().format('L');

var WeatherAPIKey = "a6f3b7420d4e89cf8948dcd3d71f9ae4";
var userInput = document.getElementById("search-Input");
var searchButton = document.getElementById("searchButton");
var searchHistory = getSearchHistory();

//localStorage
function searchCity(event) {
    event.preventDefault();
    var input = userInput.value;
    if (!input || input == "") return;
    addToSearchHistory(input);
    createListItem(input);
    getweatherdata(input);
    currentweatherdata(input);
    
}

function addToSearchHistory(cityName) {
    searchHistory.push(cityName);
    localStorage.searchHistory = JSON.stringify(searchHistory);
}

function getSearchHistory() {
    return JSON.parse(localStorage.searchHistory || "[]");
}

function createSidebarFromHistory() {
    if (searchHistory.length == 0) {
        console.log("no search history")
    }
    else {
    
    getweatherdata(searchHistory[searchHistory.length - 1]);
    currentweatherdata(searchHistory[searchHistory.length - 1]);
    searchHistory.forEach(createListItem);
    
    }
    
}

function createListItem(cityName) {

    var node = document.createElement("li");
    node.setAttribute("class", "list-group-item");
    node.setAttribute("style", "word-wrap: break-word;");
    var textnode = document.createTextNode(cityName);
    node.appendChild(textnode);
    node.addEventListener("click", function() {
        handleSideBarOnClick(cityName);
    });
    document.querySelector(".cities").appendChild(node);
}

// clearButton
function clearSearch (){

      var clearBtn = $(`<button class="btn btn-info active" style="margin:auto; width:100%; background-color: cornflowerblue;margin-top: 50px;">Clear All</button>`);
    $(clearBtn).click(function() {
        var bye = localStorage.clear();
        var emptyList = $("ul.cities li").remove();
    });
    clearBtn.appendTo(".cities");  

}
clearSearch();


function handleSideBarOnClick(name) {
    getweatherdata(name);
    currentweatherdata(name);
    
}


//fiveDay
function getweatherdata(name) {
    var forecastqueryURL = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=" + name + "&APPID=" + WeatherAPIKey;
    $('.weather').empty();

    $.ajax({
            url: forecastqueryURL,
            method: "GET"
        })
        .then(function(response) {
            $('.city').text(response.city.name);
            for (var i = 0; i < 5; i++) {
                let forecastIndex = ((i + 1) * 8) - 5; 
                let forecast = response.list[forecastIndex];
                let forecastDate = moment(currentDay, "L")
                    .add((i + 1), 'days')
                    .format('L');


                $(`
            <div class="col-weather-day">
                <div class="card portfolioCard">
                  <div>
                    <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" class="card-image" style="margin: 0 10px;">
                  </div>
                  <div class="card-body">
                    <h5 class="card-title">${forecastDate}</h5>
                    <p class="card-temp">Temperature:${forecast.main.temp}&#186 C</p>
                  </div>
                </div>
              </div>  
            `).appendTo('.weather');
            }
            // console.log(response.list[0])
        
        });
}
//Single Day
function currentweatherdata(name) {
  var forecastqueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + name + "&APPID=" + WeatherAPIKey;
  $('.weatherIconWrap').empty();
  $('.uvIndex').empty().removeClass('lowUV modUV highUV vhighUV');
  $('.currentWeatherData').empty();
  document.querySelector(".currentWeatherData").textContent =  "Current Weather";
  
  $.ajax({
          url: forecastqueryURL,
          method: "GET"
      })
      .then(function(response) {
        console.log(`response is:`, response)
          document.querySelector(".city").textContent =  response.main.name
          document.querySelector(".temp").textContent = "Temperature: " + (response.main.temp - 273.15).toFixed(1) + "°C"
          document.querySelector(".humidity").textContent = "Humidity: " + response.main.humidity + "%"
          document.querySelector(".wind").textContent = "Wind Speed: " + response.wind.speed + "mph"
          $(`
          <img class="weatherIcon" src="https://openweathermap.org/img/wn/${response.weather[0].icon}.png">
          `).appendTo('.weatherIconWrap');
          var lat = response.coord.lat;
          var lon = response.coord.lon;
            console.log(lat);
            console.log(lon);
            var UVqueryURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + WeatherAPIKey
            $.ajax({
                        url: UVqueryURL,
                        method: "GET"
                    })
                    .then(function(response) {
                        console.log(`response is:`, response);
                        var UVIndex = response.value
                        // $(`
                        // UV Index: <span class="UVColour">${UVIndex}</span>
                        // `).appendTo('.uvIndex');
                        document.querySelector(".uvIndex").textContent = "UV Index: " + UVIndex
                        console.log (UVIndex);

                            if (UVIndex < 3) {
                                document.querySelector(".uvIndex").classList.add("lowUV");
                            } 
                            if (UVIndex > 2 && UVIndex < 6) {
                                document.querySelector(".uvIndex").classList.add("modUV");
                            }
                            if (UVIndex > 5 && UVIndex < 8) {
                                document.querySelector(".uvIndex").classList.add("highUV");
                            }
                            if (UVIndex > 8) {
                                document.querySelector(".uvIndex").classList.add("vhighUV");
                            }    
                    })
        });

}


createSidebarFromHistory();

searchButton.addEventListener("click", searchCity);