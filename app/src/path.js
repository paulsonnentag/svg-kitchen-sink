(function () {
  'use strict';

  var startHandle, endHandle;
  var $handleStart = document.getElementById('handle-start');
  var $handleEnd = document.getElementById('handle-end');
  var $startX = document.getElementById('start-x');
  var $startY = document.getElementById('start-y');
  var $endX = document.getElementById('end-x');
  var $endY = document.getElementById('end-y');
  var $path = document.getElementById('path');

  startHandle = handle($handleStart);
  endHandle = handle($handleEnd).map(function (pos) {
    var [x, y] = pos;
    return [
      x - $startX.value,
      y - $startY.value
    ];
  });

  Bacon.combineAsArray(
    input($startX).merge(startHandle.map(x)).toProperty(+$startX.value),
    input($startY).merge(startHandle.map(y)).toProperty(+$startY.value),
    input($endX).merge(endHandle.map(x)).toProperty(+$endX.value),
    input($endY).merge(endHandle.map(y)).toProperty(+$endY.value)
  )
    .onValues(updateGraph);

  function input ($el) {
    return Bacon.fromEventTarget($el, 'input')
      .map(evt => +evt.target.value);
  }

  function handle ($el) {
    return Bacon.fromEventTarget($el, 'mousedown')
      .flatMap(function () {
        var mousemove = Bacon.fromEventTarget(document, 'mousemove');
        var mouseup = Bacon.fromEventTarget(document, 'mouseup');

        return mousemove
          .takeUntil(mouseup)
          .map(evt => [evt.x, evt.y]);
      });
  }

  function x (pos) {
    return pos[0];
  }

  function y (pos) {
    return pos[1];
  }

  function updateGraph (startX, startY, endX, endY) {
    $handleStart.setAttribute('cx', startX);
    $handleStart.setAttribute('cy', startY);
    $handleEnd.setAttribute('cx', endX + startX);
    $handleEnd.setAttribute('cy', endY + startY);
    $path.setAttribute('d', 'M' + startX + ' ' + startY + ' l' + endX + ' ' + endY);
    $startX.value = startX;
    $startY.value = startY;
    $endX.value = endX;
    $endY.value = endY;
  }

}());