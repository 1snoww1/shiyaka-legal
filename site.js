/* Small helpers for every page (14 November 2026). Nothing here is needed to read or use the site: without it the pages
   still work. It adds a shadow under the top bar after scrolling, the gentle reveal of cards, the contents list closing on
   phones, the support questions search and the credits filter. No tracking, no outside requests. */
(function () {
  var d = document;

  var header = d.querySelector(".site-header");
  if (header) {
    var shadow = function () { header.classList.toggle("scrolled", window.scrollY > 4); };
    shadow();
    window.addEventListener("scroll", shadow, { passive: true });
  }

  var reveal = d.querySelectorAll(".reveal");
  if (reveal.length) {
    if ("IntersectionObserver" in window) {
      var seen = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("is-in"); seen.unobserve(e.target); }
        });
      }, { rootMargin: "0px 0px -8% 0px" });
      reveal.forEach(function (el) { seen.observe(el); });
    } else {
      reveal.forEach(function (el) { el.classList.add("is-in"); });
    }
  }

  var toc = d.querySelector("details.toc");
  if (toc && window.matchMedia("(max-width: 720px)").matches) toc.open = false;

  var search = d.getElementById("faq-q");
  if (search) {
    var items = [].slice.call(d.querySelectorAll("details.qa"));
    var none = d.getElementById("faq-none");
    var was = items.map(function (el) { return el.open; });
    search.addEventListener("input", function () {
      var q = search.value.trim().toLowerCase();
      var shown = 0;
      items.forEach(function (el, i) {
        var hit = !q || el.textContent.toLowerCase().indexOf(q) > -1;
        el.hidden = !hit;
        if (hit) shown++;
        el.open = q.length > 1 ? hit : was[i];
      });
      if (none) none.hidden = shown > 0;
    });
  }

  [].slice.call(d.querySelectorAll("input[data-filter]")).forEach(function (input) {
    var rows = [].slice.call(input.closest("details").querySelectorAll("tbody tr"));
    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      rows.forEach(function (tr) { tr.hidden = !!q && tr.textContent.toLowerCase().indexOf(q) < 0; });
    });
  });
})();
