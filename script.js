const changingDateFormat = (datetime) => {
  const dateParts = datetime.split("-");
  const Date = dateParts[2] + "/" + dateParts[1];
  return Date;
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const hours_min = (string) => {
  return string.substring(0, 5);
};

document.getElementById("cityName").addEventListener("keydown", (event) => {
  if (event.key === "Enter") city();
});

function updateTime() {
  let date = new Date();

  let hrs = date.getHours();
  let min = date.getMinutes();

  let time = hrs < 12 ? `${hrs}:${min} AM` : `${hrs - 12}:${min} PM`;
  document.getElementById("clock").innerHTML = time;
}

setInterval(updateTime, 1000);

function get_location() {
  const LOCATION_API =
    "https://api.geoapify.com/v1/ipinfo?&apiKey=39ca4c190197450fa3f82407c64b2e33";

  fetch(LOCATION_API)
    .then((response) => response.json())
    .then((data) => {
      const cityObject = data["city"];
      let CITY_NAME = cityObject["name"];

      console.log("City name:", CITY_NAME);
      weather_details(CITY_NAME);
    })
    .catch((error) => console.log("error", error));
}

function city() {
  let cityName = document.getElementById("cityName");
  let CITY_NAME = cityName.value;

  weather_details(CITY_NAME);
}

function weather_details(CITY_NAME) {
  const WEATHER_API = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${CITY_NAME}?unitGroup=metric&key=38HPTZHGDCQYKCL4X7BQFYQUM&contentType=json`;

  fetch(WEATHER_API)
    .then((response) => response.json())
    .then((data) => {
      const current = data["currentConditions"];

      const daysArray = data.days;

      const targetDays = [1, 2, 3, 4, 5];

      for (const i of targetDays) {
        const days = daysArray[i];

        const datetime = changingDateFormat(days.datetime);
        const tempmax = days.tempmax;
        const tempmin = days.tempmin;

        const dayElementId = `Day${i}`;

        const dayElement = document.getElementById(dayElementId);

        if (dayElement) {
          const date = document.createElement("span");
          date.innerHTML = datetime;

          const TempMax = document.createElement("span");
          TempMax.innerHTML = `${tempmax} &deg;C`;

          const TempMin = document.createElement("span");
          TempMin.innerHTML = `${tempmin} &deg;C`;

          dayElement.textContent = "";
          
          dayElement.appendChild(date);
          dayElement.appendChild(TempMax);
          dayElement.appendChild(TempMin);
        }
        
        else {
          console.warn(`Element with ID ${dayElementId} not found.`);
        }
      }

      document.getElementById("name").innerHTML = capitalizeFirstLetter(
        data.address
      );

      // document.getElementById("full_address").innerHTML = data.resolvedAddress;

      // document.getElementById("lat").innerHTML = data.latitude;

      // document.getElementById("lon").innerHTML = data.longitude;

      // document.getElementById("tz_id").innerHTML = data.timezone;

      document.getElementById("description").innerHTML = data.description;

      document.getElementById("localtime").innerHTML = hours_min(
        current.datetime
      );

      document.getElementById("temp_c").innerHTML = current.temp;

      document.getElementById("feelslike_c").innerHTML =
        current.feelslike + "&deg;C";

      document.getElementById("humidity").innerHTML = current.humidity + "%";

      document.getElementById("wind_kph").innerHTML =
        current.windspeed + " Km/h";

      document.getElementById("icon").innerHTML = capitalizeFirstLetter(
        current.icon
      );

      document.getElementById("sunrise").innerHTML = hours_min(current.sunrise);

      document.getElementById("sunset").innerHTML = hours_min(current.sunset);

      map_url(data.latitude, data.longitude);
    })

    .catch((error) => console.error("Error fetching data:", error));
}

function map_url(lat, lon) {
  const map = document.getElementById("map");
  map.href = `http://maps.google.com/?q=${lat},${lon}`;
}

window.addEventListener("resize", () => {
  const input = document.querySelector('input[type="text"]');
  const placeholder = input.placeholder;

  if (window.innerWidth <= 600) {
    input.placeholder = "Search..";
  } else {
    input.placeholder = placeholder;
  }
});
