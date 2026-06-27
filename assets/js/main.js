/* Rotating hero word. Cycles through the three positioning words.
   Respects prefers-reduced-motion: if set, the word stays static. */
(function () {
  var el = document.querySelector('[data-rotate]');
  if (!el) return;

  var words = ['Platforms', 'Design systems', 'Experiences'];
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  var i = 0;
  setInterval(function () {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.3s ease';
    setTimeout(function () {
      i = (i + 1) % words.length;
      el.textContent = words[i];
      el.style.opacity = '1';
    }, 300);
  }, 2600);
})();

/* Scroll-triggered reveal. Adds .is-visible to .reveal-up elements once their
   top crosses ~90% of the viewport. A position sweep (instead of relying only
   on IntersectionObserver callbacks) survives fast scrolls and anchor jumps —
   no element can get stuck hidden. Honors prefers-reduced-motion. */
(function () {
  var items = [].slice.call(document.querySelectorAll('.reveal-up'));
  if (!items.length) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var ticking = false;
  function sweep() {
    var trigger = window.innerHeight * 0.9;
    items = items.filter(function (el) {
      if (el.getBoundingClientRect().top < trigger) {
        el.classList.add('is-visible');
        return false; // done with this one
      }
      return true;
    });
    ticking = false;
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(sweep); }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  sweep(); // reveal whatever is already in view on load
})();

/* Scroll parallax. Each [data-parallax] element drifts vertically based on its
   position in the viewport; the speed value (px) sets range and direction, so
   paired elements with opposite signs slide apart as you scroll. Uses the same
   rAF/scroll pattern as the reveal sweep. Honors prefers-reduced-motion. */
(function () {
  var nodes = [].slice.call(document.querySelectorAll('[data-parallax]'));
  if (!nodes.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var ticking = false;
  function update() {
    var vh = window.innerHeight;
    nodes.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      var center = rect.top + rect.height / 2;
      // progress: ~-1 (below viewport) to ~1 (above viewport), 0 when centered
      var prog = (vh / 2 - center) / (vh / 2 + rect.height / 2);
      var speed = parseFloat(el.getAttribute('data-parallax')) || 0;
      el.style.transform = 'translate3d(0,' + (prog * speed).toFixed(1) + 'px,0)';
    });
    ticking = false;
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
})();

/* Lazy-play videos only while in view, to keep the motion page light. */
(function () {
  var vids = document.querySelectorAll('video[data-autoplay]');
  if (!vids.length || !('IntersectionObserver' in window)) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var v = entry.target;
      if (entry.isIntersecting) {
        // Don't auto-resume a video the user has taken control of; respect their
        // play/pause choice so it stays stopped after scrolling away and back.
        if (!v.dataset.userControlled) { v.play().catch(function () {}); }
      } else {
        v.pause();
      }
    });
  }, { threshold: 0.4 });

  vids.forEach(function (v) { io.observe(v); });
})();

/* Click the sound button to turn a muted preview into a real player:
   reveal native controls, unmute, and play from the start. Activating one
   re-mutes any other that was playing with sound. */
(function () {
  var cards = [].slice.call(document.querySelectorAll('.video-card'));
  if (!cards.length) return;

  cards.forEach(function (card) {
    var v = card.querySelector('video');
    var btn = card.querySelector('.video-sound');
    if (!v || !btn) return;

    btn.addEventListener('click', function () {
      cards.forEach(function (other) {
        var ov = other.querySelector('video');
        var ob = other.querySelector('.video-sound');
        if (ov && ov !== v) { ov.muted = true; ov.controls = false; ov.loop = true; }
        if (ob && ob !== btn) { ob.classList.remove('is-hidden'); }
      });
      v.muted = false;
      v.controls = true;
      v.loop = false;
      v.dataset.userControlled = '1';
      v.currentTime = 0;
      v.play().catch(function () {});
      btn.classList.add('is-hidden');
    });
  });
})();

