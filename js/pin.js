'use strict';

(function () {
  var PATH_TO_IMG = 'img/avatars/user';
  var TYPE_OF_PLACE = ['palace', 'flat', 'house', 'bungalo'];
  var MAP_PIN_WIDTH = 50;
  var MAP_PIN_HEIGHT = 70;
  var ARR_LENGTH = 8;

  var Pin = function (index) {
    this.author = {'avatar': PATH_TO_IMG + '0' + index + '.png'};
    this.offer = {'type': TYPE_OF_PLACE[window.utils.getRandomInt(0, TYPE_OF_PLACE.length)]};
    this.location = {'x': window.utils.getRandomInt(0, widthMapPins), 'y': window.utils.getRandomInt(window.map.Y_MIN, window.map.Y_MAX)};
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

  window.pin = {
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
