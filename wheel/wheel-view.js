'use strict';

const shuffle = function(o) {
    for ( var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
        ;
    return o;
};

String.prototype.hashCode = function(){
    // See http://www.cse.yorku.ca/~oz/hash.html
    let hash = 5381;
    for ( let i = 0; i < this.length; i++) {
        let char = this.charCodeAt(i);
        hash = ((hash<<5)+hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
}

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

    const wheels = {
        "1"  : "워터파크",
        "2"   : "놀이동산",
        "3"    : "테마파크",
        "4"  : "아쿠아리움",
        "5" : "유람",
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

    const wheel = {

        timerHandle : 0,
        timerDelay : 24,

        angleCurrent : 0,
        angleDelta : 0,

        size : 400,

        canvasContext : null,

        colors : [ '#ffff00', '#ffc700', '#ff9100', '#ff6301', '#ff0000', '#c6037e', '#713697', '#444ea1', '#2772b2', '#0297ba', '#008e5b', '#8ac819' ],

        segments : [],

        seg_colors : [], // Cache of segments to colors

        maxSpeed : Math.PI / 16,

        upTime : 1000, // How long to spin up for (in ms)
        downTime : 6000, // How long to slow down for (in ms)

        spinStart : 0,

        frames : 0,

        centerX : 500,
        centerY : 500,

        spin : function() {
            $('.loadMapBtn').addClass('none').removeClass('mdl-js-ripple-effect');
            // Start the wheel only if it's not already spinning
            if (wheel.timerHandle == 0) {
                wheel.spinStart = new Date().getTime();
                wheel.maxSpeed = Math.PI / (16 + Math.random()); // Randomly vary how hard the spin is
                wheel.frames = 0;
                wheel.timerHandle = setInterval(wheel.onTimerTick, wheel.timerDelay);
            }
        },

        onTimerTick : function() {
            const _root = WheelView;
            wheel.frames++;

            wheel.draw();

            let duration = (new Date().getTime() - wheel.spinStart);
            let progress = 0;
            let finished = false;

            if (duration < wheel.upTime) {
                progress = duration / wheel.upTime;
                wheel.angleDelta = wheel.maxSpeed
                    * Math.sin(progress * Math.PI / 2);
            } else {
                progress = duration / wheel.downTime;
                wheel.angleDelta = wheel.maxSpeed
                    * Math.sin(progress * Math.PI / 2 + Math.PI / 2);
                if (progress >= 1)
                    finished = true;
            }

            wheel.angleCurrent += wheel.angleDelta;
            while (wheel.angleCurrent >= Math.PI * 2)
                wheel.angleCurrent -= Math.PI * 2;

            if (finished) {
                //횔 종료
                clearInterval(wheel.timerHandle);

                wheel.timerHandle = 0;
                wheel.angleDelta = 0;

                var i = wheel.segments.length - Math.floor((wheel.angleCurrent / (Math.PI * 2))	* wheel.segments.length) - 1;

                $("#counter").html(wheel.segments[i] + ' 지도로 확인').removeClass('none').addClass('mdl-js-ripple-effect');
            }
        },

        init : function(optionList) {
            try {
                wheel.initWheel();
                wheel.initCanvas();
                wheel.draw();

                $.extend(wheel, optionList);

            } catch (exceptionData) {
                alert('Wheel is not loaded ' + exceptionData);
            }

        },

        initCanvas : function() {
            const canvas = $('#wheel #canvas').get(0);

            canvas.addEventListener("click",wheel.spin, false);
            wheel.canvasContext = canvas.getContext("2d");
        },

        initWheel : function() {
            shuffle(wheel.colors);
        },

        // 세부조항 변경
        update : function() {
            const r = 0;
            wheel.angleCurrent = ((r + 0.5) / wheel.segments.length) * Math.PI * 2;

            const segments = wheel.segments;
            const len      = segments.length;
            const colors   = wheel.colors;
            const colorLen = colors.length;

            // Generate a color cache (so we have consistant coloring)
            const seg_color = new Array();
            for (let i = 0; i < len; i++)
                seg_color.push( colors [ segments[i].hashCode().mod(colorLen) ] );

            wheel.seg_color = seg_color;

            wheel.draw();
        },

        draw : function() {
            wheel.clear();
            wheel.drawWheel();
            wheel.drawNeedle();
        },

        clear : function() {
            const ctx = wheel.canvasContext;
            ctx.clearRect(0, 0, 1000, 800);
        },

        drawNeedle : function() {
            const ctx = wheel.canvasContext;
            const centerX = wheel.centerX;
            const centerY = wheel.centerY;
            const size = wheel.size;

            ctx.lineWidth = 6;
            ctx.strokeStyle = '#000000';
            ctx.fileStyle = '#ffffff';

            ctx.beginPath();

            ctx.moveTo(centerX + size - 40, centerY);
            ctx.lineTo(centerX + size + 20, centerY - 10);
            ctx.lineTo(centerX + size + 20, centerY + 10);
            ctx.fillStyle   = '#F00';
            ctx.closePath();

            ctx.stroke();
            ctx.fill();

            // Which segment is being pointed to?
            const i = wheel.segments.length - Math.floor((wheel.angleCurrent / (Math.PI * 2))	* wheel.segments.length) - 1;
        },
        //여행종류 렌더링
        drawSegment : function(key, lastAngle, angle) {
            const ctx = wheel.canvasContext;
            const centerX = wheel.centerX;
            const centerY = wheel.centerY;
            const size = wheel.size;

            const segments = wheel.segments;
            const len = wheel.segments.length;
            const colors = wheel.seg_color;

            const value = segments[key];

            ctx.save();
            ctx.beginPath();

            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, size, lastAngle, angle, false);
            ctx.lineTo(centerX, centerY);
            ctx.closePath();

            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            ctx.fillStyle = colors[key];
            ctx.fill();
            ctx.stroke();

            // Now draw the text
            ctx.save(); // The save ensures this works on Android devices
            ctx.translate(centerX, centerY);
            ctx.rotate((lastAngle + angle) / 2);
            ctx.fillStyle = '#000000';
            ctx.fillText(value.substr(0, 20), size / 2 + 50, 0);
            ctx.restore();

            ctx.restore();
        },

        drawWheel : function() {
            const ctx = wheel.canvasContext;

            const angleCurrent = wheel.angleCurrent;
            let lastAngle    = angleCurrent;

            const segments  = wheel.segments;
            const len       = wheel.segments.length;
            const colors    = wheel.colors;
            const colorsLen = wheel.colors.length;

            const centerX = wheel.centerX;
            const centerY = wheel.centerY;
            const size    = wheel.size;

            const PI2 = Math.PI * 2;

            ctx.lineWidth    = 1;
            ctx.strokeStyle  = '#000000';
            ctx.textBaseline = "middle";
            ctx.textAlign    = "center";
            ctx.font         = "2.4em Arial";

            for (let i = 1; i <= len; i++) {
                const angle = PI2 * (i / len) + angleCurrent;
                wheel.drawSegment(i - 1, lastAngle, angle);
                lastAngle = angle;
            }
            // Draw a center circle
            ctx.beginPath();
            ctx.arc(centerX, centerY, 20, 0, PI2, false);
            ctx.lineWidth   = 2 ;
            ctx.strokeStyle = '#000000';
            ctx.closePath();

            ctx.fillStyle   = '#FFF';
            ctx.strokeStyle = '#000';
            ctx.fill();
            ctx.stroke();

            // Draw outer circle
            ctx.beginPath();
            ctx.arc(centerX, centerY, size, 0, PI2, false);
            ctx.closePath();

            ctx.lineWidth   = 2;
            ctx.strokeStyle = '#000000';
            ctx.stroke();
        },
    }

    $(function() {
        const wheelContainer = $('#wheels ul');
        $.each(wheels, function(key, item) {
            wheelContainer.append(
                $(document.createElement("li"))
                .append(
                    $(document.createElement("input")).attr({
                        id:    'wheel-' + key
                        ,name:  item
                        ,value: item
                        ,type:  'checkbox'
                        ,checked:true
                    })
                    .change( function() {
                        const cbox = $(this)[0];
                        const segments = wheel.segments;
                        const i = segments.indexOf(cbox.value);

                        if (cbox.checked && i == -1) {
                            segments.push(cbox.value);

                        } else if ( !cbox.checked && i != -1 ) {
                            segments.splice(i, 1);
                        }

                        segments.sort();
                        wheel.update();
                    } )

                ).append(
                    $(document.createElement('label')).attr({
                        'for':  'wheel-' + key
                    })
                    .text( item )
                )
            );
        });
    });

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

    const init  = () => {
        wheel.init();

        const segments = new Array();
        $.each($('#wheels input:checked'), function(key, cbox) {
            segments.push( cbox.value );
        });

        wheel.segments = segments;
        wheel.update();
    }
    $(function() {
        init();
    });
    return {
        'display': baseDisplay
    };
};
