const streets = document.querySelector('.streets');
let count = 0;
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
          console.log(json.streets);
          if(json.streets.length === 0){
            streetDoesnotMatch();
          } else {
            for (const street of json.streets) {
              console.log(street);
              createAndInsertHTML(street);
            }
          } 
        })
        input.value = "";
    }
  }
};

function createAndInsertHTML(street) {
  streets.insertAdjacentHTML('beforeend',
    `<a href="#" data-street-key=${street.key}>
      ${street.name}
    </a>`)
};

function streetDoesnotMatch(){
  streets.insertAdjacentHTML('beforeend',
  `No Streets found`)
};
