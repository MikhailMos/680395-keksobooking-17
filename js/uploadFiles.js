'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var DEFAULT_AVATAR_SRC = 'img/muffin-grey.svg';

  var uploadFile = function (fileChooser, preview) {
    var file = fileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (item) {
      return fileName.endsWith(item);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        preview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  };

  var uploadAvatar = function () {
    uploadFile(fileAvatarChooser, previewAvatar);
  };

  var uploadPhoto = function () {
    var templatePreviewFile = photoContainer.querySelector('.ad-form__photo');
    var previewFile = templatePreviewFile.childElementCount ? templatePreviewFile.cloneNode() : templatePreviewFile;
    var templateImg = document.createElement('img');

    templatePreviewFile.style = 'overflow: hidden;';
    templateImg.style = 'width: 100%; height: 100%';

    uploadFile(fileChooser, templateImg);

    if (!previewFile.parentNode) {
      photoContainer.appendChild(previewFile);
    }

    previewFile.appendChild(templateImg);
  };

  var reset = function () {
    var previewFiles = photoContainer.querySelectorAll('.ad-form__photo');

    previewAvatar.src = DEFAULT_AVATAR_SRC;

    previewFiles.forEach(function (item, i) {
      if (i === 0 && item.firstElementChild) {
        item.removeChild(item.firstElementChild);
      }

      if (i) {
        photoContainer.removeChild(item);
      }
    });
  };

  var avatarConteiner = document.querySelector('.ad-form-header__upload');
  var fileAvatarChooser = avatarConteiner.querySelector('.ad-form__field input[type=file]');
  var previewAvatar = avatarConteiner.querySelector('.ad-form-header__preview img');
  var photoContainer = document.querySelector('.ad-form__photo-container');
  var fileChooser = photoContainer.querySelector('.ad-form__upload input[type=file]');

  window.uploadFiles = {
    uploadAvatar: uploadAvatar,
    uploadPhoto: uploadPhoto,
    reset: reset
  };
})();
