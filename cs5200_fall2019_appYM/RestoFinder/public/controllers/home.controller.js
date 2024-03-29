(function() {
  angular
    .module("RestoFinder")
    .controller("HomeController", function(
      $rootScope,
      $scope,
      $http,
      $location,
      RestaurantService,
      LoginService,
    ) {
      $scope.search = "";
      $scope.userSearch = "";
      $scope.getFeaturedRestaurants = getFeaturedResults();
      $scope.getCurrentLoggedInUser = getCurrentLoggedInUser();
      $scope.featuredLoading = true;
        
      $scope.viewRestaurant = viewRestaurant;
      $scope.getSearchResults = function() {
        $rootScope.searchType = "restaurant";
        $rootScope.search = $scope.search;
        $location.url("/search");
      };
      $scope.getUserSearchResults = function() {
        $rootScope.searchType = "user";
        console.log("search term is", $scope.userSearch);
        $rootScope.userSearch = $scope.userSearch;
        $location.url("/search");
      };
      function getFeaturedResults() {
        // body
        console.log("function called");
        RestaurantService.getFeaturedRestaurants().then(
          function(response) {
            $scope.featuredRestaurants = response.data;
            $scope.featuredLoading = false;
            console.log("featuredRestaurants", $scope.featuredRestaurants);
          },
          function(err) {
            console.log(err);
          }
        );
      }

      function getCurrentLoggedInUser() {
        $rootScope.currentUser = JSON.parse(LoginService.getCookieData());
        console.log("current user is", $scope.currentUser);
      }

      function viewRestaurant(restaurant) {
        console.log("restaurant passed is", restaurant);
        let id = restaurant._id;
        $location.url("/restaurant/" + id);
      }


    });
})();
