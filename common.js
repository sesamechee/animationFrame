var gCurrentPage = null;
var IE9down = false;
var IpadFlag = false;
var MobileFlag = false;

function common_init(){
	
	new responsive();
	
	menuControl();
	$('select').selectric({
		arrowButtonMarkup: '<b class="button icon-icoArrowDown"></b>',
	});
	
	$('.inputBox').each(function(){
		inputBox = new InputHints();
		inputBox.init( $(this) );
	});
	
	
	//form
	$('.checkRow input[type=checkbox]').bind('change', function(){
		if( $(this).is(':checked') ){
			$(this).parents('.checkRow').find('.checkbox').addClass('checked');
		}else{
			$(this).parents('.checkRow').find('.checkbox').removeClass('checked');
		}
	});
	
	$(window).on('load', function(){
		setTimeout(function(){
			hideLoading();
			$(window).trigger('scroll');
			$('.pageBanner').addClass('play');
		},2000);
	});
	
	$(window).bind('resize', function(){
		resize();
	});
	
	$(window).bind('scroll', function(){
		var _headerHeight = ($('body').hasClass('desktop')) ? $('.headerWrapper').height() : $('.mobileHeader').height();
		
		if( $('body').hasClass('desktop') ){
			if( $(window).scrollTop() >= $('.headerWrapper .logo').outerHeight() ){
				$('body').addClass('smallHeader');
			}else{
				$('body').removeClass('smallHeader');
			}
		}
		//Animation
		$('.sectionWrapper').each(function(){
			if( $(window).scrollTop() + $(window).height() > $(this).offset().top ){
				$(this).addClass('play');
			}
		});
		
		//footer backtop
		if( $(window).scrollTop() + $(window).height() > $('.footerWrapper').offset().top ){
			$('.footerWrapper .btnBackTop').removeClass('fixed');
		}else{
			$('.footerWrapper .btnBackTop').addClass('fixed');
		}
		if( $(window).scrollTop() > _headerHeight ){
			$('.footerWrapper .btnBackTop').addClass('active');
		}else{
			$('.footerWrapper .btnBackTop').removeClass('active');
		}
		
	});
	
	$(window).bind('responsive',function(){
		resetMenu();
	});
	
}

function detectBroswer(){
	var ua = window.navigator.userAgent.toLowerCase();
	var ver = window.navigator.appVersion.toLowerCase();
	var gHasTouch = 'ontouchstart' in window;

	if( !gHasTouch ) {
		$('body').addClass('noTouch');
	}

	if (ua.indexOf("msie") != -1){
		if (ver.indexOf("msie 6.") != -1){
			IE9down =true
		}else if (ver.indexOf("msie 7.") != -1){
			IE9down =true
		}else if (ver.indexOf("msie 8.") != -1){
			IE9down =true
		}else if (ver.indexOf("msie 9.") != -1){
			IE9down =true
		}else if (ver.indexOf("msie 10.") != -1){
			IE9down =false
		}else{
			IE9down =false
		}
	}

	if (ua.match(/(iphone)/) || ua.match(/(ipad)/) || ua.match(/(ipod)/) || ua.match(/(android)/) )	{
		MobileFlag = true;
	}

	if (ua.match(/(ipad)/) )	{
		IpadFlag = true;
	}

}

function showLoading(){
	$('.loading').show();
	setTimeout(function(){
		$('.loading').addClass('in');
		setTimeout(function(){
			$('.loading .imgLoading').addClass('active');
		},1000);
	},100);
}

function hideLoading(){
	$('.loading .imgLoading').removeClass('active');
	setTimeout(function(){
		$('.loading').removeClass('in');
		$('.loading').addClass('out');
		setTimeout(function(){
			$(".loading").hide();
			$('.loading').removeClass('out');
		},300);
	},300);
}

var _dimBgTimer;
function dimBgShow(){
	$('.dimBg').show();
	clearTimeout(_dimBgTimer);
	_dimBgTimer = setTimeout(function(){
		$('.dimBg').addClass('in');
	},100);
}

function dimBgHide(){
	$('.dimBg').removeClass('in');
	clearTimeout(_dimBgTimer);
	_dimBgTimer = setTimeout(function(){
		$(".dimBg").hide();
	},300);
}

