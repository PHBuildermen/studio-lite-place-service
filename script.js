let currentTab = 0;
let isRunning = false;
let timeoutIds = [];

const tabs = document.querySelectorAll('.tab-button');
const contents = document.querySelectorAll('.tab-content');

function switchTab(tabIndex) {
    currentTab = tabIndex;
    
    tabs.forEach((tab, index) => {
        if (index === tabIndex) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    contents.forEach((content, index) => {
        content.classList.toggle('hidden', index !== tabIndex);
    });
}

function addLog(message, type = 'info') {
    const container = document.getElementById('log-container');
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    
    let color = 'text-zinc-300';
    if (type === 'success') color = 'text-emerald-400';
    if (type === 'error') color = 'text-red-400';
    if (type === 'warning') color = 'text-amber-400';
    
    const entry = document.createElement('div');
    entry.className = `log-entry flex gap-3 ${color}`;
    entry.innerHTML = `
        <span class="text-zinc-500 shrink-0 w-20">[${timestamp}]</span>
        <span>${message}</span>
    `;
    
    container.appendChild(entry);
    container.scrollTop = container.scrollHeight;
}

function clearLog() {
    document.getElementById('log-container').innerHTML = '';
    addLog('Log cleared', 'info');
}

function updatePreview() {
    document.getElementById('preview-name').textContent = 
        document.getElementById('place-name').value || 'Untitled Place';
    
    document.getElementById('preview-id').textContent = 
        document.getElementById('template-id').value || '—';
    
    document.getElementById('preview-count').textContent = 
        document.getElementById('num-create').value || '1';
    
    const modeSelect = document.getElementById('output-mode');
    const modeText = modeSelect.options[modeSelect.selectedIndex].text;
    document.getElementById('preview-mode').textContent = modeText;
}

async function startGeneration() {
    if (isRunning) return;
    
    const placeName = document.getElementById('place-name').value.trim();
    const numCreate = parseInt(document.getElementById('num-create').value);
    const delay = parseFloat(document.getElementById('delay').value);
    
    if (!placeName) {
        alert("Please enter a place name.");
        return;
    }
    if (isNaN(numCreate) || numCreate < 1) {
        alert("Number to create must be at least 1.");
        return;
    }
    if (isNaN(delay) || delay < 0.1) {
        alert("Delay must be at least 0.1 seconds.");
        return;
    }
    
    isRunning = true;
    document.getElementById('start-btn').classList.add('hidden');
    document.getElementById('stop-btn').classList.remove('hidden');

    const statusEl = document.getElementById('status');
    statusEl.innerHTML = `
        <div class="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
        RUNNING
    `;
    statusEl.classList.remove('border-emerald-500/30', 'text-emerald-400');
    statusEl.classList.add('border-amber-400/50', 'text-amber-400');
    
    addLog('🚀 Generation started', 'success');
    addLog(`Creating ${numCreate} place(s): ${placeName}`);
    
    const mode = document.getElementById('output-mode').value;
    let modeDesc = 'Normal Baseplate';
    if (mode === 'empty') modeDesc = 'Empty Template';
    if (mode === 'spawn') modeDesc = 'Baseplate + SpawnLocation';
    
    addLog(`Mode: ${modeDesc}`);

    for (let i = 1; i <= numCreate; i++) {
        if (!isRunning) break;
        
        addLog(`Generating place ${i} of ${numCreate}...`);
        
        await new Promise(resolve => {
            const id = setTimeout(resolve, delay * 1000);
            timeoutIds.push(id);
        });
        
        if (!isRunning) break;
        
        addLog(`✅ Place ${i} ready`, 'success');
    }
    
    if (isRunning) {
        finishGeneration(true);
    }
}

function stopGeneration() {
    if (!isRunning) return;
    
    isRunning = false;
    
    timeoutIds.forEach(id => clearTimeout(id));
    timeoutIds = [];
    
    addLog('⛔ Process stopped by user', 'warning');
    finishGeneration(false);
}

function finishGeneration(completed) {
    isRunning = false;
    
    const statusEl = document.getElementById('status');
    
    if (completed) {
        addLog('🎉 All places generated successfully!', 'success');
        statusEl.innerHTML = `
            <div class="w-3 h-3 bg-emerald-400 rounded-full"></div>
            COMPLETED
        `;
        statusEl.classList.remove('border-amber-400/50', 'text-amber-400');
        statusEl.classList.add('border-emerald-500/30', 'text-emerald-400');
    } else {
        statusEl.innerHTML = `
            <div class="w-3 h-3 bg-red-400 rounded-full"></div>
            STOPPED
        `;
        statusEl.classList.remove('border-amber-400/50', 'text-amber-400');
        statusEl.classList.add('border-red-400/30', 'text-red-400');
    }
    
   
    document.getElementById('start-btn').classList.remove('hidden');
    document.getElementById('stop-btn').classList.add('hidden');
}

function init() {
    
    
    
    tabs[0].classList.add('active');
    
    
    const inputs = ['place-name', 'template-id', 'num-create', 'output-mode'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        el.addEventListener('input', updatePreview);
        el.addEventListener('change', updatePreview);
    });
    
   
    setTimeout(() => {
        addLog('Studio Lite Place Service initialized');
        addLog('Template loaded: Baseplate + Lighting', 'success');
    }, 600);
    
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && currentTab === 0 && !isRunning) {
            startGeneration();
        }
    });
    
    updatePreview();
}

window.onload = init;
