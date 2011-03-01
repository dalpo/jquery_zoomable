(function($){

    $.imageNavigable = {

        //default settings
        defaults: {
            fullWidth: true,
            centered: false,
            beforeInit: function() {},
            afterInit: function() {}
        }
        
    };

    $.fn.extend({
        imageNavigable: function(options) {

            var config = $.extend({}, $.imageNavigable.defaults, options);
           

            return $(this).each(function(){

                var el = $(this);
                var parent = el.parent();

                config.beforeInit();


                var itemHeight = parseFloat(el.outerHeight());
                var parentHeight = parseFloat(parent.outerHeight());

                //                $(window).resize(function() {
                //                    itemHeight = parseFloat($(el).outerHeight());
                //                    parentHeight = parseFloat(parent.outerHeight());
                //                });

                parent.css({
                    //                    position: 'relative',
                    display: 'block'
                })

                el.css({
                    display: 'block',
                    position: 'absolute',
                    top: 0
                });

                if (config.fullWidth) {
                    el.css({
                        width:  parent.outerWidth()
                    });
                }
                if (config.centered) {
                    $(window).resize(function() {
                        
                        el.css({
                            display: 'block',
                            'margin-left':  (parent.width() - el.width()) / 2
                        });

                    });
                    $(window).resize();
                }

                parent.mousemove(function(e){

                    //Y Navigation
                    if( itemHeight > parentHeight ) {

                        var yPos = 0.0;
                        var imageTop = 0;

                        yPos = parseFloat( e.pageY / parent.outerHeight() );
                        imageTop = parseFloat(parent.outerHeight() - el.outerHeight()) * yPos;

                        el.css({
                            top: (imageTop)
                        });

                        
                    }

                //todo: Improve X Navigation


                });

                config.afterInit();

            });

        }

    });

})(jQuery);