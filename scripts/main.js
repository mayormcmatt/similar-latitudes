document.addEventListener('DOMContentLoaded', function () {
	const citiesDataSource = 'https://raw.githubusercontent.com/mayormcmatt/similar-latitudes/master/assets/cities.json';
	const citiesData = [];
	const textInput = document.querySelector('.input-container__input');

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
		console.log(matches);
	}

	textInput.addEventListener('keyup', showSearchResults);
});