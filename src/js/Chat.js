import Fetch from './FetchUser';
import addUserBlock from './addUserBlock';
import addMessage from './addMessage';
import CheckText from './checkText';
import LocationDefine from './LocationDefine';
import creatBlokGeo from './creatBlokGeo';
import settingReminders from './settingReminders';

export default class Chat {
  constructor() {
    this.request = new Fetch('https://ahj-diplom-back-th6d.onrender.com/new-user');
    // this.request = new Fetch('http://localhost:3000/new-user');
    this.popup = document.querySelector('.popup');
    this.loginForm = document.querySelector('.login__form');
    this.popupForm = this.loginForm.querySelector('.popup__form');
    this.inputTitle = this.loginForm.querySelector('.input__title');
    this.container = document.querySelector('.container');
    this.listUsers = document.querySelector('.list__users');
    this.emojiContainer = document.querySelector('.emoji__container');
    this.filesBox = document.querySelector('.files__box');
    this.chatConteiner = document.querySelector('.chat__conteiner');
    this.formChat = this.chatConteiner.querySelector('.form');
    this.checkText = new CheckText();
    this.chat = document.querySelector('.chat');
    this.fileInputAll = this.filesBox.querySelectorAll('.overlapped');
    this.videoTimer = document.querySelector('.video__timer');
    this.audioTimer = document.querySelector('.audio__timer');
    this.videoRecording = document.querySelector('.video__recording');
    this.id = null;
    this.userName = null;
    this.link = null;
    this.typesms = null;
    this.countmessages = 0;
    this.oldElem = null;
    this.message = {};
    this.oldfirstChild = null;
    this.duration = 0;
    this.file = null;
    this.text = null;
    this.url = null;
    this.videoRecord = this.chatConteiner.querySelector('.video__record');
    this.audioRecording = document.querySelector('.audio__recording');
    this.audioRecord = this.audioRecording.querySelector('.audio__record');
    this.emoji = this.emojiContainer.querySelectorAll('.emoji');
    this.inputFormChat = this.formChat.querySelector('.form__chat__input');
    this.clickLink = false;
  }

