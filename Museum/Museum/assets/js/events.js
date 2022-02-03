'use strict'
window.onload = function(){  
    initLoading();

    // EVENT CLICK TO BUTTON SEARCH
    const buttons = document.getElementsByClassName('btn-search');
    Array.from(buttons, btn => {
        btn.addEventListener('click', function() {
            let endPointSearchApi = 'search?hasImages=true&';
            
            endPointSearchApi = validateCheckbox(endPointSearchApi);
            endPointSearchApi = validateDepartamentSelect(endPointSearchApi);
            endPointSearchApi = validateInputSearch(endPointSearchApi, btn);
            console.log(endPointSearchApi);
        })
    });

    // EVENT TEXT INPUT TO INPUT SEARCH
    const inputs = document.getElementsByClassName('input-search');
    Array.from(inputs, input => {
        input.addEventListener('input',function(event) {
            event.preventDefault();
            event.stopPropagation();

            if(this.value === '') {
                showInEffect('hero-info', 100, false);
                showInEffect('hero-area', 100, false);

                let firstInputSearch = document.getElementById('first-search-input');
                if (firstInputSearch.value !== '') {
                    firstInputSearch.value = '';
                }
                firstInputSearch.focus();
            } else {
                let txtSearch = document.getElementById('second-search-input');
                txtSearch.value  = this.value;
                txtSearch.focus();

                fadeOutEffect('hero-info', 30, false);
                fadeOutEffect('hero-area', 30, false);
            }
        })
    });

    const checkDate = document.getElementById('date');
    checkDate.addEventListener('change', function() {
        const dateValues = document.getElementById('date-values');

        if(this.checked) {
            dateValues.classList.remove('d-none');
        } else {
            dateValues.classList.add('d-none');
        }
    })
}

const validateInputSearch = (endPointSearchApi, button) => {
    let valueSearch = button.parentNode.children[0].value;
    if(valueSearch && valueSearch != ' '){
        endPointSearchApi += `q=${valueSearch}`;
        searchData(endPointSearchApi);
    } else {
        errorMessage('Búsqueda sin valores', 'Por favor ingrese un valor en el cuadro de búsqueda', false)
        document.getElementById('first-search-input').focus();
    }
    return endPointSearchApi;
}

const validateDepartamentSelect = (endPointSearchApi) => {
    let department = document.getElementById('departament');
    if(departament.value) {
        endPointSearchApi += `departmentId=${department.value}&`;
    }
    return endPointSearchApi;
}

const validateCheckbox = (endPointSearchApi) => {
    let checkInputs = document.getElementsByClassName('form-check-input');
    let dateBegin = document.getElementById('dateBegin');
    let dateEnd = document.getElementById('dateEnd');

    Array.from(checkInputs, checkInput => {
        if(checkInput.checked && checkInput.id !== 'date'){
            endPointSearchApi += `${checkInput.id}=true&`;
        } else if(checkInput.checked && checkInput.id === 'date') {
            if(dateBegin.value && dateEnd.value){
                if(dateEnd.value > dateBegin.value) {
                    endPointSearchApi += `dateBegin=${dateBegin.value}&dateEnd=${dateEnd.value}&`;
                } else {
                    errorMessage('Valores incorrectos', 'Los periodos ingresados no son correctos. El "Desde" debe ser menor al "Hasta"', false);
                }
            }
        }
    })
    return endPointSearchApi;
}