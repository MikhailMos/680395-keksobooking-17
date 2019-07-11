'use strict';

(function () {

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
    userPinElement.value = JSON.stringify(mapPin.offer);

    imgPin.src = mapPin.author.avatar;
    imgPin.alt = mapPin.offer.title;

    userPinElement.addEventListener('click', function () {
      window.card.getCard(mapPin);
    });

    return userPinElement;
  };

  window.pin = {
    getTemplatePin: getTemplatePin
  };

  var userPin = document.querySelector('#pin').content.querySelector('.map__pin');
})();
