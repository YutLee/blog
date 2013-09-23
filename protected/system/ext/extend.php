<?php
/*
此文件extend.php在App.class.php中默认会加载，不再需要手动加载
用户自定义的函数，建议写在这里

下面的函数是canphp框架的接口函数，
可自行实现功能，如果不需要，可以不去实现

注意：升级canphp框架时，不要直接覆盖本文件,避免自定义函数丢失
*/

/*
//模块执行结束之后，调用的接口函数
function app_end()
{
	//在这里写代码实现你要实现的功能
}
*/

/*
//自定义模板标签解析函数
function tpl_parse_ext($template)
{
	//在这里实现的模块标签替换
	require_once(dirname(__FILE__)."/template_ext.php");
	$template=template_ext($template);
	return $template;

}
*/

/*
//自定义网址解析函数
function url_parse_ext()
{
	//在这里实现的模块标签替换
	App::$module=trim($_GET['m']);
	App::$action=trim($_GET['a']);
}
*/

/*
//自定义模型缓存读取
function db_cache_get_ext($key)
{
	return $data;
}
*/

/*
自定义模型缓存设置，
$key：字符串，需要自行创建哈希索引，如md5($key)
$data：字符串或数组，需要自行序列化
$expire：缓存时间，单位秒
*/
/*
function db_cache_set_ext($key,$data,$expire)
{
	return true;
}
*/

//下面是用户自定义的函数
function tpl_parse_ext($template)
{
    //php标签
    /*
      {php echo phpinfo();}	=>	<?php echo phpinfo(); ?>
    */
    $template = preg_replace ( "/\{php\s+(.+)\}/", "<?php \\1?>", $template );
		
    //if 标签
    /*
      {{? it['name'] }}		    =>	<?php if ($_SESSION['tpl']['name']){ ?>
      {{?? it['name']=='a' }}	=>	<?php } elseif ($_SESSION['tpl']['name']=='a'){ ?>
      {{??}}				    =>	<?php } else { ?>
      {{?}}				        =>	<?php } ?>
    */        
    $template = preg_replace ( "/\{\{\?\s+it(.+?)\}\}/", "<?php if(\$_SESSION['tpl']\\1) { ?>", $template );
    $template = preg_replace ( "/\{\{\?\?\}\}/", "<?php } else { ?>", $template );
    $template = preg_replace ( "/\{\{\?\?\s+it(.+?)\s*\}\}/", "<?php } elseif (\$_SESSION['tpl']\\1) { ?>", $template );
    $template = preg_replace ( "/\{\{\s*\?\s*\}\}/", "<?php } ?>", $template );
		
		
    //for 标签
    /*
      {for $i=0;$i<10;$i++}	=>	<?php for($i=0;$i<10;$i++) { ?>
      {/for}					=>	<?php } ?>
    */
    $template = preg_replace("/\{for\s+(.+?)\}/","<?php for(\\1) { ?>",$template);
    $template = preg_replace("/\{\/for\}/","<?php } ?>",$template);
				
    // for in
    /*
      {{ for( var key in obj ){ }}
        {{=obj['key']}}
      {{ } }}
     */
    $loop = 0;
    $template = preg_replace_callback ( "/\{\{\s*for\s*\(\s*var\s+(.+?)\s+in\s+it(.+?)\s*\)\s*\{\s*\}\}(.+?)\{\{\s*\}\s*\}\}/s", function( $m ){
            if ( $m[3] )
            {
                // value
                $m[3] = preg_replace_callback( '/\{\{\=it\[(.+?)\]\[(.+)\]\s*\}\}/', function($match){                        
                        return "<?php echo \$_SESSION['tpl'][$match[2]]; ?>";
                    }, $m[3]);
                // key
                $str = preg_replace_callback( '/\{\{\=(.+?)\s*\}\}/', function($match){
                        return "<?php echo \$$match[1]; ?>";  
                    }, $m[3]);
                
            }
            $tmp = uniqid();
            return "<?php foreach(\$_SESSION['tpl']$m[2] as \$$m[1]=>\$v{$tmp}) { ?> $str <?php } ?>";
        }, $template );
    
    // array
    /*
     * {{~ it['array'] :value :key}} => foreach( $_SESSION['tpl']['array'] as $key=>$value ){     
     *   {{=value}}                  => echo $value;
     * {{~}}                         => }
     */
    $template = preg_replace_callback( "/\{\{~\s*it\[(.+?)\]\s+:(.+?)\s+:(.+?)\}\}(.+)\{\{\s*~\s*\}\}/s", function($m){
            $str = preg_replace( "/\{\{=(.+?)\}\}/", '<?php echo \$\1; ?>', $m[4] );
            return "<?php foreach(\$_SESSION['tpl'][$m[1]] as \$$m[3]=>\$$m[2]) { ?> $str <?php } ?>";
        }, $template);
    //echo $template;exit;
        
    //变量/常量 标签
    /*
      {{=it['name']}}	=>	<?php echo $_SESSION['tpl']['name']; ?>
    */
    $template = preg_replace ( "/\{\{=it(.+?)\}\}/s", "<?php echo \$_SESSION['tpl']\\1;?>", $template );
    //echo $template;exit;
    return $template;
}
?>