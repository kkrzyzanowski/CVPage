export async function waitForAnimation(el, event = 'animationend') {
  return new Promise(resolve => {
    el.addEventListener(event, resolve, { once: true });
  });
}