document.addEventListener('DOMContentLoaded', function () {
	const citiesDataSource = 'https://raw.githubusercontent.com/mayormcmatt/similar-latitudes/master/assets/cities.json';
	const citiesData = [];
	const textInput = document.querySelector('.input-container__input');
	const searchOutput = document.querySelector('.output-container__list');
	let selectedCity;

	fetch(citiesDataSource)
		.then(raw => raw.json())
		.then(data => citiesData.push(...data));

	function processSearchInputs(inputText, cities) {
		return cities.filter(city => {
			const regex = new RegExp(inputText, 'gi');
			return city.city.match(regex);
		});
	}

	function showSearchResults() {
		const matches = processSearchInputs(this.value, citiesData);
		// console.log(matches);
		const html = matches.map(city => {
			return `
				<li data-city="${city.city}">
					<span>${city.city}, ${city.country}</span>
					<span>${city.lat}, ${city.lng}</span>
				</li>
			`;
		}).join('');
		searchOutput.innerHTML = html;
	}

	function processLatMatch (selectedCity, cities) {
		const targetCity = cities.filter(city => {
			return city.city.match(selectedCity);
		});
		const targetLat = targetCity[0].lat;
	}

	// on click, do a search similar to above, but filter by latitude, post to another list
	document.querySelector('.output-container__list').addEventListener('click', function(e) {
		if (e.target && e.target.nodeName === "SPAN") {
			selectedCity = e.target.parentElement.dataset.city;
			// console.log(e.target.parentElement.dataset.city);
			processLatMatch(selectedCity, citiesData);
		}
	});

	textInput.addEventListener('keyup', showSearchResults);
});