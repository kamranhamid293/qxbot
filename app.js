
const getBtn = document.getElementById('get');
const pairEl = document.getElementById('pair');
const tfEl = document.getElementById('tf');
const card = document.getElementById('signalCard');
const txt = document.getElementById('signalText');
const rs = document.getElementById('reason');

function hash(s){ let h=0; for(let i=0;i<s.length;i++){ h=(h<<5)-h + s.charCodeAt(i); h|=0;} return Math.abs(h); }
function ema(series, len){ const k=2/(len+1); let e=series[0]; for(let i=1;i<series.length;i++){ e=series[i]*k+e*(1-k);} return e; }
function rsi(series, len=8){ let gains=0,losses=0; for(let i=series.length-len+1;i<series.length;i++){ const d=series[i]-series[i-1]; if(d>=0) gains+=d; else losses+=-d; } const rs = losses===0?100:gains/losses; return Math.max(0, Math.min(100, 100 - (100/(1+rs)))); }
function atr(bars, len=7){ let sum=0; for(let i=1;i<bars.length;i++){ const h=bars[i].h,l=bars[i].l,pc=bars[i-1].c; const tr=Math.max(h-l, Math.abs(h-pc), Math.abs(l-pc)); if(i>bars.length-len-1) sum+=tr; } return sum/len; }

function synthOHLC(pair, tfMs, bars=60){
  const now = Date.now(); const base = Math.floor(now / tfMs); const out = [];
  let last = (hash(pair)%1000)/10 + 100;
  for(let i=bars;i>0;i--){
    const idx = base - i;
    const seed = hash(pair + '|' + tfMs + '|' + idx);
    const drift = ((seed % 100) - 50) / 600;
    const range = ((seed>>3)%100)/80;
    const o = last; const c = +(o + drift).toFixed(6);
    const h = +(Math.max(o,c) + range*0.2).toFixed(6);
    const l = +(Math.min(o,c) - range*0.2).toFixed(6);
    out.push({t: idx*tfMs, o, h, l, c}); last=c;
  }
  return out;
}

async function getCandles(pair, tfMs){
  if(window.USE_LIVE){
    try{
      const url = `/api/candles?pair=${encodeURIComponent(pair)}&tf=${tfMs}&bars=80`;
      const r = await fetch(url, {cache:'no-store'});
      if(r.ok){ const j = await r.json(); if(Array.isArray(j) && j.length>10) return j; }
    }catch(e){ /* fall through */ }
  }
  return synthOHLC(pair, tfMs, 80);
}

function decide(bars){
  const closes = bars.map(b=>b.c);
  const e5 = ema(closes.slice(-12),5);
  const e13 = ema(closes.slice(-24),13);
  const e34 = ema(closes.slice(-48),21);
  const r = rsi(closes,8);
  const atrv = atr(bars,7);

  let scoreBuy=0, scoreSell=0, reasons=[];

  // Trend alignment
  if(e5>e13 && e13>e34){ scoreBuy+=2; reasons.push('Uptrend (EMA stack)'); }
  if(e5<e13 && e13<e34){ scoreSell+=2; reasons.push('Downtrend (EMA stack)'); }

  // Momentum (RSI band)
  if(r>=58){ scoreBuy++; reasons.push('RSI>58'); }
  if(r<=42){ scoreSell++; reasons.push('RSI<42'); }

  // Candle confirmation
  const cur = bars[bars.length-1];
  if(cur.c>cur.o){ scoreBuy++; reasons.push('Bull candle'); } else { scoreSell++; reasons.push('Bear candle'); }

  // Volatility filter (avoid tiny ATR)
  const rel = Math.abs(e5-e13);
  if(rel < atrv*0.1) return {dir:'wait', reason:'Low trend strength'};

  // Decision
  if(scoreBuy>=3 && scoreBuy>scoreSell) return {dir:'buy', reason:reasons.join(' • ')};
  if(scoreSell>=3 && scoreSell>scoreBuy) return {dir:'sell', reason:reasons.join(' • ')};
  return {dir:'wait', reason:'No confluence'};
}

function paint(dir, reason){
  card.className = 'signal ' + (dir==='buy' ? 'buy' : dir==='sell' ? 'sell' : 'wait');
  txt.textContent = dir==='buy' ? 'BUY ↑' : dir==='sell' ? 'SELL ↓' : 'WAIT';
  rs.textContent = reason || '';
}

getBtn.addEventListener('click', async ()=>{
  const pair = pairEl.value || 'EUR/USD';
  const tf = parseInt(tfEl.value,10) || 5000;
  const bars = await getCandles(pair, tf);
  const sig = decide(bars);
  paint(sig.dir, sig.reason);
});
