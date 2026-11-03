/* Documents and Policy: the public document list, shared by the main page
   (documents/index.html) and the viewer (documents/view/).

   SECTIONS: the categories, in page order. locked:true sections are filled
   from restricted/vault.json (encrypted plans and OPORDs), not from DOCS.
   DOCS: one card each.
     id     short key; internal PDFs open at view/?id=<id> with the back button
     src    internal PDF, relative to documents/ (shown in the viewer)
     dl     optional: file the viewer's download button gives instead of src
            (the fillable AF Forms; the viewer shows the flat copy)
     href   instead of src: a Storm HQ tool, or an external https link
            (external links belong in the "external" section)
*/
(function(){
  const EPUB = "https://static.e-publishing.af.mil/production/1/";
  const EPUB_INDEX = "https://www.e-publishing.af.mil/Product-Index/";
  window.D250_DOC_SECTIONS = [
    {id:"plans", title:"Detachment plans", tone:"#c8102e", locked:true, sub:"The semester OPLAN, the cadet Policy Packet and the cadre duties roster. These include locations, dates and names, so they open with the detachment password."},
    {id:"opords", title:"Weekly OPORDs, Fall 2026", tone:"#4a5a36", locked:true, compact:true, sub:"Signed LLAB operations orders, one per week. Same password."},
    {id:"afrotc", title:"AFROTC instructions and supplements", tone:"#1f4e9c", sub:"HQ AFROTC publications that govern cadet life. Where they are more specific than the Air Force publication, they win for cadets."},
    {id:"fitness", title:"Fitness", tone:"#c2410c", sub:"Everything for the PFRA: the calculator, the forms, the scoring charts and the governing manual."},
    {id:"external", title:"External links (e-Publishing)", tone:"#0369a1", sub:"Official Department of the Air Force publications and forms. These open the e-Publishing site in a new tab, so you always get the current version."}
  ];
  window.D250_DOCS = [
    // ---- AFROTC ----
    {sec:"afrotc", id:"afrotci-36-2011v1", num:"AFROTCI 36-2011, Vol 1", title:"Cadet's Guide to the LLAB Curriculum",
     what:"Leadership Laboratory training objectives and evaluation tools. The OPLAN builds every lab around it. Aug 2026.",
     src:"references/afrotci-36-2011v1.pdf"},
    {sec:"afrotc", id:"afrotci-36-2011v2", num:"AFROTCI 36-2011, Vol 2", title:"Cadre Training and Certification",
     what:"How AFROTC cadre are trained and certified. The Org Chart cites it for cadre duties. 11 Sep 2024.",
     src:"references/afrotci-36-2011v2.pdf"},
    {sec:"afrotc", id:"afrotci-36-2011v3", num:"AFROTCI 36-2011, Vol 3", title:"Cadet Operations",
     what:"The cadet life cycle from first contact to commissioning: fitness, accountability, discipline and detachment awards (Table 15.1). 24 Jun 2026.",
     src:"../pfra/references/afrotci-36-2011v3.pdf"},
    {sec:"afrotc", id:"dafi36-2903-afrotcsup", num:"DAFI 36-2903 AFROTC Sup", title:"Dress and Personal Appearance (AFROTC)",
     what:"Cadet uniform wear, insignia and the AFROTC Ribbon Chart (Figure 10.4) with order of precedence. 18 Nov 2021.",
     src:"../ribbon-rack/references/dafi36-2903-afrotcsup.pdf"},

    // ---- Fitness ----
    {sec:"fitness", id:"pfra-calculator", num:"PFRA Calculator", title:"Storm HQ tool",
     what:"Score a PFRA against DAFMAN 36-2905 and the 2026 USAF scoring charts, with goal pace and track marks.",
     href:"../pfra/", tool:true},
    {sec:"fitness", id:"af-form-4446", num:"AF Form 4446", title:"PFRA Scorecard",
     what:"The scorecard filled out at every PFRA. Download gives the fillable form.",
     src:"../pfra/references/af-form-4446-flat.pdf", dl:"../pfra/references/af-form-4446.pdf"},
    {sec:"fitness", id:"af-form-4446a", num:"AF Form 4446A", title:"Fitness Screening Questionnaire",
     what:"The screening questionnaire you complete before a PFRA. Download gives the fillable form.",
     src:"../pfra/references/af-form-4446a-fsq-flat.pdf", dl:"../pfra/references/af-form-4446a-fsq.pdf"},
    {sec:"fitness", id:"pfra-scoring-charts", num:"PFRA Scoring Charts", title:"Final USAF PFRA Scoring, effective 1 Mar 2026",
     what:"Points for every component by age group and sex, plus waist-to-height ratio standards.",
     src:"../pfra/references/pfra-scoring-charts.pdf"},
    {sec:"fitness", id:"hamr-shuttle-tally", num:"HAMR Tally Sheet", title:"20 m High Aerobic Multi-Shuttle Run",
     what:"One-page tally sheet for counting HAMR shuttles.",
     src:"../pfra/references/hamr-shuttle-tally.pdf"},
    {sec:"fitness", id:"dafman36-2905", num:"DAFMAN 36-2905", title:"Physical Fitness Readiness Program",
     what:"The PFRA: components, scoring and administration. Replaces AFI 36-2905. 24 Mar 2026. Large file (40 MB).",
     src:"../pfra/references/dafman-36-2905.pdf"},
    {sec:"fitness", id:"dafman36-2905-afrotcsup", num:"DAFMAN 36-2905 AFROTC Sup", title:"Physical Fitness Program (AFROTC)",
     what:"How AFROTC runs cadet fitness assessments. 28 Apr 2023, awaiting revision: newer AFROTC fitness guidance and the 2026 DAFMAN win where they differ.",
     src:"../pfra/references/dafman-36-2905-afrotcsup.pdf"},

    // ---- External (e-Publishing) ----
    {sec:"external", num:"DAFI 36-2903", title:"Dress and Personal Appearance",
     what:"Uniform wear, grooming and appearance standards for everyone in uniform.",
     href:EPUB+"af_a1/publication/dafi36-2903/dafi36-2903.pdf"},
    {sec:"external", num:"DAFMAN 36-2905", title:"Physical Fitness Readiness Program",
     what:"The current version of the fitness manual on e-Publishing.",
     href:EPUB+"af_a1/publication/afman36-2905/dafman36-2905.pdf"},
    {sec:"external", num:"AFH 1", title:"Airman",
     what:"The Airman handbook: heritage, customs and courtesies, and standards. Much of the Storm Standard draws on it.",
     href:EPUB+"af_a1/publication/afh1/afh1.pdf"},
    {sec:"external", num:"AFI 1-1", title:"Air Force Standards",
     what:"Air Force vision, mission, core values and standards of conduct. Aug 2023.",
     href:EPUB_INDEX},
    {sec:"external", num:"DAFI 90-1201", title:"Protocol",
     what:"Customs, courtesies, reporting in and out, flag courtesies and ceremonies. Current protocol instruction (the Policy Packet cites the older AFI 34-1201). Oct 2024.",
     href:EPUB+"saf_ds/publication/dafi90-1201/dafi90-1201.pdf"},
    {sec:"external", num:"DAFI 90-6001", title:"Sexual Assault Prevention and Response",
     what:"SAPR policy, reporting options and support. Backs the Policy Packet's zero tolerance rule.",
     href:EPUB+"af_a1/publication/dafi90-6001/afi90-6001.pdf"},
    {sec:"external", num:"DAFI 51-508", title:"Political Activities, Free Speech, and Freedom of Assembly",
     what:"What you can and cannot do politically, online and in person, while affiliated with the Air Force.",
     href:EPUB+"af_ja/publication/dafi51-508/dafi51-508.pdf"},
    {sec:"external", num:"DAFI 36-2614", title:"Commissioning Education Program",
     what:"Commissioning education and training at USAFA, AFROTC and OTS.",
     href:EPUB+"af_a1/publication/dafi36-2614/dafi36-2614.pdf"},
    {sec:"external", num:"AFH 33-337", title:"The Tongue and Quill",
     what:"Air Force writing and briefing guide. The Policy Packet uses it for email signature blocks.",
     href:EPUB_INDEX},
    {sec:"external", num:"DAF Form 1206", title:"Nomination for Award",
     what:"Used to nominate cadets for detachment, region and HQ awards.",
     href:EPUB+"af_a1/form/daf1206/daf1206.pdf"},
    {sec:"external", num:"AF Form 724", title:"Airman Comprehensive Assessment Worksheet",
     what:"Feedback worksheet the OPLAN lists among the LLAB evaluation tools.",
     href:EPUB+"af_a1/form/af724/af724.pdf"},
    {sec:"external", num:"DAF Form 174", title:"Record of Individual Counseling",
     what:"Counseling record kept with LOCs and LORs in cadet files.",
     href:EPUB+"af_a1/form/daf174/daf174.pdf"}
  ];
})();
