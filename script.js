const ibgeUrl = `http://servicodados.ibge.gov.br/api/v3/noticias/`

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(location.search);
    filterCount(params);
    filterAndQuery(null);
})

function filterCount(params){
    let count = params.size

    for (const key of params.keys()) {
        if (key === 'page' || key === 'busca') count--;
    }

    const fc = document.querySelector('#filter-count')
    fc.textContent = count;
}

function openFilter(){
    document.querySelector('#modal-filter').showModal()
}

function closeFilter(){
    document.querySelector('#modal-filter').close()
}

function fillQtd(count){

    for (let i = 15; i<count; i+= 5){
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        document.querySelector("#qtd").appendChild(option)
    }

}

function submitForm(e){
    e.preventDefault();

    const input = document.querySelector('#search-bar')
    if (input.value === "") return

    const params = new URLSearchParams(location.search);
    params.set('busca', input.value)
    history.replaceState({}, "", `${location.pathname}?${params}`)

    queryNews(params);
}


function filterAndQuery(e){
    
    if(e !== null){
        e.preventDefault()
        closeFilter()  
    }

    const params = applyFilters();
    queryNews(params)
}

async function queryNews(params){
    const content = await fetch(`${ibgeUrl}?${params}`).then((response) => response.json());
    fillQtd(content.count)
}

function applyFilters(){
    const params = new URLSearchParams(location.search);

    const filters = ['tipo', 'qtd', 'de', 'ate'];

    filters.map((item) => {
        const itemHTML = document.querySelector(`#${item}`);
        
        if (itemHTML.value !== ""){
            params.set(`${item}`, itemHTML.value);
        }else if (itemHTML.value === "" && params.get(`${item}`) !== null){
            params.delete(`${item}`)
        }

    })

    history.replaceState({}, "", `${location.pathname}?${params}`)
    filterCount(params);
    
    return params;
}
