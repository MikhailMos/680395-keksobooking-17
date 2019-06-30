'use strict';

(function () {

  /**
   * Экземпляр метки
   *
   * @constructor
   * @param {number} index - порядковый номер
   */
  var Pin = function (index) {
    this.author = {'avatar': window.const.PATH_TO_IMG + '0' + index + '.png'};
    this.offer = {'type': window.const.TYPE_OF_PLACE[window.utils.getRandomInt(0, window.const.TYPE_OF_PLACE.length)]};
    this.location = {'x': window.utils.getRandomInt(0, widthMapPins), 'y': window.utils.getRandomInt(window.const.MAP_Y_MIN, window.const.MAP_Y_MAX)};
  };

  /**
   * возвращает пин как DOM-элемент
   *
   * @param {object} mapPin - заполненный пин в Pin
   * @return {object}
   */
  var getTemplatePin = function (mapPin) {
    var userPinElement = userPin.cloneNode(true);
    var imgPin = userPinElement.querySelector('img');

    userPinElement.style.left = (mapPin.location.x - window.const.MAP_PIN_HALF_WIDTH) + 'px';
    userPinElement.style.top = (mapPin.location.y - window.const.MAP_PIN_HEIGHT) + 'px';

    imgPin.src = mapPin.author.avatar;
    imgPin.alt = 'Тут могла бы быть Ваша реклама';

    return userPinElement;
  };

  window.pin = {
    getPinsTemplate: function () {
      var fragment = document.createDocumentFragment();
      for (var i = 1; i <= window.const.ARR_LENGTH; i++) {
        fragment.appendChild(getTemplatePin(new Pin(i)));
      }
      return fragment;
    }
  };

  var widthMapPins = document.querySelector('.map__pins').offsetWidth;
  var userPin = document.querySelector('#pin').content.querySelector('.map__pin');
})();
