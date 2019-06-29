'use strict';

(function () {
  // var ENTER_CODE = 13;

  /**
   * Присваивает true/false для свойства элемента disabled
   *
   * @param {object} item - элемент
   */
  var getProperty = function (item) {
    item.disabled = window.utils.isActive !== true;
  };

  window.utils = {
    isActive: false,

    /**
     * Получаем случайное целое число
     * ф-я экспортная
     *
     * @param {number} min - начальное значение
     * @param {number} max - конечное значение
     * @return {number}
     */
    getRandomInt: function (min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },

    /**
     * Перебираем массив и устанавливаем значение свойству, каждого элемента
     * ф-я экспортная
     *
     * @param {*} arr
     */
    enumeratesArray: function (arr) {
      arr.forEach(getProperty);
    },

    /**
     * Отлавнивает нажатие на кнопку энтер
     * ф-я экспортная
     *
     * @param {object} evt
     * @param {function} action - импортируемая функция
     */
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === window.const.ENTER_CODE) {
        action();
      }
    }
  };
})();
