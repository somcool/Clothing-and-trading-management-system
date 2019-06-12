"use strict";
var ctrl = angular.module('controllers', []);
ctrl.controller('login', function ($scope, MyService, $location) {
  $scope.check = true;
  $('._loading').fadeOut(1000);
  $('title').html("Login | Project SB");
  $scope.addlogin = function () {
      $('._loading').fadeIn(10);
      $scope.check = false;
      $scope.data_login = {
          username: $scope.login.username,
          password: $scope.login.password
      };
      // console.log($scope.data_login);
      var rs = MyService.post('/register/loginUser', $scope.data_login);
      rs.then(function (resf) {
       $scope.menu = resf.data.status_code;
        $scope.admin_ = resf.data.admin;
        if ($scope.menu == 200) {
            swal("สำเร็จ!", "เข้าสู่ระบบสำเร็จ คุณสามารถใช้งานระบบได้แล้ว!!", "success");
            if ($scope.admin_ == 1) {
                $location.path('/admin');
            } else if ($scope.admin_ == 0) {
                $location.path('/profile');
            }
        }else if ($scope.menu == 401) {
            $('._loading').fadeOut(1000);
            swal("ERROR!", "กรอก Username หรือ Password  ผิด", "error");
            $scope.check = true;
        }else if ($scope.menu == 405) {
            $('._loading').fadeOut(1000);
            swal("ERROR!", "Username ถูกระงับการใช้งานติดต่อแอดมิน", "error");
            $scope.check = true;
        }
      });
  };
});

ctrl.controller('register', function ($scope, MyService ,$location) {
  $scope.check = true;
  $('._loading').fadeOut(1000);
  $('title').html("Register | Project SB");
   $scope.addregister = function(){
     $('._loading').fadeIn(10);
     $scope.check = true;
     $scope.data_register = {
         name: $scope.register.name,
         username: $scope.register.username,
         email: $scope.register.email,
         password: $scope.register.password
     };
     console.log($scope.data_register);
     var rs = MyService.post('/register/registerUser', $scope.data_register);
     rs.then(function (resf) {
      $scope.menu = resf.data.status_code;
       if ($scope.menu == 200) {
           $('._loading').fadeOut(1000);
           swal("สำเร็จ!", "สมัครสมาชิกสำเร็จ", "success");
           $location.path('/profile');
       }else if ($scope.menu == 400) {
           $('._loading').fadeOut(1000);
           swal("ERROR!", "Username  ซ้ำ", "error");
           $scope.check = true;
       }
     });
   };
});

