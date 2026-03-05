const LANGUAGES=[
{code:'am',flag:'🇪🇹',native:'አማርኛ'},
{code:'ar',flag:'🇸🇦',native:'العربية',rtl:true},
{code:'bn',flag:'🇧🇩',native:'বাংলা'},
{code:'cs',flag:'🇨🇿',native:'Čeština'},
{code:'da',flag:'🇩🇰',native:'Dansk'},
{code:'de',flag:'🇩🇪',native:'Deutsch'},
{code:'el',flag:'🇬🇷',native:'Ελληνικά'},
{code:'en',flag:'🇬🇧',native:'English'},
{code:'es',flag:'🇪🇸',native:'Español'},
{code:'fa',flag:'🇮🇷',native:'فارسی',rtl:true},
{code:'fi',flag:'🇫🇮',native:'Suomi'},
{code:'fr',flag:'🇫🇷',native:'Français'},
{code:'gu',flag:'🇮🇳',native:'ગુજરાતી'},
{code:'ha',flag:'🇳🇬',native:'Hausa'},
{code:'he',flag:'🇮🇱',native:'עברית',rtl:true},
{code:'hi',flag:'🇮🇳',native:'हिन्दी'},
{code:'hr',flag:'🇭🇷',native:'Hrvatski'},
{code:'hu',flag:'🇭🇺',native:'Magyar'},
{code:'id',flag:'🇮🇩',native:'Bahasa Indonesia'},
{code:'it',flag:'🇮🇹',native:'Italiano'},
{code:'ja',flag:'🇯🇵',native:'日本語'},
{code:'ko',flag:'🇰🇷',native:'한국어'},
{code:'ms',flag:'🇲🇾',native:'Bahasa Melayu'},
{code:'nl',flag:'🇳🇱',native:'Nederlands'},
{code:'no',flag:'🇳🇴',native:'Norsk'},
{code:'pa',flag:'🇮🇳',native:'ਪੰਜਾਬੀ'},
{code:'pl',flag:'🇵🇱',native:'Polski'},
{code:'pt',flag:'🇵🇹',native:'Português'},
{code:'pt-BR',flag:'🇧🇷',native:'Português (BR)'},
{code:'ro',flag:'🇷🇴',native:'Română'},
{code:'ru',flag:'🇷🇺',native:'Русский'},
{code:'sk',flag:'🇸🇰',native:'Slovenčina'},
{code:'so',flag:'🇸🇴',native:'Soomaali'},
{code:'sr',flag:'🇷🇸',native:'Српски'},
{code:'sv',flag:'🇸🇪',native:'Svenska'},
{code:'sw',flag:'🇰🇪',native:'Kiswahili'},
{code:'ta',flag:'🇱🇰',native:'தமிழ்'},
{code:'th',flag:'🇹🇭',native:'ภาษาไทย'},
{code:'tr',flag:'🇹🇷',native:'Türkçe'},
{code:'uk',flag:'🇺🇦',native:'Українська'},
{code:'ur',flag:'🇵🇰',native:'اردو',rtl:true},
{code:'vi',flag:'🇻🇳',native:'Tiếng Việt'},
{code:'yo',flag:'🇳🇬',native:'Yorùbá'},
{code:'zh',flag:'🇨🇳',native:'中文 (简)'},
{code:'zh-TW',flag:'🇹🇼',native:'中文 (繁)'},
{code:'zu',flag:'🇿🇦',native:'isiZulu'},
];
let currentLang=localStorage.getItem('wcl_lang')||'en';
let txCache={};let txArticleCache={};

