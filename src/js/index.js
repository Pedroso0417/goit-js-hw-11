import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// Import Pixabay API configurations
import { BASE_URL, options } from './pixabay_api.js'; 

const galleryEl = document.querySelector('.gallery');
const searchInputEl = document.querySelector('input[name="searchQuery"]');
const searchFormEl = document.getElementById('search-form');
const loadMoreBtn = document.querySelector('.load-more');

const lightbox = new SimpleLightbox('.lightbox', {
  captionsData: 'alt',
  captionDelay: 250,
});

let totalHits = 0;
let reachedEnd = false;

async function renderGallery(hits) {
  const markup = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
              <a href="${largeImageURL}" class="lightbox">
                  <div class="photo-card">
                      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                      <div class="info">
                          <p class="info-item">
                              <b>Likes</b>
                              ${likes}
                          </p>
                          <p class="info-item">
                              <b>Views</b>
                              ${views}
                          </p>
                          <p class="info-item">
                              <b>Comments</b>
                              ${comments}
                          </p>
                          <p class="info-item">
                              <b>Downloads</b>
                              ${downloads}
                          </p>
                      </div>
                  </div>
              </a>
              `;
      }
    )
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
  // Scroll to the newly added images with smooth behavior
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

async function searchImages() {
  options.params.q = searchInputEl.value.trim();
  if (options.params.q === '') {
    Notify.failure('Please enter a search query.');
    return;
  }

  options.params.page = 1;
  galleryEl.innerHTML = '';
  loadMoreBtn.style.display = 'none';
  reachedEnd = false;

  try {
    const response = await axios.get(BASE_URL, options);
    totalHits = response.data.totalHits;

    const { hits } = response.data;

    if (hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notify.success(`Hooray! We found ${totalHits} images.`);
      renderGallery(hits);
      // Show load more button if there are more images to load
      if (totalHits > options.params.per_page) {
        loadMoreBtn.style.display = 'block';
      }
    }
    searchInputEl.value = '';
  } catch (err) {
    Notify.failure(err);
  }
}

async function loadMore() {
  options.params.page += 1;
  try {
    const response = await axios.get(BASE_URL, options);
    const hits = response.data.hits;
    renderGallery(hits);

    // If all images are loaded, hide the load more button
    if (options.params.page * options.params.per_page >= totalHits) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      loadMoreBtn.style.display = 'none';
      reachedEnd = true;
    }
  } catch (err) {
    Notify.failure(err);
  }
}

searchFormEl.addEventListener('submit', function (e) {
  e.preventDefault();
  searchImages();
});

loadMoreBtn.addEventListener('click', loadMore);

// Infinite scrolling example (uncomment if you want infinite scrolling)
// window.addEventListener('scroll', function () {
//   const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
//   if (scrollTop + clientHeight >= scrollHeight && !reachedEnd) {
//     loadMore();
//   }
// });
