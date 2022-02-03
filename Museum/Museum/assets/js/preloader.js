'use strict'

function fadeOutEffect(id, duration = 200, workWithBody = true) {
    let fadeTarget = document.getElementById(id);
    let fadeEffect = setInterval(function () {
        
        if (!fadeTarget.style.opacity) {
            fadeTarget.style.opacity = 1;
        }
        if (fadeTarget.style.opacity > 0) {
            fadeTarget.style.opacity -= 0.1;
        } else {
            clearInterval(fadeEffect);

            if(!fadeTarget.classList.contains('d-none')){
                fadeTarget.classList.add('d-none');
            }

            if(workWithBody){
                let body = document.getElementById("body");
                if(body.classList.contains('overflow-hidden')){
                    body.classList.remove('overflow-hidden');
                    body.classList.add('overflow-auto');
                }
            }
        }
    }, duration);
}

function showInEffect(id, duration = 200, workWithBody = true) {
    let fadeTarget = document.getElementById(id);

    if (!fadeTarget.style.opacity || fadeTarget.style.opacity <= 0) {
        fadeTarget.style.opacity = 1;
    }
    
    if(fadeTarget.classList.contains('d-none')){
        fadeTarget.classList.remove('d-none');
    }

    if(workWithBody) {
        let body = document.getElementById("body");
        if(!body.classList.contains('overflow-hidden')){
            body.classList.add('overflow-hidden');
            body.classList.remove('overflow-auto');
        }
    }
}

function showPreloader() {
    showInEffect('preloader');
}

function hiddenPreloader() {
    fadeOutEffect('preloader');
}