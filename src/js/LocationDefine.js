import dataPopup from './dataPopup';
import checkValueGeo from './checkValueGeo';
import creatBlokGeo from './creatBlokGeo';

export default class LocationDefine {
  constructor() {
    this.latitude = undefined;
    this.longitude = undefined;
    this.formInputValue = null;
    this.popupTitle = document.querySelector('.popup__title');
    this.popupDiscrition = document.querySelector('.popup__discription');
    this.popupBtns = document.querySelector('.popup__btns');
    this.geolocationPopup = document.querySelector('.geolocation__popup');
    this.popupInput = this.geolocationPopup.querySelector('.popup__input');
  }

  locate() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((data) => { // получаем широту и долготу
        this.latitude = data.coords.latitude;
        this.longitude = data.coords.longitude;
        this.geo = true;
        creatBlokGeo(this.latitude, this.longitude);
      }, (err) => {
        if (this.geolocationPopup.classList.contains('d__none')) {
          this.geolocationPopup.classList.remove('d__none');
        }
        this.popupBtns.addEventListener('click', (e) => this.onClick(e));
        console.log(err);
      });
    }
  }

  onClick(e) {
    e.preventDefault();
    console.log(this.popupInput);
    this.formInputValue = this.popupInput.value.trim();
    const inputValue = this.popupInput.value;
    const checkInputValue = checkValueGeo(inputValue);
    if (e.target.classList.contains('btn__ok') && this.formInputValue !== '') {
      this.checkOk(checkInputValue);
    }

    if (e.target.classList.contains('btn__cansel')) {
      this.geolocationPopup.classList.add('d__none');
      creatBlokGeo(this.latitude, this.longitude);
      this.popupTitle.textContent = dataPopup.errorCoords.text;
      this.popupDiscrition.textContent = dataPopup.errorCoords.discrition;
    }

    this.popupInput.value = '';
  }

  getCoords(value) {
    const arr = value
      .replace(/^\[/, '')
      .replace(/\]$/, '')
      .split(',');
    this.latitude = arr[0];
    this.longitude = arr[1];
  }

  checkOk(value) {
    if (value) {
      this.getCoords(this.popupInput.value);
      this.geolocationPopup.classList.add('d__none');
      if (this.formInputValue) {
        creatBlokGeo(this.latitude, this.longitude);
        this.latitude = null;
        this.longitude = null;
        this.popupTitle.textContent = dataPopup.errorCoords.text;
        this.popupDiscrition.textContent = dataPopup.errorCoords.discrition;
        if (!this.geolocationPopup.classList.contains('d__none')) {
          this.geolocationPopup.classList.add('d__none');
        }
      }
    } else {
      this.popupTitle.textContent = dataPopup.error.text;
      this.popupDiscrition.textContent = dataPopup.error.discrition;
    }
  }
}
