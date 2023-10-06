import CheckText from './checkText';
import conversionSize from './conversionSize';

export default function addMessage(data, obj, el) {
  const chat = document.querySelector('.chat');
  const messageAll = chat.querySelectorAll('.message');
  const emojiContainer = document.querySelector('.emoji__container');
  let elements = 'connection';
  const checkText = new CheckText();
  let boxTextType = null;

  if (!emojiContainer.classList.contains('d__none')) {
    emojiContainer.classList.add('d__none');
  }

  if (messageAll.length >= 10 && obj == 'send') {
    chat.firstElementChild.remove();
  }

  if (!document.querySelector('.files__box').classList.contains('d__none')) {
    document.querySelector('.files__box').classList.add('d__none');
  }

  if (data.name !== undefined) {
    if (data.name === el) {
      data.name = 'you';
      elements = 'connection__you';
    }
  }

  switch (data.typesms) {
    case 'text':
      boxTextType = `<p class="message__text">${data.text}</p>`;
      break;
    case 'link':
      boxTextType = `<div class="message__text">${checkText.addLink(data.text)}</div>`;
      break;
    case 'code':
      boxTextType = `<div class="message__text">${checkText.addCode(data.text)}</div>`;
      break;
    case 'file':
      boxTextType = ` <div class="file__info">
                      <div class="file__img"></div>
                      <div class="message__info_file">
                        <a class="message__name" href="${data.url}" rel="noopener" download="${data.fileName}">${data.fileName}</a>
                        <div class="message__size">${conversionSize(data.fileSize)}</div>
                      </div>
                    </div>`;
      break;
    case 'image':
      boxTextType = `<img class="preview__image" src="${data.url}" alt="альтернативный текст">`;
      break;
    case 'audio':
      boxTextType = `
                      <audio class="audio" src="${data.url}" controls muted>
                     </audio>`;
      break;
    case 'video':
      boxTextType = ` 
                    <video class="video__message" src="${data.url}" controls muted preload="metadata" width="200"  height="200px">
                    </video>`;
      break;
    default:
      boxTextType = '';
      break;
  }
  const boxText = ` <article class="message message__${data.typesms} ${elements}" data-id="${data.dataId}">
                      <div class="message__info ">
                        <div class="message__user__name">${data.name} </div>
                        <div class="message__time">${data.datatime} </div>
                      </div>
                      ${boxTextType}
                    </article>
  `;

  if (boxText !== undefined && obj == 'send') {
    chat.insertAdjacentHTML('beforeend', boxText);
    chat.lastElementChild.scrollIntoView(false);
  }

  if (boxText !== undefined && obj == 'allsms') {
    chat.insertAdjacentHTML('afterbegin', boxText);
  }
}
