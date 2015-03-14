jQuery(document).ready(function($){
	var tabItems = $('.cd-tabs-navigation a'),
		tabContentWrapper = $('.cd-tabs-content');

	$('.cd-tab-link').on('click', function(event){
		event.preventDefault();
		changeTab($(this).data("cd-tab"));
	});

	$(function() {
		changeTab(window.location.hash.substring(1));
	})
	window.onhashchange = function() {
		changeTab(window.location.hash.substring(1));
	}

	function changeTab(tabName) {
		var selectedItem = $(".cd-tabs-navigation a[href=#" + tabName + "]");
		if( !selectedItem.hasClass('selected') ) {
			var selectedTab = selectedItem.data('content'),
				selectedContent = tabContentWrapper.find('li[data-content="'+selectedTab+'"]'),
				slectedContentHeight = selectedContent.innerHeight();
			
			tabItems.removeClass('selected');
			selectedItem.addClass('selected');
			selectedContent.addClass('selected').siblings('li').removeClass('selected');
			//animate tabContentWrapper height when content changes 
			tabContentWrapper.animate({
				'height': slectedContentHeight
			}, 200);
		}
	}


	//hide the .cd-tabs::after element when tabbed navigation has scrolled to the end (mobile version)
	checkScrolling($('.cd-tabs nav'));
	$(window).on('resize', function(){
		checkScrolling($('.cd-tabs nav'));
		tabContentWrapper.css('height', 'auto');
	});
	$('.cd-tabs nav').on('scroll', function(){ 
		checkScrolling($(this));
	});

	function checkScrolling(tabs){
		var totalTabWidth = parseInt(tabs.children('.cd-tabs-navigation').width()),
		 	tabsViewport = parseInt(tabs.width());
		if( tabs.scrollLeft() >= totalTabWidth - tabsViewport) {
			tabs.parent('.cd-tabs').addClass('is-ended');
		} else {
			tabs.parent('.cd-tabs').removeClass('is-ended');
		}
	}
});