'use strict';

(function () {
  var HousingTypePrice = {
    BUNGALO: 0,
    FLAT: 1000,
    HOUSE: 5000,
    PALACE: 10000
  };

  /**
   * Создает объект содержащий ограничения по осям
   * @constructor
   * @param {number} top - ограничение сверху по оси Y
   * @param {number} right ограничение справа по оси X
   * @param {number} bottom - ограничение снизу по оси Y
   * @param {number} left - ограничение слева по оси X
   */
  var Rect = function (top, right, bottom, left) {
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.left = left;
  };

  /**
   * Создает объект со свойствами X и Y
   *
   * @constructor
   * @param {number} x - значение по оси X
   * @param {number} y - значение по оси Y
   * @param {object} contrains - ограничения по осям X и Y
   */
  var Coordinate = function (x, y, contrains) {
    this.x = x;
    this.y = y;
    this._contrains = contrains;
  };

  Coordinate.prototype = {
    setX: function (x) {
      if (x < this._contrains.left) {
        this.x = this._contrains.left;
      } else if (x > this._contrains.right) {
        this.x = this._contrains.right;
      } else {
        this.x = x;
      }
    },
    setY: function (y) {
      if (y < this._contrains.top) {
        this.y = this._contrains.top;
      } else if (y > this._contrains.bottom) {
        this.y = this._contrains.bottom;
      } else {
        this.y = y;
      }
    }
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
        result = HousingTypePrice.PALACE;
        break;
      case 'house':
        result = HousingTypePrice.HOUSE;
        break;
      case 'flat':
        result = HousingTypePrice.FLAT;
        break;
      default:
        result = HousingTypePrice.BUNGALO;
        break;
    }
    window.form.price.min = result;
    window.form.price.placeholder = String(window.form.price.min);
  };

  /**
   * Сохраняет данные на сервер
   *
   * @param {object} evt
   */
  var saveToServer = function (evt) {
    window.backend.upload(new FormData(adForm), onSaveHandler, onErrorHandler);
    evt.preventDefault();
  };

  /**
   * Проверяет на заполненность и тип, объект загруженный на сервер
   *
   * @param {object} responsive - ответ от сервера
   */
  var onSaveHandler = function (responsive) {
    if ((typeof (responsive) === 'object') && (JSON.stringify(responsive).length > 0)) {
      adForm.removeEventListener('submit', saveToServer);
      onResetClick();
    } else {
      onErrorHandler('Что-то пошло не так!');
    }
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

  var onRoomNumberCapacityChange = function () {
    var textMessage = '';
    if (roomNumber.value === '100' && (capacity.value !== '0')) {
      textMessage = '100 комнат - не для гостей!';
    } else if (roomNumber.value === '3' && capacity.value === '0') {
      textMessage = 'Количество мест для гостей должно быть от 1 до 3х!';
    } else if (roomNumber.value === '2' && (capacity.value === '3' || capacity.value === '0')) {
      textMessage = 'Количество мест должно быть либо для 1 гостя, либо для 2 гостей';
    } else if (roomNumber.value === '1' && capacity.value !== '1') {
      textMessage = 'Количество мест должно быть для 1 гостя!';
    }

    capacity.setCustomValidity(textMessage);
  };

  /** Добавляются события */
  var addEventListenerFunctions = function () {
    window.form.typeOfHousing.addEventListener('change', onTypeOfHousingChange);
    window.form.adFormReset.addEventListener('click', onResetClick);
    window.form.adFormReset.addEventListener('keydown', onResetKeydown);
    timein.addEventListener('change', onTimeInOutChange);
    timeout.addEventListener('change', onTimeInOutChange);
    roomNumber.addEventListener('change', onRoomNumberCapacityChange);
    capacity.addEventListener('change', onRoomNumberCapacityChange);
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
    roomNumber.removeEventListener('change', onRoomNumberCapacityChange);
    capacity.removeEventListener('change', onRoomNumberCapacityChange);
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
      onRoomNumberCapacityChange();

      adForm.addEventListener('submit', saveToServer);

    } else {

      /**
       * событие перемещения мыши
       *
       * @param {object} moveEvt
       */
      var onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();

        var shift = new Coordinate(startCoords.x - moveEvt.clientX, startCoords.y - moveEvt.clientY);

        var coordsPinMain = new Coordinate(0, 0, contrains);
        coordsPinMain.setX(mapPinMain.offsetLeft - shift.x);
        coordsPinMain.setY(mapPinMain.offsetTop - shift.y);

        startCoords.x = moveEvt.clientX;
        startCoords.y = moveEvt.clientY;

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

      window.form.title.value = '';
      window.form.address.value = (mapPinMain.offsetLeft) + ', ' + (mapPinMain.offsetTop);
      window.utils.enumeratesArray(itemsAccessibilityControls);
      window.utils.isActive = false;
      adForm.classList.add('ad-form--disabled');
      document.querySelector('.map').classList.add('map--faded');
      window.form.typeOfHousing.selectedIndex = 1;
      onTypeOfHousingChange();
      removeEventListenerFunctions();
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
  var roomNumber = adForm.querySelector('#room_number');
  var capacity = adForm.querySelector('#capacity');

  var contrains = new Rect(window.const.MAP_Y_MIN - window.const.MAIN_PIN_HEIGHT,
      map.offsetWidth - window.const.MAIN_PIN_HALF_WIDTH,
      window.const.MAP_Y_MAX,
      -window.const.MAIN_PIN_HALF_WIDTH);
  var defaultCoordsPinMain = new Coordinate(0, 0);
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
