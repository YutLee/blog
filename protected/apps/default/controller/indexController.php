<?php
class indexController extends commonController
{ 
    public function index() {
		//界面显示数据
		$lists = model('home')->getLists();	//查询所有文章
		for($i = 0; $i < count($lists); $i++) {
			$lists[$i]['date'] = date('Y/m/d', strtotime($lists[$i]['created']));
			$lists[$i]['link'] = url('index/detail') . '&id=' . $lists[$i]['id'];
		}
		$data = array(
			'0' =>	array('lists' => $lists)
		);
		$temp_url = array(
			'0' => 'html/home'
		);
		$mod = array(
			'0' => '#mod_index'
		);

		$result = array(
			'temp_url' => $temp_url,
			'mod'      => $mod,
			'data'	   => $data,
			'js_url'   => array(__APPVIEW__ .'/js/home.js')
		);
		$this->loadPage($result);	
		if ($data) $_SESSION['tpl']=$data;
    }
	
	public function detail() {
		$id = $_GET['id'];
		$data = model('home')->getDetail($id);	//根据id查询文章
		$data[0]['date'] = date('Y/m/d', strtotime($data[0]['created']));

		$temp_url = array(
			'0' => 'html/detail'
		);
		$mod = array(
			'0' => '#mod_index'
		);
		$result = array(
			'temp_url' => $temp_url,
			'data'     => $data,
			'mod'      => $mod,
			'js_url'   => array(__APPVIEW__ .'/js/home.js')
		);
		$this->loadPage($result);
		
		if ($data) $_SESSION['tpl']=$data;	
    }
}
?>