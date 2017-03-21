'use strict';

const WheelView = function($el, config){
    const _this = this;
    const _config = _.merge({
        init : {
            display: true
        },
        event: {

        }
    }, config);

    /** wheel constorl */
    const wheelList = {
        "/groups/leisure?categoryIds=246%2C256"  : "워터파크",
        "/groups/leisure?categoryIds=283%2C293"  : "놀이동산",
        "/groups/leisure?categoryIds=283%2C284"  : "테마파크",
        "/groups/leisure?categoryIds=283%2C302"  : "아쿠아리움",
        "/groups/inland" : "유람선",
        "/groups/leisure?categoryIds=283%2C311"  : "동물원",
        "/groups/leisure?categoryIds=357%2C385"   : "수목원",
        "/groups/leisure?categoryIds=357%2C394"  : "박물관",
        "/groups/leisure?categoryIds=403%2C422"  : "패러글라이딩",
        "/groups/leisure?categoryIds=403%2C1173"  : "스키",
        "/groups/leisure?categoryIds=403%2C1197"   : "눈썰매",
        "/groups/leisure?categoryIds=449%2C459"  : "이색체험",
        "13"   : "지역축제",
        "14"  : "전시",
        "15"    : "공연",
        "16"  : "당일버스여행",
        "17"   : "스파/온천"
    }

    let _checkWheelStatus = false;
    const wheelConfig = {
        data : wheelList,
        wheelListContainer : $('#wheels ul'),
        targetCanvas : $('#wheel #canvas').get(0),
        wheelClick : function () {
            _checkWheelStatus = false;
            $("#wheelToMap h4").text('뭐가 될까요? 두근두근');
        },
        finished : function(idx) {
            _checkWheelStatus = true;
            $("#wheelToMap h4").text(wheel.getSegments(idx) + '상품 보러가기');
        }
    }

    const wheel = new Roulette(wheelConfig);
    this._wheel = wheel;
    //const wheelToMap = ( Fn ) => {
        $('#board-container').on("click",'#wheelToMap',function(e){
            console.log("_checkWheelStatus",_checkWheelStatus);
            if(_checkWheelStatus) {
                //Fn();
            } else {
                _this._wheel.wheel.spin();
            }
        });
    //}

    /**
     * show control
     * @param isDisplay boolean default value true.
     */
    const baseDisplay = (isDisplay) => {
        if (isDisplay) {
            $el.show();
        } else {
            $el.hide();
        }
    }

    return {
        'display': baseDisplay
    }
};
