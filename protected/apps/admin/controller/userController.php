<?php
class userController extends commonController
{ 	

	public function login() {
		$this->isLogin(true);
		
		$name = $_POST['name'];
		$password = $_POST['password'];
		
		if(empty($name) || empty($password)) {
			$data = array(
				'0' => array(
					'name' => $name
				)
			);
			$temp_url = array(
				'0' => 'html/login'
			);
			$mod = array(
				'0' => '#m-login'
			);
	
			$result = array(
				'temp_url' => $temp_url,
				'mod'      => $mod,
				'data' => $data
			);
		}else {
			$user = model('user')->login('"' .$name . '"', '"' .$password .'"');	
			if($user) {
				$_SESSION['userid'] = $user[0]['id'];
				$success_tip = '登录成功';
				$url = $this->HEADERS['X-Referer'];
			}else {
				$error_tip = '用户名或密码出错';
			}
			
			$hint = array(
				'url' => $url,
				'error_tip' => $error_tip,
				'success_tip' => $success_tip
			);
	
			$result = array(
				'hint' => $hint
			);
		}
		$this->loadPage($result);
    }
	
	public function index() {
		$data = array(
			'login' => __AAPP__ . '/user/login'
		);
		$temp_url = array(
			'0' => 'html/home'
		);
		$mod = array(
			'0' => '#mod-content'
		);

		$result = array(
			'temp_url' => $temp_url,
			'mod'      => $mod,
			'data' => $data
		);
		$this->loadPage($result);
    }

}
?>