const UI_STRINGS={
nav_map:'Map',nav_unrest:'Unrest',nav_cyber:'Cyber',nav_markets:'Markets',nav_alerts:'Alerts',nav_language:'Language',nav_profile:'Profile',nav_viz:'Data',nav_ai:'AI',
cat_military:'⚔️ Military',cat_unrest:'✊ Unrest',cat_humanitarian:'🕊️ Crises',cat_terrorism:'💥 Terror',
tab_all:'All',tab_state:'🏛️ State',tab_aligned:'🗳️ Aligned',tab_indep:'✊ Indep.',tab_opp:'📢 Opp.',tab_timeline:'📅 Timeline',tab_economic:'💰 Economic',
back:'← Back',read_full:'Read Full Article at Source →',close:'Close',
source_class:'source_class',why_moving:'Why this is moving',related:'Related conflicts',
breaking_news:'Breaking developments · Updated every 60 seconds',
markets_sub:'Conflict-driven price movements · Tap any asset for chart + context',
unrest_title:'CIVIL UNREST',unrest_sub:'Protests · Coups · Revolutions · Election Crises',
cyber_title:'CYBER CONFLICTS',cyber_sub:'State-sponsored attacks · Ransomware · Infrastructure threats',
alerts_title:'ALERTS',markets_title:'MARKETS',language_sub:'AI-powered translation · 45+ languages',
top10_title:'Top 10 Most Valued Global Assets',conflict_assets_title:'Assets Affected by Conflict',
top_winning:'Top 5 Benefiting',top_losing:'Top 5 Declining',
timeline_showing:'Showing timeline',see_all_conflicts:'See all conflicts',
all_conflicts_title:'All Conflicts',
filter_all:'All',filter_military:'⚔️ Military',filter_unrest:'✊ Unrest',
filter_humanitarian:'🕊️ Humanitarian',filter_terrorism:'💥 Terrorism',filter_critical:'🔴 Critical',
filter_breaking:'🔴 Breaking',filter_market:'📈 Market',filter_following:'detail_following',
filter_protest:'✊ Protest',filter_coup:'👁️ Coup',filter_revolution:'🔥 Revolution',filter_election:'🗳️ Election Crisis',
go_premium:'GO PREMIUM',upgrade:'UPGRADE NOW',prem_price:'$1.99 / MONTH · CANCEL ANYTIME',
prem_1:'✓ All articles — every source, no limits',prem_2:'✓ Live market data 60s refresh',
prem_3:'✓ Full historical timelines',prem_4:'✓ AI translations — 45+ languages',
prem_5:'✓ Push + email alerts',prem_6:'✓ Zero ads. Ever.',
start_trial:'START FREE TRIAL →',not_now:'Not now',
stay_informed:'STAY INFORMED',email_desc:'Get breaking conflict alerts and weekly market impact digests. Free forever.',
get_alerts:'GET FREE ALERTS →',maybe_later:'Maybe later',privacy:'No spam. Unsubscribe anytime. Your data is never sold.',
unlock_title:'UNLOCK FULL SPECTRUM',unlock_desc:'Free users get 3 articles per source category. Upgrade to read every perspective without limits.',
upgrade_cta:'UPGRADE FOR $1.99/MO →',stay_free:'Stay on free plan',
world_analyst:'WORLD ANALYST',free_plan:'Free Plan · Member since Mar 2025',settings:'Settings',
s_breaking:'Breaking conflict alerts',s_market:'Market impact alerts',s_digest:'Daily digest email',
s_labels:'Source classification labels',s_security:'Security alerts',s_language:'🌐 Change language',
loading:'Loading…',loading_markets:'Fetching live data…',
map_hint:'🤏 Pinch to zoom · Tap pins for details',

viz_title:'DATA & VIZ',viz_sub:'Live casualties · Displaced persons · Refugee flows · Economic damage',
viz_conflicts:'Active Conflicts',viz_displaced:'Displaced Persons',viz_casualties:'Est. Casualties 2024',
viz_cost:'Economic Cost',viz_deaths_note:'Conflict deaths only',viz_yoy:'↑ 12% YoY',
viz_cas_title:'Estimated Casualties by Conflict',viz_dis_title:'Displaced Persons (Millions)',
viz_flow_title:'Major Refugee Flows',viz_econ_title:'Economic Damage Estimates',viz_timeline_title:'Conflict Duration Timeline',
viz_source_note:'Source: UNHCR / IOM estimates. Figures include both IDPs and refugees.',

cyber_threat_title:'Global Cyber Threat Level',cyber_threats_title:'Live Threat Indicators',
cyber_filter_all:'All',cyber_filter_state:'State',cyber_filter_ransomware:'Ransomware',
cyber_filter_espionage:'Espionage',cyber_filter_infra:'Infrastructure',

ai_title:'AI ANALYST',ai_sub:'Ask anything about any conflict · Premium feature',
ai_lock_icon_label:'Premium Feature',
ai_lock_desc:'AI Analyst gives you instant, sourced answers to any question about active conflicts — from casualty trends to diplomatic context to market impact analysis.',
ai_feat_1:'"Why did gold spike 3% today?" — gets a conflict-linked analysis',
ai_feat_2:'"What\'s the latest in Sudan?" — pulls live articles + summary',
ai_feat_3:'"Compare Ukraine and Gaza economic impact" — side-by-side',
ai_feat_4:'"Explain the Sahel coups in simple terms" — in any language',
ai_feat_5:'"How is Fox News vs Al Jazeera covering this differently?" — media analysis',
ai_unlock_cta:'UNLOCK AI ANALYST — $1.99/MO →',ai_trial_note:'Cancel anytime · Free 7-day trial',

detail_all_sides:'All sides · Live news',detail_read:'READ →',
detail_loading:'detail_loading',detail_follow:'detail_follow',detail_following:'detail_following',
detail_share:'Share',detail_back:'← Back',
detail_no_timeline:'detail_no_timeline',
detail_econ_context:'detail_econ_context',

map_wordmark_sub:'Every source · Every side · No agenda',
map_timeline_label:'Showing timeline',map_all_time:'All time',
map_see_all:'See all conflicts',map_count_label:'conflicts',
map_legend_critical:'Critical',map_legend_high:'High',map_legend_terrorism:'Terrorism',
map_legend_unrest:'Unrest',map_legend_humanitarian:'Humanitarian',

alert_breaking:'Breaking',alert_market:'Market',alert_following:'Following',
alert_mark_read:'Mark all read',alert_empty:'alert_empty',

market_12m:'12-Month Price History',market_why:'Why this is moving',
market_related_conflicts:'Related conflicts',

profile_title:'WORLD ANALYST',profile_plan:'Free Plan',profile_member:'Member since',
profile_settings:'Settings',profile_logout:'Log out',profile_create:'Create Account',
profile_create_btn:'CREATE FREE ACCOUNT →',

modal_share_title:'Share Conflict',modal_share_copy:'Copy Link',modal_share_x:'Post to X',modal_share_wa:'WhatsApp',
modal_account_following:'Following',
modal_premium_price:'$1.99 / MONTH · CANCEL ANYTIME',
modal_email_privacy:'No spam. Unsubscribe anytime. Your data is never sold.',
modal_unlock_desc:'Free users get 3 articles per source category. Upgrade to read every perspective without limits.',
modal_unlock_cta:'UPGRADE FOR $1.99/MO →',modal_unlock_stay:'Stay on free plan',

no_events:'no_events',no_events_filter:'No events match this filter',
live:'LIVE',conflicts_label:'CONFLICTS',
type_military:'⚔️ Armed Conflict',type_unrest_all:'✊ Civil Unrest',
type_unrest_protest:'✊ Mass Protest',type_unrest_coup:'👁️ Coup',
type_unrest_revolution:'🔥 Revolution',type_unrest_election:'🗳️ Election Crisis',
type_humanitarian:'🕊️ Humanitarian Crisis',type_terrorism:'💥 Terrorism',type_cyber:'💻 Cyber Operation',
source_class_label:'Source Classification',
  // Market/asset types
  asset_commodity:'Commodity',asset_crypto:'Crypto',asset_equity:'Equity',
  asset_forex:'Forex',asset_bond:'Bond',asset_etf:'ETF',
  // Cyber threat types
  cyber_state:'State-Sponsored',cyber_ransomware:'Ransomware',
  cyber_espionage:'Espionage',cyber_infra:'Infrastructure',
  // Map controls
  map_cluster_on:'Clustering ON',map_cluster_off:'Clustering OFF',
  map_satellite_on:'Satellite ON',map_satellite_off:'Satellite OFF',
  // Alert types
  alert_type_breaking:'Breaking',alert_type_market:'Market',
  // Detail screen dynamic
  detail_active_now:'Active now',detail_free_plan:'Free Plan',
  detail_disruption:'Disruption',detail_financial:'Financial',
  // Market modal
  market_12m:'12-Month Price History',
  // Viz screen
  viz_yoy:'↑ 12% YoY',viz_source:'Source: UNHCR / IOM estimates',
  // Share modal
  share_copy:'📋 Copy Link',share_x:'𝕏 Post',share_wa:'💬 WhatsApp',
  // Account modal
  account_following:'Following',account_plan:'Plan',account_signout:'Sign Out',
  account_signin:'Sign in',account_save:'Save followed conflicts',
  account_email_placeholder:'Email address',account_name_placeholder:'Display name',
  account_create_btn:'CREATE FREE ACCOUNT →',
  // Profile
  profile_logout:'Sign Out',
  // Toast messages
  toast_enabled:'✅ Enabled',toast_disabled:'⭕ Disabled',
  toast_copied:'✅ Link copied',toast_following:'★ Following',toast_unfollowed:'Unfollowed',
  // News feed
  news_live:'LIVE',news_fetching:'Fetching live news…',news_no_articles:'No articles found',
  // Generic
  read_more:'READ →',all_sides:'All sides · Live news',
  see_all:'See all',mark_read:'Mark all read',
};



// Convert a single flag emoji to its ISO 2-letter country code (cross-platform)
function flagCode(flag) {
  if (!flag) return '';
  const chars = [...flag];
  const cp1 = chars[0]?.codePointAt(0);
  const cp2 = chars[1]?.codePointAt(0);
  if (cp1 >= 0x1F1E6 && cp1 <= 0x1F1FF && cp2 >= 0x1F1E6 && cp2 <= 0x1F1FF) {
    return String.fromCodePoint(cp1 - 0x1F1E6 + 65) +
           String.fromCodePoint(cp2 - 0x1F1E6 + 65);
  }
  return flag; // fallback: return as-is (non-flag emoji)
}
function buildLangGrid(){
document.getElementById('lang-grid').innerHTML=LANGUAGES.map(l=>
`<div class="lang-btn ${l.code===currentLang?'active':''}" onclick="selectLanguage('${l.code}')">
<span class="lang-flag-code">${flagCode(l.flag)}</span>
<span class="lang-name">${l.native}</span>
</div>`).join('');
}

function T(key){return(txCache[currentLang]||UI_STRINGS)[key]||UI_STRINGS[key]||key;}

function applyTranslations(tx){
// 1. All static data-i18n elements in HTML
document.querySelectorAll('[data-i18n]').forEach(el=>{
const key=el.getAttribute('data-i18n');
if(tx[key]) el.textContent=tx[key];
});

// 2. Bottom nav labels (mobile)
const navKeys=['nav_map','nav_unrest','nav_cyber','nav_viz','nav_markets','nav_alerts','nav_ai','nav_language','nav_profile'];
document.querySelectorAll('.nav-label').forEach((el,i)=>{
if(navKeys[i]&&tx[navKeys[i]])el.textContent=tx[navKeys[i]];
});

// 3. Top nav buttons (desktop) — preserve emoji prefix
document.querySelectorAll('.top-nav-btn').forEach((el,i)=>{
const k=navKeys[i];if(k&&tx[k]){
const firstWord=el.textContent.trim().split(' ')[0];
el.textContent=firstWord+' '+tx[k];
}
});

// 4. Re-render every currently visible dynamic section
// Conflict list
const listEl=document.getElementById('conflict-list');
if(listEl&&listEl.children.length&&!listEl.querySelector('.skel-card')){
renderList(currentCat);
}
// Unrest list
const unrestEl=document.getElementById('unrest-list');
if(unrestEl&&unrestEl.children.length) renderUnrestList();

// Markets tab labels
if(typeof renderMarkets==='function'&&tabRendered&&tabRendered['markets']){
renderTop10();renderConflictAssets();renderMarkets();renderMovers();
}

// Alerts
if(typeof renderAlerts==='function'&&tabRendered&&tabRendered['alerts']){
renderAlerts();
}

// Language grid (update active state label)
if(typeof buildLangGrid==='function') buildLangGrid();

// Active screen re-render
const activeId=document.querySelector('.screen.active')?.id||'';
if(activeId==='screen-cyber'&&typeof renderCyberScreen==='function') renderCyberScreen();
if(activeId==='screen-viz'&&typeof renderVizScreen==='function') renderVizScreen();
if(activeId==='screen-detail'){
const activeTab=document.querySelector('.ntab.active');
if(activeTab&&typeof setNTab==='function') setNTab(activeTab,currentTabIdx);
}

// Ticker
if(typeof updateTicker==='function') updateTicker();

// Modal content that may be open
const openModal=document.querySelector('.modal-overlay.open');
if(openModal){
// Re-apply data-i18n inside open modals (already done above, but force repaint)
openModal.querySelectorAll('[data-i18n]').forEach(el=>{
const key=el.getAttribute('data-i18n');
if(tx[key]) el.textContent=tx[key];
});
}
}

