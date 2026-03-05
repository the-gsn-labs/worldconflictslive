function evColor(e){if(e.cat==='cyber')return'#67e8f9';if(e.cat==='terrorism')return'#d07ef5';if(e.cat==='humanitarian')return'#6fffa0';if(e.cat==='unrest')return'#ffd47a';return{critical:'#c8321e',high:'#d98c0a',medium:'#c8b800'}[e.sev]||'#aaa';}
function parseEmoji(el){} // Twemoji disabled - causes layout issues
// ── Input Sanitization (OWASP A03 — Injection Prevention) ──────────
function sanitizeInput(str, maxLen=200) {
  if (typeof str !== 'string') return '';
  return str
    .slice(0, maxLen)
    .replace(/[<>]/g, '')           // strip HTML brackets
    .replace(/javascript:/gi, '')   // strip JS protocol
    .replace(/on\w+\s*=/gi, '')     // strip event handlers
    .trim();
}
function sanitizeEmail(str) {
  const s = sanitizeInput(str, 254);
  // Basic RFC 5321 format check
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s) ? s : '';
}
// Convert flag emoji to styled country code (works on all platforms including Windows)
function flagsToCode(flagStr) {
  if (!flagStr) return '';
  // Extract regional indicator letters: 🇮🇱 = U+1F1EE U+1F1F1 → "IL"
  const codes = [];
  const chars = [...flagStr];
  let i = 0;
  while (i < chars.length) {
    const cp = chars[i].codePointAt(0);
    // Regional indicator symbols: U+1F1E6–U+1F1FF
    if (cp >= 0x1F1E6 && cp <= 0x1F1FF) {
      const c1 = String.fromCodePoint(cp - 0x1F1E6 + 65);
      const cp2 = chars[i+1]?.codePointAt(0);
      if (cp2 >= 0x1F1E6 && cp2 <= 0x1F1FF) {
        const c2 = String.fromCodePoint(cp2 - 0x1F1E6 + 65);
        codes.push(c1 + c2);
        i += 2;
      } else { i++; }
    } else if (cp === 0x1F4BB || cp === 0x1F310 || cp === 0x1F6E1) {
      // 💻🌐🛡 — cyber/global icons, skip
      i++;
    } else { i++; }
  }
  return codes.join('·');
}



function evEmoji(e){if(e.cat==='cyber')return'💻';if(e.cat==='terrorism')return'💥';if(e.cat==='humanitarian')return'🕊️';if(e.cat==='unrest')return'✊';return{critical:'🔴',high:'🟠',medium:'🟡'}[e.sev]||'⚪';}

function initTimelineBar(){
const track=document.getElementById('mtb-track');
let dragging=false;
const handle=document.getElementById('mtb-handle');
track.addEventListener('click',(e)=>{
const rect=track.getBoundingClientRect();
const pct=Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width));
updateTimelineRange(pct);
});
handle.addEventListener('mousedown',(e)=>{dragging=true;e.preventDefault();});
document.addEventListener('mousemove',(e)=>{if(!dragging)return;const rect=track.getBoundingClientRect();const pct=Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width));updateTimelineRange(pct);});
document.addEventListener('mouseup',()=>{dragging=false;});
handle.addEventListener('touchstart',(e)=>{dragging=true;e.preventDefault();},{passive:false});
document.addEventListener('touchmove',(e)=>{if(!dragging)return;const rect=track.getBoundingClientRect();const pct=Math.max(0,Math.min(1,(e.touches[0].clientX-rect.left)/rect.width));updateTimelineRange(pct);},{passive:false});
document.addEventListener('touchend',()=>{dragging=false;});
}
function updateTimelineRange(pct){
document.getElementById('mtb-fill').style.width=(pct*100)+'%';
const startYear=2022,endYear=2026;
const cutoffYear=startYear+(endYear-startYear)*pct;
const months=['Jan','Apr','Jul','Oct'];
const cutoffDate=`${months[Math.floor((cutoffYear%1)*4)]} ${Math.floor(cutoffYear)}`;
const visible=events.filter(e=>!e.startYear||(e.startYear<=(cutoffYear+.1)));
document.getElementById('mtb-showing-label').textContent=`Up to ${cutoffDate} · ${visible.length} conflicts`;

mapMarkers.forEach((m,i)=>{const ev=events[i];if(!ev)return;const show=!ev.startYear||(ev.startYear<=(cutoffYear+.1));m.setOpacity(show?1:0.15);});
}

function openAllConflictsModal(){
const count=events.length;
document.getElementById('all-conflicts-count').textContent=`${count} ${T("map_count_label")}`;
document.getElementById('see-all-count').textContent=count;
const grouped={military:[],unrest:[],humanitarian:[],terrorism:[],cyber:[]};
events.forEach(e=>grouped[e.cat]?.push(e));
const catLabel={military:'⚔️ Military Conflicts',unrest:'✊ Civil Unrest',humanitarian:'🕊️ Humanitarian Crises',terrorism:'💥 Terrorism',cyber:'💻 Cyber Operations'};
let html='';
for(const[cat,evs]of Object.entries(grouped)){
if(!evs.length)continue;
html+=`<div style="font-family:var(--mono);font-size:9px;color:rgba(255,255,255,.28);letter-spacing:.12em;text-transform:uppercase;padding:10px 0 6px;">${catLabel[cat]}</div>`;
html+=evs.map(ev=>`<div onclick="closeModal('modal-all-conflicts');openEvent(${ev.id});" style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--surface);border:1px solid var(--border);border-radius:10px;cursor:pointer;transition:border-color .18s;" onmouseover="this.style.borderColor='rgba(255,255,255,.14)'" onmouseout="this.style.borderColor='var(--border)'">
<div style="font-size:18px;letter-spacing:2px;flex-shrink:0;" class="emoji">${ev.flags}</div>
<div style="flex:1;"><div style="font-family:var(--display);font-size:15px;font-weight:700;letter-spacing:.02em;">${ev.title}</div><div style="font-family:var(--mono);font-size:9px;color:rgba(255,255,255,.28);">${ev.region} · ${ev.parties}</div></div>
<div style="display:flex;align-items:center;gap:6px;"><div class="sev-dot sev-${ev.sev}"></div><span style="font-family:var(--mono);font-size:9px;color:rgba(255,255,255,.28);text-transform:uppercase;">${ev.sev}</span></div>
</div>`).join('');
}
document.getElementById('all-conflicts-list').innerHTML=html;
openModal('modal-all-conflicts');
}

async function fetchMarketData(){
for(const s of [{id:'rtx',sym:'RTX'},{id:'lmt',sym:'LMT'}]){
try{
const r=await fetch(`/api/markets?symbol=${s.sym}&fn=GLOBAL_QUOTE`);
const d=await r.json();const q=d['Global Quote'];
if(q&&q['05. price']){
const p=parseFloat(q['05. price']).toFixed(2);
const c=parseFloat(q['10. change percent']||'0').toFixed(2);
liveMarkets[s.id]={price:`$${p}`,change:`${c>=0?'+':''}${c}%`,dir:c>=0?'up':'dn',raw:parseFloat(p)};
}
}catch(e){}
}
for(const[id,fb]of Object.entries(mktFallback)){if(!liveMarkets[id])liveMarkets[id]=fb;}
updateTicker();
addMapMarkers();

if(tabRendered['markets']){
renderTop10();renderConflictAssets();renderMarkets();renderMovers();
}

if(!tabRendered['markets']) tabRendered['markets'] = false;
setTimeout(fetchMarketData,60000);
}

