'use strict';

(function () {

  /**
   * для присвоения для свойства disabled
   */
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
    fieldsetsAdForm: fieldsetsAdForm
  };

})();