async function selectLanguage(code){
currentLang=code;
localStorage.setItem('wcl_lang',code);
buildLangGrid();
const lang=LANGUAGES.find(l=>l.code===code);
document.getElementById('html-root').setAttribute('dir',lang?.rtl?'rtl':'ltr');
if(code==='en'){
applyTranslations(UI_STRINGS);
document.getElementById('translate-status').textContent='';
showToast('🇬🇧 English');
setTimeout(()=>{ if(typeof switchTab==='function') switchTab('map'); },50);return;
}
document.getElementById('translate-status').textContent='🌐 Translating…';
showToast('🌐 Translating…');
if(txCache[code]){
applyTranslations(txCache[code]);
document.getElementById('translate-status').textContent=`✅ ${lang?.native}`;
showToast(`✅ ${lang?.native}`);
setTimeout(()=>{ if(typeof switchTab==='function') switchTab('map'); },50);return;
}
try{
// Route through /api/translate — API key stays server-side only (OWASP A02)
const stringsToTranslate=Object.entries(UI_STRINGS).map(([k,v])=>k+': '+v).join('\n');
const resp=await fetch('/api/translate',{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({type:'ui',lang:code,payload:stringsToTranslate})
});
if(resp.status===429){
const err=await resp.json().catch(()=>({}));
showToast(`⏱ Rate limited — try again in ${err.retryAfter||60}s`);
document.getElementById('translate-status').textContent='⏱ Rate limited';
return;
}
if(!resp.ok)throw new Error('API '+resp.status);
const json=await resp.json();
if(!json.result)throw new Error('No result');
const tx={...UI_STRINGS,...json.result};
txCache[code]=tx;
applyTranslations(tx);
document.getElementById('translate-status').textContent=`✅ ${lang?.native}`;
showToast(`✅ ${lang?.native}`);
setTimeout(()=>{ if(typeof switchTab==='function') switchTab('map'); },50);
}catch(e){
console.error('[translate]',e.message);
document.getElementById('translate-status').textContent='⚠️ Translation unavailable';
showToast('⚠️ Could not translate');
}
}

async function translateArticles(arts,langCode){
if(langCode==='en'||!arts.length)return arts;
const key=`${langCode}_${currentEvent}`;
if(txArticleCache[key])return txArticleCache[key];
try{
// Route through secure server proxy — no API key client-side
const payload=arts.slice(0,9).map(a=>({h:a.headline,e:(a.excerpt||'').substring(0,120)}));
const resp=await fetch('/api/translate',{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({type:'articles',lang:langCode,payload})
});
if(!resp.ok)return arts;
const json=await resp.json();
const txArts=Array.isArray(json.result)?json.result:[];
const result=arts.map((a,i)=>({...a,headline:txArts[i]?.h||a.headline,excerpt:txArts[i]?.e||a.excerpt}));
txArticleCache[key]=result;return result;
}catch(e){return arts;}
}

const outlets={

'bbc news':{type:'state',label:'State-BBC',flag:'🇬🇧'},'bbc':{type:'state',label:'State-BBC',flag:'🇬🇧'},
'al jazeera':{type:'state',label:'State-Qatar',flag:'🇶🇦'},'al-jazeera':{type:'state',label:'State-Qatar',flag:'🇶🇦'},
'russia today':{type:'state',label:'State-Kremlin',flag:'🇷🇺'},'rt':{type:'state',label:'State-Kremlin',flag:'🇷🇺'},
'tass':{type:'state',label:'State-Kremlin',flag:'🇷🇺'},'ria novosti':{type:'state',label:'State-Kremlin',flag:'🇷🇺'},
'xinhua':{type:'state',label:'State-CCP',flag:'🇨🇳'},'cgtn':{type:'state',label:'State-CCP',flag:'🇨🇳'},
'people\'s daily':{type:'state',label:'State-CCP',flag:'🇨🇳'},'global times':{type:'state',label:'State-CCP',flag:'🇨🇳'},
'dw':{type:'state',label:'State-Germany',flag:'🇩🇪'},'france 24':{type:'state',label:'State-France',flag:'🇫🇷'},
'nhk':{type:'state',label:'State-Japan',flag:'🇯🇵'},'abc australia':{type:'state',label:'State-Australia',flag:'🇦🇺'},
'cbc':{type:'state',label:'State-Canada',flag:'🇨🇦'},'yle':{type:'state',label:'State-Finland',flag:'🇫🇮'},
'iran press':{type:'state',label:'State-Iran',flag:'🇮🇷'},'press tv':{type:'state',label:'State-Iran',flag:'🇮🇷'},
'turkish radio':{type:'state',label:'State-Turkey',flag:'🇹🇷'},'trt':{type:'state',label:'State-Turkey',flag:'🇹🇷'},
'ndtv':{type:'state',label:'Pro-Govt India',flag:'🇮🇳'},'doordarshan':{type:'state',label:'State-India',flag:'🇮🇳'},
'saudi gazette':{type:'state',label:'State-KSA',flag:'🇸🇦'},'arab news':{type:'state',label:'State-KSA',flag:'🇸🇦'},

'fox news':{type:'aligned',label:'Pro-GOP',flag:'🇺🇸'},'new york post':{type:'aligned',label:'Pro-GOP',flag:'🇺🇸'},
'breitbart':{type:'aligned',label:'Pro-MAGA',flag:'🇺🇸'},'wall street journal':{type:'aligned',label:'Pro-GOP',flag:'🇺🇸'},
'daily wire':{type:'aligned',label:'Pro-MAGA',flag:'🇺🇸'},'newsmax':{type:'aligned',label:'Pro-MAGA',flag:'🇺🇸'},
'the sun':{type:'aligned',label:'Pro-Tory',flag:'🇬🇧'},'daily mail':{type:'aligned',label:'Pro-Tory',flag:'🇬🇧'},
'the telegraph':{type:'aligned',label:'Pro-Tory',flag:'🇬🇧'},'spectator':{type:'aligned',label:'Pro-Tory',flag:'🇬🇧'},
'times of india':{type:'aligned',label:'Pro-BJP',flag:'🇮🇳'},'republic world':{type:'aligned',label:'Pro-BJP',flag:'🇮🇳'},
'le figaro':{type:'aligned',label:'Pro-Right France',flag:'🇫🇷'},'bild':{type:'aligned',label:'Pro-CDU',flag:'🇩🇪'},

'cnn':{type:'aligned',label:'Pro-Democrat',flag:'🇺🇸'},'msnbc':{type:'aligned',label:'Pro-Democrat',flag:'🇺🇸'},
'new york times':{type:'aligned',label:'Pro-Democrat',flag:'🇺🇸'},'washington post':{type:'aligned',label:'Pro-Democrat',flag:'🇺🇸'},
'nbc news':{type:'aligned',label:'Pro-Democrat',flag:'🇺🇸'},'huffpost':{type:'aligned',label:'Pro-Democrat',flag:'🇺🇸'},
'le monde':{type:'aligned',label:'Centre-Left France',flag:'🇫🇷'},'liberation':{type:'aligned',label:'Left France',flag:'🇫🇷'},
'der spiegel':{type:'aligned',label:'Centre-Left Germany',flag:'🇩🇪'},'the independent':{type:'aligned',label:'Centre-Left UK',flag:'🇬🇧'},

'haaretz':{type:'opposition',label:'Opp-Likud',flag:'🇮🇱'},'972 magazine':{type:'opposition',label:'Opp-Israel',flag:'🇮🇱'},
'kyiv independent':{type:'opposition',label:'Opp-Kremlin',flag:'🇺🇦'},'meduza':{type:'opposition',label:'Opp-Kremlin',flag:'🇷🇺'},
'novaya gazeta':{type:'opposition',label:'Opp-Kremlin',flag:'🇷🇺'},'the wire':{type:'opposition',label:'Opp-BJP',flag:'🇮🇳'},
'dawn':{type:'opposition',label:'Critical Pakistan',flag:'🇵🇰'},'iran international':{type:'opposition',label:'Opp-Tehran',flag:'🇮🇷'},

'reuters':{type:'independent',label:'Independent',flag:'🇬🇧'},'associated press':{type:'independent',label:'Independent',flag:'🇺🇸'},
'ap news':{type:'independent',label:'Independent',flag:'🇺🇸'},'the guardian':{type:'independent',label:'Independent',flag:'🇬🇧'},
'the economist':{type:'independent',label:'Independent',flag:'🇬🇧'},'middle east eye':{type:'independent',label:'Independent',flag:'🌍'},
'bloomberg':{type:'independent',label:'Independent',flag:'🇺🇸'},'financial times':{type:'independent',label:'Independent',flag:'🇬🇧'},
'afp':{type:'independent',label:'Independent',flag:'🇫🇷'},'agence france':{type:'independent',label:'Independent',flag:'🇫🇷'},
'npr':{type:'independent',label:'Independent',flag:'🇺🇸'},'pbs':{type:'independent',label:'Independent',flag:'🇺🇸'},
'euronews':{type:'independent',label:'Independent',flag:'🇪🇺'},'politico':{type:'independent',label:'Independent',flag:'🇺🇸'},
'axios':{type:'independent',label:'Independent',flag:'🇺🇸'},'the hill':{type:'independent',label:'Independent',flag:'🇺🇸'},
'al monitor':{type:'independent',label:'Independent ME',flag:'🌍'},'aljazeera english':{type:'independent',label:'Independent',flag:'🌍'},
};
function getAlign(name){
if(!name)return{type:'unverified',label:'Unverified',flag:'❓'};
const l=name.toLowerCase();
for(const[k,v]of Object.entries(outlets)){if(l.includes(k))return v;}
return{type:'unverified',label:'Unverified',flag:'❓'};
}
const alignStyle={
state:'background:rgba(44,123,229,.2);color:#89c4f5;border:1px solid rgba(137,196,245,.2);',
aligned:'background:rgba(217,140,10,.18);color:#ffd47a;border:1px solid rgba(255,212,122,.2);',
independent:'background:rgba(31,163,85,.14);color:#6fffa0;border:1px solid rgba(111,255,160,.2);',
opposition:'background:rgba(155,77,202,.18);color:#d07ef5;border:1px solid rgba(208,126,245,.2);',
unverified:'background:rgba(255,255,255,.05);color:rgba(255,255,255,.28);border:1px solid rgba(255,255,255,.1);',
};
const alignDot={state:'#89c4f5',aligned:'#ffd47a',independent:'#6fffa0',opposition:'#d07ef5',unverified:'rgba(255,255,255,.2)'};
function alignBadge(al){return`<span class="align-badge" style="${alignStyle[al.type]||alignStyle.unverified}">${al.label}</span>`;}

