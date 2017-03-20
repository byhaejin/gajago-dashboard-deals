'use strict';

var  app = app || {};
app = _.merge(app, {
    jdom : [],
    wheelView : new WheelView($('#wheel-view'),
        {
            init: { display: false },
            event: {
                select: (e) => {

                }
            }
        }
    ),
    mapView : new MapView($('#map-view'),
        {
            init: {
                display: true
            },
            event: {
                afterShow: () => {
                    $('#btn-show-list').show();
                    $('#btn-show-map').hide();
                },
                fit: () => {
                    const fullHeight = $('body').innerHeight();
                    const siblingsHeight = $('header').outerHeight();

                    return {
                        width: $('body').width(),
                        height: (fullHeight - siblingsHeight)
                    };
                },
                markerClick: () => {
                    $('#btn-show-list').css('bottom', $('.map-info-window').outerHeight() + 10);
                }
            }
        }
    ),
    /** start page */
    init : function() {
        this.jdom["logo"] = $('.header-logo img');

        this.startForm();
        this.appEvent();
    },
    startForm : function() {
        this.wheelView.display(true);
        this.mapView.display(false);
    },
    appEvent : function() {
        this.jdom["logo"].click(function(){
            location.reload();
        });
    }
});

$(document.body).ready(function () {
   app.init();
});