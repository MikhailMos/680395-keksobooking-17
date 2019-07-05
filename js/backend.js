'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking/data';
  var STATUS_OK = 200;
  var TIMEOUT_VALUE = 10000;

  var load = function (onSuccess, onError) {
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

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + TIMEOUT_VALUE + ' мс');
    });

    xhr.timeout = TIMEOUT_VALUE;

    xhr.open('GET', URL);
    xhr.send();
  };

  window.backend = {
    load: load
  };
})();
