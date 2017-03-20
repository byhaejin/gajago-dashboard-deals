usermobile: {
    data: {},
    jdom: {},
    target: null,
        init: function () {
        var _this = this,_root = fn_order_new;
        this.parent = $("#page-my-order");

        this.jdom["payUserName"] = $('[data-id="payUserName"]')
        this.jdom["authcode"] = $("#order-new-payUserHpNo-authcode");
        this.jdom["mobileNo"] = $('[data-id="payUserHpNo"]');
        this.jdom["requestAuth"] = $('#request-auth-no');
        this.jdom["checkAuth"] = $('.check-auth');
        this.jdom["payUserInfoSave"] = $("#btn-payUserInfo-save");
        this.jdom["payUserHpNoSave"] = $("#btn-payUserHpNo-input-save");
        this.authCheck = false;

        /** 전화번호 무결성확인 및 인증번호 요청 */
        function checkMobileNumber () {

            var mobileNo = _this.jdom["mobileNo"].val();
            if (mobileNo == "") {
                dialog.alert("휴대폰번호를 입력해주세요", function () {
                    _this.jdom["mobileNo"].focus();
                });
                return;
            }
            _this.jdom["checkAuth"].show();
            app.ajax({
                method: "PUT",
                url: "/sms/auth",
                data: JSON.stringify({
                    mobile: mobileNo,
                    type: "change"
                }),
                nomask: false
            }, function (data) {
                _this.jdom["checkAuth"].show();
                dialog.alert("인증번호를 " + data.message + "(으)로 전송하였습니다. 인증번호를 입력해주세요.");

            });
        }

        _this.jdom["requestAuth"].bind(realClickEvent, function () {
            checkMobileNumber();
        });

        /** 인증 하기 */
        function checkUserMobileAuth () {
            var mobile = _this.jdom["mobileNo"].val();
            var authcode = _this.jdom["authcode"].val();
            var payUserName = _this.jdom["payUserName"].val();

            if (mobile == "") {
                dialog.alert({
                    theme: 'warning',
                    title: '<i class="icon-gajago-check"></i> 확인',
                    msg: "휴대폰번호를 입력해주세요"
                }, function () {
                    _this.jdom["mobileNo"].focus();
                });
                return;
            }

            if (authcode == "") {
                dialog.alert({
                    theme: 'warning',
                    title: '<i class="icon-gajago-check"></i> 확인',
                    msg: "휴대폰 인증번호를 입력해주세요"
                }, function () {
                    _this.jdom["authcode"].focus();
                });
                return;
            }

            app.ajax({
                method: "GET",
                url: "/sms/auth",
                data: "authCode=" + authcode,
                nomask: false
            }, function (res) {
                toast.push("인증 되었습니다");
                _this.authCheck = true;
            });
        }
        _this.jdom["payUserHpNoSave"].bind(realClickEvent, function (e) {
            checkUserMobileAuth();
        });

        /** 사용자정보 저장하기 */
        function checkUserMobileInfo () {
            var mobileNo = _this.jdom["mobileNo"].val();
            var payUserName = _this.jdom["payUserName"].val();

            if (payUserName == "") {
                dialog.alert({
                    theme: 'warning',
                    title: '<i class="icon-gajago-check"></i> 확인',
                    msg: "이름을 입력해주세요"
                }, function () {
                    _this.jdom["payUserName"].focus();
                });
                return;
            }

            if (mobileNo == "") {
                dialog.alert("휴대폰번호를 입력해주세요", function () {
                    _this.jdom["mobileNo"].focus();
                });
                return;
            }

            if ( !_this.authCheck ) {
                dialog.alert({
                    theme: 'warning',
                    title: '<i class="icon-gajago-check"></i> 확인',
                    msg: "휴대폰 인증을 해주세요"
                }, function () {
                    _this.jdom["authcode"].focus();
                });
            }

            app.ajax({
                method: "PUT",
                url: "/myinfo/mobile",
                data: JSON.stringify({
                    mobile: mobileNo,
                    userName : payUserName,
                    type: "change",
                    isOrder: "yes"
                }),
                nomask: false
            }, function (data) {

                app.login.updateLoginInfo('order', function(){
                    _root.user.tmpl_update();
                });
            });

        }
        _this.jdom["payUserInfoSave"].bind(realClickEvent, function () {
            checkUserMobileInfo();
        });
    }
},