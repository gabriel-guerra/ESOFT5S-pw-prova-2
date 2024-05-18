const ibgeUrl = `http://servicodados.ibge.gov.br/api/v3/noticias/`

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(location.search);
    filterCount(params);
    queryNews(params);
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

function submitForm(e){
    e.preventDefault();

    const input = document.querySelector('#search-bar')
    if (input.value === "") return

    const params = new URLSearchParams(location.search);
    params.set('busca', input.value)
    history.replaceState({}, "", `${location.pathname}?${params}`)

    queryNews(params);
}

async function setTypeFilter(){
    const type = document.querySelector('#type-filter')

    const options = await fetch(`${ibgeUrl}?tipo`)
    console.log(options)

    for (const option of options){
        item = document.createElement('option');
        item.textContent = option;
        type.appendChild(item)
    }
}

async function queryNews(params){
    const content = await fetch(`${ibgeUrl}?${params}`).then((response) => response.json())
    console.log(content)


}