ctrl.controller('profile', function ($scope, MyService, $rootScope, $location, $http , $routeParams, $filter) {
  MyService.checkLogin();
  $scope.logout = function () {
      var rs = MyService.get('/register/logoutUser');
      rs.then(function (resf) {
          swal("ออกจากระบบสำเร็จ");
          MyService.checkLogin();
      });
  };

  $('._loading').fadeOut(1000);
  $('title').html("Profile | Project SB");
// ----------------------------------------------------
    $scope.reload = function () {
        location.reload();
    };
// --------------------------------------------------
// ===== Scroll to Top ====
$(window).scroll(function() {
    if ($(this).scrollTop() >= 50) {        // If page is scrolled more than 50px
        $('#return-to-top').fadeIn(200);    // Fade in the arrow
    } else {
        $('#return-to-top').fadeOut(200);   // Else fade out the arrow
    }
});
$('#return-to-top').click(function() {      // When arrow is clicked
    $('body,html').animate({
        scrollTop : 0                       // Scroll to top of body
    }, 500);
});
// ------------- show type,brand,color --------------
      var rs = MyService.get('/profile/showType');
      rs.then(function (resf) {
          $scope.show_brand = resf.data.brand;
          $scope.show_color = resf.data.color;
          $scope.show_type = resf.data.type;

          // console.log(resf.data.brand);
          // console.log(resf.data.type);
          // console.log(resf.data.color);
      });


// ---------------------------------------------------------------------
$scope.add = "เพิ่มข้อมูล";
$scope.submit = "Submit";
$scope.editcloset = function (data) {
    $scope.add = "แก้ไขข้อมูล";
    $scope.submit = "Edit";
    $scope.aadd = false;
    $('#ppro').css('background', '#ffcc99');
    $scope.form = angular.copy(data);
    console.log($scope.form);
};

// --------------- add closet ---- add image ------------------

// upload images in folder frontend หน้าบ้านจะเป็นคนเก็บไฟล์รูปภาพลง folder ของตัวเองเอง
      $scope.form = [];
      $scope.files = [];
      $scope.add_closet = function() {

        $scope.form.image = $scope.files[0];
        console.log($scope.form.image);

      $http({
          method  : 'POST',
          url     : 'webpage/upload_closet.php',
          transformRequest: function (data) {
              var formData = new FormData();
              formData.append("image", $scope.form.image);
              return formData;
          },
          data : $scope.form,
          headers: {
                 'Content-Type': undefined
          }
      }).then(function(data){
        console.log(data.data);
        // $scope.check = false;

        if (!$scope.form.idi) {
        $scope.data_add_closet = {
             type_id: $scope.form.type_id,
             price: $scope.form.price,
             brand_id: $scope.form.brand_id,
             color_id: $scope.form.color_id,
             image: data.data,
             detail: $scope.form.detail
        };
        console.log($scope.data_add_closet);
        var rs = MyService.post('/profile/addImage', $scope.data_add_closet);
        rs.then(function (resf) {
          $scope.menu = resf.data.status_code;
           if ($scope.menu == 200) {
               // $('._loading').fadeOut(1000);
               $scope.form = {};
               $scope.show_closet();
               $location.path('/profile');
               swal("สำเร็จ!", "เพิ่มข้อมูลเรียบร้อย", "success");
           }else if ($scope.menu == 400) {
             swal("ERROR!", "ข้อมูลไม่ถูกต้องกรุณาทำรายการใหม่!!", "error");
             $scope.form = {};
            $('._loading').fadeOut(1000);
           }
        });
      } else {
        $scope.data_pro_edit = {
            idi: $scope.form.idi,
            type_id: $scope.form.type_id,
            price: $scope.form.price,
            brand_id: $scope.form.brand_id,
            color_id: $scope.form.color_id,
            image: data.data,
            detail: $scope.form.detail
        };
        console.log($scope.data_pro_edit);
        var rs = MyService.post('/profile/editImageDetail', $scope.data_pro_edit);
        rs.then(function (resf) {
          $scope.menu = resf.data.status_code;
            if ($scope.menu == 400) {
                swal("ERROR!", resf.data.message, "error");
                $('._loading').fadeOut(1000);
            } else if ($scope.menu == 200) {
                $('._loading').fadeOut(1000);
                // swal("สำเร็จ!", "แก้ไขเรียบร้อบแล้วคะ!!", "success");
                $scope.show_closet();
                $scope.form = {};
                location.reload();
                $scope.add = "เพิ่มสินค้า";
                $scope.submit = "Submit";
                $('#ppro').css('background', '#fff');
                // $scope.check = true;
            }
        });

      }
  });
};

$scope.delcloset = function (id) {
    swal({title: "คุณต้องการลบข้อมูลจริงหรือไม่ ?",
        text: "",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff6666",
        confirmButtonText: "ใช่!",
        closeOnConfirm: true,
        html: false
    },
            function (data) {
                $('._loading').fadeIn(10);
                if (data) {
                  console.log(id);
                    var rs = MyService.del('/profile/delImageDetail/' + id);
                    rs.then(function (resf) {
                        $('._loading').fadeOut(500);
                        if (resf.data.status_code == 400) {
                            swal("ERROR!", resf.data.message, "error");
                        } else if (resf.data.status_code == 200) {
                            swal("สำเร็จ!", "เพิ่มเรียบร้อบแล้วคะ!!", "success");
                            $scope.show_closet();
                            $scope.form = {};
                            $scope.show_post();
                        }
                    });
                }else {
                  $('._loading').fadeOut(500);
                }

            });
};

$scope.sellcloset = function (id) {
    swal({
        title: "คุณต้องการขายจริงจริงหรือไม่ ?",
        text: "",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff6666",
        confirmButtonText: "ใช่ ต้องการ!",
        closeOnConfirm: true,
        html: false
    },
            function (data) {
                $('._loading').fadeIn(10);
                if (data) {
                  console.log(id);
                    var rs = MyService.get('/order/Sell/' + id);
                    rs.then(function (resf) {
                        $('._loading').fadeOut(500);
                        $scope.menu = resf.data.status_code;
                        if ($scope.menu == 400) {
                            swal("ERROR!", "ขายยังไม่ได้ ต้องเพิ่มธนาคารก่อน!!", "error");
                        } else if ($scope.menu == 200) {
                            swal("สำเร็จ!", "ประกาศขายสินค้าเรียบร้อยแล้วค่ะ!!", "success");
                            $scope.show_closet();
                            $scope.show_post();
                        }
                    });
                }else {
                  $('._loading').fadeOut(500);
                }

            });
};


      $scope.uploadedFile = function(element) {
        $scope.currentFile = element.files[0];
        var reader = new FileReader();
        reader.onload = function(event) {
            $scope.image_source = event.target.result
            $scope.$apply(function($scope) {
              $scope.files = element.files;
            });
        }
           reader.readAsDataURL(element.files[0]);
      }

// --------------------- show image closet ID ตั่งต่าง ----------------------------

$scope.show_closet = function () {
      var rs = MyService.get('/profile/showImage');
      rs.then(function (resf) {
          $scope.show_pic = resf.data.dataImg;
          // $scope.show_d = resf.data.showimgdel;
          $scope.show_pro = resf.data.showphoto;

          console.log(resf.data.dataImg);
          // console.log(resf.data.showimgdel);
          console.log(resf.data.showphoto);

      });
  };
  $scope.show_closet();

  // ---------------------------

        $scope.search_date = function () {

            var date = $filter('date')($scope.search.status_date, "yyyy-MM-dd");
            console.log(date);
            var rs = MyService.post('/profile/showImage', {searchDate: date});
            rs.then(function (resf) {
              $scope.show_pic = resf.data.dataImg;
                    console.log(resf.data.data.dataImg);
            });
        };

        // ----------------------

        $scope.search_price = function () {
            $scope.data_price = {
                searchPrice1: $scope.search.min,
                searchPrice2: $scope.search.max
        };
        console.log($scope.data_price);
            var rs = MyService.post('/profile/showImage', $scope.data_price);
            rs.then(function (resf) {
              $scope.show_pic = resf.data.dataImg;
              console.log(resf.data);
            });
        };


        // --------------search type----------------
        $scope.search_all = function () {
            var rs = MyService.get('/profile/showImage');
            rs.then(function (resf) {
              $scope.show_pic = resf.data.dataImg;
              console.log(resf.data);
            });
        };
        $scope.search_shirt = function () {
            var rs = MyService.get('/profile/showShirt');
            rs.then(function (resf) {
              $scope.show_pic = resf.data;
              console.log(resf.data);
            });
        };
        $scope.search_skirt = function () {
            var rs = MyService.get('/profile/showSkirt');
            rs.then(function (resf) {
              $scope.show_pic = resf.data;
              console.log(resf.data);
            });
        };
        $scope.search_pants = function () {
            var rs = MyService.get('/profile/showPants');
            rs.then(function (resf) {
              $scope.show_pic = resf.data;
              console.log(resf.data);
            });
        };
        $scope.search_shoes = function () {
            var rs = MyService.get('/profile/showShoes');
            rs.then(function (resf) {
              $scope.show_pic = resf.data;
              console.log(resf.data);
            });
        };
        $scope.search_dress = function () {
            var rs = MyService.get('/profile/showDress');
            rs.then(function (resf) {
              $scope.show_pic = resf.data;
              console.log(resf.data);
            });
        };
        $scope.search_bag = function () {
            var rs = MyService.get('/profile/showBag');
            rs.then(function (resf) {
              $scope.show_pic = resf.data;
              console.log(resf.data);
            });
        };
        $scope.search_accessories = function () {
            var rs = MyService.get('/profile/showAccessories');
            rs.then(function (resf) {
              $scope.show_pic = resf.data;
              console.log(resf.data);
            });
        };
        // ---------------search color----------------------
        $scope.search_all = function () {
          var rs = MyService.get('/profile/showImage');
            rs.then(function (resf) {
              $scope.show_pic = resf.data.dataImg;
              console.log(resf.data.dataImg);
            });
        };
        $scope.search_full = function () {
            var rs = MyService.get('/profile/colorOther');
            rs.then(function (resf) {
              $scope.show_pic = resf.data;
              console.log(resf.data);
            });
        };
        $scope.search_gray = function () {
            var rs = MyService.get('/profile/colorGray');
            rs.then(function (resf) {
              $scope.show_pic = resf.data;
              console.log(resf.data);
            });
        };
        $scope.search_black = function () {
            var rs = MyService.get('/profile/colorBlack');
            rs.then(function (resf) {
              $scope.show_pic = resf.data;
              console.log(resf.data);
            });
        };
        $scope.search_blue = function () {
            var rs = MyService.get('/profile/colorBlue');
            rs.then(function (resf) {
              $scope.show_pic = resf.data;
              console.log(resf.data);
            });
        };
        $scope.search_green = function () {
            var rs = MyService.get('/profile/colorGreen');
            rs.then(function (resf) {
              $scope.show_pic = resf.data;
              console.log(resf.data);
            });
        };
        $scope.search_red = function () {
            var rs = MyService.get('/profile/colorRed');
            rs.then(function (resf) {
              $scope.show_pic = resf.data;
              console.log(resf.data);
            });
        };
        $scope.search_pink = function () {
            var rs = MyService.get('/profile/colorPink');
            rs.then(function (resf) {
              $scope.show_pic = resf.data;
              console.log(resf.data);
            });
        };
        $scope.search_orange = function () {
            var rs = MyService.get('/profile/colorOrange');
            rs.then(function (resf) {
              $scope.show_pic = resf.data;
              console.log(resf.data);
            });
        };
        $scope.search_yellow = function () {
            var rs = MyService.get('/profile/colorYellow');
            rs.then(function (resf) {
              $scope.show_pic = resf.data;
              console.log(resf.data);
            });
        };
        $scope.search_woody = function () {
            var rs = MyService.get('/profile/colorBrown');
            rs.then(function (resf) {
              $scope.show_pic = resf.data;
              console.log(resf.data);
            });
        };
        $scope.search_m = function () {
            var rs = MyService.get('/profile/colorPurple');
            rs.then(function (resf) {
              $scope.show_pic = resf.data;
              console.log(resf.data);
            });
        };
        $scope.search_white = function () {
            var rs = MyService.get('/profile/colorWhite');
            rs.then(function (resf) {
              $scope.show_pic = resf.data;
              console.log(resf.data);
            });
        };

// -----------------------------------------------------------------------------

  $scope.show_detail_ = function(id){
    var rs = MyService.get('/profile/ImageDetail/' + id);
         rs.then(function (resf) {
           $scope.show_detail = resf.data.item;
           console.log(resf.data.item);
           console.log(id);
      });
    };

// -------------------------------- total post wer wing --------------------------------
$scope.show_post = function () {
  var rs = MyService.get('/profile/countPost2');
       rs.then(function (resf) {
         $scope.total_post = resf.data.post;
         $scope.total_follower = resf.data.wer;
         $scope.total_following = resf.data.wing;
         console.log(resf.data.post , resf.data.wer , resf.data.wing);
    });
  };
  $scope.show_post();

  // ------------------------------show wer wing in profile---------------------------------------------
        var rs = MyService.get('/profile/showFollow');
        rs.then(function (resf) {
          $scope.follower = resf.data.showwer;
          $scope.following = resf.data.showwing;

          // console.log(resf);
          console.log(resf.data.showwer);
          console.log(resf.data.showwing);
        });
// ----------------------  edit and add image profile  ------------------------
       $scope.form1 = [];
       $scope.files = [];

       $scope.add_pic = function() {
         $scope.form.image1 = $scope.files[0];
         console.log($scope.form.image1);
         $http({
       method  : 'POST',
       url     : 'webpage/upload_picture.php',
       transformRequest: function (data) {
           var formData = new FormData();
           formData.append("image", $scope.form.image1);
           return formData;
       },
       data : $scope.form1,
       headers: {
              'Content-Type': undefined
       }
      }).then(function(data){
        console.log(data.data);
        $scope.data_add_profile = {
             photo_name: data.data
        };
        console.log($scope.data_add_profile);
        var rs = MyService.post('/profile/addImageProfile', $scope.data_add_profile);
        rs.then(function (resf) {
          $scope.menu = resf.data.status_code;
           if ($scope.menu == 200) {
               $('._loading').fadeOut(1000);
                // swal("สำเร็จ!", "เพิ่มข้อมูลเรียบร้อย", "success");
                $scope.show_closet();
                $scope.form = {};
                location.reload();
           }else{
             $('._loading').fadeOut(500);
           }
        });
 });

};
       $scope.uploadedFile = function(element) {
       $scope.currentFile = element.files[0];
       var reader = new FileReader();
       reader.onload = function(event) {
         $scope.image_source = event.target.result
         $scope.$apply(function($scope) {
           $scope.files = element.files;
         });
       }
          reader.readAsDataURL(element.files[0]);
     }
// ---------------------------------edit closert---------------------------------------
});

