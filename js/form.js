'use strict';

(function () {

  var getMinValuePrice = function () {
    if (typeOfHousing.value === 'palace') {
      return 10000;
    } else if (typeOfHousing.value === 'house') {
      return 5000;
    } else if (typeOfHousing.value === 'flat') {
      return 1000;
    } else {
      return 0;
    }
  };

  // для присвоения для свойства disabled
  var adForm = document.querySelector('.ad-form');
  var adFormReset = adForm.querySelector('.ad-form__reset');
  var address = adForm.querySelector('#address');
  var typeOfHousing = adForm.querySelector('#type');
  var price = adForm.querySelector('#price');
  var fieldsetsAdForm = adForm.querySelectorAll('fieldset');

  window.form = {
    price: price,
    address: address,
    typeOfHousing: typeOfHousing,
    adFormReset: adFormReset,
    fieldsetsAdForm: fieldsetsAdForm,
    onTypeOfHousingChange: function () {
      price.min = getMinValuePrice();
      price.placeholder = String(price.min);
    }
  };

  if (!window.utils.isOpened) {
    // не активное состояние
    window.form.onTypeOfHousingChange();
    window.utils.enumeratesArray(fieldsetsAdForm);
  }

})();
