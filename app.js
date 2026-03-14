/* ============================================================
   app.js – UniConvert Pro | Main application logic
   ============================================================ */

/* ── State ── */
const STATE = {
    cat: 'length',
    from: 'm',
    to: 'km',
    val: 1,
    precision: 6,
    lang: localStorage.getItem('uc_lang') || navigator.language.slice(0, 2) || 'en',
    theme: localStorage.getItem('uc_theme') || 'dark',
    favorites: JSON.parse(localStorage.getItem('uc_favs') || '[]'),
    currencyRates: null,
    currencyLoaded: false,
    pendingInstall: null,
    currChart: null,
};
if (!['en', 'it', 'es', 'de'].includes(STATE.lang)) STATE.lang = 'en';

/* ── Helpers ── */
const $ = id => document.getElementById(id);
const fmt = (n, p) => isNaN(n) || !isFinite(n) ? '—' :
    new Intl.NumberFormat(undefined, { maximumFractionDigits: p, minimumFractionDigits: 0 }).format(n);
const fmtRaw = (n, p) => isNaN(n) || !isFinite(n) ? '—' : parseFloat(n.toFixed(p)).toString();
const t = key => (I18N[STATE.lang] || I18N.en)[key] || key;
const showToast = (msg, dur = 2200) => {
    const el = $('toast'); el.textContent = msg; el.classList.add('show');
    clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), dur);
};
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

/* ── THEME ── */
function applyTheme(theme) {
    STATE.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    $('themeToggle').textContent = theme === 'dark' ? '🌙' : '☀️';
    localStorage.setItem('uc_theme', theme);
}
$('themeToggle').addEventListener('click', () => applyTheme(STATE.theme === 'dark' ? 'light' : 'dark'));
applyTheme(STATE.theme);

/* ── INSTALL PWA ── */
window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault(); STATE.pendingInstall = e;
    $('installBtn').style.display = 'flex';
});
$('installBtn').addEventListener('click', async () => {
    if (!STATE.pendingInstall) return;
    STATE.pendingInstall.prompt();
    const { outcome } = await STATE.pendingInstall.userChoice;
    if (outcome === 'accepted') $('installBtn').style.display = 'none';
    STATE.pendingInstall = null;
});

/* ── LANGUAGE ── */
$('langToggle').addEventListener('click', () => { $('langModal').style.display = 'flex'; });
$('langClose').addEventListener('click', () => { $('langModal').style.display = 'none'; });
$('langModal').addEventListener('click', e => { if (e.target === $('langModal')) $('langModal').style.display = 'none'; });
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        STATE.lang = btn.dataset.lang;
        localStorage.setItem('uc_lang', STATE.lang);
        $('langModal').style.display = 'none';
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === STATE.lang));
        renderAll();
    });
    if (btn.dataset.lang === STATE.lang) btn.classList.add('active');
});

/* ── CORE CONVERSION ENGINE ── */
function doConvert(val, from, to, cat) {
    if (val === '' || val === null || isNaN(val)) return NaN;
    const v = parseFloat(val);
    if (cat === 'temperature') return convertTemperature(v, from, to);
    if (cat === 'fuel') return convertFuel(v, from, to);
    if (cat === 'shoe') return convertShoe(v, from, to);
    if (cat === 'percentage') return convertPercentage(v, from, to);
    const catData = UNITS[cat];
    if (!catData) return NaN;
    const fuBase = catData.units[from]?.f;
    const toBase = catData.units[to]?.f;
    if (fuBase == null || toBase == null) return NaN;
    const inBase = v * fuBase;
    return inBase / toBase;
}

/* ── CATEGORY TABS ── */
function buildCatNav() {
    const scroll = document.querySelector('.cat-scroll');
    scroll.innerHTML = CATEGORIES.map(c =>
        `<button class="cat-btn${STATE.cat === c.id ? ' active' : ''}" data-cat="${c.id}" aria-pressed="${STATE.cat === c.id}" aria-label="${c.label} converter">
      ${c.label}
    </button>`
    ).join('');
    scroll.querySelectorAll('.cat-btn').forEach(btn => {
        btn.addEventListener('click', () => selectCategory(btn.dataset.cat));
    });
}

