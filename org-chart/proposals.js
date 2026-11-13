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
  const originalSeats=[...SEATS];
  const cadreSeats=originalSeats.filter(s=>s.cadre);
  const root=document.documentElement,host=document.getElementById('spring-proposals');
  const params=new URLSearchParams(location.search);
  const mapId=id=>({cc:'wgcc',cd:'wgcd',cos:'wgcos',ig:'wgig'})[id]||'proposed-'+id;
  let selected=proposals.some(p=>p.id===params.get('proposal'))?params.get('proposal'):'kingery-helle';
  const panels=document.createElement('div');panels.id='chart-panels';
  document.getElementById('main').append(panels);
  ['cadre','command','staff','group'].forEach(id=>panels.append(document.getElementById(id)));
  document.getElementById('main').prepend(host);
  host.innerHTML='<div class="bandhead"><h2>Proposed 2027 Org Charts</h2><span class="rt">Spring 2027 board review</span></div><p class="proposal-note">All proposed positions are shown. GMC cadet flight rosters are not assigned.</p>';
  const teams=document.getElementById('team-tabs');   // the team picker lives in the thin sticky chart bar
  teams.innerHTML=proposals.map(p=>'<button type="button" role="tab" id="team-tab-'+p.id+'" aria-controls="chart-panels" aria-selected="false" tabindex="-1" data-proposal="'+p.id+'">'+esc(p.name.replaceAll(' / ','/'))+'</button>').join('');
  function updateIndex(seats){
    SEATS.splice(0,SEATS.length,...seats);
    Object.keys(byId).forEach(id=>delete byId[id]);SEATS.forEach(s=>byId[s.id]=s);
  }
  function toNative(s,p){
    let key=Object.keys(PEOPLE).find(key=>PEOPLE[key][0]===s.last);
    if(!key){key=s.last==='Bienfang'?'BienfangMitchell':'ProposedTBD';PEOPLE[key]=s.last==='Bienfang'?['Bienfang','Mitchell','AS400']:['TBD','',''];}
    return {id:mapId(s.id),des:s.des,title:s.title,poc:[key,s.rank],parent:s.parent?mapId(s.parent):'russell',
      dir:/^A\d$/.test(s.id)?s.id:undefined,dirName:s.title.replace(/ Director$/,'').replace(/^Director of /,''),proposal:true,proposalField:s.id==='BC'||s.id==='BCL'||s.id.startsWith('bc-')||s.id.startsWith('bcl-'),proposalDuty:dutiesFor(s,p),proposalSource:p.source,proposalTeam:p.name};
  }
  window.renderProposedDuties=seat=>{
    const d=seat.proposalDuty;if(!d)return '';
    const parts=d.text.split(/Responsibilities:\s*/);
    const critical=(parts[0].match(/Critical Role:\s*([\s\S]*)/)||[])[1]||'';
    const responsibilities=(parts.slice(1).join('Responsibilities:').split(/\n\n(?=•)/)).map(s=>s.replace(/^•\s*/,'').trim()).filter(Boolean);
    return `<section class="role-description" aria-label="Position description">${critical?'<h3 class="dh">Critical role</h3><p>'+esc(critical)+'</p>':'<h3 class="dh">Position description</h3>'}${responsibilities.length?'<details><summary>Responsibilities ('+responsibilities.length+')</summary><ul>'+responsibilities.map(r=>'<li>'+esc(r)+'</li>').join('')+'</ul></details>':''}<div class="role-source">Source: ${esc(seat.proposalSource)}, position descriptions, original PDF page${d.pages.length>1?'s':''} ${d.pages.join(', ')}.</div></section>`;
  };
  function resetInteractions(){
    clearTimeout(switching);document.querySelectorAll('.po.leaving').forEach(el=>el.classList.remove('leaving'));
    closeDrawer();closeFlight();hidePeek();hideResults();untrace();
  }
  function rebuild(){
    order=0;build();initCadreBar();setCadre(false);refreshMode();
    document.querySelectorAll('.band').forEach(el=>el.classList.add('in'));
  }
  function saveLocation(){
    const url=new URL(location);url.hash='';url.searchParams.delete('member');
    if(window.currentProposedChart){url.searchParams.set('view','proposed');url.searchParams.set('proposal',selected);}
    else {url.searchParams.delete('proposal');MODE==='flip'?url.searchParams.set('view','flip'):url.searchParams.delete('view');}
    history.replaceState(null,'',url.pathname+url.search);
  }
  function showProposal(id,focus=false,save=true){
    const p=proposals.find(p=>p.id===id);if(!p)return;
    resetInteractions();selected=id;window.currentProposedChart=p;root.dataset.chartView='proposed';MODE='poc';root.dataset.mode='poc';
    updateIndex([...cadreSeats,...p.seats.map(s=>toNative(s,p))]);
    host.hidden=false;teams.hidden=false;panels.setAttribute('role','tabpanel');panels.setAttribute('aria-labelledby','team-tab-'+p.id);
    teams.querySelectorAll('[role="tab"]').forEach(tab=>{const on=tab.dataset.proposal===id;tab.setAttribute('aria-selected',String(on));tab.tabIndex=on?0:-1;if(on&&focus)tab.focus();});
    document.getElementById('proposed-chart-tab').setAttribute('aria-pressed','true');
    document.getElementById('h-group').textContent='Squadron and Flight Staff';
    document.querySelector('#group .rt').textContent='Proposed squadron commanders, flight commanders and deputies';
    document.querySelector('#staff .rt').textContent='Directors report to the WG/COS';
    document.querySelector('.source-line').textContent=p.name+' proposed Spring 2027 organization. Cadre are shown for reference; proposed positions, reporting lines and duties follow the submitted package.';
    rebuild();if(save)saveLocation();
  }
  function showCurrent(mode){
    if(window.currentProposedChart){
      resetInteractions();window.currentProposedChart=null;updateIndex(originalSeats);MODE='poc';root.dataset.mode='poc';root.dataset.chartView=mode;
      document.getElementById('h-group').textContent='Group Staff';document.querySelector('#group .rt').textContent='GP/CC reports to the WG/CC · GMC are assigned under each FLT/CC';
      document.querySelector('.source-line').textContent='Positions reflect the Fall 2026 250th Cadet Wing organization chart, the Flip Week construct, and current flight assignments. Tap or click anyone for details; use the tabs at the top to switch charts.';
      rebuild();saveLocation();
    }
    host.hidden=true;teams.hidden=true;panels.removeAttribute('role');panels.removeAttribute('aria-labelledby');root.dataset.chartView=mode;document.getElementById('proposed-chart-tab').setAttribute('aria-pressed','false');
  }
  document.addEventListener('click',event=>{
    if(event.target.closest('#proposed-chart-tab')){event.stopImmediatePropagation();showProposal(selected);window.scrollTo(0,0);}
    else {const tab=event.target.closest('[data-set-mode]');if(tab)showCurrent(tab.dataset.setMode);}
  },true);
  teams.addEventListener('click',event=>{const tab=event.target.closest('[data-proposal]');if(tab)showProposal(tab.dataset.proposal);});
  teams.addEventListener('keydown',event=>{
    const tabs=[...teams.querySelectorAll('[role="tab"]')];let i=tabs.indexOf(document.activeElement);if(i<0)return;
    if(event.key==='ArrowRight')i=(i+1)%tabs.length;else if(event.key==='ArrowLeft')i=(i+tabs.length-1)%tabs.length;else if(event.key==='Home')i=0;else if(event.key==='End')i=tabs.length-1;else return;
    event.preventDefault();showProposal(tabs[i].dataset.proposal,true);
  });
  const initialSeat=location.hash.slice(1)||params.get('member');
  if(params.get('view')==='proposed'||location.hash==='#spring-proposals'||location.hash.startsWith('#proposal-')){
    const hashTeam=location.hash.replace('#proposal-','');if(proposals.some(p=>p.id===hashTeam))selected=hashTeam;
    showProposal(selected,false,false);
    if(initialSeat&&byId[initialSeat])openSeat(initialSeat);
    else if(initialSeat&&byId[mapId(initialSeat)])openSeat(mapId(initialSeat));
  }else showCurrent(MODE);
})();
