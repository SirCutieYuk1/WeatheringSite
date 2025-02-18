// Main function to fetch weather data and display it
function getWeather() {
    const apiKey = '8bf76b3a0978aea3d495d49aca16a670'; // OpenWeather API key INPUT HERE
    const city = document.getElementById('city').value.trim(); // Get city input and trim whitespace

    // Check if the city field is empty
    if (!city) {
        alert('Please enter a city');
        return; // Stop the function if no city is entered
    }

    // Construct API URLs for current weather and 5-day forecast
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    // Fetch current weather data
    fetch(currentWeatherUrl)
        .then(response => {
            console.log('Weather API response status:', response.status); // Log response status for debugging
            if (!response.ok) {
                throw new Error('City not found'); // Throw error for invalid city
            }
            return response.json(); // Parse response JSON
        })
        .then(data => {
            console.log('Current weather data:', data); // Log the fetched weather data
            displayWeather(data); // Display the current weather on the UI
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error); // Log errors
            alert('Error fetching current weather data. Please check the city name.'); // Show error message to user
        });

    // Fetch 5-day forecast data
    fetch(forecastUrl)
        .then(response => {
            console.log('Forecast API response status:', response.status); // Log response status for debugging
            if (!response.ok) {
                throw new Error('City not found'); // Throw error for invalid city
            }
            return response.json(); // Parse response JSON
        })
        .then(data => {
            console.log('Forecast weather data:', data); // Log the fetched forecast data
            displayHourlyForecast(data.list); // Display the hourly forecast on the UI
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error); // Log errors
            alert('Error fetching hourly forecast data. Please try again.'); // Show error message to user
        });
}

// Function to display current weather information
function displayWeather(data) {
    console.log('Updating weather UI...'); // Log for debugging

    const tempDivInfo = document.getElementById('temp-div'); // Temperature container
    const weatherInfoDiv = document.getElementById('weather-info'); // Weather details container
    const weatherIcon = document.getElementById('weather-icon'); // Weather icon element

    // Clear previous weather details
    tempDivInfo.innerHTML = '';
    weatherInfoDiv.innerHTML = '';
    weatherIcon.style.display = 'none'; // Hide the icon initially

    // Handle invalid city or error from API
    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`; // Display error message
    } else {
        // Extract relevant data
        const cityName = data.name; // City name
        const temperature = Math.round(data.main.temp - 273.15); // Convert temperature from Kelvin to Celsius
        const description = data.weather[0].description; // Weather description
        const iconCode = data.weather[0].icon; // Icon code
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`; // Construct icon URL

        // Update UI with the weather data
        tempDivInfo.innerHTML = `<p>${temperature}°C</p>`;
        weatherInfoDiv.innerHTML = `
            <p>${cityName}</p>
            <p>${description.charAt(0).toUpperCase() + description.slice(1)}</p> <!-- Capitalize first letter -->
        `;
        weatherIcon.src = iconUrl; // Set the icon source
        weatherIcon.alt = description; // Add alt text for accessibility
        weatherIcon.style.display = 'block'; // Show the icon
    }
}

// Function to display hourly forecast data
function displayHourlyForecast(hourlyData) {
    console.log('Updating hourly forecast UI...'); // Log for debugging

    const hourlyForecastDiv = document.getElementById('hourly-forecast'); // Hourly forecast container
    hourlyForecastDiv.innerHTML = ''; // Clear previous forecast data

    const next24Hours = hourlyData.slice(0, 8); // Get data for the next 24 hours (8 intervals of 3 hours)

    // Loop through hourly data and construct the forecast UI
    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000); // Convert UNIX timestamp to date
        const hour = dateTime.getHours().toString().padStart(2, '0'); // Format hours (e.g., 01, 02, ...)
        const temperature = Math.round(item.main.temp - 273.15); // Convert temperature from Kelvin to Celsius
        const iconCode = item.weather[0].icon; // Icon code
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`; // Construct icon URL

        // Construct HTML for each hourly item
        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span> <!-- Display hour -->
                <img src="${iconUrl}" alt="Weather Icon for ${hour}:00"> <!-- Weather icon -->
                <span>${temperature}°C</span> <!-- Display temperature -->
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml; // Append hourly forecast to the container
    });
}
