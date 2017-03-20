'use strict';



const _wheelView = new WheelView($('#wheel-view'), {
    init: {
        display: false
    },
    event: {
        select: (e) => {

        }
    }
});


$(function(){
    /** start page */
    _wheelView.display(true);


    $('.header-logo img').click(function(){
        location.reload();
    });
});