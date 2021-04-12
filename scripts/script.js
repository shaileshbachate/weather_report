// Google Maps
let map;
let myLatLng = {
    lat: 51.5085,
    lng: -0.1257,
};

let marker = undefined;
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: myLatLng,
        zoom: 8,
    });

    marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
    });

    map.addListener("click", (e) => {
        placeMarkerAndPanToAndPrintData(e.latLng, map);
    });
}

// when we add marker through search bar (search_city_name)
function placeMarkerAndPanTo(latLng, map) {
    // remove the previous marker
    if (marker !== undefined) marker.setMap(null);

    // add new marker
    marker = new google.maps.Marker({
        position: latLng,
        map: map,
    });
    map.panTo(latLng);
}

// when you add marker through map
function placeMarkerAndPanToAndPrintData(latLng, map) {
    // remove the previous marker
    if (marker !== undefined) marker.setMap(null);

    // add new marker
    marker = new google.maps.Marker({
        position: latLng,
        map: map,
    });
    map.panTo(latLng);

    console.log(latLng.toJSON());
    printData(latLng.toJSON().lat, latLng.toJSON().lng);
}

// // Open Weather //
const fetchDataByCityName = async (city_name) => {
    const res = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${OPENWEATHER_API_KEY}`
    );
    const jsondata = await res.json();
    return jsondata;
};

const fetchDataByLatLong = async (lat, lon) => {
    const res = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`
    );
    const jsondata = await res.json();
    return jsondata;
};

const fetchForeCastByCityName = async (city_name) => {
    const res = await fetch(
        `http://api.openweathermap.org/data/2.5/forecast?q=${city_name}&appid=${OPENWEATHER_API_KEY}`
    );
    const jsondata = await res.json();
    return jsondata;
};

const fetchForeCastByLatLong = async (lat, lon) => {
    const res = await fetch(
        `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`
    );
    const jsondata = await res.json();
    return jsondata;
};

const search_icon = document.querySelector("#search_icon");
const search_city_name = document.querySelector("#search_city_name");

const city_name = document.querySelector("#city_name");
const weather_description = document.querySelector("#weather_description");
const main_temp = document.querySelector("#main_temp");
const main_humidity = document.querySelector("#main_humidity");
const main_pressure = document.querySelector("#main_pressure");
const sys_sunrise = document.querySelector("#sys_sunrise");
const sys_sunset = document.querySelector("#sys_sunset");

const time_zones = document.querySelectorAll(".time_zone");
const sunrise_date = document.querySelector("#sunrise_date");
const sunset_date = document.querySelector("#sunset_date");

const weather_details = document.querySelector("#weather_details");

let myChart, config;

