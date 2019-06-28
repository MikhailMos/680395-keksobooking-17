'use strict';

(function () {
  var ENTER_CODE = 13;

  var getProperty = function (item) {
    item.disabled = window.utils.isOpened !== true;
  };

  window.utils = {
    isOpened: false,

    getRandomInt: function (min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },

    enumeratesArray: function (arr) {
      arr.forEach(getProperty);
    },

    isEnterEvent: function (evt, action) {
      if (evt.keyCode === ENTER_CODE) {
        action();
      }
    }
  };
})();
