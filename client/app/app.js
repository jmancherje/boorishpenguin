angular.module('boorishpenguin', [
  'boorish.services',
  'boorish.users',
  'boorish.user',
  'boorish.ask',
  'boorish.questions',
  'boorish.answers',
  'boorish.auth',
  'ngRoute'
  ])

.config(function ($routeProvider, $sceProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'app/questions/questions.html',
      controller: 'questionsController'
    })
    .when('/ask', {
      templateUrl: 'app/ask/ask.html',
      controller: 'askController'
    })
    .when('/questions', {
      templateUrl: 'app/questions/questions.html',
      controller: 'questionsController'
    })
    .when('/questions/:id', {
      templateUrl: 'app/answers/answers.html',
      controller: 'answersController'
    })
    .when('/users', {
      templateUrl: 'app/users/users.html',
      controller: 'UsersController'
    })
    .when('/users/user', {
      templateUrl: 'app/users/user.html',
      controller: 'UserController'
    })
    .when('/signin', {
      templateUrl: 'app/auth/signin.html',
      controller: 'AuthController'
    })
    .otherwise({
      routeTo: '/signin'
    })

  $sceProvider.enabled(false);
});
