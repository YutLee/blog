/**
 * @license Copyright 2013-2014
 * jQuery bitty v1.0.1
 * 
 * base jquery.history.js
 * @see https://github.com/browserstate/history.js 
 * 
 * base doT.js
 * @see https://github.com/olado/doT 
 *
 * @author yutlee.cn@gmail.com
 * Date 2013-8-23
 * Update 2013-9-26 --v1.0
 * Update 2014.1.15-2014.1.17 --v1.0.1
 */

(function ($, window, doT, History, undefined) {
	'use strict';
	
	//============================== 工具函数开始 ==============================
	/**
	 * 检测对象是否为字符串
	 * @param {Object} 用于测试是否为字符串的对象
	 * @return {boolean}
	 * @memberOf _global_
	 */
	function isString(variable) {
		return Object.prototype.toString.call(variable) === '[object String]';
	}
	/**
	 * 检测对象是否为空字符串
	 * @param {Object} 用于测试是否为字符串的对象
	 * @return {boolean}
	 * @memberOf _global_
	 */
	function isEmpty(variable) {
		return $.trim(variable) === '';
	}
	/**
	 * 对比返回在 array1 中但是不在 array2 中的值。
	 * @param {Array} array1 必须，要被对比的数组
	 * @param {Array} array2 必须，和这个数组进行比较
	 * @return {Array} 返回一个数组，该数组包括了所有在 array1 中但是不在 array2 中的值。
	 * @memberOf _global_
	 */
	function arrayDiff(array1, array2) {
		if(!$.isArray(array1)) {
			return false;
		}
		if(!$.isArray(array2)) {
			return false;
		}
		if($.isArray(array1) && $.isArray(array2)) {
			var newArray = [],
				k1 = 0,
				len1 = array1.length,
				len2 = array2.length;
			for(; k1 < len1; k1++) {
				for(var k2 = 0; k2 < len2; k2++) {
					if(array1[k1] === array2[k2]) {
						break;
					}
					if(k2 === len2 - 1 && array1[k1] !== array2[k2]) {
						newArray.push(array1[k1]);
					}
				}
			}
			return newArray;
		}
	}
	//============================== 工具函数结束 ==============================
	
	/** @namespace */
	var bitty = window.bitty = {
		tempCache: {},	//缓存模板
		currentUrlCache: [],	//缓存当前模板url
		tempUrlCache: [], //缓存模板url
		pageCache: {}, //缓存页面相关内容
		htmlCache: {},	//缓存模块
		jsCache: {}, //缓存javascript
		cssCache: {}, //缓存css
		dominRegExp: new RegExp('(https|http)://[^/]*/', 'g'),
		/**
		 * 头部信息
		 * @type {Object}
		 */
		headers: {
			'Accept': 'application/json',
			'X-Referer': window.location.href
		},
		/**
		 * 替换文件路径为合法 html标签 ID
		 * @param {string} path 必须，需要替换的文件路径
		 * @return {string} 
		 * @private
		 */
		replacePath: function(path) {
			return path.replace(this.dominRegExp, '').replace(/[^(\-|\w)]/g, '-');
		},
		/**
		 * 初始化
		 */
		init: function() {
			var that = this,
				data = that.initData,
				url = window.location.href,
				tempId = data.temp_id;

			if($.isPlainObject(tempId)) {
				var allTemps = data.temp_url;
				
				url = url.replace(that.dominRegExp, '');	//删除网址域名，减少缓存变量名的长度
				if(!that.pageCache[url]) {
					that.pageCache[url] = {};
				}
				if(!that.pageCache[url].temps) {
					that.pageCache[url].temps = allTemps.join(',');
				}
				if(!that.pageCache[url].allTemps) {
					that.pageCache[url].allTemps = allTemps.join(',');
				}
				
				that.currentUrlCache = allTemps;

				for(var key in tempId) {	//遍历需要更新的模板
					var value = tempId[key];
					if(!that.tempCache[value] && !$.isFunction(that.tempCache[value])) {
						that.tempCache[value] = doT.template(data.temp[key]);
						that.tempUrlCache.push(value);
					}
				}
			}

			that.loadPage(url, data);
			that.bindLink();
		},
		/**
		 * 加载页面
		 * @param {string} url 必须，新页面地址
		 * @param {Json} data 必须，新页面数据和模板
		 * @private
		 */
		loadPage: function(url, data) {
			var that = this,
				tempId = data.temp_id;

			//获取需要插入位置的id
			function insertHtml(idx, id, mod, html, allTemps) {
				var newMods;
				idx -= 1;

				if($.isPlainObject(mod)) {
					newMods = mod[key];
				}else {
					throw new Error('(\'~_~) 需要插入的位置mods数组不存在');
				}
				
				if(idx < 0) {
					$(newMods).prepend($('<div id="' + id +'"/>').html(html));
				}else {
					var existId = that.replacePath(allTemps[idx]),
						prevId = $(newMods).find('#' + existId);
					if(prevId.length === 1) {
						prevId.after($('<div id="' + id +'"/>').html(html));
					}else {
						insertHtml(idx - 1, id, mod, html, allTemps);
					}
				}
			}

			if($.isPlainObject(tempId)) {
				var allTemps = data.temp_url,
					diff = that.currentUrlCache.length > 0 ? arrayDiff(that.currentUrlCache, allTemps) : allTemps,
					k = 0,
					l = diff.length;
			
				for(; k < l; k++) {
					var diffId = that.replacePath(diff[k]);
					if($('#' + diffId).length > 0) {
						$('#' + diffId).remove();	//删除在当前页面但不在新页面的模块
					}
				}
				
				url = url.replace(that.dominRegExp, '');	//删除网址域名，减少缓存变量名的长度
				if(!that.pageCache[url]) {
					that.pageCache[url] = {};
				}
				if(!that.pageCache[url].temps) {
					that.pageCache[url].temps = allTemps.join(',');
				}
				if(!that.pageCache[url].allTemps) {
					that.pageCache[url].allTemps = allTemps.join(',');
				}
				
				that.currentUrlCache = allTemps;
			
				for(var key in tempId) {	//遍历需要更新的模板
					var idx = parseInt(key.replace(/[^\d]/g, '')),
						value = tempId[key],
						id = that.replacePath(value),
						html;
					if(!that.tempCache[value] && !$.isFunction(that.tempCache[value])) {
						that.tempCache[value] = doT.template(data.temp[key]);
						that.tempUrlCache.push(value);
					}
					html = ($.isPlainObject(data.data)) ? that.tempCache[value](data.data[key]) : that.tempCache[value]('');
					
					if($('#' + id).length > 0) {
						$('#' + id).remove();	//删除要替换的已存在当前页面的模块
					}
					
					insertHtml(idx, id, data.mod, html, allTemps);
				}
			}

			that.loadCss(data.css_url);

			//页面加载完成后统一加载的js
			if($.isArray(that.beforeJs)) {
				var i = 0,
					len = that.beforeJs.length;
				for(; i < len; i++) {
					that.beforeJs[i] = that.beforeJs[i].replace(that.dominRegExp, '');
				}
				that.loadJs(that.beforeJs);
			}

			that.loadJs(data.js_url);
			
			//其他js加载完后统一加载最后的js
			if($.isArray(that.finalJs)) {
				var j = 0,
					leng = that.finalJs.length;
				for(; j < leng; j++) {
					that.finalJs[j] = that.finalJs[j].replace(that.dominRegExp, '');
				}
				that.loadJs(that.finalJs);
			}
		},
		/**
		 * 获取数据并嵌套好html数组
		 * @param {Object} data Json数据
		 * @return 返回套好的html数组
		 */
		getCompleteHtml: function (data) {
			var that = this,
				tempId = data.temp_id,
				htmlArray = [],
				html = '';
			for(var key in tempId) {
				var value = tempId[key];
				if(!that.tempCache[value] && !$.isFunction(that.tempCache[value])) {
					that.tempCache[value] = doT.template(data.temp[key]);
					that.tempUrlCache.push(value);
				}
				html = $.isPlainObject(data.data) ? that.tempCache[value](data.data[key]) : that.tempCache[value]('');
				htmlArray.push(html);
			}
			return htmlArray;
		},
		/**
		 * 加载页面javascript
		 * @param {Array} url <script>标签的src属性
		 */
		loadJs: function (url) {
			var i = 0,
				len;
			if($.isArray(url)) {
				len = url.length;
				for (; i < len; i++) {
					$.ajax({
						url: url[i],
						cache: true,
						dataType: 'script'
					});
				}
			}
		},
		/**
		 * 加载页面css
		 * @param {Array} url <link>标签的href属性
		 */
		loadCss: function (url) {
			var that = this,
				i = 0,
				len;
			if($.isArray(url)) {
				len = url.length;
				for (; i < len; i++) {
					var now = url[i];
					if(!that.cssCache[now]) {
						$('head').append('<link rel="stylesheet" href="' + now + '" />');
						that.cssCache[now] = now;
					}
				}
			}
		},
		/**
		 * 更新所有页面缓存信息
		 * @param {string} url 必须，新页面地址
		 */
		refreshPageCache: function(url) {
			var that = this,
				newTemps,
				reTemps;
			for(var key in that.pageCache) {
				if(key === url && that.pageCache[key].temps && that.currentUrlCache) {
					newTemps = arrayDiff(that.pageCache[key].allTemps.split(','), that.currentUrlCache);
					newTemps = arrayDiff(newTemps, that.pageCache[key].temps.split(','));
					reTemps = that.pageCache[key].temps.split(',');
					for(var i = 0; i < newTemps.length; i++) {
						reTemps.push(newTemps[i]);
					}
					that.pageCache[key].reTemps = reTemps.join(',');
					break;
				}
			}
		},
		/**
		 * 设置发送的头部信息
		 * @param {string} url 必须，新页面地址
		 * @param {string} temps 可缺省，请求新页面所需的模板id；多个模板id用","隔开；缺省时，服务器返回完整的页面模板；
		 */
		setHeaders: function(url, temps) {
			var that = this,
				noExist;
			
			url = url.replace(that.dominRegExp, '');	//删除网址域名，减少缓存变量名的长度
			
			if(!that.pageCache[url]) {
				that.pageCache[url] = {};
			}
			
			if(temps && !isEmpty(temps)) {
				that.headers.Temps = that.pageCache[url].temps = that.pageCache[url].reTemps = temps;
				noExist = arrayDiff(temps.split(','), that.tempUrlCache);
				that.headers['No-Exist'] = noExist.join(',');
			}else if(that.pageCache[url].reTemps) {
				that.headers.Temps = that.pageCache[url].reTemps;
				noExist = arrayDiff(that.pageCache[url].reTemps.split(','), that.tempUrlCache);
				that.headers['No-Exist'] = noExist.join(',');
			}else {
				that.headers.Temps = '';
				that.headers['No-Exist'] = 'none';
			}
		},
		/**
		 * 加载中... ...
		 */
		loading: {
			/** 
			 * 加载中的提示信息
			 * @type {string}
			 */
			msg: '加载中...',
			/** 
			 * 加载前的回调函数
			 * @param {Array} 页面上需要删除的模块的 id 数组
			 */
			beforeSend: function(mods) {
				//tooltip.warning(this.msg, 'none');
				for(var i = 0; i < mods.length; i++) {
					$('#' + mods[i]).parent().addClass('loading');
				}
			},
			/** 
			 * 加载成功的回调函数
			 * @param {Array} 插入页面的模块的 id 数组
			 */
			success: function(url, data, mods) {
				//tooltip.close();
				for(var i = 0; i < mods.length; i++) {
					$('#' + mods[i]).parent().removeClass('loading');
				}
			}
		},
		/**
		 * ajax请求Json数据, 该方法基本的参数和jQuery.ajax方法的参数一致
		 * @param {string} temps 可缺省，请求新页面所需的模板id；多个模板id用","隔开；缺省时，服务器返回完整的页面模板；
		 * @param {boolean} isHistory 可缺省， 新页面地址是否加入历史地址记录， 默认为 true
		 * @param {boolean} isScrollTop 可缺省，请求成功后是否滚动到顶部， 默认为 false 
		 * @param {string} title 可缺省，新页面标题，缺省下取当前页面标题
		 */
		ajax: function(options) {
			var that = this,
				newMods = [],
				o = {
					dataType: 'json',
					headers: that.headers,
					title: document.title,
					isHistory: true,	//是否加入历史地址
					isScrollTop: false,	//请求成功后是否滚动到顶部
					temps: ''
				},
				settings;

			o = $.extend(true, {}, o, options);

			if(!o.url || isEmpty(o.url)) {
				throw new Error('(\'x_x) 请求的url地址不正确');
			}

			that.setHeaders(o.url, o.temps);
			o.headers = that.headers;

			function beforeSend() {
				that.latestRequest = o.url;
				
				that.isHistoryAction = false;	//判断是否是点击了历史前进、后退按钮
				if(o.isHistory) {
					History.pushState('', o.title, o.url);
					History.replaceState('', o.title, o.url);
				}
				that.isHistoryAction = true;

				var mods = that.headers.Temps ? arrayDiff(that.currentUrlCache, that.headers.Temps.split(',')) : that.currentUrlCache;
				var i = 0, len = mods.length;
				mods = len > 0 ? mods : that.currentUrlCache;
				len = mods.length;
				for(; i < len; i++) {
					newMods.push(that.replacePath(mods[i]));
				}
			}

			function success(data) {
				if(o.isScrollTop === true) {
					$('html,body').animate({scrollTop: 0}, 300);
				}

	            if(data.hint && data.hint.url && !isEmpty(data.hint.url)) {
	                bitty.request({url: data.hint.url});
	            }
			}

			settings = $.extend(true, {}, o);

			delete settings.title;
			delete settings.isHistory;
			delete settings.isScrollTop;
			delete settings.temps;

			settings.beforeSend = function() {
				beforeSend();
				if($.isFunction(o.beforeSend)) {
					if(o.beforeSend.call(this) === false) {
						return false;
					}
				}
				if($.isFunction(that.loading.beforeSend)) {
					that.loading.beforeSend.call(that.loading, newMods, o.url);
				}
			};

			settings.success = function(data) {
				if(that.latestRequest === o.url) {
					that.refreshPageCache(o.url);
					success(data);
					if($.isFunction(o.success)) {
						if(o.success.call(that, data) === false) {
							return false;
						}
					}
					if($.isFunction(that.loading.success)) {
						that.loading.success.call(that.loading, o.url, data, newMods);
					}
				}
			};

			$.ajax(settings);
		},
		/**
		 * 加载新页面，Ajax请求获取数据并将套好的html插入到页面中
		 * @param {Object} otherParam 其他参数，参考ajax方法参数
		 */
		request: function(options) {
			var that = this,
				o = $.extend(true, {}, options),
				settings;

			//url = url.replace(/[\u4e00-\u9fa5]/g, encodeURIComponent('$0', true));	//对中文进行编码
			//that.setHeaders(o.url, o.temps);

			settings = $.extend(true, {}, o);

			settings.success = function(data) {
				that.loadPage(o.url, data);
				if($.isFunction(o.success)) {
					if(o.success.call(this, data) === false) {
						return false;
					}
				}
			};

			that.ajax(settings);
			//that.ajax({url: o.url, isHistory: o.isHistory, title: o.title, type: o.type, data: o.data, callback: o.callback});
		},
		/**
		 * 表单提交
		 * @param {string} formId 可缺省，表单id；缺省时 submitId 参数必填
		 * @param {string} submitId 可缺省，提交的按钮；缺省时 formId 参数必填
		 * @param {string} url 可缺省，提交的地址；缺省时默认提交到当前地址或表单的 action 属性地址
		 * @param {string} method 可缺省，提交的方式；缺省时默认取表单 method 属性的值，method为空时默认'POST'提交
		 * @param {Function} check 可缺省，提交表单前的回调函数，常用于表单验证
		 * @param {Object} otherParam 其他参数，参考ajax方法参数
		 */
		ajaxForm: function(options, check) {
			var that = this,
				o = $.extend({
					formId: null,
					submitId: null
				}, options || {}),
				settings,
				button,
				form,
				params,
				checkSuccess = true;	//表单提交是否验证成功

			if(!o.formId) {
				if(!o.submitId) {
					throw new Error('(\'0_1) 参数 formId 或 submitId 必须有一个');
				}else {
					button = isString(o.submitId) ? $('#' + o.submitId) : $(o.submitId);
					form = button.closest('form');
				}
			}else {
				form = isString(o.formId) ? $('#' + o.formId) : $(o.formId);
			}

			if($.isFunction(check)) {
				checkSuccess = (check.call(that) !== false) ? true : false;
			}

			if(!checkSuccess) {
				event.preventDefault();
				return false;
			}

			if(!o.type) {
				var m = form.attr('method');
				o.type = !m ? 'GET' : m.toLocaleUpperCase();
			}

			if(!o.url) {
				var action = form.attr('action');
				o.url = !action ? window.location.href : action;
			}

			params = form.serialize();//form序列化, 自动调用了encodeURIComponent方法将数据编码了 
			//params = decodeURIComponent(params, true); //将数据解码

			if(o.type === 'POST') {
				o.data = params;
				//o.isHistory = false;
			}else {
				delete o.data;
				o.url = o.url.match(/[?|&]/g) ? o.url + params : o.url + '?&' +  params;
			}

			delete o.formId;
			delete o.submitId;

			settings = $.extend(true, {}, o);

			that.request(settings);

			event.preventDefault();
			//event.stopPropagation();
			//return false;
		},
		/**
		 * 刷新当前页面，该方法请求 window.location.href 地址
		 */
		refresh: function() {
			this.request({url: window.location.href});
		},
		/**
		 * 绑定<a>链接点击事件
		 * @private
		 */
		bindLink: function() {
			var that = this;
			$('body').delegate('a:not([target=_blank],[target=_top],[target=_parent],[target=_self],[data-bind=unbind])', 'click', function(e) {
				var t = $(this),
					url = t.attr('href'),
					temps = t.attr('data-temps'),
					title = t.attr('data-title'),
					history = t.attr('is-history'),
					scrollTop = t.attr('is-scroll-top'),
					isHistory,
					isScrollTop;

				if( !($.trim(url).match(/#.*/) || $.trim(url).match(/javascript:/)) ) {
					if(history === 'false') {
						isHistory = false;
					}else if(history === '1') {
						isHistory = 'pseudo';
					}
					if(scrollTop === 'false') {
						isScrollTop = false;
					}
					that.request({url: url, temps: temps, title: title, isHistory: isHistory, isScrollTop: isScrollTop});
					e.preventDefault();
				}
			});
		}
	};
	
	/**
	 * 绑定历史地址事件
	 * @private
	 */
	History.Adapter.bind(window, 'statechange', function() {
		var actualState = History.getState(false),
			url = actualState.url;
		//url = url.replace(/[\u4e00-\u9fa5]/g, encodeURIComponent('$0', true));	//对中文进行编码
		if(bitty.isHistoryAction) {
			bitty.request({url: url});
		}
	});
	
})(jQuery, window, doT, History);