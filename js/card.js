'use strict';

(function () {
  var returnTextHousingType = function (type) {
    switch (type) {
      case 'bungalo':
        return 'Бунгало';
      case 'flat':
        return 'Квартира';
      case 'house':
        return 'Дом';
      case 'palace':
        return 'Дворец';
      default:
        return 'Данные не прочитаны';
    }
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

  var getCard = function (dataPin) {
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
    var arrCardFeatures = Array.from(cardFeatures);
    var arrFeaturesEnds = arrCardFeatures.map(function (item) {
      return item.className.slice(item.className.lastIndexOf('-') + 1);
    });
    var cardDescription = card.querySelector('.popup__description');
    var cardAvatar = card.querySelector('.popup__avatar');
    var templatePhoto = card.querySelector('.popup__photo');
    var popupClose = card.querySelector('.popup__close');

    var fragment = document.createDocumentFragment();


    cardTitle.textContent = offerPin.title;
    cardTextAddress.textContent = offerPin.address;
    cardTextPrice.childNodes[0].textContent = String(offerPin.price) + '₽';
    cardHouseType.textContent = returnTextHousingType(offerPin.type);
    cardTextCapacity.textContent = offerPin.rooms + ' комнаты для ' + offerPin.guests + ' гостей';
    cardTextTime.textContent = 'Заезд после ' + offerPin.checkin + ', выезд до ' + offerPin.checkout;
    arrFeaturesEnds.forEach(function (item, i) {
      if (offerPin.features.indexOf(item) === -1) {
        cardFeaturesParent.removeChild(cardFeatures[i]);
      }
    });
    cardDescription.textContent = offerPin.description;
    if (offerPin.photos.length === 0) {
      card.querySelector('.popup__photos').removeChild(templatePhoto);
    } else {
      offerPin.photos.forEach(function (item, i) {
        if (i === 0) {
          templatePhoto.src = item;
        } else {
          var cardElemPhoto = templatePhoto.cloneNode(true);
          cardElemPhoto.src = item;
          fragment.appendChild(cardElemPhoto);
        }
      });
    }

    if (fragment) {
      card.querySelector('.popup__photos').appendChild(fragment);
    }
    cardAvatar.src = dataPin.author.avatar;

    mapPinsContainer.insertAdjacentElement('beforebegin', card);

    popupClose.addEventListener('click', onCardClick);
    document.addEventListener('keydown', onCardEscPress);
  };

  window.card = {
    getCard: getCard
  };

  var templateCard = document.querySelector('#card').content.querySelector('.map__card');
  var map = document.querySelector('.map');
  var mapPinsContainer = document.querySelector('.map__filters-container');
})();
