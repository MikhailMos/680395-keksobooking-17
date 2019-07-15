'use strict';

(function () {
  var MAX_NUMBER_OF_PINS = 5;

  var enumerationMapPin = {
    HALF_WIDTH: 25,
    HEIGHT: 70
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

    userPinElement.style.left = (mapPin.location.x - enumerationMapPin.HALF_WIDTH) + 'px';
    userPinElement.style.top = (mapPin.location.y - enumerationMapPin.HEIGHT) + 'px';
    userPinElement.value = String(mapPin.location.x) + ', ' + String(mapPin.location.y);

    imgPin.src = mapPin.author.avatar;
    imgPin.alt = mapPin.offer.title;

    userPinElement.addEventListener('click', function () {
      window.card.renderCard(mapPin);
    });

    return userPinElement;
  };

  /**
   * Добавляет DOM элементы на страницу
   *
   * @param {array} data - содержит массив с информацией о загружаемых пинах
   */
  window.renderPin = function (data) {
    if (window.utils.isActive) {
      var mapPins = map.querySelectorAll('.map__pin');
      mapPins.forEach(function (item) {
        if (!item.classList.contains('map__pin--main')) {
          map.removeChild(item);
        }
      });
    }

    var fragment = document.createDocumentFragment();
    var takeNumber = data.length > MAX_NUMBER_OF_PINS ? MAX_NUMBER_OF_PINS : data.length;
    for (var i = 0; i < takeNumber; i++) {
      fragment.appendChild(getTemplatePin(data[i]));
    }
    map.appendChild(fragment);
  };

  var map = document.querySelector('.map__pins');
  var userPin = document.querySelector('#pin').content.querySelector('.map__pin');

})();
