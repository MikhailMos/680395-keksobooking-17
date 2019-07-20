'use strict';

(function () {
  var MAX_NUMBER_OF_PINS = 5;

  var enumerationMapPin = {
    HALF_WIDTH: 25,
    HEIGHT: 70
  };

  /**
   * Проверяет объект на пустоту
   *
   * @param {object} obj  - проверяемый объект
   * @return {boolean}
   */
  var isEmptyObject = function (obj) {
    return Object.keys(obj).length === 0;
  };

  /**
   * Добавляет события на пин
   *
   * @param {object} element - маркер, DOM-элемент
   * @param {object} mapPin - заполненный пин в Pin
   */
  var addingPinListeners = function (element, mapPin) {
    element.addEventListener('click', function () {
      element.classList.add('map__pin--active');
      window.card.renderCard(mapPin);
    });

    element.addEventListener('blur', function () {
      element.classList.remove('map__pin--active');
    });
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

    addingPinListeners(userPinElement, mapPin);

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
      if ((data[i].offer !== undefined) && !isEmptyObject(data[i].offer)) {
        fragment.appendChild(getTemplatePin(data[i]));
      }
    }
    map.appendChild(fragment);
  };

  var map = document.querySelector('.map__pins');
  var userPin = document.querySelector('#pin').content.querySelector('.map__pin');

})();
