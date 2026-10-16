console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Local server uses "/", GitHub Pages uses "/portfolio/"
const BASE_PATH =
  location.hostname === 'localhost' || location.hostname === '127.0.0.1'
    ? '/'
    : '/portfolio/';

let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'contact/', title: 'Contact' },
  { url: 'resume/', title: 'Resume' },
  { url: 'https://github.com/trkieu-commits', title: 'GitHub' },
];

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  // add BASE_PATH to internal links only
  url = !url.startsWith('http') ? BASE_PATH + url : url;

  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;

  // highlight the page you're on
  a.classList.toggle(
    'current',
    a.host === location.host && a.pathname === location.pathname,
  );

  // open external links in a new tab
  if (a.host !== location.host) {
    a.target = '_blank';
  }

  nav.append(a);
}

// ---------- Step 4.2: add the theme dropdown ----------
document.body.insertAdjacentHTML(
  'afterbegin',
  `
  <label class="color-scheme">
    Theme:
    <select>
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>`,
);

// 4.4
const select = document.querySelector('.color-scheme select');

function setColorScheme(colorScheme) {
  document.documentElement.style.setProperty('color-scheme', colorScheme);
  select.value = colorScheme; // keep the dropdown showing the right option
}

select.addEventListener('input', function (event) {
  console.log('color scheme changed to', event.target.value);
  setColorScheme(event.target.value);
  // 4.5
  localStorage.colorScheme = event.target.value;
});

// load the saved choice when the page opens
if ('colorScheme' in localStorage) {
  setColorScheme(localStorage.colorScheme);
}
