
			jQuery(document).ready(function ($) {
				
				// creating a container variable to hold the 'UL' element. It uses method chaining.
				var container=$('div.slider')
											.css('overflow','hidden')
											.children('ul');
				
				// creating pagination variable which holds the 'UL' element.
				var pagicontainer=$('div.pagi-container').children('ul');
				
				/* 
				On the event of mouse-hover, 
					i) Change the visibility of Button Controls.
					ii) SET/RESET the "intv" variable to switch between AutoSlider and Stop mode.
				*/
				$('.gallery').hover(function( e ){
					$('.slider-nav').toggle();
					return e.type=='mouseenter'?clearInterval(intv):autoSlider();
				});
				
				// Creating the 'slider' instance which will set initial parameters for the Slider.
				var sliderobj= new slider(container,pagicontainer,$('.slider-nav'));
				/*
				This will trigger the 'setCurrentPos' and 'transition' methods on click of any button
				 "data-dir" attribute associated with the button will determine the direction of sliding.
				*/
				sliderobj.nav.find('button').on('click', function(){
					sliderobj.setCurrentPos($(this).data('dir'));
					sliderobj.transition();
				});
				
				/*
				This will trigger the 'setCurrentPos' and 'transition' methods on click of any Pagination Thumbnail icon.
				 "data-pgno" attribute associated with the Thumbnail icons will determine the value of 'current' variable.
				*/
				sliderobj.pagicontainer.find('li a').on('click', function(){
					sliderobj.setCurrentPos($(this).data('pgno'));
					sliderobj.transition();					
				});
				
				autoSlider(); // Calling autoSlider() method on Page Load.
				
				/* 
				This function will initialize the interval variable which will cause execution of the inner function after every 3 seconds automatically.
				*/
				function autoSlider()
				{
					return intv = setInterval(function(){
						sliderobj.setCurrentPos('next');
						sliderobj.transition();
					}, 3000);
				}
				
			});















/*
This method will initialize each slider instance.
Parameter are: -
------------------
1) container -> div.slider ul
2) pagicontainer -> div.pagi-container ul
3) nav -> #slider-nav
*/
function slider(container, pagicontainer, nav){
	this.container=container;
	this.pagicontainer=pagicontainer;
	this.nav=nav.hide(); // This will assign 'nav' from parameters to 'nav' of current slider instance. It uses method chaining.
	this.imgs=this.container.find('.slides'); // Returns jQuery object containing all matched elements.
    this.width=this.imgs[0].width; // Each image is Identical in Dimension.
	console.log('Value of width is : '+this.width);
	this.imgLen=this.imgs.length; // Returns the total number of sliding elements.
	console.log("Total no. of Items in the list are : "+this.imgLen);
	// Here we will add the "data-pgno" attribute to the Thumbnail Pagination.
	cnt=0;
	this.liArr = $(pagicontainer).find('li');// Returns jQuery object containing all matched LI elements of Pagination Thumbnails.
	this.liArr.each(function()
	{
        $anchor=$(this).find('a');
		$anchor.data('pgno',cnt);
		cnt++;
    });
	this.current=0; // Initialize the "current" counter.
	// Apply initial Styling to all Pagination Thumbnail Image Elements.
	this.pagicontainer.find('li a img').toggleClass('img-normal');
	// Apply CSS to "First" pagination element in the list.
	this.pagicontainer.find('li:nth-child(1) a').toggleClass("pagi-selected");	
	this.pagicontainer.find('li:nth-child(1) a img').toggleClass("img-selected");
}

// This method will apply the needed animation and displacement.

slider.prototype.transition=function(coords){
	this.container.animate({
		'margin-left': coords || -(this.current*this.width) // First element is multiplied by Zero.
	},500);
	// Remove CSS from Rest other pagination element in the list.
	this.pagicontainer.find('li a').removeClass("pagi-selected");
	this.pagicontainer.find('li a img').removeClass("img-selected");
	
	// Apply CSS to current pagination element in the list.
	this.pagicontainer.find("li:nth-child("+(this.current+1)+") a").toggleClass("pagi-selected");
	this.pagicontainer.find("li:nth-child("+(this.current+1)+") a img").toggleClass("img-selected");
	
	
};

// This method will set the "current" counter to next position.
/*
Parameters are:-
---------------
1) dir -> It can be either 'prev' or 'next' or else a number denoting slides.
*/
slider.prototype.setCurrentPos=function(dir){
	var pos=this.current;
	console.log('Value of this.value is : '+dir);
	if(isNaN(dir))
	{
		pos+= ~~(dir=='next') || -1; // You can use alternate "Math.floor()" method instead of double tilde (~~) operator.
		this.current=(pos<0)?this.imgLen-1: pos%(this.imgLen);
	}
	else
		this.current=Number(dir);
	console.log(this.current);
	
};
