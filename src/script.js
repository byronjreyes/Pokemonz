// Configuration
const API = 'https://pokeapi.co/api/v2/pokemon';
const LIMIT = 20;
const TOTAL = 1302;
const PAGES = Math.ceil(TOTAL / LIMIT);

let page = 1;

// DOM
const list = document.getElementById('pokemonList');
const detail = document.getElementById('detailSection');
const prev = document.getElementById('prevBtn');
const next = document.getElementById('nextBtn');
const num = document.getElementById('pageNumber');
const btns = document.getElementById('pageButtons');

// pokemon app list
async function pokermone() {
    list.innerHTML = '<div class="loading">Loading Pokémon...</div>';
    const offset = (page - 1) * LIMIT;
    
    try {
        const res = await fetch(`${API}?limit=${LIMIT}&offset=${offset}`);
        const data = await res.json();
        
        list.innerHTML = '';
        data.results.forEach(p => {
            const li = document.createElement('li');
            li.className = 'pokemon-item';
            li.innerHTML = `
                <span class="pokemon-name">${p.name}</span>
                <button class="btn-details">View Details</button>
            `;
            li.querySelector('button').onclick = () => loadpokemondetails(p.name);
            list.appendChild(li);
        });
        
        updatePagination();
    } catch (e) {
        list.innerHTML = '<div class="loading">Error loading</div>';
    }
}

// Load pokemon
async function loadpokemondetails(name) {
    detail.innerHTML = '<div class="loading">Loading...</div>';
    
    try {
        const res = await fetch(`${API}/${name}`);
        const p = await res.json();
        const types = p.types.map(t => t.type.name).join(', ');
        const img = p.sprites.front_default || 
                   `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`;
        
detail.innerHTML = `
             <div class="detail-header">
            <h2>${p.name}</h2>
          </div>

            <img src="${img}" alt="${p.name}" class="pokemon-sprite"
                 onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png'">
            <div class="detail-info">
                <div class="info-row">
                    <span class="label">ID:</span>
                    <span class="value">${p.id}</span>
                </div>
                <div class="info-row">
                    <span class="label">Name:</span>
                    <span class="value">${p.name}</span>
                </div>
                <div class="info-row">
                    <span class="label">Weight:</span>
                    <span class="value">${p.weight / 10} kg</span>
                </div>
                <div class="info-row">
                    <span class="label">Height:</span>
                    <span class="value">${p.height / 10} m</span>
                </div>
                <div class="info-row">
                    <span class="label">Types:</span>
                    <span class="value">${types}</span>
                </div>
            </div>
        `;
    } catch (e) {
        detail.innerHTML = '<div class="loading">Error loading</div>';
    }
}

// Generate pages
function getPages() {
    const pages = [1];
    
    if (PAGES <= 7) {
        for (let i = 2; i <= PAGES; i++) pages.push(i);
        return pages;
    }
    
    let start = Math.max(2, page - 1);
    let end = Math.min(PAGES - 1, page + 1);
    
    if (page <= 3) end = 5;
    if (page >= PAGES - 2) start = PAGES - 4;
    
    if (start > 2) pages.push('...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < PAGES - 1) pages.push('...');
    if (PAGES > 1) pages.push(PAGES);
    
    return pages;
}

// Update pagination
function updatePagination() {
    prev.disabled = page === 1;
    next.disabled = page === PAGES;
    num.textContent = page;
    
    btns.innerHTML = '';
    getPages().forEach(p => {
        if (p === '...') {
            const span = document.createElement('span');
            span.textContent = '...';
            span.style.cssText = 'padding:10px 8px;color:#666';
            btns.appendChild(span);
        } else {
            const btn = document.createElement('button');
            btn.className = 'page-btn' + (p === page ? ' active' : '');
            btn.textContent = p;
            btn.onclick = () => goTo(p);
            btns.appendChild(btn);
        }
    });
}
// Navigate
function goTo(n) {
    page = n;
    pokermone();
    detail.innerHTML = '<div class="placeholder"><p>Select a Pokemon</p></div>';
    window.scrollTo(0, 0);
}
// Events
prev.onclick = () => page > 1 && goTo(page - 1);
next.onclick = () => page < PAGES && goTo(page + 1);
// Init
pokermone();
