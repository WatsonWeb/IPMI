/* Document Ready */
$(function () {
	/* Mobile Menu */
	$(".mobile-menu").click(function (event) {
		event.stopPropagation();
	});

	$(".mobile-menu-button").click(function () {
		$(".mobile-menu-wrap").addClass("open");
	});

	$(".mobile-menu-wrap, .mobile-close-button").click(function () {
		$(".mobile-menu-wrap").removeclass("open");
	});

	/* Footer */
	$(".footer-open-button").click(function () {
		$(".footer").addClass("open");
	});

	$(".footer-open-button").click(function () {
		$(".footer").removeClass("open");
	});
});
