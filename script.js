(() => {
  "use strict";
  const root=document.documentElement;
  const header=document.querySelector("[data-header]");
  const nav=document.querySelector("[data-nav]");
  const menuToggle=document.querySelector("[data-menu-toggle]");
  const themeToggle=document.querySelector("[data-theme-toggle]");

  let stored=null;
  try{stored=localStorage.getItem("rkr-theme")}catch{}
  if(stored==="dark"||stored==="light") root.dataset.theme=stored;
  else root.dataset.theme=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";

  const updateThemeLabel=()=>themeToggle?.setAttribute(
    "aria-label",
    root.dataset.theme==="dark"?"Switch to light theme":"Switch to dark theme"
  );
  updateThemeLabel();

  themeToggle?.addEventListener("click",()=>{
    root.dataset.theme=root.dataset.theme==="dark"?"light":"dark";
    updateThemeLabel();
    try{localStorage.setItem("rkr-theme",root.dataset.theme)}catch{}
  });

  function closeMenu(){
    nav?.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded","false");
    menuToggle?.setAttribute("aria-label","Open navigation");
  }
  menuToggle?.addEventListener("click",()=>{
    const open=menuToggle.getAttribute("aria-expanded")==="true";
    menuToggle.setAttribute("aria-expanded",String(!open));
    menuToggle.setAttribute("aria-label",open?"Open navigation":"Close navigation");
    nav?.classList.toggle("is-open",!open);
  });
  nav?.querySelectorAll("a").forEach(a=>a.addEventListener("click",closeMenu));
  document.addEventListener("keydown",e=>{
    if(e.key==="Escape"){closeMenu();menuToggle?.focus()}
  });

  function updateHeader(){
    header?.classList.toggle("is-scrolled",window.scrollY>10);
  }
  updateHeader();
  window.addEventListener("scroll",updateHeader,{passive:true});

  if(!("IntersectionObserver" in window)) return;
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const items=document.querySelectorAll(
    ".research-item,.project-card,.publication-card,.news-item,.education-timeline li,.profile-links,.email-cta,.explore-card"
  );
  const observer=new IntersectionObserver((entries,o)=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add("is-visible");
      o.unobserve(entry.target);
    });
  },{rootMargin:"0px 0px -8% 0px",threshold:.08});
  items.forEach(item=>{item.setAttribute("data-reveal","");observer.observe(item)});
  document.body.classList.add("reveal-ready");
})();