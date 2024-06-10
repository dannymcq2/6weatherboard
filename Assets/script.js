// Global variables
const submitBtn = document.getElementById('submitBtn');
const searchBox = document.getElementById('searchBox');
const historyList = document.getElementById('searchHistory');

// Event listener for the search button click
submitBtn.addEventListener('click', searchWeather);

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
            const forecastContainer = document.getElementById('forecast');
            forecastContainer.innerHTML = ''; // Clear previous forecast cards
        
            const today = new Date().toDateString();
            const uniqueDates = new Map();
        
            data.list.forEach(forecast => {
                const date = new Date(forecast.dt * 1000).toDateString();
                const temperature = (forecast.main.temp - 273.15).toFixed(2); // Convert temperature to Celsius
                const weatherDescription = forecast.weather[0].description;
                const windSpeed = forecast.wind.speed;
                const humidity = forecast.main.humidity;
        
                const displayDate = (date === today) ? `<span class="today">(Today)</span> ${date}` : date;
        
                function celsiusToFahrenheit(celsius) {
                    return (celsius * 9/5) + 32;
                }
        
                const temperatureCelsius = (forecast.main.temp - 273.15).toFixed(2); // Convert temperature to Celsius
                const temperatureFahrenheit = celsiusToFahrenheit(temperatureCelsius).toFixed(1); // Round to 1 decimal place
                const temperatureDisplay = `${temperatureFahrenheit}°F`;
        
                if (!uniqueDates.has(date)) {
                    const forecastCard = document.createElement('div');
                    forecastCard.classList.add('forecast-card');
                    forecastCard.innerHTML = `
                        <h3>${displayDate}</h3>
                        <p>Temperature: ${temperatureDisplay}</p>
                        <p>Weather: ${weatherDescription}</p>
                        <p>Wind Speed: ${windSpeed} m/s</p>
                        <p>Humidity: ${humidity}%</p>
                    `;
                    if (date === today) {
                        forecastCard.querySelector('h3').classList.add('today'); // Add 'today' class to h3 element
                        forecastContainer.insertBefore(forecastCard, forecastContainer.firstChild); // Insert at the beginning of the forecast container
                    } else {
                        forecastContainer.appendChild(forecastCard); // Append to the end of the forecast container
                    }
                    uniqueDates.set(date, true); // Mark the date as processed
                }
            });
        
            // Store the searched city in localStorage
            storeSearchHistory(city);
            displaySearchHistory(); 
        })
        
        
        
        
        .catch(error => {
            console.error('Error fetching weather data:', error);
            const forecastContainer = document.getElementById('forecast');
            forecastContainer.innerHTML = '<p>Could not retrieve weather forecast. Please check your input and try again.</p>';
        });
}


// Function to store the searched city in localStorage
function storeSearchHistory(city) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
    }
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

// Function to display search history
function displaySearchHistory() {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const searchHistoryContainer = document.getElementById('searchHistoryContainer');
    searchHistoryContainer.innerHTML = ''; 

    searchHistory.forEach(city => {
        const cityBox = document.createElement('div');
        cityBox.classList.add('city-box');
        cityBox.textContent = city;
        cityBox.addEventListener('click', () => {
            searchBox.value = city;
            searchWeather();
        });
        searchHistoryContainer.appendChild(cityBox);
    });
}

// Display search history when the page loads
window.addEventListener('load', displaySearchHistory);
