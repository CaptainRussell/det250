/* Spring 2027 proposals. Only organization-chart information is included. */
(() => {
  const seat = (id, des, title, last, rank, parent) => ({id, des, title, last, rank, parent});
  const wing = (cc, cd, cos, ig) => [seat('cc','WG/CC','Wing Commander',cc,'C/Col',null),seat('cd','WG/CD','Deputy Wing Commander',cd,'C/Col','cc'),seat('cos','WG/COS','Chief of Staff',cos,'C/Lt Col','cc'),seat('ig','WG/IG','Inspector General',ig,'C/Lt Col','cc')];
  const director = (code, last) => seat(code,code+'/DT',({A1:'Personnel',A2:'Intelligence',A3:'Operations',A4:'Logistics',A5:'Planning',A6:'Communications',A9:'Assessment and Improvement'})[code]+' Director',last,'C/Maj','cos');
  const officer = (id,des,title,last,parent) => seat(id,des,title,last,'C/Capt',parent);
  const advisor = parent => seat('gmca','WG/GMCA','GMC Advisor','TBD','',parent);
  const squadron = (id, last, parent) => seat(id,id+' SQ/CC',id+' Squadron Commander',last,'C/Maj',parent);
  const proposals = [
    {id:'kingery-helle', name:'Kingery / Helle', source:'Proposed wing chart in Wing Command Package', seats:[
      ...wing('Kingery','Helle','Salas','Hyman'),advisor('cc'),squadron('BCL','Cerfogli','cc'),squadron('BC','Alt','cc'),
      director('A1','Luhring'),director('A2','Cooper'),director('A3','Curtis'),director('A4','Bradlee'),director('A5','Gross'),director('A6','Marschang'),director('A9','Ashbacker'),
      officer('ro','RO','Recruiting Officer','Barszcz','A1'),officer('pa','PA','Public Affairs','Albert','A1'),officer('acdo','ACDO','Academic Officer','Tu','A1'),officer('wello','WELLO','Wellness Officer','Davis','A1'),officer('devo','DEVO','Development Officer','Collier','A1'),
      seat('fso','FSO','Flight Simulator Officer','TBD','','A2'),
      officer('spo','SPO','Special Projects Officer','Figueroa-Baca','A3'),officer('dc','D&C/CC','Drill and Ceremonies Commander','Jalodia','A3'),officer('jro','JRO','Joint Relations Officer','Chien','A3'),
      officer('cto','COTO','Chief of Training Officer','Bienfang','A5'),officer('pfo','PFO','Physical Fitness Officer','Edwardson','A5'),officer('cono','CONO','CONOPS Officer','Bourek','A5')
    ]},
    {id:'alt-bourek',name:'Alt / Bourek',source:'S27 Proposed Unit Manning',seats:[
      ...wing('Alt','Bourek','Hyman','Marschang'),seat('poca','WG/POCA','POC Advisor','Kingery','C/Maj','cd'),advisor('cd'),squadron('BC','Bienfang','cd'),squadron('BCL','Cerfogli','cd'),
      director('A1','Chien'),director('A2','Salas'),director('A3','Edwardson'),director('A4','Van Devander'),director('A5','Gross'),director('A6','Jalodia'),
      officer('acdo','A11/ACDO','Academic Officer','Luhring','A1'),officer('devo','A12/DEVO','Development Officer','Coulthard','A1'),officer('da2','Dep A2/DT','Deputy Intelligence Director','Cooper','A2'),
      officer('seo','A31/SEO','Special Events Officer','Helle','A3'),officer('dc','A32/D&C/CC','Drill and Ceremonies Commander','Figueroa-Baca','A3'),officer('tso','A33/TSO','Tri-Service Officer','Bradlee','A3'),
      seat('cto','A51/COTO','Chief of Training Officer','Ashbacker','C/Maj','A5'),officer('pfo','A52/PFO','Physical Fitness Officer','Davis','A5'),officer('cono','A53/CONO','CONOPS Officer','Barszcz','A5'),officer('ooo','A54/OOO','Objectives and OPORDS Officer','Curtis','A5'),officer('paro','A61/PARO','Public Affairs and Recruiting Officer','Albert','A6')
    ]},
    {id:'salas-bienfang',name:'Salas / Bienfang',source:'Proposed 2027 Organizational Wing Chart',seats:[
      ...wing('Salas','Bienfang','Chien','Figueroa-Baca'),seat('poca','POCA','POC Advisor','Cerfogli','C/Maj','cd'),advisor('cd'),seat('cto','CTO','Chief of Training Officer','Hyman','C/Maj','ig'),squadron('BC','Humiston','cc'),squadron('BCL','Luhring','cc'),
      director('A1','Barszcz'),director('A2','Coulthard'),director('A3','Bourek'),director('A4','Helle'),director('A5','Cooper'),director('A6','Albert'),director('A9','Gross'),
      officer('acwelo','A11 ACWELO','Academics and Wellness Officer','Bradlee','A1'),officer('paro','A12 PARO','Public Affairs and Recruiting Officer','Alt','A1'),officer('devo','A13 DEVO','Development Officer','Collier','A1'),
      officer('spo','A31 SPO','Special Projects Officer','Davis','A3'),officer('dc','A32 D&C/CC','Drill and Ceremonies Commander','Edwardson','A3'),officer('tso','A33 TSO','Tri-Service Officer','Van Devander','A3'),
      officer('da5','A5 Deputy/DT','Deputy Planning Director','Gaul','A5'),officer('pfo','A51 PFO','Physical Fitness Officer','Marschang','A5'),officer('cono','A52 CONO','CONOPS Officer','Jalodia','A5')
    ]}
  ];
  const flightStaff = {
    'kingery-helle':[
      seat('bc-a','BC FLT/CC','BC Flight Commander','Humiston','C/Capt','BC'),
      seat('bc-b','BC FLT/CC','BC Flight Commander','Van Devander','C/Capt','BC'),
      seat('bcl-e','BCL FLT/CC','BCL Flight Commander','Gaul','C/Capt','BCL'),
      seat('bcl-ed','BCL FLT/CD','BCL Deputy Flight Commander','Coulthard','C/Lt','bcl-e'),
      seat('bcl-f','BCL FLT/CC','BCL Flight Commander','Hader','C/Capt','BCL'),
      seat('bcl-fd','BCL FLT/CD','BCL Deputy Flight Commander','Davila','C/Lt','bcl-f')],
    'alt-bourek':[
      seat('bc-a','BC A FLT/CC','Alpha Flight Commander','Humiston','C/Capt','BC'),
      seat('bc-b','BC B FLT/CC','Bravo Flight Commander','Davila','C/Capt','BC'),
      seat('bcl-e','BCL E FLT/CC','Echo Flight Commander','Gaul','C/Capt','BCL'),
      seat('bcl-ed','BCL E FLT/CD','Echo Deputy Flight Commander','Tu','C/Lt','bcl-e'),
      seat('bcl-f','BCL F FLT/CC','Foxtrot Flight Commander','Hader','C/Capt','BCL'),
      seat('bcl-fd','BCL F FLT/CD','Foxtrot Deputy Flight Commander','Collier','C/Lt','bcl-f')],
    'salas-bienfang':[
      seat('bc-a','BC A FLT/CC','Alpha Flight Commander','Tu','C/Capt','BC'),
      seat('bc-b','BC B FLT/CC','Bravo Flight Commander','Curtis','C/Capt','BC'),
      seat('bcl-e','BCL E FLT/CC','Echo Flight Commander','Ashbacker','C/Capt','BCL'),
      seat('bcl-ed','BCL E FLT/CD','Echo Deputy Flight Commander','Kingery','C/1st Lt','bcl-e'),
      seat('bcl-f','BCL F FLT/CC','Foxtrot Flight Commander','Hader','C/Capt','BCL'),
      seat('bcl-fd','BCL F FLT/CD','Foxtrot Deputy Flight Commander','Davila','C/1st Lt','bcl-f')]
  };
  proposals.forEach(p=>p.seats.push(...flightStaff[p.id]));
  proposals[0].seats.find(s=>s.id==='A9').title='Director of Efficiency';
  const dutiesFor = (s,p) => PROPOSAL_DUTIES[p.id][s.id.startsWith('bc-')?'bcflight':s.id.startsWith('bcl-')?(s.id.endsWith('d')?'bcldeputy':'bclflight'):s.id];
  function person(s){
    const entry=Object.entries(PEOPLE).find(([,p])=>p[0]===s.last);
    // Bienfang is not in the Fall 2026 POC roster. Do not infer a class or photo.
    return entry ? {key:entry[0],cls:entry[1][2],full:entry[1][1]+' '+entry[1][0]} : {key:null,cls:'',full:s.last==='Bienfang'?'Mitchell Bienfang':s.last};
  }
  function renderCard(s, p){
    const who=person(s), parent=p.seats.find(x=>x.id===s.parent);
    return `<button type="button" class="proposal-card" data-proposal-seat="${s.id}" data-team="${p.id}" aria-label="${esc(s.des+', '+s.title+': '+who.full+'. Open details')}"><span class="proposal-person">${who.key ? img(who.key,'av '+ringOf(who.cls),'Photo of '+who.full) : '<span class="proposal-initials" aria-hidden="true">'+esc(s.last==='TBD'?'?':'MB')+'</span>'}<span><span class="tags"><span class="des">${esc(s.des)}</span>${who.cls?'<span class="cls '+ringOf(who.cls)+'">'+esc(who.cls)+'</span>':''}</span><span class="nm">${esc([s.rank,s.last].filter(Boolean).join(' '))}</span><span class="ttl">${esc(s.title)}</span></span></span><span class="proposal-reports">Reports to ${esc(parent ? parent.des+' ('+parent.last+')' : 'Operations Flight Commander')}</span></button>`;
  }
  function branch(s,p){
    const children=p.seats.filter(x=>x.parent===s.id);
    return `<li>${renderCard(s,p)}${children.length?'<ul>'+children.map(c=>branch(c,p)).join('')+'</ul>':''}</li>`;
  }
  const host=document.getElementById('spring-proposals');
  host.innerHTML=`<div class="bandhead"><h2>Spring 2027 proposals</h2><span class="rt">Proposed positions for board review</span></div><div class="proposal-nav" role="tablist" aria-label="Proposed 2027 teams">${proposals.map((p,i)=>'<button type="button" role="tab" id="team-tab-'+p.id+'" aria-controls="proposal-'+p.id+'" aria-selected="'+(i===0)+'" tabindex="'+(i===0?0:-1)+'" data-proposal="'+p.id+'">'+esc(p.name.replaceAll(' / ','/'))+'</button>').join('')}</div><p class="proposal-note">All proposed positions are shown. GMC cadet flight rosters are not assigned.</p>`+proposals.map(p=>{
    const directors=p.seats.filter(s=>/^A\d$/.test(s.id));
    const command={...p,seats:p.seats.filter(s=>!/^A\d$/.test(s.id)&&!/^A\d$/.test(s.parent||''))};
    return `<section class="proposal-section" role="tabpanel" tabindex="0" id="proposal-${p.id}" aria-labelledby="team-tab-${p.id}"><h3 id="title-${p.id}">${esc(p.name)} <span>Spring 2027</span></h3><h4>Wing command and flight staff</h4><ul class="proposal-tree">${branch(command.seats.find(s=>s.id==='cc'),command)}</ul><h4>A-Staff Directorates</h4><div class="proposal-directorates">${directors.map(s=>'<article class="proposal-directorate"><h5>'+esc(s.des)+'</h5><ul class="proposal-tree">'+branch(s,p)+'</ul></article>').join('')}</div><p class="proposal-source">Source: ${esc(p.source)}. Proposed ranks and reporting lines follow the submitted chart.</p></section>`;
  }).join('');

  const root=document.documentElement;
  const mainTab=document.getElementById('proposed-chart-tab');
  const params=new URLSearchParams(location.search);
  let selected=proposals.some(p=>p.id===params.get('proposal')) ? params.get('proposal') : 'kingery-helle';
  const hashTeam=location.hash.replace('#proposal-','');
  if(proposals.some(p=>p.id===hashTeam)) selected=hashTeam;
  function selectTeam(id,focus=false){
    closeProposalDetails();hideProposalPeek();
    selected=id;
    host.querySelectorAll('[role="tab"]').forEach(tab=>{
      const active=tab.dataset.proposal===id;
      tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;
      if(active&&focus)tab.focus();
    });
    host.querySelectorAll('[role="tabpanel"]').forEach(panel=>panel.hidden=panel.id!=='proposal-'+id);
    if(root.dataset.chartView==='proposed')saveLocation();
  }
  function saveLocation(){
    const url=new URL(location.href);
    url.searchParams.set('view',root.dataset.chartView==='proposed'?'proposed':MODE);
    if(root.dataset.chartView==='proposed')url.searchParams.set('proposal',selected);
    else {url.searchParams.delete('proposal');url.searchParams.delete('member');}
    url.hash='';history.replaceState(null,'',url.pathname+url.search);
  }
  function showProposals(show){
    closeProposalDetails();hideProposalPeek();
    root.dataset.chartView=show?'proposed':MODE;
    host.hidden=!show;
    document.querySelectorAll('#main > .band, #main > .toolbar').forEach(el=>el.hidden=show);
    mainTab.setAttribute('aria-pressed',String(show));
    document.querySelectorAll('[data-set-mode]').forEach(b=>b.setAttribute('aria-pressed',String(!show&&b.dataset.setMode===MODE)));
    if(show){clearTimeout(switching);document.querySelectorAll(".po.leaving").forEach(el=>el.classList.remove("leaving"));closeDrawer();closeFlight();hidePeek();hideResults();}
  }
  // Capture the top-level view switch before the existing POC/Flip handler.
  document.addEventListener('click',event=>{
    if(event.target.closest('#proposed-chart-tab')){
      event.stopImmediatePropagation();showProposals(true);saveLocation();window.scrollTo(0,0);
    }else if(event.target.closest('[data-set-mode]')){
      showProposals(false);
      saveLocation();
    }
  },true);
  document.addEventListener('chartmodechange',()=>showProposals(false));
  host.addEventListener('click',event=>{
    const tab=event.target.closest('[data-proposal]');if(tab)selectTeam(tab.dataset.proposal);
  });
  host.querySelector('[role="tablist"]').addEventListener('keydown',event=>{
    const tabs=[...host.querySelectorAll('[role="tab"]')];let i=tabs.indexOf(document.activeElement);
    if(i<0)return;
    if(event.key==='ArrowRight')i=(i+1)%tabs.length;
    else if(event.key==='ArrowLeft')i=(i+tabs.length-1)%tabs.length;
    else if(event.key==='Home')i=0;
    else if(event.key==='End')i=tabs.length-1;
    else return;
    event.preventDefault();selectTeam(tabs[i].dataset.proposal,true);
  });
  // Use the main chart's drawer, photo, chip and hover-preview styles with
  // proposal-specific relationships and duties. No GMC roster data is used.
  const proposalPeek=document.createElement('div');
  proposalPeek.className='peek';proposalPeek.id='proposal-peek';proposalPeek.setAttribute('aria-label','Proposed reporting relationships');
  const proposalScrim=document.createElement('div');proposalScrim.className='scrim';
  const proposalDrawer=document.createElement('aside');proposalDrawer.className='drawer';
  proposalDrawer.id='proposal-drawer';proposalDrawer.setAttribute('role','dialog');proposalDrawer.setAttribute('aria-modal','true');proposalDrawer.setAttribute('aria-labelledby','proposal-detail-name');proposalDrawer.hidden=true;
  proposalDrawer.innerHTML='<div class="dtop"><span class="grab" aria-hidden="true"></span><span>Proposed position</span><button type="button" class="xbtn" aria-label="Close proposed member details">×</button></div><div class="dbody"></div>';
  document.body.append(proposalPeek,proposalScrim,proposalDrawer);
  let proposalFocus=null,proposalOpen=false,proposalTimer=null,hoveredProposal=null;
  function avatar(s,cls=''){
    const who=person(s);
    return who.key?img(who.key,cls,'Photo of '+who.full):'<span class="proposal-initials '+cls+'" aria-hidden="true">'+(s.last==='TBD'?'?':'MB')+'</span>';
  }
  function relatedButton(s,p,hover=false){
    const who=person(s);
    if(hover)return `<button type="button" class="pk ${who.cls?ringOf(who.cls):''}" data-proposal-related="${s.id}" data-team="${p.id}">${avatar(s)}<span><b>${esc([s.rank,s.last].filter(Boolean).join(' '))}</b><small>${esc(s.des+' · '+s.title)}</small></span></button>`;
    return `<button type="button" class="${hover?'pk':'chip'} ${who.cls?ringOf(who.cls):''}" data-proposal-related="${s.id}" data-team="${p.id}">${avatar(s)}<span><span class="c1"><b>${esc([s.rank,s.last].filter(Boolean).join(' '))}</b></span><br><span class="c2">${esc(s.des+' · '+s.title)}</span></span></button>`;
  }
  function openProposalDetails(id,team){
    const p=proposals.find(p=>p.id===team),s=p?.seats.find(s=>s.id===id);if(!s)return;
    hideProposalPeek();closeDrawer();closeFlight();
    const who=person(s),parent=p.seats.find(x=>x.id===s.parent),children=p.seats.filter(x=>x.parent===s.id),duty=dutiesFor(s,p);
    if(!proposalOpen)proposalFocus=document.activeElement;
    const role=duty?`<section class="role-description" aria-label="Proposed position description"><h3 class="dh">Position description</h3><p class="role-note">${esc(duty.heading)}</p><div class="proposal-duty-text">${esc(duty.text)}</div><p class="role-source">Source: ${esc(p.source)} position descriptions, original PDF page${duty.pages.length>1?'s':''} ${duty.pages.join(', ')}.</p></section>`:'';
    proposalDrawer.querySelector('.dbody').innerHTML=`<div class="hero ${who.cls?ringOf(who.cls):''}">${avatar(s)}<div class="big" id="proposal-detail-name">${esc([s.rank,who.full].filter(Boolean).join(' '))}</div><div class="seat">${esc(s.title)}</div></div><dl class="facts"><dt>Proposal</dt><dd>${esc(p.name)}</dd><dt>Position</dt><dd>${esc(s.des)}</dd>${s.rank?'<dt>Proposed rank</dt><dd>'+esc(s.rank)+'</dd>':''}${who.cls?'<dt>AS year</dt><dd>'+esc(who.cls)+'</dd>':''}</dl>${role}<div class="dh">Reports to</div>${parent?'<div class="chips">'+relatedButton(parent,p)+'</div>':'<p>Operations Flight Commander</p>'}${children.length?'<div class="dh">Leads ('+children.length+')</div><div class="chips">'+children.map(c=>relatedButton(c,p)).join('')+'</div>':''}`;
    proposalDrawer.hidden=false;proposalDrawer.classList.add('open');proposalScrim.classList.add('open');proposalOpen=true;document.body.style.overflow='hidden';proposalDrawer.querySelector('.dbody').scrollTop=0;proposalDrawer.querySelector('.xbtn').focus({preventScroll:true});
    const url=new URL(location);url.searchParams.set('member',id);history.replaceState(null,'',url.pathname+url.search);
  }
  function closeProposalDetails(){
    if(!proposalOpen)return;
    proposalOpen=false;proposalDrawer.classList.remove('open');proposalDrawer.hidden=true;proposalScrim.classList.remove('open');document.body.style.overflow='';
    const url=new URL(location);url.searchParams.delete('member');history.replaceState(null,'',url.pathname+url.search+url.hash);
    if(proposalFocus?.isConnected&&proposalFocus.getClientRects().length)proposalFocus.focus({preventScroll:true});
  }
  function hideProposalPeek(){
    clearTimeout(proposalTimer);hoveredProposal=null;proposalPeek.classList.remove('show');host.classList.remove('proposal-tracing');
    host.querySelectorAll('.proposal-lit,.proposal-self').forEach(el=>el.classList.remove('proposal-lit','proposal-self'));
  }
  function showProposalPeek(card){
    if(proposalOpen)return;
    const p=proposals.find(p=>p.id===card.dataset.team),s=p?.seats.find(s=>s.id===card.dataset.proposalSeat);if(!s)return;
    const parent=p.seats.find(x=>x.id===s.parent),children=p.seats.filter(x=>x.parent===s.id);
    const group=(label,list)=>list.length?'<div class="peek-h">'+label+' <b>'+list.length+'</b></div><div class="peek-grid" style="--cols:'+Math.min(list.length,3)+'">'+list.map(x=>relatedButton(x,p,true)).join('')+'</div>':'';
    proposalPeek.innerHTML=(parent?group('Reports to',[parent]):'<div class="peek-h">Reports to</div><p class="proposal-hover-note">Operations Flight Commander</p>')+group('Leads',children);
    proposalPeek.classList.remove('show','above');
    const r=card.getBoundingClientRect(),w=proposalPeek.offsetWidth,h=proposalPeek.offsetHeight;
    const above=r.bottom+h+12>innerHeight&&r.top-h-12>80;
    proposalPeek.style.top=(above?r.top-h-12:Math.min(r.bottom+12,innerHeight-h-8))+'px';
    const left=Math.max(8,Math.min(innerWidth-w-8,r.left+r.width/2-w/2));proposalPeek.style.left=left+'px';proposalPeek.style.setProperty('--ax',Math.max(18,Math.min(w-18,r.left+r.width/2-left))+'px');proposalPeek.classList.toggle('above',above);proposalPeek.classList.add('show');hoveredProposal=card;
    const lit=new Set([s.id,...children.map(c=>c.id)]);for(let up=parent;up;up=p.seats.find(x=>x.id===up.parent))lit.add(up.id);
    host.classList.add('proposal-tracing');host.querySelectorAll('.proposal-card').forEach(el=>{el.classList.toggle('proposal-lit',el.dataset.team===p.id&&lit.has(el.dataset.proposalSeat));el.classList.toggle('proposal-self',el===card);});
  }
  host.addEventListener('pointerover',event=>{
    if(!canHover)return;const card=event.target.closest('[data-proposal-seat]');if(!card||card===hoveredProposal)return;
    clearTimeout(proposalTimer);proposalTimer=setTimeout(()=>showProposalPeek(card),280);
  });
  host.addEventListener('pointerout',event=>{
    const card=event.target.closest('[data-proposal-seat]');if(card&&!card.contains(event.relatedTarget)&&!proposalPeek.contains(event.relatedTarget)){clearTimeout(proposalTimer);proposalTimer=setTimeout(hideProposalPeek,160);}
  });
  proposalPeek.addEventListener('pointerenter',()=>clearTimeout(proposalTimer));
  proposalPeek.addEventListener('pointerleave',event=>{if(!hoveredProposal?.contains(event.relatedTarget))proposalTimer=setTimeout(hideProposalPeek,160);});
  host.addEventListener('focusin',event=>{const card=event.target.closest('[data-proposal-seat]');if(card&&card.matches(':focus-visible'))showProposalPeek(card);});
  host.addEventListener('focusout',event=>{if(!host.contains(event.relatedTarget)&&!proposalPeek.contains(event.relatedTarget))hideProposalPeek();});
  document.addEventListener('click',event=>{
    const card=event.target.closest('[data-proposal-seat],[data-proposal-related]');if(card)openProposalDetails(card.dataset.proposalSeat||card.dataset.proposalRelated,card.dataset.team);
    else if(event.target===proposalScrim||event.target.closest('#proposal-drawer .xbtn'))closeProposalDetails();
  });
  document.addEventListener('keydown',event=>{
    if(!proposalOpen)return;
    if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();closeProposalDetails();return;}
    if(event.key==='Tab'){
      const focusable=[...proposalDrawer.querySelectorAll('button,[tabindex="0"]')].filter(el=>el.getClientRects().length),first=focusable[0],last=focusable.at(-1);
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    }
  },true);
  addEventListener('scroll',hideProposalPeek,{passive:true});addEventListener('resize',hideProposalPeek);

  selectTeam(selected);
  showProposals(params.get('view')==='proposed'||location.hash==='#spring-proposals'||proposals.some(p=>p.id===hashTeam));
  if(root.dataset.chartView==='proposed'&&params.get('member'))openProposalDetails(params.get('member'),selected);
})();
