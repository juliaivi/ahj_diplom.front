import Fetch from './components/requests/Fetch';
import addUserBlock from './components/authorization/addUserBlock';
import addMessage from './components/message/addMessage';
import CheckText from './components/message/checkText';
import LocationDefine from './components/geo/locationDefine/LocationDefine';
import creatBlokGeo from './components/geo/creatBlokGeo';
import settingReminders from './components/notification/showNotification';

export default class Chat {
  constructor() {
    // this.request = new Fetch('https://ahj-diplom-back-th6d.onrender.com/new-user');
    this.request = new Fetch('http://localhost:3000/new-user');
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

    this.fileInputAll.forEach((el) => {
      el.addEventListener('change', (e) => {
        this.clinMessage();
        this.file = el.files && el.files[0];
        if (!this.file) return;
        if (e.target.closest('.add__files__title') || e.target.closest('.add__photo__title')) {
          this.url = URL.createObjectURL(el.files && el.files[0]);
          this.creatMessageObj(this.file, this.text, this.userName, this.id, this.url, this.countmessages, this.link, this.typesms);
        }

        if (!this.message) return;
        this.ws.send(JSON.stringify(this.message));
      });
    });

    this.chat.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    this.chat.addEventListener('drop', (e) => this.addDrop(e));

    window.addEventListener('unload', () => {
      this.ws.send(JSON.stringify({ type: 'exit', name: this.userName, id: this.id }));
    });
  }

  addDrop(e) {
    e.preventDefault();
    this.clinMessage();
    this.countmessages += 1;
    if (e.target.closest('.message')) {
      return;
    }
    this.file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (!this.file) return;
    this.url = URL.createObjectURL(e.dataTransfer.files && e.dataTransfer.files[0]);
    this.creatMessageObj(this.file, this.text, this.userName, this.id, this.url, this.countmessages, this.link, this.typesms);

    if (!this.message) return;
    this.ws.send(JSON.stringify(this.message));
  }

  addSmile(e) {
    const simbol = e.target.textContent;
    const velueInput = this.inputFormChat.textContent.trim();
    this.inputFormChat.textContent = `${velueInput}  ${simbol}`;
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
    const eventChildren = e.target.children;
    const [firstChild] = e.target.children;
    const topCoordsChat = this.chat.getBoundingClientRect().top;
    const firstChildCoordsMessage = eventChildren[0].getBoundingClientRect();
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

              this.container.classList.remove('d__none');
              this.locationDefine.locate();
              if (this.locationDefine.latitude && this.locationDefine.longitude) {
                creatBlokGeo(this.locationDefine.latitude, this.locationDefine.longitude);
              } else if (this.popup.classList.contains('d__none') && this.locationDefine.geo) {
                this.popup.classList.remove('d__none');
              }
            }
            settingReminders();
            this.cameraListener();
            this.microphoneListener();

            if (status === 'error') {
              const errorName = this.loginForm.querySelector('.error__name');
              errorName.classList.remove('d__none');
            }
          });
      }
    }

    if (e.target.closest('.form__chat')) {
      const formChat = e.target.closest('.form__chat');
      const formChatInput = formChat.querySelector('.form__chat__input');
      const textFormChatInput = formChatInput.textContent.trim();
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
  }

  wsActive() {
    // this.ws = new WebSocket('wss://ahj-diplom-back-th6d.onrender.com/');
    this.ws = new WebSocket('ws://localhost:3000/ws');
    this.ws.addEventListener('open', () => {
    });

    this.ws.addEventListener('close', () => {
    });

    this.ws.addEventListener('message', (e) => {
      const data = JSON.parse(e.data);

      if (this.clickLink == true) {
        this.clickLink = false;
        return;
      }

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
    });

    this.ws.addEventListener('error', () => {
      throw new Error('ws error');
    });
  }

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

    if (e.target.closest('.message__text')) {
      this.clickLink = true;
    }
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

  recordListener(e) {
    if (!this.recorder || this.recorder.state === 'inactive') {
      if (e.target.classList.contains('video__record')) {
        this.typesms = 'video';
        this.addStream(this.typesms);
      } else {
        this.typesms = 'audio';
        this.addStream(this.typesms);
      }
    } else {
      this.recorder.stop();
      this.stream.getTracks().forEach((track) => track.stop());
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
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
    } else {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
    }
    this.recorder = new MediaRecorder(this.stream);
    this.chunks = [];

    this.recorder.addEventListener('start', () => {
      if (typesms == 'video') {
        this.startRecording(this.videoRecord, typesms);
      } else {
        this.startRecording(this.audioRecord, typesms);
      }
    });

    this.recorder.addEventListener('dataavailable', (e) => {
      this.chunks.push(e.data);
    });

    this.recorder.addEventListener('stop', async () => {
      if (typesms == 'video') {
        this.stopRecording(this.videoRecording, this.videoRecord, this.videoTimer);
      } else {
        this.stopRecording(this.audioRecording, this.audioRecord, this.audioTimer);
      }

      let blob;
      if (typesms == 'video') {
        blob = new Blob(this.chunks, { type: 'video/mp4' });
      } else {
        blob = new Blob(this.chunks, { type: 'audio/mp3;' });
      }
      this.url = URL.createObjectURL(blob);
      this.file = blob;
      this.countmessages += 1;
      this.creatMessageObj(this.file, this.text, this.userName, this.id, this.url, this.countmessages, this.link, this.typesms);

      if (!this.message) return;
      this.ws.send(JSON.stringify(this.message));
    });
    this.recorder.start();
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
}
