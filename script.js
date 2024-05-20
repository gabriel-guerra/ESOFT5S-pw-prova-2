const ibgeUrl = `https://servicodados.ibge.gov.br/api/v3/noticias/`

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

function qtdFilter(count){

    for (let i = 15; i<count; i+= 5){
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        document.querySelector("#qtd").appendChild(option)
    }

}

function formatEditorias(edt){
    let editorias;
    const arrayEditorias = edt.split(";");
    
    if (arrayEditorias.length > 1){
        editorias = arrayEditorias.reduce((string, editoria) => '#' + string + ` #${editoria}`);
    }else{ 
        editorias = `#${arrayEditorias[0]}`;
    }

    return editorias;
}

function formatImage(image){
    const imageObj = JSON.parse(image);
    return imageObj.image_intro;
}

function formatPublishedDate(dataHora){
    const dayMs = 86400000;

    const [d, m, y] = dataHora.slice(0, 10).split("/");
    const date = new Date(y, m-1, d)

    const today = new Date()
    today.setHours(0,0,0,0);

    if (today.getTime() === date.getTime()) return `Publicado hoje`
    else if ((today.getTime() - date.getTime()) === dayMs) return `Publicado ontem`
    else return `Publicado ${(today.getTime() - date.getTime()) / dayMs} dias atrás`

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
    console.log(content)
    qtdFilter(content.count)
    fillContent(content);
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

function fillContent(content){
    const ul = document.querySelector('#content');
    ul.innerHTML = "";

    for (const c of content.items){
        const li = document.createElement('li');

        li.innerHTML = `
        <img src="https://agenciadenoticias.ibge.gov.br/${formatImage(c.imagens)}">
        <h2>${c.titulo}</h2>
        <p>${c.introducao}</p>
        <span>${formatEditorias(c.editorias)}</span>
        <span>${formatPublishedDate(c.data_publicacao)}</span>
        <a href="${c.link}">Leia mais</a>
        <hr />
        `
        ul.appendChild(li)
    }
}