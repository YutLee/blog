var editor = $('#blog-body').xheditor({width:'100%',height:500});
var $add = $('#add');
$add.bind({
	'click': function() {
		$('#blog-body').val(editor.getSource());
		app.bitty.ajaxForm({formId: 'insert'});
		return false;
	}	
});