function selectCategory(cat) {
    STATE.cat = cat;
    const catData = UNITS[cat];
    // Special categories use dedicated tools
    const specials = ['currency', 'timezone', 'color', 'bmi', 'age', 'base', 'roman', 'password', 'base64', 'qr'];
    // Hide/show sections
    $('converterCard').style.display = specials.includes(cat) ? 'none' : '';
    document.querySelectorAll('[id^="tool"]').forEach(el => el.style.display = 'none');
    if (specials.includes(cat)) {
        const toolId = 'tool' + cat.charAt(0).toUpperCase() + cat.slice(1);
        const tool = $(toolId);
        if (tool) tool.style.display = '';
    } else {
        // Set default units for category
        if (catData) {
            const keys = Object.keys(catData.units);
            STATE.from = keys[0];
            STATE.to = keys[1] || keys[0];
            populateSelects();
            doFullConvert();
        }
    }
    // Update nav
    document.querySelectorAll('.cat-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.cat === cat);
        b.setAttribute('aria-pressed', b.dataset.cat === cat);
    });
    $('catTitle').textContent = CATEGORIES.find(c => c.id === cat)?.label || cat;
    updateURL();
    updateSEO();
}

function populateSelects() {
    const cat = STATE.cat;
    const catData = UNITS[cat];
    if (!catData) return;
    const units = catData.units;
    const opts = Object.entries(units).map(([k, v]) =>
        `<option value="${k}">${v.label}</option>`
    ).join('');
    $('fromUnit').innerHTML = opts;
    $('toUnit').innerHTML = opts;
    $('fromUnit').value = STATE.from;
    $('toUnit').value = STATE.to;
}

/* ── FULL CONVERT (main fields) ── */
function doFullConvert() {
    const val = $('fromVal').value;
    STATE.val = val;
    STATE.from = $('fromUnit').value;
    STATE.to = $('toUnit').value;
    STATE.precision = parseInt($('precisionSel').value) || 6;
    const result = doConvert(val, STATE.from, STATE.to, STATE.cat);
    $('toVal').value = val === '' ? '' : fmtRaw(result, STATE.precision);
    renderMultiResult(val);
    renderFormula();
    renderRefTable();
    updateURL();
    updateSEO();
}

/* ── MULTI RESULT (same value in multiple units) ── */
function renderMultiResult(val) {
    if (!val || val === '') { $('multiResult').innerHTML = ''; return; }
    const cat = STATE.cat;
    const catData = UNITS[cat];
    if (!catData) return;
    const units = Object.keys(catData.units);
    const chips = units
        .filter(k => k !== STATE.from && k !== STATE.to)
        .slice(0, 5)
        .map(k => {
            const r = doConvert(parseFloat(val), STATE.from, k, cat);
            return `<div class="multi-chip" title="Click to set as target" data-unit="${k}">
        <span class="chip-val">${fmt(r, Math.min(STATE.precision, 4))}</span>
        <span class="chip-unit">${catData.units[k].label.split('(')[1]?.replace(')', '') || k}</span>
      </div>`;
        }).join('');
    $('multiResult').innerHTML = chips;
    $('multiResult').querySelectorAll('.multi-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            $('toUnit').value = chip.dataset.unit;
            STATE.to = chip.dataset.unit;
            doFullConvert();
        });
    });
}

/* ── FORMULA ── */
function renderFormula() {
    const box = $('formulaBox');
    const cat = STATE.cat;
    const catData = UNITS[cat];
    if (!catData) { box.classList.remove('visible'); return; }
    let text = '';
    if (cat === 'temperature') {
        const pairs = {
            'C-F': '°F = °C × 9/5 + 32',
            'F-C': '°C = (°F − 32) × 5/9',
            'C-K': 'K = °C + 273.15',
            'K-C': '°C = K − 273.15',
            'F-K': 'K = (°F + 459.67) × 5/9',
            'K-F': '°F = K × 9/5 − 459.67',
        };
        text = pairs[`${STATE.from}-${STATE.to}`] || '';
    } else {
        const fF = catData.units[STATE.from]?.f;
        const tF = catData.units[STATE.to]?.f;
        if (fF && tF) {
            const factor = fF / tF;
            const fromLabel = catData.units[STATE.from]?.label.split('(')[0].trim();
            const toLabel = catData.units[STATE.to]?.label.split('(')[0].trim();
            text = `1 ${fromLabel} = ${fmt(factor, 8)} ${toLabel}   →   multiply by ${fmtRaw(factor, 8)}`;
        }
    }
    if (text) { box.textContent = text; box.classList.add('visible'); }
    else box.classList.remove('visible');
}

