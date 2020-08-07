/**
 * This function is going to be executed only if the page has been loaded completely.
 */
$(document).ready(function () {
	
	/**
	 * Shows or hides the button that allows the user to go straight to the top of the page.
	 */
	$(window).scroll(function () {
		if ($(this).scrollTop() > 50) {
			$('#go-to-top-btn').fadeIn();
		} else {
			$('#go-to-top-btn').fadeOut();
		}
	});
	
	/**
	 * When pressed, this button allows the user to go straight to the top of the page.
	 */
	$('#go-to-top-btn').click(function () {
		$('body,html').animate({scrollTop: 0}, 800);
	});
})