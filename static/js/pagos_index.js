const userLocalStorage = localStorage.getItem('user');
if (userLocalStorage === null) {
	window.location = '/login.html';
}
const user = JSON.parse(userLocalStorage);

// if (user.is_staff === "False") {
// 	window.location = '/index.html';
// }

const filaPagos = document.querySelector('#filaPagos');
const filaVencidos = document.querySelector('#filaVencidos');

const urlPagos = `http://127.0.0.1:8000/api/v2/payments/?user=${user.id}`;
const urlPago_full = `http://127.0.0.1:8000/api/v2/payments/`;
const urlServicios = "http://127.0.0.1:8000/api/v2/services/";
const urlVencidos = "http://127.0.0.1:8000/api/v2/expired-payments/"
let iPagos = 1
let iVence = 1

async function getPayment(url) {
	const verMasPagos = document.querySelector('#verMasPagos');
	if (verMasPagos) {
		verMasPagos.remove();
	}
	if (verMasPagos !== null) {
		verMasPagos.remove()
	}
	const response = await fetch(url,{
		headers: {
			"Authorization": `Bearer ${user.access_token}`
		}
	});
	const data = await response.json();
	
	for (const pago of data.results) {
		const html = await renderPagos(pago);
		filaPagos.innerHTML += html;
	}
	
	if(data.next !== null) {
		filaPagos.innerHTML += `
		<button id="verMasPagos" onclick="getPayment('${data.next}')"
		>Ver mas</button>
		`;
	}
}
getPayment(urlPagos);

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

// ******************** VENCIMIENTO *******************
async function getExpired(url) {

	const response = await fetch(url,{
		headers: {
			"Authorization": `Bearer ${user.access_token}`
		}
	});
	const data = await response.json();
	
	for (const vence of data.results) {
		
		const res_pago = await getPago(vence.pay_user);
		const res_service = await getService(res_pago.service)
		
		if(Number(res_pago.user) === Number(user.id)){
			const html = await renderVencidos(vence, res_pago, res_service);
			filaVencidos.innerHTML += html;
		}
	}
}
getExpired(urlVencidos);

async function renderVencidos(vence, pago, service) {
	
	return `
	<tr class="text-center">
		<th scope="row">${iVence++}</th>
		<td class="w-25">
			<img src="${service.logo}" class="w-25 rounded-pill" alt="">
		</td>
		<td class="text-center">${service.name}</td>
		<td class="text-center">${pago.paymentDate}</td>
		<td class="text-center">${pago.amount}</td>
		<td class="text-center">${vence.penalty_fee_amount}</td>
	</tr>`


}

async function getPago(id) {
	const response = await fetch(urlPago_full + `${id}/`,{
		headers: {
			"Authorization": `Bearer ${user.access_token}`
		}
	});
	const data = await response.json();
	
	return {
		user: data.user,
		paymentDate: data.paymentDate,
		amount: data.amount,
		service: data.service
	};
}