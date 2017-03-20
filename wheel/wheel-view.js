'use strict';

const WheelView = function($el, config){
    const _this = this;
    const _config = _.merge({
        init : {
            display: true
        },
        event: {
            select: function() {
                console.log('WheelView.config.event.select is empty function.');
            }
        }
    }, config);

    const wheelList = {
        "1"  : "워터파크",
        "2"   : "놀이동산",
        "3"    : "테마파크",
        "4"  : "아쿠아리움",
        "5" : "유람선",
        "6"  : "동물원",
        "7"   : "수목원",
        "8"  : "박물관",
        "9"  : "패러글라이딩",
        "10"  : "스키",
        "11"   : "눈썰매",
        "12"  : "이색체험",
        "13"   : "지역축제",
        "14"  : "전시",
        "15"    : "공연",
        "16"  : "당일버스여행",
        "17"   : "스파/온천"
    };

    const wheelConfig = {
        data : wheelList,
        wheelListContainer : $('#wheels ul'),
        targetCanvas : $('#wheel #canvas').get(0),
        wheelClick : function () {
            $("#counter").html('뭐가 될까요? 두근두근');
        },
        finished : function(idx) {
            console.log("idx",idx);
            $("#counter").html(wheel.getSegments(idx) + ' 지도로 확인');
        }
    }

    const wheel = new Roulette(wheelConfig);

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
    };

    return {
        'display': baseDisplay
    };
};
