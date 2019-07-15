'use strict';

(function () {
  var enumerationMainPin = {
    HALF_WIDTH: 32,
    HEIGHT: 80
  };

  /**
   * Создает объект содержащий ограничения по осям
   *
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
   */
  var Coordinate = function (x, y) {
    this.x = x;
    this.y = y;
  };

  /**
   * Устанавливает значение по оси X, согласно ограничений
   *
   * @param {number} x - координата по оси X
   * @return {number}
   */
  var setContrainsX = function (x) {
    var result;
    if (x < contrains.left) {
      result = contrains.left;
    } else if (x > contrains.right) {
      result = contrains.right;
    } else {
      result = x;
    }

    return result;
  };

  /**
   * Устанавливает значение по оси Y, согласно ограничений
   *
   * @param {number} y - координата по оси Y
   * @return {number}
   */
  var setContrainsY = function (y) {
    var result;

    if (y < contrains.top) {
      result = contrains.top;
    } else if (y > contrains.bottom) {
      result = contrains.bottom;
    } else {
      result = y;
    }

    return result;
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
    var result = window.card.housingType[typeOfHousing.value].price;

    price.min = result;
    price.placeholder = String(price.min);
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
   *
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

    window.renderPin(sortPins.filter(function (item) {
      if (filterHousingType.value === 'any') {
        return true;
      } else {
        return item.offer.type === filterHousingType.value;
      }
    }));
  };

  /** Валидация поля Количество мест, в зависимости от количества комнат */
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
    typeOfHousing.addEventListener('change', onTypeOfHousingChange);
    adFormReset.addEventListener('click', onResetClick);
    adFormReset.addEventListener('keydown', onResetKeydown);
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
    adFormReset.removeEventListener('click', onResetClick);
    adFormReset.removeEventListener('keydown', onResetKeydown);
    typeOfHousing.removeEventListener('change', onTypeOfHousingChange);
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
      window.renderPin(pins.slice());

      window.utils.isActiveEnabled();
      adForm.classList.remove('ad-form--disabled');
      window.utils.enumeratesArray(itemsAccessibilityControls);

      pointAxisX = (mapPinMain.offsetLeft + enumerationMainPin.HALF_WIDTH);
      pointAxisY = (mapPinMain.offsetTop + enumerationMainPin.HEIGHT);
      address.value = pointAxisX + ', ' + pointAxisY;
      addEventListenerFunctions();
      onRoomNumberCapacityChange();

      adForm.addEventListener('submit', saveToServer);

    } else {

      startCoords.x = evt.clientX;
      startCoords.y = evt.clientY;

      map.addEventListener('mousemove', onMouseMove);
      map.addEventListener('mouseup', onMouseUp);
    }
  };

  /**
   * событие перемещения мыши
   *
   * @param {object} moveEvt
   */
  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    var shift = new Coordinate(startCoords.x - moveEvt.clientX, startCoords.y - moveEvt.clientY);

    startCoords.x = moveEvt.clientX;
    startCoords.y = moveEvt.clientY;

    mapPinMain.style.top = setContrainsY(mapPinMain.offsetTop - shift.y) + 'px';
    mapPinMain.style.left = setContrainsX(mapPinMain.offsetLeft - shift.x) + 'px';
    pointAxisX = (mapPinMain.offsetLeft + enumerationMainPin.HALF_WIDTH);
    pointAxisY = (mapPinMain.offsetTop + enumerationMainPin.HEIGHT);
    address.value = pointAxisX + ', ' + pointAxisY;
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

  /**
   * Сбрасывает координаты основной метки по умолчанию
   */
  var resetMainPinToDefault = function () {
    mapPinMain.style.top = defaultCoordsPinMain.y + 'px';
    mapPinMain.style.left = defaultCoordsPinMain.x + 'px';
  };

  /**
   * Удаляет метки с объявлениями
   */
  var removePin = function () {
    var mapPins = map.querySelectorAll('.map__pin:not(.map__pin--main)');
    mapPins.forEach(function (item) {
      map.removeChild(item);
    });
  };

  /**
   * нажатие на кнопку очистить на форме
   *
   * @param {object} evt - событие
   */
  var onResetClick = function (evt) {
    if (window.utils.isActive) {

      if (evt !== undefined) {
        evt.preventDefault();
      }

      removePin();
      resetMainPinToDefault();

      title.value = '';
      price.value = '';
      typeOfHousing.selectedIndex = defaultIndexType;
      capacity.selectedIndex = defaultIndexCapcity;
      roomNumber.selectedIndex = defaultIndexRoomNumber;
      address.value = (mapPinMain.offsetLeft) + ', ' + (mapPinMain.offsetTop);
      window.utils.enumeratesArray(itemsAccessibilityControls);
      window.utils.isActiveDisabled();
      adForm.classList.add('ad-form--disabled');
      document.querySelector('.map').classList.add('map--faded');

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

  /**
   * Возврщет массив элементов страницы
   *
   * @param {object} selectFilters - поля выбора фильтра (NodeList)
   * @param {object} fieldsetFilters - поле фильтра с кнопкми (NodeList)
   * @param {object} fieldsetForm - поля формы (NodeList)
   * @return {array}
   */
  var getArrElements = function (selectFilters, fieldsetFilters, fieldsetForm) {
    var arrSelectsFilters = Array.from(selectFilters);
    var arrFieldsetsFilters = Array.from(fieldsetFilters);
    var arrFieldsetsForm = Array.from(fieldsetForm);

    return arrSelectsFilters.concat(arrFieldsetsFilters, arrFieldsetsForm);
  };

  var map = document.querySelector('.map__pins');
  var mapPinMain = map.querySelector('.map__pin--main');
  /**
   * элементы фильтра карты
   */
  var mapFilters = document.querySelector('.map__filters');
  var selectsMapFilters = mapFilters.querySelectorAll('select');
  var fieldsetsMapFilters = mapFilters.querySelectorAll('fieldset');

  var filterHousingType = mapFilters.querySelector('#housing-type');
  /**
   * элементы формы
   */
  var adForm = document.querySelector('.ad-form');
  var adFormReset = adForm.querySelector('.ad-form__reset');
  var address = adForm.querySelector('#address');
  var typeOfHousing = adForm.querySelector('#type');
  var price = adForm.querySelector('#price');
  var title = adForm.querySelector('#title');
  var fieldsetsAdForm = adForm.querySelectorAll('fieldset');
  var timein = adForm.querySelector('#timein');
  var timeout = adForm.querySelector('#timeout');
  var roomNumber = adForm.querySelector('#room_number');
  var capacity = adForm.querySelector('#capacity');
  /**
   * значения по умолчанию
   */
  var itemsAccessibilityControls = getArrElements(selectsMapFilters, fieldsetsMapFilters, fieldsetsAdForm);
  var contrains = new Rect(window.const.mapRestriction.Y_MIN - enumerationMainPin.HEIGHT,
      map.offsetWidth - enumerationMainPin.HALF_WIDTH,
      window.const.mapRestriction.Y_MAX,
      -enumerationMainPin.HALF_WIDTH);
  var defaultCoordsPinMain = new Coordinate(mapPinMain.offsetLeft, mapPinMain.offsetTop);
  var defaultIndexRoomNumber = roomNumber.selectedIndex;
  var defaultIndexCapcity = capacity.selectedIndex;
  var defaultIndexType = typeOfHousing.selectedIndex;
  var pointAxisX = mapPinMain.offsetLeft;
  var pointAxisY = mapPinMain.offsetTop;
  var pins = [];

  var startCoords = new Coordinate(mapPinMain.offsetLeft, mapPinMain.offsetTop);

  if (!window.utils.isActive) {
    address.value = pointAxisX + ', ' + pointAxisY;
    window.utils.enumeratesArray(itemsAccessibilityControls);
    onTypeOfHousingChange();
  }

  window.backend.load(onSuccessHandler, onErrorHandler);

})();
