/* Documents and Policy: the public document list, shared by the main page
   (documents/index.html) and the viewer (documents/view/).

   SECTIONS: the categories, in page order. locked:true sections are filled
   from restricted/vault.json (encrypted plans and OPORDs), not from DOCS.
   DOCS: one card each.
     id     short key; internal PDFs open at view/?id=<id> with the back button.
            Other tools cite documents by this id (shared/doc-refs.js), so keep ids stable.
     src    internal PDF, relative to documents/ (shown in the viewer)
     dl     optional: file the viewer's download button gives instead of src
            (the fillable AF Forms; the viewer shows the flat copy)
     href   instead of src: a Storm HQ tool, or an external https link
            (external links belong in the "external" section)
     icon   key in D250_DOC_ICONS for the card icon (pick one that fits the subject)
     tool   true for a link to a Storm HQ tool (its card is styled differently)
*/
(function(){
  const EPUB = "https://static.e-publishing.af.mil/production/1/";
  const EPUB_INDEX = "https://www.e-publishing.af.mil/Product-Index/";
  // Card icons (24px stroke paths), chosen by subject. Each DOCS entry names one with icon.
  window.D250_DOC_ICONS = {
    uniform:'<path d="M9 3l3 3 3-3 5 3-2 5h-2v10H8V11H6L4 6z"/><path d="M12 6v4"/>',
    medal:'<path d="M8 3h8l-2.5 6h-3z"/><circle cx="12" cy="15" r="5.5"/><path d="M12 12.4l.9 1.8 2 .3-1.4 1.4.3 2-1.8-.9-1.8.9.3-2-1.4-1.4 2-.3z"/>',
    feedback:'<path d="M4 5h16v11H9l-5 4z"/><path d="M8.5 10.5l2 2 4-4"/>',
    counsel:'<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M15 4h6v5h-3.5L15 11z"/>',
    wings:'<path d="M2 8.5c3.5 0 6.5 1.2 8 3.2M22 8.5c-3.5 0-6.5 1.2-8 3.2M4 12c2.4 0 4.6.7 6 2M20 12c-2.4 0-4.6.7-6 2M6.5 15.2c1.4 0 2.6.4 3.5 1.2M17.5 15.2c-1.4 0-2.6.4-3.5 1.2"/><circle cx="12" cy="13" r="2.3"/>',
    star:'<path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z"/>',
    flag:'<path d="M5 21V3.5"/><path d="M5 4h12l-2.5 4L17 12H5"/>',
    sapr:'<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M12 15.5s-3.2-1.9-3.2-4.2a1.7 1.7 0 0 1 3.2-.8 1.7 1.7 0 0 1 3.2.8c0 2.3-3.2 4.2-3.2 4.2z"/>',
    ballot:'<path d="M3.5 12.5h17v8h-17z"/><path d="M7.5 12.5V4h9v8.5"/><path d="M10 8.5l1.5 1.5 3-3"/>',
    grad:'<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3.5 2.5 8.5 2.5 12 0v-5M22 9v6"/>',
    pen:'<path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M14 7l3 3M4 20h7"/>',
    people:'<circle cx="8" cy="8" r="3"/><circle cx="16.5" cy="9" r="2.5"/><path d="M2.5 20c0-3.2 2.5-5.5 5.5-5.5s5.5 2.3 5.5 5.5M14 15c3 0 6 1.8 6 5"/>',
    teach:'<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M7 8.5h6M7 11.5h4M9 20l3-4 3 4"/>',
    shield:'<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M8.5 11.5l2.5 2.5 4.5-5"/>',
    dumbbell:'<path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11"/>',
    scorecard:'<path d="M9 4h6v3H9z"/><path d="M9 5.5H6.5A1.5 1.5 0 0 0 5 7v12.5A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V7a1.5 1.5 0 0 0-1.5-1.5H15"/><path d="M8.5 13l2 2 4.5-4.5"/>',
    heart:'<path d="M12 20s-7.5-4.6-7.5-10A4.2 4.2 0 0 1 12 7.4 4.2 4.2 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/><path d="M5 12.5h3.5l1.5-2.5 2 4.5 1.5-2h5.5"/>',
    chart:'<path d="M4 20V4M4 20h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>',
    shuttle:'<path d="M4 12h16M8 8l-4 4 4 4M16 8l4 4-4 4"/><path d="M4 5v2M20 5v2M4 17v2M20 19v-2"/>',
    calc:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8.5 11h.01M12 11h.01M15.5 11h.01M8.5 14.5h.01M12 14.5h.01M15.5 14.5v3.5M8.5 18h.01M12 18h.01"/>'
  };
  window.D250_DOC_SECTIONS = [
    {id:"plans", title:"Detachment plans", tone:"#c8102e", locked:true, sub:"The semester OPLAN, the cadet Policy Packet and the cadre duties roster. These include locations, dates and names, so they open with the detachment password."},
    {id:"opords", title:"Weekly OPORDs, Fall 2026", tone:"#4a5a36", locked:true, compact:true, sub:"Signed LLAB operations orders, one per week. Same password."},
    {id:"afrotc", title:"AFROTC instructions and supplements", tone:"#1f4e9c", sub:"HQ AFROTC publications that govern cadet life. Where they are more specific than the Air Force publication, they win for cadets."},
    {id:"fitness", title:"Fitness", tone:"#c2410c", sub:"Everything for the PFRA: the calculator, the forms, the scoring charts and the governing manual."},
    {id:"external", title:"External links (e-Publishing)", tone:"#0369a1", sub:"Official Department of the Air Force publications and forms. These open the e-Publishing site in a new tab, so you always get the current version."}
  ];
  window.D250_DOCS = [
    // ---- AFROTC ----
    {sec:"afrotc", id:"afrotci-36-2011v1", icon:"people", num:"AFROTCI 36-2011, Vol 1", title:"Cadet's Guide to the LLAB Curriculum",
     what:"Leadership Laboratory training objectives and evaluation tools. The OPLAN builds every lab around it. Aug 2026.",
     src:"references/afrotci-36-2011v1.pdf"},
    {sec:"afrotc", id:"afrotci-36-2011v2", icon:"teach", num:"AFROTCI 36-2011, Vol 2", title:"Cadre Training and Certification",
     what:"How AFROTC cadre are trained and certified. The Org Chart cites it for cadre duties. 11 Sep 2024.",
     src:"references/afrotci-36-2011v2.pdf"},
    {sec:"afrotc", id:"afrotci-36-2011v3", icon:"shield", num:"AFROTCI 36-2011, Vol 3", title:"Cadet Operations",
     what:"The cadet life cycle from first contact to commissioning: fitness, accountability, discipline and detachment awards (Table 15.1). 24 Jun 2026.",
     src:"../pfra/references/afrotci-36-2011v3.pdf"},
    {sec:"afrotc", id:"dafi36-2903-afrotcsup", icon:"uniform", num:"DAFI 36-2903 AFROTC Sup", title:"Dress and Personal Appearance (AFROTC)",
     what:"Cadet uniform wear, insignia and the AFROTC Ribbon Chart (Figure 10.4) with order of precedence. 18 Nov 2021.",
     src:"../ribbon-rack/references/dafi36-2903-afrotcsup.pdf"},

    // ---- Fitness ----
    {sec:"fitness", id:"pfra-calculator", icon:"calc", num:"PFRA Calculator", title:"Score your PFRA",
     what:"Score a PFRA against DAFMAN 36-2905 and the 2026 USAF scoring charts, with goal pace and track marks.",
     href:"../pfra/", tool:true},
    {sec:"fitness", id:"af-form-4446", icon:"scorecard", num:"AF Form 4446", title:"PFRA Scorecard",
     what:"The scorecard filled out at every PFRA. Download gives the fillable form.",
     src:"../pfra/references/af-form-4446-flat.pdf", dl:"../pfra/references/af-form-4446.pdf"},
    {sec:"fitness", id:"af-form-4446a", icon:"heart", num:"AF Form 4446A", title:"Fitness Screening Questionnaire",
     what:"The screening questionnaire you complete before a PFRA. Download gives the fillable form.",
     src:"../pfra/references/af-form-4446a-fsq-flat.pdf", dl:"../pfra/references/af-form-4446a-fsq.pdf"},
    {sec:"fitness", id:"pfra-scoring-charts", icon:"chart", num:"PFRA Scoring Charts", title:"Final USAF PFRA Scoring, effective 1 Mar 2026",
     what:"Points for every component by age group and sex, plus waist-to-height ratio standards.",
     src:"../pfra/references/pfra-scoring-charts.pdf"},
    {sec:"fitness", id:"hamr-shuttle-tally", icon:"shuttle", num:"HAMR Tally Sheet", title:"20 m High Aerobic Multi-Shuttle Run",
     what:"One-page tally sheet for counting HAMR shuttles.",
     src:"../pfra/references/hamr-shuttle-tally.pdf"},
    {sec:"fitness", id:"dafman36-2905", icon:"dumbbell", num:"DAFMAN 36-2905", title:"Physical Fitness Readiness Program",
     what:"The PFRA: components, scoring and administration. Replaces AFI 36-2905. 24 Mar 2026. Large file (40 MB).",
     src:"../pfra/references/dafman-36-2905.pdf"},
    {sec:"fitness", id:"dafman36-2905-afrotcsup", icon:"dumbbell", num:"DAFMAN 36-2905 AFROTC Sup", title:"Physical Fitness Program (AFROTC)",
     what:"How AFROTC runs cadet fitness assessments. 28 Apr 2023, awaiting revision: newer AFROTC fitness guidance and the 2026 DAFMAN win where they differ.",
     src:"../pfra/references/dafman-36-2905-afrotcsup.pdf"},

    // ---- External (e-Publishing) ----
    {sec:"external", id:"ext-dafi36-2903", icon:"uniform", num:"DAFI 36-2903", title:"Dress and Personal Appearance",
     what:"Uniform wear, grooming and appearance standards for everyone in uniform.",
     href:EPUB+"af_a1/publication/dafi36-2903/dafi36-2903.pdf"},
    {sec:"external", id:"ext-dafman36-2905", icon:"dumbbell", num:"DAFMAN 36-2905", title:"Physical Fitness Readiness Program",
     what:"The current version of the fitness manual on e-Publishing.",
     href:EPUB+"af_a1/publication/afman36-2905/dafman36-2905.pdf"},
    {sec:"external", id:"ext-afh1", icon:"wings", num:"AFH 1", title:"Airman",
     what:"The Airman handbook: heritage, customs and courtesies, and standards. Much of the Storm Standard draws on it.",
     href:EPUB+"af_a1/publication/afh1/afh1.pdf"},
    {sec:"external", id:"ext-afi1-1", icon:"star", num:"AFI 1-1", title:"Air Force Standards",
     what:"Air Force vision, mission, core values and standards of conduct. Aug 2023.",
     href:EPUB_INDEX},
    {sec:"external", id:"ext-dafi90-1201", icon:"flag", num:"DAFI 90-1201", title:"Protocol",
     what:"Customs, courtesies, reporting in and out, flag courtesies and ceremonies. Current protocol instruction (the Policy Packet cites the older AFI 34-1201). Oct 2024.",
     href:EPUB+"saf_ds/publication/dafi90-1201/dafi90-1201.pdf"},
    {sec:"external", id:"ext-dafi90-6001", icon:"sapr", num:"DAFI 90-6001", title:"Sexual Assault Prevention and Response",
     what:"SAPR policy, reporting options and support. Backs the Policy Packet's zero tolerance rule.",
     href:EPUB+"af_a1/publication/dafi90-6001/afi90-6001.pdf"},
    {sec:"external", id:"ext-dafi51-508", icon:"ballot", num:"DAFI 51-508", title:"Political Activities, Free Speech, and Freedom of Assembly",
     what:"What you can and cannot do politically, online and in person, while affiliated with the Air Force.",
     href:EPUB+"af_ja/publication/dafi51-508/dafi51-508.pdf"},
    {sec:"external", id:"ext-dafi36-2614", icon:"grad", num:"DAFI 36-2614", title:"Commissioning Education Program",
     what:"Commissioning education and training at USAFA, AFROTC and OTS.",
     href:EPUB+"af_a1/publication/dafi36-2614/dafi36-2614.pdf"},
    {sec:"external", id:"ext-afh33-337", icon:"pen", num:"AFH 33-337", title:"The Tongue and Quill",
     what:"Air Force writing and briefing guide. The Policy Packet uses it for email signature blocks.",
     href:EPUB_INDEX},
    {sec:"external", id:"ext-daf1206", icon:"medal", num:"DAF Form 1206", title:"Nomination for Award",
     what:"Used to nominate cadets for detachment, region and HQ awards.",
     href:EPUB+"af_a1/form/daf1206/daf1206.pdf"},
    {sec:"external", id:"ext-af724", icon:"feedback", num:"AF Form 724", title:"Airman Comprehensive Assessment Worksheet",
     what:"Feedback worksheet the OPLAN lists among the LLAB evaluation tools.",
     href:EPUB+"af_a1/form/af724/af724.pdf"},
    {sec:"external", id:"ext-daf174", icon:"counsel", num:"DAF Form 174", title:"Record of Individual Counseling",
     what:"Counseling record kept with LOCs and LORs in cadet files.",
     href:EPUB+"af_a1/form/daf174/daf174.pdf"}
  ];
})();
