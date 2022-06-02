const fetchCountries=(name) =>{
        return fetch(`https://restcountries.com/v2/name/${name}?fields=name,capital,population,flag,languages`)
}
export{ fetchCountries }