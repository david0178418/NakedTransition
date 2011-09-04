/**
 * Naked Transition - jQuery plugin
 * @version: 0.1 (2011/09/02)
 * @requires jQuery v1.2.2 or later 
 * @author David Granado
 * Based on "jqFancyTransitions" by Ivan Lazarevic.  Find this at: http://www.workshop.rs/projects/jqfancytransitions
**/

(function($) {
	var params,
		level,
		img,
		order,
		imgInc,
		inc,
		stripInt,
		imgInt,
		imgBuffer,
		transitioning,
		element,
		$strip,
		completeStrips,
		stripStartingCss,
		stripEndingCss;
	
	$.fn.nakedTransition = $.fn.nakedTransition = function(newImg, options){
	
	init = function(el){
		element = $(el);
		
		//return false if midtransition
		if(transitioning) {
			return false;
		}
		
		transitioning = true;
		img = newImg;
		params = $.extend({}, $.fn.nakedTransition.defaults, options);
		order = new Array(); // strips order array
		imgInc = 0;
		inc = 0;
		stripsComplete = 0;
		
		params.width = element.width();
		params.height = element.height();
		

		if(params.effect == 'zipper'){ params.direction = 'alternate'; params.position = 'alternate'; }
		if(params.effect == 'wave'){ params.direction = 'alternate'; params.position = 'top'; }
		if(params.effect == 'curtain'){ params.direction = 'alternate'; params.position = 'curtain'; }

		// width of strips
		stripWidth = (params.width / params.strips) | 0; 
		gap = params.width - stripWidth*params.strips; // number of pixels
		stripLeft = 0;
		
		odd = 1;
		// creating bars
		// and set their position
		for(var j=1; j < params.strips+1; j++){
			
			if( gap > 0){
				tstripWidth = stripWidth + 1;
				gap--;
			} else {
				tstripWidth = stripWidth;
			}
			
			$strip = $("<div class='fancy-trans-strip' id='fancy-trans-strip"+j+"' style='    width:"+tstripWidth+"px; height:"+params.height+"px; float: left; position: absolute;'></div>");

			element.append($strip);
							
			// positioning bars
			$strip.css({
				//TODO Examine for ability to add 'reveal' vs 'pieces' option.  Currently set to 'pieces'
				'background-position': -stripLeft +'px ' + (params.position == 'top' ? 'bottom' : 'top'), //pin background image to top or bottom depending on direction
				'left' : stripLeft 
			});
			
			stripLeft += tstripWidth;
			
			if(params.position == 'bottom')
				$strip.css( 'bottom', 0 );
			
			if (j%2 == 0 && params.position == 'alternate')
				$strip.css( 'bottom', 0 );
			
			// bars order
				// fountain
				if(params.direction == 'fountain' || params.direction == 'fountainAlternate') { 
					order[j-1] = (params.strips/2) | 0 - (((j/2) | 0 ) * odd);
					order[params.strips-1] = params.strips; // fix for odd number of bars
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
		
		if(params.pause == true) return;
		
		stripInt = setInterval(function() { $.strips(order[inc], el)  }, params.stripDelay);
		
		inc = 0;

		if(params.direction == 'random')
			$.fisherYates (order);
			
		if((params.direction == 'right' && order[0] == 1) 
			|| params.direction == 'alternate'
			|| params.direction == 'fountainAlternate')
				order.reverse();
	};


	// strips animations
	$.strips = function(itemId){

		temp = params.strips;
		if (inc == temp) {
			clearInterval(stripInt);
			return;
		}

		stripStartingCss = {
			'background-image' : "url('" + img +"')"
		};

		stripEndingCss = {};

		if(params.stripFade) {
			
			stripStartingCss.opacity = 0;
			stripEndingCss.opacity = 1;
		}
		
		if(params.position == 'curtain'){
			currWidth = $('#fancy-trans-strip'+itemId).width();
			
			stripStartingCss.width = 0;
			stripEndingCss.width = $('#fancy-trans-strip'+itemId).width();
		} 
		
		else {
			stripStartingCss.height = 0;
			stripEndingCss.height = params.height;
		}

		$('#fancy-trans-strip'+itemId).css(stripStartingCss)
			.animate(stripEndingCss, params.stripSpeed, null, swapBackground);
		
		inc++;
	};
	
	// shuffle array function
	$.fisherYates = function(arr) {
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
		strips: 15, // number of strips
		stripSpeed: 500, // time for strip to complete animation in ms
		stripFade : true, //determines if strip will fade in during animation
		stripDelay: 50, // delay beetwen strips in ms
		position: 'alternate', // top, bottom, alternate, curtain
		direction: 'fountainAlternate', // left, right, alternate, random, fountain, fountainAlternate
		effect: '', // curtain, zipper, wave
		complete: null //function to run once animation is completed.
	};
	
})(jQuery);
