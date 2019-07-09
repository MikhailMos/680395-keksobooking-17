'use strict';

(function () {
  var MAX_NUMBER_OF_PINS = 5;

  /**
   * Возвращает фрагмент DOM элементов, которые будут добавлены на страницу
   *
   * @param {array} data - содержит массив с информацией о загружаемых пинах
   * @return {object}
   */
  var renderPin = function (data) {
    var fragment = document.createDocumentFragment();
    var takeNumber = data.length > MAX_NUMBER_OF_PINS ? MAX_NUMBER_OF_PINS : data.length;
    for (var i = 0; i < takeNumber; i++) {
      fragment.appendChild(window.pin.getTemplatePin(data[i]));
    }
    return fragment;
  };

  window.render = {
    renderPin: renderPin
  };

})();
