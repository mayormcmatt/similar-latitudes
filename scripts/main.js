document.addEventListener('DOMContentLoaded', function () {
	const citiesDataSource = 'https://raw.githubusercontent.com/mayormcmatt/similar-latitudes/master/assets/cities.json';
	const citiesData = [];
	const textInput = document.querySelector('.input-container__input');
	fetch(citiesDataSource)
		.then(raw => raw.json())
		.then(data => citiesData.push(...data));

	function processSearchInputs() {
		console.log(citiesData);
	}
	textInput.addEventListener('keyup', processSearchInputs);
});