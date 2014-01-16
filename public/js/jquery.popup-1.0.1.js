/**
 * @license Copyright 2013-2014
 * jQuery popup v1.0.1
 *
 * @author yutlee.cn@gmail.com
 * Date 2013-8-23
 * Update 2014-1-15 --v1.0.1
 */

(function($, bitty) {
	var Popup = window.Popup = (function() {
		function constructor(options) {
			this.options = $.extend({
				url: '',
				title: '温馨提示',
				isHistory: false,
				width: 400,
				height: 300,
				full: null	
			}, options || {});
		}
		var $temp, $title, $shadow, $closeButton, $container, $content, $parent;
		var play;
		var html = '',
			randomId = 'popup_';
		function init() {
			$temp = $('<div class="popup" />');
			$title = $('<div class="title" />');
			$closeButton = $('<div class="close" />'); 
			$container = $('<div class="container" />'); 
		}
		function add(popup) {
			randomId += Math.ceil((Math.random() * 100000));
			popup.showBefore($temp);
			$closeButton = $closeButton.html('×').appendTo($temp);
			$title.html(popup.options.title).appendTo($temp);
			$content = popup.options.id;
			if($content) {
				$parent = $content.parent();
				$container.append($content.show()).appendTo($temp).attr('id', randomId);
			}else {
				$container.html(html).appendTo($temp).attr('id', randomId);
			}
			$temp = $temp.css({'display': 'none'}).appendTo('body');
			
			popup.setStyle($temp);
			if(!popup.options.full) {
				popup.position($temp);
			}
			$temp.fadeIn();
			popup.close();	
		}
		function resize(popup, el) {
			$(window).bind({
				'resize.popup': function() {
					clearTimeout(play);
					play =setTimeout(function() {
						popup.position(el);
					}, 100);
				}	
			});	
		}
		constructor.prototype = {
			showBefore: function(el) {
				var that = this,
					width = that.options.width,
					height = that.options.height;
				if(width && width === 'auto') {
					el.css({'visibility': 'hidden', 'display': 'block', 'position': 'relative', 'width': 'auto', 'right': 'auto', 'left': 'auto'});
				}
				if(height && height === 'auto') {
					el.css({'visibility': 'hidden', 'display': 'block', 'position': 'relative', 'height': 'auto', 'top': 'auto', 'bottom': 'auto'});
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
					console.log(full);
					el.css({'width': 'auto', 'height': 'auto', 'top': top, 'right': right, 'bottom': bottom, 'left': left});
					//$('body').css({'overflow': 'hidden'});
					$('html').css({'overflow': 'hidden'});
				}else {
					if(width && width === 'auto') {
						//el.css({'visibility': 'hidden', 'display': 'block', 'position': 'relative', 'width': 'auto', 'right': 'auto', 'left': 'auto'});
						el.css({'width': $container.width(), 'display': 'none', 'visibility': 'visible'});
					}else {
						el.width(width);	
					}	
					if(height && height === 'auto') {
						//el.css({'visibility': 'hidden', 'display': 'block', 'position': 'relative', 'height': 'auto', 'top': 'auto', 'bottom': 'auto'});
						el.css({'height': el.height(), 'display': 'none', 'visibility': 'visible', 'position': 'absolute'});
					}else {
						el.height(height);
					}
				}
			},
			position: function(el) {
				var winWidth = $(window).width(),
					winHeight = $(window).height(),
					left = (winWidth - el.outerWidth()) * .5,
					top = (winHeight - el.outerHeight()) * .5;
				left = left > 0 ? left : 0;
				top = top > 0 ? top : 0;
				el.animate({'left': left, top: top}, 100);
			},
			open: function() {
				var that = this,
					url = that.options.url;
				bitty.ajax({
					url: url,
					temps: that.options.temps,
					isHistory: that.options.isHistory,
					beforeSend: function() {
						$shadow = $('<div class="popup_shadow" />').appendTo('body');
						init();
						add(that);
					},
					success: function(data) {
						bitty.loadPage(url, data, '#' + randomId);
					}	
				});
			},
			dele: function dele() {
				if($content) {
					$content.appendTo($parent);	
				}
				$temp.fadeOut();
				$shadow.fadeOut();
				$temp.queue(function() {
					$shadow.remove();
					$temp.remove();
					$(window).unbind('resize.popup');
					$(this).dequeue();
				});	
				//$('body').css({'overflow': 'auto'});
				//$('html').css({'overflow': 'auto'});
			},
			close: function() {
				var that = this;
				$closeButton.bind({
					'click': function() {
						that.dele();
						return false;	
					}	
				});
				$shadow.bind({
					'click': function() {
						that.dele();
						return false;	
					}	
				});
				
			}	
		};
		return constructor;
	})();
})(jQuery, app.bitty);