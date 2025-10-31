(function(){
  function text(selector) {
    var el = document.querySelector(selector);
    return el ? el.textContent.trim() : '';
  }

  function findValue(label) {
    // Looks for a .label element with the given text and returns the adjacent .value text
    var labels = document.querySelectorAll('.info-item');
    for (var i = 0; i < labels.length; i++) {
      var lab = labels[i].querySelector('.label');
      var val = labels[i].querySelector('.value');
      if (lab && val && lab.textContent.trim().toLowerCase().indexOf(label.toLowerCase()) !== -1) {
        return val.textContent.trim();
      }
    }
    return '';
  }

  function buildVCard() {
    var fullName = text('h1') || text('.header h1');
    var title = text('.header p') || '';
    var email = findValue('email') || '';
    var tel = findValue('contact') || findValue('contacto') || findValue('telefone') || '';
    var url = findValue('website') || '';
    var adr = findValue('localização') || findValue('location') || '';

    var lines = [];
    lines.push('BEGIN:VCARD');
    lines.push('VERSION:3.0');
    lines.push('FN:' + fullName);
    if (title) lines.push('TITLE:' + title);
    if (tel) lines.push('TEL;TYPE=CELL:' + tel.replace(/\s+/g, ''));
    if (email) lines.push('EMAIL;TYPE=INTERNET:' + email);
    if (url) lines.push('URL:' + url);
    if (adr) lines.push('ADR;TYPE=WORK:;;' + adr.replace(/\n/g, ' ') + ';;;;');
    lines.push('END:VCARD');

    return lines.join('\r\n');
  }

  function downloadVCard(filename, text) {
    var blob = new Blob([text], { type: 'text/vcard' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function(){ URL.revokeObjectURL(url); a.remove(); }, 1000);
  }

  function onSaveClick(e) {
    var vcard = buildVCard();
    var name = (document.querySelector('h1') || {textContent:'contact'}).textContent.trim() || 'contact';
    var filename = name.replace(/\s+/g, '_') + '.vcf';
    downloadVCard(filename, vcard);
  }

  document.addEventListener('DOMContentLoaded', function(){
    var btns = document.querySelectorAll('.save-contact-btn');
    for (var i=0;i<btns.length;i++) btns[i].addEventListener('click', onSaveClick);
  });
})();
