angular.module('starter.controllers', ['ngCordova'])

.controller('DashCtrl', function($scope, $cordovaSms, $cordovaContacts, $ionicPopup, $cordovaGeolocation) {

  $scope.user = {};

  document.addEventListener("deviceready", function () {

    var showAlert = function() {
      var alertPopup = $ionicPopup.alert({
        title: 'Message sent!!'
      });
    };

    $cordovaContacts.find({ multiple: true}).then(function(allContacts) { //omitting parameter to .find() causes all contacts to be returned
      $scope.contacts = allContacts.filter(function (phoneContact){
        return Array.isArray(phoneContact.phoneNumbers);
      });
      console.log($scope.contacts);
    });

    var sendText = function (message) {
      var posOptions = { timeout: 10000, enableHighAccuracy: false };
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
          var location = String(position.coords.latitude) + ',' + String(position.coords.longitude);
          $scope.gpsLocation = location;

          var textMessage = message + '  I am at https://maps.google.com/?q=' + location;
          var options = { android: { intent: '' }};

          $cordovaSms
            .send($scope.user.number, textMessage, options)
            .then(function() {
              showAlert();
            }, function(error) {
              $scope.gpsLocation = err.message;
            });

        }, function(err) {
          $scope.gpsLocation = err.message;
        });
    };

    $scope.sendOkayText = function() {
      sendText("I'm Okay. :-)");
    };

    $scope.sendHelpText = function() {
      sendText('Help me!!');
    };
  });


})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
