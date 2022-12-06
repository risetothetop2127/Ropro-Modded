
document.addEventListener('fetchStatus', function(event) { //Adds status back to profile page
	document.getElementById("user-stat").removeAttribute("data-userstatus-disabled")
    angular.element(document.getElementsByClassName('header-caption')[0].children[1]).scope().isUserStatusDisabled()
    angular.element(document.getElementsByClassName('header-caption')[0].children[1]).scope().blurStatusForm()
})