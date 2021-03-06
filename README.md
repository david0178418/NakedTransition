# Naked Transition

Naked Transition is an image transition plugin for jQuery based on jqFancyTransitions by Ivan Lazarevic (http://workshop.rs/projects/jqfancytransitions/).  Where most image transition libraries are built coupled with a slider or gallery functionality (including jqFancyTransitions), Naked Transitions allows you to simply swap two images with neat transition. This is a first draft that basically surgically lifts the jqFancyTransition core functionality out of the library.

Priority 1: **MAJOR** refactoring from original author source

## Usage

###Required Markup
Naked Transtion works by replacing the background image of a div with another image that is transitioned in.  By the end of the transition, the background-image style property will be replaced with the new image.  As a result, the following css is required on the div:

background-image
position - absolute or relative
width - must be the width of the background image
height - must be the height of the background image

Additionally, the new image must be the same dimensions of the original image.

### Running function

davidgranado.com/demos/naked-transitions

`$('div-selector').nakedTransition(newImageLocation)`

newImageLocation - A string url of the new image to replace the image in the div.  If this form is used, a default animation will run.

`$('div-selector').nakedTransition(newImageLocation, params)`

newImageLocation - A string url of the new image to replace the image in the div.  If this form is used, a default animation will run.

params - an object containing the config options for the animation:

**strips** Integer - number of strips in animation. *(default 1)*

**stripSpeed** Integer - time required for each strip to complete animation in ms.*(default 750)*

**stripDelay** Integer - time between the start of one strip's animation and the start of the next strip's animation animation in ms. *(default 50)*

**stripFade** Boolean - determines if the strip will fade in as the animation progresses *(default true)*

**stripExtendFrom** String with possible values 'top', 'bottom', 'alternate', 'none' - describes where the stips will extend from. *(default none)*

**propagateFrom** String with possible values 'left', 'right', 'random', 'center', 'ends', 'fountainAlternate' - describes which strip will animate first and in which order the next animation will proceed. *(default fountainAlternate)*

**reveal** Boolean - if true, the strips will "wipe" the image into view.  Otherwise, each strip will be an independent piece of the image that moves into place *(default true)*

**complete** function to run once animation is completed. *(default undefined)*