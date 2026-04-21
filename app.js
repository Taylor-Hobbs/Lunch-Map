const map = L.map('map').setView([-37.814,144.96332],14);
L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  {
    attribution: '© OpenStreetMap © CARTO',
    subdomains: 'abcd',
    maxZoom: 20
  }
).addTo(map);


const list = document.getElementById('leaderboard');
const slider = document.getElementById('scoreFilter');
const sliderValue = document.getElementById('scoreValue');
``

let points=[]; let markers=[];

function color(s){return s>=3.8?'#22c55e':s>=3.4?'#f59e0b':'#ef4444';}

function render(){
  markers.forEach(m=>m.remove()); markers=[]; list.innerHTML='';
  const min=Number(slider.value); sliderValue.textContent=min.toFixed(1);
  points.filter(p=>p.scaled_score>=min).sort((a,b)=>b.scaled_score-a.scaled_score)
  .forEach(p=>{
    const m=L.circleMarker([p.lat, p.lng], {
  radius: 7,
  fillColor: '#2563eb',
  fillOpacity: 0.85,
  color: '#2563eb',
  weight: 6,
  opacity: 0.25
}).addTo(map);
    m.bindPopup(`<strong>${p.name}</strong><br/>${p.cuisine}<br/>Score: ${p.scaled_score.toFixed(2)}`);
    markers.push(m);
    const li=document.createElement('li'); li.textContent=`${p.name} (${p.scaled_score.toFixed(2)})`;
    list.appendChild(li);
  });
}

fetch('data/lunch_spots_enriched.geojson').then(r=>r.json()).then(g=>{
  points=g.features.map(f=>({name:f.properties.name,cuisine:f.properties.cuisine,scaled_score:+f.properties.scaled_score,lat:f.geometry.coordinates[1],lng:f.geometry.coordinates[0]}));
  render();
});
slider.addEventListener('input',render);