function resetMenu(){
	$('body').removeClass('menuOpen');
	$('body').removeClass('smallHeader');
	$('body').removeClass('searchOpen');
	$('.headerWrapper').removeClass('in');
	$('.dimBg').attr('style','');
	$('.content').attr('style','');
	$('.headerWrapper').attr('style','');
	$('.headerWrapper .subMenu').attr('style','');
	$('.headerWrapper .menuItem').removeClass('active');
	dimBgHide();
}

function menuControl(){
	var _isSlideOpen = false;
	var _menuTimer;
	
	$('.mobileHeader .menuBtn').bind('click', function(){
		if( $('body').hasClass('menuOpen') ){
			$('body').removeClass('menuOpen');
			$('.headerWrapper').removeClass('in');
			clearTimeout( _menuTimer );
			_menuTimer = setTimeout(function(){
				$(".headerWrapper").hide();
			},500);
			dimBgHide();
		}else{
			$('body').addClass('menuOpen');
			$('body').removeClass('searchOpen');
			$('.headerWrapper').show();
			clearTimeout( _menuTimer );
			_menuTimer = setTimeout(function(){
				$('.headerWrapper').addClass('in');
			},100);
			$('.content').css('min-height',$(window).height());
			$('.headerWrapper').css('min-height',$(window).height());
			dimBgShow();
		}
	});
	$('.dimBg').bind('click', function(){
		$('body').removeClass('menuOpen');
		$('body').removeClass('searchOpen');
		dimBgHide();
	});
	
	if( gCurrentPage != null ){
		$('.header .menuList .menuItem').eq(gCurrentPage).addClass('current');
	}
	
	$('.headerWrapper .menuItem').on({
		'mouseover': function(){
			if( $('body').hasClass('desktop') ){
				if( $(this).find('.subMenu').length > 0 ){
					clearTimeout( _menuTimer );
					dimBgShow();
					if( _isSlideOpen ){
						$('.headerWrapper .subMenu').hide();
						$(this).find('.subMenu').show();
					}else{
						_isSlideOpen = true;
						$(this).find('.subMenu').stop().slideDown(500);
					}
				}else{
					clearTimeout( _menuTimer );
					_isSlideOpen = false;
					$('.headerWrapper .subMenu').stop().slideUp(500);
					dimBgHide();
				}
			}
		},
		'mouseleave': function(){
			if( $('body').hasClass('desktop') ){
				clearTimeout( _menuTimer );
				_menuTimer = setTimeout(function(){
					_isSlideOpen = false;
					$('.headerWrapper .subMenu').stop().slideUp(500);
					dimBgHide();
				},1000);
			}
		},
		'click': function(){
			if( ! $('body').hasClass('desktop') ){
				if( $(this).find('.subMenu').length > 0 ){
					$(this).toggleClass('active');
					$(this).find('.subMenu').stop().slideToggle(500);
				}
			}
		}
	});
	
	$('.headerWrapper .searchItem .btnSearch').bind('click', function(){
		if( $('.headerWrapper .searchItem input').val() != '' ){
			window.location.href = 'search_result.php?search=' + $('.headerWrapper .searchItem input').val();
		}
	});
	
	$('.mobileHeader .btnSearch').bind('click', function(){
		if( !$('body').hasClass('desktop') ){
			if( $('body').hasClass('searchOpen') ){
				$('body').removeClass('searchOpen');
				dimBgHide();
			}else{
				$('body').addClass('searchOpen');
				dimBgShow();
			}
		}
	});
	
	$('.headerWrapper .searchItem .btnClose').bind('click', function(){
		$('body').removeClass('searchOpen');
		dimBgHide();
    });
	
	$('.headerWrapper .searchItem input').keypress(function(event) {
        if (event.keyCode == 13 && $('.headerWrapper .searchItem input').val() != '' ){
			window.location.href = 'search_result.php?search=' + $('.headerWrapper .searchItem input').val();
        }
    });
	
	$('.mobileHeader .searchItem input').keypress(function(event) {
        if (event.keyCode == 13 && $('.mobileHeader .searchItem input').val() != '' ){
			window.location.href = 'search_result.php?search=' + $('.mobileHeader .searchItem input').val();
        }
    });
	
}