const events=[
{id:0,cat:'military',flags:'🇮🇱🇵🇸',title:'Gaza Conflict',region:'Middle East',parties:'Israel · Hamas · Gaza',sev:'critical',sevScore:9,lat:31.5,lng:34.5,query:'Gaza Israel conflict 2025',startYear:2023,casualties:48000,displaced:1900000,econDamage:50,related:[1,2],
econContext:'The conflict has disrupted regional trade, frozen foreign investment across the Levant, and driven safe-haven flows into gold. Tourism revenues across Egypt, Jordan and Israel have dropped sharply. Reconstruction costs estimated at $50bn+.',
markets:['crude','gold','ils','lmt'],
timeline:[{date:'Oct 2023',event:'Hamas launches large-scale attack on southern Israel. Israel declares war.',tag:'Outbreak',tc:'rgba(200,50,30,.4)'},{date:'Nov 2023',event:'IDF ground offensive begins in northern Gaza.',tag:'Escalation',tc:'rgba(200,50,30,.4)'},{date:'Jan 2025',event:'Phase-one ceasefire agreed. Hostage-prisoner exchange begins.',tag:'Ceasefire',tc:'rgba(31,163,85,.4)'},{date:'Mar 2025',event:'Ceasefire under strain. Both sides allege violations.',tag:'Fragile',tc:'rgba(217,140,10,.4)'}]},

{id:1,cat:'military',flags:'🇷🇺🇺🇦',title:'Russia–Ukraine War',region:'Eastern Europe',parties:'Russia · Ukraine · NATO',sev:'critical',sevScore:10,lat:49.0,lng:31.0,query:'Russia Ukraine war 2025',startYear:2022,casualties:500000,displaced:10000000,econDamage:486,related:[0,400],
econContext:'The war restructured global energy markets. Europe spent €800bn replacing Russian gas. Ukrainian grain corridor disruptions raised global wheat prices 40%+. Reconstruction estimated at $486bn.',
markets:['natgas','wheat','rub','rtx'],
timeline:[{date:'Feb 2022',event:'Russia launches full-scale invasion.',tag:'Invasion',tc:'rgba(200,50,30,.4)'},{date:'Sep 2022',event:'Ukraine liberates Kherson and Kharkiv.',tag:'Advance',tc:'rgba(31,163,85,.4)'},{date:'Jan 2025',event:'Frontlines largely static. Peace talks proposed.',tag:'Diplomacy',tc:'rgba(31,163,85,.4)'}]},

{id:2,cat:'military',flags:'🇮🇷🇮🇱',title:'Iran–Israel Tensions',region:'Middle East',parties:'Iran · Israel · USA',sev:'critical',sevScore:8,lat:32.5,lng:52.0,query:'Iran Israel nuclear tensions 2025',startYear:2024,casualties:200,displaced:0,econDamage:15,related:[0,3],
econContext:"Iran's nuclear programme creates structural oil price risk. Hormuz closure could spike oil $20-40/barrel. US carrier groups repositioned. Gold at multi-year highs on safe-haven demand.",
markets:['crude','gold','rtx'],
timeline:[{date:'Apr 2024',event:'Iran launches first-ever direct missile attack on Israeli territory.',tag:'Historic',tc:'rgba(200,50,30,.4)'},{date:'Jul 2024',event:'Israel strikes Hamas chief in Tehran.',tag:'Flashpoint',tc:'rgba(200,50,30,.4)'},{date:'Mar 2025',event:'Nuclear talks collapsed. Escalation risk elevated.',tag:'Escalation',tc:'rgba(200,50,30,.4)'}]},

{id:3,cat:'military',flags:'🇸🇩',title:'Sudan Civil War',region:'East Africa',parties:'SAF · RSF · Civilians',sev:'critical',sevScore:9,lat:15.5,lng:32.5,query:'Sudan civil war 2025',startYear:2023,casualties:150000,displaced:10500000,econDamage:30,related:[200],
econContext:'Sudan\'s economy has collapsed. Oil production halted. 10 million displaced. Agricultural output cut dramatically, affecting regional food prices.',
markets:['wheat','gold'],
timeline:[{date:'Apr 2023',event:'Fighting erupts between SAF and RSF.',tag:'Outbreak',tc:'rgba(200,50,30,.4)'},{date:'Mar 2025',event:'SAF retakes parts of Khartoum. RSF entrenched in Darfur.',tag:'Ongoing',tc:'rgba(200,50,30,.4)'}]},

{id:4,cat:'military',flags:'🇹🇼🇨🇳',title:'Taiwan Strait Standoff',region:'East Asia',parties:'Taiwan · China · USA',sev:'high',sevScore:8,lat:24.0,lng:121.0,query:'Taiwan China military tensions 2025',startYear:2022,casualties:0,displaced:0,econDamage:0,related:[401],
econContext:'Taiwan produces 90% of the world\'s advanced semiconductors. A conflict would trigger a global chip shortage estimated at $1 trillion in lost output.',
markets:['gold','rtx','lmt'],
timeline:[{date:'Aug 2022',event:'China launches largest-ever military exercises around Taiwan.',tag:'Escalation',tc:'rgba(200,50,30,.4)'},{date:'Feb 2025',event:'US approves $8bn arms package for Taiwan.',tag:'Tensions',tc:'rgba(200,50,30,.4)'}]},

{id:5,cat:'military',flags:'🇮🇳🇵🇰',title:'Kashmir Standoff',region:'South Asia',parties:'India · Pakistan · Militants',sev:'high',sevScore:6,lat:33.5,lng:75.0,query:'India Pakistan Kashmir conflict 2025',startYear:2019,casualties:500,displaced:300000,econDamage:5,related:[],
econContext:'Nuclear-armed rivals. Any escalation would freeze $30bn trade corridor. Gold surges on subcontinental safe-haven demand.',
markets:['gold'],
timeline:[{date:'Aug 2019',event:'India revokes Article 370.',tag:'Political',tc:'rgba(200,50,30,.4)'},{date:'Mar 2025',event:'Military exercises by both sides.',tag:'Tensions',tc:'rgba(200,50,30,.4)'}]},

{id:6,cat:'military',flags:'🇲🇲',title:'Myanmar Civil War',region:'Southeast Asia',parties:'Military Junta · Resistance Forces',sev:'critical',sevScore:8,lat:19.0,lng:96.0,query:'Myanmar civil war junta 2025',startYear:2021,casualties:50000,displaced:2500000,econDamage:25,related:[],
econContext:'Myanmar\'s economy shrunk 18% since the coup. Foreign investment collapsed. Regional trade routes disrupted. Drug production in Wa region surging.',
markets:['gold'],
timeline:[{date:'Feb 2021',event:'Military coup. Aung San Suu Kyi arrested.',tag:'Coup',tc:'rgba(155,77,202,.4)'},{date:'2023',event:'Resistance forces gain major territory.',tag:'Turning Point',tc:'rgba(31,163,85,.4)'},{date:'Mar 2025',event:'Junta controls less than 50% of territory.',tag:'Collapse',tc:'rgba(200,50,30,.4)'}]},

{id:7,cat:'military',flags:'🇪🇹🇪🇷',title:'Ethiopia–Eritrea Tensions',region:'Horn of Africa',parties:'Ethiopia · Eritrea · Tigray',sev:'medium',sevScore:5,lat:14.0,lng:39.5,query:'Ethiopia Eritrea Tigray conflict 2025',startYear:2020,casualties:300000,displaced:2000000,econDamage:20,related:[3],
econContext:'Tigray war caused $29bn in damage. Food insecurity for 5 million. Disrupted Horn of Africa trade routes.',
markets:['wheat'],
timeline:[{date:'Nov 2020',event:'Tigray war begins.',tag:'Outbreak',tc:'rgba(200,50,30,.4)'},{date:'Nov 2022',event:'Pretoria Peace Agreement signed.',tag:'Peace',tc:'rgba(31,163,85,.4)'},{date:'Mar 2025',event:'Fragile peace holds. Eritrea tensions unresolved.',tag:'Fragile',tc:'rgba(217,140,10,.4)'}]},

{id:8,cat:'military',flags:'🇾🇪',title:'Yemen War',region:'Middle East',parties:'Houthis · Saudi Coalition · Civilians',sev:'critical',sevScore:8,lat:15.5,lng:47.0,query:'Yemen war Houthi 2025',startYear:2015,casualties:377000,displaced:4300000,econDamage:89,related:[2],
econContext:'Yemen war caused $89bn in economic damage. Red Sea Houthi attacks disrupted 12% of global trade in 2024. Insurance premiums on shipping routes tripled.',
markets:['crude','gold'],
timeline:[{date:'Mar 2015',event:'Saudi-led coalition intervenes.',tag:'Escalation',tc:'rgba(200,50,30,.4)'},{date:'Dec 2023',event:'Houthis begin attacking Red Sea shipping.',tag:'Red Sea',tc:'rgba(200,50,30,.4)'},{date:'Mar 2025',event:'US strikes on Houthi positions. Shipping disruptions continue.',tag:'Active',tc:'rgba(200,50,30,.4)'}]},

{id:9,cat:'military',flags:'🇨🇩',title:'DRC Eastern Conflict',region:'Central Africa',parties:'M23 · FARDC · Rwanda · Civilians',sev:'critical',sevScore:8,lat:-1.5,lng:29.0,query:'DRC Congo M23 conflict 2025',startYear:2022,casualties:8000,displaced:7000000,econDamage:15,related:[],
econContext:'DRC holds 70% of global cobalt. M23 advance threatens mining operations. EV supply chain at risk. Regional destabilization across Great Lakes.',
markets:['gold'],
timeline:[{date:'2022',event:'M23 resurgence backed by Rwanda.',tag:'Resurgence',tc:'rgba(200,50,30,.4)'},{date:'Jan 2025',event:'M23 captures Goma, strategic eastern hub.',tag:'Major Gain',tc:'rgba(200,50,30,.4)'}]},

{id:10,cat:'military',flags:'🇸🇦🇾🇪',title:'Red Sea Crisis',region:'Middle East / Maritime',parties:'Houthis · International Shipping · USA',sev:'high',sevScore:7,lat:15.0,lng:43.5,query:'Red Sea Houthi shipping attacks 2025',startYear:2023,casualties:50,displaced:0,econDamage:200,related:[8,2],
econContext:'12% of global trade worth $1 trillion/year passes through the Red Sea. Attacks forced rerouting via Cape of Good Hope adding 10+ days per voyage. Global inflation impact estimated at 0.3-0.5%.',
markets:['crude','wheat'],
timeline:[{date:'Oct 2023',event:'Houthis launch first ship attack in solidarity with Gaza.',tag:'Start',tc:'rgba(200,50,30,.4)'},{date:'Jan 2024',event:'US/UK strikes on Houthi targets in Yemen.',tag:'Escalation',tc:'rgba(200,50,30,.4)'},{date:'Mar 2025',event:'Major shipping lines still avoiding Red Sea.',tag:'Ongoing',tc:'rgba(217,140,10,.4)'}]},

{id:100,cat:'unrest',subtype:'protest',flags:'🇷🇸',title:'Serbia Protests',region:'Balkans',parties:'Citizens · Government',sev:'high',sevScore:5,lat:44.8,lng:20.5,query:'Serbia protests opposition 2025',startYear:2024,casualties:5,displaced:0,econDamage:2,related:[],
econContext:'Investor confidence shaken. Serbia\'s EU accession under scrutiny. Tourism and FDI declining. Serbian Dinar under pressure as EU talks stall.',
markets:['rsd','eur','gold'],
timeline:[{date:'Nov 2024',event:'Novi Sad train station canopy collapse kills 15.',tag:'Trigger',tc:'rgba(200,50,30,.4)'},{date:'Feb 2025',event:'Millions march in Belgrade.',tag:'Peak',tc:'rgba(31,163,85,.4)'}]},

{id:101,cat:'unrest',subtype:'election',flags:'🇻🇪',title:'Venezuela Crisis',region:'Latin America',parties:'Maduro · Opposition · People',sev:'high',sevScore:6,lat:8.0,lng:-66.0,query:'Venezuela Maduro political crisis 2025',startYear:2024,casualties:200,displaced:7000000,econDamage:10,related:[],
econContext:'Venezuela\'s oil output at 25% of 2013 peak. US sanctions cost $6bn annually. Mass emigration of 7 million.',
markets:['crude'],
timeline:[{date:'Jul 2024',event:'Disputed presidential election.',tag:'Election',tc:'rgba(217,140,10,.4)'},{date:'Aug 2024',event:'Mass protests. Scores killed.',tag:'Repression',tc:'rgba(200,50,30,.4)'}]},

{id:102,cat:'unrest',subtype:'coup',flags:'🇳🇪🇲🇱🇧🇫',title:'Sahel Military Takeovers',region:'West Africa',parties:'Military Juntas · Populations · France',sev:'high',sevScore:7,lat:17.0,lng:2.0,query:'Sahel coup military Niger Mali Burkina Faso 2025',startYear:2023,casualties:3000,displaced:3000000,econDamage:8,related:[300],
econContext:'France lost €1.5bn in annual development contracts. Wagner Group presence destabilised security. 20+ million facing food insecurity.',
markets:['gold','wheat'],
timeline:[{date:'Jul 2023',event:'Military coup in Niger.',tag:'Coup',tc:'rgba(155,77,202,.4)'},{date:'Jan 2025',event:'French military fully withdrawn.',tag:'Shift',tc:'rgba(200,50,30,.4)'}]},

{id:103,cat:'unrest',subtype:'protest',flags:'🇬🇪',title:'Georgia EU Crisis',region:'Caucasus',parties:'Government · Pro-EU Protesters',sev:'high',sevScore:5,lat:41.7,lng:44.8,query:'Georgia protest EU 2025',startYear:2024,casualties:10,displaced:0,econDamage:1,related:[],
econContext:'Georgia\'s EU candidacy suspended. Foreign investment declining. Tourism hit by political uncertainty.',
markets:['gold'],
timeline:[{date:'Oct 2024',event:'Georgian Dream wins disputed election.',tag:'Election',tc:'rgba(217,140,10,.4)'},{date:'Dec 2024',event:'Mass pro-EU protests erupt in Tbilisi.',tag:'Protests',tc:'rgba(31,163,85,.4)'},{date:'Mar 2025',event:'Government doubles down on Russia pivot.',tag:'Ongoing',tc:'rgba(200,50,30,.4)'}]},

{id:104,cat:'unrest',subtype:'protest',flags:'🇰🇪',title:'Kenya Political Unrest',region:'East Africa',parties:'Government · Opposition · Gen-Z Protesters',sev:'medium',sevScore:4,lat:-1.3,lng:36.8,query:'Kenya protests Ruto 2025',startYear:2024,casualties:60,displaced:10000,econDamage:2,related:[],
econContext:'IMF deal under pressure. Shilling weakened 20%. Foreign investor confidence hit by street violence and political uncertainty.',
markets:['gold'],
timeline:[{date:'Jun 2024',event:'Gen-Z protests against Finance Bill. Parliament stormed.',tag:'Uprising',tc:'rgba(200,50,30,.4)'},{date:'Jul 2024',event:'Ruto withdraws Finance Bill. Cabinet reshuffled.',tag:'Concession',tc:'rgba(31,163,85,.4)'}]},

{id:200,cat:'humanitarian',flags:'🇸🇩',title:'Darfur Crisis',region:'East Africa',parties:'Civilians · RSF · Aid Groups',sev:'critical',sevScore:9,lat:13.5,lng:24.0,query:'Darfur humanitarian crisis famine 2025',startYear:2023,casualties:20000,displaced:9000000,econDamage:12,related:[3],
econContext:'UN declares famine conditions. WFP requires $4.1bn to respond. 5 million face starvation.',
markets:['wheat'],
timeline:[{date:'Apr 2023',event:'RSF advances into Darfur.',tag:'Crisis',tc:'rgba(200,50,30,.4)'},{date:'Mar 2025',event:'ICC issues new arrest warrants.',tag:'Famine',tc:'rgba(200,50,30,.4)'}]},

{id:201,cat:'humanitarian',flags:'🇨🇳',title:'Uyghur Situation',region:'Northwest China',parties:'Uyghur Population · Chinese Govt',sev:'high',sevScore:7,lat:43.0,lng:87.5,query:'Uyghur Xinjiang human rights 2025',startYear:2017,casualties:0,displaced:1800000,econDamage:40,related:[401],
econContext:'Western sanctions on Xinjiang goods affect $40bn in annual trade including cotton and polysilicon (35% of global solar supply).',
markets:['gold'],
timeline:[{date:'2017',event:'Mass detention campaign begins.',tag:'Start',tc:'rgba(200,50,30,.4)'},{date:'2022',event:'UN report describes possible crimes against humanity.',tag:'UN Report',tc:'rgba(217,140,10,.4)'}]},

{id:202,cat:'humanitarian',flags:'🇦🇫',title:'Afghanistan Humanitarian Crisis',region:'South Asia',parties:'Taliban · Afghan People · UN',sev:'critical',sevScore:8,lat:33.9,lng:67.7,query:'Afghanistan humanitarian crisis Taliban 2025',startYear:2021,casualties:5000,displaced:4000000,econDamage:35,related:[],
econContext:'Afghan economy collapsed 30% after Taliban takeover. 24 million face acute food insecurity. $9bn in frozen assets. Aid funding gap of $3.2bn annually.',
markets:['gold','wheat'],
timeline:[{date:'Aug 2021',event:'Taliban seize Kabul. US withdrawal complete.',tag:'Takeover',tc:'rgba(200,50,30,.4)'},{date:'2022',event:'Women banned from education and most employment.',tag:'Repression',tc:'rgba(200,50,30,.4)'},{date:'Mar 2025',event:'Worst hunger crisis in 20 years. Aid groups stretched.',tag:'Crisis',tc:'rgba(200,50,30,.4)'}]},

{id:203,cat:'humanitarian',flags:'🇭🇹',title:'Haiti Gang Crisis',region:'Caribbean',parties:'Armed Gangs · Government · Civilians',sev:'critical',sevScore:7,lat:18.9,lng:-72.3,query:'Haiti gang crisis 2025',startYear:2023,casualties:8000,displaced:700000,econDamage:5,related:[],
econContext:'Gangs control 80% of Port-au-Prince. Economy in freefall. Agriculture disrupted. Tourism industry nonexistent. Annual GDP loss estimated at $2bn.',
markets:['crude'],
timeline:[{date:'Jul 2023',event:'President Moïse assassination aftermath. State collapse accelerates.',tag:'Crisis',tc:'rgba(200,50,30,.4)'},{date:'Mar 2024',event:'Gangs storm two major prisons. 4,000 escape.',tag:'Breakdown',tc:'rgba(200,50,30,.4)'},{date:'Mar 2025',event:'Kenyan-led security mission operational but overwhelmed.',tag:'Ongoing',tc:'rgba(200,50,30,.4)'}]},

{id:300,cat:'terrorism',flags:'🇳🇬🇳🇪🇲🇱',title:'ISIS–Sahel Insurgency',region:'West Africa',parties:'ISIS-GS · JNIM · Civilians',sev:'critical',sevScore:8,lat:14.0,lng:3.0,query:'ISIS Sahel jihadist attacks 2025',startYear:2015,casualties:12000,displaced:3000000,econDamage:18,related:[102],
econContext:'Insurgency destroyed agricultural productivity across Lake Chad basin. 3 million displaced. Record casualties in 2024.',
markets:['gold','wheat'],
timeline:[{date:'2015',event:'ISIS-GS and JNIM establish Sahel presence.',tag:'Emergence',tc:'rgba(200,50,30,.4)'},{date:'Mar 2025',event:'Attacks reach coastal West Africa.',tag:'Expansion',tc:'rgba(200,50,30,.4)'}]},

{id:301,cat:'terrorism',flags:'🇸🇴',title:'Al-Shabaab — Somalia',region:'East Africa',parties:'Al-Shabaab · Government · AMISOM',sev:'high',sevScore:6,lat:5.5,lng:46.0,query:'Al-Shabaab Somalia attacks 2025',startYear:2006,casualties:5000,displaced:3600000,econDamage:8,related:[],
econContext:'Al-Shabaab taxes trade across large areas of Somalia. Regional maritime trade disrupted, raising Gulf of Aden shipping insurance.',
markets:['crude'],
timeline:[{date:'2006',event:'Al-Shabaab emerges as major force.',tag:'Emergence',tc:'rgba(200,50,30,.4)'},{date:'Mar 2025',event:'Major offensive operations ongoing.',tag:'Active',tc:'rgba(200,50,30,.4)'}]},

{id:302,cat:'terrorism',flags:'🇵🇰',title:'Pakistan–TTP Conflict',region:'South Asia',parties:'Pakistani Army · TTP Militants',sev:'high',sevScore:6,lat:34.0,lng:70.5,query:'Pakistan TTP terrorism attacks 2025',startYear:2022,casualties:2800,displaced:500000,econDamage:6,related:[5],
econContext:'TTP attacks cost Pakistan $2.6bn annually. Tourism and FDI in KPK region collapsed. IMF bailout conditions include security stabilisation.',
markets:['gold'],
timeline:[{date:'2022',event:'TTP ends ceasefire. Attacks spike 50%.',tag:'Escalation',tc:'rgba(200,50,30,.4)'},{date:'Mar 2025',event:'Record IED and suicide attacks. Tribal regions destabilised.',tag:'Active',tc:'rgba(200,50,30,.4)'}]},


{id:400,cat:'cyber',flags:'🇷🇺🇺🇦💻',title:'Russia–Ukraine Cyberwar',region:'Global / Eastern Europe',parties:'GRU · FSB · UA CERT · NATO',sev:'critical',sevScore:9,lat:52.0,lng:28.0,query:'Russia Ukraine cyberattacks 2025',startYear:2022,casualties:0,displaced:0,econDamage:10,related:[1],
econContext:'Over 5,000 cyberattacks per day targeting Ukrainian infrastructure. European energy grids, banks and telecoms also hit. Estimated economic damage $10bn+. NATO activated cyber-defence Article 5 protocols.',
markets:['rtx','gold'],
timeline:[{date:'Feb 2022',event:'Wiper malware hits Ukrainian government networks hours before invasion.',tag:'D-Day',tc:'rgba(200,50,30,.4)'},{date:'2023',event:'GRU\'s Sandworm targets European energy grids.',tag:'Escalation',tc:'rgba(200,50,30,.4)'},{date:'Jan 2025',event:'Ukraine CERT repels coordinated attack on power infrastructure.',tag:'Ongoing',tc:'rgba(217,140,10,.4)'}]},

{id:401,cat:'cyber',flags:'🇨🇳🇺🇸💻',title:'China–US Cyber Espionage',region:'Global',parties:'PLA Unit 61398 · NSA · CISA',sev:'critical',sevScore:9,lat:39.9,lng:-100.0,query:'China US cyberattack espionage 2025',startYear:2023,casualties:0,displaced:0,econDamage:600,related:[4,201],
econContext:'Salt Typhoon penetrated 9 major US telecoms. Volt Typhoon pre-positioned in critical infrastructure. Microsoft, Boeing, defense contractors breached. Estimated IP theft costs $600bn/year.',
markets:['gold','rtx'],
timeline:[{date:'2023',event:'Volt Typhoon infiltrates US critical infrastructure — sleeper access.',tag:'Infiltration',tc:'rgba(200,50,30,.4)'},{date:'Oct 2024',event:'Salt Typhoon breaches AT&T, Verizon, T-Mobile.',tag:'Major Breach',tc:'rgba(200,50,30,.4)'},{date:'Mar 2025',event:'US indicts 12 PLA officers. Diplomatic tensions spike.',tag:'Escalation',tc:'rgba(217,140,10,.4)'}]},

{id:402,cat:'cyber',flags:'🇮🇷💻🇮🇱',title:'Iran Cyber Operations',region:'Middle East / Global',parties:'IRGC · Charming Kitten · Israel · USA',sev:'high',sevScore:7,lat:35.0,lng:51.0,query:'Iran cyberattack IRGC 2025',startYear:2023,casualties:0,displaced:0,econDamage:5,related:[2],
econContext:'Iranian hackers targeted Israeli water infrastructure, hospitals and defence firms. US Treasury, State Dept and nuclear contractors breached. Insurance sector on alert.',
markets:['crude','gold'],
timeline:[{date:'2023',event:'IRGC-linked group attacks Israeli water and energy systems.',tag:'Attack',tc:'rgba(200,50,30,.4)'},{date:'2024',event:'Charming Kitten targets US presidential campaign staff.',tag:'Espionage',tc:'rgba(217,140,10,.4)'},{date:'Feb 2025',event:'Major ransomware attributed to Iran hits Gulf state banks.',tag:'Ongoing',tc:'rgba(200,50,30,.4)'}]},

{id:403,cat:'cyber',flags:'🌐💻🔒',title:'Global Ransomware Wave',region:'Global',parties:'LockBit · RansomHub · ALPHV · Victims',sev:'high',sevScore:7,lat:48.8,lng:2.3,query:'ransomware attacks 2025 LockBit',startYear:2024,casualties:0,displaced:0,econDamage:1100,related:[],
econContext:'Ransomware costs hit $1.1 trillion in 2024. Hospitals, ports, water utilities and schools targeted. LockBit disrupted but reformed. Average ransom demand now $2.8M.',
markets:['gold','rtx'],
timeline:[{date:'Feb 2024',event:'FBI takes down LockBit infrastructure. New version re-emerges in weeks.',tag:'Takedown',tc:'rgba(31,163,85,.4)'},{date:'2024',event:'Change Healthcare hack disrupts US medical payments for 3 months.',tag:'Major Hit',tc:'rgba(200,50,30,.4)'},{date:'Mar 2025',event:'RansomHub claims 400+ victims. Critical infrastructure on alert.',tag:'Ongoing',tc:'rgba(200,50,30,.4)'}]},
];

