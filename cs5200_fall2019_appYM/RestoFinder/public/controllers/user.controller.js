(function() {
  angular
    .module("RestoFinder")
    .controller("UserController", function(
      $rootScope,
      $scope,
      $http,
      LoginService,
      $routeParams,
      UserService,
      $q,
      $location,
      ReviewService,
      RestaurantService,
      $mdDialog,
    ) {
      $scope.getLoggedInUser = getLoggedInUser();
      $scope.reviewsLoading = true;
      $scope.followsLoading = true;
      $scope.followedByLoading = true;
      $scope.favouritesLoading = true;
      $scope.endorsesLoading = true;
      $scope.endorsedByLoading = true;
      $scope.loggedEndorsesLoading = true;
      $scope.ownerRestaurant = null;
      function getLoggedInUser() {
        // body
        $scope.loggedUser = JSON.parse(LoginService.getCookieData());
        if ($scope.loggedUser != null && $scope.loggedUser) {
          $rootScope.currentUser = $scope.loggedUser;
          $scope.loggedUserType = $scope.loggedUser.userType;
          console.log("loggedUser is", $scope.loggedUser);
          getProfileUser();
        }
       
      }

      function getProfileUser() {
        let id = $routeParams.userId;
        UserService.getUser(id)
          .then(function(response) {
            $scope.user = response.data.user;
            $scope.userType = $scope.user.userType;
            console.log("response is", response.data);
            console.log("Profile of user to display is", $scope.user.username);
            getLoggedInUserFollows();
            getLoggedInUserFavourites();
            getUserReviews();
            getUserFollows();
            getUserFollowedBy();
            getUserFavourites();
            getUserEndorses();
            getLoggedInUserEndorses();
            getUserEndorsedBy();
            getOwnerRestaurant();
            //getAdvertisements();
            //getEventsForUser();
          })
          .catch(function(err) {
            console.log(err);
          });
      }

      function getUserReviews() {
        if ($scope.userType == "CUSTOMER") {
          let id = $scope.user._id;
          UserService.getReviews(id).then(
            function(response) {
              $scope.reviews = response.data;
              $scope.reviewsLoading = false;
            },
            function(err) {
              console.log("error in fetching reviews", err);
            }
          );
        }
      }

      function getUserFollows() {
        if ($scope.userType == "CUSTOMER") {
          let id = $scope.user._id;
          UserService.getFollows(id).then(
            function(response) {
              populatedUsers = [];
              $q.all(extractUsers(response.data, populatedUsers)).then(
                function(response) {
                  $scope.follows = angular.copy(populatedUsers);
                  console.log("follows are", $scope.follows);
                  $scope.followsLoading = false;
                },
                function(err) {
                  console.log(err);
                }
              );
            },
            function(err) {
              console.log("error in fetching folllows", err);
            }
          );
        }
      }
      function extractUsers(usersArray, populatedUsers) {
        console.log("users array is", usersArray);
        // populatedUsers = []
        promises = [];
        for (user of usersArray) {
          let promise = UserService.getUser(user);
          promise.then(
            function(response) {
              populatedUsers.push(response.data);
            },
            function(err) {
              console.log(err);
            }
          );
          promises.push(promise);
        }
        return promises;
      }
      function getUserFollowedBy() {
        if ($scope.userType == "CUSTOMER") {
          let id = $scope.user._id;
          UserService.getFollowedBy(id).then(
            function(response) {
              // $scope.followedBy = response.data;
              populatedUsers1 = [];
              $q.all(extractUsers(response.data, populatedUsers1)).then(
                function(response) {
                  $scope.followedBy = angular.copy(populatedUsers1);
                  $scope.followedByLoading = false;
                },
                function(err) {
                  console.log(err);
                }
              );
            },
            function(err) {
              console.log("error in fetching followedBy", err);
            }
          );
        }
      }

      function getUserEndorses() {
        if ($scope.userType == "CUSTOMER") {
          let id = $scope.user._id;
          UserService.getEndorses(id).then(
            function(response) {
              // $scope.endorses = response.data;
              endorsesUsers = [];
              $q.all(extractUsers(response.data, endorsesUsers)).then(
                function(response) {
                  $scope.endorses = angular.copy(endorsesUsers);
                  $scope.endorsesLoading = false;
                },
                function(err) {
                  console.log(err);
                }
              );
            },
            function(err) {
              console.log("error in fetching endorses", err);
            }
          );
        }
      }

      function getUserEndorsedBy() {
        if ($scope.userType == "OWNER") {
          let id = $scope.user._id;
          UserService.getEndorsedBy(id).then(
            function(response) {
              // $scope.endorsedBy = response.data;
              endorsedByUsers = [];
              $q.all(extractUsers(response.data, endorsedByUsers)).then(
                function(response) {
                  $scope.endorsedBy = angular.copy(endorsedByUsers);
                  $scope.endorsedByLoading = false;
                },
                function(err) {
                  console.log(err);
                }
              );
            },
            function(err) {
              console.log("error in fetching endorsedBy", err);
            }
          );
        }
      }

      $scope.viewProfile = function viewProfile(user) {
        let id = user._id;
        $location.url("/user/" + id);
      };

      $scope.unfollowUser = function unfollowUser(user, follow = null) {
        let userId1 = $scope.loggedUser._id;
        let userId2 = user._id;
        UserService.deleteFollow(userId1, userId2).then(
          function(response) {
            if (follow != null) {
              let index = $scope.follows.indexOf(follow);
              if (index > -1) {
                $scope.follows.splice(index, 1);
                console.log("user unfollowed, new follows is", $scope.follows);
              }
            }
            let index2 = $scope.loggedFollows.indexOf(userId2);
            //console.log("user id unfollowed is", );
            console.log("index find is", index2);
            if (index2 > -1) {
              $scope.loggedFollows.splice(index2, 1);
              checkUserInFollowsOfLoggedInUser();
            }
            console.log("followed by is ", $scope.followedBy);
            let index3 = getIndexOfLoggedUserInArray(
              $scope.loggedUser,
              $scope.followedBy
            );
            console.log("index3 returned is", index3); // $scope.followedBy.indexOf({user: $scope.loggedUser})
            if (index3 > -1) {
              console.log("index finding worked", index3);
              $scope.followedBy.splice(index3, 1);
            }
          },
          function(err) {
            console.log("error unfollowing", err);
          }
        );
      };
      function getIndexOfLoggedUserInArray(userToFind, userArray) {
        let returnIndex = null;
        userArray.forEach((element, index) => {
          console.log("element is", element.user._id);
          console.log("index is", index);
          console.log("user to find is", userToFind._id);
          if (element.user._id == userToFind._id) {
            returnIndex = index;
          }
        });
        return returnIndex;
      }
      $scope.deleteReview = function deleteReview(review) {
        // body
        let reviewId = review._id;
        ReviewService.removeReview(reviewId).then(
          function(response) {
            let index = $scope.reviews.indexOf(review);
            $scope.reviews.splice(index, 1);
          },
          function(err) {
            console.log("error in removing review", err);
          }
        );
      };

      $scope.updateReview = function updateReview(review, index) {
        let reviewId = review._id;
        $mdDialog.show({
          controller: "UpdateReviewController",
          templateUrl: "../views/create-review.dialog.view.html",
          parent: angular.element(document.body),
          clickOutsideToClose: false,
          scope: $scope,
          preserveScope: true,
          locals: {
            review: review,
            index: index
          }
        });
      };

      $scope.followUser = function followUser(user) {
        // body
        let userId1 = $scope.loggedUser._id;
        let userId2 = user._id;
        UserService.createFollow(userId1, userId2).then(
          function(response) {
            //    $scope.follows
            $scope.loggedFollows.push(userId2);
            console.log("current followed by is", $scope.followedBy);
            console.log("loggged user is", $scope.loggedUser);
            $scope.followedBy.push({
              user: $scope.loggedUser
            });
            checkUserInFollowsOfLoggedInUser();
          },
          function(err) {
            console.log("error following", err);
          }
        );
      };

      function getLoggedInUserFollows() {
        if ($scope.loggedUserType == "CUSTOMER") {
          let id = $scope.loggedUser._id;
          UserService.getFollows(id).then(
            function(response) {
              $scope.loggedFollows = response.data;
              checkUserInFollowsOfLoggedInUser();
              //checkUserInFollowsOfLoggedInUser();
            },
            function(err) {
              console.log("error in fetching folllows of logged In users", err);
            }
          );
        }
      }

      function getLoggedInUserFollowedBy() {}

      function checkUserInFollowsOfLoggedInUser() {
        // body
        $scope.userNotInLoggedInFollows = !$scope.loggedFollows.includes(
          $scope.user._id
        );

        // let id = user._id;
        // return $scope.loggedFollows.
      }

      function getUserFavourites() {
        if ($scope.userType == "CUSTOMER") {
          UserService.getFavorites($scope.user._id).then(
            function(response) {
              populateRestaurants = [];
              $q.all(
                extractRestaurants(response.data, populateRestaurants)
              ).then(
                function(response) {
                  $scope.favourites = angular.copy(populateRestaurants);
                  console.log("favourites are ", $scope.favourites);
                  $scope.favouritesLoading = false;
                },
                function(err) {
                  console.log(err);
                }
              );
            },
            function(err) {
              console.log(err);
            }
          );
        }
      }

      function getLoggedInUserFavourites() {
        if ($scope.loggedUserType == "CUSTOMER") {
          UserService.getFavorites($scope.loggedUser._id).then(
            function(response) {
              populateRestaurants1 = [];
              $q.all(
                extractRestaurants(response.data, populateRestaurants1)
              ).then(
                function(response) {
                  $scope.loggedFavourites = angular.copy(populateRestaurants1);
                  $scope.logggedFavouritesLoading = false;
                  getUserFavourites();
                },
                function(err) {
                  console.log(err);
                }
              );
            },
            function(err) {
              console.log(err);
            }
          );
        }
      }

      function extractRestaurants(restaurantsArray, populatedRestaurants) {
        // console.log("users array is", usersArray);
        // populatedUsers = []
        promises = [];
        for (restaurant of restaurantsArray) {
          let promise = RestaurantService.getRestaurant(restaurant);
          promise.then(
            function(response) {
              populatedRestaurants.push(response.data);
            },
            function(err) {
              console.log(err);
            }
          );
          promises.push(promise);
        }
        return promises;
      }

      $scope.unFavouriteRestaurant = function unFavouriteRestaurant(
        restaurant,
        index
      ) {
        UserService.deleteFavorite($scope.loggedUser._id, restaurant._id).then(
          function(response) {
            $scope.loggedFavourites.splice(index, 1);
            // Additional things after unfollowing
          },
          function(err) {
            console.log(err);
          }
        );
      };

      $scope.viewRestaurant = function viewRestaurant(restaurant) {
        $location.url("/restaurant/" + restaurant._id);
      };

      $scope.unEndorseOwner = function unEndorseOwner(owner, index = null) {
        // body

        UserService.deleteEndorse($scope.loggedUser._id, owner._id).then(
          function(response) {
            if (index != null) {
              $scope.endorses.splice(index, 1);
            }
            let index2 = $scope.loggedEndorses.indexOf(owner._id);
            //console.log("user id unfollowed is", );
            console.log("index find is", index2);
            if (index2 > -1) {
              $scope.loggedEndorses.splice(index2, 1);
              checkUserInEndorseOfLoggedInUser();
            }
            let index3 = getIndexOfLoggedUserInArray(
              $scope.loggedUser,
              $scope.endorsedBy
            ); //$scope.endorsedBy.indexOf({user: $scope.loggedUser})
            if (index3 > -1) {
              $scope.endorsedBy.splice(index3, 1);
            }
          },
          function(err) {
            console.log("error in unendorsing owner", err);
          }
        );
      };

      function getLoggedInUserEndorses() {
        let id = $scope.loggedUser._id;
        if ($scope.loggedUserType == "CUSTOMER") {
          UserService.getEndorses(id).then(
            function(response) {
              $scope.loggedEndorses = response.data;
              $scope.loggedEndorsesLoading = false;
              checkUserInEndorseOfLoggedInUser();
            },
            function(err) {
              console.log("error in fetching logged endorses", err);
            }
          );
        }
      }

      $scope.endorseUser = function endorseUser(owner) {
        let userId1 = $scope.loggedUser._id;
        let userId2 = owner._id;

        UserService.createEndorse(userId1, userId2).then(
          function(response) {
            console.log("response after endorsing", response.data);
            $scope.loggedEndorses.push(response.data.user2._id);
            $scope.endorsedBy.push({
              user: $scope.loggedUser
            });
            checkUserInEndorseOfLoggedInUser();
          },
          function(err) {
            console.log("Error in endorsing user", err);
          }
        );
      };

      function checkUserInEndorseOfLoggedInUser() {
        // body
        $scope.userNotInLoggedInEndorses = !$scope.loggedEndorses.includes(
          $scope.user._id
        );

        // let id = user._id;
        // return $scope.loggedFollows.
      }
      function getLoggedInUserEndorsedBy() {
        // pass
      }

      function getOwnerRestaurant() {
        if ($scope.userType == "OWNER") {
          let ownerId = $scope.user._id;
          UserService.getOwnerRestaurant(ownerId).then(
            function(response) {
              console.log("owner restaurant is", response.data);
              $scope.ownerRestaurant = response.data;
              console.log("owner", $scope.ownerRestaurant);
            },
            function(err) {
              console.log(err);
            }
          );
        }
      }

      $scope.createOwnerRestaurant = function createOwnerRestaurant() {
        // pass
      };

      $scope.unClaimRestaurant = function unClaimRestaurant() {
        let restaurantId = $scope.ownerRestaurant._id;
        let ownerId = $scope.loggedUser._id;

        UserService.deleteOwnerRestaurant(ownerId, restaurantId).then(
          function(response) {
            $scope.ownerRestaurant = null;
          },
          function(err) {
            console.log("err");
          }
        );
      };

      // function getAdvertisements() {
      //   if ($scope.userType == "ADVERTISER") {
      //     UserService.getAdvertisementsForUser($scope.user._id).then(
      //       function(response) {
      //         console.log("fetching advertisements", response.data);
      //         $scope.advertisements = response.data;
      //         $scope.advertisementsLoading = false;
      //       },
      //       function(err) {
      //         console.log(err);
      //       }
      //     );
      //   }
      // }
      
      $scope.updateUser = function updateUser(){
        $location.url('update-user' + "/" + $scope.loggedUser._id);
      }

      // $scope.deleteAdvertisement = function deleteAdvertisement(
      //   advertisement,
      //   index
      // ) {
      //   AdvertisementService.deleteAdvertisement(advertisement._id).then(
      //     function(response) {
      //       $scope.advertisements.splice(index, 1);
      //     },
      //     function(err) {
      //       console.log(err);
      //     }
      //   );
      // };

      // $scope.updateAdvertisement = function updateAdvertisement(
      //   advertisement,
      //   index
      // ) {
      //   $mdDialog.show({
      //     controller: "UpdateAdvertisementController",
      //     templateUrl: "../views/create-advertisement.dialog.view.html",
      //     parent: angular.element(document.body),
      //     clickOutsideToClose: false,
      //     scope: $scope,
      //     preserveScope: true,
      //     locals: {
      //       advertisement: advertisement,
      //       index: index
      //     }
      //   });




        
      // };
      //
      // $scope.createAdvertisement = function createAdvertisement() {
      //   console.log("in heres");
      //   $mdDialog.show({
      //     controller: "AdvertisementController",
      //     templateUrl: "../views/create-advertisement.dialog.view.html",
      //     parent: angular.element(document.body),
      //     clickOutsideToClose: false,
      //     scope: $scope,
      //     preserveScope: true
      //     // locals: {
      //     //   review: review,
      //     //   index: index
      //     // }
      //   });
      // };

    //   function getEventsForUser() {
    //     if ($scope.userType == "OWNER") {
    //       let userId = $scope.user._id;
    //       UserService.getEventsForUser(userId).then(
    //         function(response) {
    //           $scope.events = response.data;
    //           $scope.eventsLoading = false;
    //         },
    //         function(err) {
    //           console.log(err);
    //         }
    //       );
    //     }
    //     else{
    //       $scope.eventsLoading = true;
    //     }
    //   }
    //
    //   $scope.deleteEvent = function deleteEvent(event, index) {
    //     let eventId = event._id;
    //     EventService.deleteEvent(eventId).then(
    //       function(response) {
    //         $scope.events.splice(index, 1);
    //       },
    //       function(err) {
    //         console.log("unable to delete event", err);
    //       }
    //     );
    //   };
    //
    //   // create and update event in model
    //   $scope.createEvent = function createEvent(){
    //     console.log("in create event");
    //     console.log("logged user is" ,$scope.loggedUser);
    //     if($scope.loggedUser.owner.hasOwnProperty('restaurant') || $scope.ownerRestaurant != null){
    //       // dialog here
    //       $mdDialog.show({
    //         controller: "CreateEventController",
    //         templateUrl: "../views/create-event.dialog.view.html",
    //         parent: angular.element(document.body),
    //         clickOutsideToClose: false,
    //         scope: $scope,
    //         preserveScope: true
    //         // locals: {
    //         //   review: review,
    //         //   index: index
    //         // }
    //       });
    //     }
    //     else{
    //       alert("You don't own a restaurant, claim a restaurant first for creating events");
    //     }
    //   }
    //
    //   $scope.updateEvent = function updateEvent(event, index) {
    //     // body
    //     console.log("in update event");
    //     $mdDialog.show({
    //       controller: "UpdateEventController",
    //       templateUrl: "../views/create-event.dialog.view.html",
    //       parent: angular.element(document.body),
    //       clickOutsideToClose: false,
    //       scope: $scope,
    //       preserveScope: true,
    //       locals: {
    //          event: event,
    //          index: index
    //        }
    //     });
    //   }
    //
    //
    // })
    // .controller('UpdateReviewController', function(
    //   $scope,
    //   $mdDialog,
    //   review,
    //   index,
    //   ReviewService
    // ) {
    //   let date = new Date();
    //   date = date.toString();
    //   $scope.type = "Update";
    //   $scope.dataLoading = false;
    //   $scope.newReview = {
    //     user: $scope.loggedUser._id,
    //     restaurant: review.restaurant._id,
    //     rating: review.rating,
    //     text: review.text,
    //     time_created: date,
    //     url: "",
    //     yelp_review: false
    //   };
    //   $scope.postReview = function postReview() {
    //     // body
    //     $scope.dataLoading = true;
    //     console.log("review being posted is", $scope.newReview);
    //     ReviewService.updateReview(review._id, $scope.newReview).then(
    //       function(response) {
    //         $scope.reviews.splice(index, 1);
    //         $scope.reviews.push(response.data);
    //         $mdDialog.cancel();
    //       },
    //       function(err) {
    //         console.log(err);
    //       }
    //     );
    //   };
    //
    //   $scope.cancel = function cancel() {
    //     // body
    //     $mdDialog.cancel();
    //   };
    // })

    // .controller("AdvertisementController", function(
    //   $scope,
    //   $mdDialog,
    //   AdvertisementService
    // ) {
    //   let date = new Date();
    //   date = date.toString();
    //   $scope.type = "Create";
    //   $scope.dataLoading = false;
    //   $scope.newAdvertisment = {
    //     advertiser: $scope.loggedUser._id,
    //     text: $scope.text,
    //     posted_on: date,
    //     image_url: "",
    //     url: $scope.url
    //   };
    //   $scope.postAdvertisement = function postAdvertisement() {
    //     // body
    //     $scope.dataLoading = true;
    //     console.log("advertisment being posted is", $scope.newAdvertisment);
    //     AdvertisementService.createAdvertisement($scope.newAdvertisment).then(
    //       function(response) {
    //         $scope.advertisements.push(response.data);
    //         $mdDialog.cancel();
    //       },
    //       function(err) {
    //         console.log(err);
    //         $mdDialog.cancel();
    //       }
    //     );
    //   };
    //
    //   $scope.cancel = function cancel() {
    //     // body
    //     $mdDialog.cancel();
    //   };
    // })

    // .controller("UpdateEventController", function(
    //   $scope,
    //   $mdDialog,
    //   EventService,
    //   event,
    //   index
    // ) {
    //   let date = new Date();
    //   date = date.toString();
    //   $scope.type = "Update";
    //   $scope.dataLoading = false;
    //   // let restaurantId =null;
    //   // if($scope.ownerRestaurant != null){
    //   //   restaurantId = $scope.ownerRestaurant._id;
    //   // }
    //   // else{
    //   //   restaurantId = $scope.loggedUser.owner.restaurant;
    //   // }
    //   $scope.newEvent = {
    //     name: event.name,
    //     owner: $scope.loggedUser._id,
    //     restaurant: event.restaurant._id,
    //     start_time: event.start_time,
    //     end_time: event.end_time,
    //     description: event.description,
    //     price: event.price,
    //     age: ""
    //
    //
    //   };
    //   $scope.postEvent = function postEvent() {
    //     // body
    //     $scope.dataLoading = true;
    //     console.log("event being posted is", $scope.newEvent);
    //     EventService.updateEvent(event._id, $scope.newEvent).then(
    //       function(response) {
    //         console.log("response is", response);
    //         $scope.events.splice(index,1);
    //         $scope.events.push(response.data);
    //         //$scope.eventsLoading = false;
    //         $mdDialog.cancel();
    //       },
    //       function(err) {
    //         console.log(err);
    //         $mdDialog.cancel();
    //       }
    //     );
    //   };
    //
    //   $scope.cancel = function cancel() {
    //     // body
    //     $mdDialog.cancel();
    //   };
    // })
    //
    // .controller("CreateEventController", function(
    //   $scope,
    //   $mdDialog,
    //   EventService
    // ) {
    //   let date = new Date();
    //   date = date.toString();
    //   $scope.type = "Create";
    //   $scope.dataLoading = false;
    //   let restaurantId =null;
    //   if($scope.ownerRestaurant != null){
    //     restaurantId = $scope.ownerRestaurant._id;
    //   }
    //   else{
    //     restaurantId = $scope.loggedUser.owner.restaurant;
    //   }
    //   $scope.newEvent = {
    //     name: $scope.name,
    //     owner: $scope.loggedUser._id,
    //     restaurant:restaurantId,
    //     start_time: $scope.start_time,
    //     end_time: $scope.end_time,
    //     description: $scope.description,
    //     price: $scope.price,
    //     age: ""
    //
    //
    //   };
    //   $scope.postEvent = function postEvent() {
    //     // body
    //     $scope.dataLoading = true;
    //     console.log("event being posted is", $scope.newEvent);
    //     EventService.createEvent($scope.newEvent).then(
    //       function(response) {
    //         console.log("response is", response);
    //         $scope.events.push(response.data[0]);
    //         $scope.eventsLoading = false;
    //         $mdDialog.cancel();
    //       },
    //       function(err) {
    //         console.log(err);
    //         $mdDialog.cancel();
    //       }
    //     );
    //   };
    //
    //   $scope.cancel = function cancel() {
    //     // body
    //     $mdDialog.cancel();
    //   };
    // })
    //
    //
    // .controller("UpdateAdvertisementController", function(
    //   $scope,
    //   $mdDialog,
    //   AdvertisementService,
    //   advertisement,
    //   index
    // ) {
    //   let date = new Date();
    //   date = date.toString();
    //   $scope.type = "Update";
    //   $scope.dataLoading = false;
    //   $scope.newAdvertisment = {
    //     advertiser: $scope.loggedUser._id,
    //     text: advertisement.text,
    //     posted_on: advertisement.posted_on,
    //     image_url: "",
    //     url: advertisement.url
    //   };
    //   $scope.postAdvertisement = function postAdvertisement() {
    //     // body
    //     $scope.dataLoading = true;
    //     console.log("advertisment being posted is", $scope.newAdvertisment);
    //     AdvertisementService.updateAdvertisement(advertisement._id,$scope.newAdvertisment).then(
    //       function(response) {
    //         $scope.advertisements.splice(index, 1);
    //         $scope.advertisements.push(response.data);
    //         $mdDialog.cancel();
    //       },
    //       function(err) {
    //         $mdDialog.cancel()
    //         console.log(err);
    //       }
    //     );
      // };
    //
    //   $scope.cancel = function cancel() {
    //     // body
    //     $mdDialog.cancel();
    //   };
    })
})();
