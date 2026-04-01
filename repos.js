const form = document.getElementById('repo-form');
const list = document.getElementById('repo-list');
const statusEl = document.getElementById('status');

const animateVisible = () => {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
};
animateVisible();

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const username = form.username.value.trim();

  if (!username) {
    statusEl.textContent = 'Please enter a GitHub username.';
    return;
  }

  list.innerHTML = '';
  statusEl.textContent = 'Loading repositories...';

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);

    if (!response.ok) {
      throw new Error('Unable to fetch repositories. Check username or rate limit.');
    }

    const repos = await response.json();

    if (!repos.length) {
      statusEl.textContent = 'No public repositories found.';
      return;
    }

    statusEl.textContent = `Showing ${repos.length} repositories for @${username}.`;

    repos.forEach(repo => {
      const card = document.createElement('article');
      card.className = 'project-card glass';
      card.innerHTML = `
        <h3>${repo.name}</h3>
        <p>${repo.description || 'No description provided.'}</p>
        <p class="muted">★ ${repo.stargazers_count} • Updated ${formatDate(repo.updated_at)}</p>
        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">Open Repository →</a>
      `;
      list.appendChild(card);
    });
  } catch (error) {
    statusEl.textContent = error.message;
  }
});
