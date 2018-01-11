//var json;
var parsedIkonographien;
var ikonographienArray;
var chosenIkonographie;

// poor choice here, but to keep it simple
// setting up a few vars to keep track of things.
// at issue is these values need to be encapsulated
// in some scope other than global.
var lastPosX = 0;
var lastPosY = 0;
var isDragging = false;
var lastPosXBack = 1100;
var lastPosYBack = 0;
var isDraggingBack = false;
// to check if an ikonographie is chosen
var chosen = false;

function load() {
    var url = new Windows.Foundation.Uri("ms-appx:///data/data.json");
    Windows.Storage.StorageFile.getFileFromApplicationUriAsync(url).then(function (file) {
        Windows.Storage.FileIO.readTextAsync(file).then(function (text) {
            var parsedObject = JSON.parse(text);
            json = parsedObject;
        });
    });
};

function loadIkonographien() {
    var url = new Windows.Foundation.Uri("ms-appx:///data/exampledata.json");
    Windows.Storage.StorageFile.getFileFromApplicationUriAsync(url).then(function (file) {
        Windows.Storage.FileIO.readTextAsync(file).then(function (text) {
            var parsedObject = JSON.parse(text);
            parsedIkonographien = parsedObject;
            var arr = new Array();
            for (let artefakt of parsedObject) {
                arr.push([artefakt.Ikonographie]);
            }
            ikonographienArray = arr;
            createWordCloud();
        });
    });
};

function createWordCloud() {
    list = [];
    for (var i in ikonographienArray) {
        //random number for text size in word cloud
        var randomNumber = Math.floor((Math.random() * 50) + 10);
        var size = "" + randomNumber;
        list.push([ikonographienArray[i], size]);
    }

    WordCloud.minFontSize = "15px"
    WordCloud(document.getElementById('word_cloud'), {
        list: list,
        drawOutOfBound: false,
        color: "#d4d4d4",
        click: function (item) {
            //swipe is now possible
            chosen = true;
            //item[0] is the word
            addIkonographie(item[0]);
            chosenIkonographie = item[0];
            //todo: ausgewähltes Wort hervorheben  
            createWordCloud();                   
        }
    });
}

function addIkonographie(ikonographie) {
    var parent = document.getElementById("ikono1");
    parent.innerHTML = "";
    parent.innerHTML = ikonographie;

}

function interactions() {
    var wordcloud = document.getElementById("feldname1");
    var options = {
        preventDefault: true
    };
    // document.body registers gestures anywhere on the page
    var hammer = new Hammer(wordcloud, options); 
    hammer.on("panright panup", swiped);
    hammer.on("panend", removeWordcloud);


    var backToWordcloud = document.getElementById("ikono1");

    var hammer2 = new Hammer(backToWordcloud, options);
    hammer2.on('panleft pandown', stepback);
    hammer2.on('panend', loadWordcloud);
    //flip image
    //var image = document.getElementById("lb-container");
    //var hammer2 = new Hammer(image);
    //hammer2.get('swipe').set({
    //    direction: Hammer.DIRECTION_ALL
    //});
    //hammer2.on("swipe", stepback);
}

function swiped(event) {
    if (chosen) {     
        // for convience, let's get a reference to our object
        var elem = event.target;

        // DRAG STARTED
        // here, let's snag the current position
        // and keep track of the fact that we're dragging
        if (!isDragging) {
            isDragging = true;
            lastPosX = elem.offsetLeft;
            lastPosY = elem.offsetTop;
        }

        // we simply need to determine where the x,y of this
        // object is relative to where it's "last" known position is
        // NOTE: 
        //    deltaX and deltaY are cumulative
        // Thus we need to always calculate 'real x and y' relative
        // to the "lastPosX/Y"
        var posX = event.deltaX + lastPosX;
        var posY = event.deltaY + lastPosY;
      
        // move our element to that position
        elem.style.left = posX + "px";
        elem.style.top = posY + "px";
      
       var newWidth = $("#word_cloud").width() - 3 + "px";
       var newHeight = $("#word_cloud").height() - 3 + "px";

       //change height and width
       $("#word_cloud").css({ "width": newWidth, "height": newHeight }); 
      
    } else {
        //add alert
        //You first have to click on an ikonographie
    }
}

function removeWordcloud(event) {
    isDragging = false;
    $("#word_cloud").animate({
        height: "0px",
        width: "0px"
    }, {
            duration: 800,
            complete: getPictures(chosenIkonographie)
        }
    );
}

