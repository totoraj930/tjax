var tjax = new Tjax({
	areas: ["#tjax_area"],
	wait: 400
});
document.addEventListener("click", function (event) {
	var $t = event.target;
	if ($t.hasAttribute("data-tjax")) {
		event.preventDefault();
		event.stopPropagation();
		tjax.load($t.href);
		return false;
	}
});
document.addEventListener("tjax:start", function () {
	console.log("tjax:start");
	stopAnimation();
	document.querySelector("#tjax_area").style.opacity = 1;
	fadeOut(document.querySelector("#tjax_area"), 300);
});
document.addEventListener("tjax:end", function () {
	console.log("tjax:end");
	stopAnimation();
	document.querySelector("#tjax_area").style.opacity = 0;
	fadeIn(document.querySelector("#tjax_area"), 300);
});

var animationInterval;
function fadeIn(elm, _duration) {
	var duration = _duration > 10? _duration:400,
		startT = new Date().getTime(),
		endT = startT+duration,
		nowT;
	animationInterval = setInterval(function () {
		nowT = new Date().getTime();
		var val = (nowT-startT)/duration;
		val = val > 1 ? 1 : val;
		if (val >= 1) stopAnimation();
		elm.style.opacity = val;
	}, 1);
}
function fadeOut(elm, _duration) {
	var duration = _duration > 10? _duration:400,
		startT = new Date().getTime(),
		endT = startT+duration,
		nowT;
	animationInterval = setInterval(function () {
		nowT = new Date().getTime();
		var val = (nowT-startT)/duration;
		val = val > 1 ? 1 : val;
		if (val >= 1) stopAnimation();
		elm.style.opacity = 1-val;
	}, 1);
}

function stopAnimation() {
	clearInterval(animationInterval);
}