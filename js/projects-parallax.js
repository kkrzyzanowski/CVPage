(function(){
  const container = document.querySelector('.projects-container');
  if(!container) return;

  // sensitivity
  const MOUSE_MAX_ROT = 6; // degrees
  const SCROLL_MAX_DEPTH = 40; // px

  let rect = null;
  function refreshRect(){ rect = container.getBoundingClientRect(); }
  refreshRect();
  window.addEventListener('resize', ()=>{ rect = null; });

  function setMouseVars(xDeg, yDeg){
    container.style.setProperty('--mouseX', xDeg + 'deg');
    container.style.setProperty('--mouseY', yDeg + 'deg');
  }

  container.addEventListener('mousemove', (e)=>{
    if(!rect) refreshRect();
    const cx = rect.left + rect.width/2;
    const cy = rect.top + rect.height/2;
    const dx = (e.clientX - cx) / rect.width; // approx -0.5..0.5
    const dy = (e.clientY - cy) / rect.height;
    const xDeg = (-dy * MOUSE_MAX_ROT).toFixed(2);
    const yDeg = (dx * MOUSE_MAX_ROT).toFixed(2);
    setMouseVars(xDeg, yDeg);
  });

  container.addEventListener('mouseleave', ()=> setMouseVars(0,0));

  // scroll depth effect
  let ticking = false;
  function onScroll(){
    if(ticking) return;
    window.requestAnimationFrame(()=>{
      const sc = window.scrollY || window.pageYOffset;
      const depth = Math.min(SCROLL_MAX_DEPTH, sc / 50);
      container.style.setProperty('--scrollDepth', depth + 'px');
      ticking = false;
    });
    ticking = true;
  }
  window.addEventListener('scroll', onScroll, {passive:true});

  // init
  setMouseVars(0,0);
  container.style.setProperty('--scrollDepth', '0px');
})();