function resize(){
	if( !$('body').hasClass('desktop') ){
		$('.content').css('min-height',$(window).height());
		$('.headerWrapper').css('min-height',$(window).height());
	}
}

function scrollTo( target ){
	if( $(target).length > 0 ){
		$('html, body').animate({
			scrollTop: $(target).offset().top
		});
	}
}

function popupBox( target , config ) {
	var _settings = {
		items: {
			src: target,
			type: 'inline'
		},
		showCloseBtn : true,
		fixedContentPos : true,
		mainClass: 'mfp-fade',
		removalDelay: 300,
		fixedBgPos : true,
		closeOnBgClick: true,
		closeMarkup : '<button title="%title%" class="mfp-close icon-icoClose"></button>',
		callbacks:{
			open: function(){

			}
		}
	};

	$.extend(_settings, config);
	$.magnificPopup.open(_settings);
}

function alertMsg( msg , config ) {
	$('.alertPopup .popupContent').html(msg);
	popupBox( $('.alertPopup') , config );
}

function videoPop( youtubeID , config ) {
	var _settings = {
		callbacks:{
			open: function(){
				$('.videoPopup .videoWrapper').html('<iframe width="100%" height="100%" src="https://www.youtube.com/embed/'+ youtubeID +'?rel=0&autoplay=1&wmode=transparent" frameborder="0" allowfullscreen></iframe>');
			},
			close: function(){
				$('.videoPopup .videoWrapper').html('');
			}
		}
	};
	
	$.extend(_settings, config);
	popupBox( $('.videoPopup'), _settings );
}



/******************************** RESPONSIVE *******************************/
if ($.browser.msie && parseInt($.browser.version, 10) <= 8) {
	jQuery.fx.interval = 1000 / 30;
	var oldIE = true;
} else {
	jQuery.fx.interval = 1000 / 60;
	var oldIE = false;
}

var layout;

function responsive() {
	var _self = this;

	_self.layoutSize = [0, 760 , 1200];
	_self.layout = ['mobile', 'tablet' , 'desktop'];

	_self.window = $(window);
	_self.body = $('body');
	_self.current = _self.layout[_self.layout.length - 1];
	if (oldIE) {
		_self.changeClass(_self.layout[1]);
	} else {
		_self.init();
	}
}
responsive.prototype.init = function () {
	var _self = this;

	_self.changeClass(_self.layout[_self.checkSize()]);
	_self.addEvent();
}
responsive.prototype.addEvent = function () {
	var _self = this;

	_self.window.on('resize', function () {
		_self.changeClass(_self.layout[_self.checkSize()]);
	});
}
responsive.prototype.checkSize = function () {
	var _self = this;

	var _layout = 0;

	for (var i = 0; i < _self.layoutSize.length; i++) {
		if (_self.layoutSize[i] > _self.window.width()) {
			break;
		} else {
			_layout = i;
		}
	}
	return _layout;
}
responsive.prototype.changeClass = function (className) {
	var _self = this;

	if (!_self.body.hasClass(className)) {
		for (var i = 0; i < _self.layoutSize.length; i++) {
			_self.body.removeClass(_self.layout[i]);
		}
		_self.body.addClass(className);
		layout = className;
		$(document).trigger('responsive', className);
	}
}


/******************************** INPUT HINTS *******************************/

/**
*
* Copyright 2012, Pixopunch
* http://www.pixopunch.com/
*
* {Class}
* InputHints
* -destroy():void
* -init(pTarget, pParam_obj):void
*
* {Events}
*
*/

InputHints.prototype.mInputHints = null;

function InputHints()
{
}

InputHints.prototype.destroy = function()
{
	this.mInputHints.children(".hints").unbind("click");
	this.mInputHints.children("input, textarea").unbind("focus");
	this.mInputHints.children("input, textarea").unbind("blur");
	
	this.mInputHints = null;
}

InputHints.prototype.init = function(pTarget, pParam_obj)
{
	var _self = this;
	
	this.mInputHints = pTarget;
	
	this.mInputHints.children(".hints").bind("click", function(){_self.doFocusBegin()});
	this.mInputHints.children("input, textarea").bind("focus", function(){_self.focusBegin()});
	this.mInputHints.children("input, textarea").bind("blur", function(){_self.focusEnd()});
	
	this.mInputHints.children(".hints").css("display", "none");
	this.focusEnd();
}

