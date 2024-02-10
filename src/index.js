import axios from "axios";
import Notiflix from 'notiflix';
// axios.defaults.headers.common["x-api-key"] = "42301794-c3e3273866382066d248d2b79";

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');

async function fetchImages(query) {
    try {
        const response = await axios.get('https://pixabay.com/api/', {
            params: {
                key: '42301794-c3e3273866382066d248d2b79',
                q: query,
                image_type: 'photo',
                orientation:'horizontal',
                safesearch: true
            }
        });
        const { data } = response;
        return data.hits;
    } catch (error) {
        console.error("Sorry, there are no images matching your search query. Please try again.", error);
        return [];
    };
};

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
    })
}

form.addEventListener('submit', async function (event) {
    event.preventDefault();
    const formData = new FormData(form);
    const query = formData.get('searchQuery');
    const images = await fetchImages(query);
    displayImages(images);

})

