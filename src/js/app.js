const streets = document.querySelector('.streets');
const tbody = document.querySelector('tbody');
const streetName = document.getElementById('street-name');
const input = document.querySelector('.input');
input.addEventListener('keypress', search);

//return a list of streets that match the search query
function getStreets(inputString) {
  return fetch(`https://api.winnipegtransit.com/v3/streets.json?api-key=qhJFl4WLev9xuoa7gwJK&name=${inputString}`)
    .then(Response => {
      return Response.json();
    })
}

//return all the stops on a the selected street
function getStops(key) {
  return fetch(`https://api.winnipegtransit.com/v3/stops.json?api-key=qhJFl4WLev9xuoa7gwJK&street=${key}`)
    .then(Response => {
      return Response.json();
    })
}

//return list of next buses for each route
function getStopSchedule(key) {
  return fetch(`https://api.winnipegtransit.com/v3/stops/${key}/schedule.json?api-key=qhJFl4WLev9xuoa7gwJK&max-results-per-route=2`)
    .then(Response => {
      return Response.json();
    })
}

//allow users to search for a particular street by name
function search(e) {

  if (e.key === 'Enter') {
    e.preventDefault();

    if (input.value !== '') {
      streets.innerHTML = "";
      getStreets(input.value)
        .then(json => {

          if (json.streets.length === 0) {

            // If there are no streets match then print short message 
            streets.insertAdjacentHTML('beforeend',
              `No Streets found`)
          } else {
            for (const street of json.streets) {
              insertHTMLForStreets(street);
            }
            handleClickOnEachStreet();
          }
        })
      input.value = "";
    }
  }
};

//get back a list of matching streets
function insertHTMLForStreets(street) {
  streets.insertAdjacentHTML('beforeend',
    `<a href="#" datakey=${street.key}>
      ${street.name}
    </a>`)
};

//add onclick event listener to each street
function handleClickOnEachStreet() {
  document.querySelectorAll('a').forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      tbody.innerHTML = "";
      streetName.innerHTML = "";
      let key = e.target.getAttribute('datakey');
      getStopsForEachStreet(key);
    })
  })
  tbody.innerHTML = "";
}

//get all the stops on the chosen street on click
function getStopsForEachStreet(key) {
  getStops(key)
    .then((stops) => {
      let stopSchedule = stops.stops.map(function (name) {
        let schedule = getStopSchedule(name.key);
        return schedule;
      })
      findNext2BusesForEachRoute(stopSchedule);
    })
}

//find the next 2 buses for each route
function findNext2BusesForEachRoute(stopSchedule) {
  Promise.all(stopSchedule)
    .then((stopSchedule) => {
      for (const selectedRoute of stopSchedule) {
        for (const routes of selectedRoute['stop-schedule']['route-schedules']) {
          let stopName = selectedRoute['stop-schedule'].stop.street.name;
          let crossStreet = selectedRoute['stop-schedule'].stop['cross-street'].name;
          let direction = selectedRoute['stop-schedule'].stop.direction;
          let busNumber = routes.route.number;
          streetName.innerHTML = `Displaying results for ${stopName}`; 
          routes["scheduled-stops"].forEach((route) => {
            let timeToConvert = new Date(route.times.arrival.estimated);
            let time = timeToConvert.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            insertHTMLForEachStops(stopName, direction, crossStreet, busNumber, time);
          })
        }
      }
    })
}

// populate data of next 2 buses for each route into the table at each stop
function insertHTMLForEachStops(name, direction, crossStreet, busNumber, time) {
  tbody.insertAdjacentHTML('beforeend',
  `<tr>
  <td>${name}</td>
  <td>${crossStreet}</td>
  <td>${direction}</td>
  <td>${busNumber}</td>
  <td>${time}</td>
  </tr>
  `)
};