const sparkCache = {};
function makeSpark(id, dir, tall=false){
const def = marketDefs.find(d=>d.id===id);
const pts = def?.history || (sparkCache[id] = sparkCache[id] || Array.from({length:12},(_,i)=>{const b=liveMarkets[id]?.raw||100;return b+(dir==='up'?1:-1)*(i/11)*b*.04;}));
const w=300, h=tall?88:44;
const mn=Math.min(...pts), mx=Math.max(...pts);
const sp=pts.map((v,i)=>`${(i/(pts.length-1))*w},${h-((v-mn)/(mx-mn||1))*(h-6)-3}`).join(' ');
const col=dir==='up'?'#1fa355':'#c8321e';
return`<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" style="width:100%;height:${h}px;"><defs><linearGradient id="sg${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${col}" stop-opacity=".2"/><stop offset="100%" stop-color="${col}" stop-opacity="0"/></linearGradient></defs><polygon points="${sp} ${w},${h} 0,${h}" fill="url(#sg${id})"/><polyline points="${sp}" fill="none" stroke="${col}" stroke-width="${tall?2:1.8}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
const miniSparkCache = {};
function makeMiniSpark(dir, w=60, h=28){
const key = dir+w+h;
if (!miniSparkCache[key]) {
const pts = Array.from({length:10},(_,i)=>50+(dir==='up'?1:-1)*i*2);
const mn=Math.min(...pts), mx=Math.max(...pts);
miniSparkCache[key] = pts.map((v,i)=>`${(i/9)*w},${h-((v-mn)/(mx-mn||1))*(h-4)-2}`).join(' ');
}
const col=dir==='up'?'#1fa355':'#c8321e';
return`<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" style="width:${w}px;height:${h}px;flex-shrink:0;"><polyline points="${miniSparkCache[key]}" fill="none" stroke="${col}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function updateTicker(){
const crypto=Object.entries(cryptoData).map(([s,p])=>`◆ ${s} <span class="t-up">${p}</span>`).join('  ');
const mkts=[
`◆ OIL <span class="${liveMarkets.crude?.dir==='up'?'t-up':'t-dn'}">${liveMarkets.crude?.price||'—'} ${liveMarkets.crude?.change||''}</span>`,
`◆ GOLD <span class="${liveMarkets.gold?.dir==='up'?'t-up':'t-dn'}">${liveMarkets.gold?.price||'—'} ${liveMarkets.gold?.change||''}</span>`,
`◆ SILVER <span class="t-up">$27.40 +1.1%</span>`,`◆ DXY <span class="t-dn">104.2 -0.3%</span>`,
`◆ EUR/USD <span class="t-up">1.0821 +0.2%</span>`,`◆ USD/JPY <span class="t-dn">149.3 -0.4%</span>`,
`◆ NATGAS <span class="${liveMarkets.natgas?.dir==='up'?'t-up':'t-dn'}">${liveMarkets.natgas?.price||'—'} ${liveMarkets.natgas?.change||''}</span>`,
`◆ WHEAT <span class="${liveMarkets.wheat?.dir==='up'?'t-up':'t-dn'}">${liveMarkets.wheat?.price||'—'} ${liveMarkets.wheat?.change||''}</span>`,
`◆ S&amp;P500 <span class="t-up">5,842 +0.6%</span>`,`◆ NASDAQ <span class="t-up">18,240 +0.8%</span>`,
`◆ NVDA <span class="t-up">$875.40 +3.4%</span>`,`◆ AAPL <span class="t-up">$213.49 +1.2%</span>`,
`◆ RTX <span class="${liveMarkets.rtx?.dir==='up'?'t-up':'t-dn'}">${liveMarkets.rtx?.price||'—'} ${liveMarkets.rtx?.change||''}</span>`,
`◆ LMT <span class="${liveMarkets.lmt?.dir==='up'?'t-up':'t-dn'}">${liveMarkets.lmt?.price||'—'} ${liveMarkets.lmt?.change||''}</span>`,
].join('  ');
document.getElementById('ticker-all').innerHTML=crypto+'  &nbsp;  '+mkts;
}

function renderTop10(){
document.getElementById('top10-list').innerHTML=TOP10_ASSETS.map(a=>{
const barColor=a.dir==='up'?'rgba(31,163,85,.5)':'rgba(200,50,30,.5)';
return`<div class="asset-row" onclick="showToast('${a.name} · ${a.price}')">
<div class="asset-rank">${a.rank}</div>
<div style="font-size:20px;flex-shrink:0;">${a.icon}</div>
<div class="asset-info">
<div class="asset-name">${a.name}</div>
<div class="asset-ticker">${a.ticker}</div>
${a.mcap!=='Commodity'?`<div style="height:2px;background:rgba(255,255,255,.05);border-radius:1px;margin-top:4px;width:100%;"><div class="asset-bar" style="width:${a.bar}%;background:${barColor};"></div></div>`:''}
</div>
<div style="text-align:right;flex-shrink:0;">
<div class="asset-price ${a.dir==='up'?'up':'dn'}">${a.price}</div>
<div class="asset-mcap">${a.mcap}</div>
</div>
<div class="asset-chg ${a.dir==='up'?'up':'dn'}">${a.change}</div>
</div>`;
}).join('');
}

function renderConflictAssets(){
document.getElementById('conflict-assets-list').innerHTML=CONFLICT_ASSETS.map(a=>`
<div class="mover-row" onclick="showToast('${a.name}: ${a.why}')">
<div style="font-size:18px;flex-shrink:0;">${a.icon}</div>
<div style="flex:1;">
<div class="mr-name">${a.name}</div>
<div class="mr-ticker">${a.ticker} · ${a.conflicts.join(', ')}</div>
<div style="font-family:var(--display);font-size:12px;color:rgba(255,255,255,.35);margin-top:2px;">${a.why}</div>
</div>
<div style="text-align:right;flex-shrink:0;">
<div style="font-family:var(--mono);font-size:14px;font-weight:500;" class="${a.dir==='up'?'up':'dn'}">${a.price}</div>
<div style="font-family:var(--mono);font-size:10px;" class="${a.dir==='up'?'up':'dn'}">${a.change}</div>
</div>
${makeMiniSpark(a.dir)}
</div>`).join('');
}

function renderMarkets(){
const months=['Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'];
document.getElementById('markets-list').innerHTML=`
<div style="font-family:var(--mono);font-size:9px;letter-spacing:.14em;text-transform:uppercase;padding:18px 18px 10px;color:rgba(255,255,255,.3);border-top:1px solid var(--border);">Detailed Asset Analysis</div>
<div style="padding:0 18px;display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;">
${marketDefs.map(m=>{
const live=liveMarkets[m.id]||{price:'—',change:'—',dir:'up'};
return`<div class="mkt-card" onclick="openMarket('${m.id}')">
<div class="mkc-head">
<div style="font-size:28px;flex-shrink:0;">${m.icon}</div>
<div style="flex:1;">
<div style="font-family:var(--display);font-size:17px;font-weight:800;letter-spacing:.02em;">${m.name}</div>
<div style="font-family:var(--mono);font-size:9px;color:rgba(255,255,255,.28);letter-spacing:.04em;">${m.ticker}</div>
</div>
<div style="text-align:right;">
<div class="mkc-price ${live.dir==='up'?'up':'dn'}">${live.price}</div>
<div style="font-family:var(--mono);font-size:11px;margin-top:3px;"><span class="${live.dir==='up'?'up-bg':'dn-bg'}">${live.change}</span></div>
</div>
</div>
<div style="padding:0 16px 4px;">${makeSpark(m.id,live.dir,false)}</div>
<div style="display:flex;justify-content:space-between;padding:0 16px 10px;font-family:var(--mono);font-size:8px;color:rgba(255,255,255,.18);">
<span>${months[0]}</span><span>${months[3]}</span><span>${months[6]}</span><span>${months[9]}</span><span>Now</span>
<span style="color:rgba(200,50,30,.6);">12m</span>
</div>
<div class="mkt-context">${m.why}</div>
<div class="mkt-links">${m.events.map(en=>`<span class="mkt-link-tag" onclick="event.stopPropagation();openEventByName('${en}')">⚔️ ${en}</span>`).join('')}</div>
</div>`;
}).join('')}
</div>`;
}

function renderMovers(){
document.getElementById('winners-list').innerHTML=winnerDefs.map(w=>{
const live=liveMarkets[w.id]||{price:'—',change:'+—',dir:'up'};
return`<div class="mover-row" onclick="openMarket('${w.id}')"><div style="font-size:18px;flex-shrink:0;">${w.icon}</div><div style="flex:1;"><div class="mr-name">${w.name}</div><div class="mr-ticker">${w.ticker}</div></div><div style="text-align:right;"><div style="font-family:var(--mono);font-size:14px;font-weight:500;" class="up">${live.price}</div><div style="font-family:var(--mono);font-size:10px;" class="up">${live.change}</div></div></div>`;
}).join('');
document.getElementById('losers-list').innerHTML=loserDefs.map(l=>`<div class="mover-row"><div style="font-size:18px;flex-shrink:0;">${l.icon}</div><div style="flex:1;"><div class="mr-name">${l.name}</div><div class="mr-ticker">${l.ticker}</div></div><div style="text-align:right;"><div style="font-family:var(--mono);font-size:14px;font-weight:500;" class="dn">—</div><div style="font-family:var(--mono);font-size:10px;" class="dn">${l.change}</div></div></div>`).join('');
}

function openMarket(id){
const m=liveMarkets[id]||{};const def=marketDefs.find(d=>d.id===id);if(!def)return;
document.getElementById('mm-icon').textContent=def.icon;
document.getElementById('mm-name').textContent=def.name;
document.getElementById('mm-price-row').innerHTML=`<span style="font-family:var(--mono);font-size:28px;font-weight:500;" class="${m.dir==='up'?'up':'dn'}">${m.price||'—'}</span><span class="${m.dir==='up'?'up-bg':'dn-bg'}" style="font-size:14px;">${m.change||'—'}</span>`;
document.getElementById('mm-why').textContent=def.why;
const months=['Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'];
document.getElementById('mm-chart').innerHTML=`
<div style="font-family:var(--mono);font-size:9px;color:rgba(255,255,255,.28);letter-spacing:.14em;text-transform:uppercase;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;">
<span>12-Month Price History</span>
<span style="color:rgba(200,50,30,.6);font-size:8px;">Mar 2025 → Mar 2026</span>
</div>
${makeSpark(id,m.dir||'up',true)}
<div style="display:flex;justify-content:space-between;margin-top:6px;font-family:var(--mono);font-size:8px;color:rgba(255,255,255,.2);">
<span>${months[0]}</span><span>${months[2]}</span><span>${months[4]}</span><span>${months[6]}</span><span>${months[8]}</span><span>${months[10]}</span><span>Now</span>
</div>
<div style="margin-top:14px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
<div style="background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:8px;padding:10px;text-align:center;">
<div style="font-family:var(--mono);font-size:8px;color:rgba(255,255,255,.28);margin-bottom:5px;letter-spacing:.1em;text-transform:uppercase;">CURRENT</div>
<div style="font-family:var(--mono);font-size:16px;font-weight:500;" class="${m.dir==='up'?'up':'dn'}">${m.price||'—'}</div>
</div>
<div style="background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:8px;padding:10px;text-align:center;">
<div style="font-family:var(--mono);font-size:8px;color:rgba(255,255,255,.28);margin-bottom:5px;letter-spacing:.1em;text-transform:uppercase;">CHANGE</div>
<div style="font-family:var(--mono);font-size:16px;font-weight:500;" class="${m.dir==='up'?'up':'dn'}">${m.change||'—'}</div>
</div>
<div style="background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:8px;padding:10px;text-align:center;">
<div style="font-family:var(--mono);font-size:8px;color:rgba(255,255,255,.28);margin-bottom:5px;letter-spacing:.1em;text-transform:uppercase;">TREND</div>
<div style="font-size:20px;">${m.dir==='up'?'📈':'📉'}</div>
</div>
</div>`;
document.getElementById('mm-events').innerHTML=def.events.map(en=>`<span class="mkt-link-tag" onclick="closeModal('modal-market');openEventByName('${en}')">⚔️ ${en}</span>`).join('');
openModal('modal-market');
}

const FREE_LIMIT=3;
async function fetchNewsStub(id){

}

function startNewsRefresh(){
stopNewsRefresh();
newsRefreshTimer=setInterval(()=>{
const arts=liveNews[currentEvent];
if(!arts)return;

arts.forEach(a=>{a.time=timeAgo(a.ts);});
arts.sort((a,b)=>b.ts-a.ts);
renderFeedHTML(arts,currentTabIdx);
},8000);
}
function stopNewsRefresh(){if(newsRefreshTimer){clearInterval(newsRefreshTimer);newsRefreshTimer=null;}}
function timeAgo(d){
if(!d)return'';const diff=(Date.now()-(typeof d==='number'?d:new Date(d)))/1000;
if(diff<60)return`${Math.floor(diff)}s ago`;if(diff<3600)return`${Math.floor(diff/60)}m ago`;
if(diff<86400)return`${Math.floor(diff/3600)}h ago`;return`${Math.floor(diff/86400)}d ago`;
}

async function openEvent(id){
haptic('light');
currentEvent=id;stopNewsRefresh();if(leafletMap)leafletMap.closePopup();
closeBottomSheet();
const ev=events.find(e=>e.id===id);lastScreen=ev.cat==='unrest'?'unrest':ev.cat==='cyber'?'cyber':'map';
document.getElementById('d-flags').textContent=flagsToCode(ev.flags);
document.getElementById('d-title').textContent=ev.title;
document.getElementById('d-summary').textContent=(ev.econContext||'').substring(0,200);
document.getElementById('d-meta').innerHTML=`
<div class="sev-dot sev-${ev.sev}"></div>
<span style="font-family:var(--mono);font-size:10px;color:rgba(255,255,255,.38);">${ev.parties}</span>
<span style="font-family:var(--mono);font-size:10px;color:rgba(255,255,255,.22);">· ${ev.region}</span>
${ev.sevScore?`<span style="margin-left:4px;">${sevScoreBars(ev.sevScore,evColor(ev))}</span>`:''}
${ev.casualties?`<span style="font-family:var(--mono);font-size:9px;color:rgba(255,255,255,.25);margin-left:4px;">· ${fmtNum(ev.casualties)} casualties</span>`:''}
${ev.displaced?`<span style="font-family:var(--mono);font-size:9px;color:rgba(255,255,255,.25);">· ${fmtNum(ev.displaced)} displaced</span>`:''}
`;
const chips=(ev.markets||[]).map(mid=>{const m=liveMarkets[mid]||{};const def=marketDefs.find(d=>d.id===mid);if(!def)return'';return`<div class="econ-row" onclick="openMarket('${mid}')"><div style="font-size:20px;flex-shrink:0;">${def.icon}</div><div style="flex:1;"><div class="er-name">${def.name}</div><div class="er-why">${def.why.substring(0,70)}…</div></div><div><div class="er-price ${m.dir==='up'?'up':'dn'}">${m.price||'—'}</div><div class="er-chg ${m.dir==='up'?'up':'dn'}">${m.change||'—'}</div></div></div>`;}).join('');
document.getElementById('econ-panel-wrap').innerHTML=(chips?`<div class="econ-panel"><div class="econ-header"><span style="font-size:18px;">💹</span><span class="econ-title">Price Impact & Economic Fallout</span></div><div class="econ-context">${ev.econContext||''}</div>${chips}</div>`:'')+renderRelated(ev);
currentTabIdx=0;
document.querySelectorAll('.ntab').forEach((t,i)=>t.classList.toggle('active',i===0));
document.getElementById('tl-feed').style.display='none';document.getElementById('econ-feed').style.display='none';document.getElementById('news-feed').style.display='block';
document.getElementById('news-feed').innerHTML=`<div class="spinner-wrap"><div class="spinner"></div><div class="loading-text">${T('detail_loading')}</div></div>`;
switchTab('detail',null);
updateFollowBtn();

delete newsCacheTimes[id];
await fetchNews(id);
if(currentLang!=='en'&&liveNews[id]){const tx=await translateArticles(liveNews[id],currentLang);liveNews[id]=tx;}
renderNewsFeed(0);startNewsRefresh();
}

function renderNewsFeed(tabIdx){
currentTabIdx=tabIdx;const arts=liveNews[currentEvent];
if(!arts){document.getElementById('news-feed').innerHTML=`<div class="error-box">⚠️ Live news loads on worldconflictslive.vercel.app</div>${getFallback()}`;return;}
renderFeedHTML(arts,tabIdx);
}

function renderFeedHTML(arts,tabIdx){
if(tabIdx===0){
const groups={state:[],aligned:[],independent:[],opposition:[],unverified:[]};
arts.forEach(a=>{const t=a.alignment?.type||'unverified';if(groups[t])groups[t].push(a);else groups.unverified.push(a);});
const labels={state:'🏛️ STATE MEDIA',aligned:'🗳️ POLITICALLY ALIGNED',independent:'✊ INDEPENDENT',opposition:'📢 OPPOSITION',unverified:'❓ UNVERIFIED'};
const html=Object.entries(groups).map(([grp,ga])=>{
if(!ga.length)return'';
const free=ga.slice(0,FREE_LIMIT),locked=ga.slice(FREE_LIMIT);
return`<div style="padding:10px 18px 5px;font-family:var(--mono);font-size:9px;letter-spacing:.13em;display:flex;align-items:center;gap:8px;color:rgba(255,255,255,.22);">${labels[grp]}<span style="color:rgba(31,163,85,.7);">· ${free.length} free</span>${locked.length?`<span style="color:rgba(217,140,10,.55);">· +${locked.length} premium</span>`:''}</div>${free.map(a=>artCard(a)).join('')}${locked.length?`<div class="locked-article" onclick="openModal('modal-unlock')"><div class="locked-blur">${artCardInner(locked[0])}</div><div class="locked-overlay"><div class="locked-badge">🔒 +${locked.length} more articles</div><div style="font-family:var(--mono);font-size:11px;color:rgba(255,255,255,.38);">Unlock all · $1.99/mo →</div></div></div>`:''}`;
}).join('');
document.getElementById('news-feed').innerHTML=html||emptyState();return;
}
const typeMap={1:'state',2:'aligned',3:'independent',4:'opposition'};
let filtered=typeMap[tabIdx]?arts.filter(a=>a.alignment?.type===typeMap[tabIdx]):arts;
if(!filtered.length){document.getElementById('news-feed').innerHTML=emptyState();return;}
const free=filtered.slice(0,FREE_LIMIT),locked=filtered.slice(FREE_LIMIT);
document.getElementById('news-feed').innerHTML=free.map(a=>artCard(a)).join('')+(locked.length?`<div class="locked-article" onclick="openModal('modal-unlock')"><div class="locked-blur">${artCardInner(locked[0])}</div><div class="locked-overlay"><div class="locked-badge">🔒 +${locked.length} more articles</div><div style="font-family:var(--mono);font-size:11px;color:rgba(255,255,255,.38);">Unlock all · $1.99/mo →</div></div></div>`:'');
}

function emptyState(){return`<div style="text-align:center;padding:52px 20px;"><div style="font-size:36px;margin-bottom:12px;opacity:.4;">📰</div><div style="font-family:var(--mono);font-size:10px;color:rgba(255,255,255,.2);letter-spacing:.12em;text-transform:uppercase;">No articles in this category</div></div>`;}
function artCardInner(a){
const al=a.alignment||getAlign(a.outlet);
return`<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;"><div style="width:6px;height:6px;border-radius:50%;background:${alignDot[al.type]||'rgba(255,255,255,.2)'};flex-shrink:0;"></div><div class="art-outlet">${a.outlet}</div><div class="art-time" style="margin-left:auto;">${a.time}</div></div><div class="art-headline">${a.headline}</div><div class="art-excerpt">${(a.excerpt||'').substring(0,140)}${(a.excerpt||'').length>140?'…':''}</div><div style="margin-top:5px;">${alignBadge(al)}</div>`;
}
function artCard(a){return`<div class="article-card" onclick='openArticle(${JSON.stringify(a).replace(/'/g,"&#39;")})'>${artCardInner(a)}</div>`;}

function getFallback(){
const base=[
{outlet:'Reuters',alignment:{type:'independent',label:'Independent',flag:'🇬🇧'},time:'4m ago',ts:Date.now()-240000,headline:'Diplomatic efforts intensify as international pressure mounts',excerpt:'Foreign ministers convened in emergency session to discuss de-escalation.',url:'#'},
{outlet:'Al Jazeera',alignment:{type:'state',label:'State-Qatar',flag:'🇶🇦'},time:'12m ago',ts:Date.now()-720000,headline:'Aid convoys blocked at crossing for third consecutive day',excerpt:'Humanitarian organisations report critical shortages of food, medicine and fuel.',url:'#'},
{outlet:'BBC News',alignment:{type:'state',label:'State-BBC',flag:'🇬🇧'},time:'28m ago',ts:Date.now()-1680000,headline:'Diplomatic channels remain open despite continued hostilities',excerpt:'Officials confirm backchannel communications are ongoing.',url:'#'},
{outlet:'Fox News',alignment:{type:'aligned',label:'Pro-GOP',flag:'🇺🇸'},time:'45m ago',ts:Date.now()-2700000,headline:'US officials weigh options as tensions escalate',excerpt:'Pentagon confirms additional assets repositioned as precaution.',url:'#'},
{outlet:'Haaretz',alignment:{type:'opposition',label:'Opp-Likud',flag:'🇮🇱'},time:'1h ago',ts:Date.now()-3600000,headline:'Critics question strategic rationale as civilian toll mounts',excerpt:'Opposition figures call for an independent inquiry.',url:'#'},
];
const free=base.slice(0,FREE_LIMIT),locked=base.slice(FREE_LIMIT);
return free.map(a=>artCard(a)).join('')+(locked.length?`<div class="locked-article" onclick="openModal('modal-unlock')"><div class="locked-blur">${artCardInner(locked[0])}</div><div class="locked-overlay"><div class="locked-badge">🔒 +${locked.length} more articles</div><div style="font-family:var(--mono);font-size:11px;color:rgba(255,255,255,.38);">Unlock all · $1.99/mo →</div></div></div>`:'');
}

function openArticle(a){
const al=a.alignment||{type:'unverified',label:'Unverified',flag:'❓'};
document.getElementById('m-align').innerHTML=alignBadge(al);
document.getElementById('m-outlet').textContent=a.outlet.toUpperCase();
document.getElementById('m-headline').textContent=a.headline;
document.getElementById('m-body').textContent=a.body||a.excerpt||'';
const urlEl=document.getElementById('m-url');urlEl.href=a.url||'#';urlEl.target=a.url&&a.url!=='#'?'_blank':'_self';
openModal('modal-article');
}

function renderTimeline(){
const ev=events.find(e=>e.id===currentEvent);
if(!ev?.timeline?.length){document.getElementById('tl-feed').innerHTML=`<div style="text-align:center;padding:36px;font-family:var(--mono);font-size:11px;color:rgba(255,255,255,.2);">${T('detail_no_timeline')}</div>`;return;}

const startY=ev.startYear||2022,now=2026;
const totalSpan=now-startY;
const graphHTML=`<div class="tl-graph">
<div class="tl-graph-header">
<span>Conflict Timeline</span>
<span class="tl-graph-range">${startY} → ${now} · ${Math.round(totalSpan)} years</span>
</div>
<div class="tl-graph-canvas">
<div style="position:relative;height:48px;min-width:400px;">
<div style="position:absolute;top:50%;left:0;right:0;height:2px;background:rgba(255,255,255,.08);transform:translateY(-50%);border-radius:1px;"></div>
${ev.timeline.map((t,i)=>{
const year=parseFloat(t.date);const pct=isNaN(year)?((i+1)/(ev.timeline.length+1)*100):((year-startY)/totalSpan*100);
return`<div style="position:absolute;left:${Math.min(95,Math.max(2,pct))}%;top:50%;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:3px;">
<div style="font-family:var(--mono);font-size:8px;color:rgba(255,255,255,.35);white-space:nowrap;">${t.date}</div>
<div style="width:12px;height:12px;border-radius:50%;background:${t.tc.replace(/\.\d+\)/,'.9)')};border:2px solid rgba(255,255,255,.4);flex-shrink:0;cursor:pointer;" title="${t.event}"></div>
<div style="font-family:var(--mono);font-size:8px;padding:1px 5px;border-radius:3px;background:${t.tc};color:rgba(255,255,255,.8);white-space:nowrap;">${t.tag}</div>
</div>`;
}).join('')}
</div>
</div>
</div>`;
document.getElementById('tl-feed').innerHTML=graphHTML+ev.timeline.map((t,i)=>`<div class="tl-item"><div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0;width:14px;"><div class="tl-dot"></div>${i<ev.timeline.length-1?'<div style="width:1px;flex:1;background:rgba(255,255,255,.07);margin-top:3px;"></div>':''}</div><div style="padding-bottom:3px;"><div class="tl-date">${t.date}</div><div class="tl-event">${t.event}</div><div class="tl-tag" style="background:${t.tc};color:rgba(255,255,255,.8);">${t.tag}</div></div></div>`).join('');
}

function renderEconFeed(){
const ev=events.find(e=>e.id===currentEvent);
document.getElementById('econ-feed').innerHTML=`
<div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:18px;margin-bottom:14px;">
<div style="font-family:var(--mono);font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.28);margin-bottom:10px;">Economic Context</div>
<div style="font-family:var(--display);font-size:15px;line-height:1.8;color:rgba(255,255,255,.55);">${ev?.econContext||''}</div>
</div>
${(ev?.markets||[]).map(mid=>{const m=liveMarkets[mid]||{};const def=marketDefs.find(d=>d.id===mid);if(!def)return'';return`<div class="econ-row" style="background:var(--surface);border:1px solid var(--border);border-radius:10px;margin-bottom:8px;" onclick="openMarket('${mid}')"><div style="font-size:20px;flex-shrink:0;">${def.icon}</div><div style="flex:1;"><div class="er-name">${def.name}</div><div class="er-why">${def.why}</div></div><div><div class="er-price ${m.dir==='up'?'up':'dn'}">${m.price||'—'}</div><div class="er-chg ${m.dir==='up'?'up':'dn'}">${m.change||'—'}</div></div></div>`;}).join('')}`;
}

function setNTab(el,idx){
currentTabIdx=idx;stopNewsRefresh();
document.querySelectorAll('.ntab').forEach(t=>t.classList.remove('active'));el.classList.add('active');
document.getElementById('tl-feed').style.display='none';document.getElementById('econ-feed').style.display='none';document.getElementById('news-feed').style.display='none';
if(idx===5){document.getElementById('tl-feed').style.display='block';renderTimeline();}
else if(idx===6){document.getElementById('econ-feed').style.display='block';renderEconFeed();}
else{document.getElementById('news-feed').style.display='block';renderNewsFeed(idx);startNewsRefresh();}
}

const baseAlerts=[
{id:'a1',icon:'💥',type:'breaking',title:'Ceasefire in Gaza under pressure — both sides allege violations',conflict:'Gaza Conflict',eventId:0,time:'Just now',ts:Date.now()-60000,unread:true},
{id:'a2',icon:'₿',type:'market',title:'BTC surges past $83k on geopolitical safe-haven demand',conflict:'MARKET · CRYPTO',eventId:null,time:'4m ago',ts:Date.now()-240000,unread:true},
{id:'a3',icon:'🔴',type:'breaking',title:'Russia launches large-scale drone strike on Ukrainian energy grid',conflict:'Russia–Ukraine War',eventId:1,time:'18m ago',ts:Date.now()-1080000,unread:true},
{id:'a4',icon:'✊',type:'breaking',title:'Serbia protesters block key motorway for 12th consecutive day',conflict:'Serbia Protests',eventId:100,time:'1h ago',ts:Date.now()-3600000,unread:false},
{id:'a5',icon:'📈',type:'market',title:'Lockheed Martin LMT hits 52-week high after NATO spending announcement',conflict:'MARKET · DEFENCE',eventId:null,time:'2h ago',ts:Date.now()-7200000,unread:false},
{id:'a6',icon:'🌾',type:'market',title:'Wheat surges 4.3% after Black Sea corridor incident',conflict:'MARKET · COMMODITIES',eventId:null,time:'4h ago',ts:Date.now()-14400000,unread:false},
{id:'a7',icon:'🕊️',type:'breaking',title:'UN declares famine emergency in northern Darfur — 5m at risk',conflict:'Darfur Crisis',eventId:200,time:'5h ago',ts:Date.now()-18000000,unread:false},
{id:'a8',icon:'💥',type:'breaking',title:'Al-Shabaab claims attack on Somali government compound',conflict:'Al-Shabaab — Somalia',eventId:301,time:'7h ago',ts:Date.now()-25200000,unread:false},
];
alertsData=[...baseAlerts];

function filterAlerts(type,el){
document.querySelectorAll('#screen-alerts .scroll-row .pill').forEach(p=>p.classList.remove('active'));el.classList.add('active');
const filtered=type==='all'?alertsData:type==='following'?alertsData.filter(a=>a.unread):alertsData.filter(a=>a.type===type);
renderAlertsList(filtered);
}
function renderAlerts(){renderAlertsList(alertsData);}
function renderAlertsList(list){
document.getElementById('alerts-list').innerHTML=list.length?list.map(a=>{
const onclick=a.eventId!=null?`openEvent(${a.eventId})`:`openModal('modal-premium')`;
return`<div class="alert-item ${a.unread?'unread':''}" onclick="${onclick}"><div style="font-size:20px;flex-shrink:0;">${a.icon}</div><div style="flex:1;"><div class="al-conflict">${a.conflict}</div><div class="al-title">${a.title}</div><div class="al-time">${a.time}</div></div>${a.unread?'<div style="width:7px;height:7px;border-radius:50%;background:var(--red2);flex-shrink:0;margin-top:6px;"></div>':''}</div>`;
}).join(''):`<div style="text-align:center;padding:52px 20px;font-family:var(--mono);font-size:10px;color:rgba(255,255,255,.2);letter-spacing:.1em;text-transform:uppercase;">No alerts in this category</div>`;
document.getElementById('alerts-ts').textContent=`Last updated: ${new Date().toLocaleTimeString()}`;
}
async function pollAlerts(){
try{
const criticalEvents=events.filter(e=>e.sev==='critical').slice(0,2);
for(const ev of criticalEvents){
const resp=await fetch(`/api/news?q=${encodeURIComponent(ev.query)}&pageSize=3`);
const data=await resp.json();
if(data.status==='ok'&&data.articles?.length){
const latest=data.articles[0];const latestTs=new Date(latest.publishedAt).getTime();
if(latestTs>(alertsData[0]?.ts||0)&&latest.title!==latestAlertHeadline){
latestAlertHeadline=latest.title;
alertsData.unshift({id:`live_${Date.now()}`,icon:'🔴',type:'breaking',title:latest.title,conflict:ev.title,eventId:ev.id,time:'Just now',ts:latestTs,unread:true});
showAlertBanner(latest.title,ev.id);
if(document.getElementById('screen-alerts').classList.contains('active'))renderAlerts();
}
}
}
}catch(e){}
setTimeout(pollAlerts,60000);
}
function showAlertBanner(text,eventId){
bannerEventId=eventId;
document.getElementById('ab-text').textContent=`Breaking: ${text.substring(0,80)}${text.length>80?'…':''}`;
document.getElementById('alert-banner').classList.add('show');
setTimeout(()=>document.getElementById('alert-banner').classList.remove('show'),12000);
}
function handleBannerClick(){if(bannerEventId!=null)openEvent(bannerEventId);dismissBanner();}
function dismissBanner(){document.getElementById('alert-banner').classList.remove('show');}

function eventCard(ev){
const tbClass={military:'tb-military',unrest:'tb-unrest',humanitarian:'tb-humanitarian',terrorism:'tb-terrorism',cyber:'tb-cyber'}[ev.cat]||'tb-military';
const _tbRaw={military:'⚔️ Armed Conflict',unrest:{protest:'✊ Mass Protest',coup:'👁️ Coup',revolution:'🔥 Revolution',election:'🗳️ Election Crisis'}[ev.subtype]||'✊ Civil Unrest',humanitarian:'🕊️ Humanitarian Crisis',terrorism:'💥 Terrorism',cyber:'💻 Cyber Operation'}[ev.cat];
const _tbKeys={military:'type_military',unrest:'type_unrest_'+( ev.subtype||'all'),humanitarian:'type_humanitarian',terrorism:'type_terrorism',cyber:'type_cyber'};
const tbLabel=T(_tbKeys[ev.cat])||_tbRaw;
const chips=(ev.markets||[]).slice(0,3).map(mid=>{const m=liveMarkets[mid]||{};const def=marketDefs.find(d=>d.id===mid);if(!def||!m.price)return'';return`<div class="mkt-chip" onclick="event.stopPropagation();openMarket('${mid}')"><div class="mc-name">${def.ticker}</div><div class="mc-val ${m.dir==='up'?'up':'dn'}">${m.price}</div><div class="mc-chg ${m.dir==='up'?'up':'dn'}">${m.change}</div></div>`;}).join('');
return`<div class="event-card" onclick="openEvent(${ev.id})">
<div class="ec-row">
<div class="ec-flags">${flagsToCode(ev.flags)}</div>
<div class="ec-info">
<div class="ec-title-row"><div class="sev-dot sev-${ev.sev}"></div><div class="ec-title">${ev.title}</div></div>
<div class="ec-meta">${ev.parties} · ${ev.region}</div>
</div>
</div>
<div class="type-badge ${tbClass}">${tbLabel}</div>
<div class="ec-summary">${(ev.econContext||'').substring(0,100)}…</div>
<div class="ec-footer">
<span class="ec-footer-label"
<span class="ec-cta">${T('detail_read')}</span>
</div>
${chips?`<div class="mkt-ribbon">${chips}</div>`:''}
</div>`;
}

function renderList(cat){
currentCat=cat;
let filtered=events.filter(e=>e.cat===cat);
if(typeof currentFilter!=='undefined'&&currentFilter&&currentFilter!=='all'){
if(currentFilter==='critical') filtered=filtered.filter(e=>e.sev==='critical');
else filtered=filtered.filter(e=>e.cat===currentFilter);
}
const el=document.getElementById('conflict-list');
if(!filtered.length){
el.innerHTML=`<div style="text-align:center;padding:52px 20px;font-family:var(--mono);font-size:10px;color:rgba(255,255,255,.2);letter-spacing:.1em;text-transform:uppercase;">No events in this category</div>`;
return;
}

el.innerHTML = filtered.slice(0,6).map(e=>eventCard(e)).join('');
if(filtered.length > 6){
const renderRest = () => {
el.innerHTML += filtered.slice(6).map(e=>eventCard(e)).join('') + '<div style="height:8px;"></div>';
};
requestIdleCallback ? requestIdleCallback(renderRest) : setTimeout(renderRest, 200);
}
}
function renderUnrestList(filter='all'){
const filtered=events.filter(e=>e.cat==='unrest'&&(filter==='all'||e.subtype===filter));
document.getElementById('unrest-list').innerHTML=filtered.length?filtered.map(e=>eventCard(e)).join(''):`<div style="text-align:center;padding:52px 20px;font-family:var(--mono);font-size:10px;color:rgba(255,255,255,.2);letter-spacing:.1em;text-transform:uppercase;">No events</div>`;
}

function setCatTab(el,cat){
document.querySelectorAll('.cat-tab').forEach(t=>t.classList.remove('active'));el.classList.add('active');renderList(cat);
}
function filterMap(type,el){
document.querySelectorAll('#map-filter-row .pill').forEach(p=>p.classList.remove('active'));el.classList.add('active');
// Filter map markers
mapMarkers.forEach((m,i)=>{
const ev=events[i];if(!m||!ev)return;
let show=false;
if(type==='all')show=true;
else if(type==='critical')show=ev.sev==='critical';
else show=ev.cat===type;
show?m.addTo(leafletMap):leafletMap.removeLayer(m);
});
// Also filter the conflict card list
currentFilter=type;
renderList(currentCat);
}
function filterUnrest(type,el){
document.querySelectorAll('#screen-unrest .scroll-row .pill').forEach(p=>p.classList.remove('active'));el.classList.add('active');renderUnrestList(type);
}

function switchTab(tab,el){
if(tab!=='detail')stopNewsRefresh();
document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
document.querySelectorAll('.nav-item,.top-nav-btn').forEach(n=>n.classList.remove('active'));
const scr=document.getElementById('screen-'+tab);
if(scr)scr.classList.add('active');
if(el&&el.classList){el.classList.add('active');}
else{
const order=['map','unrest','cyber','viz','markets','alerts','ai','language','profile'];
const i=order.indexOf(tab);
if(i>-1){document.querySelectorAll('.nav-item')[i]?.classList.add('active');document.querySelectorAll('.top-nav-btn')[i]?.classList.add('active');}
}
if(tab==='map'&&leafletMap)setTimeout(()=>leafletMap.invalidateSize(),120);
if(tab==='cyber')renderCyberScreen();
if(tab==='viz'){requestIdleCallback?requestIdleCallback(renderVizScreen):setTimeout(renderVizScreen,50);}
}

function showSkeletons(containerId,n=3){
document.getElementById(containerId).innerHTML=Array(n).fill('<div class="skel skel-card"></div>').join('');
}
function lazyRenderList(items,renderFn,containerId,batchSize=8){
const el=document.getElementById(containerId);
if(!el)return;
let i=0;
function renderBatch(){
const frag=document.createDocumentFragment();
const end=Math.min(i+batchSize,items.length);
for(;i<end;i++){
const div=document.createElement('div');
div.innerHTML=renderFn(items[i]);
frag.appendChild(div.firstChild||div);
}
el.appendChild(frag);
if(i<items.length)(requestIdleCallback||setTimeout)(renderBatch,0);
}
el.innerHTML='';
renderBatch();
}

let mapMode='default';let clusterGroup=null;let tileLayers={};
function initMap(){
if(typeof L === 'undefined'){

setTimeout(initMap, 100); return;
}
leafletMap=L.map('conflict-map',{center:[20,18],zoom:2,zoomControl:false,scrollWheelZoom:false,minZoom:1,maxZoom:10});
L.control.zoom({position:'bottomright'}).addTo(leafletMap);


tileLayers.dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',{attribution:'',subdomains:'abcd',maxZoom:19});
tileLayers.labels = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png',{attribution:'',subdomains:'abcd',maxZoom:19,zIndex:200,pane:'overlayPane'});
tileLayers.satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{attribution:'',maxZoom:19});
tileLayers.dark.addTo(leafletMap);
tileLayers.labels.addTo(leafletMap);

clusterGroup=L.markerClusterGroup({
maxClusterRadius:60,spiderfyOnMaxZoom:true,showCoverageOnHover:false,
iconCreateFunction:function(c){
const cnt=c.getChildCount();
return L.divIcon({html:`<div style="width:36px;height:36px;border-radius:50%;background:rgba(200,50,30,.85);border:2px solid rgba(200,50,30,.6);display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:11px;font-weight:500;color:#fff;box-shadow:0 0 12px rgba(200,50,30,.4);">${cnt}</div>`,className:'',iconSize:[36,36]});
}
});
leafletMap.addLayer(clusterGroup);


const ctrlDiv=document.createElement('div');
ctrlDiv.className='map-ctrl-row';
ctrlDiv.innerHTML=`
<button class="map-ctrl-btn" title="Satellite" id="mctrl-sat" onclick="toggleSatellite(this)">🛰️</button>
<button class="map-ctrl-btn" title="Cluster" id="mctrl-cluster" onclick="toggleCluster(this)" style="font-size:12px;font-family:var(--mono);">CLR</button>
<button class="map-ctrl-btn" title="Reset view" onclick="leafletMap.setView([20,18],2)">🎯</button>`;
document.getElementById('conflict-map').appendChild(ctrlDiv);

addMapMarkers();
}

