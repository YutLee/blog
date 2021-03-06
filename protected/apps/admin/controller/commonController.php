<?php
//公共类
class commonController extends baseController
{
	public $layout = '';
	public $HEADERS;
	
	public function __construct() {
		parent::__construct();              		
		@session_start();//开启session
		$this->HEADERS = getallheaders();
	}

	public function loadhtml() {
		$page = $_GET['html'];
		$this->display($page);	
	}

	/**
	 * 加载页面基本框架
	 * @param {Json} $data 页面数据
	 */
	public function loadFrame($data) {
		if($data == '') {
			$data = '{}';
		}
		$this->display('html/header');
		echo '<script>(function(bitty) {bitty.initData = '.$data.';bitty.init();})(bitty);</script>';
		$this->display('html/footer');
	}
	
	/**
	 * 判断页面是否首次加载
	 * @return {Boolean} 返回true则是首次加载
	 */
	public function isFirstLoading() {
		return ($this->HEADERS['Accept'] == 'application/json') ? false : true;
	}
	
	/**
	 * 获取客户端请求的数据
	 * @return {Object} 返回客户端请求的数据
	 */
	public function getRequest() {
		$request = array(
			'temps' => explode(',', $this->HEADERS['Temps']),
			'no_exist' => explode(',', $this->HEADERS['No-Exist'])
		);
		return $request;
	}
	
	/**
	 * 加载页面模板及数据
	 * @param {Json} $data 页面模板和数据
	 */
	public function loadPage($data) {
		$temp_url = $data['temp_url'];
		$hint = $data['hint'];
		
		if($hint) {
			$result = array(
				'hint' => $hint
			);
			$this->printJson($result);
			return false;
		}
		
		if($this->isFirstLoading()) {
			$new_temps = $temp_url;
			$new_no_exist = $temp_url;
		}else {
			$request = $this->getRequest();
			$re_temps = $request['temps'];	//客户端请求的模板
			$no_exist = $request['no_exist'];	//未缓存的模板
			
			$new_temps = (count($re_temps) > 0 && $re_temps[0] != '') ? array_intersect($temp_url, $re_temps) : $temp_url;
			$new_no_exist = (count($no_exist) > 0 && $no_exist[0] == 'none') ? $temp_url : array_intersect($temp_url, $no_exist);
		}
		
		$p = 'p';
		$temp = array();
		$temp_id = array();
		$data_data = array();
		$mod = array();
		foreach($new_temps as $key => $value) {	//获取请求的数据
			$k = $p.$key;
			$temp_id[$k] = $value;
			$data_data[$k] = $data['data'][$key];
			$mod[$k] = $data['mod'][$key];
		}
		foreach($new_no_exist as $key => $value) {	//获取未缓存的模板
			$k = $p.$key;
			$temp[$k] = $this->display($value, true);
		}
		$new_data = array(
			'temp_url' => $temp_url,
			'temp_id'  => $temp_id,
			'temp'     => $temp,
			'data'	   => $data_data,
			'mod'      => $mod
		);
		$merge_data = array_merge($data, $new_data);
		foreach($merge_data['data'] as $key => $value) {
			if(!$value || $value == '') {
				unset($merge_data['data'][$key]);	//删除空的数据
			}
		}
		foreach($merge_data as $key => $value) {
			if(!$value || (is_array($value) && count($value) == 0)) {
				unset($merge_data[$key]);
			}
		}
		
		$this->printJson($merge_data);
	}
	
	/**
	 * 打印Json数据
	 * @param {Json} $data 需要打印的数据
	 * @return {Json} $data
	 */
	public function printJson($data) {
		if($data['code'] == '') {
			//$data['code'] = 1;
		}
		$result = json_encode($data);
		if($this->isFirstLoading()) {
			$this->loadFrame($result);
		}else {
			echo $result;
		}
	}
	
	/** 检测登录 */
	public function isLogin($isLoginPage = false) {
		if(!isset($_SESSION['userid']) && !$isLoginPage) {
			$hint = array(
				'url' => __AAPP__ . '/user/login'
			);
			$result = array(
				'hint' => $hint
			);
			$this->loadPage($result);
			exit;
		}else if(isset($_SESSION['userid']) && $isLoginPage) {
			$hint = array(
				'url' => __AAPP__
			);
			$result = array(
				'hint' => $hint
			);
			$this->loadPage($result);
			exit;
		}
	}
}
?>