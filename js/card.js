'use strict';

(function () {
  var housingType = {
    bungalo: {
      name: 'Бунгало',
      price: 0
    },
    flat: {
      name: 'Квартира',
      price: 1000
    },
    house: {
      name: 'Дом',
      price: 5000
    },
    palace: {
      name: 'Дворец',
      price: 10000
    }
  };

  /**
   * Возвращает название типа жилья
   * @param {string} type - название типа
   * @return {string}
   */
  var returnTextHousingType = function (type) {
    return housingType[type].name;
  };

  var onCardClick = function () {
    var card = map.querySelector('.map__card');
    var popupClose = card.querySelector('.popup__close');
    map.removeChild(card);
    popupClose.addEventListener('click', onCardClick);
  };

  var onCardEscPress = function (evt) {
    if (evt.keyCode === window.const.keyCode.ESC) {
      onCardClick();
      document.removeEventListener('keydown', onCardEscPress);
    }
  };

  /**
   * Добавляет фотографии в карточку
   * @param {element} card - шаблон модального окна с информацией об объявлении
   * @param {array} offerPinPhotos - массив с сылками на фотографиями
   */
  var getPhotos = function (card, offerPinPhotos) {
    var templatePhoto = card.querySelector('.popup__photo');
    var photos = card.querySelector('.popup__photos');

    if (!offerPinPhotos.length) {
      photos.removeChild(templatePhoto);
      return;
    }

    offerPinPhotos.forEach(function (item, i) {
      var cardElemPhoto = i ? templatePhoto.cloneNode(true) : templatePhoto;
      cardElemPhoto.src = item;

      if (i > 0) {
        photos.appendChild(cardElemPhoto);
      }
    });
  };

  /**
   * возвращает модификатор из наименования класса
   *
   * @param {element} item - текущий элемент
   * @return {string}
   */
  var getEnds = function (item) {
    return item.className.slice(item.className.lastIndexOf('-') + 1);
  };

  var getFuteresEnds = function (cardFeatures) {
    var arrCardFeatures = Array.from(cardFeatures);
    return arrCardFeatures.map(getEnds);
  };

  /**
   * Удаляет функции из разметки шаблона модального окна с информацией об объявлении
   *
   * @param {array} hasFeaturesEnds - массив строк с модификаторами классов модального окна
   * @param {array} offerPinFeatures - массив строк с имеющимися функциями
   * @param {array} cardFeatures - псевдо массив с элементами разметки функций
   * @param {element} parent - родительский элемент
   */
  var delNoHasFeatures = function (hasFeaturesEnds, offerPinFeatures, cardFeatures, parent) {
    hasFeaturesEnds.forEach(function (item, i) {
      if (offerPinFeatures.indexOf(item) === -1) {
        parent.removeChild(cardFeatures[i]);
      }
    });
  };

  /**
   * Удаляет показанную карточку объявления
   */
  var removeCard = function () {
    var isPopup = document.querySelector('.map__card');

    if (isPopup) {
      document.querySelector('.map').removeChild(isPopup);
    }
  };

  /**
   * Отрисовывает модальное окно с информации об объявлении
   * @param {object} dataPin - данные об объявлении
   */
  var renderCard = function (dataPin) {
    var offerPin = dataPin.offer;
    var card = templateCard.cloneNode(true);
    var cardTitle = card.querySelector('.popup__title');
    var cardTextAddress = card.querySelector('.popup__text--address');
    var cardTextPrice = card.querySelector('.popup__text--price');
    var cardHouseType = card.querySelector('.popup__type');
    var cardTextCapacity = card.querySelector('.popup__text--capacity');
    var cardTextTime = card.querySelector('.popup__text--time');
    var cardFeaturesParent = card.querySelector('.popup__features');
    var cardFeatures = card.querySelectorAll('.popup__feature');
    var hasFeaturesEnds = getFuteresEnds(cardFeatures);
    var cardDescription = card.querySelector('.popup__description');
    var cardAvatar = card.querySelector('.popup__avatar');
    var popupClose = card.querySelector('.popup__close');

    removeCard();

    cardTitle.textContent = offerPin.title;
    cardTextAddress.textContent = offerPin.address;
    cardTextPrice.childNodes[0].textContent = String(offerPin.price) + '₽';
    cardHouseType.textContent = returnTextHousingType(offerPin.type);
    cardTextCapacity.textContent = offerPin.rooms + ' комнаты для ' + offerPin.guests + ' гостей';
    cardTextTime.textContent = 'Заезд после ' + offerPin.checkin + ', выезд до ' + offerPin.checkout;
    cardDescription.textContent = offerPin.description;
    cardAvatar.src = dataPin.author.avatar;
    getPhotos(card, offerPin.photos);
    delNoHasFeatures(hasFeaturesEnds, offerPin.features, cardFeatures, cardFeaturesParent);

    mapPinsContainer.insertAdjacentElement('beforebegin', card);

    popupClose.addEventListener('click', onCardClick);
    document.addEventListener('keydown', onCardEscPress);
  };

  window.card = {
    renderCard: renderCard,
    removeCard: removeCard,
    housingType: housingType
  };

  var templateCard = document.querySelector('#card').content.querySelector('.map__card');
  var map = document.querySelector('.map');
  var mapPinsContainer = document.querySelector('.map__filters-container');
})();
