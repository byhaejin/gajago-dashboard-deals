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

        /** ��ȭ��ȣ ���ἺȮ�� �� ������ȣ ��û */
        function checkMobileNumber () {

            var mobileNo = _this.jdom["mobileNo"].val();
            if (mobileNo == "") {
                dialog.alert("�޴�����ȣ�� �Է����ּ���", function () {
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
                dialog.alert("������ȣ�� " + data.message + "(��)�� �����Ͽ����ϴ�. ������ȣ�� �Է����ּ���.");

            });
        }

        _this.jdom["requestAuth"].bind(realClickEvent, function () {
            checkMobileNumber();
        });

        /** ���� �ϱ� */
        function checkUserMobileAuth () {
            var mobile = _this.jdom["mobileNo"].val();
            var authcode = _this.jdom["authcode"].val();
            var payUserName = _this.jdom["payUserName"].val();

            if (mobile == "") {
                dialog.alert({
                    theme: 'warning',
                    title: '<i class="icon-gajago-check"></i> Ȯ��',
                    msg: "�޴�����ȣ�� �Է����ּ���"
                }, function () {
                    _this.jdom["mobileNo"].focus();
                });
                return;
            }

            if (authcode == "") {
                dialog.alert({
                    theme: 'warning',
                    title: '<i class="icon-gajago-check"></i> Ȯ��',
                    msg: "�޴��� ������ȣ�� �Է����ּ���"
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
                toast.push("���� �Ǿ����ϴ�");
                _this.authCheck = true;
            });
        }
        _this.jdom["payUserHpNoSave"].bind(realClickEvent, function (e) {
            checkUserMobileAuth();
        });

        /** ��������� �����ϱ� */
        function checkUserMobileInfo () {
            var mobileNo = _this.jdom["mobileNo"].val();
            var payUserName = _this.jdom["payUserName"].val();

            if (payUserName == "") {
                dialog.alert({
                    theme: 'warning',
                    title: '<i class="icon-gajago-check"></i> Ȯ��',
                    msg: "�̸��� �Է����ּ���"
                }, function () {
                    _this.jdom["payUserName"].focus();
                });
                return;
            }

            if (mobileNo == "") {
                dialog.alert("�޴�����ȣ�� �Է����ּ���", function () {
                    _this.jdom["mobileNo"].focus();
                });
                return;
            }

            if ( !_this.authCheck ) {
                dialog.alert({
                    theme: 'warning',
                    title: '<i class="icon-gajago-check"></i> Ȯ��',
                    msg: "�޴��� ������ ���ּ���"
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