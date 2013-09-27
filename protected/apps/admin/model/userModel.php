<?php
class userModel extends baseModel
{    
    protected $table = 'user';

    function __construct(  )
    {
        parent::__construct(  );
    }
	
	public function login( $name, $passwd)
    {
        return $this->select('name=' . $name . ' and password=' . $passwd);
    }
    
}