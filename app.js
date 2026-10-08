const DEFAULT_REPO = 'LerainzerGit/rechatrecroom-git';

const repoInput = document.getElementById('repo-input');
const loadBtn = document.getElementById('load-btn');
const repoCard = document.getElementById('repo-card');
const stats = document.getElementById('stats');
const tree = document.getElementById('tree');
const commits = document.getElementById('commits');
const branchPill = document.getElementById('branch-pill');
const repoLink = document.getElementById('repo-link');

function setLoadingState() {
  repoCard.innerHTML = `
    <div class="repo-name loading">Loading…</div>
    <div class="repo-desc loading">Loading repo metadata…</div>
  `;
  tree.innerHTML = '<div class="empty-state">Loading repository tree…</div>';
  commits.innerHTML = '<div class="empty-state">Loading recent commits…</div>';
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { Accept: 'application/vnd.github+json' }
  });

  if (!res.ok) {
    throw new Error(`GitHub API request failed (${res.status})`);
  }

  return res.json();
}

function renderStats(repo) {
  const items = [
    ['Stars', repo.stargazers_count ?? 0],
    ['Forks', repo.forks_count ?? 0],
    ['Watchers', repo.subscribers_count ?? 0],
    ['Open PRs', repo.open_issues_count ?? 0]
  ];

  stats.innerHTML = items
    .map(([label, value]) => `
      <div class="stat-item">
        <span>${label}</span>
        <strong>${value}</strong>
      </div>
    `)
    .join('');
}

function renderTree(items) {
  const topLevel = items.filter((item) => item.type === 'dir' || item.type === 'file');

  if (!topLevel.length) {
    tree.innerHTML = '<div class="empty-state">No files found.</div>';
    return;
  }

  tree.innerHTML = topLevel
    .map((item) => `
      <div class="tree-row ${item.type}">
        <span class="tree-type">${item.type === 'dir' ? 'dir' : 'file'}</span>
        <span>${item.name}</span>
      </div>
    `)
    .join('');
}

function renderCommits(items) {
  if (!items.length) {
    commits.innerHTML = '<div class="empty-state">No recent commits.</div>';
    return;
  }

  commits.innerHTML = items.map((commit) => {
    const date = new Date(commit.commit.author.date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    return `
      <div class="commit-item">
        <div class="commit-sha">${commit.sha.slice(0, 7)}</div>
        <div class="commit-copy">
          <div class="commit-msg">${commit.commit.message.split('\n')[0]}</div>
          <div class=\"commit-meta\">${commit.commit.author.name} • ${date}</div>
        </div>
      </div>
    `;
  }).join('');
}

async function loadRepo(repoName) {
  try {
    setLoadingState();

    const repo = await fetchJson(`https://api.github.com/repos/${repoName}`);
    const contents = await fetchJson(`https://api.github.com/repos/${repoName}/contents`);
    const commitsData = await fetchJson(`https://api.github.com/repos/${repoName}/commits?per_page=5`);

    repoInput.value = repoName;
    repoCard.innerHTML = `
      <div class="repo-name">${repo.full_name}</div>
      <div class="repo-desc">${repo.description || 'A ReChat project repository.'}</div>
    `;

    branchPill.textContent = repo.default_branch || 'main';
    repoLink.href = repo.html_url;
    renderStats(repo);
    renderTree(contents);
    renderCommits(commitsData);
  } catch (error) {
    repoCard.innerHTML = `
      <div class="repo-name error">Unavailable</div>
      <div class="repo-desc">${error.message}</div>
    `;
    tree.innerHTML = '<div class="empty-state">Could not load repository tree.</div>';
    commits.innerHTML = '<div class="empty-state">Could not load recent commits.</div>';
  }
}

loadBtn.addEventListener('click', () => {
  const repo = repoInput.value.trim();
  if (repo) {
    loadRepo(repo);
  }
});

repoInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const repo = repoInput.value.trim();
    if (repo) {
      loadRepo(repo);
    }
  }
});

loadRepo(DEFAULT_REPO);
