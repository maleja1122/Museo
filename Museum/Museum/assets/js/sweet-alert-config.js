'use strict'

// ERROR ALERT
const errorMessage = (title, text, reload = true) => {
  Swal.fire({
    title: title,
    text: `${text}. Intenta de nuevo`,
    icon: 'error',
    confirmButtonText: 'Volver',
    confirmButtonColor: '#a3243d'
  }).then((result) => {
    /* Para cuando presione el botón de "Volver" */
    if (result.value && reload) {
      window.location.reload();
    }
  })
}