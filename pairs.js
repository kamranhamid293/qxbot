
const PAIRS = [
 'EUR/USD','GBP/USD','USD/JPY','USD/CHF','USD/CAD','AUD/USD','NZD/USD',
 'EUR/GBP','EUR/JPY','GBP/JPY','AUD/JPY','CHF/JPY','CAD/JPY','NZD/JPY',
 'EUR/AUD','EUR/CAD','GBP/CHF','AUD/CAD','AUD/CHF','AUD/NZD','NZD/CAD',
 'USD/INR','USD/PKR','USD/BDT','USD/EGP','USD/TRY','USD/MXN','USD/BRL',
 'USD/ZAR','USD/SAR','USD/AED','USD/IDR','USD/THB','USD/SGD','USD/HKD',
 'EUR/INR','GBP/INR','EUR/PKR','GBP/PKR','EUR/BDT','GBP/BDT','EUR/EGP','GBP/EGP'
];

(function init(){
  const select = document.getElementById('pair');
  PAIRS.forEach(p=>{
    const o = document.createElement('option'); o.value=p; o.textContent=p; select.appendChild(o);
  });
  // default selection
  select.value = 'EUR/USD';
})();
