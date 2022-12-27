const btnLogout = document.querySelector('#btnLogout');

btnLogout.onclick = function(event){
	localStorage.clear();
	window.location = '/login.html';
}