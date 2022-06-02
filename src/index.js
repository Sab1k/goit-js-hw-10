import { fetchCountries } from './fetchCountries.js';
import { debounce } from 'throttle-debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';


const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const list = document.querySelector(".country-list");
const info = document.querySelector(".country-info");


const checkCountry = () => {
    let countryName = input.value.trim();

    list.innerHTML = "";
    info.innerHTML = "";

    if (countryName == "") {

        Notify.failure('Enter the country name')
        return
    }
    
    fetchCountries(countryName)
        .then(resp => {
        
            if (!resp.ok) {
                throw new Error(resp.status);
            }
            return resp.json();
        })
        .then(data => {
      
        let markup;

        if (data.length > 10) {
            
            Notify.info("Too many matches found. Please enter a more specific name.");

        } else if (data.length >= 2 && data.length <= 10) {

            const countries = data.map(({ flag, name }) => {

                info.innerHTML = "";
                
                markup = 
                `<li class="country-item">
                    <img
                    class="flag"
                    src="${flag}"
                    alt="Flag of ${name}"
                    height = "20px"
                    />
                    <p class="countryName">${name}</p>
                </li>`;

                list.insertAdjacentHTML("afterbegin", markup);
               
            })

            info.innerHTML = "";

        } else if (data.length == 1) {

            const countries = data.map(({ flag, name, capital, population, languages }) => {

                const countryLanguages = [];

                for (const language of languages) {
                    countryLanguages.push(language.name)
                }
                
                markup = 
                    `<p class="fullName"><img
                        class="flag"
                        src="${flag}"
                        alt="Flag of ${name}"
                        height = "20px"
                        />
                        ${name}</p>
                    <ul class="refs">
                        <li class="feature"><b>Capital:</b> ${capital}</li>
                        <li class="feature"><b>Population:</b> ${population}</li>
                        <li class="feature"><b>Languages:</b> ${countryLanguages}</li>
                    </ul>`;

                info.insertAdjacentHTML("afterbegin", markup);
            })

            list.innerHTML = "";           
      }
    }).catch(error => {

      Notify.failure("Oops, there is no country with that name" )
  })
}

input.addEventListener("input", debounce(DEBOUNCE_DELAY, (checkCountry) ));