const TOP10_ASSETS=[
{rank:1,icon:'🍎',name:'Apple',ticker:'AAPL',price:'$213.49',mcap:'$3.26T',change:'+1.2%',dir:'up',bar:100},
{rank:2,icon:'🤖',name:'NVIDIA',ticker:'NVDA',price:'$875.40',mcap:'$2.15T',change:'+3.4%',dir:'up',bar:66},
{rank:3,icon:'🔍',name:'Microsoft',ticker:'MSFT',price:'$418.32',mcap:'$3.11T',change:'+0.8%',dir:'up',bar:95},
{rank:4,icon:'🛒',name:'Amazon',ticker:'AMZN',price:'$192.45',mcap:'$2.04T',change:'+1.5%',dir:'up',bar:63},
{rank:5,icon:'₿',name:'Bitcoin',ticker:'BTC',price:'$83,420',mcap:'$1.65T',change:'+2.1%',dir:'up',bar:50},
{rank:6,icon:'🔎',name:'Alphabet',ticker:'GOOG',price:'$175.20',mcap:'$2.14T',change:'-0.3%',dir:'dn',bar:65},
{rank:7,icon:'⚡',name:'Tesla',ticker:'TSLA',price:'$245.80',mcap:'$784B',change:'-1.8%',dir:'dn',bar:24},
{rank:8,icon:'🥇',name:'Gold',ticker:'XAU/USD',price:'$2,381',mcap:'$15.6T',change:'+1.8%',dir:'up',bar:100},
{rank:9,icon:'🛢️',name:'Brent Crude',ticker:'BRT',price:'$87.42',mcap:'Commodity',change:'+3.2%',dir:'up',bar:0},
{rank:10,icon:'🏦',name:'Berkshire Hathaway',ticker:'BRK-B',price:'$458.20',mcap:'$663B',change:'+0.4%',dir:'up',bar:20},
];

