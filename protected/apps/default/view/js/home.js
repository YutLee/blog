function t() {
	function e() {
		var e = i.height(),
		t = e - (u - l);
		if (a !== e) {
			a > t && (c = a - t + p - c, s.css("padding-bottom", c));
			var d = r.scrollTop(),
			h = u - d;
			h > l ? (o.removeClass("frozen"), n.css("height", h)) : (o.addClass("frozen"), n.css("height", l))
		}
	}
	function t() {
		a = r.height()
	}
	var a,
	l = 65,
	u = n.outerHeight(),
	c = 0,
	p = parseInt(s.css("padding-bottom"), 10);
	r.resize(t),
	r.scroll(e),
	t(),
	e()
}
var n = $('.blog .content .opened');
if (n.length) {
	var r = $(window),
	i = $(document),
	o = $("body"),
	s = $("#content");
	t()
}
