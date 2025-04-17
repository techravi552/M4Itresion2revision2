// Theme toggle functionality
const themeToggleBtn = document.getElementById('themeToggle');
const body = document.body;

// Apply saved theme on load
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark');
  }
});

// Toggle and save theme
themeToggleBtn.addEventListener('click', () => {
  body.classList.toggle('dark');
  const theme = body.classList.contains('dark') ? 'dark' : 'light';
  localStorage.setItem('theme', theme);
});

// Fetch data and display
document.getElementById('fetchBtn').addEventListener('click', async () => {
  const dataList = document.getElementById('dataList');
  dataList.innerHTML = '<li>Loading...</li>';

  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await res.json();

    dataList.innerHTML = ''; // Clear loading
    data.slice(0, 5).forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.title}`;
      dataList.appendChild(li);
    });
  } catch (err) {
    dataList.innerHTML = '<li>Error fetching data.</li>';
  }
});