/* Marker highlight: sweep a solid fill behind a phrase once it scrolls in. */
(function () {
  var marks = [].slice.call(document.querySelectorAll('.mark'));
  if (!marks.length) return;
  if (!('IntersectionObserver' in window)) {
    marks.forEach(function (m) { m.classList.add('lit'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('lit'); io.unobserve(e.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -18% 0px' });
  marks.forEach(function (m) { io.observe(m); });
})();

/* Scroll-fill: word-by-word gray-to-ink as a block scrolls through view.
   Only plain-text blocks (no inline tags) should carry .scroll-fill. */
(function () {
  var blocks = [].slice.call(document.querySelectorAll('.scroll-fill'));
  if (!blocks.length) return;

  blocks.forEach(function (b) {
    if (b.dataset.split) return;
    var tokens = b.textContent.split(/(\s+)/);
    b.textContent = '';
    tokens.forEach(function (tok) {
      if (!tok) return;
      if (/^\s+$/.test(tok)) { b.appendChild(document.createTextNode(tok)); }
      else { var s = document.createElement('span'); s.className = 'w'; s.textContent = tok; b.appendChild(s); }
    });
    b.dataset.split = '1';
  });

  // Reduced motion: leave words at normal ink, no orange fill.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var ticking = false;
  function update() {
    var vh = window.innerHeight;
    var start = vh * 0.85, end = vh * 0.4;
    blocks.forEach(function (b) {
      var top = b.getBoundingClientRect().top;
      var prog = (start - top) / (start - end);
      prog = prog < 0 ? 0 : prog > 1 ? 1 : prog;
      var ws = b.querySelectorAll('.w');
      var n = Math.round(prog * ws.length);
      for (var i = 0; i < ws.length; i++) {
        if ((i < n) !== ws[i].classList.contains('on')) { ws[i].classList.toggle('on', i < n); }
      }
    });
    ticking = false;
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
})();

/* Get to know me — hover tooltips. Cards are static. */
(function () {
  var section = document.querySelector('.know-me');
  if (!section) return;

  var tip = document.getElementById('kmTip');
  if (!tip) return;

  var cards = [].slice.call(section.querySelectorAll('.km-card'));
  cards.forEach(function (card) {
    var text = card.dataset.tip;
    if (!text) return;
    card.addEventListener('mouseenter', function () {
      tip.textContent = text;
      tip.classList.add('is-visible');
    });
    card.addEventListener('mousemove', function (e) {
      tip.style.left = e.clientX + 'px';
      tip.style.top  = e.clientY + 'px';
    });
    card.addEventListener('mouseleave', function () {
      tip.classList.remove('is-visible');
    });
  });
})();

/* Ask-me-anything: programmed, conversational replies. Quick-action chips map
   straight to an answer; free-typed questions are matched on keywords, with a
   friendly fallback. Replies render as chat bubbles after a short typing beat. */
(function () {
  var panel = document.getElementById('ask');
  if (!panel) return;

  var log = document.getElementById('askLog');
  var form = document.getElementById('askForm');
  var input = document.getElementById('askInput');
  var chips = document.getElementById('askChips');

  var LINKEDIN = "<a href=\"https://www.linkedin.com/in/roberto-viana-ux-ui/\" target=\"_blank\" rel=\"noopener\">LinkedIn</a>";
  var answers = {
    role: "I'm a product designer. I take dense, complex problems and turn them into clear, usable B2B products, research through design systems, and I ship them with engineering.",
    experience: "Senior product designer, 11 years in. I pair research and business strategy with hands-on building.",
    tenure: "+11 years of product design. Currently working with Figma and Claude.",
    ai: "I use AI to kill the busywork, research synthesis, first wireframes, prototypes, so my time goes to judgment and the high-impact calls. I work with Claude daily. This site was built with Claude Code.",
    tools: "Figma and the Adobe pack for design, Claude for building and automating the rest.",
    company: "Most of my recent work is with the Carlsberg Group: design systems, B2B e-commerce, and SaaS.",
    work: "Six case studies here, Carlshop Plus, Malty, Cadi, Forecast Demand, branding, and motion. Carlshop Plus is a strong place to start: <a href=\"cases/carlshop-plus.html\">case study</a>.",
    skills: "Research, information architecture, interaction design, design systems, and shipping with engineering. Strongest on dense, data-heavy B2B tools.",
    process: "Empathize and define, ideate, then prototype, test, and expand, so the team can react to something real, fast.",
    why: "I don't stop at mockups, I build. I ship real, data-heavy products and use AI to move faster without giving up design judgment.",
    industry: "Mostly B2B and enterprise: supply chain, e-commerce, field sales, and the beverage industry, the kind of dense data problems most people avoid.",
    hire: "Open to the right conversation. Reach me on " + LINKEDIN + ".",
    contact: LINKEDIN + " is best, I read every message.",
    logistics: "Happy to get into specifics like that over a chat, find me on " + LINKEDIN + ".",
    fallback: "I don't have that one on hand, it's best over a chat. Reach me on " + LINKEDIN + "."
  };

  // keyword -> intent, checked in order (specific first)
  var rules = [
    [/\b(how long|how many years|tenure|since when)\b/i, 'tenure'],
    [/\b(experience|background|work history|career|cv|resume|profile|seniority|senior)\b/i, 'experience'],
    [/\b(ai|artificial|automat|claude|gpt|llm|prompt|machine learning)\b/i, 'ai'],
    [/\b(tool|tools|stack|figma|software|use to|program|tech)\b/i, 'tools'],
    [/\b(carlsberg|company|companies|employer|where do you work|client|clients|who do you work)\b/i, 'company'],
    [/\b(process|method|methodology|how do you design|approach|workflow|design process)\b/i, 'process'],
    [/\b(skill|skills|good at|specialty|speciali|strength|expert|do you know|can you)\b/i, 'skills'],
    [/\b(why (should|hire|you|work)|different|stand out|unique|value you|what makes)\b/i, 'why'],
    [/\b(industry|industries|domain|sector|vertical|space|field)\b/i, 'industry'],
    [/\b(hire|hiring|available|availab|open to|freelanc|join|collaborat|onboard|start)\b/i, 'hire'],
    [/\b(contact|reach|email|linkedin|message|connect|get in touch|dm)\b/i, 'contact'],
    [/\b(location|based|where are you|relocat|salary|rate|pay|notice|visa|sponsor)\b/i, 'logistics'],
    [/\b(project|projects|case|cases|portfolio|best work|favou?rite|proud|work on|built)\b/i, 'work'],
    [/\b(who|what do you do|your role|designer|do you do|about you|tell me)\b/i, 'role']
  ];

  function matchIntent(text) {
    for (var i = 0; i < rules.length; i++) { if (rules[i][0].test(text)) return rules[i][1]; }
    return 'fallback';
  }

  function bubble(kind, html) {
    var el = document.createElement('div');
    el.className = 'ask-bubble ' + kind;
    el.innerHTML = html;
    log.appendChild(el);
    el.scrollIntoView({ block: 'nearest' });
    return el;
  }

  var busy = false;
  function answer(key, questionText) {
    if (busy) return;
    busy = true;
    bubble('user', questionText);
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var typing = bubble('bot typing', '&bull;&bull;&bull;');
    var wait = reduce ? 150 : 500 + Math.random() * 350;
    setTimeout(function () {
      typing.remove();
      bubble('bot', answers[key] || answers.fallback);
      busy = false;
    }, wait);
  }

  chips.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-key]');
    if (!b) return;
    answer(b.dataset.key, b.textContent);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var q = input.value.trim();
    if (!q) return;
    input.value = '';
    answer(matchIntent(q), q);
  });
})();
