function addEvent(obj, ev, callback) {
  if (obj.addEventListener) {
    obj.addEventListener(ev, callback, false)
  } else {
    obj.attachEvent('on' + ev, callback)
  }
}

function mouseWheel(obj, callback) {

  var timeHandler = null

  function wheel(ev) {
    if (timeHandler) {
      clearTimeout(timeHandler)
      timeHandler = null
    }

    timeHandler = setTimeout(function() {
      timeHandler = null

      var bDown = true;
      var oEvent = ev || event;
      if (oEvent.detail) {
        if (oEvent.detail > 0) {
          bDown = true;
        } else {
          bDown = false;
        }
      } else {
        if (oEvent.wheelDelta > 0) {
          bDown = false;
        } else {
          bDown = true;
        }
      }
      
      callback && callback(bDown);

      oEvent.preventDefault && oEvent.preventDefault();
      
    }, 10)

    return false;
  }

  if (window.navigator.userAgent.toLowerCase().indexOf('firefox') != -1) {
    obj.addEventListener('DOMMouseScroll', wheel, false);
  }
  addEvent(obj, 'mousewheel', wheel);

}