function toggleSatellite(btn){
if(mapMode==='satellite'){
leafletMap.removeLayer(tileLayers.satellite);
tileLayers.dark.addTo(leafletMap);
tileLayers.labels.addTo(leafletMap);
mapMode='default';btn.classList.remove('mctrl-active');
}else{
leafletMap.removeLayer(tileLayers.dark);
leafletMap.removeLayer(tileLayers.labels);
tileLayers.satellite.addTo(leafletMap);
mapMode='satellite';btn.classList.add('mctrl-active');
}
}

let clusterEnabled=true;
function toggleCluster(btn){
clusterEnabled=!clusterEnabled;
if(clusterEnabled){
leafletMap.addLayer(clusterGroup);btn.classList.add('mctrl-active');
}else{
leafletMap.removeLayer(clusterGroup);btn.classList.remove('mctrl-active');

mapMarkers.forEach(m=>m.addTo(leafletMap));
}
btn.title=clusterEnabled?T('map_cluster_on'):T('map_cluster_off');
}

function addMapMarkers(){
if(clusterGroup)clusterGroup.clearLayers();
mapMarkers.forEach(m=>{try{leafletMap.removeLayer(m);}catch(e){}});
mapMarkers=[];
events.forEach(ev=>{
if(!ev.lat||!ev.lng)return;
const color=evColor(ev);
const icon=L.divIcon({className:'',html:`<div class="conflict-marker" style="color:${color};"><div class="marker-pin${ev.sev==='critical'?' pulse':''}" style="border-color:${color};">${evEmoji(ev)}</div><div class="marker-label"><span class="emoji">${ev.flags}</span> ${ev.parties}</div></div>`,iconSize:[220,56],iconAnchor:[110,22],popupAnchor:[0,-24]});
const marker=L.marker([ev.lat,ev.lng],{icon});
const chips=(ev.markets||[]).slice(0,3).map(mid=>{const m=liveMarkets[mid]||{};const def=marketDefs.find(d=>d.id===mid);if(!def)return'';return`<span style="font-family:var(--mono);font-size:9px;padding:2px 7px;border-radius:4px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.08);" class="${m.dir==='up'?'up':'dn'}">${def.ticker} ${m.price||'—'}</span>`;}).join('');
marker.bindPopup(`<div class="map-popup"><div class="mpp-flags emoji">${ev.flags}</div><div class="mpp-title">${ev.title}</div><div class="mpp-region">${ev.region} · ${ev.parties}</div>${chips?`<div style="display:flex;gap:5px;flex-wrap:wrap;margin:8px 0;">${chips}</div>`:''}<button class="mpp-btn" onclick="openEvent(${ev.id})">${T('detail_read')}</button></div>`,{maxWidth:280,minWidth:230});

marker.on('click',()=>{if(window.innerWidth<768)openConflictSheet(ev.id);});
if(clusterEnabled&&clusterGroup){clusterGroup.addLayer(marker);}else{marker.addTo(leafletMap);}
mapMarkers.push(marker);
});
}

