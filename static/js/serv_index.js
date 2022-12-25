const userLocalStorage = localStorage.getItem('user');
const user = JSON.parse(userLocalStorage);

const fila = document.querySelector('#fila');

const url = "http://127.0.0.1:8000/api/v2/services/";

let i = 1


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
</tr>`
}

//* **************************** CREATE ****************************

const modalBody = document.querySelector('#modal-body');
const form = document.querySelector("form");
const btnSubmit = document.querySelector('#btnSubmit')

function renderFormCreate(){
	
	modalBody.innerHTML = `
					
	<label for="inputAdd_logo" class="form-label">URL del Logo</label>
	<input name="logo" type="text" class="form-control">

	<label for="inputAdd_nombre" class="form-label">Nombre del servicio</label>
	<input name="name" type="text" class="form-control">

	<label for="desc" class="form-label">Descripción del servicio</label>
	<textarea id="desc" name="description" class="form-control" rows="3"></textarea>
	
	`
	
}


btn_modal_Insertar.onclick = function(event){
	renderFormCreate()
}

btnSubmit.onclick = async function (event) {
	const inputs = document.querySelectorAll("input");
	const desc = document.querySelector('#desc')

	event.preventDefault();
	
	const body = {
		description: desc.value,
	  };
	  console.log(body);
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
		fila.innerHTML += renderService(body);

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