InputHints.prototype.doFocusBegin = function()
{
	this.mInputHints.children("input, textarea").focus();
	this.focusBegin(this.mInputHints.children("input, textarea"));
}

InputHints.prototype.focusBegin = function()
{
	this.mInputHints.children(".hints").css("display", "none");
}

InputHints.prototype.focusEnd = function()
{
	if (this.mInputHints.children("input, textarea").val() == "")
	{
		this.mInputHints.children(".hints").css("display", "block");
	}
}



/************************* IMAGE SLIDER ****************************/
var imgSlider = function (container, config) {
	var _self = this;

	_self.defaults = {
		speed: 300,
		drag: true,
		loop: true,
		autoHeight: false,
		autoPlay: false,
		autoPlaySpeed: 5000,
		slidesRow: 1,
		vertical: false,
		fade: false,
		thumbnailCarousel: true,
		afterSlideCallback: function(){
		}
	}
	$.extend(_self.defaults, config);

	_self.container = container;

	_self.init();
}

imgSlider.prototype.init = function () {
	var _self = this;

	_self.sliderContainer = _self.container.find('.sliderContainer');
	_self.slider = _self.container.find('.slider');
	_self.slides = _self.container.find('.slides');
	_self.slides.hide();

	_self.autoPlayTimer;
	_self.current = 0;
	_self.thumbnailMove = 0;
	_self.isAnimating = false;
	_self.destroyed = false;
	_self.dragging = false;

	// create bullet
	if( _self.container.find('.sliderBullet').length ) {
		_self.container.find('.sliderBullet').html('');
		for (var i = 0; i < _self.slides.length; i++) {
			var _bullet = '<a href="#"><span class="sliderBulletBg"></span></a>';
			_self.container.find('.sliderBullet').append(_bullet);
		}
	}
	_self.bullet = _self.container.find('.sliderBullet a');

	// create thumbnail
	_self.thumbnailInit();

	// check images loaded
	var _count = _self.slides.find('img').length;
	if(_count <= 0) {
		_self.contentLoaded();
	} else {
		_self.slides.find('img').each(function() {
			$("<img/>").load(function() {
				if( !--_count ) {
					// callback function here
					_self.contentLoaded();
				}
			}).attr("src", $(this).attr('src'));
		});
	}

	if (_self.slides.length > 1) _self.bindEvent();

	$(window).on('resize', function () {
		if( _self.destroyed ) return;
		_self.thumbnailMove = 0;
		_self.container.find('.sliderThumbnailInner').css({'margin-left': ''});
		_self.checkThumbnailMove();

		_self.slideLeft = _self.sliderContainer.width();
		_self.slidesOnReady();
		_self.autoPlay();
	});

	_self.autoPlay();
}

imgSlider.prototype.contentLoaded = function () {
	var _self = this;

	_self.slideLeft = _self.sliderContainer.width();
	_self.setCurrent();
	_self.slidesOnReady();
	_self.setSliderHeight();
	_self.container.addClass('loaded');
	_self.sliderContainer.addClass('ready');
	if (_self.slides.length <= 1) _self.container.find('.slides').css('cursor', 'default');
}

imgSlider.prototype.bindEvent = function () {
	var _self = this;
	var startPos = 0;

	if (_self.defaults.drag) _self.touchEvent();

	_self.container.on('click', '.sliderBullet a, .sliderThumbnailItem', function (e) {
		e.preventDefault();

		if (!_self.isAnimating && $(this).index() != _self.current) {
			_self.isAnimating = true;
			var _dir = ($(this).index() > _self.current) ? 'next' : 'prev';
			_self.transition(_dir, $(this).index());
		}
	});

	_self.container.find('.sliderBtnPrev').on('click', function (e) {
		e.preventDefault();

		if (!_self.isAnimating) {
			_self.isAnimating = true;
			_self.transition('prev');
		}
	});

	_self.container.find('.sliderBtnNext').on('click', function (e) {
		e.preventDefault();

		if (!_self.isAnimating) {
			_self.isAnimating = true;
			_self.transition('next');
		}
	});

	_self.container.find('.sliderThumbnailPrev').on('click', function (e) {
		e.preventDefault();

		if (!_self.isAnimating) {
			_self.isAnimating = true;
			_self.thumbnailTransition('prev');
		}
	});

	_self.container.find('.sliderThumbnailNext').on('click', function (e) {
		e.preventDefault();

		if (!_self.isAnimating) {
			_self.isAnimating = true;
			_self.thumbnailTransition('next');
		}
	});
	
	_self.container.find('a').on('click', function (e) {
		if (_self.dragging) {
			e.preventDefault();
		}
		_self.dragging = false;
	});
	
}

