const userLocalStorage = localStorage.getItem('user');
if (userLocalStorage === null) {
	window.location = '/login.html';
}
const user = JSON.parse(userLocalStorage);

if (user.is_staff === "False") {
	window.location = '/index.html';
}


const modalTitulo = document.querySelector('#modalTitulo')
const modalBody = document.querySelector('#modal-body');
const form = document.querySelector("form");
const btnSubmit = document.querySelector('#btnSubmit')

const fila = document.querySelector('#fila');

//const url = "http://127.0.0.1:8000/api/v2/services/";

let i = 1
let sharedId = {}

const menuActivo = document.querySelector("#menuServicios")
function menuInicio(){
	menuActivo.classList.add('active');
}menuInicio()

async function getService(){
	const response = await fetch(urlServicios,{
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
	<span id="spanLogo" class="ms-2 text-danger d-none"> * La URL no puede estar vacío</span>
	<input name="logo" type="text" class="form-control">

	<label for="inputAdd_nombre" class="form-label">Nombre del servicio</label>
	
	<span id="spanNombre" class="ms-2 text-danger d-none"> * El nombre no puede estar vacío</span>
	<input name="name" type="text" class="form-control">

	<label for="desc" class="form-label">Descripción del servicio</label>
	<span id="spanDesc" class="ms-2 text-danger d-none"> * La descripción no puede estar vacía</span>
	<textarea id="desc" name="description" class="form-control" rows="3"></textarea>
	
	<div class="modal-footer">
	<button type="button" class="btn btn-secondary text-white" data-bs-dismiss="modal">Cancelar</button>
		<button id="btnSubmit" type="submit" class="btn btn-primary">${btnTexto}</button>
	</div>
	`
}

function renderFormCreate(){

	renderTemplate(
		'Agregar un nuevo servicio',
		'form formCreate',
		'Añadir servicio'
	)
}


btn_modal_Insertar.onclick = function(event){
	renderFormCreate()
}

form.onsubmit = async function (event) {
	event.preventDefault();
	const inputs = document.querySelectorAll("input");
	const desc = document.querySelector('#desc')

	const spanLogo = document.querySelector('#spanLogo');
	const spanNombre = document.querySelector('#spanNombre');
	const spanDesc = document.querySelector('#spanDesc');

	if(desc.value === ""){
		spanDesc.classList.remove('d-none');
		return false;
	}
	if(inputs[1].value === ""){
		spanNombre.classList.remove('d-none');
		return false;
	}
	if(inputs[0].value === ""){
		spanLogo.classList.remove('d-none');
		return false;
	}
	
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
		await fetch(urlServicios,{
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
		'Modificar servicio'
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
		alert("Ha ocurrido un error. Intentelo nuevamente.")
	};

	try {
		const response = await fetch(urlServicios + `${id}/`,{
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
		await fetch(urlServicios + `${id}/`,{
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
		alert("Ha ocurrido un error. Intentelo nuevamente.")
	};

	  if(value){
		try {
			const response = await fetch(urlServicios + `${id}/`,{
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