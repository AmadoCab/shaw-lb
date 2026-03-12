// Shaw JAFL – Shavian keyboard  (Ctrl+Alt+S to toggle)
// Layout from: english_shavian_jafl.kmp  https://www.shavian.info/keyboards/

(_ => {
  // unshifted / shifted key maps
  const shaw_n = {a:'𐑪',b:'𐑣',c:'𐑞',d:'𐑩',e:'𐑰',f:'𐑦',g:'𐑳',h:'𐑤',i:'𐑛',j:'𐑮',k:'𐑕',l:'𐑯',m:'𐑚',n:'𐑝',o:'𐑓',p:';',q:'𐑱',r:'𐑥',s:'𐑨',t:'𐑒',u:'𐑑',v:'𐑟',w:'𐑧',x:'𐑴',y:'𐑐',z:'𐑲',';':'𐑢'}
  const shaw_s = {a:'𐑷',b:'‹',c:'𐑔',d:'𐑩',e:'𐑸',f:'𐑵',g:'𐑫',h:'·',i:'𐑡',j:'𐑮',k:'𐑖',l:'𐑙',m:'—',n:'›',o:'–',p:':',q:'𐑬',r:'𐑿',s:'𐑭',t:'𐑜',u:'𐑗',v:'𐑠',w:'𐑹',x:'☆',y:'⸰',z:'𐑶',';':'𐑘'}

  // j (𐑮) after these fuses into a compound vowel
  const shaw_jcomp = {'𐑩':'𐑼','𐑭':'𐑸','𐑷':'𐑹','𐑳':'𐑻','𐑱':'𐑺','𐑾':'𐑽'}

  // ☆ (Shift+X): decompose last compound char back into its parts
  const shaw_decomp = {'𐑼':'𐑩𐑮','𐑸':'𐑭𐑮','𐑹':'𐑷𐑮','𐑻':'𐑳𐑮','𐑺':'𐑱𐑮','𐑽':'𐑾𐑮','𐑾':'𐑦𐑩','𐑿':'𐑘𐑵','«':'‹‹','»':'››'}

  let on = false, prev = ''

  // indicator badge
  const ind = document.createElement('div')
  ind.style = 'position:fixed;bottom:8px;right:12px;z-index:2147483647;padding:4px 8px;border-radius:5px;font:bold 13px monospace;cursor:pointer;opacity:.85'
  document.body.appendChild(ind)

  const upd = () => {
    ind.textContent = on ? '𐑖𐑱𐑝𐑾𐑯 ✓' : '𐑖𐑱𐑝𐑾𐑯'
    ind.style.background = on ? '#2a6e3f' : '#444'
    ind.style.color = on ? '#cfc' : '#aaa'
  }
  ind.onclick = () => { on = !on; prev = ''; upd() }
  upd()

  // insert string at cursor, replacing any selection
  const ins = (el, ch) => {
    const s = el.selectionStart
    el.value = el.value.slice(0, s) + ch + el.value.slice(el.selectionEnd)
    el.selectionStart = el.selectionEnd = s + ch.length
    el.dispatchEvent(new Event('input', {bubbles: true}))
  }

  // delete n codepoints before cursor (handles Shavian surrogate pairs)
  const del = (el, n) => {
    let pos = el.selectionStart
    while (n-- > 0) {
      const hi = el.value.charCodeAt(pos - 2)
      pos -= (hi >= 0xD800 && hi <= 0xDBFF) ? 2 : 1
    }
    el.value = el.value.slice(0, Math.max(0, pos)) + el.value.slice(el.selectionStart)
    el.selectionStart = el.selectionEnd = Math.max(0, pos)
    el.dispatchEvent(new Event('input', {bubbles: true}))
  }

  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 's') {
      e.preventDefault(); on = !on; prev = ''; upd(); return
    }
    if (!on) return
    const el = e.target
    if (el.tagName !== 'TEXTAREA' && el.tagName !== 'INPUT') return
    if (e.ctrlKey || e.metaKey || e.altKey) return
    if (['Escape','Tab','Backspace','Delete','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) {
      prev = ''; return
    }

    const k = e.key.toLowerCase()
    const ch = e.shiftKey ? shaw_s[k] : shaw_n[k]
    if (ch === undefined) { if (e.key.length === 1) prev = ''; return }

    e.preventDefault()

    // Shift+X (☆): decompose last compound char into parts
    if (e.shiftKey && k === 'x') {
      const parts = shaw_decomp[prev]
      if (parts) { del(el, 1); ins(el, parts); prev = [...parts].pop() }
      return
    }

    // j (𐑮) after eligible vowel: fuse into compound
    if (!e.shiftKey && k === 'j' && shaw_jcomp[prev]) {
      const fused = shaw_jcomp[prev]; del(el, 1); ins(el, fused); prev = fused; return
    }

    // d (𐑩) after 𐑦: fuse into 𐑾
    if (!e.shiftKey && k === 'd' && prev === '𐑦') {
      del(el, 1); ins(el, '𐑾'); prev = '𐑾'; return
    }

    // Shift+D / Shift+J: insert bare letter, break composition chain
    if (e.shiftKey && (k === 'd' || k === 'j')) {
      ins(el, ch); prev = ''; return
    }

    // Shift+B (‹‹ -> «) and Shift+N (›› -> »)
    if (e.shiftKey && k === 'b' && prev === '‹') { del(el, 1); ins(el, '«'); prev = ''; return }
    if (e.shiftKey && k === 'n' && prev === '›') { del(el, 1); ins(el, '»'); prev = ''; return }

    // Shift+F (𐑵) after 𐑘: fuse into 𐑿
    if (e.shiftKey && k === 'f' && prev === '𐑘') { del(el, 1); ins(el, '𐑿'); prev = ''; return }

    // default: insert character, track last codepoint for composition
    ins(el, ch)
    prev = [...ch].pop()
  }, true)
})()