function openConflictSheet(id){
const ev=events.find(e=>e.id===id);if(!ev)return;
document.getElementById('bs-conflict-body').innerHTML=`
<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
<div style="font-size:28px;" class="emoji">${ev.flags}</div>
<div><div style="font-family:var(--display);font-size:22px;font-weight:900;letter-spacing:.04em;">${ev.title}</div>
<div style="font-family:var(--mono);font-size:10px;color:rgba(255,255,255,.35);">${ev.region} · ${ev.parties}</div></div>
</div>
<div style="display:flex;gap:8px;margin-bottom:14px;align-items:center;">
<div class="sev-dot sev-${ev.sev}"></div>
<span style="font-family:var(--mono);font-size:9px;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:.1em;">${ev.sev}</span>
${ev.sevScore?`<span style="font-family:var(--mono);font-size:9px;color:rgba(255,255,255,.2);">· Score ${ev.sevScore}/10</span>`:''}
${ev.casualties?`<span style="font-family:var(--mono);font-size:9px;color:rgba(255,255,255,.25);">· ${fmtNum(ev.casualties)} casualties</span>`:''}
</div>
<p style="font-family:var(--mono);font-size:11px;color:rgba(255,255,255,.45);line-height:1.7;margin-bottom:16px;">${(ev.econContext||'').substring(0,180)}…</p>
<button class="btn btn-red" onclick="closeBottomSheet();openEvent(${ev.id})">${T('detail_read')}</button>`;
document.getElementById('bs-overlay').classList.add('bs-show');
document.getElementById('bs-conflict').classList.add('bs-open');
}
function closeBottomSheet(){
document.getElementById('bs-overlay').classList.remove('bs-show');
document.querySelectorAll('.bottom-sheet').forEach(s=>s.classList.remove('bs-open'));
}

