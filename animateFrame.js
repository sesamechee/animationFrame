/****************** animation frame ******************/
var animateFrame = function (container, config) {
	var _self = this;
	_self.container = container;
	_self.settings = {
		width: _self.container.width() / 2,
		height: _self.container.height() / 2,
		frame: 2,
		row: 1,
		speed: 300,
		loop: true,
		isFirstFrame: true,
		mouseEvent: true,
		reverse: false,
		delay: 0
	};
	$.extend(_self.settings, config);

	_self.curFrame = 0;
	_self.dir = 1;
	_self.mouseOverY = 0;

	_self.bindEvent();
	_self.play();
}

animateFrame.prototype.bindEvent = function () {
	var _self = this;

	if (_self.settings.mouseEvent) {
		_self.container.bind('mouseenter', function () {
			_self.mouseOverY = 100;
			_self.setFrame();
		}).bind('mouseleave', function () {
			_self.mouseOverY = 0;
			_self.setFrame();
		});
	}
}

animateFrame.prototype.play = function () {
	var _self = this;
	clearTimeout(_self.timer);
	_self.timer = setTimeout(function () {
		_self.curFrame = (_self.curFrame + _self.dir) % _self.settings.frame;
		if (_self.settings.reverse) {
			if (_self.curFrame + _self.dir == _self.settings.frame || _self.curFrame + _self.dir < 0) {
				_self.dir = _self.dir * -1;
			}
		}
		_self.setFrame();

		if (_self.curFrame == 0) {
			if (!_self.settings.loop)
				return;
			if (_self.settings.delay > 0) {
				setTimeout(function () {
					_self.play();
				}, _self.settings.delay);
			} else {
				_self.play();
			}
		} else {
			_self.play();
		}

	}, _self.settings.speed);
}

animateFrame.prototype.pause = function () {
	var _self = this;
	_self.container.stop();
	clearTimeout(_self.timer);
}

animateFrame.prototype.stop = function () {
	var _self = this;
	_self.container.stop();
	clearTimeout(_self.timer);
	_self.curFrame = 0;
	_self.setFrame();
}

animateFrame.prototype.goToFrame = function (frame) {
	var _self = this;
	_self.curFrame = frame;
	_self.setFrame();
}

animateFrame.prototype.setFrame = function () {
	var _self = this;
	
	var _colPerRow = Math.ceil(_self.settings.frame / _self.settings.row);
	var _row = Math.floor( _self.curFrame / _colPerRow);
	var _col = Math.floor( _self.curFrame % _colPerRow);
	
	if (_self.container.css('backgroundPosition') == undefined) {
		_self.container.css('backgroundPositionX', '-'+(_col*100)+'%');
		_self.container.css('backgroundPositionY', '-'+ (_row *100)+'%');
	} else {
		_self.container.css({
			'backgroundPosition': '-'+(_col*100)+'%' + ' ' + '-'+ ( (_row *100) + _self.mouseOverY)+'%'
		});
	}
}

/****************** USAGE ******************
mazeBallSpan = new animateFrame($(container), {
    width: 62,
    height: 64,
	row: 1,
    frame: 4,
    speed: 100,
    mouseEvent: false,
    reverse: true,
    delay: 100
});
*******************************************/