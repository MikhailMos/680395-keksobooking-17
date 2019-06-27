'use strict';

(function () {
  var getMinValuePrice = function () {
    if (typeOfHousing.value === 'palace') {
      return 10000;
    } else if (typeOfHousing.value === 'house') {
      return 5000;
    } else if (typeOfHousing.value === 'flat') {
      return 1000;
    } else {
      return 0;
    }
  };

  var onTypeOfHousingChange = function () {
    price.min = getMinValuePrice();
    price.placeholder = String(price.min);
  };

  var onTimeInOutChange = function (evt) {
    if (evt.target.name === timein.name) {
      timeout.selectedIndex = timein.selectedIndex;
    } else {
      timein.selectedIndex = timeout.selectedIndex;
    }
  };

  var getProperty = function (item) {
    item.disabled = window.utils.isOpened;
  };

  var enumeratesArray = function () {
    selectsMapFilters.forEach(getProperty);
    fieldsetsMapFilters.forEach(getProperty);
    fieldsetsAdForm.forEach(getProperty);
  };

  // для присвоения для свойства disabled
  var adForm = document.querySelector('.ad-form');
  var address = adForm.querySelector('#address');
  var typeOfHousing = adForm.querySelector('#type');
  var price = adForm.querySelector('#price');
  var timein = adForm.querySelector('#timein');
  var timeout = adForm.querySelector('#timeout');

  var fieldsetsAdForm = adForm.querySelectorAll('fieldset');
  var mapFilters = document.querySelector('.map__filters');
  var selectsMapFilters = mapFilters.querySelectorAll('select');
  var fieldsetsMapFilters = mapFilters.querySelectorAll('fieldset');

  if (window.utils.isOpened) {
    // не активное состояние
    address.value = String(mapPinMain.offsetLeft) + ', ' + String(mapPinMain.offsetTop);
    onTypeOfHousingChange();
    enumeratesArray();
    window.utils.isOpened = false;
  }
})();
