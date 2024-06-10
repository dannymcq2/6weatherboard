

// Function to fetch weather data
function searchWeather() {
    const city = searchBox.value.trim();
    if (!city) {
        console.error("No city entered");
        return;
    }
    
    // Your API key
    const apiKey = 'f7510e778c120e4deed98a708d85e1c4'; // Ensure this is your correct API key
    const baseUrl = 'https://api.openweathermap.org/data/2.5/forecast';

    // Create the full API URL
    const url = `${baseUrl}?q=${city}&appid=${apiKey}`;

    // Make the API request
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // Display the forecast data
            const forecastContainer = document.getElementById('forecast');
            forecastContainer.innerHTML = '';

            // Filter out duplicate entries for the same day
            const uniqueDates = [];
            data.list.forEach(forecast => {
                const date = new Date(forecast.dt * 1000).toDateString();
                if (!uniqueDates.includes(date)) {
                    uniqueDates.push(date);
                    const temperature = (forecast.main.temp - 273.15).toFixed(2); // Convert temperature to Celsius
                    const weatherDescription = forecast.weather[0].description;

                    // Create forecast card
                    const forecastCard = document.createElement('div');
                    forecastCard.classList.add('forecast-card');
                    forecastCard.innerHTML = `
                        <h3>${date}</h3>
                        <p>Temperature: ${temperature}°C</p>
                        <p>Weather: ${weatherDescription}</p>
                    `;
                    forecastContainer.appendChild(forecastCard);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            const forecastContainer = document.getElementById('forecast');
            forecastContainer.innerHTML = '<p>Could not retrieve weather forecast. Please check your input and try again.</p>';
        });
}

// Event listener for the search button click
submitBtn.addEventListener('click', searchWeather);
