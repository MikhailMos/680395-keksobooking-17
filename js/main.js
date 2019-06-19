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

var onMapPinMainClick = function () {
  if (!isOpened) {
    document.querySelector('.map').classList.remove('map--faded');
    map.appendChild(getPinsTemplate());

    // активное состояние
    adForm.classList.remove('ad-form--disabled');
    enumeratesArray();
    isOpened = true;

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

if (isOpened) {
  // не активное состояние
  address.value = String(mapPinMain.offsetLeft) + ', ' + String(mapPinMain.offsetTop);
  enumeratesArray();
  isOpened = false;
}

mapPinMain.addEventListener('click', onMapPinMainClick);

mapPinMain.addEventListener('mouseup', function () {
  address.value = String(mapPinMain.offsetLeft + Math.round(MAIN_PIN_WIDTH / 2)) + ', ' + String(mapPinMain.offsetTop + MAIN_PIN_HEIGHT);
});
