const searchInput = document.querySelector('#searchInput');
const result = document.querySelector('#result');
const submitButton = document.querySelector('#submitButton');
const locationButton = document.querySelector('#locationButton');
const savedSpots = document.querySelectorAll('.saved-spot-item');

(function() {
  searchInput.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
      let search_place = 'search=' + searchInput.value;
      getSearchResult(search_place);
    }
  });


  submitButton.addEventListener('click', (e) => {
    let search_place = 'search=' + searchInput.value;
    getSearchResult(search_place);
  });


  locationButton.addEventListener('click', (e) => {
    getLocation();

    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getPosition);
      } else {
        console.log('Geolocation is not supported by this browser.');
      }
    }

    function getPosition(position) {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;
      let query = 'lat=' + lat + '&lon=' + lon + '&ls=1';
      getSearchResult(query);
    }

  });

  for (var i = 0, s = savedSpots.length; i < s; i++) {
    let spotName = savedSpots[i].innerText
    savedSpots[i].addEventListener('click', (e) => {
      let search_place = 'search=' + spotName;
      getSearchResult(search_place);
    });
  }
})();

(function() {
  let triggerModalButtons = document.querySelectorAll('.delete-spot-button');

  for (var i = 0, t = triggerModalButtons.length; i < t; i++) {
    let modal_data_id = triggerModalButtons[i].dataset.modal;
    let modal_query= 'div[data-modal="' + modal_data_id + '"]';
    let modal_close_query = 'span[data-modal="' + modal_data_id + '"]';

    let modal = document.querySelector(modal_query);
    let modal_close = document.querySelector(modal_close_query);

    triggerModalButtons[i].addEventListener('click', () => {
      modal.style.display = 'flex';
    });

    modal_close.addEventListener('click', () => { closeModal(modal); });

    window.addEventListener('click', function(e) {
      if (e.target == modal) { closeModal(modal); }
    });

  }
})();


function closeModal(modal) {
  modal.style.display = 'none';
  let savedSpotItems = document.querySelectorAll('.saved-spot-item');
  for (var i = 0; i < savedSpotItems.length; i++) {
    savedSpotItems[i].style.left = '0'
  }
}


function getSearchResult(search_string) {
  const xhr = new XMLHttpRequest();

  xhr.open('GET', '/search?' + search_string, true);
  xhr.onload = function (e) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        content = xhr.responseText;
        document.querySelector('#result').innerHTML = content;
        toggleWindUnits();
      } else {
        console.error(xhr.statusText);
      }
    }
  };
  xhr.onerror = function (e) {
    console.error(xhr.statusText);
  };
  xhr.send(null);
}


function toggleWindUnits(){

  const toggleUnitButton = document.querySelector('#toggleUnit');
  const windValueField = document.querySelector('#windValueField');
  const windValue = windValueField.innerText;
  const windUnit = document.querySelector('#windUnit');

  toggleUnitButton.addEventListener('click', () => {
    if (toggleUnitButton.innerText == 'm/s') {

      windValueField.innerText = windValue;
      windUnit.innerText = ' m/s';
      toggleUnitButton.innerText = 'kts';

    } else {

      windValueField.innerText = Math.round(parseFloat(windValue) * 1.944);
      windUnit.innerText = ' kts';
      toggleUnitButton.innerText = 'm/s';

    }
  });
};
