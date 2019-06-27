'use strict';

(function () {
  var Y_MIN = 130;
  var Y_MAX = 630;
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 80;

  var getResultX = function (currentCoord) {
    if (currentCoord > (map.offsetWidth - (MAIN_PIN_WIDTH / 2))) {
      return (map.offsetWidth - (MAIN_PIN_WIDTH / 2));
    } else if (currentCoord < (-(MAIN_PIN_WIDTH / 2))) {
      return -(MAIN_PIN_WIDTH / 2);
    }

    return currentCoord;
  };

  var getResultY = function (currentCoord) {
    if (currentCoord < (window.utils.Y_MIN - MAIN_PIN_HEIGHT)) {
      return (window.utils.Y_MIN - MAIN_PIN_HEIGHT);
    } else if (currentCoord > window.utils.Y_MAX) {
      return window.utils.Y_MAX;
    }

    return currentCoord;
  };

  var onMapPinMainMousedown = function (evt) {
    evt.preventDefault();

    if (!window.utils.isOpened) {

      document.querySelector('.map').classList.remove('map--faded');
      map.appendChild(window.pin.getPinsTemplate());

      if ((defaultCoordsPinMain.x === 0) && (defaultCoordsPinMain.y === 0)) {
        defaultCoordsPinMain.x = mapPinMain.offsetLeft;
        defaultCoordsPinMain.y = mapPinMain.offsetTop;
      }
      // активное состояние
      adForm.classList.remove('ad-form--disabled');
      price.min = getMinValuePrice();
      price.placeholder = String(price.min);
      address.value = String(mapPinMain.offsetLeft + halfWidthMapPinMain) + ', ' + String(mapPinMain.offsetTop + MAIN_PIN_HEIGHT);
      enumeratesArray();
      window.utils.isOpened = true;

      typeOfHousing.addEventListener('change', onTypeOfHousingChange);
      timein.addEventListener('change', onTimeInOutChange);
      timeout.addEventListener('change', onTimeInOutChange);
      // на кнопку Очистить
      adFormReset.addEventListener('click', onResetClick);
      adFormReset.addEventListener('keydown', onResetClick);

    } else {

      var onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();

        var shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY
        };

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };

        mapPinMain.style.top = getResultY(mapPinMain.offsetTop - shift.y) + 'px';
        mapPinMain.style.left = getResultX(mapPinMain.offsetLeft - shift.x) + 'px';
        address.value = String(mapPinMain.offsetLeft + halfWidthMapPinMain) + ', ' + String(mapPinMain.offsetTop + MAIN_PIN_HEIGHT);
      };

      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();

        map.removeEventListener('mousemove', onMouseMove);
        map.removeEventListener('mouseup', onMouseUp);
      };

      var startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      // перемещение главного маркера
      map.addEventListener('mousemove', onMouseMove);
      map.addEventListener('mouseup', onMouseUp);
    }
  };

  var onResetClick = function () {
    if (window.utils.isOpened) {
      // удаляем метки
      var mapPins = map.querySelectorAll('.map__pin');
      mapPins.forEach(function (item) {
        if (!item.classList.contains('map__pin--main')) {
          map.removeChild(item);
        } else {
          item.style.top = defaultCoordsPinMain.y + 'px';
          item.style.left = defaultCoordsPinMain.x + 'px';
        }
      });
      // не активное состояние
      address.value = String(mapPinMain.offsetLeft) + ', ' + String(mapPinMain.offsetTop);
      enumeratesArray();
      window.utils.isOpened = false;
      adForm.classList.add('ad-form--disabled');
      document.querySelector('.map').classList.add('map--faded');

      adFormReset.removeEventListener('click', onResetClick);
      adFormReset.removeEventListener('keydown', onResetClick);
      typeOfHousing.removeEventListener('change', onTypeOfHousingChange);
      timein.removeEventListener('change', onTimeInOutChange);
      timeout.removeEventListener('change', onTimeInOutChange);
    }
  };

  // var isOpened = true;
  var adForm = document.querySelector('.ad-form');
  var adFormReset = adForm.querySelector('.ad-form__reset');
  var map = document.querySelector('.map__pins');
  var mapPinMain = map.querySelector('.map__pin--main');
  var halfWidthMapPinMain = Math.round(MAIN_PIN_WIDTH / 2);
  var defaultCoordsPinMain = {
    x: 0,
    y: 0
  };

  window.map = {
    Y_MIN: Y_MIN,
    Y_MAX: Y_MAX
  };

  mapPinMain.addEventListener('mousedown', onMapPinMainMousedown);

})();
