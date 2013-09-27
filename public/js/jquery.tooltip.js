/**
 * jQuery tooltip v1.0
 * @license Copyright 2013
 * 
 * Date 2013-7-16
 * Update 2013-9-25 T16:29
 */
(function($, window, undefined) {
	//'use strict';
	var play,
		/** 
		 * 应用程序 
		 * @namespace 
		 */
		app = window.app = window.app || {};
	
	/**
	 * tooltip 对象
	 * @namespace 
	 */
	app.tooltip = {
		/** 
		 * 标志提示工具状态 
		 * @type {boolean}
		 * @private
		 */
		status: false,
		/** 
		 * 定义全局动画时间 
		 * @type {number}
		 */
		animTime: 300,
		/** 
		 * 定义全局提示工具显示时间 
		 * @type {number}
		 */
		delay: 5000,
		/**  
		 * 显示要提示的内容
		 * @param {string} type 提示的类型
		 * @param {string} msg 需要提示的内容
		 * @param {string} delay 提示的动画时长
		 * @param {string} animTime 显示提示内容的时长
		 * @example 
		 * app.tooltip.tip('success', '^_^ 这是一个成功提示。');
		 * @example 
		 * app.tooltip.tip('error', '+_+? 这是另一个出错提示。', 3000, 200);
		 */
		tip: function(type, msg, delay, animTime) {
			var that = this;
			clearTimeout(play);
			if(!that.status) {
				if(that.element) {
					that.element.remove();	
					that.status = true;
				}
				var left, top,
					el = that.element = $('<div class="ajax_build_tip ' + type + '" />').html(msg);
				if(el.css('position') !== 'absolute') {
					el.css({'position': 'absolute'});
				}
				if(!el.css('top')) {
					el.css({'top': '30'});
				}
				
				$('body').append(el.css({'visibility': 'hidden', 'display': 'block'}));
				left = ($(window).width() - el.outerWidth()) * .5;
				el.css({'left': left, 'visibility': 'visible', 'display': 'none'}).fadeIn(animTime || that.animTime);
				if(delay !== 'none') {
					play = setTimeout(function() {
						that.close = function() {
							that._close();
						};
						that.close();
					}, delay || that.delay);	
				}
			}
		},
		/** 
		 * 私有方法，关闭提示 
		 * @private
		 */
		_close: function() {
			var that = this;
			that.element.fadeOut(that.animTime, function() {
				that.element.remove();
				that.status = false;
			});
		},
		/** 关闭提示 */
		close: function() {
			this._close();
		},
		/** 销毁tooltip对象 */
		destroy: function() {
			var that = this;
			that.close = function() {};
			that.status = false;
		},
		/**  
		 * 出错提示
		 * @param {string} msg 需要提示的内容
		 * @param {string} delay 提示的动画时长
		 * @param {string} animTime 显示提示内容的时长
		 * @example 
		 * app.tooltip.error('+_+? 出错提示。');
		 */
		error: function(msg, delay, animTime) {
			this.tip('error', msg, delay, animTime);
		},
		/**  
		 * 成功提示
		 * @param {string} msg 需要提示的内容
		 * @param {string} delay 提示的动画时长
		 * @param {string} animTime 显示提示内容的时长
		 * @example 
		 * app.tooltip.error('^_^ 成功提示。');
		 */
		success: function(msg, delay, animTime) {
			this.tip('success', msg, delay, animTime);
		},
		/**  
		 * 警告提示
		 * @param {string} msg 需要提示的内容
		 * @param {string} delay 提示的动画时长
		 * @param {string} animTime 显示提示内容的时长
		 * @example 
		 * app.tooltip.error('*_*! 出错提示。');
		 */
		warning: function(msg, delay, animTime) {
			this.tip('warning', msg, delay, animTime);
		}
	};
})(jQuery, window);