ctrl.controller('delete', function ($scope, MyService){
  MyService.checkLogin();
  $scope.logout = function () {
      var rs = MyService.get('/register/logoutUser');
      rs.then(function (resf) {
          swal("ออกจากระบบสำเร็จ");
          MyService.checkLogin();
      });
  };

  $('._loading').fadeOut(1000);
  $('title').html("Delete | Project SB");
// ----------------------------------------------------
    var rs = MyService.get('/profile/showImage');
      rs.then(function (resf) {
        $scope.show_d = resf.data.showimgdel;
        console.log(resf.data.showimgdel);
      });
// ----------------------------------------------------
});

ctrl.controller('buy',function ($scope, MyService, $rootScope, $location, $http) {
  MyService.checkLogin();
  $scope.logout = function () {
      var rs = MyService.get('/register/logoutUser');
      rs.then(function (resf) {
          swal("ออกจากระบบสำเร็จ");
          MyService.checkLogin();
      });
  };


  $('._loading').fadeOut(1000);
  $('title').html("Buy | Project SB");
  // ---------------------------
  $scope.tab = 1;

  $scope.setTab = function(newTab){
    $scope.tab = newTab;
  };

  $scope.isSet = function(tabNum){
    return $scope.tab === tabNum;
  };

  // ----------------------------------------------------------------- tab 1 buy
    // $scope.buyy = function () {
        var rs = MyService.get('/order/OrderBuy');
        rs.then(function (resf) {
          $scope.show_data_buy = resf.data.data;
          $scope.show_data_detail = resf.detail;
          console.log(resf);
        });
    // };
    // $scope.buyy();
    // ------------------------------------------------------------
    $scope.buyy_detail = function (id) {
          var rs = MyService.get('/order/detail3/' +id);
          rs.then(function (resf) {
              $scope.buyy_detail_data = resf.data.data;
              $scope.buyy_detail_detail = resf.data.detail;
              $('#myModall5').modal("show");
              console.log(resf.data.data);
              console.log(resf.data.detail);

          });
      };
  // ------------------------------------------------------------------ tab2 buyy
  $scope.show_confrim_ = function () {
        var rs = MyService.get('/order/showConfirmSell' );
        rs.then(function (resf) {
            $scope.show_confrim_data = resf.data.data;
            $scope.show_confrim_detail = resf.data.detail;
            // $scope.show_confrim_account = resf.data.account;
            // console.log(resf.data);
            // console.log(resf.data.detail);
        });
    };
    // ------------------------- cancel Buy now
      $scope.cancel_confirm = function (data) {
        var rs = MyService.get('/order/canceledBuy/' + data);
        rs.then(function (resf){
          $scope.menu = resf.data.status_code;
           if ($scope.menu == 200) {
               swal("สำเร็จ!", "ยกเลิกการสั่งสินค้า", "success");
               // $scope.order_me();
               $('._loading').fadeOut(1000);
               $scope.show_confrim_();

           }else if ($scope.menu == 400) {
               $('._loading').fadeOut(1000);
               swal("ERROR!", "คุณทำรายการไม่ถูกต้อง", "error");
           }
        });
      };
      // ---------------------confirm and / add transfer ------------------------
      $scope.confirm_transfer = function(id){
        var rs = MyService.get('/order/detail3/' + id);
             rs.then(function (resf) {
               $scope.show_confirm_transfer_data = resf.data.data;
               $scope.show_confirm_transfer_detail= resf.data.detail;
               $scope.show_confirm_transfer_bank= resf.data.bank;
               $('#myModall1').modal("show");
               console.log(resf.data.data);
               console.log(resf.data.detail);
               console.log(resf.data.bank);


          });
          $scope.form2 = angular.copy(id);
          // console.log($scope.form2);
        };
  // ------------------------------------------------------------------------ tab 3 buyy
  // $scope.cancel_reply = function () {

        var rs = MyService.get('/order/showSellCanceledBuy');
        rs.then(function (resf) {
            $scope.cancel_reply_data = resf.data.data;
            console.log(resf);
        });
    // };
    // $scope.cancel_reply();
    // ----------------------------------------------------------
      $scope.reply = function (id) {
            var rs = MyService.get('/order/detail3/' +id);
            rs.then(function (resf) {
                $scope.reply_data = resf.data.data;
                $scope.reply_detail = resf.data.detail;
                $('#myModall4').modal("show");
                console.log(resf.data.data);
                console.log(resf.data.detail);
            });
        };
  // ------------------------------------------------------------------------ tab 4 buy
  // $scope.Buyer_Paid = function () {
        var rs = MyService.get('/order/BuyerPaid');
        rs.then(function (resf) {
            $scope.Buyer_Paid_data = resf.data.data;
            // console.log(resf);

        });
        $scope.show_confrim_();
    // };
    // $scope.Buyer_Paid();
    // ----------------------------------------
    $scope.detail_Buyer_Paid = function (id) {
          var rs = MyService.get('/order/detail2/' +id);
          rs.then(function (resf) {
              $scope.detail_Buyer_Paid_data = resf.data.data;
              $scope.detail_Buyer_Paid_detail = resf.data.detail;
              $scope.detail_Buyer_Paid_bank = resf.data.bank;
              $('#myModall2').modal("show");

              // console.log(resf);
          });
      };
  // ------------------สินค้าที่กำลังจัดส่ง----------------------------------------- tab 5 buy

      $scope.show_sending = function () {
            var rs = MyService.get('/order/sending');
            rs.then(function (resf) {
                $scope.show_sending_data = resf.data.data;
                // $scope.sent_repost = resf.data.detail;
                console.log(resf.data.data);

            });
        };
        $scope.show_sending();
        // ------------------------
        $scope.okk = function (id) {
            swal({title: "คุณได้รับสินค้าจริงหรือไม่ ?",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#ff6666",
                confirmButtonText: "ใช่ ต้องการ!",
                closeOnConfirm: true,
                html: false
            },
                    function (data) {
                        // $('._loading').fadeIn(10);
                        if (data) {
                          console.log(id);
                            var rs = MyService.get('/order/received/' + id);
                            rs.then(function (resf) {
                                $('._loading').fadeOut(500);
                                if (resf.data.status_code == 400) {
                                    swal("ERROR!", resf.data.message, "error");
                                } else if (resf.data.status_code == 200) {
                                    swal("สำเร็จ!", "ได้รับสินค้าเรียบร้อยแล้วค่ะ!!", "success");
                                    $scope.show_sending();
                                }
                            });
                        }else {
                          // $('._loading').fadeOut(500);
                        }

                    });
        };
  // -------------------------------------------------------  tab 6 buy
    // $scope.cancel_confirm_ = function () {
          var rs = MyService.get('/order/showCanceledBuy');
          rs.then(function (resf) {
              $scope.show_Canceled_Buy = resf.data.data;
              $scope.show_data_detail_buy = resf.data.detail;
              // console.log(resf);

          });
          $scope.show_confrim_();
      // };
      // $scope.cancel_confirm_();
      // ----------------------------
      $scope.detail_Canceled_Buy = function (id) {
            var rs = MyService.get('/order/detail2/' +id);
            rs.then(function (resf) {
                $scope.detail_Canceled_data = resf.data.data;
                $scope.detail_Canceled_detail = resf.data.detail;
                $('#myModall6').modal("show");
                console.log(resf);

            });
        };


  // ---------------------show สินค้าที่ส่งสำเร็จ------------------- tab 7 buy
        // $scope.show_Received = function () {
              var rs = MyService.get('/order/showReceived');
              rs.then(function (resf) {
                  $scope.show_Received_data = resf.data.data;
                  // $scope.show_Received_detail = resf.data.detail;
                  $scope.show_sending();
                  console.log(resf.data);
              });

          // };
          // $scope.show_Received();

    // --------------------------------------------------------------------
          $scope.open = function (id) {
                var rs = MyService.get('/order/detail2/' +id);
                rs.then(function (resf) {
                    $scope.open_data = resf.data.data;
                    $scope.open_detail = resf.data.detail;
                    $scope.open_bank = resf.data.bank;
                    $('#myModall3').modal("show");
                    console.log(resf);

                });
            };
  // --------------------------------- ending tab buy-----------------------------------

  // ---------------------------- add closet ---- add image ----------------------------

            $scope.form2 = [];
            $scope.files2 = [];
            $scope.add_transfer = function() {

              $scope.form.image2 = $scope.files[0];
              console.log($scope.form.image2);

            $http({
                method  : 'POST',
                url     : 'webpage/upload_slip.php',
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("image", $scope.form.image2);
                    return formData;
                },
                data : $scope.form2,
                headers: {
                       'Content-Type': undefined
                }
            }).then(function(data){
              console.log(data.data);

              $scope.data_add_slip = {
                   img_id: $scope.form2,
                   slip: data.data,
                   address: $scope.form.address,
                   tel_buy: $scope.form.phone
              };
              console.log($scope.data_add_slip);
              var rs = MyService.post('/order/confirmBuy', $scope.data_add_slip);
              rs.then(function (resf) {
                $scope.menu = resf.data.status_code;
                 if ($scope.menu == 200) {
                     swal("สำเร็จ!", "เพิ่มข้อมูลเรียบร้อย", "success");
                     $('._loading').fadeOut(1000);
                     $scope.form = {};
                     $scope.show_confrim_();
                     location.reload();
                 }else if ($scope.menu == 400) {
                   swal("ERROR!", "ข้อมูลไม่ถูกต้องกรุณาทำรายการใหม่!!", "error");
                   $scope.form = {};
                  $('._loading').fadeOut(1000);
                 }
              });
        });
      };

      $scope.uploadedFile = function(element) {
        $scope.currentFile = element.files[0];
        var reader = new FileReader();
        reader.onload = function(event) {
            $scope.image_source = event.target.result
            $scope.$apply(function($scope) {
              $scope.files = element.files;
            });
        }
           reader.readAsDataURL(element.files[0]);
      }
// -----------------------------------------------------------------------------



// -----------------------------------------------------------------------------
});

