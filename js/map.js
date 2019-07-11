'use strict';

(function () {
  // var MAX_NUMBER_OF_PINS = 5;
  var HousingType = {
    BUNGALO: 0,
    FLAT: 1000,
    HOUSE: 5000,
    PALACE: 10000
  };

  /**
   * Создает объект со свойствами X и Y
   *
   * @constructor
   * @param {number} x - координата по оси X
   * @param {number} y - координата по оси Y
   */
  var Coordinate = function (x, y) {
    this.x = x;
    this.y = y;
  };

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
   * Изменяет min для select и устанавливает значение в плейсхолдер
   */
  var onTypeOfHousingChange = function () {
    var result;
    switch (window.form.typeOfHousing.value) {
      case 'palace':
        result = HousingType.PALACE;
        break;
      case 'house':
        result = HousingType.HOUSE;
        break;
      case 'flat':
        result = HousingType.FLAT;
        break;
      default:
        result = HousingType.BUNGALO;
        break;
    }
    window.form.price.min = result;
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
   * Получает данные с сервера при успешной загрузке
   *
   * @param {array} loadPins - содержит массив с информацией о загружаемых пинах
   */
  var onSuccessHandler = function (loadPins) {
    pins = loadPins.slice();

    mapPinMain.addEventListener('mousedown', onMapPinMainMousedown);
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

  /**
   * Фильтрует список данных
   */
  var onFilterChange = function () {
    var sortPins = pins.slice();

    window.render.renderPin(sortPins.filter(function (item) {
      if (filterHousingType.value === 'any') {
        return true;
      } else {
        return item.offer.type === filterHousingType.value;
      }
    }));
  };

  /** Добавляются события */
  var addEventListenerFunctions = function () {
    window.form.typeOfHousing.addEventListener('change', onTypeOfHousingChange);
    window.form.adFormReset.addEventListener('click', onResetClick);
    window.form.adFormReset.addEventListener('keydown', onResetKeydown);
    timein.addEventListener('change', onTimeInOutChange);
    timeout.addEventListener('change', onTimeInOutChange);
    // filterHousingType.addEventListener('change', onFilterChange);
    selectsMapFilters.forEach(function (item) {
      item.addEventListener('change', onFilterChange);
    });
  };

  /** Удаляются события */
  var removeEventListenerFunctions = function () {
    window.form.adFormReset.removeEventListener('click', onResetClick);
    window.form.adFormReset.removeEventListener('keydown', onResetKeydown);
    window.form.typeOfHousing.removeEventListener('change', onTypeOfHousingChange);
    timein.removeEventListener('change', onTimeInOutChange);
    timeout.removeEventListener('change', onTimeInOutChange);
    // filterHousingType.removeEventListener('change', onFilterChange);
    selectsMapFilters.forEach(function (item) {
      item.removeEventListener('change', onFilterChange);
    });
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
      window.render.renderPin(pins.slice());

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

        var shift = new Coordinate(startCoords.x - moveEvt.clientX, startCoords.y - moveEvt.clientY);
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

      var startCoords = new Coordinate(evt.clientX, evt.clientY);

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
  var defaultCoordsPinMain = new Coordinate(0, 0);
  var mapFilters = document.querySelector('.map__filters');
  var selectsMapFilters = mapFilters.querySelectorAll('select');
  var fieldsetsMapFilters = mapFilters.querySelectorAll('fieldset');
  var arrSelectsMapFilters = Array.from(selectsMapFilters);
  var arrFieldsetsMapFilters = Array.from(fieldsetsMapFilters);
  var arrFieldsetsAdForm = Array.from(window.form.fieldsetsAdForm);
  var itemsAccessibilityControls = arrSelectsMapFilters.concat(arrFieldsetsMapFilters, arrFieldsetsAdForm);
  var filterHousingType = mapFilters.querySelector('#housing-type');
  var adForm = document.querySelector('.ad-form');
  var timein = adForm.querySelector('#timein');
  var timeout = adForm.querySelector('#timeout');
  var pointAxisX = mapPinMain.offsetLeft;
  var pointAxisY = mapPinMain.offsetTop;
  var pins = [];

  if (!window.utils.isActive) {
    window.form.address.value = pointAxisX + ', ' + pointAxisY;
    window.utils.enumeratesArray(itemsAccessibilityControls);
    onTypeOfHousingChange();
  }

  window.backend.load(onSuccessHandler, onErrorHandler);

})();
