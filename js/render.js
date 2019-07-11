'use strict';

(function () {
  var MAX_NUMBER_OF_PINS = 5;

  /**
   * Добавляет DOM элементы на страницу
   *
   * @param {array} data - содержит массив с информацией о загружаемых пинах
   */
  var renderPin = function (data) {
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
      fragment.appendChild(window.pin.getTemplatePin(data[i]));
    }
    window.card.getCard(data[0]);
    map.appendChild(fragment);
  };

  var map = document.querySelector('.map__pins');

  window.render = {
    renderPin: renderPin
  };

})();