ctrl.controller('sell', function ($scope, MyService, $rootScope, $location, $http){
  MyService.checkLogin();
  $scope.logout = function () {
      var rs = MyService.get('/register/logoutUser');
      rs.then(function (resf) {
          swal("ออกจากระบบสำเร็จ");
          MyService.checkLogin();
      });
  };
  $('._loading').fadeOut(1000);
  $('title').html("Sell | Project SB");
  // ---------------------------
  $scope.tab = 1;

  $scope.setTab = function(newTab){
    $scope.tab = newTab;
  };

  $scope.isSet = function(tabNum){
    return $scope.tab === tabNum;
  };

  // --------------------------------- start tab sell--------------------------- //tab1 sell
        // $scope.show_my_sell = function () {
              var rs = MyService.get('/order/showMySell');
              rs.then(function (resf) {
                  $scope.show_my_closet = resf.data.data;
                  $scope.show_my_detail = resf.data.detail;
                  // console.log(resf.data.data);
                  // console.log(resf.data.detail);
              });
          // };
          // $scope.show_my_sell();

          //------------------------------ --------------- ------------------------
              $scope.myCloset = function (id) {
                    var rs = MyService.get('/order/detail3/' +id);
                    rs.then(function (resf) {
                        $scope.myCloset_data = resf.data.data;
                        $scope.myCloset_detail = resf.data.detail;

                        $('#myModall4').modal("show");

                        // console.log(resf.data.data);
                        // console.log(resf.data.detail);

                    });
                };

  // --------------------------------------------------------------------------- //tab2 sell
    $scope.order_me = function () {
        var rs = MyService.get('/order/OrderSell');
        rs.then(function (resf) {
          $scope.show_data_sell = resf.data.data;
          $scope.show_data_sell_detail = resf.data.detail;

          console.log(resf.data.data);
          console.log(resf.data.detail);
        });
    };
    $scope.order_me();

    // --------------------------
      $scope.can = function (data) {
        var rs = MyService.get('/order/canceledSell/' + data);
        rs.then(function (resf){
          $scope.menu = resf.data.status_code;
           if ($scope.menu == 200) {
               swal("สำเร็จ!", "ยกเลิกการสั่งสินค้า", "success");
               // $scope.order_me();
               $('._loading').fadeOut(1000);
               $scope.order_me();

           }else if ($scope.menu == 400) {
               $('._loading').fadeOut(1000);
               swal("ERROR!", "คุณทำรายการไม่ถูกต้อง", "error");
           }
        });
      };

      // ------------------------------

        $scope.confirm_sell = function (data) {
          var rs = MyService.get('/order/confirmSell/' + data);
          rs.then(function (resf){
            if (resf.data.status_code == 400) {
                swal("ERROR!", resf.data.message, "error");
            } else if (resf.data.status_code == 200) {
                swal("สำเร็จ!", "ยืนยันการสั่งซื้อเรียบร้อยแล้วค่ะ!!", "success");
                $scope.confirm_sell_();
                $scope.order_me();
            }
          });
      };
      // ----------------------------------------------------------------- tab3 sell
      // $scope.cancel_orders = function () {
            var rs = MyService.get('/order/showBuyCanceledSell');
            rs.then(function (resf) {
                $scope.cancel_orders_data = resf.data.data;
                // $scope.show_Received_detail = resf.data.detail;
                // console.log(resf.data);
            });
        // };
        // --------------------- detail ใช้ด้วยกันกับ tab 1
  // --------------------------------------------------------------------- tab4 sell
        $scope.confirm_sell_ = function () {
              var rs = MyService.get('/order/waitPayment');
              rs.then(function (resf) {
                $scope.show_payy_data = resf.data.data;
                $scope.show_payy_detail = resf.data.detail;
                $scope.show_payy_account = resf.data.bank;
                // console.log(resf);
                console.log(resf.data.data);
                console.log(resf.data.detail);
                console.log(resf.data.bank);

              });
          };
          $scope.confirm_sell_();
  // ----------------------------------------------------------------------- tab5 sell
  $scope.Show_Buyer_Paid = function () {
        var rs = MyService.get('/order/showBuyerPaid');
        rs.then(function (resf) {
            $scope.Show_Buyer_Paid_data = resf.data.data;
            $scope.Show_Buyer_Paid_detail = resf.data.detail;
            // console.log(resf);
        });
    };
    $scope.Show_Buyer_Paid();
    // -------------------------------
    $scope.show_order = function (id) {
          var rs = MyService.get('/order/detail2/' +id);
          rs.then(function (resf) {
            $scope.show_order_data = resf.data.data;
            $scope.show_order_detail = resf.data.detail;
            $scope.show_order_bank = resf.data.bank;
            $('#myModall1').modal("show");

            console.log(resf.data.data);
            console.log(resf.data.detail);
            console.log(resf.data.bank);
          });
          $scope.form3 = angular.copy(id);
          console.log($scope.form3);
      };
      // ------------------------
      $scope.add_ems = function () {
         $scope.data_add_ems = {
            track: $scope.form_ems,
            img_id: $scope.form3
        };
        console.log($scope.data_add_ems);
            var rs = MyService.post('/order/track', $scope.data_add_ems);
            rs.then(function (resf) {
              $scope.menu = resf.data.status_code;
               if ($scope.menu == 200) {
                   $('._loading').fadeOut(1000);
                   swal("สำเร็จ!", "เพิ่มเลยพัสดุเรียบร้อยค่ะ", "success");
                   $scope.Show_Buyer_Paid();
                   $scope.sent_repost();
                   location.reload();
               }else if ($scope.menu == 400) {
                   $('._loading').fadeOut(1000);
                   swal("ERROR!", "เลขพัสดุไม่ถูกต้องกรุณาทำรายการใหม่", "error");
               }
            });
        };
  // -------------------------------------------------------------------------/ tab6 sell
    // $scope.show_cancel = function () {
          var rs = MyService.get('/order/showCanceledSell');
          rs.then(function (resf) {
              $scope.show_cancel = resf.data.data;
              console.log(resf.data.data);

          });
      // };
      // $scope.show_cancel();

      $scope.detail_can_sell = function (id) {
            var rs = MyService.get('/order/detail2/' +id);
            rs.then(function (resf) {
                $scope.detail_can_sell_data = resf.data.data;
                $scope.detail_can_sell_detail = resf.data.detail;
                $('#myModall6').modal("show");
                console.log(resf);

            });
        };
  // ------------------รายงานการขาย ประวัติการขาย---------------------------- tab7 sell
  $scope.sent_repost = function () {
        var rs = MyService.get('/order/sent');
        rs.then(function (resf) {
            $scope.sent_repost_data = resf.data.data;
            // $scope.sent_repost = resf.data.detail;

            // console.log(resf);

        });
    };
    $scope.sent_repost();
    // ------------------------
    $scope.report = function (id) {
          var rs = MyService.get('/order/detail2/' +id);
          rs.then(function (resf) {
              $scope.report_data = resf.data.data;
              $scope.report_detail = resf.data.detail;
              $scope.report_bank= resf.data.bank;
              $('#myModall2').modal("show");
              console.log(resf);
          });
      };
// --------------------------------- end tab sell-----------------------------------



// ------------------------------------------------------------------------------------

});

