const userLocalStorage = localStorage.getItem('user');
if (userLocalStorage === null) {
	window.location = '/login.html';
}
const user = JSON.parse(userLocalStorage);

if (user.is_staff === "False") {
	window.location = '/index.html';
}

const filaPagos = document.querySelector('#filaPagos');

const urlPagos = "http://127.0.0.1:8000/api/v2/payments/";
const urlServicios = "http://127.0.0.1:8000/api/v2/services/";
let iPagos = 1

async function getPayment() {
	const response = await fetch(urlPagos,{
		headers: {
			"Authorization": `Bearer ${user.access_token}`
		}
	});
	const data = await response.json();
	
	for (const pago of data.results) {
		const html = await renderPagos(pago);
		filaPagos.innerHTML += html;
	}
}
getPayment();

async function renderPagos(pago) {
	const serv = await getService(pago.service);

	
	
	return `
	<tr class="text-center">
		<th scope="row">${iPagos++}</th>
		<td class="w-25">
			<img src="${serv.logo}" class="w-25 rounded-pill" alt="">
		</td>
		<td class="text-center">${serv.name}</td>
		<td class="text-center">${pago.paymentDate}</td>
		<td class="text-center">${pago.expirationDate}</td>
		<td class="text-center">${pago.amount}</td>
	</tr>`
}

async function getService(id) {
	const response = await fetch(urlServicios + `${id}/`,{
		headers: {
			"Authorization": `Bearer ${user.access_token}`
		}
	});
	const data = await response.json();
	return {
		logo: data.logo,
		name: data.name
	};
}
