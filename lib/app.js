var t_app = angular.module('app', ['controllers', 'ngRoute']);
t_app.config(function ($routeProvider, $httpProvider) {
    $httpProvider.defaults.withCredentials = true;
    $routeProvider
            .when('/register', {
              templateUrl: 'webpage/register.html',
              controller: 'register'

            })
            .when('/login', {
                templateUrl: 'webpage/login.html',
                controller: 'login'

            })
            .when('/profile', {
              templateUrl: 'webpage/profile.html',
              controller: 'profile'

            })
            .when('/profile/setting', {
              templateUrl: 'webpage/setting.html',
              controller: 'setting'

            })
            .when('/profile/sell', {
              templateUrl: 'webpage/sell.html',
              controller: 'sell'

            })
            .when('/profile/buy', {
              templateUrl: 'webpage/buy.html',
              controller: 'buy'

            })
            .when('/profile/addcloset', {
              templateUrl: 'webpage/add_closet.html',
              controller: 'profile'

            })
            .when('/profile/deleted', {
              templateUrl: 'webpage/deleted.html',
              controller: 'delete'

            })
            .when('/admin', {
                templateUrl: 'webpage/admin.html',
                controller: 'admin'

            })
            .when('/friend/:a', {
              templateUrl: 'webpage/friend.html',
              controller: 'friend',

            })
            .when('/home', {
                templateUrl: 'webpage/home.html',
                controller: 'home'

            })
            .when('/follow', {
                templateUrl: 'webpage/follow.html',
                controller: 'home'

            })
            .when('/', {
                templateUrl: 'webpage/home.html',
                controller: 'home'
            })
            .otherwise({
                redirectTo: '/404',
                templateUrl: 'webpage/error.html'
            });
});

//service เป็นฟังก๋ชั่น
t_app.directive('toNumber', function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            ctrl.$parsers.push(function (value) {
                return parseFloat(value || '');
            });
        }
    };
});


t_app.service('MyService', ['$location', '$http', '$sce', '$rootScope', function ($location, $http, $sce, $rootScope, $routeParams) {

       var baseUrl = "http://192.168.42.230/apisom/public";
        var get = function (API) {// get data
            return $http({
                url: baseUrl + API, //มาจาก คอนโทรเลอร์ที่่เรียก
                method: "GET",
                dataType: "json",
                headers: {
               'Accept': 'application/json',
               'Content-Type': 'text/plain'
           },
              }).then(function successCallback(response) {
                    //Do noting
                    return response;
              }, function errorCallback(response) {
                    //is Error
                    //console.log('Error:' + data);
                });
            };
        var post = function (API, parameters) {// post data
            return $http({
                url: baseUrl + API,
                method: "POST",
                data: parameters,
                timeout: 60000
              }).then(function successCallback(response) {
                    return response;
              }, function errorCallback(response) {
                });
            };
        var patch = function (API, parameters) {// post data
            return $http({
                url: baseUrl + API,
                method: "PATCH",
                data: parameters
              }).then(function successCallback(response) {
                    return response;
              }, function errorCallback(response) {
                });
            };
        var del = function (API) {// get data
            return $http({
                url: baseUrl + API,
                method: "DELETE"
              }).then(function successCallback(response) {
                    return response;
              }, function errorCallback(response) {
                });
            };

        var checkLogin = function () {
            var datas = get('/register/checkUser');
             datas.then(function (res) {
               console.log(res.data.authen);
                if (res.data.authen == true) {
                    $rootScope.name = res.data.name;
                    $rootScope.username = res.data.username;
                    $rootScope.email = res.data.email;
                    $rootScope.id = res.data.id;
                    $rootScope.detail = res.data.detail;
                    $rootScope.admin = res.data.admin;
                    $('._loading').fadeOut(1000);
                    console.log("ยังอยู่ในระบบอยู่");
                    return res.data;
                } else {
                    $('._loading').fadeOut(1000);
                    $rootScope.logged = false;
                    $location.path('/login');
                    console.log("ออกจากระบบแล้ว");
                    return false;
                }
            });
        };

        var data_item_ = [];
        $rootScope.data_item_1 = [];
        var item_list_all = function (data) {
            if (data != undefined) {
                data_item_.push(data);
                $rootScope.data_item_1 = data_item_;
            } else {
            }
        };
        var item_list_all2 = function () {
            data_item_ = [];
            $rootScope.data_item_1 = [];
        };
        var urlParam = function (name) {
            var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
            if (results == null) {
                return null;
            }
            else {
                return results[1] || 0;
            }
        };
        return {// set namespace to function.
            get: get,
            post: post,
            patch: patch,
            checkLogin: checkLogin,
            item_list_all: item_list_all,
            item_list_all2: item_list_all2,
            del: del
        };
    }]);