ctrl.controller('setting', function ($scope, MyService, $rootScope, $location, $http){
  $('._loading').fadeOut(1000);
  $('title').html("Setting | Project SB");
  MyService.checkLogin();
  $scope.logout = function () {
      var rs = MyService.get('/register/logoutUser');
      rs.then(function (resf) {
          swal("ออกจากระบบสำเร็จ");
          MyService.checkLogin();
      });
  };
  $scope.tab = 1;

  $scope.setTab = function(newTab){
    $scope.tab = newTab;
  };

  $scope.isSet = function(tabNum){
    return $scope.tab === tabNum;
  };
  $scope.reload = function () {
      location.reload();
  };

  // -----------edit user---------------//
  $scope.edit_profile = function () {
    // $('._loading').fadeIn(10);
      $scope.data_edit = {
        name: $scope.p.name,
        detail: $scope.p.detail
      };
      var rs = MyService.post('/profile/editProfile', $scope.data_edit);
        rs.then(function (resf) {
        $('._loading').fadeOut(100);
        $scope.menu = resf.data.status_code;
        if ($scope.menu == 400) {
            swal("ERROR!", resf.data.message, "error");
        } else if ($scope.menu == 200) {
            location.reload();
            $scope.showuser();
            // swal("สำเร็จ!", "แก้ไขเรียบร้อบแล้วคะ!!", "success");
            // $('._loading').fadeOut(100);
        }
      });
    };

      // ------------------------

      $scope.show_bank = function () {
            var rs = MyService.get('/profile/showBank');
            rs.then(function (resf) {
                $scope.show_bankk = resf.data;
                console.log(resf.data);
            });
        };
        $scope.show_bank();
        // -----------------------
        $scope.add_bank = function(){
          swal({
              title: "คุณต้องการทำรายการนี้จริงหรือไม่ ?",
              text: "",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#ff6666",
              confirmButtonText: "ใช่ ต้องการ!",
              closeOnConfirm: true,
              html: false
          },
                  function (data) {
                    $scope.data_bank = {
                          no_bank: $scope.p.no_bank,
                          bank: $scope.p.bank,
                          name_bank: $scope.p.name_bank
                    };
                    var rs = MyService.post('/profile/addBank', $scope.data_bank);
                        rs.then(function (resf) {
                          $scope.menu = resf.data.status_code;
                          if ($scope.menu == 400) {
                            swal("ERROR!", resf.data.message, "error");
                          } if ($scope.menu == 200) {
                            // swal("สำเร็จ!", "เพิ่มข้อมูลบัญชัธนาคารเรียบร้อยแล้วค่ะ", "success");
                            $scope.show_bank();
                            $scope.p = {};
                            location.reload();
                          }
                        });
                  });
          };

        // ------------------------------------
        $scope.del_bank = function (id_bank) {
            swal({
                title: "คุณต้องการลบข้อมูลจริงหรือไม่ ?",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#ff6666",
                confirmButtonText: "ใช่ ต้องการลบข้อมูล!",
                closeOnConfirm: true,
                html: false
            },
                    function (data) {
                        $('._loading').fadeIn(10);
                        if (data) {
                            var rs = MyService.del('/profile/dBank/' + id_bank);
                            rs.then(function (resf) {
                              $scope.menu = resf.data.status_code;
                               if ($scope.menu == 200) {
                                   swal("สำเร็จ!", "ลบข้อมูลสำเร็จแล้วค่ะ", "success");
                                   $scope.show_bank();
                                   $('._loading').fadeOut(1000);

                               }else if ($scope.menu == 400) {
                                   $('._loading').fadeOut(1000);
                                   swal("ERROR!", "คุณทำรายการไม่ถูกต้อง", "error");
                               }
                            });
                        } else {

                        }

                    });
        };

  // --------------edit password------------------------

  $scope.edit_password = function () {
    $('._loading').fadeIn(10);
    $scope.check = false;
    $scope.data_edit_pass = {
        password1: $scope.ed.pass,
        password2: $scope.ed.con
    };
        var rs = MyService.post('/profile/editPassword', $scope.data_edit_pass);
        rs.then(function (resf) {
          $scope.menu = resf.data.status_code;
           if ($scope.menu == 200) {
               $('._loading').fadeOut(1000);
               // swal("สำเร็จ!", "แก้ไขรหัสผ่านเรียบร้อย", "success");
               $scope.ed = {};
               location.reload();
           }else if ($scope.menu == 400) {
               $('._loading').fadeOut(1000);
               swal("ERROR!", "Password ไม่ตรงกัน", "error");
           }
        });
    };
// -------------------------------------------------
    $scope.showuser = function () {
      var rs = MyService.get('/profile/showUser');
      rs.then(function (resf) {
        $scope.show_user = resf.data;
        // $scope.show_data_detail = resf.detail;
        console.log(resf.data);
      });
    };
    $scope.showuser();

    // ----------------------------------------------
});