const tabOrder=['map','unrest','cyber','viz','markets','alerts','ai','language','profile'];
let swipeStartX=0;let swipeStartY=0;let swipeActive=false;
document.addEventListener('touchstart',e=>{swipeStartX=e.touches[0].clientX;swipeStartY=e.touches[0].clientY;swipeActive=true;},{passive:true});
document.addEventListener('touchend',e=>{
if(!swipeActive)return;swipeActive=false;
const dx=e.changedTouches[0].clientX-swipeStartX;
const dy=e.changedTouches[0].clientY-swipeStartY;
if(Math.abs(dx)<60||Math.abs(dy)>Math.abs(dx)*0.8)return;
const active=document.querySelector('.screen.active');if(!active)return;
const curTab=active.id.replace('screen-','');
const cur=tabOrder.indexOf(curTab);if(cur<0)return;
if(dx<-60&&cur<tabOrder.length-1)switchTab(tabOrder[cur+1]);
if(dx>60&&cur>0)switchTab(tabOrder[cur-1]);
},{passive:true});

function haptic(type='light'){
if(!navigator.vibrate)return;
({light:()=>navigator.vibrate(8),medium:()=>navigator.vibrate(18),heavy:()=>navigator.vibrate([20,10,20])})[type]?.();
}

function fmtNum(n){if(!n)return'0';if(n>=1000000)return(n/1000000).toFixed(1)+'M';if(n>=1000)return Math.round(n/1000)+'K';return n.toLocaleString();}
function fmtBn(n){if(!n)return'—';if(n>=1000)return'$'+(n/1000).toFixed(1)+'T';return'$'+n+'B';}

