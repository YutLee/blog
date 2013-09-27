<?php
class homeModel extends baseModel
{    
    protected $table = 'blog';

    function __construct(  )
    {
        parent::__construct(  );
    }
    
    public function getLists( )
    {
        return $this->select('1', 'id, title, created, preview, likes', 'created desc', '10');
    }
	/* 通过id取得文章详细 */
	public function getDetail( $id )
    {
        return $this->select('id=' . $id);
    }
	
	public function add( $data ) 
	{
		return $this->insert($data);	
	}
	
	public function delete( $data ) 
	{
		return $this->query($data);	
	}
    
}