ctrl.controller('home', function ($scope, MyService, $routeParams, $filter) {
  MyService.checkLogin();
  $scope.logout = function () {
      var rs = MyService.get('/register/logoutUser');
      rs.then(function (resf) {
          swal("ออกจากระบบสำเร็จ");
          MyService.checkLogin();
      });
  };
  $('._loading').fadeOut(1000);
  // $('title').html("Home | Project SB");
// -------------------------------------------------------------------------------
// ===== Scroll to Top ====
$(window).scroll(function() {
    if ($(this).scrollTop() >= 50) {        // If page is scrolled more than 50px
        $('#return-to-top').fadeIn(200);    // Fade in the arrow
    } else {
        $('#return-to-top').fadeOut(200);   // Else fade out the arrow
    }
});
$('#return-to-top').click(function() {      // When arrow is clicked
    $('body,html').animate({
        scrollTop : 0                       // Scroll to top of body
    }, 500);
});
  //------------------------------ show sell closet all ------------------------
  $scope.show_sell_all = function () {
    var rs = MyService.get('/order/showSellHome');
    rs.then(function (resf) {
      $scope.show_sell = resf.data;
      console.log(resf.data);
    });
  };
  $scope.show_sell_all();

  // -----------------------------------------
  $scope.search_date_home = function () {
    var date = $filter('date')($scope.search.status_date_home, "yyyy-MM-dd");
    console.log(date);
    var rs = MyService.post('/order/showSellHome', {searchDate: date} );
    rs.then(function (resf) {
      $scope.show_sell = resf.data;
      console.log(resf.data);
    });
  };
  // -----------------------------------------
  $scope.search_price_home = function () {
    $scope.data_price_home = {
      searchPrice1: $scope.search.min_home,
      searchPrice2: $scope.search.max_home
    };
    console.log($scope.data_price_home);
    var rs = MyService.post('/order/showSellHome', $scope.data_price_home);
    rs.then(function (resf) {
      $scope.show_sell = resf.data;
      console.log(resf.data);
    });
  };
  // --------------search type----------------
  $scope.search_all_home = function () {
    var rs = MyService.get('/order/showSellHome');
    rs.then(function (resf) {
      $scope.show_sell = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_shirt_home = function () {
    var rs = MyService.get('/order/HomeShirts');
    rs.then(function (resf) {
      $scope.show_sell = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_skirt_home = function () {
    var rs = MyService.get('/order/HomeSkirt');
    rs.then(function (resf) {
      $scope.show_sell = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_pants_home = function () {
    var rs = MyService.get('/order/HomePants');
    rs.then(function (resf) {
      $scope.show_sell = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_shoes_home = function () {
    var rs = MyService.get('/order/HomeShoes');
    rs.then(function (resf) {
      $scope.show_sell = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_dress_home = function () {
    var rs = MyService.get('/order/HomeDress');
    rs.then(function (resf) {
      $scope.show_sell = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_bag_home = function () {
    var rs = MyService.get('/order/HomeBag');
    rs.then(function (resf) {
      $scope.show_sell = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_accessories_home = function () {
    var rs = MyService.get('/order/HomeAccessories');
    rs.then(function (resf) {
      $scope.show_sell = resf.data;
      console.log(resf.data);
    });
  };
  // -------------------- color ------------------------
  $scope.search_all_home = function () {
    var rs = MyService.get('/order/showSellHome');
    rs.then(function (resf) {
      $scope.show_sell = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_full_home = function () {
    var rs = MyService.get('/order/HomeOther');
    rs.then(function (resf) {
      $scope.show_sell = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_gray_home = function () {
    var rs = MyService.get('/order/HomeGray');
    rs.then(function (resf) {
      $scope.show_sell = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_black_home = function () {
    var rs = MyService.get('/order/HomeBlack');
    rs.then(function (resf) {
      $scope.show_sell = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_blue_home = function () {
    var rs = MyService.get('/order/HomeBlue');
    rs.then(function (resf) {
      $scope.show_sell = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_green_home = function () {
    var rs = MyService.get('/order/HomeGreen');
    rs.then(function (resf) {
      $scope.show_sell = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_red_home = function () {
    var rs = MyService.get('/order/HomeRed');
    rs.then(function (resf) {
      $scope.show_sell = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_pink_home = function () {
    var rs = MyService.get('/order/HomePink');
    rs.then(function (resf) {
      $scope.show_sell = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_orange_home = function () {
    var rs = MyService.get('/order/HomeOrange');
    rs.then(function (resf) {
      $scope.show_sell = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_yellow_home = function () {
    var rs = MyService.get('/order/HomeYellow');
    rs.then(function (resf) {
      $scope.show_sell = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_woody_home = function () {
    var rs = MyService.get('/order/HomeBrown');
    rs.then(function (resf) {
      $scope.show_sell = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_m_home = function () {
    var rs = MyService.get('/order/HomePurple');
    rs.then(function (resf) {
      $scope.show_sell = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_white_home = function () {
    var rs = MyService.get('/order/HomeWhite');
    rs.then(function (resf) {
      $scope.show_sell = resf.data;
      console.log(resf.data);
    });
  };

  // -------------------------------------------------------------------------
  $scope.show_detail_ = function(id){
    var rs = MyService.get('/profile/ImageDetail/' + id);
    rs.then(function (resf) {
      $scope.show_detail = resf.data.item;
      console.log(id);
      console.log(resf.data.item);
    });
  };
  // ---------------------------------------------------------------------------
  $scope.search_friend = function () {
    console.log($scope.s_friends);
    var rs = MyService.post('/friend/searchFriend', {searchFriend: $scope.s_friends});
    rs.then(function (resf) {
      $scope.search_friend_zone = resf.data.photo;
      console.log(resf.data.photo);
    });
    // -------------------------
  };
  $scope.a = $routeParams.a;
  // console.log($scope.a);

  //------------------------------ show sell closet following ------------------------
  $scope.show_sell_following = function () {
    var rs = MyService.get('/friend/showHomeFriend');
    rs.then(function (resf) {
      $scope.show_sell_following.data = resf.data;
      // console.log(resf.data);
    });
  };
  $scope.show_sell_following();
  // --------------------------
  $scope.search_date_friend = function () {

    var date = $filter('date')($scope.search.status_date_friend, "yyyy-MM-dd");
    console.log(date);
    var rs = MyService.post('/friend/showHomeFriend', {searchDate: date});
    rs.then(function (resf) {
      $scope.show_sell_following.data = resf.data;
      console.log(resf.data);
    });
  };

  // -----------------------------

  $scope.search_price_friend = function () {
    $scope.data_price_friend = {
      searchPrice1: $scope.search.min_friend,
      searchPrice2: $scope.search.max_friend
    };
    console.log($scope.data_price_friend);
    var rs = MyService.post('/friend/showHomeFriend', $scope.data_price_friend);
    rs.then(function (resf) {
      $scope.show_sell_following.data = resf.data;
      console.log(resf.data);
    });
  };


  // --------------search type----------------
  $scope.search_all_friend = function () {
    var rs = MyService.get('/friend/showHomeFriend');
    rs.then(function (resf) {
      $scope.show_sell_following.data = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_shirt_friend = function () {
    var rs = MyService.get('/friend/FriendShirts');
    rs.then(function (resf) {
      $scope.show_sell_following.data = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_skirt_friend = function () {
    var rs = MyService.get('/friend/FriendSkirt');
    rs.then(function (resf) {
      $scope.show_sell_following.data = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_pants_friend = function () {
    var rs = MyService.get('/friend/FriendPants');
    rs.then(function (resf) {
      $scope.show_sell_following.data = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_shoes_friend = function () {
    var rs = MyService.get('/friend/FriendShoes');
    rs.then(function (resf) {
      $scope.show_sell_following.data = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_dress_friend = function () {
    var rs = MyService.get('/friend/FriendDress');
    rs.then(function (resf) {
      $scope.show_sell_following.data = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_bag_friend = function () {
    var rs = MyService.get('/friend/FriendBag');
    rs.then(function (resf) {
      $scope.show_sell_following.data = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_accessories_friend = function () {
    var rs = MyService.get('/friend/FriendAccessories');
    rs.then(function (resf) {
      $scope.show_sell_following.data = resf.data;
      console.log(resf.data);
    });
  };
  // ---------------search color----------------------
  $scope.search__color_all_friend = function () {
    var rs = MyService.get('/friend/showHomeFriend');
    rs.then(function (resf) {
      $scope.show_sell_following.data = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_full_friend = function () {
    var rs = MyService.get('/friend/FriendOther');
    rs.then(function (resf) {
      $scope.show_sell_following.data = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_gray_friend = function () {
    var rs = MyService.get('/friend/FriendGray');
    rs.then(function (resf) {
      $scope.show_sell_following.data = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_black_friend = function () {
    var rs = MyService.get('/friend/FriendBlack');
    rs.then(function (resf) {
      $scope.show_sell_following.data = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_blue_friend = function () {
    var rs = MyService.get('/friend/FriendBlue');
    rs.then(function (resf) {
      $scope.show_sell_following.data = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_green_friend = function () {
    var rs = MyService.get('/friend/FriendGreen');
    rs.then(function (resf) {
      $scope.show_sell_following.data = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_red_friend = function () {
    var rs = MyService.get('/friend/FriendRed');
    rs.then(function (resf) {
      $scope.show_sell_following.data = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_pink_friend = function () {
    var rs = MyService.get('/friend/FriendPink');
    rs.then(function (resf) {
      $scope.show_sell_following.data = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_orange_friend = function () {
    var rs = MyService.get('/friend/FriendOrange');
    rs.then(function (resf) {
      $scope.show_sell_following.data = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_yellow_friend = function () {
    var rs = MyService.get('/friend/FriendYellow');
    rs.then(function (resf) {
      $scope.show_sell_following.data = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_woody_friend = function () {
    var rs = MyService.get('/friend/FriendBrown');
    rs.then(function (resf) {
      $scope.show_sell_following.data = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_m_friend = function () {
    var rs = MyService.get('/friend/FriendPurple');
    rs.then(function (resf) {
      $scope.show_sell_following.data = resf.data;
      console.log(resf.data);
    });
  };
  $scope.search_white_friend = function () {
    var rs = MyService.get('/friend/FriendWhite');
    rs.then(function (resf) {
      $scope.show_sell_following.data = resf.data;
      console.log(resf.data);
    });
  };

  // ---------------------------page General & Friend--------------------------------------------
  $scope.payy = function () {
    $scope.regis = false;
  };
  $scope.reg = function () {
    $scope.regis = true;
  };
  // ------------------------------------------------------------------------------
  $scope.buynow = function (data) {
    var rs = MyService.get('/order/Buy/' + data);
    rs.then(function (resf) {
      $scope.menu = resf.data.status_code;
      $scope.data_register = "";
      if ($scope.menu == 200) {
        $('._loading').fadeOut(1000);
        swal("สำเร็จ!", "สั่งซื้อสินค้าเรียบร้อยแล้วค่ะ", "success");
        $scope.show_sell_all();
        $scope.show_sell_following();
      }else if ($scope.menu == 400) {
        $('._loading').fadeOut(1000);
        swal("ERROR!", "เคยซื้อสินค้านี้ไปแล้ว", "error");
      }
      // console.log(resf.data);
    });
  };

  // ------------------------------------------
  $scope.band_pic = function (data) {
    var rs = MyService.get('/admin/flatImages/' + data);
    rs.then(function (resf) {
      $scope.menu = resf.data.status_code;
      if ($scope.menu == 200) {
        $('._loading').fadeOut(1000);
        swal("สำเร็จ!", "ระงับการเผยแพร่รูปภาพสำเร็จ", "success");
        $scope.show_sell = resf.data;
      }else if ($scope.menu == 400) {
        $('._loading').fadeOut(1000);
        swal("ERROR!", "กรุณาทำรายการใหม่", "error");
      }
      console.log(resf);
    });
  };

  // -------------------------------------

  $scope.detail_show_home = function(id){
    var rs = MyService.get('/profile/ImageDetail/' + id);
    rs.then(function (resf) {
      $scope.detail_show_home_item = resf.data.item;
      console.log(resf.data.item);
      console.log(id);
    });
  };

  // ----------------------------------------
});

ctrl.controller('friend', function ($scope, MyService, $routeParams, $filter){
  MyService.checkLogin();
  $scope.logout = function () {
    var rs = MyService.get('/register/logoutUser');
    rs.then(function (resf) {
      swal("ออกจากระบบสำเร็จ");
      MyService.checkLogin();
    });
  };
  $('._loading').fadeOut(1000);
  $('title').html("Firend | Project SB");
  // -----------------------------------------------------
  $scope.a = $routeParams.a;
  // console.log($scope.a);
  // ------------------------------------------------------------------------------
  // ===== Scroll to Top ====
  $(window).scroll(function() {
      if ($(this).scrollTop() >= 50) {        // If page is scrolled more than 50px
          $('#return-to-top').fadeIn(200);    // Fade in the arrow
      } else {
          $('#return-to-top').fadeOut(200);   // Else fade out the arrow
      }
  });
  $('#return-to-top').click(function() {      // When arrow is clicked
      $('body,html').animate({
          scrollTop : 0                       // Scroll to top of body
      }, 500);
  });
  // ------------------------------------------------------------------------------
  $scope.friendd = function (data) {
    // console.log(data);
    var rs = MyService.get('/friend/showFriend/' + data);
    rs.then(function (resf) {
      $scope.show_friend_zone = resf.data.item;
      console.log(resf.data.item);
    });

    var rs = MyService.get('/friend/showImageProfileFriend/' + data);
    rs.then(function (resf) {
      $scope.show_friend_zone_image = resf.data.item;
      // console.log(resf.data.item);
      // console.log(data);
    });

    // ------------------------โชว์จำนวน โพสต์ ติดตามเรา เราติดตามกลับ-------------------------

    $scope.follow_friend = function (){
      var rs = MyService.get('/friend/count2Post/' + data);
      rs.then(function (resf) {
        $scope.total_post_friend = resf.data.post;
        $scope.total_follower_friend = resf.data.wer;
        $scope.total_following_friend = resf.data.wing;
        console.log(resf.data.post ,resf.data.wer ,resf.data.wing);
      });
    };
    $scope.follow_friend();

    $scope.show_follow_friend = function (){
      var rs = MyService.get('/friend/showFollowFriend/' + data);
      rs.then(function (resf) {
        $scope.follower_friend = resf.data.wer;
        $scope.following_friend = resf.data.wing;
        console.log(resf.data.wer);
        console.log(resf.data.wing);
      });
    };
    $scope.show_follow_friend();

    // ----------search--type--color--date--price-or--friend-----------------
    var rs = MyService.post('/friend/showImageFriend', {username: data});
    rs.then(function (resf) {
      $scope.show_pic_friend = resf.data.item;
      // console.log(resf.data.item);
    });
    // ---------------------- Date
    $scope.search_date_just = function () {

      var date = $filter('date')($scope.search.status_date_just, "yyyy-MM-dd");
      console.log(date);
      var rs = MyService.post('/friend/showImageFriend', {searchDate: date , username: data});
      rs.then(function (resf) {
        $scope.show_pic_friend = resf.data.item;
        console.log(resf.data.item);
      });
    };
    // ---------------------- Price
    $scope.search_price_just = function () {
      $scope.data_price_just = {
        searchPrice1: $scope.search.min_just,
        searchPrice2: $scope.search.max_just,
        username: data
      };
      console.log($scope.data_price_just);

      var rs = MyService.post('/friend/showImageFriend', $scope.data_price_just);
      rs.then(function (resf) {
        $scope.show_pic_friend = resf.data.item;
        console.log(resf.data.item);
      });
    };

    // --------------search type----------------
    $scope.search_all_just = function () {
      var rs = MyService.post('/friend/showImageFriend', {username: data});
      rs.then(function (resf) {
        $scope.show_pic_friend = resf.data.item;
        console.log(resf.data.item);
      });
    };
    $scope.search_shirt_just = function () {
      var rs = MyService.get('/friend/showFriendShirts/' + data);
      rs.then(function (resf) {
        $scope.show_pic_friend = resf.data.item;
        console.log(resf.data.item);
      });
    };
    $scope.search_skirt_just = function () {
      var rs = MyService.get('/friend/showFriendSkirt/' + data);
      rs.then(function (resf) {
        $scope.show_pic_friend = resf.data.item;
        console.log(resf.data.item);
      });
    };
    $scope.search_pants_just = function () {
      var rs = MyService.get('/friend/showFriendPants/' + data);
      rs.then(function (resf) {
        $scope.show_pic_friend = resf.data.item;
        console.log(resf.data.item);
      });
    };
    $scope.search_shoes_just = function () {
      var rs = MyService.get('/friend/showFriendShoes/' + data);
      rs.then(function (resf) {
        $scope.show_pic_friend = resf.data.item;
        console.log(resf.data.item);
      });
    };
    $scope.search_dress_just = function () {
      var rs = MyService.get('/friend/showFriendDress/' + data);
      rs.then(function (resf) {
        $scope.show_pic_friend = resf.data.item;
        console.log(resf.data.item);
      });
    };
    $scope.search_bag_just = function () {
      var rs = MyService.get('/friend/showFriendBag/' + data);
      rs.then(function (resf) {
        $scope.show_pic_friend = resf.data.item;
        console.log(resf.data.item);
      });
    };
    $scope.search_accessories_just = function () {
      var rs = MyService.get('/friend/showFriendAccessories/' + data);
      rs.then(function (resf) {
        $scope.show_pic_friend = resf.data.item;
        console.log(resf.data.item);
      });
    };
    // ---------------search color----------------------
    $scope.search_color_all_just = function () {
      var rs = MyService.post('/friend/showImageFriend', {username: data});
      rs.then(function (resf) {
        $scope.show_pic_friend = resf.data.item;
        console.log(resf.data.item);
      });
    };
    $scope.search_full_just = function () {
      var rs = MyService.get('/friend/showFriendOther/' + data);
      rs.then(function (resf) {
        $scope.show_pic_friend = resf.data.item;
        console.log(resf.data.item);
      });
    };
    $scope.search_gray_just = function () {
      var rs = MyService.get('/friend/showFriendGray/' + data);
      rs.then(function (resf) {
        $scope.show_pic_friend = resf.data.item;
        console.log(resf.data.item);
      });
    };
    $scope.search_black_just = function () {
      var rs = MyService.get('/friend/showFriendBlack/' + data);
      rs.then(function (resf) {
        $scope.show_pic_friend = resf.data.item;
        console.log(resf.data.item);
      });
    };
    $scope.search_blue_just = function () {
      var rs = MyService.get('/friend/showFriendBlue/' + data);
      rs.then(function (resf) {
        $scope.show_pic_friend = resf.data.item;
        console.log(resf.data.item);
      });
    };
    $scope.search_green_just = function () {
      var rs = MyService.get('/friend/showFriendGreen/' + data);
      rs.then(function (resf) {
        $scope.show_pic_friend = resf.data.item;
        console.log(resf.data.item);
      });
    };
    $scope.search_red_just = function () {
      var rs = MyService.get('/friend/showFriendRed/' + data);
      rs.then(function (resf) {
        $scope.show_pic_friend = resf.data.item;
        console.log(resf.data.item);
      });
    };
    $scope.search_pink_just = function () {
      var rs = MyService.get('/friend/showFriendPink/' + data);
      rs.then(function (resf) {
        $scope.show_pic_friend = resf.data.item;
        console.log(resf.data.item);
      });
    };
    $scope.search_orange_just = function () {
      var rs = MyService.get('/friend/showFriendOrange/' + data);
      rs.then(function (resf) {
        $scope.show_pic_friend = resf.data.item;
        console.log(resf.data.item);
      });
    };
    $scope.search_yellow_just = function () {
      var rs = MyService.get('/friend/showFriendYellows/' + data);
      rs.then(function (resf) {
        $scope.show_pic_friend = resf.data.item;
        console.log(resf.data.item);
      });
    };
    $scope.search_woody_just = function () {
      var rs = MyService.get('/friend/showFriendBrown/' + data);
      rs.then(function (resf) {
        $scope.show_pic_friend = resf.data.item;
        console.log(resf.data.item);
      });
    };
    $scope.search_m_just = function () {
      var rs = MyService.get('/friend/showFriendPurple/' + data);
      rs.then(function (resf) {
        $scope.show_pic_friend = resf.data.item;
        console.log(resf.data.item);
      });
    };
    $scope.search_white_just = function () {
      var rs = MyService.get('/friend/showFriendWhite/' + data);
      rs.then(function (resf) {
        $scope.show_pic_friend = resf.data.item;
        console.log(resf.data.item);
      });
    };

  };
  // $scope.friendd();

//-----------------------------------follow------------------------------------
    $scope.btnc = "";
    $scope.checkBtn = function (data) {

      var rs = MyService.get('/friend/checkBtn/' + data);
      rs.then(function (resf) {
        $scope.menu = resf.data;
        // console.log(resf.data);
        $scope.t = 't';
        $scope.f = 'f';

        if ($scope.menu == $scope.f) {
          $scope.btnc = "กำลังติดตาม";
          $('#user_follow').css('background', '#fff5e6');
        }else if ($scope.menu == $scope.t) {
          $scope.btnc = "ติดตาม";
          $('#user_follow').css('background', '#fea634');
        }
        $scope.btnc;
        console.log($scope.btnc);
      });
    };
// ------------------------------------------------
    $scope.following = function (data) {
      var rs = MyService.get('/friend/follower/' + data);
      rs.then(function (resf) {
        $scope.menu = resf.data.status_code;
        // console.log(resf.data.item);
        if ($scope.menu == 200) {
          $scope.btnc = "กำลังติดตาม";
          $('#user_follow').css('background', '#fff5e6');
          swal("ติดตาม!", "สำเร็จ", "success");
          $scope.follow_friend();
          $scope.show_follow_friend();
        }else if ($scope.menu == 400) {
          $scope.btnc = "ติดตาม";
          $('#user_follow').css('background', '#fea634');
          swal("เลิกติดตาม!", "สำเร็จ", "success");
          $scope.follow_friend();
          $scope.show_follow_friend();
        }
      });
    };
// -------------------------------------------------- โชวรูปภาพเพิ่มเติมของเพื่อน
$scope.show_picture_profile = function(data){
  var rs = MyService.get('/friend/showImageDetailFriend/' + data);
  rs.then(function (resf) {
    $scope.show_pic_friend_detail = resf.data.item;
    $("#myModall1").modal("show");
    console.log(resf.data.item);
    console.log(data);
  });
};
// -------------------------------------------------- show profile friend
$scope.profile_friend = function(data){
  var rs = MyService.get('/friend/showFriend/' + data);
  rs.then(function (resf) {
    $scope.profile_friend_item = resf.data.item;
    $("#myModall2").modal("show");
    console.log(resf.data.item);
    console.log(data);``
  });
};
// --------------------------------------------------

});

ctrl.controller('admin', function ($scope, MyService, $rootScope, $location) {
  MyService.checkLogin();
  $scope.logout = function () {
    var rs = MyService.get('/register/logoutUser');
    rs.then(function (resf) {
      swal("ออกจากระบบสำเร็จ");
      MyService.checkLogin();
    });
  };

  $('._loading').fadeOut(1000);
  $('title').html("Admin | SystemSB");

// ------------------------------------------------------------------------

  $scope.tab = 1;

  $scope.setTab = function(newTab){
    $scope.tab = newTab;
  };

  $scope.isSet = function(tabNum){
    return $scope.tab === tabNum;
  };
  // ------------------------------------------------------------------------
  // $scope.show_profile = function () {
    var rs = MyService.get('/profile/showImage');
    rs.then(function (resf) {
      $scope.show_pro = resf.data.showphoto;
      console.log(resf.data.showphoto);
    });
  // };
  // $scope.show_profile();
  // -----------------------------------------------------------------------
  $scope.show_user_all = function () {
    var rs = MyService.get('/admin/showUser');
    rs.then(function (resf) {
      $scope.show_admin_user = resf.data.photo;
      console.log(resf.data.photo);

    });
  };
  $scope.show_user_all();
  // -------------------------------------------------------------------------
  $scope.cancel_active = function (data) {
    var rs = MyService.get('/admin/flatUser/' + data);
    rs.then(function (resf) {
      $scope.menu = resf.data.status_code;
      if ($scope.menu == 200) {
        $('._loading').fadeOut(1000);
        swal("สำเร็จ!", "แบนผู้ใช้งานเรียบร้อยแล้ว", "success");
        $scope.show_user_all();
        $scope.show_band_user();
      }else if ($scope.menu == 400) {
        $('._loading').fadeOut(1000);
        swal("ERROR!", "กรอกข้อมมูลให้ครบ", "error");
      }
    });
    console.log(data);
  };
  // ------------------------ show user on band ----------------------------------------
  $scope.show_band_user = function(){
    var rs = MyService.get('/admin/showFlatUser');
    rs.then(function (resf) {
      $scope.show_Flat_User = resf.data.photo;
      console.log( resf.data.photo);
    });
  };
  $scope.show_band_user();

  // -------------------------------- click cancel band user -------------------------------------
  $scope.cancel_band = function(data){
    var rs = MyService.get('/admin/cancelFlatUser/' + data);
    rs.then(function (resf) {
      $scope.menu = resf.data.status_code;
      if ($scope.menu == 200) {
        $('._loading').fadeOut(1000);
        swal("สำเร็จ!", "ยกเลิกแบนผู้ใช้งานเรียบร้อยแล้ว", "success");
        $scope.show_band_user();
        $scope.show_user_all();
      }else if ($scope.menu == 400) {
        $('._loading').fadeOut(1000);
        swal("ERROR!", "กรอกข้อมมูลให้ครบ", "error");
      }
    });
    console.log(data);
  };
  // --------------------------------------
  // $scope.show_addmin = function () {
    var rs = MyService.get('/admin/showAdmin');
    rs.then(function (resf) {
      $scope.show_total_admin = resf.data.photo;
      console.log(resf.data.photo);

    });
  // };
  // $scope.show_addmin();
  // ------------------------------------
  $scope.admin_add = function () {
    $scope.data_add_admin = {
      username: $scope.ad.username,
      name: $scope.ad.name,
      email: $scope.ad.email,
      password: $scope.ad.password
    };
    console.log($scope.data_add_admin);
    var rs = MyService.post('/admin/addAdmin', $scope.data_add_admin);
    rs.then(function (resf) {
      $scope.menu = resf.data.status_code;
      if ($scope.menu == 200) {
        $('._loading').fadeOut(1000);
        swal("สำเร็จ!", "เพิ่มแอดมินเรียบร้อยแล้ว", "success");
        $scope.show_addmin();

      }else if ($scope.menu == 400) {
        $('._loading').fadeOut(1000);
        swal("ERROR!", "กรอกข้อมมูลให้ครบ", "error");
      }
    });
  };
  // ----------------------edit Password--------------------------------
  $scope.edit_password = function () {
    $('._loading').fadeIn(10);
    $scope.check = false;
    $scope.data_edit_pass = {
      password1: $scope.ed.pass,
      password2: $scope.ed.con
    };
    var rs = MyService.post('/profile/editPassword', $scope.data_edit_pass);
    rs.then(function (resf) {
      $scope.menu = resf.data.status_code;
      if ($scope.menu == 200) {
        $('._loading').fadeOut(1000);
        swal("สำเร็จ!", "แก้ไขรหัสผ่านเรียบร้อย", "success");
      }else if ($scope.menu == 400) {
        $('._loading').fadeOut(1000);
        swal("ERROR!", "Password ไม่ตรงกัน", "error");
      }
    });
  };
  // ---------------------------------------------------------
  // $scope.show_band_pic= function () {
    var rs = MyService.get('/admin/showFlatImages');
    rs.then(function (resf) {
      $scope.show_band_pic_data = resf.data;
      console.log(resf.data);

    });
  // };
  // $scope.show_band_pic();
  // ----------------------
  $scope.show_detail_band = function(id){
    var rs = MyService.get('/admin/showFlatDetailImages/' + id);
    rs.then(function (resf) {
      $scope.show_detail_band_pic = resf.data;
      console.log(resf.data);
      console.log(id);
    });
  };
  // -------------------------------- click cancel band user -------------------------------------
  $scope.cancel_band_pic = function(data){
    var rs = MyService.get('/admin/cancelFlatImages/' + data);
    rs.then(function (resf) {
      $scope.menu = resf.data.status_code;
      if ($scope.menu == 200) {
        $('._loading').fadeOut(1000);
        swal("สำเร็จ!", "ยกเลิกแบนรูปภาพเรียบร้อยแล้ว", "success");
        $scope.show_band_pic_data = resf.data;
      }else if ($scope.menu == 400) {
        $('._loading').fadeOut(1000);
        swal("ERROR!", "กรอกข้อมมูลให้ครบ", "error");
      }
    });
    console.log(data);
  };

});
