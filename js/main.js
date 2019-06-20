'use strict';

var ARR_LENGTH = 8;
var Y_MIN = 130;
var Y_MAX = 630;
var MAP_PIN_WIDTH = 50;
var MAP_PIN_HEIGHT = 70;
var MAIN_PIN_WIDTH = 65;
var MAIN_PIN_HEIGHT = 84;
var PATH_TO_IMG = 'img/avatars/user';
var TYPE_OF_PLACE = ['palace', 'flat', 'house', 'bungalo'];

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var Pin = function (index) {
  this.author = {'avatar': PATH_TO_IMG + '0' + index + '.png'};
  this.offer = {'type': TYPE_OF_PLACE[getRandomInt(0, TYPE_OF_PLACE.length)]};
  this.location = {'x': getRandomInt(0, widthMapPins), 'y': getRandomInt(Y_MIN, Y_MAX)};
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

var getPinsTemplate = function () {
  var fragment = document.createDocumentFragment();

  for (var i = 1; i <= ARR_LENGTH; i++) {
    fragment.appendChild(getTemplatePin(new Pin(i)));
  }

  return fragment;
};

var getProperty = function (item) {
  item.disabled = isOpened;
};

var getMinValuePrice = function () {
  var result = 0;
  if (typeOfHousing.selectedIndex === 1) {
    result = 1000;
  } else if (typeOfHousing.selectedIndex === 2) {
    result = 5000;
  } else {
    result = 10000;
  }

  return result;
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

var onMapPinMainClick = function () {
  if (!isOpened) {
    document.querySelector('.map').classList.remove('map--faded');
    map.appendChild(getPinsTemplate());

    // активное состояние
    adForm.classList.remove('ad-form--disabled');
    price.min = getMinValuePrice();
    price.placeholder = String(price.min);
    enumeratesArray();
    isOpened = true;

    typeOfHousing.addEventListener('change', onTypeOfHousingChange);
    timein.addEventListener('change', onTimeInOutChange);
    timeout.addEventListener('change', onTimeInOutChange);
    // на кнопку Очистить
    adFormReset.addEventListener('click', onResetClick);
    adFormReset.addEventListener('keydown', onResetClick);
  }
};

var onResetClick = function () {
  if (isOpened) {
    // удаляем метки
    var mapPins = map.querySelectorAll('.map__pin');
    mapPins.forEach(function (item) {
      if (!item.classList.contains('map__pin--main')) {
        map.removeChild(item);
      }
    });
    // не активное состояние
    address.value = String(mapPinMain.offsetLeft) + ', ' + String(mapPinMain.offsetTop);
    enumeratesArray();
    isOpened = false;
    adForm.classList.add('ad-form--disabled');
    document.querySelector('.map').classList.add('map--faded');

    adFormReset.removeEventListener('click', onResetClick);
    adFormReset.removeEventListener('keydown', onResetClick);
    typeOfHousing.removeEventListener('change', onTypeOfHousingChange);
    timein.removeEventListener('change', onTimeInOutChange);
    timeout.removeEventListener('change', onTimeInOutChange);
  }
};

var enumeratesArray = function () {
  selectsMapFilters.forEach(getProperty);
  fieldsetsMapFilters.forEach(getProperty);
  fieldsetsAdForm.forEach(getProperty);
};

var isOpened = true;
var map = document.querySelector('.map__pins');
var mapPinMain = map.querySelector('.map__pin--main');
var widthMapPins = map.offsetWidth;
var userPin = document.querySelector('#pin').content.querySelector('.map__pin');
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
// var roomNumber = adForm.querySelector('#room_number');
// var capacity = adForm.querySelector('#capacity');

if (isOpened) {
  // не активное состояние
  address.value = String(mapPinMain.offsetLeft) + ', ' + String(mapPinMain.offsetTop);
  onTypeOfHousingChange();
  enumeratesArray();
  isOpened = false;
}

mapPinMain.addEventListener('click', onMapPinMainClick);
mapPinMain.addEventListener('mouseup', function () {
  address.value = String(mapPinMain.offsetLeft + Math.round(MAIN_PIN_WIDTH / 2)) + ', ' + String(mapPinMain.offsetTop + MAIN_PIN_HEIGHT);
});
