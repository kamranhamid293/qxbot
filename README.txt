
UTRADI TRADER — PRO (Deploy-ready)
==================================

What you get
------------
- Stylish single-signal interface (BUY/SELL/WAIT with neon card)
- Currency pair filter + timeframe (5s, 30s, 1m)
- GET SIGNAL button only (no auto-run)
- Confluence engine (EMA(5/13/21), RSI(8), candle + ATR filter)
- Serverless API at /api/candles with SAFE fallback (synthetic candles)
- Plug-and-play: Deploy to Vercel by uploading this ZIP

How to deploy (Vercel)
----------------------
1) Go to vercel.com → New Project → **Upload** → select this ZIP → Deploy.
2) Open the live URL.
3) Choose a pair + timeframe → click **GET SIGNAL** → signal box updates.

Live candles (optional, later)
------------------------------
This ZIP returns synthetic candles by default so it always works.
For real-time Quotex candles, replace /api/candles.js with your adapter, or call
an external candles API. Keep the returned format as an array of objects:
[{t:ms, o:..., h:..., l:..., c:...}, ...]

Risk note
---------
Backtest first on a demo account. Short TF (5s) requires very low latency; start
conservative to reduce false signals.
