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
   * Отлавнивает нажатие на кнопку энтер
   * ф-я экспортная
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
   * Перебираем массив и устанавливаем значение свойству, каждого элемента
   * ф-я экспортная
   *
   * @param {array} arr
   */
  var enumeratesArray = function (arr) {
    arr.forEach(getProperty);
  };

  /**
   * Получаем случайное целое число
   * ф-я экспортная
   *
   * @param {number} min - начальное значение
   * @param {number} max - конечное значение
   * @return {number}
   */
  var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
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
    getRandomInt: getRandomInt,
    enumeratesArray: enumeratesArray,
    isEnterEvent: isEnterEvent
  };
})();
