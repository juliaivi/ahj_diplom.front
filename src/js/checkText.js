export default class CheckText {
  constructor() {
    // eslint-disable-next-line
    this.urlRegex = /(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    // eslint-disable-next-line
    this.codeRegex = /(\`{3}(\n?(.*)\n?[^`]+)\`{3})/gi;
  }

  checkLink(value) {
    return value.match(this.urlRegex) !== null;
  }

  checkCode(value) {
    return value.match(this.codeRegex) !== null;
  }

  addLink(text) {
    return text.replace(this.urlRegex, (url) => `<a href="${url}">${url}</a>`);
  }

  addCode(text) {
    return text.replace(this.codeRegex, (code) => `<code class="code"><br>${code.match(/[^\n]+/g).join('<br>').replace(/```/gi, '')}</code>`);
  }
}