imgSlider.prototype.setCurrent = function () {
	var _self = this;

	_self.bullet.removeClass('active');
	_self.bullet.eq(_self.current).addClass('active');
	_self.container.find('.sliderThumbnailItem').removeClass('active');
	_self.container.find('.sliderThumbnailItem').eq(_self.current).addClass('active');
	_self.slides.removeClass('on');
	_self.slides.eq(_self.current).addClass('on').css({
		'left': 0
	});

	if (!_self.defaults.loop) {
		_self.container.find('.sliderBtnPrev').show();
		_self.container.find('.sliderBtnNext').show();
		if (_self.current == 0) {
			_self.container.find('.sliderBtnPrev').hide();
		} else if (_self.current + 1 >= _self.slides.length) {
			_self.container.find('.sliderBtnNext').hide();
		}
	}else if( _self.container.find('.slides').length > 1 ){
		_self.container.find('.sliderBtnPrev').show();
		_self.container.find('.sliderBtnNext').show();
	}
}

imgSlider.prototype.slidesOnReady = function () {
	var _self = this;

	_self.resetSlidesCSS();
	_self.slides.css({
		'height': '',
		'display': ''
	});
	_self.setSliderHeight();

	if (_self.slides.length == 1) {

		_self.bullet.hide();
		_self.container.find('.sliderBtnPrev').hide();
		_self.container.find('.sliderBtnNext').hide();

	} else {
		var leftSlidePos = (_self.current - 1 < 0) ? _self.slides.length - 1 : _self.current - 1;

		if (_self.defaults.vertical) {

			_self.slideLeft = _self.sliderContainer.height();

			_self.slides.eq(_self.current).css({
				'top': 0
			});
			_self.slides.eq((_self.current + 1) % _self.slides.length).css({
				'top': _self.slideLeft
			});
			_self.slides.eq(leftSlidePos).css({
				'top': -_self.slideLeft
			});

		} else {

			_self.slideLeft = _self.sliderContainer.width();

			_self.slides.eq(_self.current).css({
				'left': 0
			});
			_self.slides.eq((_self.current + 1) % _self.slides.length).css({
				'left': _self.slideLeft
			});
			_self.slides.eq(leftSlidePos).css({
				'left': -_self.slideLeft
			});

		}

		_self.slides.hide();
		_self.slides.eq(_self.current).show();
	}
}

imgSlider.prototype.transition = function (dir, cur) {
	var _self = this;

	var _oldIdx = {
		css: {},
		anim: {}
	};
	var _cur = {
		css: {},
		anim: {}
	};

	_self.setSliderHeight();
	_self.oldIdx = _self.current;

	if (dir == 'prev') {
		_self.current = (_self.current - 1 < 0) ? _self.slides.length - 1 : _self.current - 1;
		dir = -1;
	} else if (dir == 'next') {
		_self.current = (_self.current + 1) % _self.slides.length;
		dir = 1;
	}

	if( cur != undefined ) _self.current = cur;

	_self.setCurrent();
	_self.slidesOnReady();
	_self.resetSlidesCSS();
	_oldIdx.css.display = 'block';
	_cur.css.display = 'block';

	_self.container.trigger('onTransition');
	_self.slides.hide();

	if (_self.defaults.fade) {
		// previous current slides
		_self.slides.eq(_self.oldIdx).show().fadeOut(_self.defaults.speed, function () {
			_self.isAnimating = false;
			_self.container.trigger('endTransition');
		});

		// updated current slides
		_self.slides.eq(_self.current).fadeIn(_self.defaults.speed, function () {
			_self.isAnimating = false;
		});
	} else {
		if (_self.defaults.vertical) {
			_oldIdx.css.top = 0;
			_oldIdx.anim.top = _self.slideLeft * -1 * dir;
			_cur.css.top = _self.slideLeft * dir;
			_cur.anim.top = 0;
		} else {
			_oldIdx.css.left = 0;
			_oldIdx.anim.left = _self.slideLeft * -1 * dir;
			_cur.css.left = _self.slideLeft * dir;
			_cur.anim.left = 0;
		}

		// previous current slides
		_self.slides.eq(_self.oldIdx).css(
			_oldIdx.css
		).stop().animate(
			_oldIdx.anim
		, _self.defaults.speed, function () {
			_self.isAnimating = false;
			_self.container.trigger('endTransition');
		});

		// updated current slides
		_self.slides.eq(_self.current).css(
			_cur.css
		).stop().animate(
			_cur.anim
		, _self.defaults.speed, function () {
			_self.isAnimating = false;
			_self.defaults.afterSlideCallback();
		});
	}

	_self.autoPlay();
}

