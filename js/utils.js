'use strict';

(function () {
  window.utils = {
    isOpened: false,
    getRandomInt: function (min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }
  };
})();
