/*!
 * Public SlideDeck JavaScript
 * 
 * All public JavaScript necessary for globally applicable SlideDeck features
 * 
 * @package SlideDeck
 * 
 * @author dtelepathy
 * @package SlideDeck
 * @since 2.0.0
 */
/*!
Copyright 2012 digital-telepathy  (email : support@digital-telepathy.com)

This file is part of SlideDeck.

SlideDeck is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

SlideDeck is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with SlideDeck.  If not, see <http://www.gnu.org/licenses/>.
*/

var slidedeck_ie = (function() {
    var undef, v = 3,
        div = document.createElement('div'),
        all = div.getElementsByTagName('i');
    while (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->', all[0]);
    return v > 4 ? v : undef
}());
var SlideDeckFadingNav = function(elem) {
    this.elems = {};
    this.initialize(elem)
};
var SlideDeckPrefix = "sd2-";
var SlideDeckVideoAPIs;
var __slideDeckVideos = {};
var __slideDeckVideosYTAPIReady = false;
var __slideDeckVideosDMAPIReady = false;
var SlideDeckLazyLoad = function(elem) {
    this.elems = {};
    this.initialize(elem)
};

function __isVerticalDeck(slidedeck) {
    if (typeof(slidedeck.deck === 'undefined')) {
        if (jQuery(slidedeck).find('.slidesVertical').length > 0) {
            return true
        }
        return false
    } else {
        if (slidedeck.verticalSlides) {
            if (slidedeck.verticalSlides[slidedeck.current - 1]) {
                if (slidedeck.verticalSlides[slidedeck.current - 1].navChildren) {
                    return true
                } else {
                    return false
                }
            }
        }
    }
    return false
}

function __slidedeck2_isiOS() {
    var iOS = false;
    if (navigator.userAgent.match(/like Mac OS X/i) || navigator.userAgent.match(/iPad/i)) iOS = true;
    return iOS
}

function __slidedeck2_isMobile() {
    var mobile = false;
    if (navigator.userAgent.match(/like Mac OS X/i) || (navigator.userAgent.match(/android/i) || navigator.userAgent.match(/like Mac OS X/i)) || navigator.userAgent.match(/iPad/i)) mobile = true;
    return mobile
}

function onYouTubePlayerAPIReady() {
    __slideDeckVideosYTAPIReady = true
}
window.dmAsyncInit = function() {
    __slideDeckVideosDMAPIReady = true
};
var SlideDeckOverlay = function(elem) {
    this.classes = {
        container: 'slidedeck-overlays',
        frame: 'slidedeck-frame',
        toggle: 'slidedeck-overlays-showhide',
        wrapper: 'slidedeck-overlays-wrapper',
        overlay: 'slidedeck-overlay',
        flipper: 'slidedeck-overlay-flipper'
    };
    this.elems = {};
    this.speed = 200;
    this.easing = "ease-in-out";
    this.initialize(elem)
};
var SlideDeckOverlays = {
    actions: {},
    inits: {}
};

function briBriFlex(elem, max) {
    var $elem = jQuery(elem);
    $elem.append('<span class="test-character" style="position:absolute;display:block;top:0;left:-999em;">M</span>');
    var testChar = $elem.find('.test-character');
    var tHeight = $elem.outerHeight();
    var mHeight = testChar.outerHeight();
    var loopCount = 0;
    var fontSize = parseInt($elem.css('font-size'), 10);
    var lineHeight = parseInt($elem.css('line-height'), 10);
    if (tHeight > mHeight * max) {
        $elem.css('line-height', 'auto')
    }
    while (tHeight > mHeight * max) {
        fontSize--;
        lineHeight--;
        $elem.css('font-size', fontSize + 'px');
        loopCount++;
        mHeight = testChar.outerHeight();
        tHeight = $elem.outerHeight()
    }
    if (loopCount) {
        $elem.css('line-height', lineHeight + 'px')
    }
    testChar.remove()
}(function($) {
    $.extend($.fn, {
        isMobile: function() {
            return false
        }
    });
    window.SlideDeckVideoAPIs = function(slidedeck) {
        var self = this;
        var autoStartNextVideo = true;
        var autoResumePlayback = true;
        var advanceAtVideoEnd = true;
        if (navigator.userAgent.match(/like Mac OS X/i)) {
            autoStartNextVideo = false
        }
        if (navigator.userAgent.match(/android/i) || navigator.userAgent.match(/like Mac OS X/i)) {
            autoResumePlayback = false
        }
        if (navigator.userAgent.match(/iPad/i)) {
            autoResumePlayback = true
        }
        var youTubeAPIRetryCounter = 0;
        var DailyMotionAPIRetryCounter = 0;
        var slidedeck = $(slidedeck);
        var slidedeckFrame = slidedeck.closest('.slidedeck-frame');
        var deck = slidedeck.slidedeck();
        var verticalDeck;
        var deckElement = slidedeck;
        var playButtons = deckElement.find('.cover .play');
        for (var i = 0; i < playButtons.length; i++) {
            var thisButton = $(playButtons[i]);
            thisButton.css({
                marginTop: Math.round(thisButton.outerHeight() / 2) * -1,
                marginLeft: Math.round(thisButton.outerWidth() / 2) * -1
            });
            if (slidedeck_ie <= 8.0) {
                var cover = thisButton.parents('.cover');
                if (cover.css('background-image') != 'none') {
                    var imgurl = cover.css('background-image').match(/url\([\"\'](.*)[\"\']\)/)[1];
                    cover.css({
                        background: 'none'
                    });
                    cover.append('<div class="ie-background-image"></div>');
                    var ieCover = cover.find('.ie-background-image');
                    ieCover[0].style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + imgurl + "', sizingMethod='scale')"
                }
            }
        }
        deckElement.find('.cover .play').click(function(event) {
            event.preventDefault();
            var cover = $(this).parent();
            var deckId = deckElement[0].id;
            var videoContainerID = '';
            if (cover.prev('.video-container').data('video-id')) {
                videoContainerID = cover.prev('.video-container').data('video-id')
            } else {
                videoContainerID = cover.prev('.video-container').attr('id').split('__')[1]
            }
            var slidedeck = deckElement.slidedeck();
            var slides = slidedeck.slides;
            if (__isVerticalDeck(deckElement)) {
                slides = slidedeck.vertical().slides
            }
            var videoIndex = slides.index(jQuery('[id*="video__' + videoContainerID + '"]').closest('dd'));
            var playerType = slides.eq(videoIndex).find('.video-container')[0].className.split(' ')[0];
            cover.fadeOut();
            deck.pauseAutoPlay = true;
            playVideo((videoIndex + 1), playerType, deckId)
        });
        deckElement.find('.cover .play-video-alternative').click(function(event) {
            event.preventDefault();
            $(this).closest('.cover').find('.play').trigger('click')
        });
        var deckOptions = deck.options;
        var oldBefore = deck.options.before;
        var oldComplete = deck.options.complete;
        var deckContext = deck;
        var isVertical = false;
        if (__isVerticalDeck(deck.deck)) {
            isVertical = true;
            deckContext = deck.vertical();
            deckOptions = deck.vertical().options;
            oldBefore = deckOptions.before;
            oldComplete = deckOptions.complete
        }
        deckOptions.before = function(deck) {
            if (typeof(oldBefore) == 'function') oldBefore(deck);
            if (typeof(deck.deck) != 'undefined') {
                var slidedeckElem = deck.deck[0]
            } else {
                var slidedeckElem = deck.slides.closest('.slidedeck')[0]
            }
            jQuery.data(slidedeckElem, 'video-slidedeck').slideDeckPauseAllVideos(deck)
        };
        deckOptions.complete = function(deck) {
            if (typeof(oldComplete) == 'function') oldComplete(deck);
            var current = deckContext.current;
            if (isVertical) current += 1;
            var $videoContainer = deckContext.slides.eq(current - 1).find('.video-container');
            if ($videoContainer.length) {
                var playerType = $videoContainer[0].className.split(' ')[0];
                if (autoResumePlayback) {
                    playVideoIfPaused((current - 1), playerType)
                }
            }
        };

        function playVideoIfPaused(index, playerType) {
            var videoPlayingClass = 'sd2-video-playing';
            var videosDeckElement = __slideDeckVideos[deckElement[0].id];
            if (typeof(videosDeckElement) === 'undefined') {
                return false
            }
            var player = videosDeckElement["v" + index];
            switch (playerType) {
                case 'youtube':
                    if (typeof(player) != 'undefined') {
                        if (typeof(player.getDuration) == 'function') {
                            var totalTime = player.getDuration();
                            var currentTime = player.getCurrentTime();
                            if ((player.getCurrentTime() > 0) && (totalTime != currentTime)) {
                                player.playVideo();
                                slidedeckFrame.addClass(videoPlayingClass)
                            }
                        }
                    }
                    break;
                case 'vimeo':
                    if (typeof(player) != 'undefined') {
                        if (typeof(player.api) == 'function') {
                            player.api('getCurrentTime', function(value, player_id) {
                                var currentTime = value;
                                if (currentTime > 0) {
                                    player.api('play');
                                    slidedeckFrame.addClass(videoPlayingClass)
                                }
                            })
                        }
                    }
                    break;
                case 'dailymotion':
                    if (typeof(player) != 'undefined') {
                        if ((player.currentTime > 0) && (player.currentTime < (player.duration - 1))) {
                            player.play();
                            slidedeckFrame.addClass(videoPlayingClass)
                        }
                    }
                    break
            }
        }

        function playVideo(index, playerType, deckId) {
            var deckElement = $('#' + deckId);
            var videosDeckElement = __slideDeckVideos[deckElement[0].id];
            if (typeof(videosDeckElement) === 'undefined') {
                return false
            }
            var player = videosDeckElement["v" + (index - 1)];
            if (typeof(player) != 'undefined') {
                switch (playerType) {
                    case 'youtube':
                        if (typeof(player.playVideo) == 'function') {
                            player.playVideo()
                        }
                        break;
                    case 'vimeo':
                        if (typeof(player.api) == 'function') {
                            player.api('play')
                        }
                        break;
                    case 'dailymotion':
                        if (typeof(player.play) == 'function') {
                            player.play()
                        }
                        break
                }
                slidedeckFrame.addClass('sd2-video-playing')
            }
        }

        function videoSeekTo(index, playerType, seconds) {
            var player = __slideDeckVideos[deckElement[0].id]["v" + index];
            switch (playerType) {
                case 'youtube':
                    if (typeof(player) != 'undefined') {
                        player.seekTo(seconds)
                    }
                    break;
                case 'vimeo':
                    if (typeof(player) != 'undefined') {
                        player.api('seekTo', seconds)
                    }
                    break;
                case 'dailymotion':
                    if (typeof(player) != 'undefined') {
                        player.seek(seconds)
                    }
                    break
            }
        }
        this.videoEnded = function(index, playerType, deckId) {
            var deckElement = $('#' + deckId);
            var player = __slideDeckVideos[deckId]["v" + index];
            switch (playerType) {
                case 'youtube':
                    break;
                case 'vimeo':
                    if (typeof(player != 'undefined')) {
                        player.api('unload')
                    }
                    break;
                case 'dailymotion':
                    if (typeof(player != 'undefined')) {}
                    break
            }
            if (advanceAtVideoEnd) {
                var deckContext = deckElement.slidedeck();
                if (__isVerticalDeck(deckElement)) deckContext = deckContext.vertical();
                deckContext.next(function() {
                    var current = deckContext.current;
                    var currentSlide = $('#' + deckId).find('dd:eq(' + (current - 1) + ')');
                    if (__isVerticalDeck(deckElement)) {
                        current += 1;
                        currentSlide = $('#' + deckId).find('.slidesVertical dd:eq(' + (current - 1) + ')')
                    }
                    var playerType = deckElement.find('dd .video-container:eq(' + (current - 1) + ')')[0].className.split(' ')[0];
                    if (autoStartNextVideo) {
                        currentSlide.find('a.play-video-button').parents('dd').addClass('sd2-hide-slide-content');
                        currentSlide.find('a.play-video-button').click()
                    }
                })
            }
        };
        this.slideDeckPauseAllVideos = function(thedeck) {
            if (thedeck.deck) {
                var deckId = thedeck.deck.attr('id')
            } else {
                var deckId = thedeck.slides.closest('.slidedeck').attr('id')
            }
            var players = __slideDeckVideos[deckId];
            for (var k in players) {
                var player = players[k];
                slidedeckFrame.removeClass('sd2-video-playing');
                switch (player.playerType) {
                    case 'youtube':
                        if (typeof(player.getPlayerState) == 'function') {
                            if (player.getPlayerState() == 1) {
                                player.pauseVideo()
                            }
                        }
                        break;
                    case 'vimeo':
                        player.api('pause');
                        break;
                    case 'dailymotion':
                        if (!player.paused) {
                            player.pause()
                        }
                        break
                }
            }
        };
        this.loadYouTubeVideo = function(deckElement, slideIndex) {
            var self = this;
            deckElement = jQuery(deckElement);
            var deckId = deckElement.attr('id');
            var videoContainer = deckElement.find('dd.slide:eq(' + (slideIndex) + ') .video-container.youtube');
            if (__isVerticalDeck(deckElement)) {
                videoContainer = deckElement.find('dl.slidesVertical dd:eq(' + (slideIndex) + ') .video-container.youtube')
            }
            var videoContainerID = jQuery(videoContainer).attr('id');
            var videoID = '';
            if (typeof(videoContainerID) === 'undefined') {
                return false
            }
            if (jQuery(videoContainer).data('video-id')) {
                videoID = jQuery(videoContainer).data('video-id')
            } else {
                videoID = videoContainerID.split('__')[1]
            }
            if (__slideDeckVideosYTAPIReady === false) {
                if (youTubeAPIRetryCounter < 30) {
                    setTimeout(function() {
                        self.loadYouTubeVideo(deckElement, slideIndex)
                    }, 750);
                    youTubeAPIRetryCounter++
                }
                return false
            }
            var iFrameYouTubePlayer = new YT.Player(videoContainerID, {
                height: '100%',
                width: '100%',
                videoId: videoID,
                playerVars: {
                    'wmode': 'opaque',
                    'showinfo': 0,
                    'autohide': 1,
                    'rel': 0,
                    'disablekb': 1,
                    'cc_load_policy': 0,
                    'iv_load_policy': 3,
                    'modestbranding': 1,
                    'fs': 1
                }
            });
            jQuery('#' + videoContainerID).attr('webkitallowfullscreen', true);
            jQuery('#' + videoContainerID).attr('mozallowfullscreen', true);
            var videoIndex = deckElement.find('dd').index(jQuery('#' + videoContainerID).parents('dd')) - (__isVerticalDeck(deckElement) ? 1 : 0);
            iFrameYouTubePlayer.playerType = 'youtube';
            iFrameYouTubePlayer.addEventListener("onStateChange", function(video) {
                switch (video.data) {
                    case 0:
                        jQuery.data(deckElement[0], 'video-slidedeck').videoEnded(videoIndex, 'youtube', deckId);
                        break;
                    case 1:
                        jQuery(deckElement[0]).parents('.slidedeck-frame').addClass("sd2-video-playing");
                        jQuery(deckElement[0]).slidedeck().pauseAutoPlay = true;
                        break
                }
                iFrameYouTubePlayer.youTubePlayerState = video.data
            });
            if (typeof(__slideDeckVideos[deckElement.attr('id')]) != 'object') {
                __slideDeckVideos[deckElement.attr('id')] = {}
            }
            __slideDeckVideos[deckElement.attr('id')]["v" + videoIndex] = iFrameYouTubePlayer
        };
        this.loadVimeoVideo = function(deckElement, slideIndex) {
            var self = this;
            deckElement = jQuery(deckElement);
            var deckId = deckElement.attr('id');
            var videoContainer = deckElement.find('dd.slide:eq(' + (slideIndex) + ') .video-container.vimeo');
            var slides = deckElement.slidedeck().slides;
            if (__isVerticalDeck(deckElement)) {
                videoContainer = deckElement.find('dl.slidesVertical dd:eq(' + (slideIndex) + ') .video-container.vimeo');
                slides = deckElement.slidedeck().vertical().slides
            }
            var videoContainerID = jQuery(videoContainer).attr('id');
            var videoID = '';
            if (typeof(videoContainerID) === 'undefined') {
                return false
            }
            if (jQuery(videoContainer).data('video-id')) {
                videoID = jQuery(videoContainer).data('video-id')
            } else {
                videoID = videoContainerID.split('__')[1]
            }
            jQuery(videoContainer).append('<iframe id="vimeoiFrame-' + videoContainerID + '" src="http://player.vimeo.com/video/' + videoID + '?api=1&byline=0&title=0&portrait=0&player_id=vimeoiFrame-' + videoContainerID + '" width="100%" height="100%" frameborder="0"></iframe>');
            var videoIndex = slides.index(jQuery('#' + videoContainerID).closest('dd'));
            var iFrame = document.getElementById('vimeoiFrame-' + videoContainerID);
            var vimeoPlayer = $f(iFrame).addEvent('ready', function(player_id) {
                var froogaloop = $f(player_id);
                froogaloop.addEvent('finish', function(data) {
                    jQuery.data(deckElement[0], 'video-slidedeck').videoEnded(videoIndex, 'vimeo', deckElement.attr('id'))
                });
                froogaloop.addEvent('play', function(data) {
                    jQuery(deckElement[0]).parents('.slidedeck-frame').addClass("sd2-video-playing");
                    jQuery(deckElement[0]).slidedeck().pauseAutoPlay = true
                })
            });
            vimeoPlayer.playerType = 'vimeo';
            if (typeof(__slideDeckVideos[deckElement.attr('id')]) != 'object') {
                __slideDeckVideos[deckElement.attr('id')] = {}
            }
            __slideDeckVideos[deckElement.attr('id')]["v" + videoIndex] = vimeoPlayer
        };
        this.loadDailyMotionVideo = function(deckElement, slideIndex) {
            var self = this;
            deckElement = jQuery(deckElement);
            var deckId = deckElement.attr('id');
            var videoContainer = deckElement.find('dd.slide:eq(' + (slideIndex) + ') .video-container.dailymotion');
            var slides = deckElement.slidedeck().slides;
            if (__isVerticalDeck(deckElement)) {
                videoContainer = deckElement.find('dl.slidesVertical dd:eq(' + (slideIndex) + ') .video-container.dailymotion');
                slides = deckElement.slidedeck().vertical().slides
            }
            videoContainer.append('<div class="video-player-dm"></div>');
            var videoContainerID = videoContainer.attr('id');
            var videoID = '';
            if (typeof(videoContainerID) === 'undefined') {
                return false
            }
            if (jQuery(videoContainer).data('video-id')) {
                videoID = jQuery(videoContainer).data('video-id')
            } else {
                videoID = videoContainerID.split('__')[1]
            }
            if (__slideDeckVideosDMAPIReady === false) {
                if (DailyMotionAPIRetryCounter < 30) {
                    setTimeout(function() {
                        self.loadDailyMotionVideo(deckElement, slideIndex)
                    }, 750);
                    DailyMotionAPIRetryCounter++
                }
                return false
            }
            var videoIndex = deckElement.find('dd').index(jQuery('#' + videoContainerID).parents('dd')) - (__isVerticalDeck(deckElement) ? 1 : 0);
            var dailymotionPlayer = DM.player(videoContainer[0], {
                video: videoID,
                width: '100%',
                height: '100%',
                params: {}
            });
            dailymotionPlayer.playerType = 'dailymotion';
            dailymotionPlayer.addEventListener("ended", function(e) {
                jQuery.data(deckElement[0], 'video-slidedeck').videoEnded(videoIndex, dailymotionPlayer.playerType, deckId)
            });
            dailymotionPlayer.addEventListener("playing", function(e) {
                jQuery(deckElement[0]).parents('.slidedeck-frame').addClass("sd2-video-playing");
                jQuery(deckElement[0]).slidedeck().pauseAutoPlay = true
            });
            if (typeof(__slideDeckVideos[deckElement.attr('id')]) != 'object') {
                __slideDeckVideos[deckElement.attr('id')] = {}
            }
            __slideDeckVideos[deckElement.attr('id')]["v" + videoIndex] = dailymotionPlayer
        };
        return true
    };
    SlideDeckFadingNav.prototype.nav = function(direction) {
        this.slidedeck.pauseAutoPlay = true;
        switch (direction) {
            case "next-horizontal":
                this.slidedeck.next();
                break;
            case "prev-horizontal":
                this.slidedeck.prev();
                break;
            case "next-vertical":
                if (this.slidedeck.options.cycle && this.slidedeck.vertical().current == this.slidedeck.vertical().slides.length - 1) {
                    this.slidedeck.vertical().goTo(0)
                } else {
                    this.slidedeck.vertical().next()
                }
                break;
            case "prev-vertical":
                if (this.slidedeck.options.cycle && this.slidedeck.vertical().current == 0) {
                    this.slidedeck.vertical().goTo(this.slidedeck.vertical().slides.length)
                } else {
                    this.slidedeck.vertical().prev()
                }
                break
        }
    };
    SlideDeckFadingNav.prototype.checkVertical = function(slidedeck) {
        if (typeof(slidedeck) == 'undefined') {
            var slidedeck = this.slidedeck,
                frame = this.elems.frame,
                prevButton = this.elems.previousVertical,
                nextButton = this.elems.nextVertical
        } else {
            var frame = slidedeck.deck.closest('.slidedeck-frame');
            var prevButton = frame.find('.deck-navigation.vertical.prev');
            var nextButton = frame.find('.deck-navigation.vertical.next')
        }
        frame.addClass('no-vertical-slide');
        if (slidedeck.verticalSlides) {
            if (slidedeck.verticalSlides[slidedeck.current - 1]) {
                if (slidedeck.verticalSlides[slidedeck.current - 1].navChildren) {
                    frame.removeClass('no-vertical-slide')
                }
            }
        }
        if (frame.hasClass('no-vertical-slide')) {
            return false
        }
        prevButton.show();
        nextButton.show();
        if (slidedeck.options.cycle) {
            return false
        }
        if (typeof(slidedeck.vertical()) != 'undefined') {
            if (slidedeck.vertical().current == slidedeck.vertical().slides.length - 1 && !frame.hasClass(SlideDeckPrefix + 'show-back-cover')) {
                nextButton.hide()
            } else if (slidedeck.vertical().current == 0) {
                prevButton.hide()
            }
        }
    };
    SlideDeckFadingNav.prototype.checkHorizontal = function(slidedeck) {
        if (typeof(slidedeck) == 'undefined') {
            var slidedeck = this.slidedeck,
                frame = this.elems.frame,
                prevButton = this.elems.previousHorizontal,
                nextButton = this.elems.nextHorizontal
        } else {
            var frame = slidedeck.deck.closest('.slidedeck-frame');
            var prevButton = frame.find('.deck-navigation.horizontal.prev');
            var nextButton = frame.find('.deck-navigation.horizontal.next')
        }
        if (!frame.hasClass('no-vertical-slide')) {
            return false
        }
        prevButton.show();
        nextButton.show();
        if (slidedeck.options.cycle) {
            return false
        }
        if (slidedeck.current == slidedeck.slides.length && !frame.hasClass(SlideDeckPrefix + 'show-back-cover')) {
            nextButton.hide()
        } else if (slidedeck.current == 1) {
            prevButton.hide()
        }
    };
    SlideDeckFadingNav.prototype.initialize = function(elem) {
        var self = this;
        this.elems.slidedeck = $(elem);
        this.elems.frame = this.elems.slidedeck.closest('.slidedeck-frame');
        this.elems.navs = this.elems.frame.find('.deck-navigation');
        if (this.elems.navs.length < 1) {
            return false
        }
        this.elems.previousHorizontal = this.elems.navs.filter('.horizontal.prev');
        this.elems.nextHorizontal = this.elems.navs.filter('.horizontal.next');
        this.elems.previousVertical = this.elems.navs.filter('.vertical.prev');
        this.elems.nextVertical = this.elems.navs.filter('.vertical.next');
        this.slidedeck = this.elems.slidedeck.slidedeck();
        this.elems.frame.delegate('.deck-navigation', 'click', function(event) {
            event.preventDefault();
            self.nav(this.href.split('#')[1])
        });
        var oldBefore = this.slidedeck.options.before;
        this.slidedeck.setOption('before', function(deck) {
            if (typeof(oldBefore) == 'function') oldBefore(deck);
            self.checkHorizontal();
            self.checkVertical()
        });
        if (this.slidedeck.verticalSlides) {
            this.slidedeck.slides.each(function(ind) {
                if (self.slidedeck.verticalSlides[ind]) {
                    if (typeof(self.slidedeck.verticalSlides[ind].slides) != 'undefined') {
                        var oldVerticalComplete = self.slidedeck.vertical().options.complete;
                        self.slidedeck.vertical().options.complete = function(vDeck) {
                            if (typeof(oldVerticalComplete) == 'function') oldVerticalComplete(vDeck);
                            self.checkVertical()
                        }
                    }
                }
            })
        }
        if (this.elems.frame.hasClass('display-nav-hover')) {
            this.elems.frame.mouseenter(function(event) {
                self.elems.frame.addClass('hover')
            }).mouseleave(function(event) {
                self.elems.frame.removeClass('hover')
            })
        }
        if (this.slidedeck.slides.length == 1) {
            this.elems.frame.find('.deck-navigation.horizontal').hide()
        }
        this.checkVertical();
        this.checkHorizontal()
    };
    SlideDeckOverlay.prototype.close = function() {
        var self = this;
        this.elems.container.removeClass('open');
        this.elems.container.width(0)
    };
    SlideDeckOverlay.prototype.initialize = function(elem) {
        var self = this;
        this.elems.slidedeck = $(elem);
        this.elems.frame = this.elems.slidedeck.closest('.slidedeck-frame');
        if (this.elems.frame.length < 1) {
            return false
        }
        if (this.elems.frame.find('.' + this.classes.container).length < 1) {
            return false
        }
        if (__slidedeck2_isMobile() && this.elems.frame.hasClass('show-overlay-hover')) {
            this.elems.frame.removeClass('show-overlay-hover');
            this.elems.frame.addClass('show-overlay-always')
        }
        if (__slidedeck2_isiOS()) {
            this.elems.frame.addClass('sd2-is-ios')
        }
        this.elems.container = this.elems.frame.find('.' + this.classes.container);
        this.elems.toggle = this.elems.container.find('.' + this.classes.toggle);
        this.elems.wrapper = this.elems.container.find('.' + this.classes.wrapper);
        this.elems.overlays = this.elems.wrapper.find('.' + this.classes.overlay);
        if (this.elems.container.offset().left < this.elems.frame.outerWidth() / 2) {
            this.elems.container.addClass('left')
        }
        this.overlayWidth = 2;
        this.elems.overlays.each(function(ind) {
            self.overlayWidth += self.elems.overlays.eq(ind).outerWidth()
        });
        if (this.elems.frame.hasClass('show-overlay-never')) {
            return false
        } else if (this.elems.frame.hasClass('show-overlay-hover')) {
            this.elems.frame.bind('mouseenter', function(event) {
                self.elems.frame.addClass('hover')
            }).bind('mouseleave', function(event) {
                self.elems.frame.removeClass('hover')
            })
        }
        this.elems.container.delegate('.' + this.classes.toggle, 'click', function(event) {
            event.preventDefault();
            self.toggle()
        });
        this.elems.container.delegate('.' + this.classes.overlay, 'click', function(event) {
            var $this = $.data(this, '$this');
            if (!$this) {
                $this = $(this);
                $.data(this, '$this', $this)
            }
            var type = $this.attr('data-type');
            if (typeof(SlideDeckOverlays.actions[type]) == 'function') {
                SlideDeckOverlays.actions[type](this, event)
            }
        });
        this.elems.overlays.each(function(ind) {
            var $this = $.data(this, '$this');
            if (!$this) {
                $this = $(this);
                $.data(this, '$this', $this)
            }
            var type = $this.attr('data-type');
            if (typeof(SlideDeckOverlays.inits[type]) == 'function') {
                SlideDeckOverlays.inits[type](this)
            }
        });
        if (this.elems.frame.hasClass(SlideDeckPrefix + "overlays-open")) {
            this.open()
        }
    };
    SlideDeckOverlay.prototype.open = function() {
        var self = this;
        this.elems.container.addClass('open');
        this.elems.container.width(this.overlayWidth)
    };
    SlideDeckOverlay.prototype.toggle = function() {
        if (!this.elems.container.hasClass('open')) this.open();
        else this.close()
    };
    SlideDeckOverlays.actions['facebook'] = function(elem, event) {
        event.preventDefault();
        var $this = $.data(elem, '$this');
        if (!$this) {
            $this = $(elem);
            $.data(elem, '$this', $this)
        }
        var $window = $(parent);
        var offset = {
            top: parent.screenY || parent.screenTop,
            left: parent.screenX || parent.screenLeft,
            width: $window.outerWidth(),
            height: $window.outerHeight()
        };
        var pos = {
            width: parseInt($this.attr('data-popup-width'), 10),
            height: parseInt($this.attr('data-popup-height'), 10)
        };
        pos.top = offset.height / 2 - pos.height / 2 + offset.top;
        pos.left = offset.width / 2 - pos.width / 2 + offset.left;
        window.open(elem.href, "_slidedeck_overlay", "width=" + pos.width + ",height=" + pos.height + ",channelmode=no,directories=no,fullscreen=no,location=yes,resizable=yes,menubar=no,scrollbars=yes,status=no,titlebar=yes,left=" + pos.left + ",top=" + pos.top)
    };
    SlideDeckOverlays.inits['facebook'] = function(elem) {
        var url = parent.document.location.href.replace(parent.document.location.hash, "");
        elem.href = elem.href.replace(/u\=(\#|\%23)/, "u=" + escape(url + "#"))
    };
    SlideDeckOverlays.inits['twitter'] = function(elem) {
        var url = parent.document.location.href.replace(parent.document.location.hash, "");
        elem.href = elem.href.replace(/url\=(\#|\%23)/, "url=" + escape(url + "#"))
    };
    SlideDeckLazyLoad.prototype.lazyLoadImages = function(currentIndex) {
        var self = this;
        var images = $(this.slidedeck.slides[currentIndex]);
        if (__isVerticalDeck(this.slidedeck.deck)) {
            currentIndex = currentIndex--;
            images = $(this.slidedeck.vertical().slides[currentIndex])
        }
        if (images.find('[data-sd2-slide-image]').length != 0) {
            var thisSlideImage = images.find('[data-sd2-slide-image]');
            var imageSrc = thisSlideImage.data('sd2-slide-image');
            thisSlideImage.addClass('sd2-image-lazy-loading');
            var imageObject = new Image();
            $(imageObject).load(function(event) {
                if (thisSlideImage.prop("tagName") == "IMG") {
                    thisSlideImage.attr('src', imageSrc)
                } else {
                    thisSlideImage.css('background-image', 'url(' + imageSrc + ')')
                }
                self.slidedeck.deck.trigger('slidedeck:image-lazy-loaded', [currentIndex, imageSrc, self.slidedeck]);
                thisSlideImage.removeClass('sd2-image-lazy-loading')
            }).attr('src', imageSrc);
            thisSlideImage.removeAttr('data-sd2-slide-image')
        }
    };
    SlideDeckLazyLoad.prototype.lazyLoadVideos = function(currentIndex) {
        currentSlideElement = this.slidedeck.slides.eq(currentIndex);
        if (__isVerticalDeck(this.slidedeck.deck)) {
            currentSlideElement = this.slidedeck.vertical().slides.eq(currentIndex)
        }
        if (currentSlideElement.hasClass('slide-type-video')) {
            if (!currentSlideElement.data('sd2-lazy-loaded')) {
                this.slidedeck.deck.data('video-slidedeck').loadYouTubeVideo(this.slidedeck.deck, currentIndex);
                this.slidedeck.deck.data('video-slidedeck').loadVimeoVideo(this.slidedeck.deck, currentIndex);
                this.slidedeck.deck.data('video-slidedeck').loadDailyMotionVideo(this.slidedeck.deck, currentIndex)
            }
            currentSlideElement.data('sd2-lazy-loaded', true)
        }
    };
    SlideDeckLazyLoad.prototype.lazyLoadNext = function(currentIndex, lazyLoadPadding) {
        var self = this;
        var slidesLength = self.slidedeck.slides.length;
        if (__isVerticalDeck(self.slidedeck.deck)) {
            slidesLength = self.slidedeck.vertical().slides.length
        }
        for (var i = 0; i <= lazyLoadPadding; i++) {
            var next = currentIndex + i + 1;
            if (next >= slidesLength) {
                next = i + 1
            }
            self.lazyLoadImages(next)
        }
        for (var i = 0; i < lazyLoadPadding; i++) {
            var next = currentIndex + i + 1;
            if (next >= slidesLength) {
                next = i + 1
            }
            self.lazyLoadVideos(next)
        }
        clearTimeout(self.lazyLoadPrevTimer);
        self.lazyLoadPrevTimer = setTimeout(function() {
            self.lazyLoadPrev(currentIndex, lazyLoadPadding)
        }, Math.round(self.deckAnimationSpeed / 2))
    };
    SlideDeckLazyLoad.prototype.lazyLoadPrev = function(currentIndex, lazyLoadPadding) {
        var self = this;
        var slidesLength = self.slidedeck.slides.length;
        if (__isVerticalDeck(self.slidedeck.deck)) {
            slidesLength = self.slidedeck.vertical().slides.length
        }
        for (var i = 0; i < lazyLoadPadding; i++) {
            var prev = currentIndex - i - 1;
            if (prev < 0) {
                prev = slidesLength - i - 1
            }
            self.lazyLoadImages(prev);
            self.lazyLoadVideos(prev)
        }
    };
    SlideDeckLazyLoad.prototype.lazyLoad = function() {
        var self = this;
        var currentIndex = self.slidedeck.current - 1;
        if (__isVerticalDeck(self.slidedeck.deck)) {
            currentIndex = self.slidedeck.vertical().current
        }
        var lazyLoadPadding = self.slidedeck.options.lazyLoadPadding;
        self.lazyLoadImages(currentIndex);
        self.lazyLoadVideos(currentIndex);
        clearTimeout(self.lazyLoadNextTimer);
        self.lazyLoadNextTimer = setTimeout(function() {
            self.lazyLoadNext(currentIndex, lazyLoadPadding)
        }, self.deckAnimationSpeed)
    };
    SlideDeckLazyLoad.prototype.initialize = function(elem) {
        var self = this;
        this.elems.slidedeck = $(elem);
        this.elems.frame = this.elems.slidedeck.closest('.slidedeck-frame');
        this.slidedeck = this.elems.slidedeck.slidedeck();
        this.deckAnimationSpeed = this.slidedeck.options.speed;
        var defaultLazyLoadPadding = this.elems.frame.data('sd2-lazy-load-padding');
        if (typeof(defaultLazyLoadPadding) === 'undefined') defaultLazyLoadPadding = 1;
        this.slidedeck.options.lazyLoadPadding = defaultLazyLoadPadding;
        var oldBefore = this.slidedeck.options.before;
        this.slidedeck.setOption('before', function(deck) {
            if (typeof(oldBefore) === 'function') oldBefore(deck);
            self.lazyLoad(deck.current)
        });
        if (this.slidedeck.verticalSlides) {
            this.slidedeck.slides.each(function(ind) {
                if (self.slidedeck.verticalSlides[ind]) {
                    if (typeof(self.slidedeck.verticalSlides[ind].slides) != 'undefined') {
                        var oldVerticalBefore = self.slidedeck.vertical().options.before;
                        self.slidedeck.vertical().options.before = function(vDeck) {
                            if (typeof(oldVerticalBefore) == 'function') oldVerticalBefore(vDeck);
                            self.lazyLoad(vDeck.current + 1)
                        }
                    }
                }
            })
        };
        this.slidedeck.loaded(function(deck) {
            self.lazyLoad(deck.current)
        })
    };
    $(document).ready(function() {
        $('.slidedeck').each(function() {
            var $slidedeck = $(this);
            if (!$.data(this, 'SlideDeckFadingNav')) $.data(this, 'SlideDeckFadingNav', new SlideDeckFadingNav(this));
            if (!$.data(this, 'SlideDeckOverlay')) $.data(this, 'SlideDeckOverlay', new SlideDeckOverlay(this));
            $slidedeck.has('.slide-type-video').each(function() {
                if (typeof($.data(this, 'video-slidedeck')) == 'undefined') {
                    $.data(this, 'video-slidedeck', new SlideDeckVideoAPIs(this))
                }
            });
            if (!$.data(this, 'SlideDeckLazyLoad')) $.data(this, 'SlideDeckLazyLoad', new SlideDeckLazyLoad(this));
            if (slidedeck_ie) {
                if (slidedeck_ie <= 8.0) {
                    $slidedeck.find('.sd2-slide-background').each(function() {
                        var $slideBackground = $(this);
                        var $slide = $slideBackground.closest('dd');
                        if ($slideBackground.css('background-image') != 'none') {
                            var imgurl = $slideBackground.css('background-image').match(/url\([\"\'](.*)[\"\']\)/)[1];
                            this.style.background = "none";
                            var sizingMethod = "scale";
                            if ($slide.hasClass('sd2-image-scaling-none')) {
                                sizingMethod = "image"
                            }
                            this.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + imgurl + "', sizingMethod='" + sizingMethod + "')"
                        }
                    })
                }
            }
        })
    })
})(jQuery);
var SlideDeckCoverPostProcessFront = {};
var SlideDeckCoverPostProcessBack = {};
var SlideDeckCover = function(elem) {
    this.elems = {};
    this.slidedeckOptions = {};
    this.hasFront = false;
    this.hasBack = false;
    this.classes = {
        backCover: 'slidedeck-cover-back',
        cover: 'slidedeck-cover',
        frame: 'slidedeck-frame',
        frontCover: 'slidedeck-cover-front',
        mask: 'slidedeck-cover-mask',
        nav: 'deck-navigation',
        open: 'slidedeck-cover-open',
        overlay: 'slidedeck-overlays',
        restart: 'slidedeck-cover-restart',
        wrapper: 'slidedeck-cover-wrapper'
    };
    this.easing = {
        smooth: {
            front: 'easeInCubic',
            back: 'easeOutCubic'
        },
        back: {
            front: 'easeSlideDeckCoverEaseIn',
            back: 'easeSlideDeckCoverEaseOut'
        }
    };
    this.speed = 750;
    this.slidedeck = null;
    this.backCoverVisible = false;
    this.coverStyle = "";
    this.initialize(elem)
};
(function($) {
    jQuery.extend(jQuery.easing, {
        easeSlideDeckCoverEaseIn: function(x, t, b, c, d, s) {
            if (s == undefined) s = 0.9;
            return c * (t /= d) * t * ((s + 1) * t - s) + b
        },
        easeSlideDeckCoverEaseOut: function(x, t, b, c, d, s) {
            if (s == undefined) s = 0.9;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b
        }
    });
    SlideDeckCover.prototype.close = function() {
        var self = this;
        this.backCoverVisible = true;
        this.slidedeck.setOption('keys', false);
        this.slidedeck.setOption('scroll', false);
        this.slidedeck.pauseAutoPlay = true;
        this.elems.frame.addClass('force-nav-hidden');
        this.elems.overlay.fadeOut(this.speed);
        this.elems.backCover.css({
            zIndex: 1000,
            display: 'block'
        });
        var outerWidth = this.elems.backWrapper.outerWidth();
        this.elems.backWrapper.css({
            right: 0 - outerWidth
        }).animate({
            right: 0
        }, this.speed, this.easing[this.easingStyle()].back);
        this.elems.backMask.animate({
            opacity: 0.8
        }, this.speed)
    };
    SlideDeckCover.prototype.easingStyle = function() {
        var easing = "back";
        var matches = this.elems.frame[0].className.match(/slidedeck-cover-easing-([a-z0-9A-Z\-]+)/);
        if (matches.length > 1) {
            easing = matches[1]
        }
        return easing
    };
    SlideDeckCover.prototype.open = function() {
        var self = this;
        this.slidedeck.pauseAutoPlay = false;
        this.slidedeck.options.keys = this.slidedeckOptions.keys;
        this.slidedeck.options.scroll = this.slidedeckOptions.scroll;
        this.elems.frame.removeClass('force-nav-hidden');
        if (!this.elems.frame.hasClass('show-overlay-never')) {
            if (this.elems.frame.hasClass('show-overlay-hover')) {
                this.elems.overlay.removeAttr('style')
            } else {
                this.elems.overlay.animate({
                    opacity: 1
                }, this.speed)
            }
        }
        var outerWidth = this.elems.frontWrapper.outerWidth();
        this.elems.frontWrapper.animate({
            left: 0 - outerWidth
        }, this.speed, this.easing[this.easingStyle()].front);
        this.elems.frontMask.fadeOut(this.speed, function() {
            self.elems.frontCover.hide()
        })
    };
    SlideDeckCover.prototype.revert = function() {
        var self = this;
        this.backCoverVisible = true;
        if (__isVerticalDeck(this.slidedeck)) {
            this.slidedeck.goToVertical(1)
        } else {
            this.slidedeck.goTo(1)
        }
        this.slidedeck.setOption('keys', this.slidedeckOptions.keys);
        this.slidedeck.setOption('scroll', this.slidedeckOptions.scroll);
        this.slidedeck.pauseAutoPlay = false;
        this.elems.frame.removeClass('force-nav-hidden');
        this.elems.overlay.fadeIn(this.speed);
        var outerWidth = this.elems.backWrapper.outerWidth();
        this.elems.backWrapper.animate({
            right: 0 - outerWidth
        }, this.speed, this.easing[this.easingStyle()].back);
        this.elems.backMask.animate({
            opacity: 0
        }, this.speed, function() {
            self.elems.backCover.css('z-index', 1);
            self.backCoverVisible = false
        })
    };
    SlideDeckCover.prototype.initialize = function(elem) {
        var self = this;
        if (self.elems.frame) {
            if (self.elems.frame.hasClass('sd2-small')) return false
        }
        this.elems.slidedeck = $(elem);
        this.elems.frame = this.elems.slidedeck.closest('.' + this.classes.frame);
        if (this.elems.frame.length < 1) {
            return false
        }
        this.elems.frontCover = this.elems.frame.find('.' + this.classes.frontCover);
        this.elems.backCover = this.elems.frame.find('.' + this.classes.backCover);
        this.elems.nav = this.elems.frame.find('.' + this.classes.nav);
        this.elems.overlay = this.elems.frame.find('.' + this.classes.overlay);
        this.slidedeck = this.elems.slidedeck.slidedeck();
        this.slidedeckOptions = $.extend(this.slidedeckOptions, this.slidedeck.options);
        var coverMatches = this.elems.frame[0].className.match(/slidedeck-cover-style-([a-z0-9A-Z\-]+)/);
        if (coverMatches) {
            if (coverMatches.length > 1) {
                this.coverStyle = coverMatches[1]
            }
            var easingMatches = this.elems.frame[0].className.match(/slidedeck-cover-easing-([a-z0-9A-Z\-]+)/);
            if (!easingMatches) {
                this.elems.frame.addClass('slidedeck-cover-easing-back')
            }
            if (this.elems.frontCover.length) {
                this.hasFront = true;
                this.initializeFront()
            }
            if (this.elems.backCover.length) {
                this.hasBack = true;
                this.initializeBack()
            }
        }
    };
    SlideDeckCover.prototype.initializeBack = function() {
        var self = this;
        if (self.elems.frame) {
            if (self.elems.frame.hasClass('sd2-small')) return false
        }
        this.elems.backWrapper = this.elems.backCover.find('.' + this.classes.wrapper);
        this.elems.backMask = this.elems.backCover.find('.' + this.classes.mask);
        this.elems.restart = this.elems.backCover.find('.' + this.classes.restart);
        var oldBefore = this.slidedeck.options.before;
        this.slidedeck.setOption('before', function(slidedeck) {
            if (typeof(oldBefore) == 'function') oldBefore(slidedeck);
            if (((slidedeck.current == 1 && slidedeck.former == slidedeck.slides.length) || (slidedeck.current == slidedeck.former && slidedeck.current == slidedeck.slides.length && slidedeck.options.cycle == false)) && slidedeck.slides.length > 1) {
                if (self.backCoverVisible == false) {
                    slidedeck.current = slidedeck.slides.length;
                    self.close()
                }
            }
        });
        this.elems.restart.bind('click', function(event) {
            event.preventDefault();
            self.revert()
        });
        if (typeof(SlideDeckCoverPostProcessCTA) == 'function') {
            SlideDeckCoverPostProcessCTA(this.elems.restart)
        }
        if (SlideDeckCoverPostProcessBack[this.coverStyle]) SlideDeckCoverPostProcessBack[this.coverStyle](this.elems.restart, this.elems.frame.hasClass('slidedeck-cover-peek'));
        self.elems.backCover.hide()
    };
    SlideDeckCover.prototype.initializeFront = function() {
        var self = this;
        if (self.elems.frame) {
            if (self.elems.frame.hasClass('sd2-small')) return false
        }
        this.elems.frontWrapper = this.elems.frontCover.find('.' + this.classes.wrapper);
        this.elems.frontMask = this.elems.frontCover.find('.' + this.classes.mask);
        this.elems.open = this.elems.frontCover.find('.' + this.classes.open);
        this.elems.frame.addClass('force-nav-hidden');
        this.elems.overlay.css('opacity', 0);
        this.slidedeck.pauseAutoPlay = true;
        this.slidedeck.setOption('keys', false);
        this.slidedeck.setOption('scroll', false);
        this.elems.open.bind('click', function(event) {
            event.preventDefault();
            self.open()
        });
        if (this.slidedeck.options.autoPlay == true) {
            setTimeout(function() {
                self.open()
            }, this.slidedeck.options.autoPlayInterval)
        }
        if (typeof(SlideDeckCoverPostProcessCTA) == 'function') {
            SlideDeckCoverPostProcessCTA(this.elems.open)
        }
        if (SlideDeckCoverPostProcessFront[this.coverStyle]) SlideDeckCoverPostProcessFront[this.coverStyle](this.elems.open, this.elems.frame.hasClass('slidedeck-cover-peek'));
        $(window).load(function() {
            self.elems.frontMask.animate({
                opacity: 0.35
            }, 1000)
        })
    };
    SlideDeckCoverPostProcessFront['leather'] = function($button, peek) {
        var $color = $button.find('.slidedeck-cover-color');
        var accentColor = $color.css('background-color');
        var rgb = Raphael.getRGB(accentColor);
        var hsl = Raphael.rgb2hsl(rgb.r, rgb.g, rgb.b);
        hsl.l = Math.min(100, (110 * hsl.l)) / 100;
        var hoverColor = Raphael.hsl(hsl.h, hsl.s, hsl.l);
        var r = Raphael($color[0], 42, 84);
        var offset = peek ? 0 : 42;
        var shape = r.ellipse(offset, 42, 41, 42);
        shape.attr({
            'stroke': 'none',
            'fill': accentColor
        });
        $color.css('background-color', "").data('slidedeck-cover-shape', shape);
        $button.bind('mouseenter', function(event) {
            shape.attr('fill', hoverColor)
        }).bind('mouseleave', function(event) {
            shape.attr('fill', accentColor)
        });
        $button.closest('.slidedeck-frame')[0].className = $button.closest('.slidedeck-frame')[0].className.replace(/slidedeck-cover-easing-([a-z0-9A-Z\-]+)/, "slidedeck-cover-easing-back")
    };
    SlideDeckCoverPostProcessBack['leather'] = function($button, peek) {
        var $color = $button.find('.slidedeck-cover-color');
        var accentColor = $color.css('background-color');
        var rgb = Raphael.getRGB(accentColor);
        var hsl = Raphael.rgb2hsl(rgb.r, rgb.g, rgb.b);
        hsl.l = Math.min(100, (110 * hsl.l)) / 100;
        var hoverColor = Raphael.hsl(hsl.h, hsl.s, hsl.l);
        var r = Raphael($color[0], 42, 84);
        var offset = peek ? 42 : 0;
        var shape = r.ellipse(offset, 42, 41, 42);
        shape.attr({
            'stroke': 'none',
            'fill': accentColor
        });
        $button.bind('mouseenter', function(event) {
            shape.attr('fill', hoverColor)
        }).bind('mouseleave', function(event) {
            shape.attr('fill', accentColor)
        });
        var ctaButton = $button.parents('.slidedeck-cover-wrapper').find('.slidedeck-cover-cta');
        var ctaButtonColor = ctaButton.find('.slidedeck-cover-color');
        ctaButtonColor.find('.cap2').remove();
        ctaButtonColor.find('.cap2-image').remove();
        ctaButton.find('.cap1').remove();
        ctaButton.find('.cap1-image').remove();
        ctaButtonColor.append('<div class="cap2"></div>');
        ctaButtonColor.append('<div class="cap2-image"></div>');
        ctaButton.append('<div class="cap1"></div>');
        ctaButton.append('<div class="cap1-image"></div>');
        var r1 = Raphael(ctaButton.find('.cap1')[0], 32, 57);
        var r2 = Raphael(ctaButtonColor.find('.cap2')[0], 32, 57);
        var cap1 = r1.ellipse(31, 29, 26, 26);
        cap1.attr({
            fill: accentColor
        });
        var cap2 = r2.ellipse(0, 29, 26, 26);
        cap2.attr({
            fill: accentColor
        });
        $color.css('background-color', "").data('slidedeck-cover-shape', [shape, cap1, cap2]);
        ctaButton.bind('mouseenter', function(event) {
            cap1.attr('fill', hoverColor);
            cap2.attr('fill', hoverColor)
        }).bind('mouseleave', function(event) {
            cap1.attr('fill', accentColor);
            cap2.attr('fill', accentColor)
        });
        $button.closest('.slidedeck-frame')[0].className = $button.closest('.slidedeck-frame')[0].className.replace(/slidedeck-cover-easing-([a-z0-9A-Z\-]+)/, "slidedeck-cover-easing-back")
    };
    SlideDeckCoverPostProcessFront['book'] = function($button, peek) {
        var $color = $button.find('.slidedeck-cover-color');
        var accentColor = $color.css('background-color');
        var rgb = Raphael.getRGB(accentColor);
        var hsl = Raphael.rgb2hsl(rgb.r, rgb.g, rgb.b);
        hsl.l = Math.min(100, (110 * hsl.l)) / 100;
        var hoverColor = Raphael.hsl(hsl.h, hsl.s, hsl.l);
        var r = Raphael($color[0], 90, 72);
        if (peek) {
            var shape = r.path("M84.246,0.901c-4.648-0.482-11.957-0.625-22.065-0.822L60.646,0.05  C58.979,0.017,57.227,0,55.445,0C33.884,0,5.432,2.263,0,2.712c0,0.037,0,0.111,0,0.201v67.831c0,0,29.504-2.716,49-2  c23.397,0.86,40.878,4.236,40.878-1.404c0-0.154,0-0.354,0-0.596c0.099,0.03,0.205,0.057,0.297,0.09c0-4.062,0-64.046,0-64.046  C90.176,2.31,89.408,1.434,84.246,0.901z")
        } else {
            var shape = r.path("M92.65,2.782c0,0-37.278-3.218-61.673-2.739 C9.446,0.466,0.471,0.56,0.471,3.781c0,3.626,0,59.199,0,66.549c-0.053-0.429,0.106-0.775,0.436-1.061 c1.439,4.389,14.292,1.716,35.801,1.333c18.233-0.327,55.941,1.146,55.941,1.146v-0.941h0.001V2.782z")
        }
        shape.attr({
            'stroke': 'none',
            'fill': accentColor
        });
        $color.css('background-color', "").data('slidedeck-cover-shape', shape);
        $button.bind('mouseenter', function(event) {
            shape.attr('fill', hoverColor)
        }).bind('mouseleave', function(event) {
            shape.attr('fill', accentColor)
        });
        $button.closest('.slidedeck-frame')[0].className = $button.closest('.slidedeck-frame')[0].className.replace(/slidedeck-cover-easing-([a-z0-9A-Z\-]+)/, "slidedeck-cover-easing-smooth")
    };
    SlideDeckCoverPostProcessBack['book'] = function($button, peek) {
        var $color = $button.find('.slidedeck-cover-color');
        var accentColor = $color.css('background-color');
        var rgb = Raphael.getRGB(accentColor);
        var hsl = Raphael.rgb2hsl(rgb.r, rgb.g, rgb.b);
        hsl.l = Math.min(100, (110 * hsl.l)) / 100;
        var hoverColor = Raphael.hsl(hsl.h, hsl.s, hsl.l);
        var r = Raphael($color[0], 90, 72);
        var shape = r.path("M92.65,2.782c0,0-37.278-3.218-61.673-2.739 C9.446,0.466,0.471,0.56,0.471,3.781c0,3.626,0,59.199,0,66.549c-0.053-0.429,0.106-0.775,0.436-1.061 c1.439,4.389,14.292,1.716,35.801,1.333c18.233-0.327,55.941,1.146,55.941,1.146v-0.941h0.001V2.782z");
        shape.attr({
            'stroke': 'none',
            'fill': accentColor
        });
        $color.css('background-color', "").data('slidedeck-cover-shape', shape);
        $button.bind('mouseenter', function(event) {
            shape.attr('fill', hoverColor)
        }).bind('mouseleave', function(event) {
            shape.attr('fill', accentColor)
        });
        $button.closest('.slidedeck-frame')[0].className = $button.closest('.slidedeck-frame')[0].className.replace(/slidedeck-cover-easing-([a-z0-9A-Z\-]+)/, "slidedeck-cover-easing-smooth")
    };
    SlideDeckCoverPostProcessFront['glass'] = function($button, peek) {
        var $color = $button.find('.slidedeck-cover-color');
        var accentColor = $color.css('background-color');
        var rgb = Raphael.getRGB(accentColor);
        var hsl = Raphael.rgb2hsl(rgb.r, rgb.g, rgb.b);
        hsl.l = Math.min(100, (110 * hsl.l)) / 100;
        var hoverColor = Raphael.hsl(hsl.h, hsl.s, hsl.l);
        var frostedColor1 = Raphael.rgb2hsb(rgb.r, rgb.g, rgb.b);
        frostedColor1.s = frostedColor1.s * 0.2;
        frostedColor1.b = 1;
        var frostedColor2 = Raphael.rgb2hsb(rgb.r, rgb.g, rgb.b);
        frostedColor2.s = frostedColor2.s * 0.05;
        frostedColor2.b = 1;
        var glassGradient = '90-hsb(' + frostedColor1.h + ',' + frostedColor1.s + ',' + frostedColor1.b + ')-hsb(' + frostedColor2.h + ',' + frostedColor2.s + ',' + frostedColor2.b + ')';
        $button.parents('.slidedeck-cover-front').find('.frosted-glass').remove();
        $button.parents('.slidedeck-cover-front').find('.slidedeck-cover-copy').append('<div class="frosted-glass"></div>');
        var frosted = $button.parents('.slidedeck-cover-wrapper').find('.frosted-glass');
        var frostedWidth = frosted.width();
        var frostedHeight = frosted.height();
        var r = Raphael(frosted[0], frostedWidth, frostedHeight);
        var radius = 25;
        var offset = 10;
        var path = "M0,0";
        path += "H" + frostedWidth;
        path += "V" + frostedHeight;
        path += "H0";
        path += "z";
        path += "M " + parseInt(frostedWidth - (radius * 2) - offset, 10) + " " + parseInt(frostedHeight / 2, 10) + " a " + radius + " " + radius + " 0 1 0 0 " + -0.0001;
        path += "m14,-6h13v-4l12,11,l-12,11,v-4h-13";
        var frostedPathBackground = r.path(path);
        frostedPathBackground.attr({
            stroke: "none",
            fill: 'url(' + slideDeck2URLPath + '/images/frosted-glass-noise.png)',
            opacity: 1
        });
        var frostedPath = r.path(path);
        frostedPath.attr({
            stroke: "none",
            fill: glassGradient,
            opacity: 0.6
        });
        frosted.data('slidedeck-frosted-cover-background', frostedPath);
        var path = "M0,0";
        path += "H" + frostedWidth;
        path += "V" + frostedHeight * 0.1;
        path += "Q" + frostedWidth * 0.3 + "," + frostedHeight * 0.3 + ", 0 " + frostedHeight * 0.85;
        path += "z";
        var shinePath = r.path(path);
        shinePath.attr({
            stroke: "none",
            fill: glassGradient,
            opacity: 0.2
        });
        frosted.data('slidedeck-frosted-cover-shine', shinePath)
    };
    SlideDeckCoverPostProcessBack['glass'] = function($button, peek) {
        var $color = $button.find('.slidedeck-cover-color');
        var accentColor = $color.css('background-color');
        var rgb = Raphael.getRGB(accentColor);
        var hsl = Raphael.rgb2hsl(rgb.r, rgb.g, rgb.b);
        hsl.l = Math.min(100, (110 * hsl.l)) / 100;
        var hoverColor = Raphael.hsl(hsl.h, hsl.s, hsl.l);
        var frostedColor1 = Raphael.rgb2hsb(rgb.r, rgb.g, rgb.b);
        frostedColor1.s = frostedColor1.s * 0.2;
        frostedColor1.b = 1;
        var frostedColor2 = Raphael.rgb2hsb(rgb.r, rgb.g, rgb.b);
        frostedColor2.s = frostedColor2.s * 0.05;
        frostedColor2.b = 1;
        var glassGradient = '90-hsb(' + frostedColor1.h + ',' + frostedColor1.s + ',' + frostedColor1.b + ')-hsb(' + frostedColor2.h + ',' + frostedColor2.s + ',' + frostedColor2.b + ')';
        $button.parents('.slidedeck-cover-back').find('.frosted-glass-back').remove();
        $button.parents('.slidedeck-cover-back').find('.slidedeck-cover-copy').append('<div class="frosted-glass-back"></div>');
        var frosted = $button.parents('.slidedeck-cover-back').find('.frosted-glass-back');
        var frostedWidth = frosted.width();
        var frostedHeight = frosted.height();
        var r = Raphael(frosted[0], frostedWidth, frostedHeight);
        var radius = 25;
        var offset = 10;
        var path = "M0,0";
        path += "H" + frostedWidth;
        path += "V" + frostedHeight;
        path += "H0";
        path += "z";
        path += "M " + parseInt(radius - offset, 10) + " " + parseInt(frostedHeight / 2, 10) + " a " + radius + " " + radius + " 0 1 0 0 " + -0.0001;
        var frostedPathBackground = r.path(path);
        frostedPathBackground.attr({
            stroke: "none",
            fill: 'url(' + slideDeck2URLPath + '/images/frosted-glass-noise.png)',
            opacity: 1
        });
        var frostedPath = r.path(path);
        frostedPath.attr({
            stroke: "none",
            fill: glassGradient,
            opacity: 0.6
        });
        frosted.data('slidedeck-frosted-cover-back-background', frostedPath);
        var path = "M0,0";
        path += "H" + frostedWidth;
        path += "V" + frostedHeight * 0.1;
        path += "Q" + frostedWidth * 0.3 + "," + frostedHeight * 0.3 + ", 0 " + frostedHeight * 0.85;
        path += "z";
        path += "M " + parseInt((radius) - offset, 10) + " " + parseInt(frostedHeight / 2, 10) + " a " + radius + " " + radius + " 0 1 0 0 " + -0.0001;
        var shinePath = r.path(path);
        shinePath.attr({
            stroke: "none",
            fill: glassGradient,
            opacity: 0.2
        });
        frosted.data('slidedeck-frosted-cover-back-shine', shinePath)
    };
    var SlideDeckCoverPostProcessCTA = function($button) {
        var $color = $button.find('.slidedeck-cover-color');
        var accentColor = $color.css('background-color');
        var rgb = Raphael.getRGB(accentColor);
        var hsl = Raphael.rgb2hsl(rgb.r, rgb.g, rgb.b);
        hsl.l = Math.min(100, (110 * hsl.l)) / 100;
        var hoverColor = Raphael.hsl(hsl.h, hsl.s, hsl.l);
        $button.parent().delegate('.slidedeck-cover-cta', 'mouseenter mouseleave', function(event) {
            if (event.type == 'mouseenter') {
                $(this).find('.slidedeck-cover-color').css({
                    backgroundColor: hoverColor
                })
            } else {
                $(this).find('.slidedeck-cover-color').css({
                    backgroundColor: accentColor
                })
            }
        })
    };
    $(document).ready(function() {
        $('.slidedeck').each(function() {
            if (!$.data(this, 'SlideDeckCover')) $.data(this, 'SlideDeckCover', new SlideDeckCover(this))
        })
    })
})(jQuery);

/*!
// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Raphaël 2.1.0 - JavaScript Vector Library                          │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2008-2012 Dmitry Baranovskiy (http://raphaeljs.com)    │ \\
// │ Copyright © 2008-2012 Sencha Labs (http://sencha.com)              │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Licensed under the MIT (http://raphaeljs.com/license.html) license.│ \\
// └────────────────────────────────────────────────────────────────────┘ \\
*/
(function(v) {
    var u = "0.3.4",
        t = "hasOwnProperty",
        s = /[\.\/]/,
        r = "*",
        q = function() {},
        p = function(d, c) {
            return d - c
        },
        o, n, m = {
            n: {}
        },
        l = function(D, C) {
            var B = m,
                A = n,
                z = Array.prototype.slice.call(arguments, 2),
                y = l.listeners(D),
                x = 0,
                w = !1,
                k, j = [],
                i = {},
                h = [],
                g = o,
                G = [];
            o = D, n = 0;
            for (var F = 0, E = y.length; F < E; F++) {
                "zIndex" in y[F] && (j.push(y[F].zIndex), y[F].zIndex < 0 && (i[y[F].zIndex] = y[F]))
            }
            j.sort(p);
            while (j[x] < 0) {
                k = i[j[x++]], h.push(k.apply(C, z));
                if (n) {
                    n = A;
                    return h
                }
            }
            for (F = 0; F < E; F++) {
                k = y[F];
                if ("zIndex" in k) {
                    if (k.zIndex == j[x]) {
                        h.push(k.apply(C, z));
                        if (n) {
                            break
                        }
                        do {
                            x++, k = i[j[x]], k && h.push(k.apply(C, z));
                            if (n) {
                                break
                            }
                        } while (k)
                    } else {
                        i[k.zIndex] = k
                    }
                } else {
                    h.push(k.apply(C, z));
                    if (n) {
                        break
                    }
                }
            }
            n = A, o = g;
            return h.length ? h : null
        };
    l.listeners = function(F) {
        var E = F.split(s),
            D = m,
            C, B, A, z, y, x, w, j, e = [D],
            d = [];
        for (z = 0, y = E.length; z < y; z++) {
            j = [];
            for (x = 0, w = e.length; x < w; x++) {
                D = e[x].n, B = [D[E[z]], D[r]], A = 2;
                while (A--) {
                    C = B[A], C && (j.push(C), d = d.concat(C.f || []))
                }
            }
            e = j
        }
        return d
    }, l.on = function(f, d) {
        var w = f.split(s),
            k = m;
        for (var j = 0, i = w.length; j < i; j++) {
            k = k.n, !k[w[j]] && (k[w[j]] = {
                n: {}
            }), k = k[w[j]]
        }
        k.f = k.f || [];
        for (j = 0, i = k.f.length; j < i; j++) {
            if (k.f[j] == d) {
                return q
            }
        }
        k.f.push(d);
        return function(b) {
            +b == +b && (d.zIndex = +b)
        }
    }, l.stop = function() {
        n = 1
    }, l.nt = function(b) {
        if (b) {
            return (new RegExp("(?:\\.|\\/|^)" + b + "(?:\\.|\\/|$)")).test(o)
        }
        return o
    }, l.off = l.unbind = function(D, C) {
        var B = D.split(s),
            A, z, y, x, w, j, e, d = [m];
        for (x = 0, w = B.length; x < w; x++) {
            for (j = 0; j < d.length; j += y.length - 2) {
                y = [j, 1], A = d[j].n;
                if (B[x] != r) {
                    A[B[x]] && y.push(A[B[x]])
                } else {
                    for (z in A) {
                        A[t](z) && y.push(A[z])
                    }
                }
                d.splice.apply(d, y)
            }
        }
        for (x = 0, w = d.length; x < w; x++) {
            A = d[x];
            while (A.n) {
                if (C) {
                    if (A.f) {
                        for (j = 0, e = A.f.length; j < e; j++) {
                            if (A.f[j] == C) {
                                A.f.splice(j, 1);
                                break
                            }
                        }!A.f.length && delete A.f
                    }
                    for (z in A.n) {
                        if (A.n[t](z) && A.n[z].f) {
                            var c = A.n[z].f;
                            for (j = 0, e = c.length; j < e; j++) {
                                if (c[j] == C) {
                                    c.splice(j, 1);
                                    break
                                }
                            }!c.length && delete A.n[z].f
                        }
                    }
                } else {
                    delete A.f;
                    for (z in A.n) {
                        A.n[t](z) && A.n[z].f && delete A.n[z].f
                    }
                }
                A = A.n
            }
        }
    }, l.once = function(e, d) {
        var f = function() {
            var a = d.apply(this, arguments);
            l.unbind(e, f);
            return a
        };
        return l.on(e, f)
    }, l.version = u, l.toString = function() {
        return "You are running Eve " + u
    }, typeof module != "undefined" && module.exports ? module.exports = l : typeof define != "undefined" ? define("eve", [], function() {
        return l
    }) : v.eve = l
})(this),
function() {
    function cX(d) {
        for (var c = 0; c < ab.length; c++) {
            ab[c].el.paper == d && ab.splice(c--, 1)
        }
    }

    function c0(br, bq, bp, bo, bn, bm) {
        bp = c4(bp);
        var bl, bk, bj, bi = [],
            bh, bg, be, bb = br.ms,
            Z = {},
            X = {},
            V = {};
        if (bo) {
            for (Q = 0, C = ab.length; Q < C; Q++) {
                var T = ab[Q];
                if (T.el.id == bq.id && T.anim == br) {
                    T.percent != bp ? (ab.splice(Q, 1), bj = 1) : bk = T, bq.attr(T.totalOrigin);
                    break
                }
            }
        } else {
            bo = +X
        }
        for (var Q = 0, C = br.percents.length; Q < C; Q++) {
            if (br.percents[Q] == bp || br.percents[Q] > bo * br.top) {
                bp = br.percents[Q], bg = br.percents[Q - 1] || 0, bb = bb / br.top * (bp - bg), bh = br.percents[Q + 1], bl = br.anim[bp];
                break
            }
            bo && bq.attr(br.anim[br.percents[Q]])
        }
        if (!!bl) {
            if (!bk) {
                for (var bf in bl) {
                    if (bl[aV](bf)) {
                        if (cS[aV](bf) || bq.paper.customAttributes[aV](bf)) {
                            Z[bf] = bq.attr(bf), Z[bf] == null && (Z[bf] = cV[bf]), X[bf] = bl[bf];
                            switch (cS[bf]) {
                                case dv:
                                    V[bf] = (X[bf] - Z[bf]) / bb;
                                    break;
                                case "colour":
                                    Z[bf] = a8.getRGB(Z[bf]);
                                    var bd = a8.getRGB(X[bf]);
                                    V[bf] = {
                                        r: (bd.r - Z[bf].r) / bb,
                                        g: (bd.g - Z[bf].g) / bb,
                                        b: (bd.b - Z[bf].b) / bb
                                    };
                                    break;
                                case "path":
                                    var bc = dA(Z[bf], X[bf]),
                                        ba = bc[1];
                                    Z[bf] = bc[0], V[bf] = [];
                                    for (Q = 0, C = Z[bf].length; Q < C; Q++) {
                                        V[bf][Q] = [0];
                                        for (var Y = 1, W = Z[bf][Q].length; Y < W; Y++) {
                                            V[bf][Q][Y] = (ba[Q][Y] - Z[bf][Q][Y]) / bb
                                        }
                                    }
                                    break;
                                case "transform":
                                    var U = bq._,
                                        S = aM(U[bf], X[bf]);
                                    if (S) {
                                        Z[bf] = S.from, X[bf] = S.to, V[bf] = [], V[bf].real = !0;
                                        for (Q = 0, C = Z[bf].length; Q < C; Q++) {
                                            V[bf][Q] = [Z[bf][Q][0]];
                                            for (Y = 1, W = Z[bf][Q].length; Y < W; Y++) {
                                                V[bf][Q][Y] = (X[bf][Q][Y] - Z[bf][Q][Y]) / bb
                                            }
                                        }
                                    } else {
                                        var N = bq.matrix || new aL,
                                            s = {
                                                _: {
                                                    transform: U.transform
                                                },
                                                getBBox: function() {
                                                    return bq.getBBox(1)
                                                }
                                            };
                                        Z[bf] = [N.a, N.b, N.c, N.d, N.e, N.f], dT(s, X[bf]), X[bf] = s._.transform, V[bf] = [(s.matrix.a - N.a) / bb, (s.matrix.b - N.b) / bb, (s.matrix.c - N.c) / bb, (s.matrix.d - N.d) / bb, (s.matrix.e - N.e) / bb, (s.matrix.f - N.f) / bb]
                                    }
                                    break;
                                case "csv":
                                    var r = aF(bl[bf])[aD](a3),
                                        n = aF(Z[bf])[aD](a3);
                                    if (bf == "clip-rect") {
                                        Z[bf] = n, V[bf] = [], Q = n.length;
                                        while (Q--) {
                                            V[bf][Q] = (r[Q] - Z[bf][Q]) / bb
                                        }
                                    }
                                    X[bf] = r;
                                    break;
                                default:
                                    r = [][aN](bl[bf]), n = [][aN](Z[bf]), V[bf] = [], Q = bq.paper.customAttributes[bf].length;
                                    while (Q--) {
                                        V[bf][Q] = ((r[Q] || 0) - (n[Q] || 0)) / bb
                                    }
                            }
                        }
                    }
                }
                var g = bl.easing,
                    c = a8.easing_formulas[g];
                if (!c) {
                    c = aF(g).match(dc);
                    if (c && c.length == 5) {
                        var a = c;
                        c = function(b) {
                            return c6(b, +a[1], +a[2], +a[3], +a[4], bb)
                        }
                    } else {
                        c = cU
                    }
                }
                be = bl.start || br.start || +(new Date), T = {
                    anim: br,
                    percent: bp,
                    timestamp: be,
                    start: be + (br.del || 0),
                    status: 0,
                    initstatus: bo || 0,
                    stop: !1,
                    ms: bb,
                    easing: c,
                    from: Z,
                    diff: V,
                    to: X,
                    el: bq,
                    callback: bl.callback,
                    prev: bg,
                    next: bh,
                    repeat: bm || br.times,
                    origin: bq.attr(),
                    totalOrigin: bn
                }, ab.push(T);
                if (bo && !bk && !bj) {
                    T.stop = !0, T.start = new Date - bb * bo;
                    if (ab.length == 1) {
                        return db()
                    }
                }
                bj && (T.start = new Date - T.ms * bo), ab.length == 1 && aa(db)
            } else {
                bk.initstatus = bo, bk.start = new Date - bk.ms * bo
            }
            eve("raphael.anim.start." + bq.id, bq, br)
        }
    }

    function c3(g, f) {
        var j = [],
            i = {};
        this.ms = f, this.times = 1;
        if (g) {
            for (var h in g) {
                g[aV](h) && (i[c4(h)] = g[h], j.push(c4(h)))
            }
            j.sort(cZ)
        }
        this.anim = i, this.top = j[j.length - 1], this.percents = j
    }

    function c6(D, C, B, A, z, y) {
        function p(h, g) {
            var E, o, n, m, l, i;
            for (n = h, i = 0; i < 8; i++) {
                m = r(n) - h;
                if (ao(m) < g) {
                    return n
                }
                l = (3 * v * n + 2 * w) * n + x;
                if (ao(l) < 0.000001) {
                    break
                }
                n = n - m / l
            }
            E = 0, o = 1, n = h;
            if (n < E) {
                return E
            }
            if (n > o) {
                return o
            }
            while (E < o) {
                m = r(n);
                if (ao(m - h) < g) {
                    return n
                }
                h > m ? E = n : o = n, n = (o - E) / 2 + E
            }
            return n
        }

        function q(e, d) {
            var f = p(e, d);
            return ((s * f + t) * f + u) * f
        }

        function r(b) {
            return ((v * b + w) * b + x) * b
        }
        var x = 3 * C,
            w = 3 * (A - C) - x,
            v = 1 - x - w,
            u = 3 * B,
            t = 3 * (z - B) - u,
            s = 1 - u - t;
        return q(D, 1 / (200 * y))
    }

    function aj() {
        return this.x + aH + this.y + aH + this.width + " × " + this.height
    }

    function ak() {
        return this.x + aH + this.y
    }

    function aL(h, g, l, k, j, i) {
        h != null ? (this.a = +h, this.b = +g, this.c = +l, this.d = +k, this.e = +j, this.f = +i) : (this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.e = 0, this.f = 0)
    }

    function dK(T, S, R) {
        T = a8._path2curve(T), S = a8._path2curve(S);
        var Q, P, O, N, M, L, K, J, I, H, G = R ? 0 : [];
        for (var F = 0, E = T.length; F < E; F++) {
            var D = T[F];
            if (D[0] == "M") {
                Q = M = D[1], P = L = D[2]
            } else {
                D[0] == "C" ? (I = [Q, P].concat(D.slice(1)), Q = I[6], P = I[7]) : (I = [Q, P, Q, P, M, L, M, L], Q = M, P = L);
                for (var C = 0, B = S.length; C < B; C++) {
                    var A = S[C];
                    if (A[0] == "M") {
                        O = K = A[1], N = J = A[2]
                    } else {
                        A[0] == "C" ? (H = [O, N].concat(A.slice(1)), O = H[6], N = H[7]) : (H = [O, N, O, N, K, J, K, J], O = K, N = J);
                        var z = dL(I, H, R);
                        if (R) {
                            G += z
                        } else {
                            for (var y = 0, a = z.length; y < a; y++) {
                                z[y].segment1 = F, z[y].segment2 = C, z[y].bez1 = I, z[y].bez2 = H
                            }
                            G = G.concat(z)
                        }
                    }
                }
            }
        }
        return G
    }

    function dL(X, W, V) {
        var U = a8.bezierBBox(X),
            T = a8.bezierBBox(W);
        if (!a8.isBBoxIntersect(U, T)) {
            return V ? 0 : []
        }
        var S = dQ.apply(0, X),
            R = dQ.apply(0, W),
            Q = ~~(S / 5),
            P = ~~(R / 5),
            O = [],
            N = [],
            M = {},
            L = V ? 0 : [];
        for (var K = 0; K < Q + 1; K++) {
            var J = a8.findDotsAtSegment.apply(a8, X.concat(K / Q));
            O.push({
                x: J.x,
                y: J.y,
                t: K / Q
            })
        }
        for (K = 0; K < P + 1; K++) {
            J = a8.findDotsAtSegment.apply(a8, W.concat(K / P)), N.push({
                x: J.x,
                y: J.y,
                t: K / P
            })
        }
        for (K = 0; K < Q; K++) {
            for (var H = 0; H < P; H++) {
                var G = O[K],
                    F = O[K + 1],
                    E = N[H],
                    D = N[H + 1],
                    C = ao(F.x - G.x) < 0.001 ? "y" : "x",
                    B = ao(D.x - E.x) < 0.001 ? "y" : "x",
                    z = dO(G.x, G.y, F.x, F.y, E.x, E.y, D.x, D.y);
                if (z) {
                    if (M[z.x.toFixed(4)] == z.y.toFixed(4)) {
                        continue
                    }
                    M[z.x.toFixed(4)] = z.y.toFixed(4);
                    var a = G.t + ao((z[C] - G[C]) / (F[C] - G[C])) * (F.t - G.t),
                        I = E.t + ao((z[B] - E[B]) / (D[B] - E[B])) * (D.t - E.t);
                    a >= 0 && a <= 1 && I >= 0 && I <= 1 && (V ? L++ : L.push({
                        x: z.x,
                        y: z.y,
                        t1: a,
                        t2: I
                    }))
                }
            }
        }
        return L
    }

    function dM(d, c) {
        return dL(d, c, 1)
    }

    function dN(d, c) {
        return dL(d, c)
    }

    function dO(D, C, B, A, z, y, x, w) {
        if (!(at(D, B) < aq(z, x) || aq(D, B) > at(z, x) || at(C, A) < aq(y, w) || aq(C, A) > at(y, w))) {
            var v = (D * A - C * B) * (z - x) - (D - B) * (z * w - y * x),
                u = (D * A - C * B) * (y - w) - (C - A) * (z * w - y * x),
                t = (D - B) * (y - w) - (C - A) * (z - x);
            if (!t) {
                return
            }
            var s = v / t,
                r = u / t,
                q = +s.toFixed(2),
                p = +r.toFixed(2);
            if (q < +aq(D, B).toFixed(2) || q > +at(D, B).toFixed(2) || q < +aq(z, x).toFixed(2) || q > +at(z, x).toFixed(2) || p < +aq(C, A).toFixed(2) || p > +at(C, A).toFixed(2) || p < +aq(y, w).toFixed(2) || p > +at(y, w).toFixed(2)) {
                return
            }
            return {
                x: s,
                y: r
            }
        }
    }

    function dP(B, A, z, y, x, w, v, u, t) {
        if (!(t < 0 || dQ(B, A, z, y, x, w, v, u) < t)) {
            var s = 1,
                r = s / 2,
                q = s - r,
                p, o = 0.01;
            p = dQ(B, A, z, y, x, w, v, u, q);
            while (ao(p - t) > o) {
                r /= 2, q += (p < t ? 1 : -1) * r, p = dQ(B, A, z, y, x, w, v, u, q)
            }
            return q
        }
    }

    function dQ(L, K, J, I, H, G, F, E, D) {
        D == null && (D = 1), D = D > 1 ? 1 : D < 0 ? 0 : D;
        var C = D / 2,
            B = 12,
            A = [-0.1252, 0.1252, -0.3678, 0.3678, -0.5873, 0.5873, -0.7699, 0.7699, -0.9041, 0.9041, -0.9816, 0.9816],
            z = [0.2491, 0.2491, 0.2335, 0.2335, 0.2032, 0.2032, 0.1601, 0.1601, 0.1069, 0.1069, 0.0472, 0.0472],
            y = 0;
        for (var x = 0; x < B; x++) {
            var w = C * A[x] + C,
                v = dR(w, L, J, H, F),
                u = dR(w, K, I, G, E),
                t = v * v + u * u;
            y += z[x] * av.sqrt(t)
        }
        return C * y
    }

    function dR(i, h, n, m, l) {
        var k = -3 * h + 9 * n - 9 * m + 3 * l,
            j = i * k + 6 * h - 12 * n + 6 * m;
        return i * j - 3 * h + 3 * n
    }

    function aW(h, g) {
        var l = [];
        for (var k = 0, j = h.length; j - 2 * !g > k; k += 2) {
            var i = [{
                x: +h[k - 2],
                y: +h[k - 1]
            }, {
                x: +h[k],
                y: +h[k + 1]
            }, {
                x: +h[k + 2],
                y: +h[k + 3]
            }, {
                x: +h[k + 4],
                y: +h[k + 5]
            }];
            g ? k ? j - 4 == k ? i[3] = {
                x: +h[0],
                y: +h[1]
            } : j - 2 == k && (i[2] = {
                x: +h[0],
                y: +h[1]
            }, i[3] = {
                x: +h[2],
                y: +h[3]
            }) : i[0] = {
                x: +h[j - 2],
                y: +h[j - 1]
            } : j - 4 == k ? i[3] = i[2] : k || (i[0] = {
                x: +h[k],
                y: +h[k + 1]
            }), l.push(["C", (-i[0].x + 6 * i[1].x + i[2].x) / 6, (-i[0].y + 6 * i[1].y + i[2].y) / 6, (i[1].x + 6 * i[2].x - i[3].x) / 6, (i[1].y + 6 * i[2].y - i[3].y) / 6, i[2].x, i[2].y])
        }
        return l
    }

    function aY() {
        return this.hex
    }

    function a2(f, e, h) {
        function g() {
            var d = Array.prototype.slice.call(arguments, 0),
                c = d.join("␀"),
                b = g.cache = g.cache || {},
                a = g.count = g.count || [];
            if (b[aV](c)) {
                a4(a, c);
                return h ? h(b[c]) : b[c]
            }
            a.length >= 1000 && delete b[a.shift()], a.push(c), b[c] = f[aO](e, d);
            return h ? h(b[c]) : b[c]
        }
        return g
    }

    function a4(f, e) {
        for (var h = 0, g = f.length; h < g; h++) {
            if (f[h] === e) {
                return f.push(f.splice(h, 1)[0])
            }
        }
    }

    function b5(e) {
        if (Object(e) !== e) {
            return e
        }
        var d = new e.constructor;
        for (var f in e) {
            e[aV](f) && (d[f] = b5(e[f]))
        }
        return d
    }

    function a8(f) {
        if (a8.is(f, "function")) {
            return a6 ? f() : eve.on("raphael.DOMload", f)
        }
        if (a8.is(f, dr)) {
            return a8._engine.create[aO](a8, f.splice(0, 3 + a8.is(f[0], dv))).add(f)
        }
        var b = Array.prototype.slice.call(arguments, 0);
        if (a8.is(b[b.length - 1], "function")) {
            var a = b.pop();
            return a6 ? a.call(a8._engine.create[aO](a8, b)) : eve.on("raphael.DOMload", function() {
                a.call(a8._engine.create[aO](a8, b))
            })
        }
        return a8._engine.create[aO](a8, arguments)
    }
    a8.version = "2.1.0", a8.eve = eve;
    var a6, a3 = /[, ]+/,
        a1 = {
            circle: 1,
            rect: 1,
            path: 1,
            ellipse: 1,
            text: 1,
            image: 1
        },
        a0 = /\{(\d+)\}/g,
        aX = "prototype",
        aV = "hasOwnProperty",
        aU = {
            doc: document,
            win: window
        },
        aS = {
            was: Object.prototype[aV].call(aU.win, "Raphael"),
            is: aU.win.Raphael
        },
        aR = function() {
            this.ca = this.customAttributes = {}
        },
        aQ, aP = "appendChild",
        aO = "apply",
        aN = "concat",
        aK = "createTouch" in aU.doc,
        aJ = "",
        aH = " ",
        aF = String,
        aD = "split",
        aB = "click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend touchcancel" [aD](aH),
        az = {
            mousedown: "touchstart",
            mousemove: "touchmove",
            mouseup: "touchend"
        },
        ax = aF.prototype.toLowerCase,
        av = Math,
        at = av.max,
        aq = av.min,
        ao = av.abs,
        dz = av.pow,
        dx = av.PI,
        dv = "number",
        dt = "string",
        dr = "array",
        dp = "toString",
        dm = "fill",
        dk = Object.prototype.toString,
        di = {},
        dh = "push",
        dg = a8._ISURL = /^url\(['"]?([^\)]+?)['"]?\)$/i,
        df = /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i,
        de = {
            NaN: 1,
            Infinity: 1,
            "-Infinity": 1
        },
        dc = /^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/,
        da = av.round,
        c7 = "setAttribute",
        c4 = parseFloat,
        c1 = parseInt,
        cY = aF.prototype.toUpperCase,
        cV = a8._availableAttrs = {
            "arrow-end": "none",
            "arrow-start": "none",
            blur: 0,
            "clip-rect": "0 0 1e9 1e9",
            cursor: "default",
            cx: 0,
            cy: 0,
            fill: "#fff",
            "fill-opacity": 1,
            font: '10px "Arial"',
            "font-family": '"Arial"',
            "font-size": "10",
            "font-style": "normal",
            "font-weight": 400,
            gradient: 0,
            height: 0,
            href: "http://raphaeljs.com/",
            "letter-spacing": 0,
            opacity: 1,
            path: "M0,0",
            r: 0,
            rx: 0,
            ry: 0,
            src: "",
            stroke: "#000",
            "stroke-dasharray": "",
            "stroke-linecap": "butt",
            "stroke-linejoin": "butt",
            "stroke-miterlimit": 0,
            "stroke-opacity": 1,
            "stroke-width": 1,
            target: "_blank",
            "text-anchor": "middle",
            title: "Raphael",
            transform: "",
            width: 0,
            x: 0,
            y: 0
        },
        cS = a8._availableAnimAttrs = {
            blur: dv,
            "clip-rect": "csv",
            cx: dv,
            cy: dv,
            fill: "colour",
            "fill-opacity": dv,
            "font-size": dv,
            height: dv,
            opacity: dv,
            path: "path",
            r: dv,
            rx: dv,
            ry: dv,
            stroke: "colour",
            "stroke-opacity": dv,
            "stroke-width": dv,
            transform: "transform",
            width: dv,
            x: dv,
            y: dv
        },
        cP = /[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]/g,
        cM = /[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/,
        cK = {
            hs: 1,
            rg: 1
        },
        b9 = /,?([achlmqrstvxz]),?/gi,
        b7 = /([achlmrqstvz])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/ig,
        dS = /([rstm])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/ig,
        b1 = /(-?\d*\.?\d*(?:e[\-+]?\d+)?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/ig,
        c9 = a8._radial_gradient = /^r(?:\(([^,]+?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*([^\)]+?)\))?/,
        c5 = {},
        c2 = function(d, c) {
            return d.key - c.key
        },
        cZ = function(d, c) {
            return c4(d) - c4(c)
        },
        cW = function() {},
        cU = function(b) {
            return b
        },
        cR = a8._rectPath = function(g, f, j, i, h) {
            if (h) {
                return [
                    ["M", g + h, f],
                    ["l", j - h * 2, 0],
                    ["a", h, h, 0, 0, 1, h, h],
                    ["l", 0, i - h * 2],
                    ["a", h, h, 0, 0, 1, -h, h],
                    ["l", h * 2 - j, 0],
                    ["a", h, h, 0, 0, 1, -h, -h],
                    ["l", 0, h * 2 - i],
                    ["a", h, h, 0, 0, 1, h, -h],
                    ["z"]
                ]
            }
            return [
                ["M", g, f],
                ["l", j, 0],
                ["l", 0, i],
                ["l", -j, 0],
                ["z"]
            ]
        },
        cO = function(f, e, h, g) {
            g == null && (g = h);
            return [
                ["M", f, e],
                ["m", 0, -g],
                ["a", h, g, 0, 1, 1, 0, 2 * g],
                ["a", h, g, 0, 1, 1, 0, -2 * g],
                ["z"]
            ]
        },
        cL = a8._getPath = {
            path: function(b) {
                return b.attr("path")
            },
            circle: function(d) {
                var c = d.attrs;
                return cO(c.cx, c.cy, c.r)
            },
            ellipse: function(d) {
                var c = d.attrs;
                return cO(c.cx, c.cy, c.rx, c.ry)
            },
            rect: function(d) {
                var c = d.attrs;
                return cR(c.x, c.y, c.width, c.height, c.r)
            },
            image: function(d) {
                var c = d.attrs;
                return cR(c.x, c.y, c.width, c.height)
            },
            text: function(d) {
                var c = d._getBBox();
                return cR(c.x, c.y, c.width, c.height)
            }
        },
        cJ = a8.mapPath = function(r, q) {
            if (!q) {
                return r
            }
            var p, o, n, m, l, k, j;
            r = dA(r);
            for (n = 0, l = r.length; n < l; n++) {
                j = r[n];
                for (m = 1, k = j.length; m < k; m += 2) {
                    p = q.x(j[m], j[m + 1]), o = q.y(j[m], j[m + 1]), j[m] = p, j[m + 1] = o
                }
            }
            return r
        };
    a8._g = aU, a8.type = aU.win.SVGAngle || aU.doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ? "SVG" : "VML";
    if (a8.type == "VML") {
        var b8 = aU.doc.createElement("div"),
            b6;
        b8.innerHTML = '<v:shape adj="1"/>', b6 = b8.firstChild, b6.style.behavior = "url(#default#VML)";
        if (!b6 || typeof b6.adj != "object") {
            return a8.type = aJ
        }
        b8 = null
    }
    a8.svg = !(a8.vml = a8.type == "VML"), a8._Paper = aR, a8.fn = aQ = aR.prototype = a8.prototype, a8._id = 0, a8._oid = 0, a8.is = function(d, c) {
        c = ax.call(c);
        if (c == "finite") {
            return !de[aV](+d)
        }
        if (c == "array") {
            return d instanceof Array
        }
        return c == "null" && d === null || c == typeof d && d !== null || c == "object" && d === Object(d) || c == "array" && Array.isArray && Array.isArray(d) || dk.call(d).slice(8, -1).toLowerCase() == c
    }, a8.angle = function(a, p, o, n, m, l) {
        if (m == null) {
            var k = a - o,
                j = p - n;
            if (!k && !j) {
                return 0
            }
            return (180 + av.atan2(-j, -k) * 180 / dx + 360) % 360
        }
        return a8.angle(a, p, m, l) - a8.angle(o, n, m, l)
    }, a8.rad = function(b) {
        return b % 360 * dx / 180
    }, a8.deg = function(b) {
        return b * 180 / dx % 360
    }, a8.snapTo = function(a, j, i) {
        i = a8.is(i, "finite") ? i : 10;
        if (a8.is(a, dr)) {
            var h = a.length;
            while (h--) {
                if (ao(a[h] - j) <= i) {
                    return a[h]
                }
            }
        } else {
            a = +a;
            var g = j % a;
            if (g < i) {
                return j - g
            }
            if (g > a - i) {
                return j - g + a
            }
        }
        return j
    };
    var b4 = a8.createUUID = function(d, c) {
        return function() {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(d, c).toUpperCase()
        }
    }(/[xy]/g, function(e) {
        var d = av.random() * 16 | 0,
            f = e == "x" ? d : d & 3 | 8;
        return f.toString(16)
    });
    a8.setWindow = function(a) {
        eve("raphael.setWindow", a8, aU.win, a), aU.win = a, aU.doc = aU.win.document, a8._engine.initWin && a8._engine.initWin(aU.win)
    };
    var b3 = function(a) {
            if (a8.vml) {
                var n = /^\s+|\s+$/g,
                    m;
                try {
                    var l = new ActiveXObject("htmlfile");
                    l.write("<body>"), l.close(), m = l.body
                } catch (k) {
                    m = createPopup().document.body
                }
                var j = m.createTextRange();
                b3 = a2(function(d) {
                    try {
                        m.style.color = aF(d).replace(n, aJ);
                        var c = j.queryCommandValue("ForeColor");
                        c = (c & 255) << 16 | c & 65280 | (c & 16711680) >>> 16;
                        return "#" + ("000000" + c.toString(16)).slice(-6)
                    } catch (f) {
                        return "none"
                    }
                })
            } else {
                var h = aU.doc.createElement("i");
                h.title = "Raphaël Colour Picker", h.style.display = "none", aU.doc.body.appendChild(h), b3 = a2(function(b) {
                    h.style.color = b;
                    return aU.doc.defaultView.getComputedStyle(h, aJ).getPropertyValue("color")
                })
            }
            return b3(a)
        },
        b2 = function() {
            return "hsb(" + [this.h, this.s, this.b] + ")"
        },
        b0 = function() {
            return "hsl(" + [this.h, this.s, this.l] + ")"
        },
        a9 = function() {
            return this.hex
        },
        a7 = function(a, h, g) {
            h == null && a8.is(a, "object") && "r" in a && "g" in a && "b" in a && (g = a.b, h = a.g, a = a.r);
            if (h == null && a8.is(a, dt)) {
                var f = a8.getRGB(a);
                a = f.r, h = f.g, g = f.b
            }
            if (a > 1 || h > 1 || g > 1) {
                a /= 255, h /= 255, g /= 255
            }
            return [a, h, g]
        },
        a5 = function(a, j, i, h) {
            a *= 255, j *= 255, i *= 255;
            var g = {
                r: a,
                g: j,
                b: i,
                hex: a8.rgb(a, j, i),
                toString: a9
            };
            a8.is(h, "finite") && (g.opacity = h);
            return g
        };
    a8.color = function(a) {
        var d;
        a8.is(a, "object") && "h" in a && "s" in a && "b" in a ? (d = a8.hsb2rgb(a), a.r = d.r, a.g = d.g, a.b = d.b, a.hex = d.hex) : a8.is(a, "object") && "h" in a && "s" in a && "l" in a ? (d = a8.hsl2rgb(a), a.r = d.r, a.g = d.g, a.b = d.b, a.hex = d.hex) : (a8.is(a, "string") && (a = a8.getRGB(a)), a8.is(a, "object") && "r" in a && "g" in a && "b" in a ? (d = a8.rgb2hsl(a), a.h = d.h, a.s = d.s, a.l = d.l, d = a8.rgb2hsb(a), a.v = d.b) : (a = {
            hex: "none"
        }, a.r = a.g = a.b = a.h = a.s = a.v = a.l = -1)), a.toString = a9;
        return a
    }, a8.hsb2rgb = function(r, q, p, o) {
        this.is(r, "object") && "h" in r && "s" in r && "b" in r && (p = r.b, q = r.s, r = r.h, o = r.o), r *= 360;
        var n, m, l, k, j;
        r = r % 360 / 60, j = p * q, k = j * (1 - ao(r % 2 - 1)), n = m = l = p - j, r = ~~r, n += [j, k, 0, 0, k, j][r], m += [k, j, j, k, 0, 0][r], l += [0, 0, k, j, j, k][r];
        return a5(n, m, l, o)
    }, a8.hsl2rgb = function(r, q, p, o) {
        this.is(r, "object") && "h" in r && "s" in r && "l" in r && (p = r.l, q = r.s, r = r.h);
        if (r > 1 || q > 1 || p > 1) {
            r /= 360, q /= 100, p /= 100
        }
        r *= 360;
        var n, m, l, k, j;
        r = r % 360 / 60, j = 2 * q * (p < 0.5 ? p : 1 - p), k = j * (1 - ao(r % 2 - 1)), n = m = l = p - j / 2, r = ~~r, n += [j, k, 0, 0, k, j][r], m += [k, j, j, k, 0, 0][r], l += [0, 0, k, j, j, k][r];
        return a5(n, m, l, o)
    }, a8.rgb2hsb = function(i, h, n) {
        n = a7(i, h, n), i = n[0], h = n[1], n = n[2];
        var m, l, k, j;
        k = at(i, h, n), j = k - aq(i, h, n), m = j == 0 ? null : k == i ? (h - n) / j : k == h ? (n - i) / j + 2 : (i - h) / j + 4, m = (m + 360) % 6 * 60 / 360, l = j == 0 ? 0 : j / k;
        return {
            h: m,
            s: l,
            b: k,
            toString: b2
        }
    }, a8.rgb2hsl = function(r, q, p) {
        p = a7(r, q, p), r = p[0], q = p[1], p = p[2];
        var o, n, m, l, k, j;
        l = at(r, q, p), k = aq(r, q, p), j = l - k, o = j == 0 ? null : l == r ? (q - p) / j : l == q ? (p - r) / j + 2 : (r - q) / j + 4, o = (o + 360) % 6 * 60 / 360, m = (l + k) / 2, n = j == 0 ? 0 : m < 0.5 ? j / (2 * m) : j / (2 - 2 * m);
        return {
            h: o,
            s: n,
            l: m,
            toString: b0
        }
    }, a8._path2string = function() {
        return this.join(",").replace(b9, "$1")
    };
    var aZ = a8._preload = function(e, d) {
        var f = aU.doc.createElement("img");
        f.style.cssText = "position:absolute;left:-9999em;top:-9999em", f.onload = function() {
            d.call(this), this.onload = null, aU.doc.body.removeChild(this)
        }, f.onerror = function() {
            aU.doc.body.removeChild(this)
        }, aU.doc.body.appendChild(f), f.src = e
    };
    a8.getRGB = a2(function(r) {
        if (!r || !!((r = aF(r)).indexOf("-") + 1)) {
            return {
                r: -1,
                g: -1,
                b: -1,
                hex: "none",
                error: 1,
                toString: aY
            }
        }
        if (r == "none") {
            return {
                r: -1,
                g: -1,
                b: -1,
                hex: "none",
                toString: aY
            }
        }!cK[aV](r.toLowerCase().substring(0, 2)) && r.charAt() != "#" && (r = b3(r));
        var q, p, o, n, m, l, g, a = r.match(df);
        if (a) {
            a[2] && (n = c1(a[2].substring(5), 16), o = c1(a[2].substring(3, 5), 16), p = c1(a[2].substring(1, 3), 16)), a[3] && (n = c1((l = a[3].charAt(3)) + l, 16), o = c1((l = a[3].charAt(2)) + l, 16), p = c1((l = a[3].charAt(1)) + l, 16)), a[4] && (g = a[4][aD](cM), p = c4(g[0]), g[0].slice(-1) == "%" && (p *= 2.55), o = c4(g[1]), g[1].slice(-1) == "%" && (o *= 2.55), n = c4(g[2]), g[2].slice(-1) == "%" && (n *= 2.55), a[1].toLowerCase().slice(0, 4) == "rgba" && (m = c4(g[3])), g[3] && g[3].slice(-1) == "%" && (m /= 100));
            if (a[5]) {
                g = a[5][aD](cM), p = c4(g[0]), g[0].slice(-1) == "%" && (p *= 2.55), o = c4(g[1]), g[1].slice(-1) == "%" && (o *= 2.55), n = c4(g[2]), g[2].slice(-1) == "%" && (n *= 2.55), (g[0].slice(-3) == "deg" || g[0].slice(-1) == "°") && (p /= 360), a[1].toLowerCase().slice(0, 4) == "hsba" && (m = c4(g[3])), g[3] && g[3].slice(-1) == "%" && (m /= 100);
                return a8.hsb2rgb(p, o, n, m)
            }
            if (a[6]) {
                g = a[6][aD](cM), p = c4(g[0]), g[0].slice(-1) == "%" && (p *= 2.55), o = c4(g[1]), g[1].slice(-1) == "%" && (o *= 2.55), n = c4(g[2]), g[2].slice(-1) == "%" && (n *= 2.55), (g[0].slice(-3) == "deg" || g[0].slice(-1) == "°") && (p /= 360), a[1].toLowerCase().slice(0, 4) == "hsla" && (m = c4(g[3])), g[3] && g[3].slice(-1) == "%" && (m /= 100);
                return a8.hsl2rgb(p, o, n, m)
            }
            a = {
                r: p,
                g: o,
                b: n,
                toString: aY
            }, a.hex = "#" + (16777216 | n | o << 8 | p << 16).toString(16).slice(1), a8.is(m, "finite") && (a.opacity = m);
            return a
        }
        return {
            r: -1,
            g: -1,
            b: -1,
            hex: "none",
            error: 1,
            toString: aY
        }
    }, a8), a8.hsb = a2(function(a, f, e) {
        return a8.hsb2rgb(a, f, e).hex
    }), a8.hsl = a2(function(a, f, e) {
        return a8.hsl2rgb(a, f, e).hex
    }), a8.rgb = a2(function(e, d, f) {
        return "#" + (16777216 | f | d << 8 | e << 16).toString(16).slice(1)
    }), a8.getColor = function(e) {
        var d = this.getColor.start = this.getColor.start || {
                h: 0,
                s: 1,
                b: e || 0.75
            },
            f = this.hsb2rgb(d.h, d.s, d.b);
        d.h += 0.075, d.h > 1 && (d.h = 0, d.s -= 0.2, d.s <= 0 && (this.getColor.start = {
            h: 0,
            s: 1,
            b: d.b
        }));
        return f.hex
    }, a8.getColor.reset = function() {
        delete this.start
    }, a8.parsePathString = function(a) {
        if (!a) {
            return null
        }
        var h = aT(a);
        if (h.arr) {
            return dI(h.arr)
        }
        var g = {
                a: 7,
                c: 6,
                h: 1,
                l: 2,
                m: 2,
                r: 4,
                q: 4,
                s: 4,
                t: 2,
                v: 1,
                z: 0
            },
            f = [];
        a8.is(a, dr) && a8.is(a[0], dr) && (f = dI(a)), f.length || aF(a).replace(b7, function(e, d, k) {
            var j = [],
                i = d.toLowerCase();
            k.replace(b1, function(l, c) {
                c && j.push(+c)
            }), i == "m" && j.length > 2 && (f.push([d][aN](j.splice(0, 2))), i = "l", d = d == "m" ? "l" : "L");
            if (i == "r") {
                f.push([d][aN](j))
            } else {
                while (j.length >= g[i]) {
                    f.push([d][aN](j.splice(0, g[i])));
                    if (!g[i]) {
                        break
                    }
                }
            }
        }), f.toString = a8._path2string, h.arr = dI(f);
        return f
    }, a8.parseTransformString = a2(function(a) {
        if (!a) {
            return null
        }
        var f = {
                r: 3,
                s: 4,
                t: 2,
                m: 6
            },
            e = [];
        a8.is(a, dr) && a8.is(a[0], dr) && (e = dI(a)), e.length || aF(a).replace(dS, function(g, d, j) {
            var i = [],
                h = ax.call(d);
            j.replace(b1, function(k, c) {
                c && i.push(+c)
            }), e.push([d][aN](i))
        }), e.toString = a8._path2string;
        return e
    });
    var aT = function(d) {
        var c = aT.ps = aT.ps || {};
        c[d] ? c[d].sleep = 100 : c[d] = {
            sleep: 100
        }, setTimeout(function() {
            for (var a in c) {
                c[aV](a) && a != d && (c[a].sleep--, !c[a].sleep && delete c[a])
            }
        });
        return c[d]
    };
    a8.findDotsAtSegment = function(X, W, V, U, T, S, R, Q, P) {
        var O = 1 - P,
            N = dz(O, 3),
            M = dz(O, 2),
            L = P * P,
            K = L * P,
            J = N * X + M * 3 * P * V + O * 3 * P * P * T + K * R,
            I = N * W + M * 3 * P * U + O * 3 * P * P * S + K * Q,
            H = X + 2 * P * (V - X) + L * (T - 2 * V + X),
            G = W + 2 * P * (U - W) + L * (S - 2 * U + W),
            F = V + 2 * P * (T - V) + L * (R - 2 * T + V),
            E = U + 2 * P * (S - U) + L * (Q - 2 * S + U),
            D = O * X + P * V,
            C = O * W + P * U,
            B = O * T + P * R,
            A = O * S + P * Q,
            w = 90 - av.atan2(H - F, G - E) * 180 / dx;
        (H > F || G < E) && (w += 180);
        return {
            x: J,
            y: I,
            m: {
                x: H,
                y: G
            },
            n: {
                x: F,
                y: E
            },
            start: {
                x: D,
                y: C
            },
            end: {
                x: B,
                y: A
            },
            alpha: w
        }
    }, a8.bezierBBox = function(r, q, p, o, n, m, l, k) {
        a8.is(r, "array") || (r = [r, q, p, o, n, m, l, k]);
        var a = dB.apply(null, r);
        return {
            x: a.min.x,
            y: a.min.y,
            x2: a.max.x,
            y2: a.max.y,
            width: a.max.x - a.min.x,
            height: a.max.y - a.min.y
        }
    }, a8.isPointInsideBBox = function(e, d, f) {
        return d >= e.x && d <= e.x2 && f >= e.y && f <= e.y2
    }, a8.isBBoxIntersect = function(a, f) {
        var e = a8.isPointInsideBBox;
        return e(f, a.x, a.y) || e(f, a.x2, a.y) || e(f, a.x, a.y2) || e(f, a.x2, a.y2) || e(a, f.x, f.y) || e(a, f.x2, f.y) || e(a, f.x, f.y2) || e(a, f.x2, f.y2) || (a.x < f.x2 && a.x > f.x || f.x < a.x2 && f.x > a.x) && (a.y < f.y2 && a.y > f.y || f.y < a.y2 && f.y > a.y)
    }, a8.pathIntersection = function(d, c) {
        return dK(d, c)
    }, a8.pathIntersectionNumber = function(d, c) {
        return dK(d, c, 1)
    }, a8.isPointInsidePath = function(a, h, g) {
        var f = a8.pathBBox(a);
        return a8.isPointInsideBBox(f, h, g) && dK(a, [
            ["M", h, g],
            ["H", f.x2 + 10]
        ], 1) % 2 == 1
    }, a8._removedFactory = function(b) {
        return function() {
            eve("raphael.log", null, "Raphaël: you are calling to method “" + b + "” of removed object", b)
        }
    };
    var dJ = a8.pathBBox = function(D) {
            var C = aT(D);
            if (C.bbox) {
                return C.bbox
            }
            if (!D) {
                return {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0,
                    x2: 0,
                    y2: 0
                }
            }
            D = dA(D);
            var B = 0,
                A = 0,
                z = [],
                y = [],
                x;
            for (var w = 0, v = D.length; w < v; w++) {
                x = D[w];
                if (x[0] == "M") {
                    B = x[1], A = x[2], z.push(B), y.push(A)
                } else {
                    var u = dB(B, A, x[1], x[2], x[3], x[4], x[5], x[6]);
                    z = z[aN](u.min.x, u.max.x), y = y[aN](u.min.y, u.max.y), B = x[5], A = x[6]
                }
            }
            var t = aq[aO](0, z),
                s = aq[aO](0, y),
                r = at[aO](0, z),
                n = at[aO](0, y),
                m = {
                    x: t,
                    y: s,
                    x2: r,
                    y2: n,
                    width: r - t,
                    height: n - s
                };
            C.bbox = b5(m);
            return m
        },
        dI = function(a) {
            var d = b5(a);
            d.toString = a8._path2string;
            return d
        },
        dH = a8._pathToRelative = function(H) {
            var G = aT(H);
            if (G.rel) {
                return dI(G.rel)
            }
            if (!a8.is(H, dr) || !a8.is(H && H[0], dr)) {
                H = a8.parsePathString(H)
            }
            var F = [],
                E = 0,
                D = 0,
                C = 0,
                B = 0,
                A = 0;
            H[0][0] == "M" && (E = H[0][1], D = H[0][2], C = E, B = D, A++, F.push(["M", E, D]));
            for (var z = A, y = H.length; z < y; z++) {
                var x = F[z] = [],
                    w = H[z];
                if (w[0] != ax.call(w[0])) {
                    x[0] = ax.call(w[0]);
                    switch (x[0]) {
                        case "a":
                            x[1] = w[1], x[2] = w[2], x[3] = w[3], x[4] = w[4], x[5] = w[5], x[6] = +(w[6] - E).toFixed(3), x[7] = +(w[7] - D).toFixed(3);
                            break;
                        case "v":
                            x[1] = +(w[1] - D).toFixed(3);
                            break;
                        case "m":
                            C = w[1], B = w[2];
                        default:
                            for (var v = 1, u = w.length; v < u; v++) {
                                x[v] = +(w[v] - (v % 2 ? E : D)).toFixed(3)
                            }
                    }
                } else {
                    x = F[z] = [], w[0] == "m" && (C = w[1] + E, B = w[2] + D);
                    for (var t = 0, s = w.length; t < s; t++) {
                        F[z][t] = w[t]
                    }
                }
                var a = F[z].length;
                switch (F[z][0]) {
                    case "z":
                        E = C, D = B;
                        break;
                    case "h":
                        E += +F[z][a - 1];
                        break;
                    case "v":
                        D += +F[z][a - 1];
                        break;
                    default:
                        E += +F[z][a - 2], D += +F[z][a - 1]
                }
            }
            F.toString = a8._path2string, G.rel = dI(F);
            return F
        },
        dG = a8._pathToAbsolute = function(J) {
            var I = aT(J);
            if (I.abs) {
                return dI(I.abs)
            }
            if (!a8.is(J, dr) || !a8.is(J && J[0], dr)) {
                J = a8.parsePathString(J)
            }
            if (!J || !J.length) {
                return [
                    ["M", 0, 0]
                ]
            }
            var H = [],
                G = 0,
                F = 0,
                E = 0,
                D = 0,
                C = 0;
            J[0][0] == "M" && (G = +J[0][1], F = +J[0][2], E = G, D = F, C++, H[0] = ["M", G, F]);
            var B = J.length == 3 && J[0][0] == "M" && J[1][0].toUpperCase() == "R" && J[2][0].toUpperCase() == "Z";
            for (var A, z, y = C, x = J.length; y < x; y++) {
                H.push(A = []), z = J[y];
                if (z[0] != cY.call(z[0])) {
                    A[0] = cY.call(z[0]);
                    switch (A[0]) {
                        case "A":
                            A[1] = z[1], A[2] = z[2], A[3] = z[3], A[4] = z[4], A[5] = z[5], A[6] = +(z[6] + G), A[7] = +(z[7] + F);
                            break;
                        case "V":
                            A[1] = +z[1] + F;
                            break;
                        case "H":
                            A[1] = +z[1] + G;
                            break;
                        case "R":
                            var w = [G, F][aN](z.slice(1));
                            for (var v = 2, u = w.length; v < u; v++) {
                                w[v] = +w[v] + G, w[++v] = +w[v] + F
                            }
                            H.pop(), H = H[aN](aW(w, B));
                            break;
                        case "M":
                            E = +z[1] + G, D = +z[2] + F;
                        default:
                            for (v = 1, u = z.length; v < u; v++) {
                                A[v] = +z[v] + (v % 2 ? G : F)
                            }
                    }
                } else {
                    if (z[0] == "R") {
                        w = [G, F][aN](z.slice(1)), H.pop(), H = H[aN](aW(w, B)), A = ["R"][aN](z.slice(-2))
                    } else {
                        for (var n = 0, a = z.length; n < a; n++) {
                            A[n] = z[n]
                        }
                    }
                }
                switch (A[0]) {
                    case "Z":
                        G = E, F = D;
                        break;
                    case "H":
                        G = A[1];
                        break;
                    case "V":
                        F = A[1];
                        break;
                    case "M":
                        E = A[A.length - 2], D = A[A.length - 1];
                    default:
                        G = A[A.length - 2], F = A[A.length - 1]
                }
            }
            H.toString = a8._path2string, I.abs = dI(H);
            return H
        },
        dF = function(f, e, h, g) {
            return [f, e, h, g, h, g]
        },
        dE = function(j, i, p, o, n, m) {
            var l = 1 / 3,
                k = 2 / 3;
            return [l * j + k * p, l * i + k * o, l * n + k * p, l * m + k * o, n, m]
        },
        dD = function(bL, bK, bJ, bI, bH, bG, bF, bE, bD, bC) {
            var bB = dx * 120 / 180,
                bA = dx / 180 * (+bH || 0),
                bz = [],
                by, bx = a2(function(g, f, j) {
                    var i = g * av.cos(j) - f * av.sin(j),
                        h = g * av.sin(j) + f * av.cos(j);
                    return {
                        x: i,
                        y: h
                    }
                });
            if (!bC) {
                by = bx(bL, bK, -bA), bL = by.x, bK = by.y, by = bx(bE, bD, -bA), bE = by.x, bD = by.y;
                var bw = av.cos(dx / 180 * bH),
                    bv = av.sin(dx / 180 * bH),
                    bu = (bL - bE) / 2,
                    bt = (bK - bD) / 2,
                    bs = bu * bu / (bJ * bJ) + bt * bt / (bI * bI);
                bs > 1 && (bs = av.sqrt(bs), bJ = bs * bJ, bI = bs * bI);
                var br = bJ * bJ,
                    bq = bI * bI,
                    bp = (bG == bF ? -1 : 1) * av.sqrt(ao((br * bq - br * bt * bt - bq * bu * bu) / (br * bt * bt + bq * bu * bu))),
                    bo = bp * bJ * bt / bI + (bL + bE) / 2,
                    bn = bp * -bI * bu / bJ + (bK + bD) / 2,
                    bm = av.asin(((bK - bn) / bI).toFixed(9)),
                    bl = av.asin(((bD - bn) / bI).toFixed(9));
                bm = bL < bo ? dx - bm : bm, bl = bE < bo ? dx - bl : bl, bm < 0 && (bm = dx * 2 + bm), bl < 0 && (bl = dx * 2 + bl), bF && bm > bl && (bm = bm - dx * 2), !bF && bl > bm && (bl = bl - dx * 2)
            } else {
                bm = bC[0], bl = bC[1], bo = bC[2], bn = bC[3]
            }
            var bk = bl - bm;
            if (ao(bk) > bB) {
                var bj = bl,
                    bi = bE,
                    bh = bD;
                bl = bm + bB * (bF && bl > bm ? 1 : -1), bE = bo + bJ * av.cos(bl), bD = bn + bI * av.sin(bl), bz = dD(bE, bD, bJ, bI, bH, 0, bF, bi, bh, [bl, bj, bo, bn])
            }
            bk = bl - bm;
            var bg = av.cos(bm),
                bf = av.sin(bm),
                be = av.cos(bl),
                bd = av.sin(bl),
                bc = av.tan(bk / 4),
                bb = 4 / 3 * bJ * bc,
                ba = 4 / 3 * bI * bc,
                Z = [bL, bK],
                Y = [bL + bb * bf, bK - ba * bg],
                B = [bE + bb * bd, bD - ba * be],
                z = [bE, bD];
            Y[0] = 2 * Z[0] - Y[0], Y[1] = 2 * Z[1] - Y[1];
            if (bC) {
                return [Y, B, z][aN](bz)
            }
            bz = [Y, B, z][aN](bz).join()[aD](",");
            var w = [];
            for (var s = 0, n = bz.length; s < n; s++) {
                w[s] = s % 2 ? bx(bz[s - 1], bz[s], bA).y : bx(bz[s], bz[s + 1], bA).x
            }
            return w
        },
        dC = function(t, s, r, q, p, o, n, m, l) {
            var k = 1 - l;
            return {
                x: dz(k, 3) * t + dz(k, 2) * 3 * l * r + k * 3 * l * l * p + dz(l, 3) * n,
                y: dz(k, 3) * s + dz(k, 2) * 3 * l * q + k * 3 * l * l * o + dz(l, 3) * m
            }
        },
        dB = a2(function(F, E, D, C, B, A, z, y) {
            var x = B - 2 * D + F - (z - 2 * B + D),
                w = 2 * (D - F) - 2 * (B - D),
                v = F - D,
                u = (-w + av.sqrt(w * w - 4 * x * v)) / 2 / x,
                t = (-w - av.sqrt(w * w - 4 * x * v)) / 2 / x,
                s = [E, y],
                r = [F, z],
                m;
            ao(u) > "1e12" && (u = 0.5), ao(t) > "1e12" && (t = 0.5), u > 0 && u < 1 && (m = dC(F, E, D, C, B, A, z, y, u), r.push(m.x), s.push(m.y)), t > 0 && t < 1 && (m = dC(F, E, D, C, B, A, z, y, t), r.push(m.x), s.push(m.y)), x = A - 2 * C + E - (y - 2 * A + C), w = 2 * (C - E) - 2 * (A - C), v = E - C, u = (-w + av.sqrt(w * w - 4 * x * v)) / 2 / x, t = (-w - av.sqrt(w * w - 4 * x * v)) / 2 / x, ao(u) > "1e12" && (u = 0.5), ao(t) > "1e12" && (t = 0.5), u > 0 && u < 1 && (m = dC(F, E, D, C, B, A, z, y, u), r.push(m.x), s.push(m.y)), t > 0 && t < 1 && (m = dC(F, E, D, C, B, A, z, y, t), r.push(m.x), s.push(m.y));
            return {
                min: {
                    x: aq[aO](0, r),
                    y: aq[aO](0, s)
                },
                max: {
                    x: at[aO](0, r),
                    y: at[aO](0, s)
                }
            }
        }),
        dA = a8._path2curve = a2(function(F, E) {
            var D = !E && aT(F);
            if (!E && D.curve) {
                return dI(D.curve)
            }
            var C = dG(F),
                B = E && dG(E),
                A = {
                    x: 0,
                    y: 0,
                    bx: 0,
                    by: 0,
                    X: 0,
                    Y: 0,
                    qx: null,
                    qy: null
                },
                z = {
                    x: 0,
                    y: 0,
                    bx: 0,
                    by: 0,
                    X: 0,
                    Y: 0,
                    qx: null,
                    qy: null
                },
                y = function(f, e) {
                    var h, g;
                    if (!f) {
                        return ["C", e.x, e.y, e.x, e.y, e.x, e.y]
                    }!(f[0] in {
                        T: 1,
                        Q: 1
                    }) && (e.qx = e.qy = null);
                    switch (f[0]) {
                        case "M":
                            e.X = f[1], e.Y = f[2];
                            break;
                        case "A":
                            f = ["C"][aN](dD[aO](0, [e.x, e.y][aN](f.slice(1))));
                            break;
                        case "S":
                            h = e.x + (e.x - (e.bx || e.x)), g = e.y + (e.y - (e.by || e.y)), f = ["C", h, g][aN](f.slice(1));
                            break;
                        case "T":
                            e.qx = e.x + (e.x - (e.qx || e.x)), e.qy = e.y + (e.y - (e.qy || e.y)), f = ["C"][aN](dE(e.x, e.y, e.qx, e.qy, f[1], f[2]));
                            break;
                        case "Q":
                            e.qx = f[1], e.qy = f[2], f = ["C"][aN](dE(e.x, e.y, f[1], f[2], f[3], f[4]));
                            break;
                        case "L":
                            f = ["C"][aN](dF(e.x, e.y, f[1], f[2]));
                            break;
                        case "H":
                            f = ["C"][aN](dF(e.x, e.y, f[1], e.y));
                            break;
                        case "V":
                            f = ["C"][aN](dF(e.x, e.y, e.x, f[1]));
                            break;
                        case "Z":
                            f = ["C"][aN](dF(e.x, e.y, e.X, e.Y))
                    }
                    return f
                },
                x = function(e, d) {
                    if (e[d].length > 7) {
                        e[d].shift();
                        var f = e[d];
                        while (f.length) {
                            e.splice(d++, 0, ["C"][aN](f.splice(0, 6)))
                        }
                        e.splice(d, 1), u = at(C.length, B && B.length || 0)
                    }
                },
                w = function(e, d, j, i, h) {
                    e && d && e[h][0] == "M" && d[h][0] != "M" && (d.splice(h, 0, ["M", i.x, i.y]), j.bx = 0, j.by = 0, j.x = e[h][1], j.y = e[h][2], u = at(C.length, B && B.length || 0))
                };
            for (var v = 0, u = at(C.length, B && B.length || 0); v < u; v++) {
                C[v] = y(C[v], A), x(C, v), B && (B[v] = y(B[v], z)), B && x(B, v), w(C, B, A, z, v), w(B, C, z, A, v);
                var t = C[v],
                    s = B && B[v],
                    n = t.length,
                    m = B && s.length;
                A.x = t[n - 2], A.y = t[n - 1], A.bx = c4(t[n - 4]) || A.x, A.by = c4(t[n - 3]) || A.y, z.bx = B && (c4(s[m - 4]) || z.x), z.by = B && (c4(s[m - 3]) || z.y), z.x = B && s[m - 2], z.y = B && s[m - 1]
            }
            B || (D.curve = dI(C));
            return B ? [C, B] : C
        }, null, dI),
        dy = a8._parseDots = a2(function(t) {
            var s = [];
            for (var r = 0, q = t.length; r < q; r++) {
                var p = {},
                    o = t[r].match(/^([^:]*):?([\d\.]*)/);
                p.color = a8.getRGB(o[1]);
                if (p.color.error) {
                    return null
                }
                p.color = p.color.hex, o[2] && (p.offset = o[2] + "%"), s.push(p)
            }
            for (r = 1, q = s.length - 1; r < q; r++) {
                if (!s[r].offset) {
                    var n = c4(s[r - 1].offset || 0),
                        m = 0;
                    for (var l = r + 1; l < q; l++) {
                        if (s[l].offset) {
                            m = s[l].offset;
                            break
                        }
                    }
                    m || (m = 100, l = q), m = c4(m);
                    var a = (m - n) / (l - r + 1);
                    for (; r < l; r++) {
                        n += a, s[r].offset = n + "%"
                    }
                }
            }
            return s
        }),
        dw = a8._tear = function(d, c) {
            d == c.top && (c.top = d.prev), d == c.bottom && (c.bottom = d.next), d.next && (d.next.prev = d.prev), d.prev && (d.prev.next = d.next)
        },
        du = a8._tofront = function(d, c) {
            c.top !== d && (dw(d, c), d.next = null, d.prev = c.top, c.top.next = d, c.top = d)
        },
        ds = a8._toback = function(d, c) {
            c.bottom !== d && (dw(d, c), d.next = c.bottom, d.prev = null, c.bottom.prev = d, c.bottom = d)
        },
        dq = a8._insertafter = function(e, d, f) {
            dw(e, f), d == f.top && (f.top = e), d.next && (d.next.prev = e), e.next = d.next, e.prev = d, d.next = e
        },
        dn = a8._insertbefore = function(e, d, f) {
            dw(e, f), d == f.bottom && (f.bottom = e), d.prev && (d.prev.next = e), e.prev = d.prev, d.prev = e, e.next = d
        },
        dl = a8.toMatrix = function(f, e) {
            var h = dJ(f),
                g = {
                    _: {
                        transform: aJ
                    },
                    getBBox: function() {
                        return h
                    }
                };
            dT(g, e);
            return g.matrix
        },
        dj = a8.transformPath = function(d, c) {
            return cJ(d, dl(d, c))
        },
        dT = a8._extractTransform = function(R, Q) {
            if (Q == null) {
                return R._.transform
            }
            Q = aF(Q).replace(/\.{3}|\u2026/g, R._.transform || aJ);
            var P = a8.parseTransformString(Q),
                O = 0,
                N = 0,
                M = 0,
                L = 1,
                K = 1,
                J = R._,
                I = new aL;
            J.transform = P || [];
            if (P) {
                for (var H = 0, G = P.length; H < G; H++) {
                    var F = P[H],
                        E = F.length,
                        D = aF(F[0]).toLowerCase(),
                        C = F[0] != D,
                        B = C ? I.invert() : 0,
                        A, z, r, p, a;
                    D == "t" && E == 3 ? C ? (A = B.x(0, 0), z = B.y(0, 0), r = B.x(F[1], F[2]), p = B.y(F[1], F[2]), I.translate(r - A, p - z)) : I.translate(F[1], F[2]) : D == "r" ? E == 2 ? (a = a || R.getBBox(1), I.rotate(F[1], a.x + a.width / 2, a.y + a.height / 2), O += F[1]) : E == 4 && (C ? (r = B.x(F[2], F[3]), p = B.y(F[2], F[3]), I.rotate(F[1], r, p)) : I.rotate(F[1], F[2], F[3]), O += F[1]) : D == "s" ? E == 2 || E == 3 ? (a = a || R.getBBox(1), I.scale(F[1], F[E - 1], a.x + a.width / 2, a.y + a.height / 2), L *= F[1], K *= F[E - 1]) : E == 5 && (C ? (r = B.x(F[3], F[4]), p = B.y(F[3], F[4]), I.scale(F[1], F[2], r, p)) : I.scale(F[1], F[2], F[3], F[4]), L *= F[1], K *= F[2]) : D == "m" && E == 7 && I.add(F[1], F[2], F[3], F[4], F[5], F[6]), J.dirtyT = 1, R.matrix = I
                }
            }
            R.matrix = I, J.sx = L, J.sy = K, J.deg = O, J.dx = N = I.e, J.dy = M = I.f, L == 1 && K == 1 && !O && J.bbox ? (J.bbox.x += +N, J.bbox.y += +M) : J.dirtyT = 1
        },
        dd = function(d) {
            var c = d[0];
            switch (c.toLowerCase()) {
                case "t":
                    return [c, 0, 0];
                case "m":
                    return [c, 1, 0, 0, 1, 0, 0];
                case "r":
                    return d.length == 4 ? [c, 0, d[2], d[3]] : [c, 0];
                case "s":
                    return d.length == 5 ? [c, 1, 1, d[3], d[4]] : d.length == 3 ? [c, 1, 1] : [c, 1]
            }
        },
        aM = a8._equaliseTransform = function(t, s) {
            s = aF(s).replace(/\.{3}|\u2026/g, t), t = a8.parseTransformString(t) || [], s = a8.parseTransformString(s) || [];
            var r = at(t.length, s.length),
                q = [],
                p = [],
                o = 0,
                n, m, l, a;
            for (; o < r; o++) {
                l = t[o] || dd(s[o]), a = s[o] || dd(l);
                if (l[0] != a[0] || l[0].toLowerCase() == "r" && (l[2] != a[2] || l[3] != a[3]) || l[0].toLowerCase() == "s" && (l[3] != a[3] || l[4] != a[4])) {
                    return
                }
                q[o] = [], p[o] = [];
                for (n = 0, m = at(l.length, a.length); n < m; n++) {
                    n in l && (q[o][n] = l[n]), n in a && (p[o][n] = a[n])
                }
            }
            return {
                from: q,
                to: p
            }
        };
    a8._getContainer = function(a, j, i, h) {
            var g;
            g = h == null && !a8.is(a, "object") ? aU.doc.getElementById(a) : a;
            if (g != null) {
                if (g.tagName) {
                    return j == null ? {
                        container: g,
                        width: g.style.pixelWidth || g.offsetWidth,
                        height: g.style.pixelHeight || g.offsetHeight
                    } : {
                        container: g,
                        width: j,
                        height: i
                    }
                }
                return {
                    container: 1,
                    x: a,
                    y: j,
                    width: i,
                    height: h
                }
            }
        }, a8.pathToRelative = dH, a8._engine = {}, a8.path2curve = dA, a8.matrix = function(h, g, l, k, j, i) {
            return new aL(h, g, l, k, j, i)
        },
        function(a) {
            function e(d) {
                var c = av.sqrt(f(d));
                d[0] && (d[0] /= c), d[1] && (d[1] /= c)
            }

            function f(b) {
                return b[0] * b[0] + b[1] * b[1]
            }
            a.add = function(z, y, x, w, v, u) {
                var t = [
                        [],
                        [],
                        []
                    ],
                    s = [
                        [this.a, this.c, this.e],
                        [this.b, this.d, this.f],
                        [0, 0, 1]
                    ],
                    r = [
                        [z, x, v],
                        [y, w, u],
                        [0, 0, 1]
                    ],
                    q, p, o, n;
                z && z instanceof aL && (r = [
                    [z.a, z.c, z.e],
                    [z.b, z.d, z.f],
                    [0, 0, 1]
                ]);
                for (q = 0; q < 3; q++) {
                    for (p = 0; p < 3; p++) {
                        n = 0;
                        for (o = 0; o < 3; o++) {
                            n += s[q][o] * r[o][p]
                        }
                        t[q][p] = n
                    }
                }
                this.a = t[0][0], this.b = t[1][0], this.c = t[0][1], this.d = t[1][1], this.e = t[0][2], this.f = t[1][2]
            }, a.invert = function() {
                var d = this,
                    c = d.a * d.d - d.b * d.c;
                return new aL(d.d / c, -d.b / c, -d.c / c, d.a / c, (d.c * d.f - d.d * d.e) / c, (d.b * d.e - d.a * d.f) / c)
            }, a.clone = function() {
                return new aL(this.a, this.b, this.c, this.d, this.e, this.f)
            }, a.translate = function(d, c) {
                this.add(1, 0, 0, 1, d, c)
            }, a.scale = function(h, g, j, i) {
                g == null && (g = h), (j || i) && this.add(1, 0, 0, 1, j, i), this.add(h, 0, 0, g, 0, 0), (j || i) && this.add(1, 0, 0, 1, -j, -i)
            }, a.rotate = function(g, k, j) {
                g = a8.rad(g), k = k || 0, j = j || 0;
                var i = +av.cos(g).toFixed(9),
                    h = +av.sin(g).toFixed(9);
                this.add(i, h, -h, i, k, j), this.add(1, 0, 0, 1, -k, -j)
            }, a.x = function(d, c) {
                return d * this.a + c * this.c + this.e
            }, a.y = function(d, c) {
                return d * this.b + c * this.d + this.f
            }, a.get = function(b) {
                return +this[aF.fromCharCode(97 + b)].toFixed(4)
            }, a.toString = function() {
                return a8.svg ? "matrix(" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)].join() + ")" : [this.get(0), this.get(2), this.get(1), this.get(3), 0, 0].join()
            }, a.toFilter = function() {
                return "progid:DXImageTransform.Microsoft.Matrix(M11=" + this.get(0) + ", M12=" + this.get(2) + ", M21=" + this.get(1) + ", M22=" + this.get(3) + ", Dx=" + this.get(4) + ", Dy=" + this.get(5) + ", sizingmethod='auto expand')"
            }, a.offset = function() {
                return [this.e.toFixed(4), this.f.toFixed(4)]
            }, a.split = function() {
                var c = {};
                c.dx = this.e, c.dy = this.f;
                var i = [
                    [this.a, this.c],
                    [this.b, this.d]
                ];
                c.scalex = av.sqrt(f(i[0])), e(i[0]), c.shear = i[0][0] * i[1][0] + i[0][1] * i[1][1], i[1] = [i[1][0] - i[0][0] * c.shear, i[1][1] - i[0][1] * c.shear], c.scaley = av.sqrt(f(i[1])), e(i[1]), c.shear /= c.scaley;
                var h = -i[0][1],
                    d = i[1][1];
                d < 0 ? (c.rotate = a8.deg(av.acos(d)), h < 0 && (c.rotate = 360 - c.rotate)) : c.rotate = a8.deg(av.asin(h)), c.isSimple = !+c.shear.toFixed(9) && (c.scalex.toFixed(9) == c.scaley.toFixed(9) || !c.rotate), c.isSuperSimple = !+c.shear.toFixed(9) && c.scalex.toFixed(9) == c.scaley.toFixed(9) && !c.rotate, c.noRotation = !+c.shear.toFixed(9) && !c.rotate;
                return c
            }, a.toTransformString = function(d) {
                var c = d || this[aD]();
                if (c.isSimple) {
                    c.scalex = +c.scalex.toFixed(4), c.scaley = +c.scaley.toFixed(4), c.rotate = +c.rotate.toFixed(4);
                    return (c.dx || c.dy ? "t" + [c.dx, c.dy] : aJ) + (c.scalex != 1 || c.scaley != 1 ? "s" + [c.scalex, c.scaley, 0, 0] : aJ) + (c.rotate ? "r" + [c.rotate, 0, 0] : aJ)
                }
                return "m" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)]
            }
        }(aL.prototype);
    var aI = navigator.userAgent.match(/Version\/(.*?)\s/) || navigator.userAgent.match(/Chrome\/(\d+)/);
    navigator.vendor == "Apple Computer, Inc." && (aI && aI[1] < 4 || navigator.platform.slice(0, 2) == "iP") || navigator.vendor == "Google Inc." && aI && aI[1] < 8 ? aQ.safari = function() {
        var b = this.rect(-99, -99, this.width + 99, this.height + 99).attr({
            stroke: "none"
        });
        setTimeout(function() {
            b.remove()
        })
    } : aQ.safari = cW;
    var aG = function() {
            this.returnValue = !1
        },
        aE = function() {
            return this.originalEvent.preventDefault()
        },
        aC = function() {
            this.cancelBubble = !0
        },
        aA = function() {
            return this.originalEvent.stopPropagation()
        },
        ay = function() {
            if (aU.doc.addEventListener) {
                return function(h, g, l, k) {
                    var j = aK && az[g] ? az[g] : g,
                        i = function(q) {
                            var p = aU.doc.documentElement.scrollTop || aU.doc.body.scrollTop,
                                o = aU.doc.documentElement.scrollLeft || aU.doc.body.scrollLeft,
                                d = q.clientX + o,
                                c = q.clientY + p;
                            if (aK && az[aV](g)) {
                                for (var b = 0, a = q.targetTouches && q.targetTouches.length; b < a; b++) {
                                    if (q.targetTouches[b].target == h) {
                                        var r = q;
                                        q = q.targetTouches[b], q.originalEvent = r, q.preventDefault = aE, q.stopPropagation = aA;
                                        break
                                    }
                                }
                            }
                            return l.call(k, q, d, c)
                        };
                    h.addEventListener(j, i, !1);
                    return function() {
                        h.removeEventListener(j, i, !1);
                        return !0
                    }
                }
            }
            if (aU.doc.attachEvent) {
                return function(h, g, l, k) {
                    var j = function(d) {
                        d = d || aU.win.event;
                        var c = aU.doc.documentElement.scrollTop || aU.doc.body.scrollTop,
                            o = aU.doc.documentElement.scrollLeft || aU.doc.body.scrollLeft,
                            n = d.clientX + o,
                            m = d.clientY + c;
                        d.preventDefault = d.preventDefault || aG, d.stopPropagation = d.stopPropagation || aC;
                        return l.call(k, d, n, m)
                    };
                    h.attachEvent("on" + g, j);
                    var i = function() {
                        h.detachEvent("on" + g, j);
                        return !0
                    };
                    return i
                }
            }
        }(),
        aw = [],
        au = function(B) {
            var A = B.clientX,
                z = B.clientY,
                y = aU.doc.documentElement.scrollTop || aU.doc.body.scrollTop,
                x = aU.doc.documentElement.scrollLeft || aU.doc.body.scrollLeft,
                w, v = aw.length;
            while (v--) {
                w = aw[v];
                if (aK) {
                    var u = B.touches.length,
                        t;
                    while (u--) {
                        t = B.touches[u];
                        if (t.identifier == w.el._drag.id) {
                            A = t.clientX, z = t.clientY, (B.originalEvent ? B.originalEvent : B).preventDefault();
                            break
                        }
                    }
                } else {
                    B.preventDefault()
                }
                var s = w.el.node,
                    r, q = s.nextSibling,
                    o = s.parentNode,
                    h = s.style.display;
                aU.win.opera && o.removeChild(s), s.style.display = "none", r = w.el.paper.getElementByPoint(A, z), s.style.display = h, aU.win.opera && (q ? o.insertBefore(s, q) : o.appendChild(s)), r && eve("raphael.drag.over." + w.el.id, w.el, r), A += x, z += y, eve("raphael.drag.move." + w.el.id, w.move_scope || w.el, A - w.el._drag.x, z - w.el._drag.y, A, z, B)
            }
        },
        ar = function(a) {
            a8.unmousemove(au).unmouseup(ar);
            var f = aw.length,
                e;
            while (f--) {
                e = aw[f], e.el._drag = {}, eve("raphael.drag.end." + e.el.id, e.end_scope || e.start_scope || e.move_scope || e.el, a)
            }
            aw = []
        },
        ap = a8.el = {};
    for (var an = aB.length; an--;) {
        (function(a) {
            a8[a] = ap[a] = function(e, b) {
                a8.is(e, "function") && (this.events = this.events || [], this.events.push({
                    name: a,
                    f: e,
                    unbind: ay(this.shape || this.node || aU.doc, a, e, b || this)
                }));
                return this
            }, a8["un" + a] = ap["un" + a] = function(b) {
                var f = this.events || [],
                    e = f.length;
                while (e--) {
                    if (f[e].name == a && f[e].f == b) {
                        f[e].unbind(), f.splice(e, 1), !f.length && delete this.events;
                        return this
                    }
                }
                return this
            }
        })(aB[an])
    }
    ap.data = function(a, h) {
        var g = c5[this.id] = c5[this.id] || {};
        if (arguments.length == 1) {
            if (a8.is(a, "object")) {
                for (var f in a) {
                    a[aV](f) && this.data(f, a[f])
                }
                return this
            }
            eve("raphael.data.get." + this.id, this, g[a], a);
            return g[a]
        }
        g[a] = h, eve("raphael.data.set." + this.id, this, h, a);
        return this
    }, ap.removeData = function(b) {
        b == null ? c5[this.id] = {} : c5[this.id] && delete c5[this.id][b];
        return this
    }, ap.hover = function(f, e, h, g) {
        return this.mouseover(f, h).mouseout(e, g || h)
    }, ap.unhover = function(d, c) {
        return this.unmouseover(d).unmouseout(c)
    };
    var am = [];
    ap.drag = function(a, n, m, l, k, j) {
        function h(d) {
            (d.originalEvent || d).preventDefault();
            var c = aU.doc.documentElement.scrollTop || aU.doc.body.scrollTop,
                b = aU.doc.documentElement.scrollLeft || aU.doc.body.scrollLeft;
            this._drag.x = d.clientX + b, this._drag.y = d.clientY + c, this._drag.id = d.identifier, !aw.length && a8.mousemove(au).mouseup(ar), aw.push({
                el: this,
                move_scope: l,
                start_scope: k,
                end_scope: j
            }), n && eve.on("raphael.drag.start." + this.id, n), a && eve.on("raphael.drag.move." + this.id, a), m && eve.on("raphael.drag.end." + this.id, m), eve("raphael.drag.start." + this.id, k || l || this, d.clientX + b, d.clientY + c, d)
        }
        this._drag = {}, am.push({
            el: this,
            start: h
        }), this.mousedown(h);
        return this
    }, ap.onDragOver = function(b) {
        b ? eve.on("raphael.drag.over." + this.id, b) : eve.unbind("raphael.drag.over." + this.id)
    }, ap.undrag = function() {
        var a = am.length;
        while (a--) {
            am[a].el == this && (this.unmousedown(am[a].start), am.splice(a, 1), eve.unbind("raphael.drag.*." + this.id))
        }!am.length && a8.unmousemove(au).unmouseup(ar)
    }, aQ.circle = function(a, h, g) {
        var f = a8._engine.circle(this, a || 0, h || 0, g || 0);
        this.__set__ && this.__set__.push(f);
        return f
    }, aQ.rect = function(a, l, k, j, i) {
        var h = a8._engine.rect(this, a || 0, l || 0, k || 0, j || 0, i || 0);
        this.__set__ && this.__set__.push(h);
        return h
    }, aQ.ellipse = function(a, j, i, h) {
        var g = a8._engine.ellipse(this, a || 0, j || 0, i || 0, h || 0);
        this.__set__ && this.__set__.push(g);
        return g
    }, aQ.path = function(a) {
        a && !a8.is(a, dt) && !a8.is(a[0], dr) && (a += aJ);
        var d = a8._engine.path(a8.format[aO](a8, arguments), this);
        this.__set__ && this.__set__.push(d);
        return d
    }, aQ.image = function(a, l, k, j, i) {
        var h = a8._engine.image(this, a || "about:blank", l || 0, k || 0, j || 0, i || 0);
        this.__set__ && this.__set__.push(h);
        return h
    }, aQ.text = function(a, h, g) {
        var f = a8._engine.text(this, a || 0, h || 0, aF(g));
        this.__set__ && this.__set__.push(f);
        return f
    }, aQ.set = function(a) {
        !a8.is(a, "array") && (a = Array.prototype.splice.call(arguments, 0, arguments.length));
        var d = new cT(a);
        this.__set__ && this.__set__.push(d);
        return d
    }, aQ.setStart = function(b) {
        this.__set__ = b || this.set()
    }, aQ.setFinish = function(d) {
        var c = this.__set__;
        delete this.__set__;
        return c
    }, aQ.setSize = function(a, d) {
        return a8._engine.setSize.call(this, a, d)
    }, aQ.setViewBox = function(a, j, i, h, g) {
        return a8._engine.setViewBox.call(this, a, j, i, h, g)
    }, aQ.top = aQ.bottom = null, aQ.raphael = a8;
    var al = function(r) {
        var q = r.getBoundingClientRect(),
            p = r.ownerDocument,
            o = p.body,
            n = p.documentElement,
            m = n.clientTop || o.clientTop || 0,
            l = n.clientLeft || o.clientLeft || 0,
            k = q.top + (aU.win.pageYOffset || n.scrollTop || o.scrollTop) - m,
            h = q.left + (aU.win.pageXOffset || n.scrollLeft || o.scrollLeft) - l;
        return {
            y: k,
            x: h
        }
    };
    aQ.getElementByPoint = function(j, h) {
        var p = this,
            o = p.canvas,
            n = aU.doc.elementFromPoint(j, h);
        if (aU.win.opera && n.tagName == "svg") {
            var m = al(o),
                l = o.createSVGRect();
            l.x = j - m.x, l.y = h - m.y, l.width = l.height = 1;
            var k = o.getIntersectionList(l, null);
            k.length && (n = k[k.length - 1])
        }
        if (!n) {
            return null
        }
        while (n.parentNode && n != o.parentNode && !n.raphael) {
            n = n.parentNode
        }
        n == p.canvas.parentNode && (n = o), n = n && n.raphael ? p.getById(n.raphaelid) : null;
        return n
    }, aQ.getById = function(d) {
        var c = this.bottom;
        while (c) {
            if (c.id == d) {
                return c
            }
            c = c.next
        }
        return null
    }, aQ.forEach = function(e, d) {
        var f = this.bottom;
        while (f) {
            if (e.call(d, f) === !1) {
                return this
            }
            f = f.next
        }
        return this
    }, aQ.getElementsByPoint = function(e, d) {
        var f = this.set();
        this.forEach(function(a) {
            a.isPointInside(e, d) && f.push(a)
        });
        return f
    }, ap.isPointInside = function(a, f) {
        var e = this.realPath = this.realPath || cL[this.type](this);
        return a8.isPointInsidePath(e, a, f)
    }, ap.getBBox = function(d) {
        if (this.removed) {
            return {}
        }
        var c = this._;
        if (d) {
            if (c.dirty || !c.bboxwt) {
                this.realPath = cL[this.type](this), c.bboxwt = dJ(this.realPath), c.bboxwt.toString = aj, c.dirty = 0
            }
            return c.bboxwt
        }
        if (c.dirty || c.dirtyT || !c.bbox) {
            if (c.dirty || !this.realPath) {
                c.bboxwt = 0, this.realPath = cL[this.type](this)
            }
            c.bbox = dJ(cJ(this.realPath, this.matrix)), c.bbox.toString = aj, c.dirty = c.dirtyT = 0
        }
        return c.bbox
    }, ap.clone = function() {
        if (this.removed) {
            return null
        }
        var b = this.paper[this.type]().attr(this.attr());
        this.__set__ && this.__set__.push(b);
        return b
    }, ap.glow = function(i) {
        if (this.type == "text") {
            return null
        }
        i = i || {};
        var h = {
                width: (i.width || 10) + (+this.attr("stroke-width") || 1),
                fill: i.fill || !1,
                opacity: i.opacity || 0.5,
                offsetx: i.offsetx || 0,
                offsety: i.offsety || 0,
                color: i.color || "#000"
            },
            n = h.width / 2,
            m = this.paper,
            l = m.set(),
            k = this.realPath || cL[this.type](this);
        k = this.matrix ? cJ(k, this.matrix) : k;
        for (var j = 1; j < n + 1; j++) {
            l.push(m.path(k).attr({
                stroke: h.color,
                fill: h.fill ? h.color : "none",
                "stroke-linejoin": "round",
                "stroke-linecap": "round",
                "stroke-width": +(h.width / n * j).toFixed(3),
                opacity: +(h.opacity / n).toFixed(3)
            }))
        }
        return l.insertBefore(this).translate(h.offsetx, h.offsety)
    };
    var ai = {},
        ah = function(r, q, p, o, n, m, l, k, a) {
            return a == null ? dQ(r, q, p, o, n, m, l, k) : a8.findDotsAtSegment(r, q, p, o, n, m, l, k, dP(r, q, p, o, n, m, l, k, a))
        },
        ag = function(a, d) {
            return function(A, z, y) {
                A = dA(A);
                var x, w, v, u, t = "",
                    s = {},
                    r, q = 0;
                for (var c = 0, b = A.length; c < b; c++) {
                    v = A[c];
                    if (v[0] == "M") {
                        x = +v[1], w = +v[2]
                    } else {
                        u = ah(x, w, v[1], v[2], v[3], v[4], v[5], v[6]);
                        if (q + u > z) {
                            if (d && !s.start) {
                                r = ah(x, w, v[1], v[2], v[3], v[4], v[5], v[6], z - q), t += ["C" + r.start.x, r.start.y, r.m.x, r.m.y, r.x, r.y];
                                if (y) {
                                    return t
                                }
                                s.start = t, t = ["M" + r.x, r.y + "C" + r.n.x, r.n.y, r.end.x, r.end.y, v[5], v[6]].join(), q += u, x = +v[5], w = +v[6];
                                continue
                            }
                            if (!a && !d) {
                                r = ah(x, w, v[1], v[2], v[3], v[4], v[5], v[6], z - q);
                                return {
                                    x: r.x,
                                    y: r.y,
                                    alpha: r.alpha
                                }
                            }
                        }
                        q += u, x = +v[5], w = +v[6]
                    }
                    t += v.shift() + v
                }
                s.end = t, r = a ? q : d ? s : a8.findDotsAtSegment(x, w, v[0], v[1], v[2], v[3], v[4], v[5], 1), r.alpha && (r = {
                    x: r.x,
                    y: r.y,
                    alpha: r.alpha
                });
                return r
            }
        },
        af = ag(1),
        ae = ag(),
        ad = ag(0, 1);
    a8.getTotalLength = af, a8.getPointAtLength = ae, a8.getSubpath = function(f, e, h) {
        if (this.getTotalLength(f) - h < 0.000001) {
            return ad(f, e).end
        }
        var g = ad(f, h, 1);
        return e ? ad(g, e).end : g
    }, ap.getTotalLength = function() {
        if (this.type == "path") {
            if (this.node.getTotalLength) {
                return this.node.getTotalLength()
            }
            return af(this.attrs.path)
        }
    }, ap.getPointAtLength = function(b) {
        if (this.type == "path") {
            return ae(this.attrs.path, b)
        }
    }, ap.getSubpath = function(a, d) {
        if (this.type == "path") {
            return a8.getSubpath(this.attrs.path, a, d)
        }
    };
    var ac = a8.easing_formulas = {
        linear: function(b) {
            return b
        },
        "<": function(b) {
            return dz(b, 1.7)
        },
        ">": function(b) {
            return dz(b, 0.48)
        },
        "<>": function(j) {
            var i = 0.48 - j / 1.04,
                p = av.sqrt(0.1734 + i * i),
                o = p - i,
                n = dz(ao(o), 1 / 3) * (o < 0 ? -1 : 1),
                m = -p - i,
                l = dz(ao(m), 1 / 3) * (m < 0 ? -1 : 1),
                k = n + l + 0.5;
            return (1 - k) * 3 * k * k + k * k * k
        },
        backIn: function(d) {
            var c = 1.70158;
            return d * d * ((c + 1) * d - c)
        },
        backOut: function(d) {
            d = d - 1;
            var c = 1.70158;
            return d * d * ((c + 1) * d + c) + 1
        },
        elastic: function(b) {
            if (b == !!b) {
                return b
            }
            return dz(2, -10 * b) * av.sin((b - 0.075) * 2 * dx / 0.3) + 1
        },
        bounce: function(f) {
            var e = 7.5625,
                h = 2.75,
                g;
            f < 1 / h ? g = e * f * f : f < 2 / h ? (f -= 1.5 / h, g = e * f * f + 0.75) : f < 2.5 / h ? (f -= 2.25 / h, g = e * f * f + 0.9375) : (f -= 2.625 / h, g = e * f * f + 0.984375);
            return g
        }
    };
    ac.easeIn = ac["ease-in"] = ac["<"], ac.easeOut = ac["ease-out"] = ac[">"], ac.easeInOut = ac["ease-in-out"] = ac["<>"], ac["back-in"] = ac.backIn, ac["back-out"] = ac.backOut;
    var ab = [],
        aa = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(b) {
            setTimeout(b, 16)
        },
        db = function() {
            var T = +(new Date),
                S = 0;
            for (; S < ab.length; S++) {
                var R = ab[S];
                if (R.el.removed || R.paused) {
                    continue
                }
                var Q = T - R.start,
                    P = R.ms,
                    O = R.easing,
                    N = R.from,
                    M = R.diff,
                    L = R.to,
                    K = R.t,
                    J = R.el,
                    I = {},
                    H, F = {},
                    E;
                R.initstatus ? (Q = (R.initstatus * R.anim.top - R.prev) / (R.percent - R.prev) * P, R.status = R.initstatus, delete R.initstatus, R.stop && ab.splice(S--, 1)) : R.status = (R.prev + (R.percent - R.prev) * (Q / P)) / R.anim.top;
                if (Q < 0) {
                    continue
                }
                if (Q < P) {
                    var D = O(Q / P);
                    for (var C in N) {
                        if (N[aV](C)) {
                            switch (cS[C]) {
                                case dv:
                                    H = +N[C] + D * P * M[C];
                                    break;
                                case "colour":
                                    H = "rgb(" + [c8(da(N[C].r + D * P * M[C].r)), c8(da(N[C].g + D * P * M[C].g)), c8(da(N[C].b + D * P * M[C].b))].join(",") + ")";
                                    break;
                                case "path":
                                    H = [];
                                    for (var B = 0, q = N[C].length; B < q; B++) {
                                        H[B] = [N[C][B][0]];
                                        for (var n = 1, g = N[C][B].length; n < g; n++) {
                                            H[B][n] = +N[C][B][n] + D * P * M[C][B][n]
                                        }
                                        H[B] = H[B].join(aH)
                                    }
                                    H = H.join(aH);
                                    break;
                                case "transform":
                                    if (M[C].real) {
                                        H = [];
                                        for (B = 0, q = N[C].length; B < q; B++) {
                                            H[B] = [N[C][B][0]];
                                            for (n = 1, g = N[C][B].length; n < g; n++) {
                                                H[B][n] = N[C][B][n] + D * P * M[C][B][n]
                                            }
                                        }
                                    } else {
                                        var a = function(b) {
                                            return +N[C][b] + D * P * M[C][b]
                                        };
                                        H = [
                                            ["m", a(0), a(1), a(2), a(3), a(4), a(5)]
                                        ]
                                    }
                                    break;
                                case "csv":
                                    if (C == "clip-rect") {
                                        H = [], B = 4;
                                        while (B--) {
                                            H[B] = +N[C][B] + D * P * M[C][B]
                                        }
                                    }
                                    break;
                                default:
                                    var G = [][aN](N[C]);
                                    H = [], B = J.paper.customAttributes[C].length;
                                    while (B--) {
                                        H[B] = +G[B] + D * P * M[C][B]
                                    }
                            }
                            I[C] = H
                        }
                    }
                    J.attr(I),
                        function(e, d, f) {
                            setTimeout(function() {
                                eve("raphael.anim.frame." + e, d, f)
                            })
                        }(J.id, J, R.anim)
                } else {
                    (function(e, h, f) {
                        setTimeout(function() {
                            eve("raphael.anim.frame." + h.id, h, f), eve("raphael.anim.finish." + h.id, h, f), a8.is(e, "function") && e.call(h)
                        })
                    })(R.callback, J, R.anim), J.attr(L), ab.splice(S--, 1);
                    if (R.repeat > 1 && !R.next) {
                        for (E in L) {
                            L[aV](E) && (F[E] = R.totalOrigin[E])
                        }
                        R.el.attr(F), c0(R.anim, R.el, R.anim.percents[0], null, R.totalOrigin, R.repeat - 1)
                    }
                    R.next && !R.stop && c0(R.anim, R.el, R.next, null, R.totalOrigin, R.repeat)
                }
            }
            a8.svg && J && J.paper && J.paper.safari(), ab.length && aa(db)
        },
        c8 = function(b) {
            return b > 255 ? 255 : b < 0 ? 0 : b
        };
    ap.animateWith = function(x, w, v, u, t, s) {
        var r = this;
        if (r.removed) {
            s && s.call(r);
            return r
        }
        var q = v instanceof c3 ? v : a8.animation(v, u, t, s),
            p, o;
        c0(q, r, q.percents[0], null, r.attr());
        for (var n = 0, a = ab.length; n < a; n++) {
            if (ab[n].anim == w && ab[n].el == x) {
                ab[a - 1].start = ab[n].start;
                break
            }
        }
        return r
    }, ap.onAnimation = function(b) {
        b ? eve.on("raphael.anim.frame." + this.id, b) : eve.unbind("raphael.anim.frame." + this.id);
        return this
    }, c3.prototype.delay = function(d) {
        var c = new c3(this.anim, this.ms);
        c.times = this.times, c.del = +d || 0;
        return c
    }, c3.prototype.repeat = function(d) {
        var c = new c3(this.anim, this.ms);
        c.del = this.del, c.times = av.floor(at(d, 0)) || 1;
        return c
    }, a8.animation = function(a, n, m, l) {
        if (a instanceof c3) {
            return a
        }
        if (a8.is(m, "function") || !m) {
            l = l || m || null, m = null
        }
        a = Object(a), n = +n || 0;
        var k = {},
            j, g;
        for (g in a) {
            a[aV](g) && c4(g) != g && c4(g) + "%" != g && (j = !0, k[g] = a[g])
        }
        if (!j) {
            return new c3(a, n)
        }
        m && (k.easing = m), l && (k.callback = l);
        return new c3({
            100: k
        }, n)
    }, ap.animate = function(a, l, k, j) {
        var i = this;
        if (i.removed) {
            j && j.call(i);
            return i
        }
        var h = a instanceof c3 ? a : a8.animation(a, l, k, j);
        c0(h, i, h.percents[0], null, i.attr());
        return i
    }, ap.setTime = function(d, c) {
        d && c != null && this.status(d, aq(c, d.ms) / d.ms);
        return this
    }, ap.status = function(h, g) {
        var l = [],
            k = 0,
            j, i;
        if (g != null) {
            c0(h, this, -1, aq(g, 1));
            return this
        }
        j = ab.length;
        for (; k < j; k++) {
            i = ab[k];
            if (i.el.id == this.id && (!h || i.anim == h)) {
                if (h) {
                    return i.status
                }
                l.push({
                    anim: i.anim,
                    status: i.status
                })
            }
        }
        if (h) {
            return 0
        }
        return l
    }, ap.pause = function(d) {
        for (var c = 0; c < ab.length; c++) {
            ab[c].el.id == this.id && (!d || ab[c].anim == d) && eve("raphael.anim.pause." + this.id, this, ab[c].anim) !== !1 && (ab[c].paused = !0)
        }
        return this
    }, ap.resume = function(e) {
        for (var d = 0; d < ab.length; d++) {
            if (ab[d].el.id == this.id && (!e || ab[d].anim == e)) {
                var f = ab[d];
                eve("raphael.anim.resume." + this.id, this, f.anim) !== !1 && (delete f.paused, this.status(f.anim, f.status))
            }
        }
        return this
    }, ap.stop = function(d) {
        for (var c = 0; c < ab.length; c++) {
            ab[c].el.id == this.id && (!d || ab[c].anim == d) && eve("raphael.anim.stop." + this.id, this, ab[c].anim) !== !1 && ab.splice(c--, 1)
        }
        return this
    }, eve.on("raphael.remove", cX), eve.on("raphael.clear", cX), ap.toString = function() {
        return "Raphaël’s object"
    };
    var cT = function(e) {
            this.items = [], this.length = 0, this.type = "set";
            if (e) {
                for (var d = 0, f = e.length; d < f; d++) {
                    e[d] && (e[d].constructor == ap.constructor || e[d].constructor == cT) && (this[this.items.length] = this.items[this.items.length] = e[d], this.length++)
                }
            }
        },
        cQ = cT.prototype;
    cQ.push = function() {
        var f, e;
        for (var h = 0, g = arguments.length; h < g; h++) {
            f = arguments[h], f && (f.constructor == ap.constructor || f.constructor == cT) && (e = this.items.length, this[e] = this.items[e] = f, this.length++)
        }
        return this
    }, cQ.pop = function() {
        this.length && delete this[this.length--];
        return this.items.pop()
    }, cQ.forEach = function(f, e) {
        for (var h = 0, g = this.items.length; h < g; h++) {
            if (f.call(e, this.items[h], h) === !1) {
                return this
            }
        }
        return this
    };
    for (var cN in ap) {
        ap[aV](cN) && (cQ[cN] = function(b) {
            return function() {
                var a = arguments;
                return this.forEach(function(d) {
                    d[b][aO](d, a)
                })
            }
        }(cN))
    }
    cQ.attr = function(a, l) {
            if (a && a8.is(a, dr) && a8.is(a[0], "object")) {
                for (var k = 0, j = a.length; k < j; k++) {
                    this.items[k].attr(a[k])
                }
            } else {
                for (var i = 0, h = this.items.length; i < h; i++) {
                    this.items[i].attr(a, l)
                }
            }
            return this
        }, cQ.clear = function() {
            while (this.length) {
                this.pop()
            }
        }, cQ.splice = function(j, i, p) {
            j = j < 0 ? at(this.length + j, 0) : j, i = at(0, aq(this.length - j, i));
            var o = [],
                n = [],
                m = [],
                l;
            for (l = 2; l < arguments.length; l++) {
                m.push(arguments[l])
            }
            for (l = 0; l < i; l++) {
                n.push(this[j + l])
            }
            for (; l < this.length - j; l++) {
                o.push(this[j + l])
            }
            var k = m.length;
            for (l = 0; l < k + o.length; l++) {
                this.items[j + l] = this[j + l] = l < k ? m[l] : o[l - k]
            }
            l = this.items.length = this.length -= i - k;
            while (this[l]) {
                delete this[l++]
            }
            return new cT(n)
        }, cQ.exclude = function(e) {
            for (var d = 0, f = this.length; d < f; d++) {
                if (this[d] == e) {
                    this.splice(d, 1);
                    return !0
                }
            }
        }, cQ.animate = function(t, s, r, q) {
            (a8.is(r, "function") || !r) && (q = r || null);
            var p = this.items.length,
                o = p,
                n, m = this,
                l;
            if (!p) {
                return this
            }
            q && (l = function() {
                !--p && q.call(m)
            }), r = a8.is(r, dt) ? r : l;
            var a = a8.animation(t, s, r, l);
            n = this.items[--o].animate(a);
            while (o--) {
                this.items[o] && !this.items[o].removed && this.items[o].animateWith(n, a, a)
            }
            return this
        }, cQ.insertAfter = function(d) {
            var c = this.items.length;
            while (c--) {
                this.items[c].insertAfter(d)
            }
            return this
        }, cQ.getBBox = function() {
            var h = [],
                g = [],
                l = [],
                k = [];
            for (var j = this.items.length; j--;) {
                if (!this.items[j].removed) {
                    var i = this.items[j].getBBox();
                    h.push(i.x), g.push(i.y), l.push(i.x + i.width), k.push(i.y + i.height)
                }
            }
            h = aq[aO](0, h), g = aq[aO](0, g), l = at[aO](0, l), k = at[aO](0, k);
            return {
                x: h,
                y: g,
                x2: l,
                y2: k,
                width: l - h,
                height: k - g
            }
        }, cQ.clone = function(e) {
            e = new cT;
            for (var d = 0, f = this.items.length; d < f; d++) {
                e.push(this.items[d].clone())
            }
            return e
        }, cQ.toString = function() {
            return "Raphaël‘s set"
        }, a8.registerFont = function(i) {
            if (!i.face) {
                return i
            }
            this.fonts = this.fonts || {};
            var g = {
                    w: i.w,
                    face: {},
                    glyphs: {}
                },
                n = i.face["font-family"];
            for (var m in i.face) {
                i.face[aV](m) && (g.face[m] = i.face[m])
            }
            this.fonts[n] ? this.fonts[n].push(g) : this.fonts[n] = [g];
            if (!i.svg) {
                g.face["units-per-em"] = c1(i.face["units-per-em"], 10);
                for (var l in i.glyphs) {
                    if (i.glyphs[aV](l)) {
                        var k = i.glyphs[l];
                        g.glyphs[l] = {
                            w: k.w,
                            k: {},
                            d: k.d && "M" + k.d.replace(/[mlcxtrv]/g, function(b) {
                                return {
                                    l: "L",
                                    c: "C",
                                    x: "z",
                                    t: "m",
                                    r: "l",
                                    v: "c"
                                }[b] || "M"
                            }) + "z"
                        };
                        if (k.k) {
                            for (var j in k.k) {
                                k[aV](j) && (g.glyphs[l].k[j] = k.k[j])
                            }
                        }
                    }
                }
            }
            return i
        }, aQ.getFont = function(t, s, r, q) {
            q = q || "normal", r = r || "normal", s = +s || {
                normal: 400,
                bold: 700,
                lighter: 300,
                bolder: 800
            }[s] || 400;
            if (!!a8.fonts) {
                var p = a8.fonts[t];
                if (!p) {
                    var o = new RegExp("(^|\\s)" + t.replace(/[^\w\d\s+!~.:_-]/g, aJ) + "(\\s|$)", "i");
                    for (var n in a8.fonts) {
                        if (a8.fonts[aV](n) && o.test(n)) {
                            p = a8.fonts[n];
                            break
                        }
                    }
                }
                var m;
                if (p) {
                    for (var g = 0, a = p.length; g < a; g++) {
                        m = p[g];
                        if (m.face["font-weight"] == s && (m.face["font-style"] == r || !m.face["font-style"]) && m.face["font-stretch"] == q) {
                            break
                        }
                    }
                }
                return m
            }
        }, aQ.print = function(P, O, N, M, L, K, J) {
            K = K || "middle", J = at(aq(J || 0, 1), -1);
            var I = aF(N)[aD](aJ),
                H = 0,
                G = 0,
                F = aJ,
                E;
            a8.is(M, N) && (M = this.getFont(M));
            if (M) {
                E = (L || 16) / M.face["units-per-em"];
                var D = M.face.bbox[aD](a3),
                    y = +D[0],
                    s = D[3] - D[1],
                    r = 0,
                    p = +D[1] + (K == "baseline" ? s + +M.face.descent : s / 2);
                for (var c = 0, a = I.length; c < a; c++) {
                    if (I[c] == "\n") {
                        H = 0, x = 0, G = 0, r += s
                    } else {
                        var C = G && M.glyphs[I[c - 1]] || {},
                            x = M.glyphs[I[c]];
                        H += G ? (C.w || M.w) + (C.k && C.k[I[c]] || 0) + M.w * J : 0, G = 1
                    }
                    x && x.d && (F += a8.transformPath(x.d, ["t", H * E, r * E, "s", E, E, y, p, "t", (P - y) / E, (O - p) / E]))
                }
            }
            return this.path(F).attr({
                fill: "#000",
                stroke: "none"
            })
        }, aQ.add = function(a) {
            if (a8.is(a, "array")) {
                var j = this.set(),
                    i = 0,
                    g = a.length,
                    d;
                for (; i < g; i++) {
                    d = a[i] || {}, a1[aV](d.type) && j.push(this[d.type]().attr(d))
                }
            }
            return j
        }, a8.format = function(a, f) {
            var e = a8.is(f, dr) ? [0][aN](f) : arguments;
            a && a8.is(a, dt) && e.length - 1 && (a = a.replace(a0, function(d, c) {
                return e[++c] == null ? aJ : e[c]
            }));
            return a || aJ
        }, a8.fullfill = function() {
            var e = /\{([^\}]+)\}/g,
                d = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g,
                f = function(b, i, h) {
                    var g = h;
                    i.replace(d, function(k, j, n, m, l) {
                        j = j || m, g && (j in g && (g = g[j]), typeof g == "function" && l && (g = g()))
                    }), g = (g == null || g == h ? b : g) + "";
                    return g
                };
            return function(a, c) {
                return String(a).replace(e, function(h, g) {
                    return f(h, g, c)
                })
            }
        }(), a8.ninja = function() {
            aS.was ? aU.win.Raphael = aS.is : delete Raphael;
            return a8
        }, a8.st = cQ,
        function(a, h, g) {
            function f() {
                /in/.test(a.readyState) ? setTimeout(f, 9) : a8.eve("raphael.DOMload")
            }
            a.readyState == null && a.addEventListener && (a.addEventListener(h, g = function() {
                a.removeEventListener(h, g, !1), a.readyState = "complete"
            }, !1), a.readyState = "loading"), f()
        }(document, "DOMContentLoaded"), aS.was ? aU.win.Raphael = a8 : Raphael = a8, eve.on("raphael.DOMload", function() {
            a6 = !0
        })
}(), window.Raphael.svg && function(af) {
    var ae = "hasOwnProperty",
        ad = String,
        ac = parseFloat,
        ab = parseInt,
        aa = Math,
        Z = aa.max,
        Y = aa.abs,
        X = aa.pow,
        W = /[, ]+/,
        V = af.eve,
        U = "",
        T = " ",
        S = "http://www.w3.org/1999/xlink",
        R = {
            block: "M5,0 0,2.5 5,5z",
            classic: "M5,0 0,2.5 5,5 3.5,3 3.5,2z",
            diamond: "M2.5,0 5,2.5 2.5,5 0,2.5z",
            open: "M6,1 1,3.5 6,6",
            oval: "M2.5,0A2.5,2.5,0,0,1,2.5,5 2.5,2.5,0,0,1,2.5,0z"
        },
        Q = {};
    af.toString = function() {
        return "Your browser supports SVG.\nYou are running Raphaël " + this.version
    };
    var O = function(c, b) {
            if (b) {
                typeof c == "string" && (c = O(c));
                for (var a in b) {
                    b[ae](a) && (a.substring(0, 6) == "xlink:" ? c.setAttributeNS(S, a.substring(6), ad(b[a])) : c.setAttribute(a, ad(b[a])))
                }
            } else {
                c = af._g.doc.createElementNS("http://www.w3.org/2000/svg", c), c.style && (c.style.webkitTapHighlightColor = "rgba(0,0,0,0)")
            }
            return c
        },
        M = function(z, l) {
            var i = "linear",
                h = z.id + l,
                g = 0.5,
                f = 0.5,
                d = z.node,
                c = z.paper,
                a = d.style,
                ai = af._g.doc.getElementById(h);
            if (!ai) {
                l = ad(l).replace(af._radial_gradient, function(k, j, n) {
                    i = "radial";
                    if (j && n) {
                        g = ac(j), f = ac(n);
                        var m = (f > 0.5) * 2 - 1;
                        X(g - 0.5, 2) + X(f - 0.5, 2) > 0.25 && (f = aa.sqrt(0.25 - X(g - 0.5, 2)) * m + 0.5) && f != 0.5 && (f = f.toFixed(5) - 0.00001 * m)
                    }
                    return U
                }), l = l.split(/\s*\-\s*/);
                if (i == "linear") {
                    var ah = l.shift();
                    ah = -ac(ah);
                    if (isNaN(ah)) {
                        return null
                    }
                    var ag = [0, 0, aa.cos(af.rad(ah)), aa.sin(af.rad(ah))],
                        C = 1 / (Z(Y(ag[2]), Y(ag[3])) || 1);
                    ag[2] *= C, ag[3] *= C, ag[2] < 0 && (ag[0] = -ag[2], ag[2] = 0), ag[3] < 0 && (ag[1] = -ag[3], ag[3] = 0)
                }
                var B = af._parseDots(l);
                if (!B) {
                    return null
                }
                h = h.replace(/[\(\)\s,\xb0#]/g, "_"), z.gradient && h != z.gradient.id && (c.defs.removeChild(z.gradient), delete z.gradient);
                if (!z.gradient) {
                    ai = O(i + "Gradient", {
                        id: h
                    }), z.gradient = ai, O(ai, i == "radial" ? {
                        fx: g,
                        fy: f
                    } : {
                        x1: ag[0],
                        y1: ag[1],
                        x2: ag[2],
                        y2: ag[3],
                        gradientTransform: z.matrix.invert()
                    }), c.defs.appendChild(ai);
                    for (var A = 0, q = B.length; A < q; A++) {
                        ai.appendChild(O("stop", {
                            offset: B[A].offset ? B[A].offset : A ? "100%" : "0%",
                            "stop-color": B[A].color || "#fff"
                        }))
                    }
                }
            }
            O(d, {
                fill: "url(#" + h + ")",
                opacity: 1,
                "fill-opacity": 1
            }), a.fill = U, a.opacity = 1, a.fillOpacity = 1;
            return 1
        },
        K = function(d) {
            var c = d.getBBox(1);
            O(d.pattern, {
                patternTransform: d.matrix.invert() + " translate(" + c.x + "," + c.y + ")"
            })
        },
        J = function(ay, ax, aw) {
            if (ay.type == "path") {
                var av = ad(ax).toLowerCase().split("-"),
                    au = ay.paper,
                    at = aw ? "end" : "start",
                    ar = ay.node,
                    aq = ay.attrs,
                    ap = aq["stroke-width"],
                    ao = av.length,
                    al = "classic",
                    aj, ah, ag, p, l, c = 3,
                    b = 3,
                    a = 5;
                while (ao--) {
                    switch (av[ao]) {
                        case "block":
                        case "classic":
                        case "oval":
                        case "diamond":
                        case "open":
                        case "none":
                            al = av[ao];
                            break;
                        case "wide":
                            b = 5;
                            break;
                        case "narrow":
                            b = 2;
                            break;
                        case "long":
                            c = 5;
                            break;
                        case "short":
                            c = 2
                    }
                }
                al == "open" ? (c += 2, b += 2, a += 2, ag = 1, p = aw ? 4 : 1, l = {
                    fill: "none",
                    stroke: aq.stroke
                }) : (p = ag = c / 2, l = {
                    fill: aq.stroke,
                    stroke: "none"
                }), ay._.arrows ? aw ? (ay._.arrows.endPath && Q[ay._.arrows.endPath]--, ay._.arrows.endMarker && Q[ay._.arrows.endMarker]--) : (ay._.arrows.startPath && Q[ay._.arrows.startPath]--, ay._.arrows.startMarker && Q[ay._.arrows.startMarker]--) : ay._.arrows = {};
                if (al != "none") {
                    var an = "raphael-marker-" + al,
                        am = "raphael-marker-" + at + al + c + b;
                    af._g.doc.getElementById(an) ? Q[an]++ : (au.defs.appendChild(O(O("path"), {
                        "stroke-linecap": "round",
                        d: R[al],
                        id: an
                    })), Q[an] = 1);
                    var ak = af._g.doc.getElementById(am),
                        ai;
                    ak ? (Q[am]++, ai = ak.getElementsByTagName("use")[0]) : (ak = O(O("marker"), {
                        id: am,
                        markerHeight: b,
                        markerWidth: c,
                        orient: "auto",
                        refX: p,
                        refY: b / 2
                    }), ai = O(O("use"), {
                        "xlink:href": "#" + an,
                        transform: (aw ? "rotate(180 " + c / 2 + " " + b / 2 + ") " : U) + "scale(" + c / a + "," + b / a + ")",
                        "stroke-width": (1 / ((c / a + b / a) / 2)).toFixed(4)
                    }), ak.appendChild(ai), au.defs.appendChild(ak), Q[am] = 1), O(ai, l);
                    var q = ag * (al != "diamond" && al != "oval");
                    aw ? (aj = ay._.arrows.startdx * ap || 0, ah = af.getTotalLength(aq.path) - q * ap) : (aj = q * ap, ah = af.getTotalLength(aq.path) - (ay._.arrows.enddx * ap || 0)), l = {}, l["marker-" + at] = "url(#" + am + ")";
                    if (ah || aj) {
                        l.d = Raphael.getSubpath(aq.path, aj, ah)
                    }
                    O(ar, l), ay._.arrows[at + "Path"] = an, ay._.arrows[at + "Marker"] = am, ay._.arrows[at + "dx"] = q, ay._.arrows[at + "Type"] = al, ay._.arrows[at + "String"] = ax
                } else {
                    aw ? (aj = ay._.arrows.startdx * ap || 0, ah = af.getTotalLength(aq.path) - aj) : (aj = 0, ah = af.getTotalLength(aq.path) - (ay._.arrows.enddx * ap || 0)), ay._.arrows[at + "Path"] && O(ar, {
                        d: Raphael.getSubpath(aq.path, aj, ah)
                    }), delete ay._.arrows[at + "Path"], delete ay._.arrows[at + "Marker"], delete ay._.arrows[at + "dx"], delete ay._.arrows[at + "Type"], delete ay._.arrows[at + "String"]
                }
                for (l in Q) {
                    if (Q[ae](l) && !Q[l]) {
                        var o = af._g.doc.getElementById(l);
                        o && o.parentNode.removeChild(o)
                    }
                }
            }
        },
        I = {
            "": [0],
            none: [0],
            "-": [3, 1],
            ".": [1, 1],
            "-.": [3, 1, 1, 1],
            "-..": [3, 1, 1, 1, 1, 1],
            ". ": [1, 3],
            "- ": [4, 3],
            "--": [8, 3],
            "- .": [4, 3, 1, 3],
            "--.": [8, 3, 1, 3],
            "--..": [8, 3, 1, 3, 1, 3]
        },
        H = function(i, c, n) {
            c = I[ad(c).toLowerCase()];
            if (c) {
                var m = i.attrs["stroke-width"] || "1",
                    l = {
                        round: m,
                        square: m,
                        butt: 0
                    }[i.attrs["stroke-linecap"] || n["stroke-linecap"]] || 0,
                    k = [],
                    j = c.length;
                while (j--) {
                    k[j] = c[j] * m + (j % 2 ? 1 : -1) * l
                }
                O(i.node, {
                    "stroke-dasharray": k.join(",")
                })
            }
        },
        G = function(ak, aj) {
            var ai = ak.node,
                ah = ak.attrs,
                ag = ai.style.visibility;
            ai.style.visibility = "hidden";
            for (var y in aj) {
                if (aj[ae](y)) {
                    if (!af._availableAttrs[ae](y)) {
                        continue
                    }
                    var v = aj[y];
                    ah[y] = v;
                    switch (y) {
                        case "blur":
                            ak.blur(v);
                            break;
                        case "href":
                        case "title":
                        case "target":
                            var n = ai.parentNode;
                            if (n.tagName.toLowerCase() != "a") {
                                var h = O("a");
                                n.insertBefore(h, ai), h.appendChild(ai), n = h
                            }
                            y == "target" ? n.setAttributeNS(S, "show", v == "blank" ? "new" : v) : n.setAttributeNS(S, y, v);
                            break;
                        case "cursor":
                            ai.style.cursor = v;
                            break;
                        case "transform":
                            ak.transform(v);
                            break;
                        case "arrow-start":
                            J(ak, v);
                            break;
                        case "arrow-end":
                            J(ak, v, 1);
                            break;
                        case "clip-rect":
                            var e = ad(v).split(W);
                            if (e.length == 4) {
                                ak.clip && ak.clip.parentNode.parentNode.removeChild(ak.clip.parentNode);
                                var a = O("clipPath"),
                                    t = O("rect");
                                a.id = af.createUUID(), O(t, {
                                    x: e[0],
                                    y: e[1],
                                    width: e[2],
                                    height: e[3]
                                }), a.appendChild(t), ak.paper.defs.appendChild(a), O(ai, {
                                    "clip-path": "url(#" + a.id + ")"
                                }), ak.clip = t
                            }
                            if (!v) {
                                var s = ai.getAttribute("clip-path");
                                if (s) {
                                    var r = af._g.doc.getElementById(s.replace(/(^url\(#|\)$)/g, U));
                                    r && r.parentNode.removeChild(r), O(ai, {
                                        "clip-path": U
                                    }), delete ak.clip
                                }
                            }
                            break;
                        case "path":
                            ak.type == "path" && (O(ai, {
                                d: v ? ah.path = af._pathToAbsolute(v) : "M0,0"
                            }), ak._.dirty = 1, ak._.arrows && ("startString" in ak._.arrows && J(ak, ak._.arrows.startString), "endString" in ak._.arrows && J(ak, ak._.arrows.endString, 1)));
                            break;
                        case "width":
                            ai.setAttribute(y, v), ak._.dirty = 1;
                            if (ah.fx) {
                                y = "x", v = ah.x
                            } else {
                                break
                            }
                        case "x":
                            ah.fx && (v = -ah.x - (ah.width || 0));
                        case "rx":
                            if (y == "rx" && ak.type == "rect") {
                                break
                            }
                        case "cx":
                            ai.setAttribute(y, v), ak.pattern && K(ak), ak._.dirty = 1;
                            break;
                        case "height":
                            ai.setAttribute(y, v), ak._.dirty = 1;
                            if (ah.fy) {
                                y = "y", v = ah.y
                            } else {
                                break
                            }
                        case "y":
                            ah.fy && (v = -ah.y - (ah.height || 0));
                        case "ry":
                            if (y == "ry" && ak.type == "rect") {
                                break
                            }
                        case "cy":
                            ai.setAttribute(y, v), ak.pattern && K(ak), ak._.dirty = 1;
                            break;
                        case "r":
                            ak.type == "rect" ? O(ai, {
                                rx: v,
                                ry: v
                            }) : ai.setAttribute(y, v), ak._.dirty = 1;
                            break;
                        case "src":
                            ak.type == "image" && ai.setAttributeNS(S, "href", v);
                            break;
                        case "stroke-width":
                            if (ak._.sx != 1 || ak._.sy != 1) {
                                v /= Z(Y(ak._.sx), Y(ak._.sy)) || 1
                            }
                            ak.paper._vbSize && (v *= ak.paper._vbSize), ai.setAttribute(y, v), ah["stroke-dasharray"] && H(ak, ah["stroke-dasharray"], aj), ak._.arrows && ("startString" in ak._.arrows && J(ak, ak._.arrows.startString), "endString" in ak._.arrows && J(ak, ak._.arrows.endString, 1));
                            break;
                        case "stroke-dasharray":
                            H(ak, v, aj);
                            break;
                        case "fill":
                            var q = ad(v).match(af._ISURL);
                            if (q) {
                                a = O("pattern");
                                var l = O("image");
                                a.id = af.createUUID(), O(a, {
                                        x: 0,
                                        y: 0,
                                        patternUnits: "userSpaceOnUse",
                                        height: 1,
                                        width: 1
                                    }), O(l, {
                                        x: 0,
                                        y: 0,
                                        "xlink:href": q[1]
                                    }), a.appendChild(l),
                                    function(d) {
                                        af._preload(q[1], function() {
                                            var f = this.offsetWidth,
                                                i = this.offsetHeight;
                                            O(d, {
                                                width: f,
                                                height: i
                                            }), O(l, {
                                                width: f,
                                                height: i
                                            }), ak.paper.safari()
                                        })
                                    }(a), ak.paper.defs.appendChild(a), O(ai, {
                                        fill: "url(#" + a.id + ")"
                                    }), ak.pattern = a, ak.pattern && K(ak);
                                break
                            }
                            var j = af.getRGB(v);
                            if (!j.error) {
                                delete aj.gradient, delete ah.gradient, !af.is(ah.opacity, "undefined") && af.is(aj.opacity, "undefined") && O(ai, {
                                    opacity: ah.opacity
                                }), !af.is(ah["fill-opacity"], "undefined") && af.is(aj["fill-opacity"], "undefined") && O(ai, {
                                    "fill-opacity": ah["fill-opacity"]
                                })
                            } else {
                                if ((ak.type == "circle" || ak.type == "ellipse" || ad(v).charAt() != "r") && M(ak, v)) {
                                    if ("opacity" in ah || "fill-opacity" in ah) {
                                        var g = af._g.doc.getElementById(ai.getAttribute("fill").replace(/^url\(#|\)$/g, U));
                                        if (g) {
                                            var c = g.getElementsByTagName("stop");
                                            O(c[c.length - 1], {
                                                "stop-opacity": ("opacity" in ah ? ah.opacity : 1) * ("fill-opacity" in ah ? ah["fill-opacity"] : 1)
                                            })
                                        }
                                    }
                                    ah.gradient = v, ah.fill = "none";
                                    break
                                }
                            }
                            j[ae]("opacity") && O(ai, {
                                "fill-opacity": j.opacity > 1 ? j.opacity / 100 : j.opacity
                            });
                        case "stroke":
                            j = af.getRGB(v), ai.setAttribute(y, j.hex), y == "stroke" && j[ae]("opacity") && O(ai, {
                                "stroke-opacity": j.opacity > 1 ? j.opacity / 100 : j.opacity
                            }), y == "stroke" && ak._.arrows && ("startString" in ak._.arrows && J(ak, ak._.arrows.startString), "endString" in ak._.arrows && J(ak, ak._.arrows.endString, 1));
                            break;
                        case "gradient":
                            (ak.type == "circle" || ak.type == "ellipse" || ad(v).charAt() != "r") && M(ak, v);
                            break;
                        case "opacity":
                            ah.gradient && !ah[ae]("stroke-opacity") && O(ai, {
                                "stroke-opacity": v > 1 ? v / 100 : v
                            });
                        case "fill-opacity":
                            if (ah.gradient) {
                                g = af._g.doc.getElementById(ai.getAttribute("fill").replace(/^url\(#|\)$/g, U)), g && (c = g.getElementsByTagName("stop"), O(c[c.length - 1], {
                                    "stop-opacity": v
                                }));
                                break
                            }
                        default:
                            y == "font-size" && (v = ab(v, 10) + "px");
                            var b = y.replace(/(\-.)/g, function(d) {
                                return d.substring(1).toUpperCase()
                            });
                            ai.style[b] = v, ak._.dirty = 1, ai.setAttribute(y, v)
                    }
                }
            }
            E(ak, aj), ai.style.visibility = ag
        },
        F = 1.2,
        E = function(x, w) {
            if (x.type == "text" && !!(w[ae]("text") || w[ae]("font") || w[ae]("font-size") || w[ae]("x") || w[ae]("y"))) {
                var v = x.attrs,
                    u = x.node,
                    t = u.firstChild ? ab(af._g.doc.defaultView.getComputedStyle(u.firstChild, U).getPropertyValue("font-size"), 10) : 10;
                if (w[ae]("text")) {
                    v.text = w.text;
                    while (u.firstChild) {
                        u.removeChild(u.firstChild)
                    }
                    var s = ad(w.text).split("\n"),
                        q = [],
                        l;
                    for (var e = 0, c = s.length; e < c; e++) {
                        l = O("tspan"), e && O(l, {
                            dy: t * F,
                            x: v.x
                        }), l.appendChild(af._g.doc.createTextNode(s[e])), u.appendChild(l), q[e] = l
                    }
                } else {
                    q = u.getElementsByTagName("tspan");
                    for (e = 0, c = q.length; e < c; e++) {
                        e ? O(q[e], {
                            dy: t * F,
                            x: v.x
                        }) : O(q[0], {
                            dy: 0
                        })
                    }
                }
                O(u, {
                    x: v.x,
                    y: v.y
                }), x._.dirty = 1;
                var b = x._getBBox(),
                    a = v.y - (b.y + b.height / 2);
                a && af.is(a, "finite") && O(q[0], {
                    dy: a
                })
            }
        },
        D = function(a, h) {
            var g = 0,
                f = 0;
            this[0] = this.node = a, a.raphael = !0, this.id = af._oid++, a.raphaelid = this.id, this.matrix = af.matrix(), this.realPath = null, this.paper = h, this.attrs = this.attrs || {}, this._ = {
                transform: [],
                sx: 1,
                sy: 1,
                deg: 0,
                dx: 0,
                dy: 0,
                dirty: 1
            }, !h.bottom && (h.bottom = this), this.prev = h.top, h.top && (h.top.next = this), h.top = this, this.next = null
        },
        P = af.el;
    D.prototype = P, P.constructor = D, af._engine.path = function(f, e) {
        var h = O("path");
        e.canvas && e.canvas.appendChild(h);
        var g = new D(h, e);
        g.type = "path", G(g, {
            fill: "none",
            stroke: "#000",
            path: f
        });
        return g
    }, P.rotate = function(d, c, h) {
        if (this.removed) {
            return this
        }
        d = ad(d).split(W), d.length - 1 && (c = ac(d[1]), h = ac(d[2])), d = ac(d[0]), h == null && (c = h);
        if (c == null || h == null) {
            var g = this.getBBox(1);
            c = g.x + g.width / 2, h = g.y + g.height / 2
        }
        this.transform(this._.transform.concat([
            ["r", d, c, h]
        ]));
        return this
    }, P.scale = function(d, c, j, i) {
        if (this.removed) {
            return this
        }
        d = ad(d).split(W), d.length - 1 && (c = ac(d[1]), j = ac(d[2]), i = ac(d[3])), d = ac(d[0]), c == null && (c = d), i == null && (j = i);
        if (j == null || i == null) {
            var h = this.getBBox(1)
        }
        j = j == null ? h.x + h.width / 2 : j, i = i == null ? h.y + h.height / 2 : i, this.transform(this._.transform.concat([
            ["s", d, c, j, i]
        ]));
        return this
    }, P.translate = function(d, c) {
        if (this.removed) {
            return this
        }
        d = ad(d).split(W), d.length - 1 && (c = ac(d[1])), d = ac(d[0]) || 0, c = +c || 0, this.transform(this._.transform.concat([
            ["t", d, c]
        ]));
        return this
    }, P.transform = function(f) {
        var b = this._;
        if (f == null) {
            return b.transform
        }
        af._extractTransform(this, f), this.clip && O(this.clip, {
            transform: this.matrix.invert()
        }), this.pattern && K(this), this.node && O(this.node, {
            transform: this.matrix
        });
        if (b.sx != 1 || b.sy != 1) {
            var a = this.attrs[ae]("stroke-width") ? this.attrs["stroke-width"] : 1;
            this.attr({
                "stroke-width": a
            })
        }
        return this
    }, P.hide = function() {
        !this.removed && this.paper.safari(this.node.style.display = "none");
        return this
    }, P.show = function() {
        !this.removed && this.paper.safari(this.node.style.display = "");
        return this
    }, P.remove = function() {
        if (!this.removed && !!this.node.parentNode) {
            var a = this.paper;
            a.__set__ && a.__set__.exclude(this), V.unbind("raphael.*.*." + this.id), this.gradient && a.defs.removeChild(this.gradient), af._tear(this, a), this.node.parentNode.tagName.toLowerCase() == "a" ? this.node.parentNode.parentNode.removeChild(this.node.parentNode) : this.node.parentNode.removeChild(this.node);
            for (var d in this) {
                this[d] = typeof this[d] == "function" ? af._removedFactory(d) : null
            }
            this.removed = !0
        }
    }, P._getBBox = function() {
        if (this.node.style.display == "none") {
            this.show();
            var e = !0
        }
        var d = {};
        try {
            d = this.node.getBBox()
        } catch (f) {} finally {
            d = d || {}
        }
        e && this.hide();
        return d
    }, P.attr = function(x, w) {
        if (this.removed) {
            return this
        }
        if (x == null) {
            var v = {};
            for (var u in this.attrs) {
                this.attrs[ae](u) && (v[u] = this.attrs[u])
            }
            v.gradient && v.fill == "none" && (v.fill = v.gradient) && delete v.gradient, v.transform = this._.transform;
            return v
        }
        if (w == null && af.is(x, "string")) {
            if (x == "fill" && this.attrs.fill == "none" && this.attrs.gradient) {
                return this.attrs.gradient
            }
            if (x == "transform") {
                return this._.transform
            }
            var t = x.split(W),
                s = {};
            for (var r = 0, q = t.length; r < q; r++) {
                x = t[r], x in this.attrs ? s[x] = this.attrs[x] : af.is(this.paper.customAttributes[x], "function") ? s[x] = this.paper.customAttributes[x].def : s[x] = af._availableAttrs[x]
            }
            return q - 1 ? s : s[t[0]]
        }
        if (w == null && af.is(x, "array")) {
            s = {};
            for (r = 0, q = x.length; r < q; r++) {
                s[x[r]] = this.attr(x[r])
            }
            return s
        }
        if (w != null) {
            var k = {};
            k[x] = w
        } else {
            x != null && af.is(x, "object") && (k = x)
        }
        for (var j in k) {
            V("raphael.attr." + j + "." + this.id, this, k[j])
        }
        for (j in this.paper.customAttributes) {
            if (this.paper.customAttributes[ae](j) && k[ae](j) && af.is(this.paper.customAttributes[j], "function")) {
                var b = this.paper.customAttributes[j].apply(this, [].concat(k[j]));
                this.attrs[j] = k[j];
                for (var a in b) {
                    b[ae](a) && (k[a] = b[a])
                }
            }
        }
        G(this, k);
        return this
    }, P.toFront = function() {
        if (this.removed) {
            return this
        }
        this.node.parentNode.tagName.toLowerCase() == "a" ? this.node.parentNode.parentNode.appendChild(this.node.parentNode) : this.node.parentNode.appendChild(this.node);
        var a = this.paper;
        a.top != this && af._tofront(this, a);
        return this
    }, P.toBack = function() {
        if (this.removed) {
            return this
        }
        var a = this.node.parentNode;
        a.tagName.toLowerCase() == "a" ? a.parentNode.insertBefore(this.node.parentNode, this.node.parentNode.parentNode.firstChild) : a.firstChild != this.node && a.insertBefore(this.node, this.node.parentNode.firstChild), af._toback(this, this.paper);
        var d = this.paper;
        return this
    }, P.insertAfter = function(a) {
        if (this.removed) {
            return this
        }
        var d = a.node || a[a.length - 1].node;
        d.nextSibling ? d.parentNode.insertBefore(this.node, d.nextSibling) : d.parentNode.appendChild(this.node), af._insertafter(this, a, this.paper);
        return this
    }, P.insertBefore = function(a) {
        if (this.removed) {
            return this
        }
        var d = a.node || a[0].node;
        d.parentNode.insertBefore(this.node, d), af._insertbefore(this, a, this.paper);
        return this
    }, P.blur = function(a) {
        var h = this;
        if (+a !== 0) {
            var g = O("filter"),
                f = O("feGaussianBlur");
            h.attrs.blur = a, g.id = af.createUUID(), O(f, {
                stdDeviation: +a || 1.5
            }), g.appendChild(f), h.paper.defs.appendChild(g), h._blur = g, O(h.node, {
                filter: "url(#" + g.id + ")"
            })
        } else {
            h._blur && (h._blur.parentNode.removeChild(h._blur), delete h._blur, delete h.attrs.blur), h.node.removeAttribute("filter")
        }
    }, af._engine.circle = function(h, g, l, k) {
        var j = O("circle");
        h.canvas && h.canvas.appendChild(j);
        var i = new D(j, h);
        i.attrs = {
            cx: g,
            cy: l,
            r: k,
            fill: "none",
            stroke: "#000"
        }, i.type = "circle", O(j, i.attrs);
        return i
    }, af._engine.rect = function(j, i, p, o, n, m) {
        var l = O("rect");
        j.canvas && j.canvas.appendChild(l);
        var k = new D(l, j);
        k.attrs = {
            x: i,
            y: p,
            width: o,
            height: n,
            r: m || 0,
            rx: m || 0,
            ry: m || 0,
            fill: "none",
            stroke: "#000"
        }, k.type = "rect", O(l, k.attrs);
        return k
    }, af._engine.ellipse = function(i, h, n, m, l) {
        var k = O("ellipse");
        i.canvas && i.canvas.appendChild(k);
        var j = new D(k, i);
        j.attrs = {
            cx: h,
            cy: n,
            rx: m,
            ry: l,
            fill: "none",
            stroke: "#000"
        }, j.type = "ellipse", O(k, j.attrs);
        return j
    }, af._engine.image = function(j, i, p, o, n, m) {
        var l = O("image");
        O(l, {
            x: p,
            y: o,
            width: n,
            height: m,
            preserveAspectRatio: "none"
        }), l.setAttributeNS(S, "href", i), j.canvas && j.canvas.appendChild(l);
        var k = new D(l, j);
        k.attrs = {
            x: p,
            y: o,
            width: n,
            height: m,
            src: i
        }, k.type = "image";
        return k
    }, af._engine.text = function(a, l, k, j) {
        var i = O("text");
        a.canvas && a.canvas.appendChild(i);
        var h = new D(i, a);
        h.attrs = {
            x: l,
            y: k,
            "text-anchor": "middle",
            text: j,
            font: af._availableAttrs.font,
            stroke: "none",
            fill: "#000"
        }, h.type = "text", G(h, h.attrs);
        return h
    }, af._engine.setSize = function(d, c) {
        this.width = d || this.width, this.height = c || this.height, this.canvas.setAttribute("width", this.width), this.canvas.setAttribute("height", this.height), this._viewBox && this.setViewBox.apply(this, this._viewBox);
        return this
    }, af._engine.create = function() {
        var r = af._getContainer.apply(0, arguments),
            q = r && r.container,
            p = r.x,
            o = r.y,
            n = r.width,
            m = r.height;
        if (!q) {
            throw new Error("SVG container not found.")
        }
        var l = O("svg"),
            k = "overflow:hidden;",
            a;
        p = p || 0, o = o || 0, n = n || 512, m = m || 342, O(l, {
            height: m,
            version: 1.1,
            width: n,
            xmlns: "http://www.w3.org/2000/svg"
        }), q == 1 ? (l.style.cssText = k + "position:absolute;left:" + p + "px;top:" + o + "px", af._g.doc.body.appendChild(l), a = 1) : (l.style.cssText = k + "position:relative", q.firstChild ? q.insertBefore(l, q.firstChild) : q.appendChild(l)), q = new af._Paper, q.width = n, q.height = m, q.canvas = l, q.clear(), q._left = q._top = 0, a && (q.renderfix = function() {}), q.renderfix();
        return q
    }, af._engine.setViewBox = function(t, s, r, q, p) {
        V("raphael.setViewBox", this, this._viewBox, [t, s, r, q, p]);
        var o = Z(r / this.width, q / this.height),
            n = this.top,
            m = p ? "meet" : "xMinYMin",
            k, g;
        t == null ? (this._vbSize && (o = 1), delete this._vbSize, k = "0 0 " + this.width + T + this.height) : (this._vbSize = o, k = t + T + s + T + r + T + q), O(this.canvas, {
            viewBox: k,
            preserveAspectRatio: m
        });
        while (o && n) {
            g = "stroke-width" in n.attrs ? n.attrs["stroke-width"] : 1, n.attr({
                "stroke-width": g
            }), n._.dirty = 1, n._.dirtyT = 1, n = n.prev
        }
        this._viewBox = [t, s, r, q, !!p];
        return this
    }, af.prototype.renderfix = function() {
        var h = this.canvas,
            g = h.style,
            l;
        try {
            l = h.getScreenCTM() || h.createSVGMatrix()
        } catch (k) {
            l = h.createSVGMatrix()
        }
        var j = -l.e % 1,
            i = -l.f % 1;
        if (j || i) {
            j && (this._left = (this._left + j) % 1, g.left = this._left + "px"), i && (this._top = (this._top + i) % 1, g.top = this._top + "px")
        }
    }, af.prototype.clear = function() {
        af.eve("raphael.clear", this);
        var a = this.canvas;
        while (a.firstChild) {
            a.removeChild(a.firstChild)
        }
        this.bottom = this.top = null, (this.desc = O("desc")).appendChild(af._g.doc.createTextNode("Created with Raphaël " + af.version)), a.appendChild(this.desc), a.appendChild(this.defs = O("defs"))
    }, af.prototype.remove = function() {
        V("raphael.remove", this), this.canvas.parentNode && this.canvas.parentNode.removeChild(this.canvas);
        for (var a in this) {
            this[a] = typeof this[a] == "function" ? af._removedFactory(a) : null
        }
    };
    var N = af.st;
    for (var L in P) {
        P[ae](L) && !N[ae](L) && (N[L] = function(b) {
            return function() {
                var a = arguments;
                return this.forEach(function(d) {
                    d[b].apply(d, a)
                })
            }
        }(L))
    }
}(window.Raphael), window.Raphael.vml && function(ap) {
    var ao = "hasOwnProperty",
        an = String,
        am = parseFloat,
        al = Math,
        ak = al.round,
        aj = al.max,
        ai = al.min,
        ah = al.abs,
        ag = "fill",
        af = /[, ]+/,
        ae = ap.eve,
        ad = " progid:DXImageTransform.Microsoft",
        ac = " ",
        ab = "",
        aa = {
            M: "m",
            L: "l",
            C: "c",
            Z: "x",
            m: "t",
            l: "r",
            c: "v",
            z: "x"
        },
        Y = /([clmz]),?([^clmz]*)/gi,
        W = / progid:\S+Blur\([^\)]+\)/g,
        U = /-?[^,\s-]+/g,
        S = "position:absolute;left:0;top:0;width:1px;height:1px",
        Q = 21600,
        O = {
            path: 1,
            rect: 1,
            image: 1
        },
        M = {
            circle: 1,
            ellipse: 1
        },
        K = function(v) {
            var u = /[ahqstv]/ig,
                t = ap._pathToAbsolute;
            an(v).match(u) && (t = ap._path2curve), u = /[clmz]/g;
            if (t == ap._pathToAbsolute && !an(v).match(u)) {
                var s = an(v).replace(Y, function(i, h, m) {
                    var l = [],
                        k = h.toLowerCase() == "m",
                        j = aa[h];
                    m.replace(U, function(b) {
                        k && l.length == 2 && (j += l + aa[h == "m" ? "l" : "L"], l = []), l.push(ak(b * Q))
                    });
                    return j + l
                });
                return s
            }
            var q = t(v),
                p, o;
            s = [];
            for (var n = 0, f = q.length; n < f; n++) {
                p = q[n], o = q[n][0].toLowerCase(), o == "z" && (o = "x");
                for (var c = 1, a = p.length; c < a; c++) {
                    o += ak(p[c] * Q) + (c != a - 1 ? "," : ab)
                }
                s.push(o)
            }
            return s.join(ac)
        },
        J = function(a, h, g) {
            var f = ap.matrix();
            f.rotate(-a, 0.5, 0.5);
            return {
                dx: f.x(h, g),
                dy: f.y(h, g)
            }
        },
        I = function(ar, aq, H, G, F, E) {
            var D = ar._,
                C = ar.matrix,
                B = D.fillpos,
                A = ar.node,
                z = A.style,
                y = 1,
                x = "",
                w, u = Q / aq,
                n = Q / H;
            z.visibility = "hidden";
            if (!!aq && !!H) {
                A.coordsize = ah(u) + ac + ah(n), z.rotation = E * (aq * H < 0 ? -1 : 1);
                if (E) {
                    var j = J(E, G, F);
                    G = j.dx, F = j.dy
                }
                aq < 0 && (x += "x"), H < 0 && (x += " y") && (y = -1), z.flip = x, A.coordorigin = G * -u + ac + F * -n;
                if (B || D.fillsize) {
                    var i = A.getElementsByTagName(ag);
                    i = i && i[0], A.removeChild(i), B && (j = J(E, C.x(B[0], B[1]), C.y(B[0], B[1])), i.position = j.dx * y + ac + j.dy * y), D.fillsize && (i.size = D.fillsize[0] * ah(aq) + ac + D.fillsize[1] * ah(H)), A.appendChild(i)
                }
                z.visibility = "visible"
            }
        };
    ap.toString = function() {
        return "Your browser doesn’t support SVG. Falling down to VML.\nYou are running Raphaël " + this.version
    };
    var Z = function(t, s, r) {
            var q = an(s).toLowerCase().split("-"),
                p = r ? "end" : "start",
                o = q.length,
                n = "classic",
                m = "medium",
                l = "medium";
            while (o--) {
                switch (q[o]) {
                    case "block":
                    case "classic":
                    case "oval":
                    case "diamond":
                    case "open":
                    case "none":
                        n = q[o];
                        break;
                    case "wide":
                    case "narrow":
                        l = q[o];
                        break;
                    case "long":
                    case "short":
                        m = q[o]
                }
            }
            var c = t.node.getElementsByTagName("stroke")[0];
            c[p + "arrow"] = n, c[p + "arrowlength"] = m, c[p + "arrowwidth"] = l
        },
        X = function(aF, aE) {
            aF.attrs = aF.attrs || {};
            var aD = aF.node,
                aC = aF.attrs,
                aB = aD.style,
                aA, ay = O[aF.type] && (aE.x != aC.x || aE.y != aC.y || aE.width != aC.width || aE.height != aC.height || aE.cx != aC.cx || aE.cy != aC.cy || aE.rx != aC.rx || aE.ry != aC.ry || aE.r != aC.r),
                aw = M[aF.type] && (aC.cx != aE.cx || aC.cy != aE.cy || aC.r != aE.r || aC.rx != aE.rx || aC.ry != aE.ry),
                av = aF;
            for (var F in aE) {
                aE[ao](F) && (aC[F] = aE[F])
            }
            ay && (aC.path = ap._getPath[aF.type](aF), aF._.dirty = 1), aE.href && (aD.href = aE.href), aE.title && (aD.title = aE.title), aE.target && (aD.target = aE.target), aE.cursor && (aB.cursor = aE.cursor), "blur" in aE && aF.blur(aE.blur);
            if (aE.path && aF.type == "path" || ay) {
                aD.path = K(~an(aC.path).toLowerCase().indexOf("r") ? ap._pathToAbsolute(aC.path) : aC.path), aF.type == "image" && (aF._.fillpos = [aC.x, aC.y], aF._.fillsize = [aC.width, aC.height], I(aF, 1, 1, 0, 0, 0))
            }
            "transform" in aE && aF.transform(aE.transform);
            if (aw) {
                var az = +aC.cx,
                    ax = +aC.cy,
                    au = +aC.rx || +aC.r || 0,
                    at = +aC.ry || +aC.r || 0;
                aD.path = ap.format("ar{0},{1},{2},{3},{4},{1},{4},{1}x", ak((az - au) * Q), ak((ax - at) * Q), ak((az + au) * Q), ak((ax + at) * Q), ak(az * Q))
            }
            if ("clip-rect" in aE) {
                var ar = an(aE["clip-rect"]).split(af);
                if (ar.length == 4) {
                    ar[2] = +ar[2] + +ar[0], ar[3] = +ar[3] + +ar[1];
                    var aq = aD.clipRect || ap._g.doc.createElement("div"),
                        C = aq.style;
                    C.clip = ap.format("rect({1}px {2}px {3}px {0}px)", ar), aD.clipRect || (C.position = "absolute", C.top = 0, C.left = 0, C.width = aF.paper.width + "px", C.height = aF.paper.height + "px", aD.parentNode.insertBefore(aq, aD), aq.appendChild(aD), aD.clipRect = aq)
                }
                aE["clip-rect"] || aD.clipRect && (aD.clipRect.style.clip = "auto")
            }
            if (aF.textpath) {
                var A = aF.textpath.style;
                aE.font && (A.font = aE.font), aE["font-family"] && (A.fontFamily = '"' + aE["font-family"].split(",")[0].replace(/^['"]+|['"]+$/g, ab) + '"'), aE["font-size"] && (A.fontSize = aE["font-size"]), aE["font-weight"] && (A.fontWeight = aE["font-weight"]), aE["font-style"] && (A.fontStyle = aE["font-style"])
            }
            "arrow-start" in aE && Z(av, aE["arrow-start"]), "arrow-end" in aE && Z(av, aE["arrow-end"], 1);
            if (aE.opacity != null || aE["stroke-width"] != null || aE.fill != null || aE.src != null || aE.stroke != null || aE["stroke-width"] != null || aE["stroke-opacity"] != null || aE["fill-opacity"] != null || aE["stroke-dasharray"] != null || aE["stroke-miterlimit"] != null || aE["stroke-linejoin"] != null || aE["stroke-linecap"] != null) {
                var z = aD.getElementsByTagName(ag),
                    x = !1;
                z = z && z[0], !z && (x = z = P(ag)), aF.type == "image" && aE.src && (z.src = aE.src), aE.fill && (z.on = !0);
                if (z.on == null || aE.fill == "none" || aE.fill === null) {
                    z.on = !1
                }
                if (z.on && aE.fill) {
                    var w = an(aE.fill).match(ap._ISURL);
                    if (w) {
                        z.parentNode == aD && aD.removeChild(z), z.rotate = !0, z.src = w[1], z.type = "tile";
                        var v = aF.getBBox(1);
                        z.position = v.x + ac + v.y, aF._.fillpos = [v.x, v.y], ap._preload(w[1], function() {
                            aF._.fillsize = [this.offsetWidth, this.offsetHeight]
                        })
                    } else {
                        z.color = ap.getRGB(aE.fill).hex, z.src = ab, z.type = "solid", ap.getRGB(aE.fill).error && (av.type in {
                            circle: 1,
                            ellipse: 1
                        } || an(aE.fill).charAt() != "r") && V(av, aE.fill, z) && (aC.fill = "none", aC.gradient = aE.fill, z.rotate = !1)
                    }
                }
                if ("fill-opacity" in aE || "opacity" in aE) {
                    var u = ((+aC["fill-opacity"] + 1 || 2) - 1) * ((+aC.opacity + 1 || 2) - 1) * ((+ap.getRGB(aE.fill).o + 1 || 2) - 1);
                    u = ai(aj(u, 0), 1), z.opacity = u, z.src && (z.color = "none")
                }
                aD.appendChild(z);
                var n = aD.getElementsByTagName("stroke") && aD.getElementsByTagName("stroke")[0],
                    h = !1;
                !n && (h = n = P("stroke"));
                if (aE.stroke && aE.stroke != "none" || aE["stroke-width"] || aE["stroke-opacity"] != null || aE["stroke-dasharray"] || aE["stroke-miterlimit"] || aE["stroke-linejoin"] || aE["stroke-linecap"]) {
                    n.on = !0
                }(aE.stroke == "none" || aE.stroke === null || n.on == null || aE.stroke == 0 || aE["stroke-width"] == 0) && (n.on = !1);
                var g = ap.getRGB(aE.stroke);
                n.on && aE.stroke && (n.color = g.hex), u = ((+aC["stroke-opacity"] + 1 || 2) - 1) * ((+aC.opacity + 1 || 2) - 1) * ((+g.o + 1 || 2) - 1);
                var f = (am(aE["stroke-width"]) || 1) * 0.75;
                u = ai(aj(u, 0), 1), aE["stroke-width"] == null && (f = aC["stroke-width"]), aE["stroke-width"] && (n.weight = f), f && f < 1 && (u *= f) && (n.weight = 1), n.opacity = u, aE["stroke-linejoin"] && (n.joinstyle = aE["stroke-linejoin"] || "miter"), n.miterlimit = aE["stroke-miterlimit"] || 8, aE["stroke-linecap"] && (n.endcap = aE["stroke-linecap"] == "butt" ? "flat" : aE["stroke-linecap"] == "square" ? "square" : "round");
                if (aE["stroke-dasharray"]) {
                    var d = {
                        "-": "shortdash",
                        ".": "shortdot",
                        "-.": "shortdashdot",
                        "-..": "shortdashdotdot",
                        ". ": "dot",
                        "- ": "dash",
                        "--": "longdash",
                        "- .": "dashdot",
                        "--.": "longdashdot",
                        "--..": "longdashdotdot"
                    };
                    n.dashstyle = d[ao](aE["stroke-dasharray"]) ? d[aE["stroke-dasharray"]] : ab
                }
                h && aD.appendChild(n)
            }
            if (av.type == "text") {
                av.paper.canvas.style.display = ab;
                var c = av.paper.span,
                    b = 100,
                    a = aC.font && aC.font.match(/\d+(?:\.\d*)?(?=px)/);
                aB = c.style, aC.font && (aB.font = aC.font), aC["font-family"] && (aB.fontFamily = aC["font-family"]), aC["font-weight"] && (aB.fontWeight = aC["font-weight"]), aC["font-style"] && (aB.fontStyle = aC["font-style"]), a = am(aC["font-size"] || a && a[0]) || 10, aB.fontSize = a * b + "px", av.textpath.string && (c.innerHTML = an(av.textpath.string).replace(/</g, "&#60;").replace(/&/g, "&#38;").replace(/\n/g, "<br>"));
                var j = c.getBoundingClientRect();
                av.W = aC.w = (j.right - j.left) / b, av.H = aC.h = (j.bottom - j.top) / b, av.X = aC.x, av.Y = aC.y + av.H / 2, ("x" in aE || "y" in aE) && (av.path.v = ap.format("m{0},{1}l{2},{1}", ak(aC.x * Q), ak(aC.y * Q), ak(aC.x * Q) + 1));
                var aG = ["x", "y", "text", "font", "font-family", "font-weight", "font-style", "font-size"];
                for (var o = 0, k = aG.length; o < k; o++) {
                    if (aG[o] in aE) {
                        av._.dirty = 1;
                        break
                    }
                }
                switch (aC["text-anchor"]) {
                    case "start":
                        av.textpath.style["v-text-align"] = "left", av.bbx = av.W / 2;
                        break;
                    case "end":
                        av.textpath.style["v-text-align"] = "right", av.bbx = -av.W / 2;
                        break;
                    default:
                        av.textpath.style["v-text-align"] = "center", av.bbx = 0
                }
                av.textpath.style["v-text-kern"] = !0
            }
        },
        V = function(z, y, x) {
            z.attrs = z.attrs || {};
            var w = z.attrs,
                v = Math.pow,
                u, o, n = "linear",
                e = ".5 .5";
            z.attrs.gradient = y, y = an(y).replace(ap._radial_gradient, function(g, f, h) {
                n = "radial", f && h && (f = am(f), h = am(h), v(f - 0.5, 2) + v(h - 0.5, 2) > 0.25 && (h = al.sqrt(0.25 - v(f - 0.5, 2)) * ((h > 0.5) * 2 - 1) + 0.5), e = f + ac + h);
                return ab
            }), y = y.split(/\s*\-\s*/);
            if (n == "linear") {
                var d = y.shift();
                d = -am(d);
                if (isNaN(d)) {
                    return null
                }
            }
            var c = ap._parseDots(y);
            if (!c) {
                return null
            }
            z = z.shape || z.node;
            if (c.length) {
                z.removeChild(x), x.on = !0, x.method = "none", x.color = c[0].color, x.color2 = c[c.length - 1].color;
                var a = [];
                for (var B = 0, A = c.length; B < A; B++) {
                    c[B].offset && a.push(c[B].offset + ac + c[B].color)
                }
                x.colors = a.length ? a.join() : "0% " + x.color, n == "radial" ? (x.type = "gradientTitle", x.focus = "100%", x.focussize = "0 0", x.focusposition = e, x.angle = 0) : (x.type = "gradient", x.angle = (270 - d) % 360), z.appendChild(x)
            }
            return 1
        },
        T = function(a, d) {
            this[0] = this.node = a, a.raphael = !0, this.id = ap._oid++, a.raphaelid = this.id, this.X = 0, this.Y = 0, this.attrs = {}, this.paper = d, this.matrix = ap.matrix(), this._ = {
                transform: [],
                sx: 1,
                sy: 1,
                dx: 0,
                dy: 0,
                deg: 0,
                dirty: 1,
                dirtyT: 1
            }, !d.bottom && (d.bottom = this), this.prev = d.top, d.top && (d.top.next = this), d.top = this, this.next = null
        },
        R = ap.el;
    T.prototype = R, R.constructor = T, R.transform = function(B) {
        if (B == null) {
            return this._.transform
        }
        var A = this.paper._viewBoxShift,
            z = A ? "s" + [A.scale, A.scale] + "-1-1t" + [A.dx, A.dy] : ab,
            y;
        A && (y = B = an(B).replace(/\.{3}|\u2026/g, this._.transform || ab)), ap._extractTransform(this, z + B);
        var x = this.matrix.clone(),
            w = this.skew,
            v = this.node,
            u, t = ~an(this.attrs.fill).indexOf("-"),
            s = !an(this.attrs.fill).indexOf("url(");
        x.translate(-0.5, -0.5);
        if (s || t || this.type == "image") {
            w.matrix = "1 0 0 1", w.offset = "0 0", u = x.split();
            if (t && u.noRotation || !u.isSimple) {
                v.style.filter = x.toFilter();
                var o = this.getBBox(),
                    n = this.getBBox(1),
                    c = o.x - n.x,
                    a = o.y - n.y;
                v.coordorigin = c * -Q + ac + a * -Q, I(this, 1, 1, c, a, 0)
            } else {
                v.style.filter = ab, I(this, u.scalex, u.scaley, u.dx, u.dy, u.rotate)
            }
        } else {
            v.style.filter = ab, w.matrix = an(x), w.offset = x.offset()
        }
        y && (this._.transform = y);
        return this
    }, R.rotate = function(d, c, h) {
        if (this.removed) {
            return this
        }
        if (d != null) {
            d = an(d).split(af), d.length - 1 && (c = am(d[1]), h = am(d[2])), d = am(d[0]), h == null && (c = h);
            if (c == null || h == null) {
                var g = this.getBBox(1);
                c = g.x + g.width / 2, h = g.y + g.height / 2
            }
            this._.dirtyT = 1, this.transform(this._.transform.concat([
                ["r", d, c, h]
            ]));
            return this
        }
    }, R.translate = function(d, c) {
        if (this.removed) {
            return this
        }
        d = an(d).split(af), d.length - 1 && (c = am(d[1])), d = am(d[0]) || 0, c = +c || 0, this._.bbox && (this._.bbox.x += d, this._.bbox.y += c), this.transform(this._.transform.concat([
            ["t", d, c]
        ]));
        return this
    }, R.scale = function(d, c, j, i) {
        if (this.removed) {
            return this
        }
        d = an(d).split(af), d.length - 1 && (c = am(d[1]), j = am(d[2]), i = am(d[3]), isNaN(j) && (j = null), isNaN(i) && (i = null)), d = am(d[0]), c == null && (c = d), i == null && (j = i);
        if (j == null || i == null) {
            var h = this.getBBox(1)
        }
        j = j == null ? h.x + h.width / 2 : j, i = i == null ? h.y + h.height / 2 : i, this.transform(this._.transform.concat([
            ["s", d, c, j, i]
        ])), this._.dirtyT = 1;
        return this
    }, R.hide = function() {
        !this.removed && (this.node.style.display = "none");
        return this
    }, R.show = function() {
        !this.removed && (this.node.style.display = ab);
        return this
    }, R._getBBox = function() {
        if (this.removed) {
            return {}
        }
        return {
            x: this.X + (this.bbx || 0) - this.W / 2,
            y: this.Y - this.H,
            width: this.W,
            height: this.H
        }
    }, R.remove = function() {
        if (!this.removed && !!this.node.parentNode) {
            this.paper.__set__ && this.paper.__set__.exclude(this), ap.eve.unbind("raphael.*.*." + this.id), ap._tear(this, this.paper), this.node.parentNode.removeChild(this.node), this.shape && this.shape.parentNode.removeChild(this.shape);
            for (var a in this) {
                this[a] = typeof this[a] == "function" ? ap._removedFactory(a) : null
            }
            this.removed = !0
        }
    }, R.attr = function(x, w) {
        if (this.removed) {
            return this
        }
        if (x == null) {
            var v = {};
            for (var u in this.attrs) {
                this.attrs[ao](u) && (v[u] = this.attrs[u])
            }
            v.gradient && v.fill == "none" && (v.fill = v.gradient) && delete v.gradient, v.transform = this._.transform;
            return v
        }
        if (w == null && ap.is(x, "string")) {
            if (x == ag && this.attrs.fill == "none" && this.attrs.gradient) {
                return this.attrs.gradient
            }
            var t = x.split(af),
                s = {};
            for (var r = 0, l = t.length; r < l; r++) {
                x = t[r], x in this.attrs ? s[x] = this.attrs[x] : ap.is(this.paper.customAttributes[x], "function") ? s[x] = this.paper.customAttributes[x].def : s[x] = ap._availableAttrs[x]
            }
            return l - 1 ? s : s[t[0]]
        }
        if (this.attrs && w == null && ap.is(x, "array")) {
            s = {};
            for (r = 0, l = x.length; r < l; r++) {
                s[x[r]] = this.attr(x[r])
            }
            return s
        }
        var k;
        w != null && (k = {}, k[x] = w), w == null && ap.is(x, "object") && (k = x);
        for (var j in k) {
            ae("raphael.attr." + j + "." + this.id, this, k[j])
        }
        if (k) {
            for (j in this.paper.customAttributes) {
                if (this.paper.customAttributes[ao](j) && k[ao](j) && ap.is(this.paper.customAttributes[j], "function")) {
                    var b = this.paper.customAttributes[j].apply(this, [].concat(k[j]));
                    this.attrs[j] = k[j];
                    for (var a in b) {
                        b[ao](a) && (k[a] = b[a])
                    }
                }
            }
            k.text && this.type == "text" && (this.textpath.string = k.text), X(this, k)
        }
        return this
    }, R.toFront = function() {
        !this.removed && this.node.parentNode.appendChild(this.node), this.paper && this.paper.top != this && ap._tofront(this, this.paper);
        return this
    }, R.toBack = function() {
        if (this.removed) {
            return this
        }
        this.node.parentNode.firstChild != this.node && (this.node.parentNode.insertBefore(this.node, this.node.parentNode.firstChild), ap._toback(this, this.paper));
        return this
    }, R.insertAfter = function(a) {
        if (this.removed) {
            return this
        }
        a.constructor == ap.st.constructor && (a = a[a.length - 1]), a.node.nextSibling ? a.node.parentNode.insertBefore(this.node, a.node.nextSibling) : a.node.parentNode.appendChild(this.node), ap._insertafter(this, a, this.paper);
        return this
    }, R.insertBefore = function(a) {
        if (this.removed) {
            return this
        }
        a.constructor == ap.st.constructor && (a = a[0]), a.node.parentNode.insertBefore(this.node, a.node), ap._insertbefore(this, a, this.paper);
        return this
    }, R.blur = function(a) {
        var f = this.node.runtimeStyle,
            e = f.filter;
        e = e.replace(W, ab), +a !== 0 ? (this.attrs.blur = a, f.filter = e + ac + ad + ".Blur(pixelradius=" + (+a || 1.5) + ")", f.margin = ap.format("-{0}px 0 0 -{0}px", ak(+a || 1.5))) : (f.filter = e, f.margin = 0, delete this.attrs.blur)
    }, ap._engine.path = function(h, g) {
        var l = P("shape");
        l.style.cssText = S, l.coordsize = Q + ac + Q, l.coordorigin = g.coordorigin;
        var k = new T(l, g),
            j = {
                fill: "none",
                stroke: "#000"
            };
        h && (j.path = h), k.type = "path", k.path = [], k.Path = ab, X(k, j), g.canvas.appendChild(l);
        var i = P("skew");
        i.on = !0, l.appendChild(i), k.skew = i, k.transform(ab);
        return k
    }, ap._engine.rect = function(r, q, p, o, n, m) {
        var l = ap._rectPath(q, p, o, n, m),
            k = r.path(l),
            a = k.attrs;
        k.X = a.x = q, k.Y = a.y = p, k.W = a.width = o, k.H = a.height = n, a.r = m, a.path = l, k.type = "rect";
        return k
    }, ap._engine.ellipse = function(i, h, n, m, l) {
        var k = i.path(),
            j = k.attrs;
        k.X = h - m, k.Y = n - l, k.W = m * 2, k.H = l * 2, k.type = "ellipse", X(k, {
            cx: h,
            cy: n,
            rx: m,
            ry: l
        });
        return k
    }, ap._engine.circle = function(h, g, l, k) {
        var j = h.path(),
            i = j.attrs;
        j.X = g - k, j.Y = l - k, j.W = j.H = k * 2, j.type = "circle", X(j, {
            cx: g,
            cy: l,
            r: k
        });
        return j
    }, ap._engine.image = function(v, u, t, s, r, q) {
        var p = ap._rectPath(t, s, r, q),
            o = v.path(p).attr({
                stroke: "none"
            }),
            n = o.attrs,
            j = o.node,
            a = j.getElementsByTagName(ag)[0];
        n.src = u, o.X = n.x = t, o.Y = n.y = s, o.W = n.width = r, o.H = n.height = q, n.path = p, o.type = "image", a.parentNode == j && j.removeChild(a), a.rotate = !0, a.src = u, a.type = "tile", o._.fillpos = [t, s], o._.fillsize = [r, q], j.appendChild(a), I(o, 1, 1, 0, 0, 0);
        return o
    }, ap._engine.text = function(t, s, r, q) {
        var p = P("shape"),
            o = P("path"),
            n = P("textpath");
        s = s || 0, r = r || 0, q = q || "", o.v = ap.format("m{0},{1}l{2},{1}", ak(s * Q), ak(r * Q), ak(s * Q) + 1), o.textpathok = !0, n.string = an(q), n.on = !0, p.style.cssText = S, p.coordsize = Q + ac + Q, p.coordorigin = "0 0";
        var f = new T(p, t),
            c = {
                fill: "#000",
                stroke: "none",
                font: ap._availableAttrs.font,
                text: q
            };
        f.shape = p, f.path = o, f.textpath = n, f.type = "text", f.attrs.text = an(q), f.attrs.x = s, f.attrs.y = r, f.attrs.w = 1, f.attrs.h = 1, X(f, c), p.appendChild(n), p.appendChild(o), t.canvas.appendChild(p);
        var a = P("skew");
        a.on = !0, p.appendChild(a), f.skew = a, f.transform(ab);
        return f
    }, ap._engine.setSize = function(a, f) {
        var e = this.canvas.style;
        this.width = a, this.height = f, a == +a && (a += "px"), f == +f && (f += "px"), e.width = a, e.height = f, e.clip = "rect(0 " + a + " " + f + " 0)", this._viewBox && ap._engine.setViewBox.apply(this, this._viewBox);
        return this
    }, ap._engine.setViewBox = function(t, s, r, q, p) {
        ap.eve("raphael.setViewBox", this, this._viewBox, [t, s, r, q, p]);
        var o = this.width,
            n = this.height,
            m = 1 / aj(r / o, q / n),
            g, a;
        p && (g = n / q, a = o / r, r * g < o && (t -= (o - r * g) / 2 / g), q * a < n && (s -= (n - q * a) / 2 / a)), this._viewBox = [t, s, r, q, !!p], this._viewBoxShift = {
            dx: -t,
            dy: -s,
            scale: m
        }, this.forEach(function(b) {
            b.transform("...")
        });
        return this
    };
    var P;
    ap._engine.initWin = function(e) {
        var d = e.document;
        d.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
        try {
            !d.namespaces.rvml && d.namespaces.add("rvml", "urn:schemas-microsoft-com:vml"), P = function(b) {
                return d.createElement("<rvml:" + b + ' class="rvml">')
            }
        } catch (f) {
            P = function(b) {
                return d.createElement("<" + b + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">')
            }
        }
    }, ap._engine.initWin(ap._g.win), ap._engine.create = function() {
        var t = ap._getContainer.apply(0, arguments),
            s = t.container,
            r = t.height,
            q, p = t.width,
            o = t.x,
            n = t.y;
        if (!s) {
            throw new Error("VML container not found.")
        }
        var m = new ap._Paper,
            l = m.canvas = ap._g.doc.createElement("div"),
            a = l.style;
        o = o || 0, n = n || 0, p = p || 512, r = r || 342, m.width = p, m.height = r, p == +p && (p += "px"), r == +r && (r += "px"), m.coordsize = Q * 1000 + ac + Q * 1000, m.coordorigin = "0 0", m.span = ap._g.doc.createElement("span"), m.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;", l.appendChild(m.span), a.cssText = ap.format("top:0;left:0;width:{0};height:{1};display:inline-block;position:relative;clip:rect(0 {0} {1} 0);overflow:hidden", p, r), s == 1 ? (ap._g.doc.body.appendChild(l), a.left = o + "px", a.top = n + "px", a.position = "absolute") : s.firstChild ? s.insertBefore(l, s.firstChild) : s.appendChild(l), m.renderfix = function() {};
        return m
    }, ap.prototype.clear = function() {
        ap.eve("raphael.clear", this), this.canvas.innerHTML = ab, this.span = ap._g.doc.createElement("span"), this.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;", this.canvas.appendChild(this.span), this.bottom = this.top = null
    }, ap.prototype.remove = function() {
        ap.eve("raphael.remove", this), this.canvas.parentNode.removeChild(this.canvas);
        for (var a in this) {
            this[a] = typeof this[a] == "function" ? ap._removedFactory(a) : null
        }
        return !0
    };
    var N = ap.st;
    for (var L in R) {
        R[ao](L) && !N[ao](L) && (N[L] = function(b) {
            return function() {
                var a = arguments;
                return this.forEach(function(d) {
                    d[b].apply(d, a)
                })
            }
        }(L))
    }
}(window.Raphael);