function animateCount(el,target,duration=1200,prefix='',suffix=''){
const start=Date.now();const from=0;
function step(){
const p=Math.min((Date.now()-start)/duration,1);
const ease=1-Math.pow(1-p,3);
const val=Math.round(from+(target-from)*ease);
el.textContent=prefix+fmtNum(val)+suffix;
if(p<1)requestAnimationFrame(step);
}
requestAnimationFrame(step);
}

let vizRendered=false;
function renderVizScreen(){
if(vizRendered)return;vizRendered=true;


const totalCasualties=events.reduce((s,e)=>s+(e.casualties||0),0);
const totalDisplaced=events.reduce((s,e)=>s+(e.displaced||0),0);
const activeConflicts=events.filter(e=>e.cat!=='cyber').length;
const totalDamage=events.reduce((s,e)=>s+(e.econDamage||0),0);

animateCount(document.getElementById('vz-conflicts'),activeConflicts,800);
animateCount(document.getElementById('vz-displaced'),totalDisplaced,1200);
animateCount(document.getElementById('vz-casualties'),totalCasualties,1400);
document.getElementById('vz-cost').textContent=fmtBn(totalDamage);


const topCas=events.filter(e=>e.casualties>0).sort((a,b)=>b.casualties-a.casualties).slice(0,8);
const maxCas=topCas[0]?.casualties||1;
document.getElementById('casualty-bars').innerHTML=topCas.map(ev=>`
<div class="casualty-bar-item">
<div class="cb-label">
<span class="cb-name"><span class="emoji">${ev.flags}</span> ${ev.title}</span>
<span class="cb-val" style="color:var(--red2);">${fmtNum(ev.casualties)}</span>
</div>
<div class="cb-track"><div class="cb-fill" style="width:0%;background:var(--red2);" data-pct="${(ev.casualties/maxCas*100).toFixed(1)}"></div></div>
</div>`).join('');
setTimeout(()=>document.querySelectorAll('.cb-fill[data-pct]').forEach(el=>{el.style.width=el.dataset.pct+'%';}),100);


const topDis=events.filter(e=>e.displaced>0).sort((a,b)=>b.displaced-a.displaced).slice(0,8);
const maxDis=topDis[0]?.displaced||1;
document.getElementById('displaced-bars').innerHTML=topDis.map(ev=>`
<div class="casualty-bar-item">
<div class="cb-label">
<span class="cb-name"><span class="emoji">${ev.flags}</span> ${ev.title}</span>
<span class="cb-val" style="color:var(--amber);">${fmtNum(ev.displaced)}</span>
</div>
<div class="cb-track"><div class="cb-fill" style="width:0%;background:var(--amber);" data-pct="${(ev.displaced/maxDis*100).toFixed(1)}"></div></div>
</div>`).join('');
setTimeout(()=>document.querySelectorAll('.cb-fill[data-pct]').forEach(el=>{el.style.width=el.dataset.pct+'%';}),200);


const topEcon=events.filter(e=>e.econDamage>0).sort((a,b)=>b.econDamage-a.econDamage).slice(0,8);
const maxEcon=topEcon[0]?.econDamage||1;
document.getElementById('econ-damage-bars').innerHTML=topEcon.map(ev=>`
<div class="casualty-bar-item">
<div class="cb-label">
<span class="cb-name"><span class="emoji">${ev.flags}</span> ${ev.title}</span>
<span class="cb-val" style="color:var(--green);">${fmtBn(ev.econDamage)}</span>
</div>
<div class="cb-track"><div class="cb-fill" style="width:0%;background:var(--green);" data-pct="${(ev.econDamage/maxEcon*100).toFixed(1)}"></div></div>
</div>`).join('');
setTimeout(()=>document.querySelectorAll('.cb-fill[data-pct]').forEach(el=>{el.style.width=el.dataset.pct+'%';}),300);


renderFlowSVG();


renderTimelineSVG();
}

function renderFlowSVG(){
const flows=[
{from:'Sudan/Darfur',to:'Egypt/Chad',n:4.2,col:'#c8321e'},
{from:'Ukraine',to:'Europe',n:6.5,col:'#2c7be5'},
{from:'Syria',to:'Turkey/Lebanon',n:5.0,col:'#d98c0a'},
{from:'Afghanistan',to:'Pakistan/Iran',n:2.8,col:'#9b4dca'},
{from:'Myanmar',to:'Thailand/Bangladesh',n:1.5,col:'#1fa355'},
];
const svg=document.getElementById('flow-svg');
const W=400,H=200;
svg.innerHTML=flows.map((f,i)=>{
const y=20+i*36;const barW=Math.round(f.n/6.5*260);
return`<g>
<text x="0" y="${y+12}" font-size="9" fill="rgba(255,255,255,.4)">${f.from}</text>
<rect x="110" y="${y}" width="${barW}" height="18" rx="4" fill="${f.col}" opacity="0.7"/>
<text x="${116+barW}" y="${y+12}" font-size="9" fill="rgba(255,255,255,.5)">${f.n}M → ${f.to}</text>
</g>`;
}).join('');
}

function renderTimelineSVG(){
const svg=document.getElementById('timeline-svg');
const W=600,H=240,now=2025.25,earliest=2006;
const timeEvents=events.filter(e=>e.startYear&&e.cat!=='cyber').sort((a,b)=>a.startYear-b.startYear).slice(0,12);
const toX=y=>Math.round((y-earliest)/(now-earliest)*(W-80)+40);

let html=`<line x1="40" y1="${H-30}" x2="${W-40}" y2="${H-30}" stroke="rgba(255,255,255,.1)" stroke-width="1"/>`;
for(let yr=2008;yr<=2025;yr+=3){
const x=toX(yr);
html+=`<text x="${x}" y="${H-12}" font-size="8" fill="rgba(255,255,255,.2)" text-anchor="middle">${yr}</text>
<line x1="${x}" y1="${H-34}" x2="${x}" y2="${H-26}" stroke="rgba(255,255,255,.1)" stroke-width="1"/>`;
}
timeEvents.forEach((ev,i)=>{
const x1=toX(ev.startYear),x2=toX(now),y=12+i*18;
const col=evColor(ev);
html+=`<line x1="${x1}" y1="${y+5}" x2="${x2}" y2="${y+5}" stroke="${col}" stroke-width="8" opacity="0.35" stroke-linecap="round"/>
<circle cx="${x1}" cy="${y+5}" r="4" fill="${col}" opacity="0.9"/>
<text x="${Math.max(x1-4,40)}" y="${y}" font-size="8" fill="rgba(255,255,255,.45)">${ev.flags} ${ev.title.substring(0,22)}</text>`;
});
svg.innerHTML=html;
}

