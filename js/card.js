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

  var getPhotos = function (card, offerPin) {
    var templatePhoto = card.querySelector('.popup__photo');
    var photos = card.querySelector('.popup__photos');

    if (!offerPin.photos.length) {
      photos.removeChild(templatePhoto);
      return;
    }

    offerPin.photos.forEach(function (item, i) {
      var cardElemPhoto = i ? templatePhoto.cloneNode(true) : templatePhoto;
      cardElemPhoto.src = item;

      if (i > 0) {
        photos.appendChild(cardElemPhoto);
      }
    });
  };

  var getEnds = function (item) {
    return item.className.slice(item.className.lastIndexOf('-') + 1);
  };

  var getFuteresEnds = function (cardFeatures) {
    var arrCardFeatures = Array.from(cardFeatures);
    return arrCardFeatures.map(getEnds);
  };

  var delNoHasFeatures = function (hasFeaturesEnds, offerPinFeatures, cardFeatures, parent) {
    hasFeaturesEnds.forEach(function (item, i) {
      if (offerPinFeatures.indexOf(item) === -1) {
        parent.removeChild(cardFeatures[i]);
      }
    });
  };

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
    var isPopup = document.querySelector('.map__card');

    if (isPopup) {
      document.querySelector('.map').removeChild(isPopup);
    }

    cardTitle.textContent = offerPin.title;
    cardTextAddress.textContent = offerPin.address;
    cardTextPrice.childNodes[0].textContent = String(offerPin.price) + '₽';
    cardHouseType.textContent = returnTextHousingType(offerPin.type);
    cardTextCapacity.textContent = offerPin.rooms + ' комнаты для ' + offerPin.guests + ' гостей';
    cardTextTime.textContent = 'Заезд после ' + offerPin.checkin + ', выезд до ' + offerPin.checkout;
    cardDescription.textContent = offerPin.description;
    cardAvatar.src = dataPin.author.avatar;
    getPhotos(card, offerPin);
    delNoHasFeatures(hasFeaturesEnds, offerPin.features, cardFeatures, cardFeaturesParent);

    mapPinsContainer.insertAdjacentElement('beforebegin', card);

    popupClose.addEventListener('click', onCardClick);
    document.addEventListener('keydown', onCardEscPress);
  };

  window.card = {
    renderCard: renderCard,
    housingType: housingType
  };

  var templateCard = document.querySelector('#card').content.querySelector('.map__card');
  var map = document.querySelector('.map');
  var mapPinsContainer = document.querySelector('.map__filters-container');
})();