function stepback(event) {
    var elem = event.target;

    // DRAG STARTED
    // here, let's snag the current position
    // and keep track of the fact that we're dragging
    if (!isDraggingBack) {
        isDraggingBack = true;
        lastPosXBack = elem.offsetLeft;
        lastPosYBack = elem.offsetTop;
    }

    // we simply need to determine where the x,y of this
    // object is relative to where it's "last" known position is
    // NOTE: 
    //    deltaX and deltaY are cumulative
    // Thus we need to always calculate 'real x and y' relative
    // to the "lastPosX/Y"
    var posX = event.deltaX + lastPosXBack;
    var posY = event.deltaY + lastPosYBack;

    // move our element to that position
    elem.style.left = posX + "px";
    elem.style.top = posY + "px";
  
    var newWidth = $("#word_cloud").width() + 5 + "px";
    var newHeight = $("#word_cloud").height() + 5 + "px";

    //change height and width
    $("#word_cloud").css({ "width": newWidth, "height": newHeight });
    // DRAG ENDED
    // this is where we simply forget we are dragging
    /*if (event.isFinal) {
        isDraggingBack = false;
        $("#word_cloud").animate({
            height: "1000",
            width: "1100",
            left: "0px",
            bottom: "0px",
            top: "0px"
        }, {
                duration: 600,
                complete: document.getElementById('pinterest').innerHTML = ""
            }
        );
    }*/
   
  

}

function loadWordcloud(event) {
   
        isDraggingBack = false;
        $("#word_cloud").animate({
            height: "1000",
            width: "1100",
            left: "0px",
            bottom: "0px",
            top: "0px"
        }, {
                duration: 600,
                complete: document.getElementById('pinterest').innerHTML = ""
            }
        );
        chosen = false;
        document.getElementById("ikono1").innerHTML = "";
}

function getPictures(clickedIkono) {
    var myElement = document.getElementById('pinterest');
    myElement.innerHTML = "";

    //add pictures to div
    var zaehler = 0;
    var pictures = []

    for (let artefakt of json) {
        for (let ikono of artefakt.Ikonographie) {
            if (ikono == clickedIkono) {
                pictures.push(artefakt.Image);
            }
        }
    }
    for (let picture of pictures) {
        if (picture != undefined && !picture.includes("placeholder.svg")) {
            var a = document.createElement("a");
            a.href = picture;
            a.setAttribute('data-lightbox', 'pictureSet');

            var div = document.createElement("div");
            div.className += "wf-box";
            div.id = clickedIkono + zaehler;

            var img = document.createElement("img");
            img.src = picture;

            myElement.appendChild(div);
            div.appendChild(a);
            a.appendChild(img);
        }

        zaehler++;
    }

    var waterfall = new Waterfall({
        containerSelector: ".wf-container",
        boxSelector: ".wf-box"
    });
}

function picInfo() {

    var pictureInfo = [];

    var imgSrc = $("img.lb-image").attr("src");
    for (let artefakt of json) {
        if (imgSrc == artefakt.Image) {
            pictureInfo.push(artefakt.Objektbezeichnung);
            pictureInfo.push(artefakt.Sachgruppe);
            pictureInfo.push(artefakt.Material);
            pictureInfo.push(artefakt.Technik);
            pictureInfo.push(artefakt.Personen);
            pictureInfo.push(artefakt.Ikonographie);
        }
    }
    console.log(pictureInfo[4].length);
    $(".back").empty();
    var p1 = $("<p></p>").text("Objektbezeichnung: " + pictureInfo[0]);
    p1.addClass("lead");
    var p2 = $("<p></p>").text("Sachgruppe: " + pictureInfo[1]);
    p2.addClass("lead");
    var p3 = $("<p></p>").text("Material: " + pictureInfo[2]);
    p3.addClass("lead");
    var p4 = $("<p></p>").text("Technik: " + pictureInfo[3]);
    p4.addClass("lead");
    var name = pictureInfo[4][0].Name;
    var rolle = pictureInfo[4][0].Rolle;
    var p5 = $("<p></p>").text("Person 1: " + name + " (" + rolle + ")");
    p5.addClass("lead");
    if (pictureInfo[4].length == 2) {
        var name2 = pictureInfo[4][1].Name;
        var rolle2 = pictureInfo[4][1].Rolle;
        var p6 = $("<p></p>").text("Person 2: " + name2 + " (" + rolle2 + ")");
        p6.addClass("lead");
        $(".back").append(p6);
    }
    if (pictureInfo[4].length == 3) {
        var name2 = pictureInfo[4][1].Name;
        var rolle2 = pictureInfo[4][1].Rolle;
        var name3 = pictureInfo[4][2].Name;
        var rolle3 = pictureInfo[4][2].Rolle;

        var p6 = $("<p></p>").text("Person 2: " + name2 + " (" + rolle2 + ")");
        p6.addClass("lead");
        


        var p7 = $("<p></p>").text("Person 3: " + name3 + " (" + rolle3 + ")");
        p7.addClass("lead");

    }
    
    var p8 = $("<p></p>").text("Ikonographien: " + pictureInfo[5]);
    p8.addClass("lead");

   
    $(".back").append(p1);
    $(".back").append(p2);
    $(".back").append(p3);
    $(".back").append(p4);
    $(".back").append(p5);
    $(".back").append(p6);
    $(".back").append(p7);
    $(".back").append(p8);
}

