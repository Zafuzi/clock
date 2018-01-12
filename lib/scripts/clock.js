'use strict';
const RED = "#f44336",
	BLUE = "#3F51B5",
	GREEN = "#4CAF50",
	YELLOW = "#FFEB3B",
	PI_2 = Math.PI * 2,
	PI_05 = Math.PI * 0.5

var context, clock = {},
	canvas = $('#clock')[0],
	menu_open = false,
	CURRENTCOLOR = RED;

$(function() {
	$(window).resize(function() {
		var $window = $(window);

		$('#clock').attr({
			width: $window.width(),
			height: $window.height() - 40
		});

		clock.center = {
			x: Math.floor($window.width() / 2),
			y: Math.floor($window.height() / 2 - 20)
		};
		clock.size = {
			half: Math.floor(Math.min(canvas.width, canvas.height) * 0.45)
		};
		clock.size.full = clock.size.half * 2;

		context = canvas.getContext('2d');
		context.lineCap = 'round';
		context.lineJoin = 'round';

		refresh();
	}).resize();

	window.setInterval(refresh, 60);
	addButtonListeners();
});

function addButtonListeners() {
	$('#blueBTN').click(function() {
		setColor(BLUE);
	});
	$('#redBTN').click(function() {
		setColor(RED);
	});
	$('#greenBTN').click(function() {
		setColor(GREEN);
	});
	$('#yellowBTN').click(function() {
		setColor(YELLOW);
	});
	$('#go_fullscreen').click('click', function() {
		document.body.webkitRequestFullscreen();
	});
	$('#exit_fullscreen').click('click', function() {
		// exit full-screen
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		}
	});

	// Menu Toggle button
	$("#menu_toggle").click(e => {
		e.preventDefault()
		toggleMenu()
		console.log("Menu Toggled")
	})
	let clockBG = rgb2hex($('#clock').css('backgroundColor'));
	$('#bgcolor_picker')[0].value = clockBG;
	$('#accentColor_picker')[0].value = RED;

	$('#bgcolor_picker').on('change', function(e) {
		$('#clock').css('background', $(this).val())
	})
	$('#accentColor_picker').on('change', function(e) {
		setColor($(this).val())
	})
}

function rgb2hex(rgb) {
	if (rgb.search("rgb") == -1) {
		return rgb;
	} else {
		rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);

		function hex(x) {
			return ("0" + parseInt(x).toString(16)).slice(-2);
		}
		return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
	}
}

function drawClockFrame() {
	var min,
		radius,
		rotate_arg = (1 / 60) * PI_2,
		radius_small = clock.size.half * 0.005;

	context.save();
	context.translate(clock.center.x, clock.center.y);
	context.rotate(-PI_05);

	context.lineWidth = 0;
	context.strokeStyle = '';
	context.fillStyle = CURRENTCOLOR;

	for (min = 0; min < 60; min++) {

		var y = new Date(),
			sec = y.getSeconds();

		context.beginPath();
		context.arc(clock.size.half, 0, radius_small, 0, PI_2);
		context.fill();

		context.rotate((rotate_arg / 60) * sec);
	}

	context.restore();
}

function drawClockFrameMinutes() {
	var min,
		radius,
		rotate_arg = (1 / 60) * PI_2,
		radius_large = clock.size.half * 0.02,
		radius_small = clock.size.half * 0.01;
	context.save();
	context.translate(clock.center.x, clock.center.y);
	context.rotate(-PI_05);
	context.lineWidth = 0;
	context.strokeStyle = '';
	context.fillStyle = 'rgba(100, 100, 100, 1)';
	for (min = 0; min < 60; min++) {
		radius = (min % 15 === 0) ? radius_large : radius_small;
		var y = new Date(),
			sec = y.getMinutes();
		context.beginPath();
		context.arc(clock.size.half / 1.1, 0, radius, 0, PI_2);
		context.fill();
		context.rotate((rotate_arg / 60) * sec);
	}
	context.restore();
}

function drawMinute() {
	var now = new Date(),
		arg = (now.getMinutes() / 60 + now.getSeconds() / 3600) * PI_2 - PI_05,
		size = 0.8;

	context.save();
	context.translate(clock.center.x, clock.center.y);
	context.rotate(arg);

	context.lineWidth = clock.size.half * 0.06;
	context.strokeStyle = CURRENTCOLOR;

	context.beginPath();
	context.moveTo(0, 0);
	context.lineTo(clock.size.half * size, 0);
	context.stroke();

	context.restore();
}

function drawHour() {
	var now = new Date(),
		arg = ((now.getHours() % 12) / 12 + now.getMinutes() / 720) * PI_2 - PI_05,
		size = 0.65;

	context.save();
	context.translate(clock.center.x, clock.center.y);
	context.rotate(arg);

	context.lineWidth = clock.size.half * 0.08;
	context.strokeStyle = 'rgba(100, 100, 100, .5)';

	context.beginPath();
	context.moveTo(0, 0);
	context.lineTo(clock.size.half * size, 0);
	context.stroke();

	context.restore();
}

function drawButton() {
	context.beginPath();
	context.fillStyle = CURRENTCOLOR;
	context.arc(clock.center.x, clock.center.y, clock.size.half * 0.1, 0, PI_2);
	context.fill();
}

function drawTimeText() {
	var now = new Date();
	var hours = now.getHours();
	if (hours > 12) {
		hours -= 12;
	} else if (hours === 0) {
		hours = 12;
	}
	var minutes = now.getMinutes();
	var minuteText;
	if (minutes < 10) {
		minuteText = "";
		minuteText = "0" + now.getMinutes();
	} else {
		minuteText = "";
		minuteText = now.getMinutes();
	}
	var seconds = " |" + now.getSeconds();
	var format = hours + "." + minuteText + "." + now.getSeconds();
	context.strokeStyle = CURRENTCOLOR;
	if (minutes <= 15 || minutes >= 55) {
		var fontSize = seconds;
		context.font = "24px Monospace";
		context.fillText(format, clock.center.x, clock.center.y * 1.3);
	} else {
		context.font = "24px Monospace";
		context.fillText(format, clock.center.x, clock.center.y / 1.2);
	}

}

function refresh() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	drawClockFrame();
	drawClockFrameMinutes();
	drawHour();
	drawMinute();
	drawButton();
	drawTimeText();
}

function setColor(color) {
	CURRENTCOLOR = color;
}

function viewportToPixel(val) {
	var percent = val.match(/\d+/)[0] / 100,
		unit = val.match(/[vwh]+/)[0];
	return (unit == 'vh' ? $(window).height() : $(window).width()) * percent +
		'px';
}

function toggleMenu() {
	menu_open = !menu_open
	$('header').animate({
		'left': menu_open ? 0 : '-30vw'
	});

	let x = parseFloat(viewportToPixel('20vw'))
	let toggle_width = $('#menu_toggle').width()
	x = x - toggle_width - 10

	$('#menu_toggle').animate({
		'left': menu_open ? x : 0
	}).text(menu_open ? 'X' : '\u2630')
	console.log(menu_open)
}
