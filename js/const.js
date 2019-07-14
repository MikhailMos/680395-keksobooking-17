'use strict';

(function () {
  var keyCode = {
    ENTER: 13,
    ESC: 27
  };

  var mapPin = {
    HALF_WIDTH: 25,
    HEIGHT: 70
  };

  var mainPin = {
    HALF_WIDTH: 32,
    HEIGHT: 80
  };

  var mapRestriction = {
    Y_MIN: 130,
    Y_MAX: 630
  };

  window.const = {
    keyCode: keyCode,
    mapRestriction: mapRestriction,
    mainPin: mainPin,
    mapPin: mapPin,
    ARR_LENGTH: 8
  };
})();
