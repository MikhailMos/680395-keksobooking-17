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
      onResetClick();
      showSuccess();
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
  };

  /** Выводит сообщение об успешной отправке */
  var showSuccess = function () {
    var templateBlockSuccess = document.querySelector('#success').content.querySelector('.success');
    var blockSuccess = templateBlockSuccess.cloneNode(true);

    document.querySelector('main').appendChild(blockSuccess);

    document.querySelector('.success').addEventListener('click', onBlockSuccessClick);
    document.addEventListener('keydown', onSuccessESCKeydown);
  };

  /**
   * Проверяет нажатие на кнопку ESC, когда блок .success показан
   *
   * @param {object} evt
   */
  var onSuccessESCKeydown = function (evt) {
    window.utils.isESCEvent(evt, onBlockSuccessClick);
  };

  /** Удаляте блолк .success и убирает события связанные с ним */
  var onBlockSuccessClick = function () {
    var block = document.querySelector('.success');

    block.removeEventListener('click', onBlockSuccessClick);
    document.removeEventListener('keydown', onSuccessESCKeydown);

    block.remove();
  };

  /**
   * Проверяет нажатие на кнопку ESC, когда блок .error показан
   *
   * @param {object} evt
   */
  var onErrorESCKeydown = function (evt) {
    window.utils.isESCEvent(evt, onErrorClick);
  };

  /** Удаляет блок .error и убирает события связанные с ним */
  var onErrorClick = function () {
    var blockError = document.querySelector('.error');
    var btnError = document.querySelector('.error__button');

    document.removeEventListener('keydown', onErrorESCKeydown);
    blockError.removeEventListener('click', onErrorClick);
    btnError.removeEventListener('click', onErrorClick);

    blockError.remove();
  };

  /** Добавляет события для блока error */
  var addEventErrorHandler = function () {
    var btnError = document.querySelector('.error__button');
    document.querySelector('.error').addEventListener('click', onErrorClick);
    btnError.addEventListener('click', onErrorClick);
    document.addEventListener('keydown', onErrorESCKeydown);
  };

  /**
   * Выводит сообщение об ошибке
   *
   * @param {string} messageError - текст дополнительного сообщения
   */
  var onErrorHandler = function (messageError) {
    var fragment = document.createDocumentFragment();
    var templateError = document.querySelector('#error').content.querySelector('.error');
    var blockError = templateError.cloneNode(true);
    var blockErrorMessage = blockError.querySelector('.error__message');

    var brElem = document.createElement('br');
    var spanElem = document.createElement('span');

    spanElem.textContent = messageError;
    spanElem.style.fontSize = '30px';
    spanElem.style.fontWeight = '500';

    blockErrorMessage.insertAdjacentElement('beforeEnd', brElem);
    blockErrorMessage.insertAdjacentElement('beforeEnd', spanElem);

    fragment.appendChild(blockError);
    document.querySelector('main').appendChild(fragment);
    addEventErrorHandler();
  };

  /**
   * Фильтрует список данных
   *
   */
  var onFilterChange = function () {
    var sortPins = sortingPins(pins.slice());

    window.debounce(function () {
      window.renderPin(sortPins);
    });
  };

  /**
   * Фильтрует массив, согласно выбранных фильтров
   *
   * @param {array} copyPins - массив для сортировки
   * @return {array}
   */
  var sortingPins = function (copyPins) {
    return copyPins.filter(function (item) {
      var resType = filterHousingType.value === 'any' ? true : (item.offer.type === filterHousingType.value);
      var resPrice = getPrice(item.offer.price);
      var resRoom = filterHousingRooms.value === 'any' ? true : (item.offer.rooms === parseInt(filterHousingRooms.value, 10));
      var resGuests = filterHousingGuests.value === 'any' ? true : (item.offer.guests === parseInt(filterHousingGuests.value, 10));
      getFilterFeatures(item.offer.features);

      return resType && resPrice && resRoom && resGuests
        && resFilterFeatures.wifi && resFilterFeatures.dishwasher
        && resFilterFeatures.parging && resFilterFeatures.washer
        && resFilterFeatures.elevator && resFilterFeatures.conditioner;
    });
  };

  /**
   * Возвращает сравнение цены, попадает ли цена в выбранный фильтр
   *
   * @param {number} item - стоимость
   * @return {boolean}
   */
  var getPrice = function (item) {
    if (filterHousingPrice.value === 'any') {
      return true;
    } else if (filterHousingPrice.value === 'low') {
      return item < 10000;
    } else if (filterHousingPrice.value === 'middle') {
      return item >= 10000 && item < 50000;
    } else {
      return item >= 50000;
    }
  };

  /**
   * Проверяет и устанавливает значение фильтра (true/false),
   * в зависимости от содержания функций в пине
   *
   * @param {array} dataPinFeatures - массив функций пина
   */
  var getFilterFeatures = function (dataPinFeatures) {
    inputsFeaturesFilter.forEach(function (item) {
      if (item.checked) {
        resFilterFeatures[item.value] = (dataPinFeatures.indexOf(item.value) === -1) ? false : true;
      } else {
        resFilterFeatures[item.value] = true;
      }
    });
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
    allFilterFields.forEach(function (item) {
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
    allFilterFields.forEach(function (item) {
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
      if (!pins.length) {
        window.backend.load(onSuccessHandler, onErrorHandler);
        return;
      }

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
      document.addEventListener('mouseup', onMouseUp);
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
    document.removeEventListener('mouseup', onMouseUp);
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

  /** Сброс значений в разделе Устройства */
  var resetFeatures = function () {
    var inputsFeaturesChecked = adForm.querySelectorAll('input[type=checkbox]:checked');

    inputsFeaturesChecked.forEach(function (it) {
      it.checked = false;
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
      timein.selectedIndex = defaultIndexTimein;
      timeout.selectedIndex = defaultIndexTimeout;
      roomNumber.selectedIndex = defaultIndexRoomNumber;
      address.value = (mapPinMain.offsetLeft) + ', ' + (mapPinMain.offsetTop);
      resetFeatures();
      window.utils.enumeratesArray(itemsAccessibilityControls);
      window.utils.isActiveDisabled();
      adForm.classList.add('ad-form--disabled');
      document.querySelector('.map').classList.add('map--faded');

      onTypeOfHousingChange();
      removeEventListenerFunctions();
      adForm.removeEventListener('submit', saveToServer);
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
  var selectsMapFilters = mapFilters.querySelectorAll('.map__filter');
  var fieldsetsMapFilters = mapFilters.querySelector('.map__features');
  var inputsFeaturesFilter = mapFilters.querySelectorAll('.map__checkbox');
  var allFilterFields = Array.from(selectsMapFilters).concat(Array.from(inputsFeaturesFilter));

  var filterHousingType = mapFilters.querySelector('#housing-type');
  var filterHousingPrice = mapFilters.querySelector('#housing-price');
  var filterHousingRooms = mapFilters.querySelector('#housing-rooms');
  var filterHousingGuests = mapFilters.querySelector('#housing-guests');
  var resFilterFeatures = {
    wifi: true,
    dishwasher: true,
    parging: true,
    washer: true,
    elevator: true,
    conditioner: true
  };
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
  var defaultIndexTimein = timein.selectedIndex;
  var defaultIndexTimeout = timeout.selectedIndex;
  var pointAxisX = mapPinMain.offsetLeft;
  var pointAxisY = mapPinMain.offsetTop;
  var pins = [];

  var startCoords = new Coordinate(mapPinMain.offsetLeft, mapPinMain.offsetTop);

  if (!window.utils.isActive) {
    address.value = pointAxisX + ', ' + pointAxisY;
    window.utils.enumeratesArray(itemsAccessibilityControls);
    onTypeOfHousingChange();
  }

  mapPinMain.addEventListener('mousedown', onMapPinMainMousedown);
  window.backend.load(onSuccessHandler, onErrorHandler);

})();
