import addUserBlock from './addUserBlock';
import addMessage from './addMessage';
// ДАННЫЙ ФАЙЛ НЕ ПОДКЛЮЧЕН. пОПЫТКА ВЫНЕСТИ WS В ОТДЕЛЬНЫЙ ФАЙЛ ЗАКОНЧИЛСЯ НЕУДАЧНО (СКОРЕЕ ВСЕГО ПРОСТО УДАЛЮ)
export default class WS {
  constructor(url) {
    this.ws = new WebSocket(url); // запрос не корня, а ручку ws
    this.listUsers = document.querySelector('.list__users');
  }

  init() {
    this.ws.addEventListener('open', () => {
      console.log('ws open');
    });

    this.ws.addEventListener('close', () => {
      console.log('ws close');
    });

    this.ws.addEventListener('message', (e) => this.wsMessage(e));

    this.ws.addEventListener('error', () => {
      console.log('ws error');
    });
  }

  wsMessage(e) { // отрисовка
    const data = JSON.parse(e.data);
    // console.log(data);
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
  }

  wsSend(message) { // отправка
    if (!message) return;
    this.ws.send(JSON.stringify(message));
  }
}
