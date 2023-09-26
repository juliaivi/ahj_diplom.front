const start = performance.now() + 1080000;

function showNotification() {
  const notifyInterval = setInterval(() => {
    const currentTimer = performance.now() / 9;

    const timeLeftMinutes = Math.round((start - currentTimer) / 1000);
    // console.log(timeLeftMinutes);
    const hours = Math.floor(timeLeftMinutes / 60);
    const minutes = Math.floor((timeLeftMinutes - ((hours * 3600)) / 60));

    const notification = new Notification('Сегодня 31.08.2019 - «Последний день лета»', {
      tag: 'lesons', // обновлять информацию об уведомлении
      body: ` осталось ${hours} : ${minutes} минут `, // содержимое в уведомление в body
      // icon: './img/icon-eye.png',
      // image: './img/drYHcUDiiFU.jpg',
      requireInteraction: true, // явное скрытие уведомлений
    }); // для отображения уведомлений. Поумолчани уведомлления скрываются через некоторое время
    // взаимодействия пользователя с самим уведомлением
    if (currentTimer > start) {
      clearInterval(notifyInterval);
      notification.close();
      return;
    }

    notification.addEventListener('click', () => {
      console.log('click');
      notification.close();
      window.location.href = 'https://yandex.ru/images';
    });
  }, 60000);
}

const settingReminders = async () => {
  if (!window.Notification) { // если в объекте window нет Notification, сделать ничего нельзя(не поддерживается)
    return;
  }
  // запрос разрешение на уведомление
  if (Notification.permission === 'granted') { // разрешение получено
    showNotification();
    console.log('granted no query');
    return;
  }

  if (Notification.permission === 'default') { // разрешение еще не запрашивалось
    const permissions = await Notification.requestPermission(); // спросить разрешение
    if (permissions) {
      showNotification();
      console.log('granted after query');
      return;
    }
    console.log(permissions); // то что отдаст api
  }
};

export default settingReminders;
