chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('../clock.html', {
    "bounds": {
      "width": 800,
      "height": 800
    }
  });
});
