/**
 * Naked Transition - jQuery plugin
 * @version: 0.1 (2011/09/02)
 * @requires jQuery v1.2.2 or later 
 * @author David Granado
 * Based on "jqFancyTransitions" by Ivan Lazarevic.  Find this at: http://www.workshop.rs/projects/jqfancytransitions
**/

(function($) {
	"use strict";
	var params,
		img,
		order,
		imgInc,
		inc,
		stripInt,
		imgBuffer,
		transitioning,
		element,
		$strip,
		order,
		stripsComplete;
	
	$.fn.nakedTransition = function(newImg, options){
		
		function init(el){
			var imgInc = 0,
				inc = 0,
				stripLeft = 0,
				stripWidth,
				odd = 1,
				position,
				gap,
				stripCss,
				tstripWidth;
			
			//return this if midtransition
			if(transitioning) {
				return this;
			}
			
			img = newImg,
			element = $(el),
			transitioning = true,
			stripsComplete = 0,
				
			params = $.extend({}, $.fn.nakedTransition.defaults, options);
			order = new Array(); // strips order array
			
			params.width = element.width();
			params.height = element.height();
			
			// width of strips
			stripWidth = (params.width / params.strips) | 0; 
			gap = params.width - stripWidth * params.strips; // number of pixels
			
			// creating bars and set their position
			for(var j=1; j < params.strips+1; j++) {
				if( gap > 0){
					tstripWidth = stripWidth + 1;
					gap--;
				}
				
				else {
					tstripWidth = stripWidth;
				}
				
				$strip = $('<div class="fancy-trans-strip" id="fancy-trans-strip' + j + '" style="width:' + tstripWidth + 'px; height:' + params.height + 'px; float: left; position: absolute;"></div>');
				
				element.append($strip);
				position = -stripLeft + 'px ';
				
				if( (params.stripExtendFrom == 'top' && params.reveal) ||
					(params.stripExtendFrom == 'bottom' && !params.reveal) ||
					(params.stripExtendFrom == 'alternate' && j % 2 == 0 && !params.reveal) ||
					(params.stripExtendFrom == 'alternate' && j % 2 == 1 && params.reveal)) {
					position += 'top';
				}
				
				else {
					position += 'bottom';
				}
				
				// positioning bars
				stripCss = {
					'background-position' : position, //pin background image to top or bottom depending on direction,
					'left' : stripLeft 
				};
				
				stripLeft += tstripWidth;
				
				if ( params.stripExtendFrom == 'bottom' ||
					(j % 2 == 0 && params.stripExtendFrom == 'alternate' )) {
					stripCss.bottom = 0;
				}
				
				$strip.css(stripCss);
				
				// bars order
				// fountain
				if(params.propagateFrom == 'center' || params.propagateFrom == 'ends') {
					order[ j - 1 ] = ((params.strips / 2) | 0) - ((( j / 2 ) | 0 ) * odd);
					order[ params.strips-1 ] = params.strips; // fix for odd number of bars
					odd *= -1;
				}
				else {
				// linear
					order[j-1] = j;
				}
			}
			
			imgBuffer = $('<img />').load(function() {
				transition(el);
			}).attr('src', img);
		};
		
		// transition
		function transition(el,direction){
			stripInt = setInterval(function() {
				strips(order[inc], el)  
			}, params.stripDelay);
			
			inc = 0;

			if(params.propagateFrom == 'random') {
				fisherYates (order);
			}
			
			if((params.propagateFrom == 'right' && order[0] == 1) ||
				params.propagateFrom == 'ends') {
				order.reverse();
			}
		};
		
		// strips animations
		function strips(itemId){
			var temp = params.strips,
				$fancyStrip = $('#fancy-trans-strip'+itemId),
				stripStartingCss = {
					'background-image' : "url('" + img +"')"
				},
				stripEndingCss = {};
			
			if (inc == temp) {
				clearInterval(stripInt);
				return;
			}
			
			if(params.stripFade) {
				stripStartingCss.opacity = 0;
				stripEndingCss.opacity = 1;
			}
			
			if(params.stripExtendFrom == 'none') {
				stripStartingCss.height = stripEndingCss.height = $fancyStrip.height();
			}
			else if(params.stripExtendFrom == 'curtain') {
				stripStartingCss.width = 0;
				stripEndingCss.width = $fancyStrip.width();
			}
			else {
				stripStartingCss.height = 0;
				stripEndingCss.height = params.height;
			}

			$fancyStrip.css(stripStartingCss)
				.animate(stripEndingCss, params.stripSpeed, null, swapBackground);
			
			inc++;
		};
		
		// shuffle array function
		function fisherYates(arr) {
			var i = arr.length;
			
			if ( i == 0 ){
				return false;
			}
			
			while ( --i ) {
				var j = Math.floor( Math.random() * ( i + 1 ) ),
					tempi = arr[i],
					tempj = arr[j];
				
				arr[i] = tempj;
				arr[j] = tempi;
			}
		}
		
		this.each (
			function(){ init(this); }
		);
		
		function swapBackground() {
			stripsComplete++;
			
			if(stripsComplete == params.strips) {
				element.css('background-image', 'url('+img+')');
				element.children('.fancy-trans-strip').remove();
				if(params.complete) {
					params.complete();
				}
				
				transitioning = false;
			}
		}
		
		return this;
	};

	// default values
	$.fn.nakedTransition.defaults = {
		strips: 1, // number of strips
		stripSpeed: 750, // time for strip to complete animation in ms
		stripFade: true, //determines if strip will fade in during animation
		stripDelay: 50, // delay beetwen strips in ms
		stripExtendFrom: 'none', //top, bottom, alternate, none
		reveal: true,
		
		
		propagateFrom: 'left', //left, right, ends, center, random 
		//animationType: 'curtain', //curtain, strip, fade
		
		
		position: 'alternate', // top, bottom, alternate, curtain
		//direction: 'fountainAlternate', // left, right, alternate, random, fountain, fountainAlternate
		effect: '', // curtain, zipper, wave
		complete: null //function to run once animation is completed.
	};
	
})(jQuery);