// Shaw JAFL – Shavian keyboard  (Ctrl+Alt+S to toggle)
// Layout from: english_shavian_jafl.kmp  https://www.shavian.info/keyboards/

// unshifted
const shaw_n = {a:'𐑪',b:'𐑣',c:'𐑞',d:'𐑩',e:'𐑰',f:'𐑦',g:'𐑳',h:'𐑤',i:'𐑛',j:'𐑮',k:'𐑕',l:'𐑯',m:'𐑚',n:'𐑝',o:'𐑓',p:';',q:'𐑱',r:'𐑥',s:'𐑨',t:'𐑒',u:'𐑑',v:'𐑟',w:'𐑧',x:'𐑴',y:'𐑐',z:'𐑲',';':'𐑢'};
// shifted
const shaw_s = {a:'𐑷',b:'‹',c:'𐑔',d:'⁞𐑩',e:'𐑸',f:'𐑵',g:'𐑫',h:'·',i:'𐑡',j:'⁞𐑮',k:'𐑖',l:'𐑙',m:'—',n:'›',o:'–',p:':',q:'𐑬',r:'𐑿',s:'𐑭',t:'𐑜',u:'𐑗',v:'𐑠',w:'𐑹',x:'☆',y:'⸰',z:'𐑶',';':'𐑘'};

// pressing j (𐑮) after one of these fuses into a compound
const shaw_jcomp = {'𐑩':'𐑼','𐑭':'𐑸','𐑷':'𐑹','𐑳':'𐑻','𐑱':'𐑺','𐑾':'𐑽'};

let shaw_on = false, shaw_prev = '';

const shaw_ind = document.createElement('div');
shaw_ind.style = 'position:fixed;bottom:8px;right:12px;z-index:2147483647;padding:4px 8px;border-radius:5px;font:bold 13px monospace;cursor:pointer;opacity:.85';
document.body.appendChild(shaw_ind);

function shaw_update() {
  shaw_ind.textContent = shaw_on ? '𐑖𐑱𐑝𐑾𐑯 ✓' : '𐑖𐑱𐑝𐑾𐑯';
  shaw_ind.style.background = shaw_on ? '#2a6e3f' : '#444';
  shaw_ind.style.color = shaw_on ? '#cfc' : '#aaa';
}
shaw_ind.onclick = () => { shaw_on = !shaw_on; shaw_prev = ''; shaw_update(); };
shaw_update();

function shaw_ins(el, ch) {
  const s = el.selectionStart, end = el.selectionEnd;
  el.value = el.value.slice(0, s) + ch + el.value.slice(end);
  el.selectionStart = el.selectionEnd = s + ch.length;
  el.dispatchEvent(new Event('input', {bubbles: true}));
}

function shaw_del(el, n) {
  const s = Math.max(0, el.selectionStart - n);
  el.value = el.value.slice(0, s) + el.value.slice(el.selectionStart);
  el.selectionStart = el.selectionEnd = s;
  el.dispatchEvent(new Event('input', {bubbles: true}));
}

document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 's') {
    e.preventDefault(); shaw_on = !shaw_on; shaw_prev = ''; shaw_update(); return;
  }
  if (!shaw_on) return;
  const el = e.target;
  if (el.tagName !== 'TEXTAREA' && el.tagName !== 'INPUT') return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (['Escape','Tab','Backspace','Delete','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) {
    shaw_prev = ''; return;
  }

  const k = e.key.toLowerCase();
  const ch = e.shiftKey ? shaw_s[k] : shaw_n[k];
  if (ch === undefined) { if (e.key.length === 1) shaw_prev = ''; return; }

  e.preventDefault();

  // j unshifted (𐑮): fuse with eligible previous char into compound
  if (!e.shiftKey && k === 'j' && shaw_jcomp[shaw_prev]) {
    shaw_del(el, 1);
    const fused = shaw_jcomp[shaw_prev];
    shaw_ins(el, fused);
    shaw_prev = fused;
    return;
  }

  // d unshifted (𐑩): if previous was 𐑦 (f), fuse → 𐑾
  if (!e.shiftKey && k === 'd' && shaw_prev === '𐑦') {
    shaw_del(el, 1);
    shaw_ins(el, '𐑾');
    shaw_prev = '𐑾';
    return;
  }

  // shift+b (‹): if previous was ‹, fuse → «
  if (e.shiftKey && k === 'b' && shaw_prev === '‹') {
    shaw_del(el, 1);
    shaw_ins(el, '«');
    shaw_prev = '';
    return;
  }

  // shift+n (›): if previous was ›, fuse → »
  if (e.shiftKey && k === 'n' && shaw_prev === '›') {
    shaw_del(el, 1);
    shaw_ins(el, '»');
    shaw_prev = '';
    return;
  }

  // shift+f (𐑵): if previous was 𐑘 (semicolon unshifted), fuse → 𐑿
  if (e.shiftKey && k === 'f' && shaw_prev === '𐑘') {
    shaw_del(el, 1);
    shaw_ins(el, '𐑿');
    shaw_prev = '';
    return;
  }

  shaw_ins(el, ch);
  shaw_prev = ch;
}, true);
