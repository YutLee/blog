/**
 * @license Copyright 2013-2014
 * jQuery popup v1.0.2
 *
 * @author yutlee.cn@gmail.com
 * Date 2014-1-17
 * Update 2014-1-17 --v1.0.2
 */

(function($, plugin) {
	var defs = {
		name: plugin,
		width: 400,
		height: 300
	};

	$.fn[defs.name] = function(options) {
		return this.each(function() {
			new box($(this), options);
		});
	};

	$.fn[defs.name].defs = defs;
	$.fn[defs.name].win = [];
	$.fn[defs.name].close = box.prototype.close;

	function box(element, options) {
		this.init(element, options);
		element.data(this.options.name, this);
	}

	box.prototype = {
		init: function(element, options) {
			var that = this;

			options = that.options = $.extend(true, {}, that.options, options);
			that.element = element;

			that.open();
		},
		options: defs,
		open: function() {
			var that = this,
				options = that.options,
				len = $.fn[defs.name].win.length,
				titleDiv = $('<div class="title" />'),
				closeDiv = $('<div class="close">×</div>'),
				contentDiv = $('<div class="content" />'),
				popupDiv = $('<div class="popup" />'),
				zIndex;

			if(len >= 1) {
				zIndex = parseInt($.fn[defs.name].shadow.attr('zIndex'), 10) + 2;
				$.fn[defs.name].shadow.css({'z-index': zIndex}).attr('zIndex', zIndex);
			}else {
				$.fn[defs.name].shadow = $('<div class="shadow" />').appendTo('body');
				zIndex = parseInt($.fn[defs.name].shadow.css('z-index'), 10) || 1;
				$.fn[defs.name].shadow.attr('zIndex', zIndex);
			}

			closeDiv = closeDiv.appendTo(popupDiv);
			if(options.title && $.trim(options.title) !== '') {
				titleDiv = titleDiv.appendTo(popupDiv);
			}
			contentDiv = contentDiv.appendTo(popupDiv);
			popupDiv = popupDiv.appendTo('body').css({'z-index': zIndex + 1, 'opacity': 0});

			that.setStyle(popupDiv);

			$.fn[defs.name].win.unshift(popupDiv);

			closeDiv.one('click', function(e) {
				that.close();
			});

			if($.isFunction(options.insert)) {
				options.insert.call(that, that, contentDiv);
			}

		},
		close: function() {
			var that = this,
				len = $.fn[defs.name].win.length,
				last;

			if(len > 0) {
				last = $.fn[defs.name].win.shift();
				last.remove();

				if(len === 1) {
					$.fn[defs.name].shadow.remove();
				}else {
					$.fn[defs.name].shadow.css({'z-index': parseInt($.fn[defs.name].shadow.css('z-index'), 10) - 2});
				}
			}
		},
		setStyle: function(el) {
			var that = this,
				width = that.options.width,
				height = that.options.height,
				full = that.options.full;
			if(el.css('position') !== 'absolute') {
				el.css({'position': 'absolute'})	
			}
			if(full) {
				var top = full.top,
					right = full.right,
					bottom = full.bottom,
					left = full.left;
				top = (top || top == 0) ? top : 'auto';
				right = (right || right == 0) ? right : 'auto';
				bottom = (bottom || bottom == 0) ? bottom : 'auto';
				left = (left || left == 0) ? left : 'auto';
				el.css({'width': 'auto', 'height': 'auto', 'top': top, 'right': right, 'bottom': bottom, 'left': left});
				$('html').css({'overflow': 'hidden'});
				el.animate({'opacity': 1}, 100);
			}else {
				if(width && width === 'auto') {
					el.css({'width': $container.width()});
				}else {
					el.width(width);	
				}	
				if(height && height === 'auto') {
					el.css({'height': el.height(), 'position': 'absolute'});
				}else {
					el.height(height);
				}
				that.position(el);
			}
		},
		position: function(el) {
			var winWidth = $(window).width(),
				winHeight = $(window).height(),
				left = (winWidth - el.outerWidth()) * .5,
				top = (winHeight - el.outerHeight()) * .5;
			left = left > 0 ? left : 0;
			top = top > 0 ? top : 0;
			el.animate({'left': left, top: top}, 100, function() {
				el.animate({'opacity': 1}, 100);
			});
		},
		destory: function() {

		}
	};

})(jQuery, 'popup');

(function($, bitty) {
	$.fn.popup.defs.isHistory = false;
	$.fn.popup.defs.insert = function(box, content) {
		var url = box.options.dest;
		bitty.ajax({
			url: url,
			temps: box.options.temps,
			isHistory: box.options.isHistory,
			beforeSend: function() {
				
			},
			success: function(data) {
				if(content) {
					bitty.loadPage(url, data, content);
				}
			}	
		});
	};
})(jQuery, app.bitty);