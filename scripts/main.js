const citiesDataSource = 'https://raw.githubusercontent.com/mayormcmatt/similar-latitudes/master/assets/cities.json';
const citiesData = [];
const textInput = document.querySelector('.input-container__input');
const searchOutput = document.querySelector('.output-container__table');
const latMatchHeader = document.querySelector('.output-container__lat-match-header');
const latSearchOutput = document.querySelector('.output-container__lat-match');
const citySort = document.getElementById('city-sort');
const countrySort = document.getElementById('country-sort');
const latLongSort = document.getElementById('lat-long-sort');
let matchedCities = []; // Use this to search in after clicking to get lat/long?
let selectedCity;
let asc1 = 1,
	asc2 = 1,
	asc3 = 1;

if (latSearchOutput.innerText.length === 0) {
	latMatchHeader.style.display = 'none';
} else {
	latMatchHeader.style.display = 'table-row';
}
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
	matchedCities = processSearchInputs(this.value, citiesData);
	// #4 Inject into DOM the results of matching text with cities
	const html = matchedCities.map(city => {
		return `
			<tr>
				<td>${city.city}</td>
				<td>${city.country}</td>
				<td>${city.lat}, ${city.lng}</td>
			</tr>
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
	// #8 From original cities array, return array of matches within X lat degrees, in this case 1 degree
	return citiesData.filter(city => {
		return city.lat < targetLat + 1 && city.lat > targetLat - 1
	});
}

// #9 Just like displaying search results from input field above, display lat matched cities
function showLatMatches() {
	const latMatchedCities = processLatMatch(selectedCity, matchedCities);
	const html = latMatchedCities.map(city => {
		return `
			<tr>
				<td>${city.city}</td>
				<td>${city.country}</td>
				<td>${city.lat}, ${city.lng}</td>
			</tr>
		`;
	}).join('');
	latSearchOutput.innerHTML = html;
}

// Click handler that does a search similar to above, but filter by latitude, post to another list
document.querySelector('.output-container__table').addEventListener('click', function (e) {
	// #5 Get data attribute city name, feed it into processLatMatch function
	if (e.target && e.target.nodeName === "TD") {
		selectedCity = e.target.parentElement.dataset.city;
		showLatMatches()
	}
	latMatchHeader.style.display = 'table-row';
});

textInput.addEventListener('keyup', showSearchResults);
// citySort.addEventListener('click', sort_table(searchOutput, 0, asc1));

function sort_table(tbody, col, asc) {
	var rows = tbody.rows,
		rlen = rows.length,
		arr = new Array(),
		i, j, cells, clen;
	// fill the array with values from the table
	for (i = 0; i < rlen; i++) {
		cells = rows[i].cells;
		clen = cells.length;
		arr[i] = new Array();
		for (j = 0; j < clen; j++) {
			arr[i][j] = cells[j].innerHTML;
		}
	}
	// sort the array by the specified column number (col) and order (asc)
	arr.sort(function (a, b) {
		return (a[col] == b[col]) ? 0 : ((a[col] > b[col]) ? asc : -1 * asc);
	});
	// replace existing rows with new rows created from the sorted array
	for (i = 0; i < rlen; i++) {
		rows[i].innerHTML = "<td>" + arr[i].join("</td><td>") + "</td>";
	}
}