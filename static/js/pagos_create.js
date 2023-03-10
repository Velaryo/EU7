const userLocalStorage = localStorage.getItem('user');
if (userLocalStorage === null) {
	window.location = '/login.html';
}
const user = JSON.parse(userLocalStorage);

const now = new Date();

const form = document.querySelector("form");
const inputs = document.querySelectorAll("input");
const select = document.querySelector("select");

const menuActivo = document.querySelector("#menuAñadirPago")

const spanFecha = document.querySelector('#spanFecha');
const spanMonto = document.querySelector('#spanMonto');

function menuInicio(){
	menuActivo.classList.add('active');
}menuInicio()

form.onsubmit = async function (event) {
	event.preventDefault();
	fecha = getFecha();

	if(inputs[0].value === ""){
		spanFecha.classList.remove('d-none');
		return false;
	}
	if(inputs[1].value === ""){
		spanMonto.classList.remove('d-none');
		return false;
	}

	const body = {
	service: select.value,
	paymentDate: fecha,
	user: user.id
  	};
	inputs.forEach((input) => (body[input.name] = input.value));
	
	try {
		await fetch(urlPago_full, {
		  method: "POST",
		  headers: {
			"Content-Type": "application/json",
		  },
		  body: JSON.stringify(body),
		});
	
		Swal.fire({
		  text: "Pago añadido",
		  icon: "success",
		});
		window.location = '/index.html';
	  } catch (error) {
		Swal.fire({
		  text: error,
		  icon: "error",
		});
	  }
}

async function getServices(){
	const response = await fetch(urlServicios,{
		headers: {
			"Authorization": `Bearer ${user.access_token}`
		}
	});
	const data = await response.json();
	
	data.results.forEach((option)=>{
		select.innerHTML += renderOption(option);
	});

}
getServices()

function renderOption(option){
	
	return `
		<option value="${option.id}">${option.name}</option>
	`
}

function getFecha(){
	const dia = now.getDate();
	const mes = now.getMonth() + 1;
	const anio = now.getFullYear();

	return `${anio}-${mes}-${dia}`;
}