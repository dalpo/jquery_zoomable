(function($){

    $.zoomable = {

        //default settings
        defaults: {
            startWidth: 250,        //  start width
            startHeight: 250,       //  start height
            zoomScope: 5,           //  5x => { maxWidth = minWidth * 5; maxHeight = minHeight * 5}
            zoomValue: 100,
            padding: 0,
            beforeLoad: function(obj, settings) {},
            afterLoad: function(obj, settings) {}
        },

        methods: {
            init: function( options ) {

                return $(this).each(function(){

                    var $this = $(this),
                    data = $this.data('zoomable'),
                    settings = $.extend({}, $.zoomable.defaults, options);

                    // If the plugin hasn't been initialized yet
                    if ( !data ) {

                        var image = null;
                        $this.css({
                            padding: settings.padding
                        }).css({
                            width: settings.startWidth,
                            height: settings.startHeight,
                            position: 'relative',
                            overflow: "hidden"
                        });
                
                        image = $this.children('img');             
                        image.css({
                            position: "relative"
                        });

                        $(this).data('zoomable', {
                            settings: settings
                        });

                        $(window).bind("load", function() {

                            // callback /////////////////////////
                            settings.beforeLoad($this, settings);
                            /////////////////////////////////////


                            settings.minHeight = settings.startHeight;
                            settings.minWidth = image.width() / image.height() * settings.minHeight;

                            if(settings.minWidth > settings.startWidth) {
                                settings.minWidth = settings.startWidth;
                                settings.minHeight = image.height() / image.width() * settings.startWidth;
                            }

                            image.css({
                                display: 'block',
                                width: settings.minWidth,
                                height: settings.minHeight
                            });

                            $this.data('zoomable', {
                                settings: settings
                            });

                            $.zoomable.methods.makeMousable.apply($this);


                            
                            $.zoomable.methods.setZoom.apply($this);
                            
                            

               
                            // callback ////////////////////////
                            settings.afterLoad($this, settings);
                        ////////////////////////////////////
                            
                        });
                        
                    }
                });



            },
            
            destroy: function( ) {

                return this.each(function(){

                    var $this = $(this),
                    data = $this.data('zoomable');

                    // Namespacing FTW
                    $(window).unbind('.zoomable');
                    data.zoomable.remove();
                    $this.removeData('zoomable');

                });

            },

            makeMousable: function() {
                
                return $(this).each(function(){

                    var $this = $(this),
                    image = $this.children("img"),
                    data, divWidth, divHeight, igW, igH,
                    dOs, leftPan = 0.0, topPan = 0.0;

                    $this.mousemove(function(e){

                        data = $this.data('zoomable');
                        image = $this.children("img");
                        divWidth = $this.width();
                        divHeight = $this.height();
                        igW = image.width();
                        igH = image.height();
                        dOs = $this.offset();
                        leftPan = 0.0;
                        topPan = 0.0;
                        

                        /// X VALUE \\\
                        if (image.width() > data.settings.startWidth) {
                            leftPan = (e.pageX - dOs.left) * (divWidth - igW) / (divWidth);
                        } else {
                            leftPan = (data.settings.startWidth - image.width()) / 2;
                        }

                        /// Y VALUE \\\
                        if (image.height() > data.settings.startHeight) {
                            topPan = (e.pageY - dOs.top) * (divHeight - igH) / (divHeight);
                        } else {
                            topPan = (data.settings.startHeight - image.height()) / 2;
                        }
                    
                        image.css({
                            left: leftPan,
                            top: topPan
                        });

                    });

                    $this.mousemove();
                    
                });

            },

            setZoom: function(value) {

                $(this).each(function() {

                    var $this = $(this),
                    data = $this.data('zoomable'),
                    image = $(this).children('img');

                    value = parseInt(value);
                    value = value ? (data.settings.zoomValue = value) : data.settings.zoomValue;

                    var newWidth = data.settings.minWidth * value / 100;
                    var newHeight = data.settings.minHeight * value / 100;

                    image.css({
                        width: newWidth ? newWidth : data.settings.minWidth,
                        height: newHeight ? newHeight : data.settings.minHeight,
                        left: 0,
                        top: 0
                    });

                    $(this).data('zoomable', data);
                    
                    $.zoomable.methods.horizontalCentering.apply($this);
                    $.zoomable.methods.verticalCentering.apply($this);
                    
                });


            },
            
            switchImage: function(source, zoom) {

                return this.each(function(){

                    var $this = $(this),
                    data = $this.data('zoomable'),
                    loaderMsg = $("<div style='width:100%; height:100%; color: #000'>Caricamento...</div>"),
                    newImage = $("<img/>");
                    
                    loaderMsg.css({
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        background: '#ff0000',
                        display: 'none',
                        padding: "3px",
                        'z-index': '1000',
                        opacity: 1
                    }).addClass('zoomLoader');
                    
                    $this.append(loaderMsg).find(".zoomLoader").fadeIn('fast');
                    
                    newImage.attr("src", source).addClass('newImage').css({
                        display: 'block',
                        opactity: 0,
                        position: 'relative'
                    });
                    
                    $this.append(newImage);
                
                    $this.children('img.newImage').load(function() {

                        var image = $this.children("img.newImage");
                        var oldImage = $this.children("img:not(.newImage)");
                        
                        var minHeight = data.settings.startHeight;
                        var minWidth = image.width() / image.height() * minHeight;

                        if(minWidth > data.settings.startWidth) {
                            minWidth = data.settings.startWidth;
                            minHeight = image.height() / image.width() * minWidth;   
                        }

                        oldImage.animate({
                            opacity: 0
                        }, 150, function() {
                            
                            $(this).remove();
                            
                            image.css({
                                display: 'block',
                                width: minWidth,
                                height: minHeight,
                                top: 0,
                                left: 0
                            });

                            if(zoom && parseInt(zoom) >= 100){
                                $.zoomable.methods.setZoom.apply($this, [parseInt(zoom)]);
                            } else {
                                $.zoomable.methods.setZoom.apply($this);
                            }

                            image.animate({
                                opacity: 1
                            }, 300, function() {
                                $(this).css({
                                    opacity: 1
                                });
                            }).removeClass('newImage');
                            
                        });

                        $this.find(".zoomLoader").fadeOut('normal', function() {
                            $(this).remove();
                        });

                        data.settings.minWidth = minWidth;
                        data.settings.minHeight = minHeight;

                        $(this).data('zoomable', data);

                    });

                });
                
            },

            verticalCentering: function() {

                return $(this).each(function(){

                    var $this = $(this),
                    image = $this.children("img"),
                    data = $this.data('zoomable');

                    image.css({
                        top: (data.settings.startHeight - image.height()) / 2
                    });

                });

            },

            horizontalCentering: function() {

                return $(this).each(function(){

                    var $this = $(this),
                    image = $this.children("img"),
                    data = $this.data('zoomable');

                    image.css({
                        left: (data.settings.startWidth - image.width()) / 2
                    });

                });

            }
        }

    };

    $.fn.zoomable = function( method ) {

        if ( $.zoomable.methods[method] ) {
            return $.zoomable.methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return $.zoomable.methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.zoomable' );
        }

    };

})(jQuery);
