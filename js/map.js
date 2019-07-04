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
   * возвращает минимальную цену
   *
   * @return {number}
   */
  var transfer = function () {
    if (window.form.typeOfHousing.value === 'palace') {
      return 10000;
    } else if (window.form.typeOfHousing.value === 'house') {
      return 5000;
    } else if (window.form.typeOfHousing.value === 'flat') {
      return 1000;
    } else {
      return 0;
    }
  };

  /**
   * Изменяет min для select и устанавливает значение в плейсхолдер
   */
  var onTypeOfHousingChange = function () {
    window.form.price.min = transfer();
    window.form.price.placeholder = String(window.form.price.min);
  };

  /**
   * Возвращает объект с координатами по осям X и Y
   *
   * @param {number} currentCoordX - текущая координата по оси Х
   * @param {number} currentCoordY - текущая координата по оси Y
   * @return {object}
   */
  var getLocationMapPinMain = function (currentCoordX, currentCoordY) {
    var locationObject = {};
    var locationX = map.offsetWidth - window.const.MAIN_PIN_HALF_WIDTH;
    var locationY = window.const.MAP_Y_MIN - window.const.MAIN_PIN_HEIGHT;

    if (currentCoordX > locationX) {
      locationObject.x = locationX;
    } else if (currentCoordX < -window.const.MAIN_PIN_HALF_WIDTH) {
      locationObject.x = -window.const.MAIN_PIN_HALF_WIDTH;
    } else {
      locationObject.x = currentCoordX;
    }

    if (locationY > currentCoordY) {
      locationObject.y = locationY;
    } else if (window.const.MAP_Y_MAX < currentCoordY) {
      locationObject.y = window.const.MAP_Y_MAX;
    } else {
      locationObject.y = currentCoordY;
    }

    return locationObject;
  };

  /**
   * Добавляет елементы на страницу
   *
   * @param {object} loadPins - содержит информацию о загружаемых пинах
   */
  var onSuccessHandler = function (loadPins) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < loadPins.length; i++) {
      fragment.appendChild(window.pin.getTemplatePin(loadPins[i]));
    }
    map.appendChild(fragment);

  };

  /**
   * Выводит сообщение об ошибке
   * @param {string} messageError - текст дополнительного сообщения
   */
  var onErrorHandler = function (messageError) {
    var fragment = document.createDocumentFragment();
    var templateError = document.querySelector('#error').content.querySelector('.error');
    var templateErrorMessage = templateError.querySelector('.error__message');
    var brElem = document.createElement('br');
    var spanElem = document.createElement('span');

    spanElem.textContent = messageError;
    spanElem.style.fontSize = '30px';
    spanElem.style.fontWeight = '500';

    templateErrorMessage.insertAdjacentElement('beforeEnd', brElem);
    templateErrorMessage.insertAdjacentElement('beforeEnd', spanElem);

    fragment.appendChild(templateError);
    document.querySelector('main').appendChild(fragment);
  };

  /** Добавляются события */
  var addEventListenerFunctions = function () {
    window.form.typeOfHousing.addEventListener('change', onTypeOfHousingChange);
    timein.addEventListener('change', onTimeInOutChange);
    timeout.addEventListener('change', onTimeInOutChange);
    window.form.adFormReset.addEventListener('click', onResetClick);
    window.form.adFormReset.addEventListener('keydown', onResetKeydown);
  };

  /** Удаляются события */
  var removeEventListenerFunctions = function () {
    window.form.adFormReset.removeEventListener('click', onResetClick);
    window.form.adFormReset.removeEventListener('keydown', onResetKeydown);
    window.form.typeOfHousing.removeEventListener('change', onTypeOfHousingChange);
    timein.removeEventListener('change', onTimeInOutChange);
    timeout.removeEventListener('change', onTimeInOutChange);
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
      window.backend.load(onSuccessHandler, onErrorHandler);

      if ((defaultCoordsPinMain.x === 0) && (defaultCoordsPinMain.y === 0)) {
        defaultCoordsPinMain.x = mapPinMain.offsetLeft;
        defaultCoordsPinMain.y = mapPinMain.offsetTop;
      }

      window.utils.isActive = true;
      adForm.classList.remove('ad-form--disabled');
      window.utils.enumeratesArray(itemsAccessibilityControls);

      pointAxisX = (mapPinMain.offsetLeft + window.const.MAIN_PIN_HALF_WIDTH);
      pointAxisY = (mapPinMain.offsetTop + window.const.MAIN_PIN_HEIGHT);
      window.form.address.value = pointAxisX + ', ' + pointAxisY;
      addEventListenerFunctions();

    } else {

      /**
       * событие перемещения мыши
       *
       * @param {object} moveEvt
       */
      var onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();

        var shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY
        };

        var coordsPinMain = getLocationMapPinMain((mapPinMain.offsetLeft - shift.x), (mapPinMain.offsetTop - shift.y));

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };

        mapPinMain.style.top = coordsPinMain.y + 'px';
        mapPinMain.style.left = coordsPinMain.x + 'px';
        pointAxisX = (mapPinMain.offsetLeft + window.const.MAIN_PIN_HALF_WIDTH);
        pointAxisY = (mapPinMain.offsetTop + window.const.MAIN_PIN_HEIGHT);
        window.form.address.value = pointAxisX + ', ' + pointAxisY;
      };

      /**
       * Событие при отпускании кнопки мыши
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

      map.addEventListener('mousemove', onMouseMove);
      map.addEventListener('mouseup', onMouseUp);
    }
  };

  /**
   * нажатие на кнопку очистить на форме
   */
  var onResetClick = function () {
    if (window.utils.isActive) {

      var mapPins = map.querySelectorAll('.map__pin');
      mapPins.forEach(function (item) {
        if (!item.classList.contains('map__pin--main')) {
          map.removeChild(item);
        } else {
          item.style.top = defaultCoordsPinMain.y + 'px';
          item.style.left = defaultCoordsPinMain.x + 'px';
        }
      });

      window.form.address.value = (mapPinMain.offsetLeft) + ', ' + (mapPinMain.offsetTop);
      window.utils.enumeratesArray(itemsAccessibilityControls);
      window.utils.isActive = false;
      adForm.classList.add('ad-form--disabled');
      document.querySelector('.map').classList.add('map--faded');
      removeEventListenerFunctions();
      window.form.typeOfHousing.selectedIndex = 1;
      onTypeOfHousingChange();
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
  var defaultCoordsPinMain = {
    x: 0,
    y: 0
  };
  var mapFilters = document.querySelector('.map__filters');
  var selectsMapFilters = mapFilters.querySelectorAll('select');
  var fieldsetsMapFilters = mapFilters.querySelectorAll('fieldset');
  var arrSelectsMapFilters = Array.from(selectsMapFilters);
  var arrFieldsetsMapFilters = Array.from(fieldsetsMapFilters);
  var arrFieldsetsAdForm = Array.from(window.form.fieldsetsAdForm);
  var itemsAccessibilityControls = arrSelectsMapFilters.concat(arrFieldsetsMapFilters, arrFieldsetsAdForm);
  var adForm = document.querySelector('.ad-form');
  var timein = adForm.querySelector('#timein');
  var timeout = adForm.querySelector('#timeout');
  var pointAxisX = mapPinMain.offsetLeft;
  var pointAxisY = mapPinMain.offsetTop;

  if (!window.utils.isActive) {
    window.form.address.value = pointAxisX + ', ' + pointAxisY;
    window.utils.enumeratesArray(itemsAccessibilityControls);
    onTypeOfHousingChange();
  }

  mapPinMain.addEventListener('mousedown', onMapPinMainMousedown);
})();
