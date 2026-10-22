$(document).ready(function() {
  // add toggle functionality to abstract and bibtex buttons
  $('a.abstract').click(function() {
    $(this).parent().parent().find(".abstract.hidden").toggleClass('open');
    $(this).parent().parent().find(".bibtex.hidden.open").toggleClass('open');
  });
  $('a.bibtex').click(function() {
    $(this).parent().parent().find(".bibtex.hidden").toggleClass('open');
    $(this).parent().parent().find(".abstract.hidden.open").toggleClass('open');
  });
  $('a').removeClass('waves-effect waves-light');

  // bootstrap-toc
  if($('#toc-sidebar').length){
    var navSelector = "#toc-sidebar";
    var $myNav = $(navSelector);
    Toc.init($myNav);
    $("body").scrollspy({
      target: navSelector,
    });
  }

  // add css to jupyter notebooks
  const cssLink = document.createElement("link");
  cssLink.href  = "../css/jupyter.css";
  cssLink.rel   = "stylesheet";
  cssLink.type  = "text/css";

  let theme = localStorage.getItem("theme");
  if (theme == null || theme == "null") {
    const userPref = window.matchMedia;
    if (userPref && userPref("(prefers-color-scheme: dark)").matches) {
      theme = "dark";
    }
  }

  $('.jupyter-notebook-iframe-container iframe').each(function() {
    $(this).contents().find("head").append(cssLink);

    if (theme == "dark") {
      $(this).bind("load",function(){
        $(this).contents().find("body").attr({
          "data-jp-theme-light": "false",
          "data-jp-theme-name": "JupyterLab Dark"});
      });
    }
  });
});


// Keep collaborative author previews on one line, with at most five names.
document.querySelectorAll('[data-collaborative-authors]').forEach(function (row) {
  const authors = Array.from(row.querySelectorAll('.collaborative-author'));
  const toggle = row.querySelector('.collaborative-author-toggle');
  let expanded = false;

  function renderAuthors() {
    row.classList.toggle('authors-collapsed', !expanded);
    authors.forEach(function (author) { author.hidden = false; });
    toggle.hidden = false;
    toggle.setAttribute('aria-expanded', String(expanded));
    if (expanded) {
      toggle.textContent = 'Show fewer';
      return;
    }

    let visible = Math.min(5, authors.length);
    function updatePreview() {
      authors.forEach(function (author, index) { author.hidden = index >= visible; });
      const remaining = authors.length - visible;
      toggle.hidden = remaining === 0;
      toggle.textContent = ', ' + remaining + ' more author' + (remaining === 1 ? '' : 's');
    }
    updatePreview();
    while (visible > 1 && row.scrollWidth > row.clientWidth) {
      visible -= 1;
      updatePreview();
    }
  }

  toggle.addEventListener('click', function () {
    expanded = !expanded;
    renderAuthors();
  });
  let lastWidth;
  new ResizeObserver(function () {
    if (row.clientWidth !== lastWidth) {
      lastWidth = row.clientWidth;
      renderAuthors();
    }
  }).observe(row);
  renderAuthors();
  if (document.fonts) document.fonts.ready.then(renderAuthors);
});
