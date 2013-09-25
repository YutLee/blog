var CHOSE = 'chose';
$('tbody tr').each(function(index, element) {
	var $t = $(this),
        $checkbox = $t.children('td').eq(0).find('input[type=checkbox]');
	$checkbox.bind({
		'click': function(e) {
			var $t = $(this);
			$t.attr('checked') ? 
				$t.attr('checked', 'checked').closest('tr').addClass(CHOSE) : 
				$t.removeAttr('checked').closest('tr').removeClass(CHOSE);
			e.stopPropagation();
		}	
	});
	$(this).bind({
		'click': function() {
			var url = $t.attr('data-link'),
				temp = $t.attr('data-temp');
			app.bitty.request({url: url, temp: temp});
		}	
	});
});


$('thead tr').children('th').eq(0).find('input[type=checkbox]').bind({
	'click': function() {
		var $t = $(this);
		$t.attr('checked') ? 
				$t.attr('checked', 'checked').closest('thead').next('tbody').find('input[type=checkbox][checked!=checked]').click() :
				$t.removeAttr('checked').closest('thead').next('tbody').find('input[type=checkbox][checked=checked]').click();
	}
});

$('#dele').bind({
	'click': function() {
		app.bitty.ajaxForm({formId: 'home'});
		return false;
	}	
});
