export default class Fetch {
  constructor(server) {
    this.server = server;
  }

  async add(name) {
    const request = await fetch(this.server, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(name),
    });

    const result = await request;
    const json = await result.json();
    return json;
  }
}
