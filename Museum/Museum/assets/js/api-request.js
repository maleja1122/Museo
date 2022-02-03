const URL_API = "https://collectionapi.metmuseum.org/public/collection/v1/";
let gallery = [];
let ids = [];

// PETICION FETCH A LA API
const requestApi = async(endpoint = 'objects') => {
    return fetch(URL_API + endpoint, {
        method : "GET",
        mode: 'cors',
        headers: {
            "Access-Control-Allow-Origin": "http://127.0.0.1:5500"
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json();
        }
        return response.json()
    })
    .catch(error => response)
    .then(response => response)
}

// BUSCAR LA INFORMACIÓN MIENTRAS MUESTRA EL LOADER
const searchData = async (endpoint = null) => {
    if(endpoint === null) {
        initLoading();
    } else {
        showPreloader();
        console.log("Realizando busqueda...");
        let res = await requestApi(endpoint);
		console.log(res);
        if(res.total !== 0) {
            console.log(res);
            console.log("Solicitando recursos a la API...");
            ids = res.objectIDs;
            gallery = [];

            for(let i = 0; i < ids.length; i++){
                let artwork = await requestApi('objects/' + ids[i]);
                if(artwork.isPublicDomain){
                    gallery.push(artwork);
                }
            }

            if(gallery.length == 0){
                console.log('--- Busqueda finalizada :: Error ---');
                errorMessage('Ops! Hubo un error inesperado', 'No existe una obra en nuestro múseo con esos datos');
            } else {
                console.log('--- Busqueda finalizada :: Success ---');
                addCardsAndModals(gallery);
            }
            hiddenPreloader();
        } else {
			errorMessage('Ops! Hubo un error inesperado', 'No existe una obra en nuestro múseo con esos datos');
            console.log('--- Busqueda finalizada :: Error ---');
            hiddenPreloader();
        }
    }
}

// INICIALIZAR LA INFORMACIÓN MIENTRAS MUESTRA EL LOADER
const initLoading = async (quantity = 50) => {
    showPreloader();

    console.log('Consultando los departmentos de las obras...');
    const departments = await requestApi('departments');
    let selectDepartment = document.getElementById('departament');
    departments.departments.map((department) => {
        let option = document.createElement('option');
        option.setAttribute('value', department.departmentId);
        option.innerHTML = department.displayName;
        selectDepartment.appendChild(option);
    });
    console.log('--- Departmentos verificados ---');

    console.log("Solicitando recursos a la API...");
    ids = await requestApi('objects');
    
    console.log('Filtrando las obras de dominio público...');
    gallery = [];
    for(let i = 0; i < quantity; i++) {
        let artwork = await requestApi('objects/' + ids.objectIDs[i])
        if(artwork.isPublicDomain){
            gallery.push(artwork);
        }
    }
    console.log('--- Obras de arte filtradas ---');

    searchImgBackground(gallery);
    addCardsAndModals(gallery);
    hiddenPreloader();
}

// BUSCA UNA IMAGEN PARA COLOCAR DE FONDO EN EL HERO AREA
const searchImgBackground = (collection) => {
    console.log('Buscando imagen de fondo...');
    let idRandom = numeroAleatorio(1, gallery.length);
    let painting = collection[idRandom];
    while(true) {
        idRandom = numeroAleatorio(1, gallery.length);
        painting = collection[idRandom];
        if(painting.primaryImage) {
            console.log(painting);
            break;
        }
    }
    document.getElementById('hero-area').style.backgroundImage = `url('${painting.primaryImage}')`;
    console.log('--- Imagen establecida ---');
}

// GENERA UN NUMERO ALEATORIO
const numeroAleatorio = (minimo,maximo) => {
    return Math.floor(Math.random() * ((maximo+1)-minimo)+minimo);
}

// GENERA UN ELEMENTO CARD DE BOOTSTRAP POR CADA OBRA DE ARTE
const templateCard = (id, title, imgSmallUrl, displayName) => {
    if(displayName === ''){
        displayName = 'Anónimo';
    }

    const imgSmall = document.createElement('img');
    imgSmall.setAttribute('class', 'img-thumbnail');
    imgSmall.setAttribute('src', imgSmallUrl);
    imgSmall.setAttribute('alt', `Imagen N° ${id}`);
    
    const a = document.createElement('a');
    a.setAttribute('data-bs-toggle', 'modal');
    a.setAttribute('data-bs-target', `#modalImg${id}`);
    a.setAttribute('href', '#');
    a.setAttribute('class', 'text-center w-100 stretched-link');
    a.appendChild(imgSmall);

    const h5 = document.createElement('h5');
    h5.setAttribute('class', 'card-title');
    h5.innerHTML = title;

    const p = document.createElement('p');
    p.setAttribute('class', 'card-text');
    p.innerHTML = displayName;

    const cardBody = document.createElement('div');
    cardBody.setAttribute('class', 'card-body');
    cardBody.appendChild(h5);
    cardBody.appendChild(p);

    const card = document.createElement('div');
    card.setAttribute('class', 'card m-2');
    card.setAttribute('style', 'width: 18rem;');
    card.appendChild(a);
    card.appendChild(cardBody);

    return card;
}

// GENERA UN MODAL PARA VER LA IMAGEN DE UNA OBRA DE ARTE (TIPO LIGHTBOX)
const templateLightBox = (id, imgUrl) => {

    const modalContent = document.createElement('div');
    modalContent.setAttribute('class', 'modal-content bg-img bg-transparent border-0');

    const modalDialog = document.createElement('div');
    modalDialog.setAttribute('class', 'modal-dialog modal-xl h-100');
    modalDialog.appendChild(modalContent);

    const modal = document.createElement('div');
    modal.setAttribute('class', 'modal fade p-0');
    modal.setAttribute('id', `modalImg${id}`);
    modal.setAttribute('data-bs-keyboard', 'true');
    modal.setAttribute('tabindex', '-1');
    modal.appendChild(modalDialog);

    modalContent.style.backgroundImage = `url('${imgUrl}')`;

    return modal;
}

// GENERA UNA CARTA Y UN MODAL POR CADA OBRA DE ARTE
const addCardsAndModals = (artworks, quantity = 10) => {
    console.log('Mostrando obras de arte...');
    let containerCard = document.getElementById('container-artwork');
    let containerModal = document.getElementById('modal-artwork');
    let index = 0;

    containerCard.innerHTML = '';
    containerModal.innerHTML = '';
    artworks.map((artwork) => {
        if(index <= quantity) {
            let newCard = templateCard(artwork.objectID, artwork.title, artwork.primaryImageSmall, artwork.artistDisplayName);
            let newModal = templateLightBox(artwork.objectID, artwork.primaryImage);
            containerCard.appendChild(newCard);
            containerModal.appendChild(newModal);
            index++;
        }
    });
    console.log('--- Obras cargadas con éxito ---');
}
