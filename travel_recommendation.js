'use strict';

const query = (selector) => document.querySelector(selector);
const input = query('.search input[type=text]');
const search = query('.search input[type=button]');
const clear = query('.search input[type=button]:last-child');
let database = null;
let intId = 0;

function searchInCategory(category, keyword) {
    let result = [];
    category.forEach((item) => {
        if (item.name.toLowerCase().includes(keyword) || (item.hasOwnProperty('description') && item.description.toLowerCase().includes(keyword))) {
            result.push(item);
        } else if (item.hasOwnProperty('cities')) {
            item.cities.forEach((city) => {
                if (city.name.toLowerCase().includes(keyword) || (city.hasOwnProperty('description') && city.description.toLowerCase().includes(keyword))) {
                    result.push(city);
                }
            });
        }
    });
    return result;
}

function searchKeywordsInJson(keyword) {
    keyword = keyword.toLowerCase();
    let result = [];

    if (keyword === "country" || keyword === 'countries') return database.countries;
    if (keyword === "temple" || keyword === 'temples') return database.temples;
    if (keyword === "beach" || keyword === 'beaches') return database.beaches;

    result = result.concat(searchInCategory(database.countries, keyword));
    result = result.concat(searchInCategory(database.temples, keyword));
    result = result.concat(searchInCategory(database.beaches, keyword));

    return result;
}

function searching() {

    const value = input.value;
    if(value === '') return;
    clearTimeout(intId);
    query('.results').innerHTML = '';
    const result = searchKeywordsInJson(value);
    if (result.length === 0) {
        query('.results').innerHTML = "<li class='error grid grid-center'>No result found</li>";
        clearTimeout(intId);
        intId = setTimeout(() => {
            query('.results').innerHTML = '';
        }, 1000);
    } else {
        console.log("search result",result);
        let html = '';
        result.forEach((item) => {
            html += `            <li>
            <img src="${item.imageUrl}" alt="">
            <h2>${item.name}</h2>
            <p>${item.description}</p>
            <input class="button" type="button" value="View">
        </li>`;
        });
        query('.results').innerHTML = html;
    }
}

search.addEventListener('click', () => {
    searching();
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        searching();
    }
});

clear.addEventListener('click', () => {
    input.value = '';
    query('.results').innerHTML = '';
});

fetch('travel_recommendation.json').then(response => response.json()).then(data => { database = data; console.log("api json result",database); });

