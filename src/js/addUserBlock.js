export default function addUserBlock(data, el) {
  const listUsers = document.querySelector('.list__users');
  if (data.name !== undefined) {
    if (data.name === el) {
      data.name = 'you';
    }

    const boxText = `
              <li class="user connection__user" data-id="${data.id}">
                  <p class="user__icon"></p>
                  <p class="user__name">${data.name}</p>
              </li>
      `;
    listUsers.insertAdjacentHTML('beforeend', boxText);
  }
}
