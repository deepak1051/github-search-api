const input = document.querySelector('.input');
const avatar = document.querySelector('.avatar');
const username = document.querySelector('.username');
const bio = document.querySelector('.bio');
const loc = document.querySelector('.location');
const twitter = document.querySelector('.twitter');
const profileLink = document.querySelector('.profile-link');
const followers = document.querySelector('.followers');
const following = document.querySelector('.following');
const mainContent = document.querySelector('.main-content');
const loader = document.querySelector('.loader');
const repos = document.querySelector('.repos');
const repoPerPage = document.querySelector('.repo-per-page');
const numbers = document.querySelector('.numbers');
const older = document.querySelector('.older');
const newer = document.querySelector('.newer');
const publicRepoCount = document.querySelector('.public_repo_count');
const queryTermEl = document.querySelector('.query-term');
const dropdown = document.querySelector('.dropdown');

let timer;

let fetchDataResult = [];
let allRepoData = [];
let queryTerm = '';
let allFilterData = [];

let repoUrl = '';
let page = 1;
let repo_per_page = 10;

queryTermEl.addEventListener('input', (e) => {
  queryTerm = e.target.value;
  allFilterData = allRepoData.filter((r) =>
    r.name.toLowerCase().includes(queryTerm.toLowerCase())
  );
  repos.textContent = '';

  repoUi(allFilterData);

  if (e.target.value.trim()) {
    dropdown.classList.add('hidden');
    numbers.classList.add('hidden');
  } else {
    dropdown.classList.remove('hidden');
    numbers.classList.remove('hidden');
    repos.textContent = '';
    fetchRepo(repoUrl, page, repo_per_page);
  }

  console.log(allFilterData);
});

input.addEventListener('input', (e) => {
  clearTimeout(timer);

  timer = setTimeout(() => {
    fetchData(e.target.value);
  }, 1000);
});

repoPerPage.addEventListener('input', (e) => {
  paginate({
    per_page: e.target.value,
    repoCount: fetchDataResult.public_repos,
    url: fetchDataResult.repos_url,
  });
});

const fetchData = async (value) => {
  repos.textContent = '';

  mainContent.classList.add('hidden');
  loader.classList.remove('none');
  const res = await fetch(`https://api.github.com/users/${value}?type:user`);
  const data = await res.json();
  fetchDataResult = data;

  mainContent.classList.remove('hidden');
  loader.classList.add('none');
  //set profile data
  setProfileData(data);

  // pagination
  let per_page = repoPerPage.value;

  // paginate ({per_page:X, repoCount:X, })

  paginate({
    per_page,
    repoCount: data.public_repos,
    url: data.repos_url,
  });
};

const fetchAllData = async (url) => {
  console.log(url);
  const res = await fetch(url);
  const data = await res.json();
  console.log(data);
  allRepoData = [...data];
  console.log(allRepoData);
};

const fetchRepo = async (url, page = 1, per_page = 10) => {
  const res = await fetch(`${url}?page=${page}&per_page=${per_page}`);
  const data = await res.json();

  repoUrl = url;
  page = page;
  per_page = per_page;

  fetchAllData(url);

  repos.textContent = '';

  data.forEach((element) => {
    const repoCard = document.createElement('div');
    repoCard.classList.add('repo-card');

    const title = document.createElement('h2');
    const description = document.createElement('p');
    const topicsList = document.createElement('div');

    topicsList.classList.add('tags-list');

    title.textContent = element.name;
    description.textContent = element.description;

    if (element.topics.length > 0) {
      element.topics.forEach((topic) => {
        const tag = document.createElement('div');
        tag.classList.add('tag');

        tag.textContent = topic;

        topicsList.appendChild(tag);
      });
    }

    repoCard.appendChild(title);
    repoCard.appendChild(description);
    repoCard.appendChild(topicsList);

    repos.appendChild(repoCard);
  });
};

const paginate = ({ per_page, repoCount, url }) => {
  const total_pages = Math.ceil(repoCount / per_page);

  const dummyArr = Array.from({ length: total_pages }, (_, i) => i + 1);

  numbers.textContent = '';

  dummyArr.forEach((el) => {
    const page = document.createElement('span');
    page.classList.add('single-page-number');
    page.textContent = parseInt(el);
    if (page.textContent == 1) {
      page.classList.add('active');
      selectedElement = page;
    }
    numbers.appendChild(page);
  });

  document.querySelectorAll('.single-page-number').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      document
        .querySelectorAll('.single-page-number')
        .forEach((elm) => elm.classList.remove('active'));

      e.target.classList.add('active');

      fetchRepo(url, e.target.textContent, per_page);
    });
  });

  fetchRepo(url, page, per_page);
};

const setProfileData = (data) => {
  avatar.setAttribute('src', data.avatar_url);
  username.textContent = data.name;
  bio.textContent = data.bio;
  location.textContent = data.location;
  twitter.textContent = data.twitter_username;
  profileLink.textContent = data.html_url;
  profileLink.setAttribute('href', data.html_url);
  followers.textContent = data.followers;
  following.textContent = data.following;
  loc.textContent = data.location;
  publicRepoCount.textContent = data.public_repos;
};

// intial data
window.addEventListener('load', (event) => {
  console.log('onLoad');
  fetchData('johnpapa');
});

//repo ui
const repoUi = (data) => {
  data.forEach((element) => {
    const repoCard = document.createElement('div');
    repoCard.classList.add('repo-card');

    const title = document.createElement('h2');
    const description = document.createElement('p');
    const topicsList = document.createElement('div');

    topicsList.classList.add('tags-list');

    title.textContent = element.name;
    description.textContent = element.description;

    if (element.topics.length > 0) {
      element.topics.forEach((topic) => {
        const tag = document.createElement('div');
        tag.classList.add('tag');

        tag.textContent = topic;

        topicsList.appendChild(tag);
      });
    }

    repoCard.appendChild(title);
    repoCard.appendChild(description);
    repoCard.appendChild(topicsList);

    repos.appendChild(repoCard);
  });
};
