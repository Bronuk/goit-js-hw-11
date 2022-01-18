import './css/styles.css';
import Notiflix from 'notiflix';
import axios from 'axios';

const PER_PAGE = 40;
const UNIQUE_KEY = '25298219-8f01c7a68e1cc27d607ecbd91';
const URL = `https://pixabay.com/api/?key=${UNIQUE_KEY}`;
const REQUIRED_PARAMETERS = `&image_type=photo&orientation=horizontal&safesearch=true&per_page=${PER_PAGE}&page=`;

const refs = {
  form: document.querySelector('.search-form'),
  inputField: document.querySelector('.search-form input'),
  submitButton: document.querySelector('.search-form button'),
  galleryImages: document.querySelector('.gallery'),
  loadMoreButton: document.querySelector('[type="button"]'),
};

let query;
let PAGE;
let CURRENT_URL;
let COUNTER;
refs.submitButton.addEventListener('click', handleInput);
refs.loadMoreButton.addEventListener('click', handleInput);

function handleInput(e) {
  e.preventDefault();
  if (e.target.getAttribute('type') === 'submit') {
    PAGE = 1;
    refs.loadMoreButton.classList.add('load-more');
    query = refs.inputField.value;
    resetRender();
  }
  if (query !== '') {
    // console.log(CURRENT_URL);
    CURRENT_URL = `${URL}&q=${query}${REQUIRED_PARAMETERS}${PAGE}`;
    console.log(CURRENT_URL);
    getImages(CURRENT_URL).then(data => {
      console.log(data);
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
        );
      } else {
        addToGalleryMarkup(data.hits);
        refs.loadMoreButton.classList.remove('load-more');
        checkImagesLeft(data.totalHits, PAGE);
      }
    });
  }
}

function checkImagesLeft(imagesTotalNumber, currentPage) {
  let previousPage = parseInt(currentPage) - 1;
  let imagesLeft = parseInt(imagesTotalNumber) - previousPage * 40;
  if (imagesLeft >= 40) {
    PAGE++;
  } else if (imagesLeft > 0 && imagesLeft < 40) {
    refs.loadMoreButton.classList.add('load-more');
    window.onscroll = function(ev) {
      if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
        // you're at the bottom of the page
        Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
      }
    };
  }
}

function resetRender() {
  refs.galleryImages.innerHTML = '';
}

async function getImages(url) {
  const response = await axios
    .get(url)
    .then(response => response.data)
    .catch(error => console.log(error));
  // console.log(response.data.hits[0]);
  return response;
}

function addToGalleryMarkup(data) {
  const markup = data
    .map(item => {
      return `
  <div class="photo-card">
    <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
  <div class="info">
  <p class="info-item">
    <b>Likes: ${item.likes}</b>
  </p>
  <p class="info-item">
    <b>Views: ${item.views}</b>
  </p>
  <p class="info-item">
    <b>Comments: ${item.comments}</b>
  </p>
  <p class="info-item">
    <b>Downloads: ${item.downloads}</b>
  </p>
</div>
</div>
  `;
    }).join('');
  refs.galleryImages.insertAdjacentHTML('beforeend', markup);
}

// if(data.hits.length>=40){loadBtn.classList.remove('is-hidden')};

//.is-hidden{
// display: none;
// }

// function addListOfCountriesToMarkup(jsonDataOne) {
//   const markup = jsonDataOne
//     .map(item => {
//       return `
//       <li class="country-list-item">
//         <img class="flag-list" src="${item.flags.svg}" alt="flag", width="15" height="15" />${item.name.official}</li>`;
//     })
//     .join('');

//   refs.countryList.insertAdjacentHTML('beforeend', markup);
// }

// async function getUser() {
//   try {
//     const response = await axios.get('/user?ID=12345');
//     console.log(response);
//   } catch (error) {
//     console.error(error);
//   }
// }