function sevScoreBars(score,color='var(--red2)'){
const bars=Array.from({length:10},(_,i)=>`<div class="sev-bar${i<score?' lit':''}" style="height:${6+i*1.5}px;color:${color};${i<score?'background:'+color:''}"></div>`).join('');
return`<span class="sev-bars" title="Severity ${score}/10">${bars}</span>`;
}

function renderRelated(ev){
if(!ev.related?.length)return'';
const chips=ev.related.map(id=>{
const rel=events.find(e=>e.id===id);if(!rel)return'';
return`<span class="relation-chip" onclick="openEvent(${rel.id})"><span class="emoji">${rel.flags}</span>${rel.title}</span>`;
}).join('');
return`<div style="padding:12px 18px 0;"><div style="font-family:var(--mono);font-size:9px;color:rgba(255,255,255,.28);letter-spacing:.12em;text-transform:uppercase;margin-bottom:8px;">Related Conflicts</div><div style="display:flex;flex-wrap:wrap;gap:6px;">${chips}</div></div>`;
}
function goHome(){
stopNewsRefresh();
switchTab('map');

document.getElementById('screen-map')?.scrollTo(0,0);
window.scrollTo(0,0);
}
function goBack(){
const order=['map','unrest','cyber','viz','markets','alerts','ai','language','profile'];
const i=order.indexOf(lastScreen);
switchTab(lastScreen,document.querySelectorAll('.nav-item')[Math.max(0,i)]);
}
function openEventByName(name){const ev=events.find(e=>e.title===name);if(ev)openEvent(ev.id);}

function openModal(id){document.getElementById(id)?.classList.add('open');}
function closeModal(id){document.getElementById(id)?.classList.remove('open');}
document.querySelectorAll('.modal-overlay').forEach(m=>{m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('open');});});

let toastTimer;
function showToast(msg){const t=document.getElementById('toast');t.innerHTML=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),3000);}
function toggleRow(row){const t=row.querySelector('.toggle');if(t){t.classList.toggle('on');showToast(t.classList.contains('on')?T('toast_enabled'):T('toast_disabled'));}}

function submitEmail(){
const email=sanitizeEmail(document.getElementById('email-input').value);
if(!email||!email.includes('@')||!email.includes('.')){showToast('⚠️ Please enter a valid email');return;}
const safe=email.replace(/[<>'"]/g,'').substring(0,254);
try{const s=JSON.parse(localStorage.getItem('wcl_emails')||'[]');if(!s.includes(safe)){s.push(safe);localStorage.setItem('wcl_emails',JSON.stringify(s));}}catch(e){}
closeModal('modal-email');closeModal('modal-premium');
showToast("✅ You're on the list! First alert coming soon.");
}

async function detectNewConflicts(){
try{
const r=await fetch('/api/detect-conflicts');const data=await r.json();
if(data.conflicts?.length){data.conflicts.forEach(c=>{
if(!events.find(x=>x.title===c.title)){
events.push({id:events.length+500,cat:c.cat||'military',flags:c.flags||'🌍',title:c.title,region:c.region||'Unknown',parties:c.parties||c.title,sev:c.sev||'medium',lat:null,lng:null,query:c.query||c.title,markets:c.markets||['gold'],econContext:c.summary||'',timeline:[]});
renderList(currentCat);showToast(`🌍 New conflict detected: ${c.title}`);
}
});}
}catch(e){}
}

const cyberSubtype={400:'state',401:'espionage',402:'state',403:'ransomware'};
const cyberThreats=[
{actor:'Volt Typhoon (China)',target:'US Power Grid',type:'Infrastructure',severity:'critical',time:'Active now',icon:'⚡'},
{actor:'Sandworm (Russia)',target:'European telecoms',type:'Disruption',severity:'high',time:'12h ago',icon:'📡'},
{actor:'LockBit 4.0',target:'US hospital chain',type:'Ransomware',severity:'high',time:'3h ago',icon:'🏥'},
{actor:'Charming Kitten (Iran)',target:'EU defence contractors',type:'Espionage',severity:'high',time:'1d ago',icon:'🕵️'},
{actor:'Lazarus Group (DPRK)',target:'Crypto exchanges',type:'Financial',severity:'high',time:'2d ago',icon:'₿'},
];

function renderCyberScreen(){

document.getElementById('cyber-threat-feed').innerHTML=cyberThreats.map(t=>`
<div style="display:flex;align-items:center;gap:12px;padding:11px 14px;background:var(--surface);border:1px solid ${t.severity==='critical'?'rgba(200,50,30,.3)':'var(--border)'};border-radius:10px;">
<div style="font-size:20px;flex-shrink:0;">${t.icon}</div>
<div style="flex:1;">
<div style="font-family:var(--mono);font-size:9px;color:${t.severity==='critical'?'#ff6b4a':'#ffd47a'};letter-spacing:.08em;text-transform:uppercase;margin-bottom:2px;">${t.type} · ${t.time}</div>
<div style="font-family:var(--display);font-size:14px;font-weight:700;">${t.actor}</div>
<div style="font-family:var(--mono);font-size:10px;color:rgba(255,255,255,.35);">Target: ${t.target}</div>
</div>
<div class="sev-dot sev-${t.severity}"></div>
</div>`).join('');

filterCyber('all',null);
}

function filterCyber(type,el){
if(el){document.querySelectorAll('#screen-cyber .scroll-row .pill').forEach(p=>p.classList.remove('active'));el.classList.add('active');}
const cyberEvents=events.filter(e=>e.cat==='cyber');
const filtered=type==='all'?cyberEvents:cyberEvents.filter(e=>(cyberSubtype[e.id]||'state')===type);
document.getElementById('cyber-list').innerHTML=filtered.length
?filtered.map(e=>eventCard(e)).join('')
:`<div style="text-align:center;padding:52px 20px;font-family:var(--mono);font-size:10px;color:rgba(255,255,255,.2);letter-spacing:.1em;text-transform:uppercase;">No events in this category</div>`;
}

function openShareModal(){
const ev=events.find(e=>e.id===currentEvent);if(!ev)return;
const url=`${location.origin}${location.pathname}?conflict=${ev.id}`;
document.getElementById('share-conflict-name').textContent=`${ev.flags} ${ev.title}`;
document.getElementById('share-url-box').textContent=url;
document.getElementById('share-url-box').dataset.url=url;
openModal('modal-share');
}
function copyShareUrl(){
const url=document.getElementById('share-url-box').dataset.url||document.getElementById('share-url-box').textContent;
navigator.clipboard?.writeText(url).then(()=>showToast(T('toast_copied'))).catch(()=>showToast('📋 Copy from the box above'));
closeModal('modal-share');
}
function shareToX(){
const ev=events.find(e=>e.id===currentEvent);
const url=`${location.origin}${location.pathname}?conflict=${ev?.id||0}`;
window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(`${ev?.flags||''} ${ev?.title||'Conflict'} — Every source, every side, no agenda.`)}&url=${encodeURIComponent(url)}`,'_blank');
}
function shareToWhatsApp(){
const ev=events.find(e=>e.id===currentEvent);
const url=`${location.origin}${location.pathname}?conflict=${ev?.id||0}`;
window.open(`https://wa.me/?text=${encodeURIComponent(`${ev?.flags||''} ${ev?.title||''} — ${url}`)}`,'_blank');
}

function checkSharedConflict(){
const p=new URLSearchParams(location.search).get('conflict');
if(p!==null){const id=parseInt(p);const ev=events.find(e=>e.id===id);if(ev)setTimeout(()=>openEvent(id),400);}
}

let currentUser=null;
function loadUser(){
try{const u=localStorage.getItem('wcl_user');if(u)currentUser=JSON.parse(u);}catch(e){}
updateAccountUI();
}
function saveUser(){if(currentUser)localStorage.setItem('wcl_user',JSON.stringify(currentUser));}
function createAccount(){
const email=sanitizeEmail(document.getElementById('acct-email-input').value);
const name=sanitizeInput(document.getElementById('acct-name-input').value, 80);
if(!email||!email.includes('@')){showToast('⚠️ Please enter a valid email');return;}
if(!name){showToast('⚠️ Please enter your name');return;}
currentUser={email,name,plan:'free',following:[],created:Date.now()};
saveUser();updateAccountUI();closeModal('modal-account');
showToast(`✅ Welcome, ${name}!`);
}
function loginUser(){
const email=document.getElementById('acct-email-input')?.value?.trim();
if(!email)return;
currentUser={email,name:email.split('@')[0],plan:'free',following:[],created:Date.now()};
saveUser();updateAccountUI();closeModal('modal-account');showToast('✅ Signed in!');
}
function logoutUser(){currentUser=null;localStorage.removeItem('wcl_user');updateAccountUI();showToast('👋 Signed out');}
function updateAccountUI(){
const li=document.getElementById('account-logged-in');
const lo=document.getElementById('account-logged-out');
const btn=document.getElementById('nav-acct-btn');
if(currentUser){
li.style.display='block';lo.style.display='none';
document.getElementById('acct-avatar').textContent=currentUser.name[0].toUpperCase();
document.getElementById('acct-name').textContent=currentUser.name;
document.getElementById('acct-email').textContent=currentUser.email;
document.getElementById('acct-plan').textContent=currentUser.plan==='premium'?'⭐ Premium':'Free Plan';
const fw=currentUser.following||[];
document.getElementById('acct-following').innerHTML=fw.length
?fw.map(id=>{const ev=events.find(e=>e.id===id);return ev?`<span style="font-family:var(--mono);font-size:9px;padding:3px 8px;background:rgba(200,50,30,.12);border:1px solid rgba(200,50,30,.2);border-radius:4px;cursor:pointer;" onclick="closeModal('modal-account');openEvent(${id})">${ev.flags} ${ev.title}</span>`:''}).join('')
:`<span style="font-family:var(--mono);font-size:10px;color:rgba(255,255,255,.2);">Not following any conflicts yet</span>`;
if(btn)btn.textContent=`👤 ${currentUser.name.split(' ')[0]}`;
}else{
li.style.display='none';lo.style.display='block';
if(btn)btn.textContent='👤 Account';
}
}
function toggleFollow(){
const ev=events.find(e=>e.id===currentEvent);if(!ev)return;
if(!currentUser){openModal('modal-account');return;}
const fw=currentUser.following||[];
const idx=fw.indexOf(currentEvent);
if(idx>-1){fw.splice(idx,1);showToast(`☆ Unfollowed ${ev.title}`);}
else{fw.push(currentEvent);showToast(`★ Following ${ev.title}`);}
currentUser.following=fw;saveUser();updateFollowBtn();updateAccountUI();
}
function updateFollowBtn(){
const btn=document.getElementById('follow-btn');if(!btn)return;
const following=currentUser?.following?.includes(currentEvent);
btn.textContent=following?T('detail_following'):T('detail_follow');
btn.style.color=following?'var(--amber)':'rgba(255,255,255,.4)';
btn.style.borderColor=following?'rgba(217,140,10,.4)':'var(--border)';
}

const NEWS_CACHE_TTL = 120000;
const newsCacheTimes = {};

function getRssFeeds(ev) {
const qEnc = encodeURIComponent(ev.query);
return [
{ url:`https://news.google.com/rss/search?q=${qEnc}&hl=en-US&gl=US&ceid=US:en`, outlet:'Google News', al:{type:'independent',label:'Aggregator',flag:'🌐'} },
{ url:`https://feeds.reuters.com/reuters/search/news?q=${encodeURIComponent(ev.query.replace(/\s+/g,'+'))}`, outlet:'Reuters', al:{type:'independent',label:'Independent',flag:'🇬🇧'} },
{ url:'https://feeds.bbci.co.uk/news/world/rss.xml', outlet:'BBC News', al:{type:'state',label:'State-BBC',flag:'🇬🇧'} },
{ url:'https://www.aljazeera.com/xml/rss/all.xml', outlet:'Al Jazeera', al:{type:'state',label:'State-Qatar',flag:'🇶🇦'} },
{ url:'https://www.theguardian.com/world/rss', outlet:'The Guardian', al:{type:'independent',label:'Independent',flag:'🇬🇧'} },
{ url:'https://feeds.apnews.com/rss/apf-topnews', outlet:'Associated Press', al:{type:'independent',label:'Independent',flag:'🇺🇸'} },
];
}

const CORS_PROXIES = [
url => `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}&count=15`,
url => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
url => `https://corsproxy.io/?${encodeURIComponent(url)}`,
];

async function fetchRssFeed(feed, proxyIdx=0) {
if(proxyIdx >= CORS_PROXIES.length) return [];
try {
const r = await fetch(CORS_PROXIES[proxyIdx](feed.url), {signal:AbortSignal.timeout(5000)});
if(!r.ok) throw new Error();
const data = await r.json();

if(data.items?.length) {
return data.items.map(item => {
const ts = item.pubDate ? new Date(item.pubDate).getTime() : 0;
return {outlet:feed.outlet, alignment:feed.al,
headline:stripHtml(item.title||''),
excerpt:stripHtml(item.description||item.content||'').substring(0,220),
url:item.link||item.guid||'#', ts, time:timeAgo(ts)};
}).filter(a=>a.headline && a.ts>0);
}

const xml = data.contents || (typeof data==='string'?data:'');
if(xml) return parseRssXml(xml, feed);
} catch(e) {
return fetchRssFeed(feed, proxyIdx+1);
}
return [];
}

function parseRssXml(xml, feed) {
try {
const doc = new DOMParser().parseFromString(xml,'text/xml');
return [...doc.querySelectorAll('item')].slice(0,15).map(item=>{
const title = stripHtml(item.querySelector('title')?.textContent||'');
const desc  = stripHtml(item.querySelector('description')?.textContent||'').substring(0,220);
const link  = item.querySelector('link')?.textContent?.trim() || item.querySelector('guid')?.textContent || '#';
const ts    = new Date(item.querySelector('pubDate')?.textContent||0).getTime();
if(!title||!ts) return null;
return {outlet:feed.outlet, alignment:feed.al, headline:title, excerpt:desc, url:link, ts, time:timeAgo(ts)};
}).filter(Boolean);
} catch(e){return[];}
}

function stripHtml(s){
return s.replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&nbsp;/g,' ').trim();
}

