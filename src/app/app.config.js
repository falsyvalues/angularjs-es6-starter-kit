export function routing($urlRouterProvider, $locationProvider, $httpProvider) {
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: true
	}).hashPrefix('!');

	$urlRouterProvider.otherwise('/');
}

routing.$inject = ['$urlRouterProvider', '$locationProvider', '$httpProvider'];

export function run($rootScope) {

}

run.$inject = ['$rootScope'];
