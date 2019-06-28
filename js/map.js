'use strict';

(function () {
  var Y_MIN = 130;
  var Y_MAX = 630;
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 80;

  window.map = {
    Y_MIN: Y_MIN,
    Y_MAX: Y_MAX
  };

  var onTimeInOutChange = function (evt) {
    if (evt.target.name === timein.name) {
      timeout.selectedIndex = timein.selectedIndex;
    } else {
      timein.selectedIndex = timeout.selectedIndex;
    }
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
      window.utils.isOpened = true;
      adForm.classList.remove('ad-form--disabled');
      window.utils.enumeratesArray(selectsMapFilters);
      window.utils.enumeratesArray(fieldsetsMapFilters);
      window.utils.enumeratesArray(window.form.fieldsetsAdForm);

      window.form.address.value = String(mapPinMain.offsetLeft + halfWidthMapPinMain) + ', ' + String(mapPinMain.offsetTop + MAIN_PIN_HEIGHT);
      window.form.typeOfHousing.addEventListener('change', window.form.onTypeOfHousingChange);
      timein.addEventListener('change', onTimeInOutChange);
      timeout.addEventListener('change', onTimeInOutChange);
      // на кнопку Очистить
      window.form.adFormReset.addEventListener('click', onResetClick);
      window.form.adFormReset.addEventListener('keydown', onResetKeydown);

    } else {

      var getResultX = function (currentCoord) {
        if (currentCoord > (map.offsetWidth - (MAIN_PIN_WIDTH / 2))) {
          onMouseUp();
          return (map.offsetWidth - (MAIN_PIN_WIDTH / 2));
        } else if (currentCoord < (-(MAIN_PIN_WIDTH / 2))) {
          onMouseUp();
          return -(MAIN_PIN_WIDTH / 2);
        }

        return currentCoord;
      };

      var getResultY = function (currentCoord) {
        if (currentCoord < (Y_MIN - MAIN_PIN_HEIGHT)) {
          onMouseUp();
          return (Y_MIN - MAIN_PIN_HEIGHT);
        } else if (currentCoord > Y_MAX) {
          onMouseUp();
          return Y_MAX;
        }

        return currentCoord;
      };

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
        window.form.address.value = String(mapPinMain.offsetLeft + halfWidthMapPinMain) + ', ' + String(mapPinMain.offsetTop + MAIN_PIN_HEIGHT);
      };

      var onMouseUp = function (upEvt) {
        if (upEvt !== undefined) {
          upEvt.preventDefault();
        }

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
      window.form.address.value = String(mapPinMain.offsetLeft) + ', ' + String(mapPinMain.offsetTop);
      window.utils.enumeratesArray(selectsMapFilters);
      window.utils.enumeratesArray(fieldsetsMapFilters);
      window.utils.isOpened = false;
      adForm.classList.add('ad-form--disabled');
      document.querySelector('.map').classList.add('map--faded');

      window.form.adFormReset.removeEventListener('click', onResetClick);
      window.form.adFormReset.removeEventListener('keydown', onResetKeydown);
      window.form.typeOfHousing.removeEventListener('change', window.form.onTypeOfHousingChange);
      timein.removeEventListener('change', onTimeInOutChange);
      timeout.removeEventListener('change', onTimeInOutChange);
    }
  };

  var onResetKeydown = function (evt) {
    window.utils.isEnterEvent(evt, onResetClick);
  };

  var map = document.querySelector('.map__pins');
  var mapPinMain = map.querySelector('.map__pin--main');
  var halfWidthMapPinMain = Math.round(MAIN_PIN_WIDTH / 2);
  var defaultCoordsPinMain = {
    x: 0,
    y: 0
  };
  var mapFilters = document.querySelector('.map__filters');
  var selectsMapFilters = mapFilters.querySelectorAll('select');
  var fieldsetsMapFilters = mapFilters.querySelectorAll('fieldset');
  var adForm = document.querySelector('.ad-form');
  var timein = adForm.querySelector('#timein');
  var timeout = adForm.querySelector('#timeout');

  if (!window.utils.isOpened) {
    window.form.address.value = String(mapPinMain.offsetLeft) + ', ' + String(mapPinMain.offsetTop);
    window.utils.enumeratesArray(selectsMapFilters);
    window.utils.enumeratesArray(fieldsetsMapFilters);
  }

  mapPinMain.addEventListener('mousedown', onMapPinMainMousedown);
})();
