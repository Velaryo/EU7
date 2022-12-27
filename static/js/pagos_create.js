const userLocalStorage = localStorage.getItem('user');
if (userLocalStorage === null) {
	window.location = '/login.html';
}
const user = JSON.parse(userLocalStorage);

const now = new Date();

const form = document.querySelector("form");
const inputs = document.querySelectorAll("input");
const select = document.querySelector("select");

const urlPayments = "http://127.0.0.1:8000/api/v2/payments/"
const urlServices = "http://127.0.0.1:8000/api/v2/services/"


form.onsubmit = async function (event) {
	event.preventDefault();
	fecha = getFecha();
	
	const body = {
	service: select.value,
	paymentDate: fecha,
	user: user.id
  	};
	inputs.forEach((input) => (body[input.name] = input.value));
	
	console.log(body);
	try {
		await fetch(urlPayments, {
		  method: "POST",
		  headers: {
			"Content-Type": "application/json",
		  },
		  body: JSON.stringify(body),
		});
	
		Swal.fire({
		  text: "Tarea creada",
		  icon: "success",
		});
	  } catch (error) {
		Swal.fire({
		  text: error,
		  icon: "error",
		});
	  }
}

async function getServices(){
	const response = await fetch(urlServices,{
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