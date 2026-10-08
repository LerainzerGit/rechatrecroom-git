const STORAGE_KEY = 'rechat-git-repos';

const newRepoBtn = document.getElementById('new-repo-btn');
const emptyNewBtn = document.getElementById('empty-new-btn');
const modal = document.getElementById('modal-new-repo');
const closeModalBtn = document.getElementById('close-modal');
const cancelBtn = document.getElementById('cancel-btn');
const createBtn = document.getElementById('create-btn');
const repoNameInput = document.getElementById('repo-name-input');
const repoDescInput = document.getElementById('repo-desc-input');
const repoPrivateCheck = document.getElementById('repo-private-check');
const reposList = document.getElementById('repos-list');
const repoView = document.getElementById('repo-view');
const emptyView = document.getElementById('empty-view');
const repoTitle = document.getElementById('repo-title');
const repoCard = document.getElementById('repo-card');
const stats = document.getElementById('stats');
const tree = document.getElementById('tree');
const commits = document.getElementById('commits');
const branchPill = document.getElementById('branch-pill');

let repositories = [];
let currentRepoId = null;

// Load repos from localStorage
function loadRepositories() {
  const stored = localStorage.getItem(STORAGE_KEY);
  repositories = stored ? JSON.parse(stored) : [];
  renderReposList();
}

// Save repos to localStorage
function saveRepositories() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(repositories));
}

// Render repos list in sidebar
function renderReposList() {
  if (repositories.length === 0) {
    reposList.innerHTML = '<div class="empty-state">No repositories yet</div>';
    return;
  }

  reposList.innerHTML = repositories
    .map((repo) => `
      <div class="repo-item ${currentRepoId === repo.id ? 'active' : ''}" data-id="${repo.id}">
        <div class="repo-item-name">${repo.name}</div>
        <div class="repo-item-desc">${repo.description || 'No description'}</div>
      </div>
    `)
    .join('');

  document.querySelectorAll('.repo-item').forEach((item) => {
    item.addEventListener('click', () => selectRepo(item.dataset.id));
  });
}

// Select a repo
function selectRepo(repoId) {
  currentRepoId = repoId;
  renderReposList();
  const repo = repositories.find((r) => r.id === repoId);
  if (repo) {
    displayRepo(repo);
  }
}

// Display repo details
function displayRepo(repo) {
  repoView.style.display = 'flex';
  emptyView.style.display = 'none';
  repoTitle.textContent = repo.name;
  branchPill.textContent = repo.branch || 'main';

  repoCard.innerHTML = `
    <div class="repo-name">${repo.name}</div>
    <div class="repo-desc">${repo.description || 'A ReChat project.'}</div>
  `;

  renderStats(repo);
  renderTree(repo);
  renderCommits(repo);
}

// Render stats
function renderStats(repo) {
  const items = [
    ['Created', new Date(repo.createdAt).toLocaleDateString()],
    ['Type', repo.private ? 'Private' : 'Public'],
    ['Branch', repo.branch || 'main'],
    ['Files', repo.files?.length || 0]
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

// Render file tree
function renderTree(repo) {
  if (!repo.files || repo.files.length === 0) {
    tree.innerHTML = '<div class="empty-state">No files in this repository</div>';
    return;
  }

  tree.innerHTML = repo.files
    .map((file) => `
      <div class="tree-row">
        <span class="tree-type">file</span>
        <span>${file}</span>
      </div>
    `)
    .join('');
}

// Render commits
function renderCommits(repo) {
  if (!repo.commits || repo.commits.length === 0) {
    commits.innerHTML = '<div class="empty-state">No commits yet</div>';
    return;
  }

  commits.innerHTML = repo.commits
    .map((commit) => `
      <div class="commit-item">
        <div class="commit-sha">${commit.sha.slice(0, 7)}</div>
        <div class="commit-copy">
          <div class="commit-msg">${commit.message}</div>
          <div class="commit-meta">${commit.author} • ${new Date(commit.date).toLocaleDateString()}</div>
        </div>
      </div>
    `)
    .join('');
}

// Show modal
function showModal() {
  modal.style.display = 'flex';
  repoNameInput.focus();
}

// Hide modal
function hideModal() {
  modal.style.display = 'none';
  repoNameInput.value = '';
  repoDescInput.value = '';
  repoPrivateCheck.checked = false;
}

// Create new repo
function createRepository() {
  const name = repoNameInput.value.trim();
  const desc = repoDescInput.value.trim();
  const isPrivate = repoPrivateCheck.checked;

  if (!name) {
    alert('Repository name is required');
    return;
  }

  const newRepo = {
    id: Date.now().toString(),
    name,
    description: desc,
    private: isPrivate,
    createdAt: new Date().toISOString(),
    branch: 'main',
    files: [],
    commits: [
      {
        sha: 'abc1234567890def',
        message: 'Initial commit',
        author: 'ReChat Dev',
        date: new Date().toISOString()
      }
    ]
  };

  repositories.push(newRepo);
  saveRepositories();
  renderReposList();
  hideModal();
  selectRepo(newRepo.id);
}

// Event listeners
newRepoBtn.addEventListener('click', showModal);
emptyNewBtn.addEventListener('click', showModal);
closeModalBtn.addEventListener('click', hideModal);
cancelBtn.addEventListener('click', hideModal);
createBtn.addEventListener('click', createRepository);

repoNameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') createRepository();
});

// Close modal on outside click
modal.addEventListener('click', (e) => {
  if (e.target === modal) hideModal();
});

// Initialize
loadRepositories();
if (repositories.length === 0) {
  emptyView.style.display = 'flex';
  repoView.style.display = 'none';
}
