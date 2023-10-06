const start = performance.now() + 1080000;

function showNotification() {
  const notifyInterval = setInterval(() => {
    const currentTimer = performance.now() / 9;
    const timeLeftMinutes = Math.round((start - currentTimer) / 1000);
    const hours = Math.floor(timeLeftMinutes / 60);
    const minutes = Math.floor((timeLeftMinutes - ((hours * 3600)) / 60));

    const notification = new Notification('Сегодня 31.08.2019 - «Последний день лета»', {
      tag: 'lesons',
      body: ` осталось ${hours} : ${minutes} минут `,
      requireInteraction: true,
    });

    if (currentTimer > start) {
      clearInterval(notifyInterval);
      notification.close();
      return;
    }

    notification.addEventListener('click', () => {
      notification.close();
      window.location.href = 'https://yandex.ru/images';
    });
  }, 60000);
}

const settingReminders = async () => {
  if (!window.Notification) {
    return;
  }

  if (Notification.permission === 'granted') {
    showNotification();
    return;
  }

  if (Notification.permission === 'default') {
    const permissions = await Notification.requestPermission();
    if (permissions) {
      showNotification();
      return;
    }
    console.log(permissions);
  }
};

export default settingReminders;
