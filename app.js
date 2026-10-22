'use strict';
const citations = {
  plus: `@misc{nguyen2026tinysenseplus,
  title = {TinySense+: Entropy-Aware CSI Compression for
           Scalable and Adaptive Wi-Fi Sensing},
  author = {Nguyen, Phuc H. and Gian, Toan and Do, Cuong D.
            and Chatzinotas, Symeon and Nguyen, Van-Dinh},
  year = {2026},
  note = {Preprint},
  url = {https://www.alphaxiv.org/abs/2610.tinysense-entropy-aware-wifi-sensing}
}`,
  base: `@inproceedings{gian2026tinysense,
  title = {TinySense: Effective CSI Compression for
           Scalable and Accurate Wi-Fi Sensing},
  author = {Gian, Toan and Tran, Dung T. and Pham, Viet Quoc
            and Restuccia, Francesco and Nguyen, Van-Dinh},
  booktitle = {2026 IEEE International Conference on
               Pervasive Computing and Communications (PerCom)},
  year = {2026},
  doi = {10.1109/PerCom67906.2026.11524557}
}`
};
function selectCitation(key, focus = false) {
  document.getElementById('bibtex').textContent = citations[key];
  document.getElementById('bib-panel').setAttribute('aria-labelledby', `tab-${key}`);
  document.querySelectorAll('[data-paper]').forEach(button => {
    const selected = button.dataset.paper === key;
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
    if (selected && focus) button.focus();
  });
  document.getElementById('copy-status').textContent = '';
}
document.querySelectorAll('[data-paper]').forEach(button => {
  button.addEventListener('click', () => selectCitation(button.dataset.paper));
  button.addEventListener('keydown', event => {
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const key = event.key === 'Home' ? 'plus' : event.key === 'End' ? 'base' : button.dataset.paper === 'plus' ? 'base' : 'plus';
      selectCitation(key, true);
    }
  });
});
document.querySelectorAll('[data-cite]').forEach(link => link.addEventListener('click', () => selectCitation(link.dataset.cite)));
document.getElementById('copy-citation').addEventListener('click', async () => {
  const status = document.getElementById('copy-status');
  try {
    await navigator.clipboard.writeText(document.getElementById('bibtex').textContent);
    status.textContent = 'BibTeX copied to clipboard.';
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(document.getElementById('bibtex'));
    selection.removeAllRanges();
    selection.addRange(range);
    status.textContent = 'Citation selected. Press Ctrl+C (or ⌘C) to copy.';
  }
});
const points = {
  100: {bits: '3.21', ratio: '535×', pck: '44.01%'},
  75: {bits: '2.42', ratio: '710×', pck: '42.73%'},
  50: {bits: '1.69', ratio: '1,015×', pck: '40.36%'}
};
const strip = document.getElementById('token-strip');
for (let i = 0; i < 24; i++) strip.append(document.createElement('i'));
function showPoint(prefix) {
  const point = points[prefix];
  document.getElementById('prefix-bits').textContent = point.bits;
  document.getElementById('prefix-ratio').textContent = point.ratio;
  document.getElementById('prefix-pck').textContent = point.pck;
  [...strip.children].forEach((token, i) => token.classList.toggle('omitted', i >= 24 * Number(prefix) / 100));
}
document.querySelectorAll('input[name=prefix]').forEach(input => input.addEventListener('change', () => showPoint(input.value)));
showPoint('100');