  init() {
    this.emoji.forEach((el) => {
      el.addEventListener('click', (e) => this.addSmile(e));
    });

    this.inputFormChat.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.onSubmit(e);
      }
    });

    this.locationDefine = new LocationDefine();
    this.popupForm.addEventListener('submit', (e) => this.onSubmit(e));
    this.container.addEventListener('click', (e) => this.onClick(e));
    this.inputTitle.addEventListener('input', (event) => this.onChange(event));
    this.chat.addEventListener('scroll', (e) => this.onScroll(e));

    // ....... сохранение в истории изображений, видео и аудио (как файлов) через иконку загрузки

    this.fileInputAll.forEach((el) => {
      el.addEventListener('change', (e) => {
        this.clinMessage();
        this.file = el.files && el.files[0];
        if (!this.file) return;
        if (e.target.closest('.add__files__title') || e.target.closest('.add__photo__title')) {
          this.url = URL.createObjectURL(el.files && el.files[0]);
          this.creatMessageObj(this.file, this.text, this.userName, this.id, this.url, this.countmessages, this.link, this.typesms);
          // setTimeout(() => URL.revokeObjectURL(url), 1000); // отзовем юрл, когда браузер отобразит картинку и не сможем скачать ее((. В явном виде освобождаем место
        }

        if (!this.message) return;
        this.ws.send(JSON.stringify(this.message));
      });
    });
    // ...end.... сохранение в истории изображений, видео и аудио (как файлов) через иконку загрузки
    // .... Drag & Drop
    this.chat.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    this.chat.addEventListener('drop', (e) => this.addDrop(e));
    // .............end................... Drag & Drop
    window.addEventListener('unload', () => { // заменила beforeunload на unload unload – пользователь почти ушёл, но мы всё ещё можем запустить некоторые операции, например, отправить статистику
      this.ws.send(JSON.stringify({ type: 'exit', name: this.userName, id: this.id }));
    });
  }

  // .... Drag & Drop
  addDrop(e) {
    e.preventDefault();
    this.clinMessage();
    this.countmessages += 1;
    if (e.target.closest('.message')) { // по существующей картинке, чтоб она она не дублировалась в посте
      return;
    }
    this.file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (!this.file) return;
    this.url = URL.createObjectURL(e.dataTransfer.files && e.dataTransfer.files[0]);
    this.creatMessageObj(this.file, this.text, this.userName, this.id, this.url, this.countmessages, this.link, this.typesms);

    // setTimeout(() => URL.revokeObjectURL(url), 1000); // отзовем юрл, когда браузер отобразит картинку. В явном виде освобождаем место
    if (!this.message) return;
    this.ws.send(JSON.stringify(this.message));
  }

  addSmile(e) {
    const simbol = e.target.textContent;
    const velueInput = this.inputFormChat.textContent.trim();
    this.inputFormChat.textContent = `${velueInput}  ${simbol}`;
    console.log(this.inputFormChat.textContent);
  }

  clinMessage() {
    this.message = {};
    this.file = null;
    this.text = '';
    this.link = null;
    this.url = null;
    this.typesms = null;
  }

  creatMessageObj(file, text, userName, id, url, countmessages, link, typesms) {
    this.message.name = userName;
    this.message.dataId = countmessages;
    this.message.url = url;
    this.message.id = id;
    this.message.typesms = typesms;

    if (file !== null) {
      this.message.fileName = file.name;
      this.message.fileSize = file.size;
      if (file.type.includes('image')) {
        this.message.typesms = 'image';
      }
      if (file.type.includes('video')) {
        this.message.typesms = 'video';
      }

      if (file.type.includes('audio')) {
        this.message.typesms = 'audio';
      }

      if (file.type.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
        this.message.typesms = 'file';
      }
    } else {
      this.message.text = text;
    }
    if (link !== null) {
      this.message.link = link;
    }

    this.message.type = 'send';
    this.message.datatime = new Date().toLocaleTimeString([], { timeStyle: 'short' });
  }

  displayImageContent(e) {
    const previewImage = document.querySelectorAll('.preview__image');
    previewImage.src = e.target.result;
  }

  onScroll(e) {
    this.clinMessage();
    const eventChildren = e.target.children; // все сообщения
    const [firstChild] = e.target.children;// когда дойду до последнего (это будет первым сообщением)
    const topCoordsChat = this.chat.getBoundingClientRect().top; // координаты верхнего окна чата
    const firstChildCoordsMessage = eventChildren[0].getBoundingClientRect();// координаты первого сообщения
    let isVisible = false;

    if (firstChildCoordsMessage.bottom > topCoordsChat && this.oldElem < firstChildCoordsMessage.bottom && this.oldElem !== null) {
      isVisible = true;
    } else {
      isVisible = false;
    }

    if (this.oldElem == null) {
      this.oldElem = firstChildCoordsMessage.bottom;
    }

    if (isVisible) {
      this.oldfirstChild = firstChild;
      this.message.dataId = eventChildren[0].getAttribute('data-id');
      this.message.name = this.userName;
      this.message.type = 'sendAll';
      if (!this.message) return;
      this.ws.send(JSON.stringify(this.message));
      isVisible = false;
    }
  }

  onSubmit(e) {
    e.preventDefault();
    this.clinMessage();
    if (e.target.classList.contains('popup__form')) {
      const name = this.inputTitle.value.trim();
      if (name.length > 0) {
        this.request.add({ name })
          .then((el) => {
            const { status } = el;
            if (status === 'ok') {
              this.status = el.status;
              this.popup.classList.add('d__none');
              this.userName = el.user.name;
              this.id = el.user.id;
              this.data = el;
              this.wsActive();

              this.container.classList.remove('d__none'); // отображаем чат и участников
              this.locationDefine.locate();
              if (this.locationDefine.latitude && this.locationDefine.longitude) {
                creatBlokGeo(this.locationDefine.latitude, this.locationDefine.longitude);
              } else if (this.popup.classList.contains('d__none') && this.locationDefine.geo) {
                this.popup.classList.remove('d__none');
              }
            }
            // напоминание
            settingReminders();
            this.cameraListener();
            this.microphoneListener();

            if (status === 'error') { // такое имя есть
              const errorName = this.loginForm.querySelector('.error__name');
              errorName.classList.remove('d__none');
            }
          });
      }
    }

    // ......... обычные сообщения if (e.target.classList.contains('form__chat'))
    if (e.target.closest('.form__chat')) {
      const formChat = e.target.closest('.form__chat');
      const formChatInput = formChat.querySelector('.form__chat__input');
      const textFormChatInput = formChatInput.textContent.trim();
      // проверка текста на ссылку
      // ..........ссылки (http:// или https://) должны быть кликабельны и отображаться, как ссылки
      this.typesms = 'text';
      this.link = this.checkText.checkLink(textFormChatInput);
      const textCode = this.checkText.checkCode(textFormChatInput);

      if (textCode && textCode !== null) {
        this.typesms = 'code';
      }

      if (this.link !== null && this.link) {
        this.typesms = 'link';
      }

      if (textCode == null && this.link == null) {
        this.typesms = 'text';
      }

      if (!textFormChatInput) return;
      this.countmessages += 1;
      this.text = textFormChatInput;
      if (textCode) {
        this.text = textFormChatInput;
      }
      formChatInput.textContent = '';
      this.creatMessageObj(this.file, this.text, this.userName, this.id, this.url, this.countmessages, this.link, this.typesms);
      if (!this.message) return;
      this.ws.send(JSON.stringify(this.message));
    }
    // ....end......ссылки (http:// или https://) должны быть кликабельны и отображаться, как ссылки
  }

  // web socket ...... поток который паралельно работает и рассылает всем сообщения
  wsActive() {
    this.ws = new WebSocket('wss://ahj-diplom-back-th6d.onrender.com/');
    // this.ws = new WebSocket('ws://localhost:3000/ws'); // запрос не корня, а ручку ws
    this.ws.addEventListener('open', () => {
      console.log('ws open');
    });

    this.ws.addEventListener('close', () => {
      console.log('ws close');
    });

    this.ws.addEventListener('message', (e) => {
      const data = JSON.parse(e.data);
      // тут допиала
      if (this.clickLink == true) { // избавляет от ошибки при клике по ссылке
        this.clickLink = false;
        return;
      }
      // конец ...тут допиала
      // ошибка при перезагрузке
      if (data instanceof Array && data[0].name !== undefined) {
        this.listUsers.replaceChildren();
        data.forEach((el) => {
          addUserBlock(el, this.userName);
        });
      }

      if (data.type === 'allsms') {
        data.message.forEach((el) => {
          addMessage(el.message, data.type, this.userName);
        });
      }

      if (data.type === 'send') {
        addMessage(data, data.type, this.userName);
      }

      console.log('ws message');
    });

    this.ws.addEventListener('error', () => {
      console.log('ws error');
    });
  }
  // ....end...web socket

  // ....... закрытие открытие окон

  onClick(e) {
    const sectionListsFiles = document.querySelector('.section__lists__files');
    const dropDownMenu = document.querySelector('.drop-down__menu');

    if (e.target.closest('.form__chat__input')) {
      return;
    }
    if (e.target.closest('.section__menu')) {
      const sectionHeader = e.target.closest('.section__header');
      const sectionTitle = sectionHeader.querySelector('.section__title').textContent;
      if (sectionTitle == 'list of participants') {
        sectionHeader.querySelector('.section__title').textContent = 'Menu';
        this.listUsers.classList.add('d__none');
        sectionListsFiles.classList.remove('d__none');
      } else {
        sectionHeader.querySelector('.section__title').textContent = 'list of participants';
        this.listUsers.classList.remove('d__none');
        sectionListsFiles.classList.add('d__none');
      }
    }

    if (e.target.closest('.smile__icon')) {
      this.clickIcon(this.emojiContainer, this.filesBox);
    }

    if (e.target.closest('.clip__icon')) {
      this.clickIcon(this.filesBox, this.emojiContainer);
    }

    if (e.target.closest('.three__dots')) {
      dropDownMenu.classList.toggle('d__none');
    }

    if (e.target.closest('.btn__close')) {
      dropDownMenu.classList.add('d__none');
    }

    if (e.target.closest('.video__icon')) {
      if (!this.audioRecording.classList.contains('d__none')) {
        this.audioRecording.classList.add('d__none');
      }
      this.videoRecording.classList.toggle('d__none');
    }

    if (e.target.closest('.microphone__icon')) {
      if (!this.videoRecording.classList.contains('d__none')) {
        this.videoRecording.classList.add('d__none');
      }
      this.audioRecording.classList.toggle('d__none');
    }

    if (e.target.closest('.add__files')) {
      const addFiles = e.target.closest('.add__files');
      addFiles.querySelector('input').dispatchEvent(new MouseEvent('click'));
    }
    if (e.target.closest('.add__photo__title')) {
      const addPhotoTitle = e.target.closest('.add__photo__title');
      addPhotoTitle.querySelector('input').dispatchEvent(new MouseEvent('click'));
    }
    // тут допиала
    if (e.target.closest('.message__text')) {
      this.clickLink = true;
    }
    // конец тут допиала
  }

  onChange() {
    const errorName = this.loginForm.querySelector('.error__name');
    errorName.classList.add('d__none');
  }

  clickIcon(el, el2) {
    el.classList.toggle('d__none');
    if (!el2.classList.contains('d__none')) {
      el2.classList.add('d__none');
    }
  }

  // ....ВИДЕО И АУДИО
  recordListener(e) {
    if (!this.recorder || this.recorder.state === 'inactive') { // если рекордерпа нет или он не активный
      if (e.target.classList.contains('video__record')) {
        this.typesms = 'video';
        this.addStream(this.typesms);
      } else {
        this.typesms = 'audio';
        this.addStream(this.typesms);
      }
    } else {
      this.recorder.stop();// останавливаем запись
      this.stream.getTracks().forEach((track) => track.stop());// остановка потока. Получив всех треков
    }
  }

  cameraListener() {
    this.videoRecord.addEventListener('click', async (e) => this.recordListener(e));
  }

  microphoneListener() {
    this.audioRecord.addEventListener('click', (e) => this.recordListener(e));
  }

  addTimer(el) {
    this.timer = setInterval(() => {
      this.duration += 1;
      let min = Math.trunc(this.duration / 60);
      let sec = this.duration - 60 * min;
      if (min < 10) min = `0${min}`;
      if (sec < 10) sec = `0${sec}`;
      el.textContent = `${min}:${sec}`;
    }, 1000);
  }

  async addStream(typesms) {
    this.clinMessage();
    if (typesms == 'video') {
      this.stream = await navigator.mediaDevices.getUserMedia({ // указываем что хотим получить
        audio: true,
        video: true, // вернет промис, из-за этого завернуто в async
      });
    } else {
      this.stream = await navigator.mediaDevices.getUserMedia({ // указываем что хотим получить
        audio: true,
        video: false, // вернет промис, из-за этого завернуто в async
      });
    }
    this.recorder = new MediaRecorder(this.stream);// для проигрывание видео не сразу, а по нажатию кнопки
    this.chunks = []; // хранилище

    this.recorder.addEventListener('start', () => {
      if (typesms == 'video') {
        this.startRecording(this.videoRecord, typesms);
      } else {
        this.startRecording(this.audioRecord, typesms);
      }
    });

    this.recorder.addEventListener('dataavailable', (e) => { // получение данных
      this.chunks.push(e.data);
      // console.log('dataavailable');
    });

    this.recorder.addEventListener('stop', async () => { // будет доступен массив чанков, т.е. кусочки данных
      if (typesms == 'video') {
        this.stopRecording(this.videoRecording, this.videoRecord, this.videoTimer);
      } else {
        this.stopRecording(this.audioRecording, this.audioRecord, this.audioTimer);
      }

      // console.log('recording stopped');
      let blob;
      if (typesms == 'video') {
        blob = new Blob(this.chunks, { type: 'video/mp4' }); // целый файл в двоичном формате
      } else {
        blob = new Blob(this.chunks, { type: 'audio/mp3;' }); // целый файл в двоичном формате  { type: 'audio/webm' }); // присваеваем поток {type: 'audio/ogg; codecs=opus'} { type: 'audio/mp3;'}
      }
      this.url = URL.createObjectURL(blob); // присваеваем поток
      this.file = blob;
      this.countmessages += 1;
      this.creatMessageObj(this.file, this.text, this.userName, this.id, this.url, this.countmessages, this.link, this.typesms);

      if (!this.message) return;
      this.ws.send(JSON.stringify(this.message));
    });
    this.recorder.start();// запуск рекордера. Чтоб запись стартовала нужно вызвать явно
  }

  startRecording(el, typesms) {
    if (el.textContent == 'Запись') {
      if (typesms == 'video') {
        this.addTimer(this.videoTimer);
      } else {
        this.addTimer(this.audioTimer);
      }
      el.textContent = 'Остановка';
    }
    // console.log('recording started');
  }

  stopRecording(el, el2, timer) {
    if (!el.classList.contains('d__none')) {
      el.classList.add('d__none');
    }

    if (el2.textContent == 'Остановка') {
      el2.textContent = 'Запись';
      timer.textContent = '00:00';
      this.duration = 0;
      clearInterval(this.timer);
    }
  }
  // end....ВИДЕО И АУДИО
}
