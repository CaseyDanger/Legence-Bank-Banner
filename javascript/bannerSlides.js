/**
 * jsBanner library v1.0
 *
 * Includes jQuery
 * http://jquery.com/
 *
 * Original Author: Patrick Welborn
 *
 * Co-author: Pedro Canterini (changes, cleanup and documentation)
 * Date: Sep 4 2012
 *
 * COPYRIGHT © 2012 BANCVUE, LTD ALL RIGHTS RESERVED
 * https://www.bancvue.com/
 */


var banner; //banner variable with global scope

$j.extend(jQuery.easing, {
	easeInOutQuart: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
			return -c/2 * ((t-=2)*t*t*t - 2) + b;
		}
});

/**
 * Banner setup is called from global.js
 * Don't forget to call this or you will just
 * get the static content of the first slide
 */
function setupBanner(){
	
	/**
	 * @constructor
	 * @type {Banner}
	 */
	banner = new Banner({
		banner: '#banner', // String identifying banner id
		bannerPreloader: '#bannerPreloader', // String identifying banner preloader id
		bannerNavigation: '#bannerNavigation .button', // String identifying banner navigation buttons
		bannerPlayback: '#bannerPlayback .button', // String identifying banner playback buttons
		bannerSlides: '#bannerSlides .slide', // String identifying banner slides
		lazyLoadNextSlide: false, //if set to true will preload the images for the next slide once it is done with the current
		duration: 6000, // Integer defining duration of slide playback in milliseconds
		autoPlay: true, // Boolean indicating whether slide show should auto play
		shuffle: false, // Shuffle slides and nav
		navEvents: false // Runs buttonMouseOver and buttonMouseDown (on the bannerNavigation buttons) on slidechange automatically
	});

	banner.initialize(); //INIT
}

/**
 * BannerSlides controls all events related to slides and navigation
 */
function BannerSlides(){

	var slides = $j('#bannerSlides .slide');
	var bannerNavigation = $j('#bannerNavigation');
	var buttons = $j('#bannerNavigation .button');
	var browser = $j.browser;
	var isIE8 = (browser.msie && browser.version <= "8.0");
	var maskDuration = 800;
	var fadeDuration = 1000;
	var maskDefaultWidth = '1500px'
	var maskDefaultHeight = '1000px'
	var maskDefaultX = '-250px'
	var maskDefaultY = '-200px'
	var maskTargDim = '6000px';
	var maskTargPos = '-1240px';

	/**
	 * Initializes the banner
	 * Executes before the image preloader starts
	 */
	this.initialize = function(){
		bannerNavigation.removeClass('hide'); // show nav
		slides.addClass('hide'); // hides content while assets are loading
	};

	/**
	 * imagesReady is called when all images for a certain slide
	 * are done loadind. There is no need to append them 
	 * since background-image is set to the html target
	 */
	this.imagesReady = function(images){
		// If you need to target this slide use:
		// console.log($j('#bannerSlides .slide').eq(images.slideID));
		$j('.slideContent').show(); // brings content back after assets are loaded.

	};
	
	/**
	 * Triggered when the user rolls over a navigation button
	 * @param {Array} data Use data.buttonContainer to target the container
	 * and data.buttonIndex to target the button index
	 */
	this.mouseOver = function(data){
		//console.log($j(data.buttonContainer).eq(data.buttonIndex));
	};
	
	/**
	 * Triggered when the user rolls out of a navigation button
	 * @param {Array} data Use data.buttonContainer to target the container
	 * and data.buttonIndex to target the button index
	 */
	this.mouseOut = function(data){
		//console.log($j(data.buttonContainer).eq(data.buttonIndex));
	};
	
	/**
	 * Triggered when the user clicks a navigation button
	 * @param {Array} data Use data.buttonContainer to target the container
	 * and data.buttonIndex to target the button index
	 */
	this.mouseDown = function(data){
		//console.log($j(data.buttonContainer).eq(data.buttonIndex));
		//console.log('mouseDown'+data.buttonIndex);
	};
	
	/**
	 * Triggered when a new slide is set and runs before slideExit
	 * @param {int} index current slide index
	 */
	this.slideEnter = function(index){
		buttons.eq(index).addClass('active');
		$j('#bannerMask')
			.css({
				'width' : maskTargDim,
				'height' : maskTargDim,
				'top' : maskTargPos,
				'left' : maskTargPos
			})
			.stop()
			.animate({
				'width' : maskDefaultWidth,
				'height' : maskDefaultHeight,
				'top' : maskDefaultY,
				'left' : maskDefaultX
			},{
				duration: maskDuration,
				easing: 'easeInOutQuart',
				complete: function() {
					slides.eq(index)
						.removeClass('hide')
						.css({ 
							'opacity' : 0
						})
						.stop()
						.animate({ 
							'opacity' : 1
						},{
							duration: fadeDuration
						});
					$j('#bannerMask')
						.css({
							'width' : maskDefaultWidth,
							'height' : maskDefaultHeight,
							'top' : maskDefaultY,
							'left' : maskDefaultX
						})
						.stop()
						.animate({
							'width' : maskTargDim,
							'height' : maskTargDim,
							'top' : maskTargPos,
							'left' : maskTargPos
						},{
							duration: maskDuration,
							easing: 'easeInOutQuart',
							complete: function() { $j('.learnMore').eq(index).css({ 'z-index' : 10 }) }
						});
				}
			});

	};
	
	/**
	 * Triggered when a new slide is set and runs after slideEnter
	 * @param {int} index current slide index
	 */
	this.slideExit = function(index){
		buttons.eq(index).removeClass('active');
		slides.eq(index)
			.removeClass('hide')
			.css({
				'opacity' : 1
			})
			.stop()
			.animate({
				'opacity' : 0
			},{
				duration: fadeDuration,
				complete:  function() { $j(this).addClass('hide') }
			});
	};
}