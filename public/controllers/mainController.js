/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

// This sample uses an open source OAuth 2.0 library that is compatible with the Azure AD v2.0 endpoint. 
// Microsoft does not provide fixes or direct support for this library. 
// Refer to the library’s repository to file issues or for other support. 
// For more information about auth libraries see: https://azure.microsoft.com/documentation/articles/active-directory-v2-libraries/ 
// Library repo: https://github.com/MrSwitch/hello.js

(function () {
  angular
    .module('app')
    .controller('MainController', MainController);

  function MainController($scope, $http, $log, GraphHelper) {
    let vm = this;

    // View model properties
    vm.displayName;
    vm.emailAddress;

    // View model methods
    vm.login = login;
    vm.logout = logout;
    vm.isAuthenticated = isAuthenticated;
    vm.initAuth = initAuth;
	
	vm.isVrijeRuimtes = isVrijeRuimtes;
	vm.setVrijeRuimtes = setVrijeRuimtes;
	vm.getVrijeRuimtes = getVrijeRuimtes;
	vm.vrijeruimtes = vrijeruimtes; 

    /////////////////////////////////////////
    // End of exposed properties and methods.

    function initAuth() {
        // Check initial connection status.
        if (localStorage.token) {
            processAuth();
        }
    }

    // Auth info is saved in localStorage by now, so set the default headers and user properties.
    function processAuth() {

        // Add the required Authorization header with bearer token.
        $http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.token;
        
        // This header has been added to identify our sample in the Microsoft Graph service. If extracting this code for your project please remove.
        $http.defaults.headers.common.SampleID = 'angular-connect-rest-sample';

        if (localStorage.getItem('user') === null) {

          // Get the profile of the current user.
          GraphHelper.me().then(function(response) {
            // Save the user to localStorage.
            let user =response.data;
            localStorage.setItem('user', angular.toJson(user));

            vm.displayName = user.displayName;
            vm.emailAddress = user.mail || user.userPrincipalName;
          });
        } else {
          let user = angular.fromJson(localStorage.user);
            
          vm.displayName = user.displayName;
          vm.emailAddress = user.mail || user.userPrincipalName;
        }
    }

    vm.initAuth();    

    function isAuthenticated() {
      return localStorage.getItem('user') !== null;
    }

    function login() {
      GraphHelper.login();
    }

    function logout() {
      GraphHelper.logout();
    }
	
	var ruimteLijst = false;
	
	function setVrijeRuimtes(bool) {
		ruimteLijst = bool;
		
		if (ruimteLijst) getVrijeRuimtes();
	}
	
	function getVrijeRuimtes() {
		GraphHelper.vrijeruimtes().then(function(response) {
			let rooms = response.data;	
			
			//Alle ruimtes doorlopen en weergeven
			for (var values in rooms) {
				var obj = rooms[values];
				if (values == "value") {
					for (var room in obj) {
						console.log(obj[room].name);
						document.getElementById('vrijeruimteslist').innerHTML += "<li>"+obj[room].name+"<button id='"+obj[room].name+"'>Reserveer</button></li>";
						//Controleren of de ruimte bezet is
						
						//Call naar server om de status van een ruimte op te halen
						
						//If statement om te kijken of de status free of busy is
						
						//Als status free is toevoegen aan de lijst van ruimtes
						//document.getElementById('vrijeruimteslist').innerHTML += "<li>"+obj[room].name+"</li>";
					}
				}
			}
		});
	}
	
	function isVrijeRuimtes() {
		return ruimteLijst;
	}
	
	function vrijeruimtes() {
		if (ruimteLijst == false) setVrijeRuimtes(true); else setVrijeRuimtes(false);
	}

  };
})();