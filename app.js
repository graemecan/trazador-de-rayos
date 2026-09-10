
/* ===== Resaltador de C ligero ===== */
(function(){
  const KW=new Set(['if','else','for','while','do','return','switch','case','break','continue','default','goto','sizeof','typedef','struct','enum','union','const','static','inline','void','extern','volatile','register']);
  const TYPES=new Set(['int','double','float','char','long','short','unsigned','signed','FILE','size_t','bool','vec3','point3','color','ray','sphere','material','material_type','hit_record','hittable_list','camera']);
  function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  function hl(code){
    const re=/(\/\*[\s\S]*?\*\/|\/\/[^\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(^[ \t]*#[^\n]*)|(\b\d[\w.]*\b)|([A-Za-z_]\w*)|([\s\S])/gm;
    let out='',m;
    while((m=re.exec(code))){
      if(m[1])out+='<span class="c-com">'+esc(m[1])+'</span>';
      else if(m[2])out+='<span class="c-str">'+esc(m[2])+'</span>';
      else if(m[3])out+='<span class="c-pre">'+esc(m[3])+'</span>';
      else if(m[4])out+='<span class="c-num">'+esc(m[4])+'</span>';
      else if(m[5]){const w=m[5];
        if(KW.has(w))out+='<span class="c-kw">'+w+'</span>';
        else if(TYPES.has(w))out+='<span class="c-type">'+w+'</span>';
        else if(/^[A-Z][A-Z0-9_]{1,}$/.test(w))out+='<span class="c-const">'+w+'</span>';
        else out+=esc(w);
      } else out+=esc(m[6]);
    }
    return out;
  }
  function build(){
    document.querySelectorAll('script.srccode').forEach(function(s){
      const raw=s.textContent.replace(/^\n/,'').replace(/\s+$/,'');
      const file=s.getAttribute('data-file')||'';
      const wrap=document.createElement('div');wrap.className='codewrap';
      const bar=document.createElement('div');bar.className='codebar';
      bar.innerHTML='<span class="lights"><i></i><i></i><i></i></span>'+
        (file?'<span class="fname">archivo · <b>'+esc(file)+'</b></span>':'<span class="fname">C</span>');
      const btn=document.createElement('button');btn.className='copy';btn.type='button';btn.textContent='Copiar';
      btn.addEventListener('click',function(){
        (async()=>{try{await navigator.clipboard.writeText(raw);btn.textContent='¡Copiado!';}catch(e){btn.textContent='Ctrl+C';}setTimeout(()=>btn.textContent='Copiar',1400);})();
      });
      bar.appendChild(btn);
      const pre=document.createElement('pre');pre.className='code';
      const code=document.createElement('code');code.innerHTML=hl(raw);
      pre.appendChild(code);
      wrap.appendChild(bar);wrap.appendChild(pre);
      s.parentNode.replaceChild(wrap,s);
    });
  }
  /* ===== Índice automático + scrollspy ===== */
  function toc(){
    const list=document.getElementById('tocList');if(!list)return;
    const inline=document.getElementById('tocListInline');
    const secs=document.querySelectorAll('main .tarea');
    secs.forEach(function(sec){
      const id=sec.id;const num=sec.getAttribute('data-num')||'';const t=sec.getAttribute('data-title')||id;
      const li=document.createElement('li');
      li.innerHTML='<a href="#'+id+'"><span class="n">'+num+'</span><span>'+t+'</span></a>';
      list.appendChild(li);
      if(inline){const li2=document.createElement('li');
        li2.innerHTML='<a href="#'+id+'">'+num+'. '+t+'</a>';inline.appendChild(li2);}
    });
    const links=Array.from(list.querySelectorAll('a'));
    const byId={};links.forEach(function(a){byId[a.getAttribute('href').slice(1)]=a;});
    if('IntersectionObserver' in window){
      const obs=new IntersectionObserver(function(ents){
        ents.forEach(function(e){
          if(e.isIntersecting){links.forEach(a=>a.classList.remove('active'));
            const a=byId[e.target.id];if(a)a.classList.add('active');}
        });
      },{rootMargin:'-10% 0px -80% 0px',threshold:0});
      secs.forEach(s=>obs.observe(s));
    }
  }
  /* ===== Tema ===== */
  function theme(){
    const btn=document.getElementById('themeBtn');const root=document.documentElement;
    let saved=null;try{saved=localStorage.getItem('rt-theme');}catch(e){}
    if(saved)root.setAttribute('data-theme',saved);
    function label(){
      let cur=root.getAttribute('data-theme');
      const dark=cur==='dark'||(!cur&&window.matchMedia('(prefers-color-scheme:dark)').matches);
      document.getElementById('themeIcon').textContent=dark?'☀':'☾';
      document.getElementById('themeLabel').textContent=dark?'Claro':'Oscuro';
    }
    label();
    btn.addEventListener('click',function(){
      let cur=root.getAttribute('data-theme');
      const dark=cur==='dark'||(!cur&&window.matchMedia('(prefers-color-scheme:dark)').matches);
      const next=dark?'light':'dark';
      root.setAttribute('data-theme',next);
      try{localStorage.setItem('rt-theme',next);}catch(e){}
      label();
    });
  }
  document.addEventListener('DOMContentLoaded',function(){build();toc();theme();});
})();