const printData = async (arg1, lng) => {
    let jsondata;
    let forecastdata;
    if (lng === undefined) {
        jsondata = await fetchDataByCityName(arg1);
        forecastdata = await fetchForeCastByCityName(arg1);
    } else {
        jsondata = await fetchDataByLatLong(arg1, lng);
        forecastdata = await fetchForeCastByLatLong(arg1, lng);
    }

    // // current weather //
    if (jsondata.cod == "404") console.log(jsondata.message);

    city_name.textContent = `${jsondata.name}, ${jsondata.sys.country}`;
    weather_description.textContent = jsondata.weather[0].description;
    main_temp.innerHTML = `${
        Math.round((parseInt(jsondata.main.temp) - 273.15) * 10) / 10
    } &deg;C`;
    main_humidity.textContent = `${jsondata.main.humidity} %`;
    main_pressure.textContent = `${jsondata.main.pressure} hPa`;
    sys_sunrise.textContent = `${new Date(
        parseInt(jsondata.sys.sunrise) * 1000
    ).toLocaleTimeString()}`;
    sys_sunset.textContent = `${new Date(
        parseInt(jsondata.sys.sunset) * 1000
    ).toLocaleTimeString()}`;

    time_zones.forEach((time_zone) => {
        time_zone.textContent = `${
            Intl.DateTimeFormat().resolvedOptions().timeZone
        } time`;
    });
    sunrise_date.textContent = `${new Date(
        parseInt(jsondata.sys.sunrise) * 1000
    ).toLocaleDateString()}`;
    sunset_date.textContent = `${new Date(
        parseInt(jsondata.sys.sunset) * 1000
    ).toLocaleDateString()}`;

    weather_details.innerHTML = `
    <h5>${jsondata.weather[0].description}</h5>
        <h4>${jsondata.name}, ${jsondata.sys.country}</h4>
        <h5>Min-Temperature: ${
            Math.round((parseInt(jsondata.main.temp_min) - 273.15) * 10) / 10
        }&deg; C</h5>
        <h5>Max-Temperature: ${
            Math.round((parseInt(jsondata.main.temp_max) - 273.15) * 10) / 10
        }&deg; C</h5>
        <h5>Feels like: ${
            Math.round((parseInt(jsondata.main.feels_like) - 273.15) * 10) / 10
        } &deg; C</h5>
        <h5>Wind speed: ${jsondata.wind.speed}m/s</h5>
        <h5>Wind direction: ${jsondata.wind.deg}deg</h5>
        <h5>Visibility: ${jsondata.visibility}m</h5>
    `;
    // //

    // // 5 day forecast //
    console.log(forecastdata);
    list_of_temp = forecastdata.list.map(
        (item) => Math.round((parseInt(item.main.temp) - 273.15) * 10) / 10
    );
    console.log(list_of_temp);

    let first_day = 0,
        second_day = 0,
        third_day = 0,
        fourth_day = 0,
        fifth_day = 0;
    for (let i = 0; i < 8; i++) first_day += list_of_temp[i];
    for (let i = 8; i < 16; i++) second_day += list_of_temp[i];
    for (let i = 16; i < 24; i++) third_day += list_of_temp[i];
    for (let i = 24; i < 32; i++) fourth_day += list_of_temp[i];
    for (let i = 32; i < 40; i++) fifth_day += list_of_temp[i];

    let five_day_forecast = [
        Math.round((first_day / 8) * 10) / 10,
        Math.round((second_day / 8) * 10) / 10,
        Math.round((third_day / 8) * 10) / 10,
        Math.round((fourth_day / 8) * 10) / 10,
        Math.round((fifth_day / 8) * 10) / 10,
    ];
    console.log(five_day_forecast);

    let today = new Date();
    let first_date = today;
    let second_date = new Date();
    second_date.setDate(today.getDate() + 1);
    let third_date = new Date();
    third_date.setDate(today.getDate() + 2);
    let fourth_date = new Date();
    fourth_date.setDate(today.getDate() + 3);
    let fifth_date = new Date();
    fifth_date.setDate(today.getDate() + 4);

    var ctx2 = document.getElementById("myChart").getContext("2d");

    if (myChart) {
        myChart.destroy();
    }

    config = {
        type: "bar",
        data: {
            labels: [
                first_date.toLocaleDateString(),
                second_date.toLocaleDateString(),
                third_date.toLocaleDateString(),
                fourth_date.toLocaleDateString(),
                fifth_date.toLocaleDateString(),
            ],
            datasets: [
                {
                    label: "Temperature",
                    data: five_day_forecast,
                    backgroundColor: [
                        "rgba(105, 90, 205, 0.2)",
                        "rgba(100, 148, 237, 0.2)",
                        "rgba(54, 162, 235, 0.2)",
                        "rgba(100, 148, 237, 0.2)",
                        "rgba(105, 90, 205, 0.2)",
                    ],
                    borderColor: [
                        "rgba(105, 90, 205, 1)",
                        "rgba(100, 148, 237, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(100, 148, 237, 1)",
                        "rgba(105, 90, 205, 1)",
                    ],
                    borderWidth: 1,
                },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    };
    myChart = new Chart(ctx2, config);

    // //

    // // pan to the location (search_city_name.value) //
    myLatLng = {
        lat: jsondata.coord.lat,
        lng: jsondata.coord.lon,
    };
    placeMarkerAndPanTo(new google.maps.LatLng(myLatLng), map);
    // //

    search_city_name.value = "";
};

window.addEventListener("load", () => {
    printData("london");
});

window.addEventListener("keyup", (e) => {
    if (e.key === "/") {
        // if (search_city_name !== document.activeElement)
        search_city_name.focus();
    }
});

window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        // console.log("you pressed enter");
        if (search_city_name.value !== "") printData(search_city_name.value);
    }
});

search_icon.addEventListener("click", () => {
    if (search_city_name.value !== "") printData(search_city_name.value);
});
