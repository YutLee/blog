<?php
class indexController extends commonController
{ 
    public function index() {
		$lists = model('home')->getLists();	//查询所有文章
		for($i = 0; $i < count($lists); $i++) {
			$lists[$i]['date'] = date('Y/m/d', strtotime($lists[$i]['created']));
			$lists[$i]['link'] = url('index/detail') . '&id=' . $lists[$i]['id'];
		}
		$data = array(
			'0' => '',
			'1' =>	array('lists' => $lists)
		);
		$temp_url = array(
			'0' => 'html/nav',
			'1' => 'html/home'
		);
		$mod = array(
			'0' => '#mod-main-nav',
			'1' => '#mod-content'
		);

		$result = array(
			'temp_url' => $temp_url,
			'mod'      => $mod,
			'data'	   => $data,
			'js_url'   => array(__APPVIEW__ .'/js/home.js')
		);
		$this->loadPage($result);
    }
	
	public function detail() {
		$id = $_GET['id'];
		$detail = model('home')->getDetail($id);	//根据id查询文章
		$detail[0]['date'] = date('Y/m/d', strtotime($detail[0]['created']));
		$data = array(
			'0' => '',
			'1' => $detail[0]
		);
		
		$temp_url = array(
			'0' => 'html/nav',
			'1' => 'html/detail'
		);
		$mod = array(
			'0' => '#mod-main-nav',
			'1' => '#mod-content'
		);
		$result = array(
			'temp_url' => $temp_url,
			'data'     => $data,
			'mod'      => $mod
		);
		$this->loadPage($result);	
    }
	
	public function add() {
		
		$data = array(
			'0' => '',
			'1' => ''
		);
		
		$temp_url = array(
			'0' => 'html/nav',
			'1' => 'html/add'
		);
		$mod = array(
			'0' => '#mod-main-nav',
			'1' => '#mod-content'
		);
		$result = array(
			'temp_url' => $temp_url,
			'data'     => $data,
			'mod'      => $mod,
			'js_url'   => array(__APPVIEW__ .'/js/add.js')
		);
		$this->loadPage($result);	
    }
	
	public function insert() {
		$data = array(
			'title' => $_POST['title'],
			'preview' => $_POST['body'],
			'body' => $_POST['body']
		);
		
		$id = model('home')->add( $data );
		
		$errorTip = '';
		$successTip = '';
		$id ? $successTip = '添加文章成功' : $errorTip = '添加文章失败';
		$error = array(
			'url' => url('index/detail') . '&id=' . $id,
			'error_tip' => $errorTip,
			'success_tip' => $successTip
		);

		$result = array(
			'error' => $error
		);
		$this->loadPage($result);	
    }
	
	public function delete() {
		
		$id = $_POST['id'];
		$id = implode(',', $id);
		
		$row = model('home')->delete('delete from blog where id in (' . $id . ')');
		
		$errorTip = '';
		$successTip = '';
		$row > 0 ? $successTip = '删除文章成功' . $id : $errorTip = '删除文章失败';
		$error = array(
			'url' => url('index'),
			'error_tip' => $errorTip,
			'success_tip' => $successTip
		);

		$result = array(
			'error' => $error
		);
		$this->loadPage($result);	
    }
}
?>