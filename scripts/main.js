document.addEventListener('DOMContentLoaded', function () {
	const citiesDataSource = 'https://raw.githubusercontent.com/mayormcmatt/similar-latitudes/master/assets/cities.json';
	const citiesData = [];
	const textInput = document.querySelector('.input-container__input');
	const searchOutput = document.querySelector('.output-container__list');
	const latSearchOutput = document.querySelector('.output-container__lat-match');
	let matchedCities = []; // Use this to search in after clicking to get lat/long?
	let selectedCity;
	// #1 Fetch city data
	fetch(citiesDataSource)
		.then(raw => raw.json())
		.then(data => citiesData.push(...data));

	function processSearchInputs(inputText, cities) {
		return cities.filter(city => {
			const regex = new RegExp(inputText, 'gi');
			return city.city.match(regex);
		});
	}
	// #2 On keyup in search field, showSearchResults fires
	function showSearchResults() {
		// #3 Into matchedCities feed the arguments: value of typing, city data JSON
		// const matchedCities = processSearchInputs(this.value, citiesData);
		matchedCities = processSearchInputs(this.value, citiesData);
		// console.log(matchedCities);
		// #4 Inject into DOM the results of matching text with cities
		const html = matchedCities.map(city => {
			return `
				<li data-city="${city.city}">
					<span>${city.city}, ${city.country}</span>
					<span>${city.lat}, ${city.lng}</span>
				</li>
			`;
		}).join('');
		searchOutput.innerHTML = html;
	}

	function processLatMatch(selectedCity, cities) {
		// #6 Return relevant data on selected city
		const targetCity = cities.filter(city => {
			return city.city.match(selectedCity);
		});
		// #7 Pull out latitude data
		const targetLat = targetCity[0].lat;
		// console.log(targetLat)
		// #8 From original cities array, return array of matches within X lat degrees, in this case 1 degree
		return citiesData.filter(city => {
			return city.lat < targetLat + 1 && city.lat > targetLat - 1
		});
	}

	// #9 Just like displaying search results from input field above, display lat matched cities
	function showLatMatches () {
		const latMatchedCities = processLatMatch(selectedCity, matchedCities);
		const html = latMatchedCities.map(city => {
			return `
				<li data-city="${city.city}">
					<span>${city.city}, ${city.country}</span>
					<span>${city.lat}, ${city.lng}</span>
				</li>
			`;
		}).join('');
		latSearchOutput.innerHTML = html;
	}

	// Click handler that does a search similar to above, but filter by latitude, post to another list
	document.querySelector('.output-container__list').addEventListener('click', function (e) {
		// #5 Get data attribute city name, feed it into processLatMatch function
		if (e.target && e.target.nodeName === "SPAN") {
			selectedCity = e.target.parentElement.dataset.city;
			// console.log(e.target.parentElement.dataset.city);
			showLatMatches()
		}
	});

	textInput.addEventListener('keyup', showSearchResults);
});