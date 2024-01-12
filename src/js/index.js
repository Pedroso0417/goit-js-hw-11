import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { BASE_URL, options } from './pixabay_api.js';

const galleryElement = document.querySelector('.gallery');
const searchInputElement = document.querySelector('input[name="searchQuery"]');
const searchFormElement = document.querySelector('.search_form');

const lightbox = new SimpleLightbox('.lightbox', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

// Function to render image cards into the gallery
function renderImageCards(images) {
  const gallery = $('.gallery');
  gallery.empty(); // Clear the gallery content

  if (images.length === 0) {
    Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  images.forEach(image => {
    const card = $('<div>').addClass('photo-card');
    const img = $('<img>').attr({
      src: image.webformatURL,
      alt: image.tags,
      loading: 'lazy',
    });
    const info = $('<div>').addClass('info');

    // Adding information to the card
    const likes = $('<p>')
      .addClass('info-item')
      .html(`<b>Likes:</b> ${image.likes}`);
    const views = $('<p>')
      .addClass('info-item')
      .html(`<b>Views:</b> ${image.views}`);
    const comments = $('<p>')
      .addClass('info-item')
      .html(`<b>Comments:</b> ${image.comments}`);
    const downloads = $('<p>')
      .addClass('info-item')
      .html(`<b>Downloads:</b> ${image.downloads}`);

    info.append(likes, views, comments, downloads);
    card.append(img, info);
    gallery.append(card);
  });

  // Initialize SimpleLightbox after rendering images
  lightbox.refresh();
}

// Function to fetch images from the Pixabay API
async function fetchImages(searchQuery) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: searchQuery,
        ...options,
      },
    });

    const images = response.data.hits;
    renderImageCards(images);
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}

// Event listener for the search form
searchFormElement.addEventListener('submit', function (event) {
  event.preventDefault();
  const searchQuery = searchInputElement.value.trim();

  if (searchQuery !== '') {
    fetchImages(searchQuery);
  } else {
    Notify.info('Please enter a search query');
  }
});

// Example usage: Replace this with your API call to fetch images
const exampleImages = [
  {
    webformatURL: 'example_small_image_url1.jpg',
    largeImageURL: 'example_large_image_url1.jpg',
    tags: 'Example Image 1',
    likes: 100,
    views: 500,
    comments: 20,
    downloads: 50,
  },
  {
    webformatURL: 'example_small_image_url2.jpg',
    largeImageURL: 'example_large_image_url2.jpg',
    tags: 'Example Image 2',
    likes: 150,
    views: 700,
    comments: 30,
    downloads: 70,
  },
];

renderImageCards(exampleImages);
