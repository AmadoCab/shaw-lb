// Shaw JAFL – Shavian keyboard  (Ctrl+Alt+S to toggle)
// https://www.shavian.info/shaw_jafl_keyboard_layout/

const shaw_normal = {q:'𐑒',w:'𐑢',e:'𐑧',r:'𐑮',t:'𐑑',y:'𐑘',u:'𐑵',i:'𐑦',o:'𐑷',p:'𐑐','[':'‹',']':'›',a:'𐑩',s:'𐑕',d:'𐑛',f:'𐑓',g:'𐑜',h:'𐑣',j:'𐑡',k:'𐑤',l:'𐑯',';':'·',"'":'𐑖',z:'𐑟',c:'𐑗',v:'𐑝',b:'𐑚',n:'𐑥',m:'𐑞'};
const shaw_shift  = {Q:'𐑙',W:'𐑹',E:'𐑱',R:'𐑼',T:'𐑔',Y:'𐑿',U:'𐑫',I:'𐑰',O:'𐑴',P:'𐑐','{':'«','}':'»',A:'𐑨',S:'𐑖',D:'𐑗',F:'𐑛',G:'𐑞',H:'𐑣',J:'𐑠',K:'𐑤',L:'𐑯',N:'𐑯',M:'𐑥'};
const shaw_compounds = [['𐑦','𐑩','𐑮','𐑽'],['𐑩','𐑮','𐑼'],['𐑦','𐑩','𐑾'],['𐑳','𐑮','𐑻'],['𐑱','𐑮','𐑺'],['𐑭','𐑮','𐑸'],['𐑷','𐑮','𐑹'],['𐑘','𐑵','𐑿']];
const shaw_maxseq = 3;

let shaw_on = false, shaw_buf = [];

const shaw_ind = document.createElement('div');
shaw_ind.style = 'position:fixed;bottom:8px;right:12px;z-index:2147483647;padding:4px 8px;border-radius:5px;font:bold 13px monospace;cursor:pointer;opacity:.85';
document.body.appendChild(shaw_ind);

function shaw_update() {
  shaw_ind.textContent = shaw_on ? '𐑖𐑱𐑝𐑾𐑯 ✓' : '𐑖𐑱𐑝𐑾𐑯';
  shaw_ind.style.background = shaw_on ? '#2a6e3f' : '#444';
  shaw_ind.style.color = shaw_on ? '#cfc' : '#aaa';
}
shaw_ind.onclick = () => { shaw_on = !shaw_on; shaw_buf = []; shaw_update(); };
shaw_update();

function shaw_ins(el, ch) {
  const s = el.selectionStart, e = el.selectionEnd;
  el.value = el.value.slice(0,s) + ch + el.value.slice(e);
  el.selectionStart = el.selectionEnd = s + ch.length;
  el.dispatchEvent(new Event('input',{bubbles:true}));
}

function shaw_del(el, n) {
  const s = Math.max(0, el.selectionStart - n);
  el.value = el.value.slice(0,s) + el.value.slice(el.selectionStart);
  el.selectionStart = el.selectionEnd = s;
  el.dispatchEvent(new Event('input',{bubbles:true}));
}

function shaw_compound(el) {
  for (const c of shaw_compounds) {
    const [result, seq] = [c[c.length-1], c.slice(0,-1)];
    if (shaw_buf.length < seq.length) continue;
    if (seq.every((x,i) => shaw_buf[shaw_buf.length - seq.length + i] === x)) {
      shaw_del(el, seq.length);
      shaw_ins(el, result);
      shaw_buf.splice(-seq.length, seq.length, result);
      return;
    }
  }
}

document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 's') {
    e.preventDefault(); shaw_on = !shaw_on; shaw_buf = []; shaw_update(); return;
  }
  if (!shaw_on) return;
  const el = e.target;
  if (el.tagName !== 'TEXTAREA' && el.tagName !== 'INPUT') return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (['Escape','Enter','Tab','Backspace','Delete','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) { shaw_buf = []; return; }
  const ch = e.shiftKey ? shaw_shift[e.key] : shaw_normal[e.key.toLowerCase()];
  if (!ch) { if (e.key.length === 1) shaw_buf = []; return; }
  e.preventDefault();
  shaw_ins(el, ch);
  shaw_buf.push(ch); if (shaw_buf.length > shaw_maxseq) shaw_buf.shift();
  shaw_compound(el);
}, true);
