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

const numbers = document.querySelector('.numbers');

console.log(numbers);

let timer;
let page = 1;

input.addEventListener('input', (e) => {
  clearTimeout(timer);

  timer = setTimeout(() => {
    fetchData(e.target.value);
  }, 1000);
});

const fetchData = async (value) => {
  mainContent.classList.add('hidden');
  loader.classList.remove('none');
  const res = await fetch(`https://api.github.com/users/${value}?type:user`);
  const data = await res.json();

  mainContent.classList.remove('hidden');
  loader.classList.add('none');

  console.log(data);

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

  // pagination
  const total_pages = Math.ceil(data.public_repos / 10);
  let page = 1;
  console.log(total_pages);

  const dummyArr = Array.from({ length: total_pages }, (_, i) => i + 1);

  numbers.textContent = '';

  dummyArr.forEach((el) => {
    const page = document.createElement('span');
    page.classList.add('single-page-number');
    page.textContent = parseInt(el);
    if (page.textContent == 1) {
      page.classList.add('active');
    }
    numbers.appendChild(page);
  });

  document.querySelectorAll('.single-page-number').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      document
        .querySelectorAll('.single-page-number')
        .forEach((elm) => elm.classList.remove('active'));

      // if (e.target.textContent != page) {
      e.target.classList.add('active');
      fetchRepo(data.repos_url, e.target.textContent);
      // }
    });
  });

  fetchRepo(data.repos_url, page);
};

const fetchRepo = async (url, page = 1) => {
  console.log(url);
  const res = await fetch(`${url}?page=${page}&per_page=10`);
  const data = await res.json();

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
        console.log(topic);
        tag.textContent = topic;
        console.log(tag);
        topicsList.appendChild(tag);
      });
    }

    repoCard.appendChild(title);
    repoCard.appendChild(description);
    repoCard.appendChild(topicsList);

    repos.appendChild(repoCard);
  });
};

// intial data
fetchData('johnpapa');
