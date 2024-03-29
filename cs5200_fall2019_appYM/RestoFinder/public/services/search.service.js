(function () {
    angular
        .module("RestoFinder")
        .factory("SearchService", searchService);

    function searchService($http) {

        var api = {
            getSearchRestaurants: getSearchRestaurants,
            getSearchUsers: getSearchUsers
        };
        return api;
        function getSearchRestaurants(term){
            url = "http://localhost:5105/api/restaurant/search/" + term;
            return $http.get(url);
        }

        function getSearchUsers(term){
            url = "http://localhost:5105/api/user/search/" + term;
            return $http.get(url);
        }
        

    }
})();
