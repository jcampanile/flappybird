function handle() {
 //(https://css-tricks.com/scaled-proportional-blocks-with-css-and-javascript/)
 let scaledWrapper = document.getElementsByClassName('body')[0];
 let applyScaling = scaledWrapper => {
  let scaledContent = scaledWrapper.getElementsByClassName('container')[0];
  scaledContent.style.transform = 'scale(1, 1)';
  let { width: cw, height: ch } = scaledContent.getBoundingClientRect();
  let { width: ww, height: wh } = scaledWrapper.getBoundingClientRect();
  let scaleAmtX = Math.min(ww / cw, wh / ch);
  scaledContent.style.transform = `scale(${scaleAmtX}, ${scaleAmtX})`;
  if (scaledWrapper.clientHeight / 420 > scaledWrapper.clientWidth / 300) {
   scaledContent.style.height = scaledWrapper.clientHeight / scaleAmtX + 'px';
  } else {
   scaledContent.style.height = 420 + 'px';
  }
 };
 applyScaling(scaledWrapper);
 window.onresize = handle;
}