imgSlider.prototype.thumbnailInit = function () {
	var _self = this;

	if( _self.container.find('.sliderThumbnail').length ) {
		_self.container.find('.sliderThumbnailInner').html('');
		for (var i = 0; i < _self.slides.length; i++) {
			var _src = _self.slides.find('img').eq(i).attr('src');
			var _thumbnail = '<a class="sliderThumbnailItem" href="#"><img src="'+_src+'"></a>';
			if( !_self.container.find('.sliderThumbnailContent').length ) _self.container.find('.sliderThumbnail').append('<div class="sliderThumbnailContent">');
			if( !_self.container.find('.sliderThumbnailInner').length ) _self.container.find('.sliderThumbnailContent').append('<div class="sliderThumbnailInner">');

			_self.container.find('.sliderThumbnailInner').append(_thumbnail);
		}

		var _item = _self.container.find('.sliderThumbnailItem');
		_self.thumbnailWidth = _item.outerWidth(true) * _item.length;
		if( _self.defaults.thumbnailCarousel ) _self.container.find('.sliderThumbnailInner').css('width', _self.thumbnailWidth);

		if( _self.thumbnailWidth > _self.container.find('.sliderThumbnail').width() && _self.defaults.thumbnailCarousel ) {
			_self.container.find('.sliderThumbnail').append('<a class="sliderThumbnailPrev" href="#"></a><a class="sliderThumbnailNext" href="#"></a>');
		}
	}
	_self.checkThumbnailMove();
}

imgSlider.prototype.thumbnailTransition = function (dir) {
	var _self = this;

	if (dir == 'prev') {
		dir = -1;
	} else if (dir == 'next') {
		dir = 1;
	}

	_self.thumbnailMove = _self.thumbnailMove - ($('.sliderThumbnailContent').width()*dir);

	_self.container.find('.sliderThumbnailInner').stop().animate({
		'margin-left': _self.thumbnailMove
	}, function() {
		_self.isAnimating = false;

		_self.checkThumbnailMove();
	});
}

imgSlider.prototype.checkThumbnailMove = function () {
	var _self = this;

	_self.container.find('.sliderThumbnailPrev').show();
	_self.container.find('.sliderThumbnailNext').show();

	if( _self.container.find('.sliderThumbnailInner').width() < (_self.thumbnailMove*-1)+_self.container.find('.sliderThumbnailContent').width() ) {
		_self.container.find('.sliderThumbnailNext').hide();
	}
	if( _self.thumbnailMove >= 0 ) {
		_self.container.find('.sliderThumbnailPrev').hide();
	}
}

imgSlider.prototype.changePattern = function (num) {
	var _self = this;

	if( _self.container.find('.sliderItem').parents('.slides').length ) {
		_self.container.find('.sliderItem').unwrap('.slides');

		var _itemPerRow = num;
		var _items = [];

		_self.container.find('.sliderItem').each(function() {
			if( !$(this).parents('.slides').length ) {
				var _idx = $(this).index();

				if( _idx%_itemPerRow == 0 ) _items.push( _self.container.find('.sliderItem').slice(_idx, _idx+_itemPerRow) );
			}
		});
		for(var i=0; i<_items.length; i++) {
			_items[i].wrapAll('<div class="slides"></div>');
		}

		// create bullet
		if( _self.container.find('.sliderBullet').length ) {
			_self.container.find('.sliderBullet').html('');
			for (var i = 0; i < _self.container.find('.slides').length; i++) {
				var _bullet = '<a href="#"><span class="sliderBulletBg"></span></a>';
				_self.container.find('.sliderBullet').append(_bullet);
			}
		}
		_self.bullet = _self.container.find('.sliderBullet a');

		_self.slides = _self.container.find('.slides');
		_self.current = 0;
		_self.setCurrent();
		_self.slidesOnReady();
	}
}

