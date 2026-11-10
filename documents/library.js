/* Documents and Policy: card icons plus the document list, shared by the main
   page (documents/index.html), the viewer (documents/view/) and every tool that
   cites documents (shared/doc-refs.js).

   The sections and cards are in data/documents.js (plain JSON, editable from the
   admin page); load it before this file. Field notes are at the top of that file.
   This file keeps D250_DOC_ICONS (card icons by subject) and exposes the list as
   D250_DOC_SECTIONS and D250_DOCS.
*/
(function(){
  // Card icons (24px stroke paths), chosen by subject. Each DOCS entry names one with icon.
  window.D250_DOC_ICONS = {
    // Same icon as the PFRA Calculator card on the Storm HQ hub (root index.html ICONS.calculator).
    calculator:'<rect x="5" y="2.5" width="14" height="19" rx="2.2"/><rect x="8" y="5.5" width="8" height="3.5" rx=".6"/><path d="M8.5 12.5h.01M12 12.5h.01M15.5 12.5h.01M8.5 15.5h.01M12 15.5h.01M15.5 15.5v3M8.5 18.5h.01M12 18.5h.01"/>',
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
  // The sections and cards live in data/documents.js (load it before this file).
  const D = window.D250_DOCS_DATA || {sections:[], docs:[]};
  window.D250_DOC_SECTIONS = D.sections;
  window.D250_DOCS = D.docs;
})();