const CONFLICT_ASSETS=[
{icon:'🛢️',name:'Brent Crude',ticker:'BRT',price:'$87.42',change:'+3.2%',dir:'up',conflicts:['Gaza Conflict','Iran–Israel Tensions'],why:'Hormuz closure risk + Russian export curbs'},
{icon:'🥇',name:'Gold',ticker:'XAU',price:'$2,381',change:'+1.8%',dir:'up',conflicts:['Iran–Israel Tensions','Taiwan Strait'],why:'Safe-haven demand at multi-year highs'},
{icon:'🌾',name:'Wheat',ticker:'CBOT',price:'$6.42',change:'+4.1%',dir:'up',conflicts:['Russia–Ukraine War','Darfur Crisis'],why:'Black Sea corridor disruptions, -29% supply'},
{icon:'🔥',name:'Natural Gas',ticker:'TTF',price:'$3.82',change:'+5.1%',dir:'up',conflicts:['Russia–Ukraine War'],why:'Pipeline cuts, EU storage at 48%'},
{icon:'🏭',name:'Raytheon',ticker:'RTX',price:'$108.40',change:'+2.8%',dir:'up',conflicts:['Multiple'],why:'NATO 2%+ GDP drive, $100bn backlog'},
{icon:'💱',name:'USD/Shekel',ticker:'ILS',price:'3.84',change:'+1.2%',dir:'dn',conflicts:['Gaza Conflict'],why:'War costs, $30bn currency interventions'},
];

