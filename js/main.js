'use strict';

var ARR_LENGTH = 8;
var Y_MIN = 130;
var Y_MAX = 630;
var MAP_PIN_WIDTH = 50;
var MAP_PIN_HEIGHT = 70;
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
  var pins = [];
  var fragment = document.createDocumentFragment();

  for (var i = 1; i <= ARR_LENGTH; i++) {
    pins.push(new Pin(i));
    fragment.appendChild(getTemplatePin(pins[i - 1]));
  }

  return fragment;
};

var map = document.querySelector('.map__pins');
var widthMapPins = map.offsetWidth;
var userPin = document.querySelector('#pin').content.querySelector('.map__pin');

document.querySelector('.map').classList.remove('map--faded');
map.appendChild(getPinsTemplate());


