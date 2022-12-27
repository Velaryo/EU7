const imgPerfil = document.querySelector('#imgPerfil');

let img = user.perfil

imgPerfil.onclick = async function(event){
	const {value} = await Swal.fire({
		title: `<img src="${img}" class="rounded-pill w-50" alt="">`,
		html:
		  '<h4>Cambiar avatar</h4>' +
		  '<input id="inputPerfil" class="form-control form-control-lg" type="text" placeholder="Ingresa una URL" aria-label=".form-control-lg"> </input>',
		showCloseButton: true,
		showCancelButton: true,
		focusConfirm: false,
		confirmButtonText:
		  '<i class="bi bi-person-square me-1"></i>  Guardar!',
		confirmButtonAriaLabel: 'Thumbs up, great!',
		cancelButtonText:
		  '<i class="bi bi-x-square me-2"></i>Cancelar</i>',
		cancelButtonAriaLabel: 'Thumbs down'
	  })
	  
	  const inputPerfil = await document.querySelector('#inputPerfil');

		if(value){
			if(inputPerfil.value !== ""){
				const usere = user
				usere.perfil = inputPerfil.value
				localStorage.setItem('user', JSON.stringify(usere));
				location.reload()
			}else{
				Swal.fire({
					text: "No ha ingresado ninguna URL válida",
					icon: "warning",
				});
			}
		}

}

function getPerfil(){
	imgPerfil.setAttribute('src', img)
}

getPerfil()

