export default function creatBlokGeo(latitude, longitude) {
  const sectionListsFiles = document.querySelector('.section__lists__files');
  let blockTitle = null;

  if (latitude == null && longitude == null) {
    blockTitle = '<h4 class="location__header">Ваше место расположение неопределено!</h4>';
  } else {
    blockTitle = `<h4 class="location__header">Ваше место расположение</h4>
                  <span class="location__title">[${latitude}, ${longitude}]</span>`;
  }

  const boxText = `
                    <div class="location">
                      <div class="location__user">${blockTitle}</div>
                    </div>
    `;

  sectionListsFiles.insertAdjacentHTML('beforeend', boxText);
}