/*!
 * Lightbox v2.10.0
 * by Lokesh Dhakar
 *
 * More info:
 * http://lokeshdhakar.com/projects/lightbox2/
 *
 * Copyright 2007, 2018 Lokesh Dhakar
 * Released under the MIT license
 * https://github.com/lokesh/lightbox2/blob/master/LICENSE
 *
 * @preserve
 */

// Uses Node, AMD or browser globals to create a module.
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals (root is window)
        root.lightbox = factory(root.jQuery);
    }
}(this, function ($) {

    function Lightbox(options) {
        this.album = [];
        this.currentImageIndex = void 0;
        this.init();

        // options
        this.options = $.extend({}, this.constructor.defaults);
        this.option(options);
    }

    // Descriptions of all options available on the demo site:
    // http://lokeshdhakar.com/projects/lightbox2/index.html#options
    Lightbox.defaults = {
        albumLabel: 'Image %1 of %2',
        alwaysShowNavOnTouchDevices: false,
        fadeDuration: 600,
        fitImagesInViewport: true,
        imageFadeDuration: 600,
        // maxWidth: 800,
        // maxHeight: 600,
        positionFromTop: 50,
        resizeDuration: 700,
        showImageNumberLabel: true,
        wrapAround: false,
        disableScrolling: false,
        /*
        Sanitize Title
        If the caption data is trusted, for example you are hardcoding it in, then leave this to false.
        This will free you to add html tags, such as links, in the caption.
    
        If the caption data is user submitted or from some other untrusted source, then set this to true
        to prevent xss and other injection attacks.
         */
        sanitizeTitle: false
    };

    Lightbox.prototype.option = function (options) {
        $.extend(this.options, options);
    };

    Lightbox.prototype.imageCountLabel = function (currentImageNum, totalImages) {
        return this.options.albumLabel.replace(/%1/g, currentImageNum).replace(/%2/g, totalImages);
    };

    Lightbox.prototype.init = function () {
        var self = this;
        // Both enable and build methods require the body tag to be in the DOM.
        $(document).ready(function () {
            self.enable();
            self.build();
        });
    };

    // Loop through anchors and areamaps looking for either data-lightbox attributes or rel attributes
    // that contain 'lightbox'. When these are clicked, start lightbox.
    Lightbox.prototype.enable = function () {
        var self = this;
        $('body').on('click', 'a[rel^=lightbox], area[rel^=lightbox], a[data-lightbox], area[data-lightbox]', function (event) {
            self.start($(event.currentTarget));
            return false;
        });
    };

    // Build html for the lightbox and the overlay.
    // Attach event handlers to the new DOM elements. click click click
    Lightbox.prototype.build = function () {
        if ($('#lightbox').length > 0) {
            return;
        }

        var self = this;
        $('<div id="lightboxOverlay" class="lightboxOverlay"></div><div id="lightbox" class="lightbox"><div class="lb-outerContainer"><div class="lb-container"><div class="flip-container"><div class="flipper"><div class="front"><img class="lb-image" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" /></div><div id="back" class="back container"></div></div></div><div class="lb-nav"><a class="lb-prev" href="" ></a><a class="lb-next" href="" ></a></div><div class="lb-loader"><a class="lb-cancel"></a></div></div></div><div class="lb-dataContainer"><div class="lb-data"><div class="lb-details"><span class="lb-caption"></span><span class="lb-number"></span></div><div class="lb-closeContainer"><a class="lb-close"></a></div></div></div></div>').appendTo($('.container'));

        var divFlipContainer = document.getElementsByClassName("flip-container");
        divFlipContainer.ontouchstart = "this.classList.toggle('hover');";

        // Cache jQuery objects
        this.$lightbox = $('#lightbox');
        this.$overlay = $('#lightboxOverlay');
        this.$outerContainer = this.$lightbox.find('.lb-outerContainer');
        this.$container = this.$lightbox.find('.lb-container');
        this.$image = this.$lightbox.find('.lb-image');
        this.$nav = this.$lightbox.find('.lb-nav');
        this.$picInfo = this.$lightbox.find('.back');


        // Store css values for future lookup
        this.containerPadding = {
            top: parseInt(this.$container.css('padding-top'), 10),
            right: parseInt(this.$container.css('padding-right'), 10),
            bottom: parseInt(this.$container.css('padding-bottom'), 10),
            left: parseInt(this.$container.css('padding-left'), 10)
        };

        this.imageBorderWidth = {
            top: parseInt(this.$image.css('border-top-width'), 10),
            right: parseInt(this.$image.css('border-right-width'), 10),
            bottom: parseInt(this.$image.css('border-bottom-width'), 10),
            left: parseInt(this.$image.css('border-left-width'), 10)
        };

        // Attach event handlers to the newly minted DOM elements
        this.$overlay.hide().on('click', function () {
            self.end();
            return false;
        });

        this.$lightbox.hide().on('click', function (event) {
            if ($(event.target).attr('id') === 'lightbox') {
                self.end();
            }
            return false;
        });

        this.$outerContainer.on('click', function (event) {
            if ($(event.target).attr('id') === 'lightbox') {
                self.end();
            }
            return false;
        });

        this.$lightbox.find('.lb-prev').on('click', function () {
            if (self.currentImageIndex === 0) {
                self.changeImage(self.album.length - 1);
            } else {
                self.changeImage(self.currentImageIndex - 1);
            }
            return false;
        });

        this.$lightbox.find('.lb-next').on('click', function () {
            if (self.currentImageIndex === self.album.length - 1) {
                self.changeImage(0);
            } else {
                self.changeImage(self.currentImageIndex + 1);
            }
            return false;
        });

        /*
          Show context menu for image on right-click
    
          There is a div containing the navigation that spans the entire image and lives above of it. If
          you right-click, you are right clicking this div and not the image. This prevents users from
          saving the image or using other context menu actions with the image.
    
          To fix this, when we detect the right mouse button is pressed down, but not yet clicked, we
          set pointer-events to none on the nav div. This is so that the upcoming right-click event on
          the next mouseup will bubble down to the image. Once the right-click/contextmenu event occurs
          we set the pointer events back to auto for the nav div so it can capture hover and left-click
          events as usual.
         */
        this.$nav.on('mousedown', function (event) {
            if (event.which === 3) {
                self.$nav.css('pointer-events', 'none');

                self.$lightbox.one('contextmenu', function () {
                    setTimeout(function () {
                        this.$nav.css('pointer-events', 'auto');
                    }.bind(self), 0);
                });
            }
        });


        this.$lightbox.find('.lb-loader, .lb-close').on('click', function () {
            self.end();
            return false;
        });
    };

    // Show overlay and lightbox. If the image is part of a set, add siblings to album array.
    Lightbox.prototype.start = function ($link) {
        var self = this;
        var $window = $(window);

        $window.on('resize', $.proxy(this.sizeOverlay, this));

        $('select, object, embed').css({
            visibility: 'hidden'
        });

        this.sizeOverlay();

        this.album = [];
        var imageNumber = 0;

        function addToAlbum($link) {
            self.album.push({
                alt: $link.attr('data-alt'),
                link: $link.attr('href'),
                title: $link.attr('data-title') || $link.attr('title')
            });
        }

        // Support both data-lightbox attribute and rel attribute implementations
        var dataLightboxValue = $link.attr('data-lightbox');
        var $links;

        if (dataLightboxValue) {
            $links = $($link.prop('tagName') + '[data-lightbox="' + dataLightboxValue + '"]');
            for (var i = 0; i < $links.length; i = ++i) {
                addToAlbum($($links[i]));
                if ($links[i] === $link[0]) {
                    imageNumber = i;
                }
            }
        } else {
            if ($link.attr('rel') === 'lightbox') {
                // If image is not part of a set
                addToAlbum($link);
            } else {
                // If image is part of a set
                $links = $($link.prop('tagName') + '[rel="' + $link.attr('rel') + '"]');
                for (var j = 0; j < $links.length; j = ++j) {
                    addToAlbum($($links[j]));
                    if ($links[j] === $link[0]) {
                        imageNumber = j;
                    }
                }
            }
        }

        // Position Lightbox
        var top = $window.scrollTop() + this.options.positionFromTop;
        var left = $window.scrollLeft();
        this.$lightbox.css({
            top: top + 'px',
            left: left + 'px'
        }).fadeIn(this.options.fadeDuration);

        // Disable scrolling of the page while open
        if (this.options.disableScrolling) {
            $('html').addClass('lb-disable-scrolling');
        }

        this.changeImage(imageNumber);
    };

    // Hide most UI elements in preparation for the animated resizing of the lightbox.
    Lightbox.prototype.changeImage = function (imageNumber) {
        var self = this;

        this.disableKeyboardNav();
        var $image = this.$lightbox.find('.lb-image');

        this.$overlay.fadeIn(this.options.fadeDuration);

        $('.lb-loader').fadeIn('slow');
        this.$lightbox.find('.lb-image, .lb-nav, .lb-prev, .lb-next, .lb-dataContainer, .lb-numbers, .lb-caption').hide();

        this.$outerContainer.addClass('animating');

        // When image to show is preloaded, we send the width and height to sizeContainer()
        var preloader = new Image();
        preloader.onload = function () {
            var $preloader;
            var imageHeight;
            var imageWidth;
            var maxImageHeight;
            var maxImageWidth;
            var windowHeight;
            var windowWidth;

            $image.attr({
                'alt': self.album[imageNumber].alt,
                'src': self.album[imageNumber].link
            });

            $preloader = $(preloader);

            $image.width(preloader.width);
            $image.height(preloader.height);

            if (self.options.fitImagesInViewport) {
                // Fit image inside the viewport.
                // Take into account the border around the image and an additional 10px gutter on each side.

                windowWidth = $(window).width();
                windowHeight = $(window).height();
                maxImageWidth = windowWidth - self.containerPadding.left - self.containerPadding.right - self.imageBorderWidth.left - self.imageBorderWidth.right - 20;
                maxImageHeight = windowHeight - self.containerPadding.top - self.containerPadding.bottom - self.imageBorderWidth.top - self.imageBorderWidth.bottom - 120;

                // Check if image size is larger then maxWidth|maxHeight in settings
                if (self.options.maxWidth && self.options.maxWidth < maxImageWidth) {
                    maxImageWidth = self.options.maxWidth;
                }
                if (self.options.maxHeight && self.options.maxHeight < maxImageWidth) {
                    maxImageHeight = self.options.maxHeight;
                }

                // Is the current image's width or height is greater than the maxImageWidth or maxImageHeight
                // option than we need to size down while maintaining the aspect ratio.
                if ((preloader.width > maxImageWidth) || (preloader.height > maxImageHeight)) {
                    if ((preloader.width / maxImageWidth) > (preloader.height / maxImageHeight)) {
                        imageWidth = maxImageWidth;
                        imageHeight = parseInt(preloader.height / (preloader.width / imageWidth), 10);
                        $image.width(imageWidth);
                        $image.height(imageHeight);
                    } else {
                        imageHeight = maxImageHeight;
                        imageWidth = parseInt(preloader.width / (preloader.height / imageHeight), 10);
                        $image.width(imageWidth);
                        $image.height(imageHeight);
                    }
                }
            }
            self.sizeContainer($image.width(), $image.height());
        };

        preloader.src = this.album[imageNumber].link;
        this.currentImageIndex = imageNumber;
    };

    // Stretch overlay to fit the viewport
    Lightbox.prototype.sizeOverlay = function () {
        this.$overlay
            .width($(document).width())
            .height($(document).height());
    };

    // Animate the size of the lightbox to fit the image we are showing
    Lightbox.prototype.sizeContainer = function (imageWidth, imageHeight) {
        var self = this;

        var oldWidth = this.$outerContainer.outerWidth();
        var oldHeight = this.$outerContainer.outerHeight();
        var newWidth = imageWidth + this.containerPadding.left + this.containerPadding.right + this.imageBorderWidth.left + this.imageBorderWidth.right;
        var newHeight = imageHeight + this.containerPadding.top + this.containerPadding.bottom + this.imageBorderWidth.top + this.imageBorderWidth.bottom;

        function postResize() {
            self.$lightbox.find('.lb-dataContainer').width(newWidth);
            self.$lightbox.find('.lb-prevLink').height(newHeight);
            self.$lightbox.find('.lb-nextLink').height(newHeight);
            self.showImage();
        }

        if (oldWidth !== newWidth || oldHeight !== newHeight) {
            this.$outerContainer.animate({
                width: newWidth,
                height: newHeight
            }, this.options.resizeDuration, 'swing', function () {
                postResize();
            });
        } else {
            postResize();
        }
    };

    // Display the image and its details and begin preload neighboring images.
    Lightbox.prototype.showImage = function () {
        this.$lightbox.find('.lb-loader').stop(true).hide();
        this.$lightbox.find('.lb-image').fadeIn(this.options.imageFadeDuration);

        //this.updateNav();
        this.updateDetails();
        this.preloadNeighboringImages();
        this.enableKeyboardNav();

    };


    // Display caption, image number, and closing button.
    Lightbox.prototype.updateDetails = function () {
        var self = this;

        // Enable anchor clicks in the injected caption html.
        // Thanks Nate Wright for the fix. @https://github.com/NateWr
        if (typeof this.album[this.currentImageIndex].title !== 'undefined' &&
            this.album[this.currentImageIndex].title !== '') {
            var $caption = this.$lightbox.find('.lb-caption');
            if (this.options.sanitizeTitle) {
                $caption.text(this.album[this.currentImageIndex].title);
            } else {
                $caption.html(this.album[this.currentImageIndex].title);
            }
            $caption.fadeIn('fast')
                .find('a').on('click', function (event) {
                    if ($(this).attr('target') !== undefined) {
                        window.open($(this).attr('href'), $(this).attr('target'));
                    } else {
                        location.href = $(this).attr('href');
                    }
                });
        }

        if (this.album.length > 1 && this.options.showImageNumberLabel) {
            var labelText = this.imageCountLabel(this.currentImageIndex + 1, this.album.length);
            this.$lightbox.find('.lb-number').text(labelText).fadeIn('fast');
        } else {
            this.$lightbox.find('.lb-number').hide();
        }

        this.$outerContainer.removeClass('animating');

        this.$lightbox.find('.lb-dataContainer').fadeIn(this.options.resizeDuration, function () {
            return self.sizeOverlay();
        });
        picInfo();
    };

    // Preload previous and next images in set.
    Lightbox.prototype.preloadNeighboringImages = function () {
        if (this.album.length > this.currentImageIndex + 1) {
            var preloadNext = new Image();
            preloadNext.src = this.album[this.currentImageIndex + 1].link;
        }
        if (this.currentImageIndex > 0) {
            var preloadPrev = new Image();
            preloadPrev.src = this.album[this.currentImageIndex - 1].link;
        }
    };

    Lightbox.prototype.enableKeyboardNav = function () {
        $(document).on('keyup.keyboard', $.proxy(this.keyboardAction, this));
    };

    Lightbox.prototype.disableKeyboardNav = function () {
        $(document).off('.keyboard');
    };

    Lightbox.prototype.keyboardAction = function (event) {
        var KEYCODE_ESC = 27;
        var KEYCODE_LEFTARROW = 37;
        var KEYCODE_RIGHTARROW = 39;

        var keycode = event.keyCode;
        var key = String.fromCharCode(keycode).toLowerCase();
        if (keycode === KEYCODE_ESC || key.match(/x|o|c/)) {
            this.end();
        } else if (key === 'p' || keycode === KEYCODE_LEFTARROW) {
            if (this.currentImageIndex !== 0) {
                this.changeImage(this.currentImageIndex - 1);
            } else if (this.options.wrapAround && this.album.length > 1) {
                this.changeImage(this.album.length - 1);
            }
        } else if (key === 'n' || keycode === KEYCODE_RIGHTARROW) {
            if (this.currentImageIndex !== this.album.length - 1) {
                this.changeImage(this.currentImageIndex + 1);
            } else if (this.options.wrapAround && this.album.length > 1) {
                this.changeImage(0);
            }
        }
    };

    // Closing time. :-(
    Lightbox.prototype.end = function () {
        this.disableKeyboardNav();
        $(window).off('resize', this.sizeOverlay);
        this.$lightbox.fadeOut(this.options.fadeDuration);
        this.$overlay.fadeOut(this.options.fadeDuration);
        $('select, object, embed').css({
            visibility: 'visible'
        });
        if (this.options.disableScrolling) {
            $('html').removeClass('lb-disable-scrolling');
        }
    };

    return new Lightbox();
}));
