'use strict';

/**
 * @param set config
 * wheelConfig = {
        data : 룰렛 리스트,
        targetCanvas : 룰렛을 렌더링할 타겟,
        wheelClick : function () {
            룰렛(스핀) 이벤트
        },
        finished : function(idx) {
            룰렛(스핀) 종료시 이벤트
        }
    }
 */

class Roulette {
    constructor (wheelConfig) {
        this.config = wheelConfig;
        this.makeWheel ();
        this.makeList ();
    }

    /** 룰렛 스핀 종료시 선택된 룰렛판의 정보반환 */
    getSegments(idx) {
        return this.wheel.segments[idx]
    }

    /** 룰렛 그리기 */
    makeWheel () {
        var _this = this;

        const wheel = {

            timerHandle: 0,
            timerDelay: (_this.config.timerDelay ? _this.config.timerDelay : 24),

            angleCurrent: 0,
            angleDelta: 0,

            size: 400,

            canvasContext: null,

            colors: ['#ffff00', '#ffc700', '#ff9100', '#ff6301', '#ff0000', '#c6037e', '#713697', '#444ea1', '#2772b2',
                '#0297ba', '#008e5b', '#8ac819'],

            segments: [],//활성화된 룰렛 리스트

            seg_colors: [], //활성화된 룰렛 바탕칼라

            maxSpeed: Math.PI / 16,

            upTime: 1000, // easeIn 시간
            downTime: (_this.config.downTime ? _this.config.downTime : 6000), // easeOut 시간

            spinStart: 0,

            frames: 0,

            centerX: (_this.config.centerX ? _this.config.centerX : 500),
            centerY: (_this.config.centerY ? _this.config.centerY : 500),

            spin: function () {
                _this.config.wheelClick();
                if (wheel.timerHandle == 0) {
                    wheel.spinStart = new Date().getTime();
                    wheel.maxSpeed = Math.PI / (16 + Math.random()); // Randomly vary how hard the spin is
                    wheel.frames = 0;
                    wheel.timerHandle = setInterval(wheel.onTimerTick, wheel.timerDelay);
                }
            },

            onTimerTick: function () {
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

               /** 룰렛 스핀 종료 */
                if (finished) {
                    clearInterval(wheel.timerHandle);

                    wheel.timerHandle = 0;
                    wheel.angleDelta = 0;

                    const idx = wheel.segments.length - Math.floor((wheel.angleCurrent / (Math.PI * 2)) * wheel.segments.length) - 1;

                    _this.config.finished(idx);
                }
            },
            init: function (optionList) {
                try {

                    wheel.initCanvas();
                    wheel.draw();

                    $.extend(wheel, optionList);

                } catch (exceptionData) {
                    console.log('Wheel is not loaded ' + exceptionData);
                }

            },
            initCanvas: function () {
                const canvas = _this.config.targetCanvas;

                canvas.addEventListener("click", wheel.spin, false);
                wheel.canvasContext = canvas.getContext("2d");
            },
            update: function () {
                //lodash plug-in use
                wheel.colors = _.shuffle(wheel.colors);

                const r = 0;
                wheel.angleCurrent = ((r + 0.5) / wheel.segments.length) * Math.PI * 2;

                const segments = wheel.segments;
                const len = segments.length;
                const colors = wheel.colors;
                const colorLen = colors.length;

                const seg_color = new Array();
                for (let i = 0; i < len; i++) {
                    if (i < colorLen) {
                        seg_color.push(colors [i]);
                    } else {
                        seg_color.push(colors [i - colorLen]);
                    }
                }
                wheel.seg_color = seg_color;

                wheel.draw();
            },
            draw: function () {
                wheel.clear();
                wheel.drawWheel();
                wheel.drawNeedle();
            },
            clear: function () {
                const ctx = wheel.canvasContext;
                ctx.clearRect(0, 0, 1000, 800);
            },
            //룰렛판을 선택한 핀 생성
            drawNeedle: function () {
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
                ctx.fillStyle = '#F00';
                ctx.closePath();

                ctx.stroke();
                ctx.fill();
            },
            //룰렛판 그리기
            drawSegment: function (key, lastAngle, angle) {
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
            //룰렛 그리기
            drawWheel: function () {
                const ctx = wheel.canvasContext;

                const angleCurrent = wheel.angleCurrent;
                let lastAngle = angleCurrent;

                const segments = wheel.segments;
                const len = wheel.segments.length;
                const colors = wheel.colors;
                const colorsLen = wheel.colors.length;

                const centerX = wheel.centerX;
                const centerY = wheel.centerY;
                const size = wheel.size;

                const PI2 = Math.PI * 2;

                ctx.lineWidth = 1;
                ctx.strokeStyle = '#000000';
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                ctx.font = "2.4em Arial";

                for (let i = 1; i <= len; i++) {
                    const angle = PI2 * (i / len) + angleCurrent;
                    wheel.drawSegment(i - 1, lastAngle, angle);
                    lastAngle = angle;
                }
                // Draw a center circle
                ctx.beginPath();
                ctx.arc(centerX, centerY, 20, 0, PI2, false);
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#000000';
                ctx.closePath();

                ctx.fillStyle = '#FFF';
                ctx.strokeStyle = '#000';
                ctx.fill();
                ctx.stroke();

                // Draw outer circle
                ctx.beginPath();
                ctx.arc(centerX, centerY, size, 0, PI2, false);
                ctx.closePath();

                ctx.lineWidth = 2;
                ctx.strokeStyle = '#000000';
                ctx.stroke();
            }
        }
        _this.wheel = wheel;

        wheel.init();

        $.each(this.config.data, function (key, val) {
            wheel.segments.push(val);
        });

        wheel.update();
    }
    makeList () {
        var _this = this;

        const wheelListContainer = this.config.wheelListContainer;

        $.each(config.data, function(key, item) {
             var tmpl = '<li>' +
                        '<input type="text" id="wheel-'+ key +">'+
                    '</li>'

        });

// //
//     /** 룰렛 리스트 */
//     $(function() {
//     $.each(config.data, function(key, item) {
//         wheelListContainer.append(
//             $(document.createElement("li"))
//                 .append(
//                     $(document.createElement("input")).attr({
//                         id:    'wheel-' + key
//                         ,name:  item
//                         ,value: item
//                         ,type:  'checkbox'
//                         ,checked:true
//                     })
//                         .change( function() {
//                             const cbox = $(this)[0];
//                             const segments = wheel.segments;
//                             const i = segments.indexOf(cbox.value);
//
//                             if (cbox.checked && i == -1) {
//                                 segments.push(cbox.value);
//
//                             } else if ( !cbox.checked && i != -1 ) {
//                                 segments.splice(i, 1);
//                             }
//
//                             segments.sort();
//                             wheel.update();
//                         } )
//
//                 ).append(
//                 $(document.createElement('label')).attr({
//                     'for':  'wheel-' + key
//                 })
//                     .text( item )
//             )
//         );
//     });
// });
    }
}
