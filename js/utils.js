'use strict';

(function () {

  /**
   * Присваивает true/false для свойства элемента disabled
   *
   * @param {object} item - элемент
   */
  var getProperty = function (item) {
    item.disabled = window.utils.isActive !== true;
  };

  /**
   * Отлавнивает нажатие на кнопку Enter
   *
   * @param {object} evt
   * @param {function} action - импортируемая функция
   */
  var isEnterEvent = function (evt, action) {
    if (evt.keyCode === window.const.keyCode.ENTER) {
      action();
    }
  };

  /**
   * Отлавнивает нажатие на кнопку ESC
   *
   * @param {object} evt
   * @param {function} action - импортируемая функция
   */
  var isESCEvent = function (evt, action) {
    if (evt.keyCode === window.const.keyCode.ESC) {
      action();
    }
  };

  /**
   * Перебираем массив и устанавливаем значение свойству, каждого элемента
   *
   * @param {array} arr
   */
  var enumeratesArray = function (arr) {
    arr.forEach(getProperty);
  };

  var isActiveEnabled = function () {
    window.utils.isActive = true;
  };

  var isActiveDisabled = function () {
    window.utils.isActive = false;
  };

  var isActive = false;

  window.utils = {
    isActive: isActive,
    isActiveEnabled: isActiveEnabled,
    isActiveDisabled: isActiveDisabled,
    enumeratesArray: enumeratesArray,
    isEnterEvent: isEnterEvent,
    isESCEvent: isESCEvent
  };
})();