imgSlider.prototype.autoPlay = function () {
	var _self = this;

	if (_self.defaults.autoPlay) {
		if (_self.slides.length > 1) {
			clearTimeout(_self.autoPlayTimer);
			_self.autoPlayTimer = setTimeout(function () {

				if (!_self.isAnimating) {
					_self.isAnimating = true;
					_self.transition('next');
				}
				_self.autoPlay();

			}, _self.defaults.autoPlaySpeed);
		}
	}
}

imgSlider.prototype.setSliderHeight = function () {
	var _self = this;
	var _slidesHeight = _self.container.find('.slides.on .sliderItem').outerHeight(true);
	_slidesHeight = (_slidesHeight <= 0) ? _self.container.find('.slides.on img').outerHeight(true) : _slidesHeight;
	_slidesHeight = _slidesHeight * _self.defaults.slidesRow;

	if (_self.defaults.autoHeight) {
		if (_self.container.height() > 0) {
			_slidesHeight = _self.container.height();
		}
		_slidesHeight = _self.container.find('.slides.on .sliderItem').outerHeight(true);
		_slidesHeight = (_slidesHeight <= 0) ? _self.container.find('.slides.on img').outerHeight(true) : _slidesHeight;
	}

	_self.sliderContainer.css('height', _slidesHeight);
	_self.slides.css('height', _slidesHeight);
}

imgSlider.prototype.resetSlidesCSS = function () {
	var _self = this;
	_self.slides.css({
		'left': '',
		'display': ''
	});
}

imgSlider.prototype.touchEvent = function () {
	var _self = this;

	_self.sliderContainer.bind('mousedown touchstart', function (e) {
		if( _self.container.find('.slides').length < 2 ) return;

		if (!_self.isAnimating) {
			_self.isAnimating = true;

			clearTimeout(_self.autoPlayTimer);
			var touch = e;
			if (e.type != 'mousedown') {
				var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
			} else {
				e.preventDefault();
			}

			$(document).bind('resize', function(){
				resetDragFunc();
				setSlidesCurrent();
			});

			startPos = touch.pageX;
			$(document).bind('mousemove touchmove', function (e) {
				var touch = e;
				if (e.type != 'mousemove') {
					var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
				}
				if (startPos - touch.pageX < 15 && startPos - touch.pageX > -15) return;
				_self.dragging = true;

				_self.resetSlidesCSS();
				_self.slides.eq(_self.current).css('left', 0);

				// current image beside image
				var _dir = 1;
				var _display = 'block';
				if (startPos - touch.pageX > 0) {
					var _besideImg = (_self.current + 1) % _self.slides.length;
					if (!_self.defaults.loop) {
						if (_self.current + 1 >= _self.slides.length) {
							_display = 'none';
						}
					}
				} else {
					var _besideImg = (_self.current - 1 < 0) ? _self.slides.length - 1 : _self.current - 1;
					_dir = -1;
					if (!_self.defaults.loop) {
						if (_self.current - 1 < 0) {
							_display = 'none';
						}
					}
				}
				_self.slides.eq(_besideImg).css({
					'left': _self.slideLeft * _dir,
					'display': _display
				});

				// slider position
				_self.slider.css('left', touch.pageX - startPos);

				if (startPos - touch.pageX >= _self.slideLeft) {
					if (!_self.defaults.loop) {
						if (_self.current + 1 >= _self.slides.length) return;
					}
					_self.current = (_self.current + 1) % _self.slides.length;
					setSlidesCurrent();
				}
				if (startPos - touch.pageX <= -_self.slideLeft) {
					if (!_self.defaults.loop) {
						if (_self.current == 0) return;
					}
					_self.current = (_self.current - 1 < 0) ? _self.slides.length - 1 : _self.current - 1;
					setSlidesCurrent();
				}
			});
			$(document).bind('mouseup touchend', function (e) {
				var touch = e;
				if (e.type != 'mouseup') {
					var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
				} else {
					e.preventDefault();
				}

				//resetDragFunc();
				_self.isAnimating = false;
				$(document).unbind('mousemove touchmove');
				$(document).unbind('mouseup touchend');
				_self.slider.animate({'left': 0});
				_self.autoPlay();

				// detect direction
				if (startPos - touch.pageX >= _self.slideLeft / 3) {
					if (!_self.defaults.loop) {
						if (_self.current + 1 >= _self.slides.length) return;
					}
					_self.isAnimating = true;
					_self.slider.css('left', touch.pageX - startPos).stop().animate({
						'left': -_self.slideLeft
					}, function () {
						_self.current = (_self.current + 1) % _self.slides.length;
						setSlidesCurrent();
					});
				}
				if (startPos - touch.pageX <= -_self.slideLeft / 3) {
					if (!_self.defaults.loop) {
						if (_self.current == 0) return;
					}
					_self.isAnimating = true;
					_self.slider.css('left', touch.pageX - startPos).stop().animate({
						'left': _self.slideLeft
					}, function () {
						_self.current = (_self.current - 1 < 0) ? _self.slides.length - 1 : _self.current - 1;
						setSlidesCurrent();
					});
				}
			});
		}
	});

	function setSlidesCurrent() {
		_self.setCurrent();
		_self.slides.eq(_self.current).css('left', 0);
		resetDragFunc();
		_self.slidesOnReady();
		_self.defaults.afterSlideCallback();
	}

	function resetDragFunc() {
		_self.isAnimating = false;
		$(document).unbind('mousemove touchmove');
		$(document).unbind('mouseup touchend');
		_self.slider.css('left', 0);
		_self.autoPlay();
	}
}

