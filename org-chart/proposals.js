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
  function person(s){
    const entry=Object.entries(PEOPLE).find(([,p])=>p[0]===s.last);
    // Bienfang is not in the Fall 2026 POC roster. Do not infer a class or photo.
    return entry ? {key:entry[0],cls:entry[1][2],full:entry[1][1]+' '+entry[1][0]} : {key:null,cls:'',full:s.last};
  }
  function renderCard(s, p){
    const who=person(s), parent=p.seats.find(x=>x.id===s.parent);
    return `<div class="proposal-card"><div class="proposal-person">${who.key ? img(who.key,'av '+ringOf(who.cls),'Photo of '+who.full) : '<span class="proposal-initials" aria-hidden="true">'+esc(s.last==='TBD'?'?':'MB')+'</span>'}<div><div class="tags"><span class="des">${esc(s.des)}</span>${who.cls?'<span class="cls '+ringOf(who.cls)+'">'+esc(who.cls)+'</span>':''}</div><div class="nm">${esc([s.rank,s.last].filter(Boolean).join(' '))}</div><div class="ttl">${esc(s.title)}</div></div></div><p class="proposal-reports">Reports to ${esc(parent ? parent.des+' ('+parent.last+')' : 'Operations Flight Commander')}</p></div>`;
  }
  function branch(s,p){
    const children=p.seats.filter(x=>x.parent===s.id);
    return `<li>${renderCard(s,p)}${children.length?'<ul>'+children.map(c=>branch(c,p)).join('')+'</ul>':''}</li>`;
  }
  const host=document.getElementById('spring-proposals');
  host.innerHTML=`<div class="bandhead"><h2>Spring 2027 proposals</h2><span class="rt">Proposed positions for board review</span></div><nav class="proposal-nav" aria-label="Spring 2027 proposals">${proposals.map(p=>'<a href="#proposal-'+p.id+'">'+esc(p.name)+'</a>').join('')}</nav><p class="proposal-note">Flight assignments are omitted from these proposed charts.</p>`+proposals.map(p=>{
    const directors=p.seats.filter(s=>/^A\d$/.test(s.id));
    const command={...p,seats:p.seats.filter(s=>!/^A\d$/.test(s.id)&&!/^A\d$/.test(s.parent||''))};
    return `<section class="proposal-section" id="proposal-${p.id}" aria-labelledby="title-${p.id}"><h3 id="title-${p.id}">${esc(p.name)} <span>Spring 2027</span></h3><h4>Wing and squadron leadership</h4><ul class="proposal-tree">${branch(command.seats.find(s=>s.id==='cc'),command)}</ul><h4>A-Staff Directorates</h4><div class="proposal-directorates">${directors.map(s=>'<article class="proposal-directorate"><h5>'+esc(s.des)+'</h5><ul class="proposal-tree">'+branch(s,p)+'</ul></article>').join('')}</div><p class="proposal-source">Source: ${esc(p.source)}. Proposed ranks and reporting lines follow the submitted chart.</p></section>`;
  }).join('');
})();
