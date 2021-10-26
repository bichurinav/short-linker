const $form = document.querySelector('#form');
const $createdLink = document.querySelector('.link');
const $loader = document.querySelector('#loader');
$form.addEventListener('submit', (e) => {
  e.preventDefault();
  const link = e.target.elements['link'];
  if (!link.value) return;
  if (!/^htt(p|ps):\/\/(.+)\.(.+)$/.test(link.value)) {
    link.value = '';
    return alert('Некорректная ссылка!');
  }

  $createdLink.className = 'link';
  $createdLink.textContent = '';
  $createdLink.setAttribute('href', '/');
  $loader.style.display = 'block';

  const req = fetch('/link', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ href: link.value }),
  });

  req
    .then((res) => res.json())
    .then((res) => {
      setTimeout(() => {
        if (res.ok) {
          link.value = '';
          $createdLink.setAttribute('href', res.data.href);
          $createdLink.textContent = res.data.hrefShort;
          $createdLink.classList.add('active');
          $loader.style.display = 'none';
        } else {
          link.value = '';
          alert('Произошла ошибка #_#');
        }
      }, 800);
    })
    .catch((err) => {
      console.error(err);
    });
});
