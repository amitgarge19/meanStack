    /*The routing information file*/

    /*The 'epl' variable as declared in controller.js file*/
    epl.config(['$routeProvider', function($routeProvider) {
      //when the value of the '$routeProvider' is '/' it will be the home page so 'index-view.html'
      //page is displayed within 'ng-view' directive's tag.
      $routeProvider
        .when('/', {
          // location of the template
          templateUrl: 'view/index-view.html',
          // name of the controller
          controller: 'eplController',
          // alias of the controller.
          controllerAs: 'myData'
        })
        //match-view is displayed
        .when('/view-match/:date/:team1code/vs/:team2code', {
          templateUrl: 'view/match-view.html',
          controller: 'matchViewController',
          controllerAs: 'matchDetails'
        })
        //team-view is displayed
        .when('/team-view/:teamcode/:teamkey', {
          templateUrl: 'view/team-view.html',
          controller: 'teamViewController',
          controllerAs: 'teamDetails'
        })
        
        //when all the above cases are not matched it will be redirected to '404-page not found' page.
        .otherwise({
          template: '<div class="notFound"><h1>404 page not found</h1><hr><a href="#/" class="btn btn-primary btn-primary"><span class="glyphicon glyphicon-home"></span> Go To HomePage</a></div>'
        });
    }]);