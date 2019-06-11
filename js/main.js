'use strict';

var ARR_LENGTH = 8;
var Y_MIN = 130;
var Y_MAX = 630;
var TYPE_OF_PLACE = ['palace', 'flat', 'house', 'bungalo'];

var arrMyObjects = [];
var widthMapPins = document.querySelector('.map__pins').offsetWidth;
var mapPinElementWidth = document.querySelector('.map__pin').offsetWidth;
var mapPinElementHeight = document.querySelector('.map__pin').offsetHeight;
var similarListElement = document.querySelector('.map__pins');
var similarPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var fragment = document.createDocumentFragment();

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var MyObject = function (index, address, type, x, y) {
  this.author = {'avatar': address + '0' + index + '.png'};
  this.offer = {'type': type};
  this.location = {'x': x, 'y': y};
};

var renderMapPin = function (mapPin) {
  var mapPinElement = similarPinTemplate.cloneNode(true);
  var imgElement = mapPinElement.querySelector('img');


  mapPinElement.style.left = String(mapPin.location.x - (mapPinElementWidth / 2)) + 'px';
  mapPinElement.style.top = String(mapPin.location.y - mapPinElementHeight) + 'px';

  imgElement.src = mapPin.author.avatar;
  imgElement.alt = 'Тут могла бы быть Ваша реклама';

  return mapPinElement;
};

for (var i = 1; i <= ARR_LENGTH; i++) {
  arrMyObjects[i] = new MyObject(i, 'img/avatars/user', TYPE_OF_PLACE[getRandomInt(0, TYPE_OF_PLACE.length)], getRandomInt(0, widthMapPins), getRandomInt(Y_MIN, Y_MAX));
  fragment.appendChild(renderMapPin(arrMyObjects[i]));
}
similarListElement.appendChild(fragment);

document.querySelector('.map').classList.remove('map--faded');