const marketDefs=[
{id:'crude',icon:'🛢️',name:'Brent Crude',ticker:'BRT',events:['Gaza Conflict','Iran–Israel Tensions','Venezuela Crisis'],why:'Strait of Hormuz closure risk and Russian export restrictions are structural drivers. Each major Middle East escalation historically adds $5–8/barrel.',history:[82,84,83,86,85,88,87,89,91,90,92,87]},
{id:'gold',icon:'🥇',name:'Gold',ticker:'XAU/USD',events:['Iran–Israel Tensions','Taiwan Strait Standoff','Kashmir Standoff'],why:'Safe-haven demand surges during multi-conflict periods. Central bank buying at record pace. Outperforms all assets when two or more critical conflicts escalate.',history:[2150,2180,2175,2220,2250,2280,2310,2340,2370,2360,2390,2381]},
{id:'natgas',icon:'🔥',name:'Natural Gas',ticker:'TTF',events:['Russia–Ukraine War'],why:'Russian pipeline cuts and EU storage drawdowns are structural. TTF trades at 3x pre-war average. Infrastructure strikes push prices higher.',history:[3.1,3.4,3.3,3.6,3.5,3.8,3.7,4.0,3.9,3.8,4.1,3.82]},
{id:'wheat',icon:'🌾',name:'Wheat',ticker:'CBOT',events:['Russia–Ukraine War','Sudan Civil War','Darfur Crisis'],why:'Ukraine and Russia supply 29% of global wheat exports. Sahel conflicts cut regional agricultural output further.',history:[5.6,5.9,5.8,6.1,6.0,6.3,6.2,6.4,6.3,6.5,6.4,6.42]},
{id:'rub',icon:'💱',name:'USD/Ruble',ticker:'USD/RUB',events:['Russia–Ukraine War'],why:'Western sanctions, SWIFT exclusions and declining oil revenues have structurally weakened the ruble.',history:[76,79,81,82,84,86,87,88,89,91,92,92.4]},
{id:'ils',icon:'💱',name:'USD/Shekel',ticker:'USD/ILS',events:['Gaza Conflict','Iran–Israel Tensions'],why:'War costs, capital outflows and foreign investor withdrawal have pressured the shekel. Bank of Israel deployed $30bn in currency interventions.',history:[3.58,3.62,3.67,3.70,3.73,3.75,3.77,3.79,3.80,3.82,3.83,3.84]},
{id:'rtx',icon:'🏭',name:'Raytheon (RTX)',ticker:'NYSE:RTX',events:['Iran–Israel Tensions','Russia–Ukraine War','Taiwan Strait Standoff'],why:'Defence spending at post-Cold War highs. NATO 2%+ GDP commitments. Patriot and Iron Dome demand at record levels. $100bn+ backlog.',history:[90,93,96,98,100,102,101,104,105,106,108,108.4]},
{id:'eur',icon:'💶',name:'EUR/USD',ticker:'EUR/USD',events:['Serbia Protests','Russia–Ukraine War'],why:'Euro weakens when Eastern European instability rises. Serbian protests affect regional investment flows and EU accession timeline.',history:[1.07,1.08,1.07,1.09,1.08,1.10,1.09,1.08,1.07,1.09,1.08,1.07]},
{id:'rsd',icon:'💱',name:'Serbian Dinar',ticker:'USD/RSD',events:['Serbia Protests'],why:'Political instability and EU accession uncertainty are weighing on the dinar. Protests risk foreign investment withdrawal and credit downgrades.',history:[108,109,110,111,111,112,113,112,113,114,115,116]},
{id:'uah',icon:'💱',name:'Ukrainian Hryvnia',ticker:'USD/UAH',events:['Russia–Ukraine War'],why:'War has decimated the hryvnia. NBU burned through $40bn defending the peg. Reconstruction costs estimated at $500bn+.',history:[27,28,29,30,33,36,37,38,39,40,41,41.2]},
{id:'try',icon:'💱',name:'Turkish Lira',ticker:'USD/TRY',events:['Iran–Israel Tensions','Syria Civil War'],why:'Turkey is deeply exposed to Middle East energy prices and refugee flows. Lira volatility reflects geopolitical and inflation pressures.',history:[19,21,23,25,27,28,29,30,31,32,33,33.5]},
{id:'copper',icon:'🔩',name:'Copper',ticker:'COMEX',events:['Taiwan Strait Standoff'],why:'Taiwan produces chips that run copper-intensive data centres. A blockade would spike copper demand forecasts and supply chain costs.',history:[3.8,3.9,3.85,4.0,4.1,4.2,4.15,4.3,4.25,4.4,4.5,4.48]},
{id:'lmt',icon:'🚀',name:'Lockheed Martin',ticker:'NYSE:LMT',events:['Russia–Ukraine War','Taiwan Strait Standoff','Gaza Conflict'],why:'F-35 demand surging. Poland, Germany, Finland placed multi-billion orders. HIMARS and THAAD contracts expanding. $135bn backlog.',history:[435,442,448,454,458,462,464,466,468,469,471,472.5]},
];
const winnerDefs=[{id:'rtx',icon:'🏭',name:'Raytheon',ticker:'RTX'},{id:'lmt',icon:'🚀',name:'Lockheed',ticker:'LMT'},{id:'gold',icon:'🥇',name:'Gold',ticker:'XAU'},{id:'crude',icon:'🛢️',name:'Brent Crude',ticker:'BRT'},{id:'natgas',icon:'🔥',name:'Nat. Gas',ticker:'TTF'}];
const loserDefs=[{icon:'✈️',name:'Airlines Index',ticker:'XAL',change:'-2.1%',dir:'dn'},{icon:'🏨',name:'Tourism ETF',ticker:'AWAY',change:'-1.4%',dir:'dn'},{icon:'🚢',name:'Dry Bulk Shipping',ticker:'BDIY',change:'-3.2%',dir:'dn'},{icon:'💱',name:'Egyptian Pound',ticker:'EGP',change:'-2.8%',dir:'dn'},{icon:'💊',name:'EM Pharma ETF',ticker:'EMPH',change:'-0.9%',dir:'dn'}];
const mktFallback={crude:{price:'$87.42',change:'+3.2%',dir:'up',raw:87.42},gold:{price:'$2,381',change:'+1.8%',dir:'up',raw:2381},natgas:{price:'$3.82',change:'+5.1%',dir:'up',raw:3.82},wheat:{price:'$6.42',change:'+4.1%',dir:'up',raw:6.42},rub:{price:'92.40',change:'+0.8%',dir:'dn',raw:92.4},ils:{price:'3.84',change:'+1.2%',dir:'up',raw:3.84},rtx:{price:'$108.40',change:'+2.8%',dir:'up',raw:108.4},lmt:{price:'$472.50',change:'+1.9%',dir:'up',raw:472.5}};
const cryptoData={BTC:'$83,420',ETH:'$2,041',XRP:'$2.21',SOL:'$135.40',BNB:'$598',AVAX:'$22.10',DOGE:'$0.172',ADA:'$0.71'};
mktFallback.eur={price:'$1.07',change:'-0.3%',dir:'dn',raw:1.07};mktFallback.rsd={price:'116',change:'+0.8%',dir:'dn',raw:116};mktFallback.uah={price:'41.2',change:'+1.2%',dir:'dn',raw:41.2};mktFallback.try={price:'33.5',change:'+0.5%',dir:'dn',raw:33.5};mktFallback.copper={price:'$4.48',change:'+1.1%',dir:'up',raw:4.48};
let liveMarkets={};let liveNews={};let currentEvent=0;let lastScreen='map';
let currentCat='military';let currentTabIdx=0;let leafletMap=null;let mapMarkers=[];
let newsRefreshTimer=null;let bannerEventId=null;let latestAlertHeadline='';let alertsData=[];let currentFilter='all';
