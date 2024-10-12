const apiKey = "e1e5cbe7414842b6a3f160652232903";
const apiURL = `http://api.weatherapi.com/v1`;
const urlPexelsReal = `4fKaQ7EJxTX1ggy1Vohoowu7Ea1mqe8COsDfkQX0HtpiQ5Q5vvaCDXY8`;

const input = document.createElement("input");
input.setAttribute("list", "city-data");
input.setAttribute("id", "city-search");
input.setAttribute("placeholder", "Type to search...");

const label = document.createElement("label");
label.setAttribute("for", "city-search");
label.textContent = "Choose a City:";

const dataList = document.createElement("datalist");
dataList.setAttribute("id", "city-data");

const spinner = document.createElement("spinner");
spinner.setAttribute("hidden", "");
spinner.setAttribute("id", "spinner");

const weatherCard = document.createElement("div");
weatherCard.setAttribute("id", "weather-card");

const rootElement = document.getElementById("root");
rootElement.appendChild(dataList);
rootElement.appendChild(label);
rootElement.appendChild(input);
rootElement.appendChild(weatherCard);
rootElement.appendChild(spinner);

function fetchWeatherData(cityName) {
  spinner.removeAttribute("hidden");
  const url = `${apiURL}/current.json?key=${apiKey}&q=${cityName}&aqi=no`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      spinner.setAttribute("hidden", "");

      const cityLocationData = data.location;
      const cityWeatherData = data.current;

      weatherCard.innerHTML = "";

      const cityElement = document.createElement("div");
      cityElement.innerHTML = "City: " + cityLocationData.name;

      const tempElement = document.createElement("div");
      tempElement.innerHTML = "Temperature: " + cityWeatherData.temp_c + " Celsius";

      const humidElement = document.createElement("div");
      humidElement.innerHTML = "Humidity: " + cityWeatherData.humidity + "%";

      const conditionElement = document.createElement("div");
      conditionElement.innerHTML = "Condition: " + cityWeatherData.condition.text;

      const dateElement = document.createElement("div");
      dateElement.innerHTML = "Today: " + getDate(cityLocationData.localtime);

      const localTimeElement = document.createElement("div");
      localTimeElement.innerHTML = "Local time: " + getTime(cityLocationData.localtime);

      weatherCard.append(cityElement, dateElement, localTimeElement, tempElement, humidElement, conditionElement);

      getImgCity(cityLocationData.name);
      input.value = "";
      input.blur();
      dataList.innerHTML = "";
      dataList.blur();
    })
    .catch((error) => console.error(error));
}

function getDate(localTime) {
  const year = localTime.substring(0, 4);
  const month = localTime.substring(5, 7);
  const day = localTime.substring(8, 10);
  return day + " " + month + " " + year;
}

function getTime(localTime) {
  return localTime.substring(11, 17);
}

function getCity(e) {
  const city = e.target.value;
  if (city.length >= 3) {
    const urlSearch = `${apiURL}/search.json?key=${apiKey}&q=${city}`;
    fetch(urlSearch)
      .then((response) => response.json())
      .then((data) => {
        dataList.innerHTML = "";
        data.forEach((element) => {
          dataList.insertAdjacentHTML("beforeend", `<option value="${element.name}">`);
        });
      })
      .catch((error) => console.error(error));
  }
}

function getImgCity(name) {
  const urlPexels = `https://api.pexels.com/v1/search?query=${name}`;
  let fetchData = {
    method: "GET",
    headers: new Headers({
      Authorization: urlPexelsReal,
    }),
  };
  fetch(urlPexels, fetchData)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.photos[0].src.medium);
      document.getElementById("weather-card").style.backgroundImage = `url(${data.photos[0].src.medium})`;
    })
    .catch((error) => console.error(error));
}

function getDataListOptions() {
  return dataList.childNodes;
}
function getSelectedOption(input) {
  const dataListOptions = getDataListOptions();
  for (let i = 0; i < dataListOptions.length; i++) {
    if (input == dataListOptions[i].value) {
      return input;
    }
  }
  return null;
}

// Listen for changes to the datalist selection
input.addEventListener("input", (e) => {
  console.log(e);
  const selectedCityName = e.target.value;
  if (getSelectedOption(selectedCityName)) {
    fetchWeatherData(selectedCityName);
  } else {
    getCity(e);
  }
});
