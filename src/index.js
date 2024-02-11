import axios from "axios";
import Notiflix from 'notiflix';
// axios.defaults.headers.common["x-api-key"] = "42301794-c3e3273866382066d248d2b79";

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

let page = 1;
let hits = [];
let totalHits = 0;

async function fetchImages(query, page = 1) {
    try {
        const response = await axios.get('https://pixabay.com/api/', {
            params: {
                key: '42301794-c3e3273866382066d248d2b79',
                q: query,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
                page: page,
                per_page: 40
            }
        });
        const { data } = response;
        return {
            hits: data.hits,
            totalHits: data.totalHits
        };
    } catch (error) {
            console.error("Sorry, there are no images matching your search query. Please try again.", error);
            return {
                hits: [],
                totalHits: 0
            };
        }
    }
function displayImages(images) {
    gallery.innerHTML = '';
    images.forEach(image => {
        const card = document.createElement('div');
        card.classList.add('photo-card');

        const img = document.createElement('img');
        img.src = image.webformatURL;
        img.alt = image.tags;
        img.loading = 'lazy';

        const info = document.createElement('div');
        info.classList.add('info');
        info.innerHTML = `
        <p class="info-item"><b>Likes:</b> ${image.likes}</p>
        <p class="info-item"><b>Views:</b> ${image.views}</p>
        <p class="info-item"><b>Comments:</b> ${image.comments}</p>
        <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
        `
        card.appendChild(img);
        card.appendChild(info);
        gallery.appendChild(card);
        
if (gallery.children.length >= totalHits) {
        loadMoreButton.style.display = 'none';
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    } else {
        loadMoreButton.style.display = 'block';
    }
        
    });
    
    
}
loadMoreButton.style.display = 'none';

form.addEventListener('submit', async function (event) {
    event.preventDefault();
    const formData = new FormData(form);
    const query = formData.get('searchQuery');
    const { hits: newHits, totalHits: newTotalHits } = await fetchImages(query);
    hits = newHits;
    totalHits = newTotalHits;
    displayImages(hits);

    if (totalHits <= 20) {
        loadMoreButton.style.display = 'none';
    } else {
        loadMoreButton.style.display = 'block';
    }
});

loadMoreButton.addEventListener('click', async function() {
    page++; 
    const formData = new FormData(form);
    const query = formData.get('searchQuery');
    const { hits: newHits } = await fetchImages(query, page);
    hits = hits.concat(newHits);
    displayImages(hits);
});





