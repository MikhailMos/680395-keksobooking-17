'use strict';

(function () {

  /**
   * Меняем значение в полях "время заедза и выезда"
   *
   * @param {object} evt
   */
  var onTimeInOutChange = function (evt) {
    if (evt.target.name === timein.name) {
      timeout.selectedIndex = timein.selectedIndex;
    } else {
      timein.selectedIndex = timeout.selectedIndex;
    }
  };

  /**
   * Событие нажатия кнопки мыши на основном пине
   *
   * @param {object} evt
   */
  var onMapPinMainMousedown = function (evt) {
    evt.preventDefault();

    if (!window.utils.isActive) {

      document.querySelector('.map').classList.remove('map--faded');
      map.appendChild(window.pin.getPinsTemplate());

      if ((defaultCoordsPinMain.x === 0) && (defaultCoordsPinMain.y === 0)) {
        defaultCoordsPinMain.x = mapPinMain.offsetLeft;
        defaultCoordsPinMain.y = mapPinMain.offsetTop;
      }
      // активное состояние
      window.utils.isActive = true;
      adForm.classList.remove('ad-form--disabled');
      window.utils.enumeratesArray(itemsAccessibilityControls);

      window.form.address.value = (mapPinMain.offsetLeft + halfWidthMapPinMain) + ', ' + (mapPinMain.offsetTop + window.const.MAIN_PIN_HEIGHT);
      window.form.typeOfHousing.addEventListener('change', window.form.onTypeOfHousingChange);
      timein.addEventListener('change', onTimeInOutChange);
      timeout.addEventListener('change', onTimeInOutChange);
      // на кнопку Очистить
      window.form.adFormReset.addEventListener('click', onResetClick);
      window.form.adFormReset.addEventListener('keydown', onResetKeydown);

    } else {

      /**
       * Возвращает координату по оси Х
       * (проверка на случай выхода курсора за карту)
       *
       * @param {number} currentCoord - текущая координата по оси Х
       * @return {number}
       */
      var getResultX = function (currentCoord) {
        var locationX = map.offsetWidth - halfWidthMapPinMain;

        if (currentCoord > locationX) {
          onMouseUp();
          return locationX;
        } else if (currentCoord < (-halfWidthMapPinMain)) {
          onMouseUp();
          return -halfWidthMapPinMain;
        } else {
          return currentCoord;
        }
      };

      /**
       * Возвращает координату по оси Y
       * (проверка на случай выхода курсора за карту)
       *
       * @param {number} currentCoord - текущая координата по оси Y
       * @return {number}
       */
      var getResultY = function (currentCoord) {
        var locationY = window.const.MAP_Y_MIN - window.const.MAIN_PIN_HEIGHT;

        if (currentCoord < locationY) {
          onMouseUp();
          return locationY;
        } else if (currentCoord > window.const.MAP_Y_MAX) {
          onMouseUp();
          return window.const.MAP_Y_MAX;
        } else {
          return currentCoord;
        }
      };

      /**
       * событие перемещения мышы
       *
       * @param {object} moveEvt
       */
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
        window.form.address.value = (mapPinMain.offsetLeft + halfWidthMapPinMain) + ', ' + (mapPinMain.offsetTop + window.const.MAIN_PIN_HEIGHT);
      };

      /**
       * Событие при отпускании кнопки мышы
       *
       * @param {object} upEvt
       */
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

  /**
   * нажатие на кнопку очистить на форме
   */
  var onResetClick = function () {
    if (window.utils.isActive) {
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
      window.form.address.value = (mapPinMain.offsetLeft) + ', ' + (mapPinMain.offsetTop);
      window.utils.enumeratesArray(itemsAccessibilityControls);
      window.utils.isActive = false;
      adForm.classList.add('ad-form--disabled');
      document.querySelector('.map').classList.add('map--faded');

      window.form.adFormReset.removeEventListener('click', onResetClick);
      window.form.adFormReset.removeEventListener('keydown', onResetKeydown);
      window.form.typeOfHousing.removeEventListener('change', window.form.onTypeOfHousingChange);
      timein.removeEventListener('change', onTimeInOutChange);
      timeout.removeEventListener('change', onTimeInOutChange);
    }
  };

  /**
   * Нажатие на кнопку Очистить клавишей Enter
   *
   * @param {object} evt
   */
  var onResetKeydown = function (evt) {
    window.utils.isEnterEvent(evt, onResetClick);
  };

  var map = document.querySelector('.map__pins');
  var mapPinMain = map.querySelector('.map__pin--main');
  var halfWidthMapPinMain = Math.round(window.const.MAP_PIN_WIDTH / 2);
  var defaultCoordsPinMain = {
    x: 0,
    y: 0
  };
  var mapFilters = document.querySelector('.map__filters');
  var selectsMapFilters = mapFilters.querySelectorAll('select');
  var fieldsetsMapFilters = mapFilters.querySelectorAll('fieldset');
  var itemsAccessibilityControls = Array.from(selectsMapFilters).concat(Array.from(fieldsetsMapFilters), Array.from(window.form.fieldsetsAdForm));
  var adForm = document.querySelector('.ad-form');
  var timein = adForm.querySelector('#timein');
  var timeout = adForm.querySelector('#timeout');

  if (!window.utils.isActive) {
    window.form.address.value = (mapPinMain.offsetLeft) + ', ' + (mapPinMain.offsetTop);
    window.utils.enumeratesArray(itemsAccessibilityControls);
  }

  mapPinMain.addEventListener('mousedown', onMapPinMainMousedown);
})();