function isRelevant(article, ev) {
const text = (article.headline+' '+article.excerpt).toLowerCase();
const keywords = [
...ev.title.toLowerCase().split(/[\s\-–·,\/]+/),
...ev.region.toLowerCase().split(/[\s,\/]+/),
...(ev.query||'').toLowerCase().split(/\s+/),
].filter(w=>w.length>3);
const unique = [...new Set(keywords)];
return unique.filter(k=>text.includes(k)).length >= 2;
}

async function fetchNewsReal(id) {
const now = Date.now();
if(liveNews[id] && newsCacheTimes[id] && (now-newsCacheTimes[id]) < NEWS_CACHE_TTL) return;

const ev = events.find(e=>e.id===id);


const feeds = getRssFeeds(ev);
const [googleResults, reutersResults, bbcResults] = await Promise.all([
fetchRssFeed(feeds[0]),
fetchRssFeed(feeds[1]),
fetchRssFeed(feeds[2]),
]);


const extraPromise = Promise.all([
fetchRssFeed(feeds[3]),
fetchRssFeed(feeds[4]),
fetchRssFeed(feeds[5]),
]);

let all = [...googleResults, ...reutersResults, ...bbcResults];


if(all.length >= 3) {
const quick = processArticles(all, ev);
liveNews[id] = quick;
newsCacheTimes[id] = now;
renderNewsFeed(0);
}


const extras = await extraPromise;
all = [...all, ...extras.flat()];
const final = processArticles(all, ev);

if(final.length >= 3) {
liveNews[id] = final;
newsCacheTimes[id] = now;
if(currentEvent === id) renderNewsFeed(currentTabIdx);
} else if(!liveNews[id]?.length) {
liveNews[id] = generateMultiSideArticles(ev);
newsCacheTimes[id] = now;
if(currentEvent === id) renderNewsFeed(currentTabIdx);
}
}

function processArticles(all, ev) {

const relevant = all.filter(a=>isRelevant(a,ev));
const pool = relevant.length >= 4 ? relevant : all;
const seen = new Set();
return pool
.filter(a=>{
const key = a.headline.substring(0,45).toLowerCase().replace(/[^a-z]/g,'');
if(seen.has(key)) return false;
seen.add(key); return true;
})
.sort((a,b)=>b.ts-a.ts)
.slice(0,15);
}

function generateMultiSideArticles(ev) {
const now = Date.now();
const sides = [
{outlet:'Reuters',          al:{type:'independent',label:'Independent',flag:'🇬🇧'}, m:2+Math.floor(Math.random()*10)},
{outlet:'Associated Press', al:{type:'independent',label:'Independent',flag:'🇺🇸'}, m:15+Math.floor(Math.random()*20)},
{outlet:'BBC News',         al:{type:'state',label:'State-BBC',flag:'🇬🇧'},         m:30+Math.floor(Math.random()*30)},
{outlet:'Al Jazeera',       al:{type:'state',label:'State-Qatar',flag:'🇶🇦'},       m:55+Math.floor(Math.random()*40)},
{outlet:'The Guardian',     al:{type:'independent',label:'Independent',flag:'🇬🇧'}, m:80+Math.floor(Math.random()*50)},
{outlet:'Fox News',         al:{type:'aligned',label:'Pro-GOP',flag:'🇺🇸'},         m:110+Math.floor(Math.random()*50)},
{outlet:'CNN',              al:{type:'aligned',label:'Pro-Democrat',flag:'🇺🇸'},    m:140+Math.floor(Math.random()*60)},
{outlet:'New York Times',   al:{type:'aligned',label:'Pro-Democrat',flag:'🇺🇸'},    m:180+Math.floor(Math.random()*60)},
];
const p1 = ev.parties.split('·')[0]?.trim()||'Forces';
const hlines = [
`BREAKING: ${p1} reports major developments in ${ev.region}`,
`Civilian toll rises in ${ev.title} — aid groups demand access`,
`Diplomatic pressure mounts as ${ev.region} situation worsens`,
`Markets react to ${ev.title}: oil, gold move on escalation fears`,
`${ev.region}: UN emergency session called as crisis deepens`,
`Analysis — What the latest ${ev.title} developments mean`,
`${ev.title}: Key parties exchange accusations amid stalled talks`,
`How ${ev.region} could reshape global alliances this year`,
];
return [...sides].sort((a,b)=>a.m-b.m).map((s,i)=>{
const ts = now-(s.m*60000);
return{outlet:s.outlet, alignment:s.al, time:timeAgo(ts), ts,
headline:hlines[i]||hlines[0],
excerpt:`${s.outlet} reporting on ${ev.title}. ${ev.econContext?.substring(0,120)||''}`,
url:'#'};
});
}

window.fetchNews = fetchNewsReal;

const tabRendered = {};

const _origSwitchTab = switchTab;
window.switchTab = function(tab, el) {
_origSwitchTab(tab, el);
lazyRenderTab(tab);
};

function lazyRenderTab(tab) {
if (tabRendered[tab]) return;
tabRendered[tab] = true;
switch(tab) {
case 'map':       break;
case 'unrest':   renderUnrestList(); break;
case 'markets':  renderTop10(); renderConflictAssets(); renderMarkets(); renderMovers(); break;
case 'alerts':   renderAlerts(); break;
case 'language': buildLangGrid(); break;
case 'viz':       break;
}
}

document.getElementById('see-all-count').textContent = events.length;
loadUser();
renderList('military');
tabRendered['map'] = true;
initMap();
initTimelineBar();


requestAnimationFrame(() => {
setTimeout(() => {

fetchMarketData();

setTimeout(pollAlerts, 5000);
setTimeout(detectNewConflicts, 8000);
setInterval(detectNewConflicts, 4*60*60*1000);

setTimeout(() => {
if (!localStorage.getItem('wcl_email_prompted')) {
localStorage.setItem('wcl_email_prompted','1');
openModal('modal-email');
}
}, 45000);
}, 300);
});

if (currentLang !== 'en') {
document.getElementById('html-root').setAttribute('dir', LANGUAGES.find(l=>l.code===currentLang)?.rtl?'rtl':'ltr');
if (txCache[currentLang]) applyTranslations(txCache[currentLang]);
}
checkSharedConflict();
