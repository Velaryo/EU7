const userLocalStorage = localStorage.getItem('user');
const user = JSON.parse(userLocalStorage);

const modalTitulo = document.querySelector('#modalTitulo')
const modalBody = document.querySelector('#modal-body');
const form = document.querySelector("form");
const btnSubmit = document.querySelector('#btnSubmit')

const fila = document.querySelector('#fila');

const url = "http://127.0.0.1:8000/api/v2/services/";

let i = 1
let sharedId = {}
console.log(fila);

async function getService(){
	const response = await fetch(url,{
		headers: {
			"Authorization": `Bearer ${user.access_token}`
		}
	});
	const data = await response.json();
	data.results.forEach((service)=>{
		fila.innerHTML += renderService(service);
	});

}
getService();

function renderService(service) {
	return `<tr class="text-center">
	<th scope="row">${i++}</th>
	<td class="w-25">
		<img src="${service.logo}" class="w-25 rounded-pill" alt="">
	</td>
	<td class="text-center">${service.name}</td>
	<td class="text-center">${service.description}</td>
	<td>
		<button id="btnUpdate" onclick="getServicio_form(${service.id})" data-bs-toggle="modal" data-bs-target="#modal" class="btn btn-outline-primary" type="button"><i class="bi bi-pencil-square"></i></button>
		<button id="btnDelete" onclick="deleteServicio(${service.id})" class="btn btn-outline-danger" type="button"><i class="bi bi-trash3"></i></button>
	</td>
</tr>`

}

//* **************************** CREATE ****************************


function renderTemplate(titulo,formId, btnTexto){
	modalTitulo.textContent = titulo
	form.setAttribute("id", formId)
	form.innerHTML = `
					
	<label for="inputAdd_logo" class="form-label">URL del Logo</label>
	<input name="logo" type="text" class="form-control">

	<label for="inputAdd_nombre" class="form-label">Nombre del servicio</label>
	<input name="name" type="text" class="form-control">

	<label for="desc" class="form-label">Descripción del servicio</label>
	<textarea id="desc" name="description" class="form-control" rows="3"></textarea>
	<div class="modal-footer">
	<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
		<button id="btnSubmit" type="submit" class="btn btn-primary">${btnTexto}</button>
	</div>
	`
}

function renderFormCreate(){

	renderTemplate(
		'Agregar un nuevo servicio',
		'form formCreate',
		'Crear servicio'
	)
}


btn_modal_Insertar.onclick = function(event){
	renderFormCreate()
}

form.onsubmit = async function (event) {
	const inputs = document.querySelectorAll("input");
	const desc = document.querySelector('#desc')

	event.preventDefault();
	
	if(form.getAttribute('id') === "form formCreate"){
		createServicio(desc, inputs)
	}else if(form.getAttribute('id') === "form formUpdate"){
		updateServicio(sharedId.id, desc, inputs)
		
	}
	
}

async function createServicio(desc, inputs){
	const body = {
		description: desc.value,
	};
	  
	inputs.forEach((input) => (body[input.name] = input.value));
	
	try {
		await fetch(url,{
			method: 'POST',
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${user.access_token}`
			},
			body: JSON.stringify(body),
		});
		document.querySelector('#btnClose').click(); //simula clic - cierra modal
		fila.insertAdjacentHTML('afterbegin',renderService(body)); //q agregue al inicio

		Swal.fire({
			text: "Servicio creado",
			icon: "success",
		});
	} catch (error) {
		Swal.fire({
			text: error,
			icon: "error",
		});
	}
}

//* **************************** UPDATE ****************************
function renderFormUpdate(){
	
	renderTemplate(
		'Actualizar registro',
		'form formUpdate',
		'Actualizar servicio'
	)	
}

async function getServicio_form(id){
	renderFormUpdate()
	sharedId = {
		id: id
	}
	const inputs = document.querySelectorAll("input");
	const desc = document.querySelector('#desc')

	if(id === undefined) {
		location.reload()
		alert("Ha ocurrido un error. Intentelo neuvamente.")
	};

	try {
		const response = await fetch(url + `${id}/`,{
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${user.access_token}`
			}
		});
		const data = await response.json();
		
		inputs[0].value = data.logo
		inputs[1].value = data.name
		desc.value = data.description

	} catch (error) {
		Swal.fire({
			text: error,
			icon: "error",
		});
	}

}

async function updateServicio(id, desc, inputs){
	const body = {
		id: id,
		description: desc.value,
	};
	inputs.forEach((input) => (body[input.name] = input.value));
	console.log(body);
	
	try {
		await fetch(url + `${id}/`,{
			method: "PUT",
			headers: {
				'Content-Type': 'application/json',
				"Authorization": `Bearer ${user.access_token}`
			},
			body: JSON.stringify(body)
		});
		document.querySelector('#btnClose').click();

		Swal.fire({
			text: "Servicio creado",
			icon: "success",
		});

		location.reload();

	} catch (error) {
		Swal.fire({
			text: error,
			icon: "error",
		});
	}
}


//* **************************** DELETE ****************************

async function deleteServicio(id){
	const {value} = await Swal.fire({
		title: "Está seguro de eliminar este registro?",
		showDenyButton: true,
		showCancelButton: false,
		confirmButtonText: "Si",
		denyButtonText: `No`,
	  });

	if(id === undefined) {
		location.reload()
		alert("Ha ocurrido un error. Intentelo neuvamente.")
	};

	  if(value){
		try {
			const response = await fetch(url + `${id}/`,{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${user.access_token}`
				}
			});
		location.href = '/servicios/index.html';
		} catch (error) {
			Swal.fire({
				text: error,
				icon: "error",
			});
		}
	  }
}