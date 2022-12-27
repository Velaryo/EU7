const userLocalStorage = localStorage.getItem('user');
if (userLocalStorage !== null) {
	window.location = '/index.html';
}

const inputEmail = document.querySelector('#email');
const inputPassword = document.querySelector('#password');

const spanEmail = document.querySelector('#spanEmail');
const spanPass = document.querySelector('#spanPass');


btnLogin.onclick = async function(event){
	event.preventDefault();
	if(inputEmail.value === ""){
		spanEmail.classList.remove('d-none');
		if(inputPassword.value == ""){
			spanPass.classList.remove('d-none');
		}
		return false;
	}
	if (inputPassword.value === "") {
		spanPass.classList.remove('d-none');
		return false;
	}
	
	

	body = {
		email: inputEmail.value,
		password: inputPassword.value
	}

	try {
		const response = await fetch("http://127.0.0.1:8000/api/users/login/",{
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams(body),
		});
		const {tokens} = await response.json();

		if(tokens){
			if(tokens.is_staff === "True") {
				console.log("es admin");
			}else if(tokens.is_active === "True"){
				console.log("es user");
			}
			const user = {
				id: tokens.id,
				name: tokens.first_name,
				is_staff: tokens.is_staff,
				is_active: tokens.is_active,
				refresh_token: tokens.refresh,
				access_token: tokens.access,
				perfil: "https://us.123rf.com/450wm/kasezo/kasezo2011/kasezo201100008/kasezo201100008.jpg"
			}
			localStorage.setItem('user', JSON.stringify(user));
			
			console.log(user);

			location.href = '/index.html';
		}else{
			Swal.fire({
				icon: 'error',
				title: 'Correo o contraseña incorrecta.',
				confirmButtonText: 'Volver a intentar'
			  })
		}	

	} catch (error) {
		Swal.fire({
			text: error,
			icon: "error",
		  });
	}
}

