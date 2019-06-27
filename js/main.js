'use strict';

// map.js
var Y_MIN = 130;
var Y_MAX = 630;
var MAIN_PIN_WIDTH = 65;
var MAIN_PIN_HEIGHT = 80;

var getResultX = function (currentCoord) {
  if (currentCoord > (map.offsetWidth - (MAIN_PIN_WIDTH / 2))) {
    return (map.offsetWidth - (MAIN_PIN_WIDTH / 2));
  } else if (currentCoord < (-(MAIN_PIN_WIDTH / 2))) {
    return -(MAIN_PIN_WIDTH / 2);
  }

  return currentCoord;
};

var getResultY = function (currentCoord) {
  if (currentCoord < (Y_MIN - MAIN_PIN_HEIGHT)) {
    return (Y_MIN - MAIN_PIN_HEIGHT);
  } else if (currentCoord > Y_MAX) {
    return Y_MAX;
  }

  return currentCoord;
};

var onMapPinMainMousedown = function (evt) {
  evt.preventDefault();

  if (!window.utils.isOpened) {

    document.querySelector('.map').classList.remove('map--faded');
    map.appendChild(window.pin.getPinsTemplate());

    if ((defaultCoordsPinMain.x === 0) && (defaultCoordsPinMain.y === 0)) {
      defaultCoordsPinMain.x = mapPinMain.offsetLeft;
      defaultCoordsPinMain.y = mapPinMain.offsetTop;
    }
    // активное состояние
    adForm.classList.remove('ad-form--disabled');
    price.min = getMinValuePrice();
    price.placeholder = String(price.min);
    address.value = String(mapPinMain.offsetLeft + halfWidthMapPinMain) + ', ' + String(mapPinMain.offsetTop + MAIN_PIN_HEIGHT);
    window.pin.enumeratesArray();
    window.utils.isOpened = true;

    typeOfHousing.addEventListener('change', onTypeOfHousingChange);
    timein.addEventListener('change', onTimeInOutChange);
    timeout.addEventListener('change', onTimeInOutChange);
    // на кнопку Очистить
    adFormReset.addEventListener('click', onResetClick);
    adFormReset.addEventListener('keydown', onResetClick);

  } else {

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      mapPinMain.style.top = getResultY(mapPinMain.offsetTop - shift.y) + 'px';
      mapPinMain.style.left = getResultX(mapPinMain.offsetLeft - shift.x) + 'px';
      address.value = String(mapPinMain.offsetLeft + halfWidthMapPinMain) + ', ' + String(mapPinMain.offsetTop + MAIN_PIN_HEIGHT);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      map.removeEventListener('mousemove', onMouseMove);
      map.removeEventListener('mouseup', onMouseUp);
    };

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    // перемещение главного маркера
    map.addEventListener('mousemove', onMouseMove);
    map.addEventListener('mouseup', onMouseUp);
  }
};

var onResetClick = function () {
  if (window.utils.isOpened) {
    // удаляем метки
    var mapPins = map.querySelectorAll('.map__pin');
    mapPins.forEach(function (item) {
      if (!item.classList.contains('map__pin--main')) {
        map.removeChild(item);
      } else {
        item.style.top = defaultCoordsPinMain.y + 'px';
        item.style.left = defaultCoordsPinMain.x + 'px';
      }
    });
    // не активное состояние
    address.value = String(mapPinMain.offsetLeft) + ', ' + String(mapPinMain.offsetTop);
    window.pin.enumeratesArray();
    window.utils.isOpened = false;
    adForm.classList.add('ad-form--disabled');
    document.querySelector('.map').classList.add('map--faded');

    adFormReset.removeEventListener('click', onResetClick);
    adFormReset.removeEventListener('keydown', onResetClick);
    typeOfHousing.removeEventListener('change', onTypeOfHousingChange);
    timein.removeEventListener('change', onTimeInOutChange);
    timeout.removeEventListener('change', onTimeInOutChange);
  }
};

// var isOpened = true;
var map = document.querySelector('.map__pins');
var mapPinMain = map.querySelector('.map__pin--main');
var halfWidthMapPinMain = Math.round(MAIN_PIN_WIDTH / 2);
var defaultCoordsPinMain = {
  x: 0,
  y: 0
};

mapPinMain.addEventListener('mousedown', onMapPinMainMousedown);

// pin.js
(function () {
  var PATH_TO_IMG = 'img/avatars/user';
  var TYPE_OF_PLACE = ['palace', 'flat', 'house', 'bungalo'];
  var MAP_PIN_WIDTH = 50;
  var MAP_PIN_HEIGHT = 70;
  var ARR_LENGTH = 8;

  var Pin = function (index) {
    this.author = {'avatar': PATH_TO_IMG + '0' + index + '.png'};
    this.offer = {'type': TYPE_OF_PLACE[window.utils.getRandomInt(0, TYPE_OF_PLACE.length)]};
    this.location = {'x': window.utils.getRandomInt(0, widthMapPins), 'y': window.utils.getRandomInt(Y_MIN, Y_MAX)};
  };

  var getTemplatePin = function (mapPin) {
    var userPinElement = userPin.cloneNode(true);
    var imgPin = userPinElement.querySelector('img');

    userPinElement.style.left = String(mapPin.location.x - (MAP_PIN_WIDTH / 2)) + 'px';
    userPinElement.style.top = String(mapPin.location.y - MAP_PIN_HEIGHT) + 'px';

    imgPin.src = mapPin.author.avatar;
    imgPin.alt = 'Тут могла бы быть Ваша реклама';

    return userPinElement;
  };

  var getProperty = function (item) {
    item.disabled = window.utils.isOpened;
  };

  window.pin = {
    enumeratesArray: function () {
      selectsMapFilters.forEach(getProperty);
      fieldsetsMapFilters.forEach(getProperty);
      fieldsetsAdForm.forEach(getProperty);
    },
    getPinsTemplate: function () {
      var fragment = document.createDocumentFragment();
      for (var i = 1; i <= ARR_LENGTH; i++) {
        fragment.appendChild(getTemplatePin(new Pin(i)));
      }
      return fragment;
    }
  };

  var widthMapPins = document.querySelector('.map__pins').offsetWidth;
  var userPin = document.querySelector('#pin').content.querySelector('.map__pin');
})();


// form.js

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

// для присвоения для свойства disabled
var adForm = document.querySelector('.ad-form');
var adFormReset = adForm.querySelector('.ad-form__reset');
var fieldsetsAdForm = adForm.querySelectorAll('fieldset');
var mapFilters = document.querySelector('.map__filters');
var selectsMapFilters = mapFilters.querySelectorAll('select');
var fieldsetsMapFilters = mapFilters.querySelectorAll('fieldset');
var address = adForm.querySelector('#address');
var typeOfHousing = adForm.querySelector('#type');
var price = adForm.querySelector('#price');
var timein = adForm.querySelector('#timein');
var timeout = adForm.querySelector('#timeout');

if (window.utils.isOpened) {
  // не активное состояние
  address.value = String(mapPinMain.offsetLeft) + ', ' + String(mapPinMain.offsetTop);
  onTypeOfHousingChange();
  window.pin.enumeratesArray();
  window.utils.isOpened = false;
}

