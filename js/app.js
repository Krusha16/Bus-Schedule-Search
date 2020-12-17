const streets = document.querySelector('.streets');

function getStreets(inputString) {
  return fetch(`https://api.winnipegtransit.com/v3/streets.json?api-key=qhJFl4WLev9xuoa7gwJK&name=${inputString}`)
    .then(Response => {
      return Response.json();
    })
    .catch(err => {
      console.log(err);
    })
}

document.querySelector('.input').addEventListener('keypress', newSearch)
function newSearch(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    let input = document.querySelector('input');
    if (input.value !== '') {
      streets.innerHTML = "";
      getStreets(input.value)
        .then(json => {
          console.log(json);
        })
    }
  }
}
