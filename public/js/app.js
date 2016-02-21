'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      // when('/', {
      //   templateUrl: 'partials/index',
      //   controller: IndexCtrl
      // }).
      when('/' , {
          templateUrl: 'partials/index',
          controller: IndexCtrl
      }).
      when('/assignments' , {
          templateUrl: 'partials/ass',
          controller: AssCtrl
      }).
      when('/taindex' , {
          templateUrl: 'partials/ta',
          controller: TaCtrl
      }).
      when('/teacherIndex' , {
        templateUrl: 'partials/teacher',
        controller: TeacherCtrl
      }).
      when('/newAss' , {
        templateUrl: 'partials/postAss',
        controller: PostAssCtrl
      }).
      when('/rejudge/:id/:studentId' , {
        templateUrl: 'partials/rejudge.jade',
        controller: RejudgeCtrl
      }).
      when('/commentAss/:id/:studentId/:subIndex' , {
          templateUrl: 'partials/commentAss',
          controller: JudgeCtrl
      }).
      when('/teacherComment/:id' , {
        templateUrl: 'partials/teacherComment',
        controller: TeacherCommentCtrl
      }).
      when('/taComment/:id' , {
          templateUrl: 'partials/taComment',
          controller: TaCommentCtrl
      }).
      when('/submit/:id' , {
          templateUrl: 'partials/upload',
          controller: UploadCtrl
      }).
      when('/edit/:id/:commentId' , {
          templateUrl: 'partials/sendComment',
          controller: SendCtrl
      }).
      when('/logout' , {
          templateUrl:'partials/logout',
          controller: LogoutCtrl
      }).
      when('/comment/:id' , {
          templateUrl: '/partials/comment',
          controller: CommentCtrl
      }).
      when('/login' , {
          templateUrl: 'partials/login',
          controller: LoginCtrl
      }).
      when('/register' , {
          templateUrl: 'partials/reg',
          controller: RegisterCtrl
      }).
      when('/addPost', {
        templateUrl: 'partials/addPost',
        controller: AddPostCtrl
      }).
      when('/readPost/:id', {
        templateUrl: 'partials/readPost',
        controller: ReadPostCtrl
      }).
      when('/editPost/:id', {
        templateUrl: 'partials/editPost',
        controller: EditPostCtrl
      }).
      when('/deletePost/:id', {
        templateUrl: 'partials/deletePost',
        controller: DeletePostCtrl
      }).
      otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  }]);