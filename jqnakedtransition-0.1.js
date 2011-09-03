/**
 * jqNakedTransition - jQuery plugin
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
		element,
		completeStrips;
	
	$.fn.jqNakedTransition = $.fn.jqNakedTransition = function(options){
	
	init = function(el){
		element = $(el);
		
		//return false if midtransition
		if(element.children('.fancy-trans-strip').length) {
			return false;
		}
		
		if(typeof options === 'string') {
			options = { newImage : options };
		}
		
		params = $.extend({}, $.fn.jqNakedTransition.defaults, options);
		order = new Array(); // strips order array
		imgInc = 0;
		inc = 0;
		stripsComplete = 0;
		
		
		
		img = params.newImage;
		params.width = element.width();
		params.height = element.height();
		

		if(params.effect == 'zipper'){ params.direction = 'alternate'; params.position = 'alternate'; }
		if(params.effect == 'wave'){ params.direction = 'alternate'; params.position = 'top'; }
		if(params.effect == 'curtain'){ params.direction = 'alternate'; params.position = 'curtain'; }

		// width of strips
		stripWidth = parseInt(params.width / params.strips); 
		gap = params.width - stripWidth*params.strips; // number of pixels
		stripLeft = 0;
		
		odd = 1;
		// creating bars
		// and set their position
		for(j=1; j < params.strips+1; j++){
			
			if( gap > 0){
				tstripWidth = stripWidth + 1;
				gap--;
			} else {
				tstripWidth = stripWidth;
			}
			
			element.append("<div class='fancy-trans-strip' id='fancy-trans-strip"+j+"' style='width:"+tstripWidth+"px; height:"+params.height+"px; float: left; position: absolute;'></div>");
							
			// positioning bars
			$('#fancy-trans-strip'+j).css({ 
				'background-position': -stripLeft +'px ' + (params.position == 'top' ? 'bottom' : 'top'), //pin background image to top or bottom depending on direction
				'left' : stripLeft 
			});
			
			stripLeft += tstripWidth;
			
			if(params.position == 'bottom')
				$('#fancy-trans-strip'+j).css( 'bottom', 0 );
			
			if (j%2 == 0 && params.position == 'alternate')
				$('#fancy-trans-strip'+j).css( 'bottom', 0 );
			
			// bars order
				// fountain
				if(params.direction == 'fountain' || params.direction == 'fountainAlternate') { 
					order[j-1] = parseInt(params.strips/2) - (parseInt(j/2)*odd);
					order[params.strips-1] = params.strips; // fix for odd number of bars
					odd *= -1;
				} 
				else {
				// linear
					order[j-1] = j;
				}
		}
		
		imgBuffer = $('<img />').load(function() {
			$.transition(el);
		}).attr('src', img);
		
	};

	// transition
	$.transition = function(el,direction){
		
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
		
		if(params.position == 'curtain'){
			currWidth = $('#fancy-trans-strip'+itemId).width();
			$('#fancy-trans-strip'+itemId).css({ width: 0, opacity: 0, 'background-image': 'url('+img+')' });
			$('#fancy-trans-strip'+itemId).animate({ width: currWidth, opacity: 1 }, 500, null, swapBackground);
		} else {
			$('#fancy-trans-strip'+itemId).css({ height: 0, opacity: 0, 'background-image': 'url('+img+')' });
			$('#fancy-trans-strip'+itemId).animate({ height: params.height, opacity: 1 }, 500, null, swapBackground);
		}
		
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
		}
	}
	
	return this;
};

	// default values
	$.fn.jqNakedTransition.defaults = {
		strips: 15, // number of strips
		stripDelay: 50, // delay beetwen strips in ms
		position: 'alternate', // top, bottom, alternate, curtain
		direction: 'fountainAlternate', // left, right, alternate, random, fountain, fountainAlternate
		effect: '', // curtain, zipper, wave
		newImage: '',
		complete: null //function to run once animation is completed.
	};
	
})(jQuery);