/* ── REFERENCE TABLE ── */
function renderRefTable() {
    const cat = STATE.cat;
    const catData = UNITS[cat];
    const wrap = $('refTable');
    if (!catData || !$('fromVal').value) { wrap.innerHTML = ''; return; }
    const refs = [0.1, 0.25, 0.5, 1, 2, 5, 10, 20, 50, 100, 250, 500, 1000];
    const fromL = catData.units[STATE.from]?.label.split('(')[0].trim() || STATE.from;
    const toL = catData.units[STATE.to]?.label.split('(')[0].trim() || STATE.to;
    const rows = refs.map(v => {
        const r = doConvert(v, STATE.from, STATE.to, cat);
        return `<tr data-val="${v}"><td>${fmt(v, 2)} ${fromL}</td><td>≈ <strong>${fmt(r, Math.min(STATE.precision, 4))}</strong> ${toL}</td></tr>`;
    }).join('');
    wrap.innerHTML = `<table class="ref-table" aria-label="Reference conversion table">
    <thead><tr><th>${fromL}</th><th>${toL}</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
    wrap.querySelectorAll('tr[data-val]').forEach(tr => {
        tr.addEventListener('click', () => {
            $('fromVal').value = tr.dataset.val;
            doFullConvert();
        });
    });
}

/* ── SWAP ── */
$('swapBtn').addEventListener('click', () => {
    const tmp = $('fromUnit').value;
    $('fromUnit').value = $('toUnit').value;
    $('toUnit').value = tmp;
    const tmpV = $('fromVal').value;
    $('fromVal').value = $('toVal').value;
    STATE.from = $('fromUnit').value;
    STATE.to = $('toUnit').value;
    doFullConvert();
});

/* ── REVERSE (set result as input) ── */
$('reverseBtn').addEventListener('click', () => {
    $('fromVal').value = $('toVal').value;
    doFullConvert();
});

/* ── COPY ── */
$('copyBtn').addEventListener('click', () => {
    const text = $('toVal').value;
    if (!text || text === '—') return;
    navigator.clipboard.writeText(text).then(() => showToast(t('copied')));
});

/* ── SHARE ── */
$('shareBtn').addEventListener('click', () => {
    const url = window.location.href;
    const text = `${$('fromVal').value} ${STATE.from} = ${$('toVal').value} ${STATE.to} | UniConvert Pro`;
    if (navigator.share) {
        navigator.share({ title: 'UniConvert Pro', text, url }).catch(() => { });
    } else {
        navigator.clipboard.writeText(url).then(() => showToast('🔗 Link copied!'));
    }
});

/* ── FAVORITES ── */
$('favBtn').addEventListener('click', () => {
    const key = `${STATE.cat}::${STATE.from}::${STATE.to}`;
    const exists = STATE.favorites.find(f => f.key === key);
    if (exists) {
        STATE.favorites = STATE.favorites.filter(f => f.key !== key);
        showToast('★ Removed from favorites');
    } else {
        STATE.favorites.push({ key, cat: STATE.cat, from: STATE.from, to: STATE.to });
        showToast('⭐ Added to favorites!');
    }
    localStorage.setItem('uc_favs', JSON.stringify(STATE.favorites));
    renderFavorites();
});

function renderFavorites() {
    const list = $('favList');
    const empty = $('favEmpty');
    if (!STATE.favorites.length) { list.innerHTML = ''; empty.style.display = ''; return; }
    empty.style.display = 'none';
    list.innerHTML = STATE.favorites.map(fav => {
        const catData = UNITS[fav.cat];
        const fromL = catData?.units[fav.from]?.label?.split('(')[0]?.trim() || fav.from;
        const toL = catData?.units[fav.to]?.label?.split('(')[0]?.trim() || fav.to;
        return `<div class="fav-item" data-key="${fav.key}" data-cat="${fav.cat}" data-from="${fav.from}" data-to="${fav.to}">
      <div><div class="fav-item-label">${fromL} → ${toL}</div>
      <div class="fav-item-sub">${CATEGORIES.find(c => c.id === fav.cat)?.label || fav.cat}</div></div>
      <button class="fav-remove" data-key="${fav.key}" aria-label="Remove favorite">✕</button>
    </div>`;
    }).join('');
    list.querySelectorAll('.fav-item').forEach(item => {
        item.addEventListener('click', e => {
            if (e.target.classList.contains('fav-remove')) return;
            selectCategory(item.dataset.cat);
            setTimeout(() => {
                $('fromUnit').value = item.dataset.from;
                $('toUnit').value = item.dataset.to;
                STATE.from = item.dataset.from;
                STATE.to = item.dataset.to;
                doFullConvert();
            }, 50);
        });
    });
    list.querySelectorAll('.fav-remove').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            STATE.favorites = STATE.favorites.filter(f => f.key !== btn.dataset.key);
            localStorage.setItem('uc_favs', JSON.stringify(STATE.favorites));
            renderFavorites();
        });
    });
}

/* ── PRECISION ── */
$('precisionSel').addEventListener('change', doFullConvert);

/* ── INPUT LISTENERS ── */
$('fromVal').addEventListener('input', doFullConvert);
$('fromUnit').addEventListener('change', doFullConvert);
$('toUnit').addEventListener('change', doFullConvert);

/* ── NATURAL LANGUAGE SEARCH (optional – only if element exists) ── */
const _nlSearch = $('nlSearch');
const _clearSearch = $('clearSearch');
if (_nlSearch) {
    _nlSearch.addEventListener('input', function () {
        const v = this.value.trim();
        if (_clearSearch) _clearSearch.style.display = v ? '' : 'none';
        if (!v) { if ($('nlResult')) $('nlResult').textContent = ''; return; }
        for (const p of NL_PATTERNS) {
            const m = v.match(p.re);
            if (m) {
                const num = parseFloat(m[1].replace(',', '.'));
                const result = doConvert(num, p.from, p.to, p.cat);
                const catD = UNITS[p.cat];
                const fL = catD?.units[p.from]?.label?.split('(')[0]?.trim() || p.from;
                const tL = catD?.units[p.to]?.label?.split('(')[0]?.trim() || p.to;
                if ($('nlResult')) $('nlResult').innerHTML = `<span>${fmt(num, 4)} ${fL} = <strong>${fmt(result, STATE.precision)} ${tL}</strong></span>`;
                selectCategory(p.cat);
                setTimeout(() => {
                    $('fromVal').value = num;
                    $('fromUnit').value = p.from;
                    $('toUnit').value = p.to;
                    STATE.from = p.from; STATE.to = p.to;
                    doFullConvert();
                }, 10);
                return;
            }
        }
        if ($('nlResult')) $('nlResult').innerHTML = `<span style="color:var(--text-muted)">Try "75 kg to lbs"…</span>`;
    });
}
if (_clearSearch) {
    _clearSearch.addEventListener('click', () => {
        if (_nlSearch) _nlSearch.value = '';
        if ($('nlResult')) $('nlResult').textContent = '';
        _clearSearch.style.display = 'none';
    });
}

/* ── URL ROUTING ── */
function updateURL() {
    const cat = STATE.cat;
    const specials = ['currency', 'timezone', 'color', 'bmi', 'age', 'base', 'roman', 'password', 'base64', 'qr'];
    if (specials.includes(cat)) {
        history.replaceState(null, '', `?cat=${cat}`);
        return;
    }
    const val = $('fromVal').value || '';
    const q = `?cat=${cat}&from=${STATE.from}&to=${STATE.to}${val ? `&val=${val}` : ''}`;
    history.replaceState(null, '', q);
}

function loadFromURL() {
    const sp = new URLSearchParams(location.search);
    const cat = sp.get('cat') || 'length';
    const from = sp.get('from');
    const to = sp.get('to');
    const val = sp.get('val');
    const catData = UNITS[cat];
    if (catData) {
        const keys = Object.keys(catData.units);
        STATE.from = keys.includes(from) ? from : keys[0];
        STATE.to = keys.includes(to) ? to : (keys[1] || keys[0]);
    }
    selectCategory(cat);
    setTimeout(() => {
        if (from && $('fromUnit')) $('fromUnit').value = STATE.from;
        if (to && $('toUnit')) $('toUnit').value = STATE.to;
        if (val && $('fromVal')) { $('fromVal').value = val; doFullConvert(); }
    }, 30);
}

/* ── SEO: Dynamic meta / title ── */
function updateSEO() {
    const cat = CATEGORIES.find(c => c.id === STATE.cat)?.label || STATE.cat;
    const fromV = $('fromVal')?.value || '';
    const toV = $('toVal')?.value || '';
    const fromU = STATE.from || '';
    const toU = STATE.to || '';
    let title = 'UniConvert Pro – All-in-One Instant Converter 2026';
    let desc = 'Free, fast, offline unit converter. Convert length, weight, temperature, volume, speed, data, currency and 25+ categories. No ads, no tracking.';
    if (fromV && toV && fromV !== '' && toV !== '—') {
        title = `${fromV} ${fromU} to ${toU} = ${toV} – ${cat} Converter | UniConvert Pro`;
        desc = `Convert ${fromV} ${fromU} to ${toU}: the result is ${toV} ${toU}. Free instant ${cat.toLowerCase()} converter, no ads, offline capable.`;
    } else if (STATE.cat !== 'length' || fromU !== 'm') {
        title = `${fromU} to ${toU} Converter – ${cat} | UniConvert Pro`;
        desc = `Easily convert ${fromU} to ${toU} online. Free ${cat.toLowerCase()} unit converter with formula, reference table, and offline support.`;
    }
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', desc);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', desc);
    // H1
    const h1 = $('seoH1');
    if (h1) {
        if (fromV && toV && toV !== '—')
            h1.textContent = `${fromV} ${fromU} = ${toV} ${toU}`;
        else
            h1.textContent = 'UniConvert Pro';
    }
}

/* ── POPULAR CONVERSIONS ── */
function renderPopular() {
    const grid = $('popularGrid');
    if (!grid) return;
    grid.innerHTML = POPULAR_CONVERSIONS.map(p => {
        const result = doConvert(p.val, p.from, p.to, p.cat);
        return `<div class="popular-card" data-cat="${p.cat}" data-from="${p.from}" data-to="${p.to}" data-val="${p.val}" tabindex="0" role="button" aria-label="Convert ${p.val} ${p.from} to ${p.to}">
      <div class="pop-cat">${CATEGORIES.find(c => c.id === p.cat)?.label || p.cat}</div>
      <div class="pop-label">${p.val} ${p.from} → ${fmt(result, 4)} ${p.to}</div>
    </div>`;
    }).join('');
    grid.querySelectorAll('.popular-card').forEach(card => {
        const handler = () => {
            selectCategory(card.dataset.cat);
            setTimeout(() => {
                $('fromVal').value = card.dataset.val;
                $('fromUnit').value = card.dataset.from;
                $('toUnit').value = card.dataset.to;
                STATE.from = card.dataset.from;
                STATE.to = card.dataset.to;
                doFullConvert();
                $('main').scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 30);
        };
        card.addEventListener('click', handler);
        card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') handler(); });
    });
}

/* ================================================================
   CURRENCY TOOL
   ================================================================ */
function initCurrency() {
    const sel1 = $('currFrom'), sel2 = $('currTo');
    if (!sel1) return;
    const opts = Object.keys(CURRENCY_FALLBACK).map(c =>
        `<option value="${c}"${c === 'EUR' ? ' selected' : ''}>${c}</option>`
    ).join('');
    const optsTo = Object.keys(CURRENCY_FALLBACK).map(c =>
        `<option value="${c}"${c === 'USD' ? ' selected' : ''}>${c}</option>`
    ).join('');
    sel1.innerHTML = opts; sel2.innerHTML = optsTo;
    $('currFromVal').value = 1;
    $('currencyStatus').innerHTML = `<span class="anim-pulse">⏳ Loading live rates…</span>`;
    fetchLiveRates();
    $('currFromVal').addEventListener('input', doCurrencyConvert);
    sel1.addEventListener('change', doCurrencyConvert);
    sel2.addEventListener('change', doCurrencyConvert);
    $('currSwap').addEventListener('click', () => {
        const t = sel1.value; sel1.value = sel2.value; sel2.value = t;
        const tv = $('currFromVal').value; $('currFromVal').value = $('currToVal').value;
        doCurrencyConvert();
    });
}

function fetchLiveRates() {
    const cached = localStorage.getItem('uc_rates');
    const cachedTime = parseInt(localStorage.getItem('uc_rates_ts') || '0');
    if (cached && Date.now() - cachedTime < 3600000) {
        try {
            STATE.currencyRates = JSON.parse(cached);
            STATE.currencyLoaded = true;
            $('currencyStatus').textContent = '🟢 Live rates (cached)';
            doCurrencyConvert();
            return;
        } catch (e) { }
    }
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
        .then(r => r.json()).then(data => {
            STATE.currencyRates = data.rates;
            STATE.currencyLoaded = true;
            localStorage.setItem('uc_rates', JSON.stringify(data.rates));
            localStorage.setItem('uc_rates_ts', Date.now().toString());
            $('currencyStatus').textContent = '🟢 Live rates (updated now)';
            doCurrencyConvert();
        }).catch(() => {
            STATE.currencyRates = CURRENCY_FALLBACK;
            $('currencyStatus').textContent = '📦 Fallback rates (Jan 2026) – could not fetch live';
            doCurrencyConvert();
        });
}

function doCurrencyConvert() {
    const rates = STATE.currencyRates || CURRENCY_FALLBACK;
    const from = $('currFrom')?.value;
    const to = $('currTo')?.value;
    const val = parseFloat($('currFromVal')?.value || 1);
    if (!from || !to || isNaN(val)) return;
    const r1 = rates[from] || CURRENCY_FALLBACK[from] || 1;
    const r2 = rates[to] || CURRENCY_FALLBACK[to] || 1;
    const result = (val / r1) * r2;
    if ($('currToVal')) $('currToVal').value = fmtRaw(result, 4);
    if ($('currencyInfo')) {
        const rate = r2 / r1;
        $('currencyInfo').textContent = `1 ${from} = ${fmtRaw(rate, 6)} ${to}`;
    }
}

/* ================================================================
   TIMEZONE TOOL
   ================================================================ */
function initTimezone() {
    const selFrom = $('tzFrom'), selTo = $('tzTo');
    if (!selFrom) return;
    const opts = TIMEZONES.map(tz =>
        `<option value="${tz.tz}">${tz.label}</option>`
    ).join('');
    selFrom.innerHTML = opts; selTo.innerHTML = opts;
    selFrom.value = 'UTC';
    selTo.value = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    $('tzDateTime').value = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    $('tzFrom').addEventListener('change', doTimezoneConvert);
    $('tzTo').addEventListener('change', doTimezoneConvert);
    $('tzDateTime').addEventListener('change', doTimezoneConvert);
    doTimezoneConvert();
}

function doTimezoneConvert() {
    const from = $('tzFrom')?.value;
    const to = $('tzTo')?.value;
    const dt = $('tzDateTime')?.value;
    if (!from || !to || !dt) return;
    try {
        const d = new Date(dt);
        const result = d.toLocaleString('en-GB', { timeZone: to, dateStyle: 'full', timeStyle: 'long' });
        $('tzResult').textContent = result;
    } catch (e) {
        $('tzResult').textContent = 'Invalid timezone';
    }
}

/* ================================================================
   COLOR CONVERTER
   ================================================================ */
function initColor() {
    const picker = $('colorPicker');
    if (!picker) return;
    picker.addEventListener('input', e => hexToAll(e.target.value));
    $('colorHex').addEventListener('input', e => hexToAll(e.target.value));
    $('colorRgb').addEventListener('input', e => rgbStrToAll(e.target.value));
    $('colorHsl').addEventListener('input', e => hslStrToAll(e.target.value));
    hexToAll('#6366f1');
}

function hexToAll(hex) {
    hex = hex.trim();
    if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return;
    $('colorHex').value = hex;
    $('colorPicker').value = hex;
    $('colorPreview').style.background = hex;
    const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
    $('colorRgb').value = `${r}, ${g}, ${b}`;
    const [h, s, l] = rgbToHsl(r, g, b);
    $('colorHsl').value = `${Math.round(h)}°, ${Math.round(s)}%, ${Math.round(l)}%`;
}
function rgbStrToAll(str) {
    const m = str.match(/(\d+)\D+(\d+)\D+(\d+)/);
    if (!m) return;
    const [r, g, b] = [+m[1], +m[2], +m[3]].map(v => clamp(v, 0, 255));
    const hex = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
    hexToAll(hex);
}
function hslStrToAll(str) {
    const m = str.match(/([\d.]+)\D+([\d.]+)\D+([\d.]+)/);
    if (!m) return;
    const [r, g, b] = hslToRgb(+m[1], +m[2], +m[3]);
    const hex = '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
    hexToAll(hex);
}
function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
    if (mx === mn) return [0, 0, l * 100];
    const d = mx - mn, s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn);
    let h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return [h * 60, s * 100, l * 100];
}
function hslToRgb(h, s, l) {
    s /= 100; l /= 100;
    const k = n => (n + h / 30) % 12; const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [f(0) * 255, f(8) * 255, f(4) * 255];
}

/* ================================================================
   BMI TOOL
   ================================================================ */
function initBMI() {
    $('bmiWeight')?.addEventListener('input', doBMI);
    $('bmiHeight')?.addEventListener('input', doBMI);
}
function doBMI() {
    const w = parseFloat($('bmiWeight').value);
    const h = parseFloat($('bmiHeight').value) / 100;
    if (!w || !h) { $('bmiResult').innerHTML = ''; return; }
    const bmi = w / (h * h);
    let cat = '', color = 'var(--accent2)';
    if (bmi < 18.5) { cat = 'Underweight'; color = 'var(--warning)'; }
    else if (bmi < 25) { cat = 'Normal weight ✅'; color = 'var(--success)'; }
    else if (bmi < 30) { cat = 'Overweight'; color = 'var(--warning)'; }
    else { cat = 'Obese'; color = 'var(--danger)'; }
    $('bmiResult').innerHTML = `<span style="color:${color}">BMI: ${bmi.toFixed(1)} – ${cat}</span>`;
}

/* ================================================================
   AGE / DATE TOOL
   ================================================================ */
function initAge() {
    const today = new Date().toISOString().slice(0, 10);
    $('ageRef').value = today;
    $('ageBirth')?.addEventListener('change', doAge);
    $('ageRef')?.addEventListener('change', doAge);
}
function doAge() {
    const birth = new Date($('ageBirth').value);
    const ref = new Date($('ageRef').value);
    if (isNaN(birth) || isNaN(ref)) { $('ageResult').innerHTML = ''; return; }
    const ms = ref - birth;
    const days = Math.floor(ms / 86400000);
    const years = Math.floor(days / 365.25);
    const months = Math.floor((days % 365.25) / 30.44);
    const rdays = days - Math.floor(years * 365.25) - Math.floor(months * 30.44);
    $('ageResult').innerHTML = `
    <strong>${years} years, ${months} months, ${rdays} days</strong><br>
    <span style="color:var(--text-muted)">= ${days.toLocaleString()} total days &nbsp;|&nbsp; ${(ms / 3600000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} hours</span>`;
}

/* ================================================================
   BASE CONVERTER (Hex/Binary/Decimal/Octal)
   ================================================================ */
function initBase() {
    ['baseDec', 'baseBin', 'baseHex', 'baseOct'].forEach(id => {
        $(id)?.addEventListener('input', e => doBase(id, e.target.value));
    });
}
function doBase(sourceId, val) {
    if (!val) { ['baseDec', 'baseBin', 'baseHex', 'baseOct'].forEach(i => { if (i !== sourceId && $(i)) $(i).value = ''; }); return; }
    let num;
    try {
        if (sourceId === 'baseDec') num = parseInt(val, 10);
        else if (sourceId === 'baseBin') num = parseInt(val, 2);
        else if (sourceId === 'baseHex') num = parseInt(val, 16);
        else if (sourceId === 'baseOct') num = parseInt(val, 8);
    } catch (e) { return; }
    if (isNaN(num)) return;
    if (sourceId !== 'baseDec') $('baseDec').value = num.toString(10);
    if (sourceId !== 'baseBin') $('baseBin').value = (num >>> 0).toString(2);
    if (sourceId !== 'baseHex') $('baseHex').value = num.toString(16).toUpperCase();
    if (sourceId !== 'baseOct') $('baseOct').value = num.toString(8);
}

/* ================================================================
   ROMAN NUMERALS
   ================================================================ */
function initRoman() {
    $('romanDec')?.addEventListener('input', e => {
        const n = parseInt(e.target.value);
        if (n > 0 && n <= 3999) $('romanStr').value = toRoman(n);
        else $('romanStr').value = '';
    });
    $('romanStr')?.addEventListener('input', e => {
        const n = fromRoman(e.target.value.toUpperCase());
        $('romanDec').value = n > 0 ? n : '';
    });
}
function toRoman(n) {
    const v = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const s = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
    let r = '';
    for (let i = 0; i < v.length; i++) { while (n >= v[i]) { r += s[i]; n -= v[i]; } }
    return r;
}
function fromRoman(s) {
    const m = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    let n = 0;
    for (let i = 0; i < s.length; i++) {
        const c = m[s[i]] || 0, nx = m[s[i + 1]] || 0;
        n += c < nx ? -c : c;
    }
    return n;
}

/* ================================================================
   PASSWORD GENERATOR
   ================================================================ */
function initPassword() {
    $('passLen')?.addEventListener('input', e => {
        $('passLenVal').textContent = e.target.value;
        genPassword();
    });
    $('passGen')?.addEventListener('click', genPassword);
    $('passCopy')?.addEventListener('click', () => {
        navigator.clipboard.writeText($('passResult').value).then(() => showToast(t('copied')));
    });
    genPassword();
}
function genPassword() {
    let chars = '';
    if ($('passUpper').checked) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if ($('passLower').checked) chars += 'abcdefghijklmnopqrstuvwxyz';
    if ($('passNums').checked) chars += '0123456789';
    if ($('passSymbols').checked) chars += '!@#$%^&*()-_=+[]{}|;:,.<>?';
    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';
    const len = parseInt($('passLen').value) || 16;
    let pwd = '';
    const arr = new Uint32Array(len);
    crypto.getRandomValues(arr);
    arr.forEach(n => pwd += chars[n % chars.length]);
    $('passResult').value = pwd;
    calcStrength(pwd);
}
function calcStrength(pwd) {
    let score = 0;
    if (pwd.length >= 12) score++;
    if (pwd.length >= 20) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    const pct = Math.round(score / 6 * 100);
    const bar = $('strengthBar');
    const lbl = $('strengthLabel');
    bar.style.width = pct + '%';
    if (score <= 2) { bar.style.background = 'var(--danger)'; lbl.textContent = 'Weak'; lbl.style.color = 'var(--danger)'; }
    else if (score <= 4) { bar.style.background = 'var(--warning)'; lbl.textContent = 'Fair'; lbl.style.color = 'var(--warning)'; }
    else { bar.style.background = 'var(--success)'; lbl.textContent = 'Strong'; lbl.style.color = 'var(--success)'; }
}

/* ================================================================
   BASE64
   ================================================================ */
function initBase64() {
    $('b64Encode')?.addEventListener('click', () => {
        try { $('b64Output').value = btoa(unescape(encodeURIComponent($('b64Input').value))); }
        catch (e) { $('b64Output').value = 'Error: ' + e.message; }
    });
    $('b64Decode')?.addEventListener('click', () => {
        try { $('b64Output').value = decodeURIComponent(escape(atob($('b64Input').value.trim()))); }
        catch (e) { $('b64Output').value = 'Error: invalid Base64'; }
    });
}

/* ================================================================
   QR CODE (via Google Charts API – no JS lib needed)
   ================================================================ */
function initQR() {
    $('qrGen')?.addEventListener('click', () => {
        const text = encodeURIComponent($('qrInput').value || 'https://uniconvert.pro/');
        const url = `https://chart.googleapis.com/chart?cht=qr&chs=256x256&chl=${text}&choe=UTF-8`;
        $('qrOutput').innerHTML = `<img src="${url}" alt="QR Code" style="border-radius:12px;box-shadow:var(--shadow)" />`;
    });
}

/* ================================================================
   RENDER ALL (init/re-render on lang change)
   ================================================================ */
function renderAll() {
    buildCatNav();
    renderFavorites();
    renderPopular();
    $('nlSearch').placeholder = t('search_placeholder');
    document.querySelector('.fav-title').textContent = t('favorites');
    $('favEmpty').textContent = t('fav_empty');
    document.querySelector('.section-title').textContent = t('popular');
}

/* ================================================================
   INIT
   ================================================================ */
function init() {
    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => { });
    }
    // Build UI
    buildCatNav();
    populateSelects();
    renderFavorites();
    renderPopular();

    // Init tools
    initCurrency();
    initTimezone();
    initColor();
    initBMI();
    initAge();
    initBase();
    initRoman();
    initPassword();
    initBase64();
    initQR();

    // Load from URL params
    loadFromURL();

    // Initial convert
    if (!new URLSearchParams(location.search).get('cat')) {
        $('fromVal').value = 1;
        doFullConvert();
    }

    // Handle browser navigation
    window.addEventListener('popstate', loadFromURL);
}

document.addEventListener('DOMContentLoaded', init);