imgSlider.prototype.destroy = function () {
	var _self = this;

	clearTimeout(_self.autoPlayTimer);

	_self.destroyed = true;
	_self.slides.stop();

	_self.container.removeClass('loaded');
	_self.container.off('click', '.sliderBullet a');
	_self.container.find('.sliderBtnPrev').off('click').hide();
	_self.container.find('.sliderBtnNext').off('click').hide();

	_self.sliderContainer.unbind('mousedown touchstart');
	$(document).unbind('mousemove touchmove');
	$(document).unbind('mouseup touchend');

	_self.sliderContainer.removeClass('ready');
	_self.slides.removeClass('on');

	_self.sliderContainer.css('height', '');
	_self.slides.css('height', '');
	_self.slider.css('left', '');
	_self.resetSlidesCSS();
}








//============================= Responsive =============================
if ($.browser.msie && parseInt($.browser.version, 10) <= 8) {
	jQuery.fx.interval = 1000 / 30;
	var oldIE = true;
} else {
	jQuery.fx.interval = 1000 / 60;
	var oldIE = false;
}

var layout;

function responsive() {
	var _self = this;

	_self.layoutSize = [0, 780 , 1200]; // 1440
	_self.layout = ['mobile', 'tablet' , 'desktop'];

	_self.window = $(window);
	_self.body = $('body');
	_self.current = _self.layout[_self.layout.length - 1];
	if (oldIE) {
		_self.changeClass(_self.layout[1]);
	} else {
		_self.init();
	}
}
responsive.prototype.init = function () {
	var _self = this;

	_self.changeClass(_self.layout[_self.checkSize()]);
	_self.addEvent();
}
responsive.prototype.addEvent = function () {
	var _self = this;

	_self.window.on('resize', function () {
		_self.changeClass(_self.layout[_self.checkSize()]);
	});
}
responsive.prototype.checkSize = function () {
	var _self = this;

	var _layout = 0;

	for (var i = 0; i < _self.layoutSize.length; i++) {
		if (_self.layoutSize[i] > _self.window.width()) {
			break;
		} else {
			_layout = i;
		}
	}
	return _layout;
}
responsive.prototype.changeClass = function (className) {
	var _self = this;

	if (!_self.body.hasClass(className)) {
		for (var i = 0; i < _self.layoutSize.length; i++) {
			_self.body.removeClass(_self.layout[i]);
		}
		_self.body.addClass(className);
		layout = className;
		$(document).trigger('responsive', className);
	}
}