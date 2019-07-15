'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking';
  var STATUS_OK = 200;
  var TIMEOUT_VALUE = 10000;

  /**
   * Возвращает объект к дальнейшему запросу к серверу
   *
   * @param {object} onSuccess - функция onSuccessHandler (при загрузке), onSaveHandler (при отправке)
   * @param {string} onError - функция onErrorHandler
   * @return {object}
   */
  var getXhr = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS_OK) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Статус ответа: ошибка соединения');
    });

    return xhr;
  };

  /**
   * Загружает данные с сервера
   *
   * @param {object} onSuccess - функция onSuccessHandler
   * @param {string} onError - функция onErrorHandler
   */
  var load = function (onSuccess, onError) {
    var xhr = getXhr(onSuccess, onError);

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + TIMEOUT_VALUE + ' мс');
    });

    xhr.timeout = TIMEOUT_VALUE;

    xhr.open('GET', URL + '/data');
    xhr.send();
  };

  /**
   * Отправляет данные формы на сервер
   *
   * @param {object} data - заполненная форма для отправки на сервер
   * @param {object} onSuccess - функция onSaveHandler
   * @param {string} onError - функция onErrorHandler
   */
  var upload = function (data, onSuccess, onError) {
    var xhr = getXhr(onSuccess, onError);

    xhr.open('POST', URL);
    xhr.send(data);
  };

  window.backend = {
    load: load,
    upload: upload
  };
})();
