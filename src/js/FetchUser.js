export default class Fetch {
  constructor(server) {
    this.server = server;
  }

  async add(name) {
    // фетч возвращает промис, нужно ждать когда промис развизолвится
    const request = await fetch(this.server, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', //  чтоб на сервере распарсился объект, а не строка
      },

      // атрибут в который можно передавать различные типы данных (отправляем JSON)
      body: JSON.stringify(name),
    });
      // полученный результат получить данные так через async await либо через request.then()
    const result = await request;
    const json = await result.json();
    return json;
  }
}
