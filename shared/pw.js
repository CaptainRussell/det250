/* Storm HQ (Det 250): password boxes show what you type, with a Hide button
   (Captain Russell, 22 Nov 2026: dots were hard to read). Every password input on a page
   becomes a plain text box inside .d250-pw-wrap, plus a Show/Hide toggle. Styles are in
   shared/det250.css. Add data-pw-keep to an input that should stay hidden (the GitHub key).
   Load with <script src="../shared/pw.js" defer></script>; boxes added later are caught too. */
(function () {
  function wire(inp) {
    inp.setAttribute("data-pw", "");
    inp.type = "text";
    inp.spellcheck = false;
    inp.setAttribute("autocapitalize", "off");
    inp.setAttribute("autocorrect", "off");
    inp.classList.add("d250-pw");
    var wrap = document.createElement("span");
    wrap.className = "d250-pw-wrap";
    inp.parentNode.insertBefore(wrap, inp);
    wrap.appendChild(inp);
    var b = document.createElement("button");
    b.type = "button";
    b.className = "d250-pw-eye";
    b.textContent = "Hide";
    b.setAttribute("aria-label", "Hide password");
    b.addEventListener("click", function () {
      var hide = inp.type === "text";
      inp.type = hide ? "password" : "text";
      b.textContent = hide ? "Show" : "Hide";
      b.setAttribute("aria-label", hide ? "Show password" : "Hide password");
      inp.focus();
    });
    wrap.appendChild(b);
  }
  function scan() {
    var list = document.querySelectorAll("input[type=password]:not([data-pw]):not([data-pw-keep])");
    for (var i = 0; i < list.length; i++) wire(list[i]);
  }
  scan();
  if (window.MutationObserver) new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
})();
