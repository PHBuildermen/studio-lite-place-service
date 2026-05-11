let isRunning = false;
let timeouts = [];

function switchTab(n) {
    document.querySelectorAll('.tab-content').forEach((el, i) => {
        el.classList.toggle('hidden', i !== n);
    });
    document.querySelectorAll('.tab-button').forEach((el, i) => {
        el.classList.toggle('active', i === n);
    });
}

function addLog(msg, type = 'info') {
    const container = document.getElementById('log-container');
    const time = new Date().toLocaleTimeString();
    let color = type === 'success' ? 'text-emerald-400' : type === 'error' ? 'text-red-400' : 'text-zinc-300';
    
    const div = document.createElement('div');
    div.className = `log-entry ${color}`;
    div.innerHTML = `<span class="text-zinc-500">[${time}]</span> ${msg}`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function clearLog() {
    document.getElementById('log-container').innerHTML = '';
}

function updatePreview() {
    document.getElementById('preview-name').textContent = document.getElementById('place-name').value || "Untitled";
    document.getElementById('preview-id').textContent = document.getElementById('template-id').value;
    document.getElementById('preview-count').textContent = document.getElementById('num-create').value;
    document.getElementById('preview-mode').textContent = document.getElementById('output-mode').options[document.getElementById('output-mode').selectedIndex].text;
}

async function startGeneration() {
    if (isRunning) return;
    
    const name = document.getElementById('place-name').value.trim();
    const count = parseInt(document.getElementById('num-create').value);
    const delay = parseFloat(document.getElementById('delay').value);

    if (!name) return alert("Place name is required!");
    if (!count || count < 1) return alert("Number must be at least 1");

    isRunning = true;
    document.getElementById('start-btn').classList.add('hidden');
    document.getElementById('stop-btn').classList.remove('hidden');

    addLog("🚀 Generation started", "success");
    
    for (let i = 1; i <= count; i++) {
        if (!isRunning) break;
        addLog(`Creating place ${i} of ${count}...`);
        await new Promise(r => {
            const t = setTimeout(r, delay * 1000);
            timeouts.push(t);
        });
        if (isRunning) addLog(`✅ Place ${i} completed`, "success");
    }
    
    if (isRunning) {
        addLog("🎉 All places generated successfully!", "success");
    }
    stopGeneration(true);
}

function stopGeneration(completed = false) {
    isRunning = false;
    timeouts.forEach(t => clearTimeout(t));
    timeouts = [];
    
    document.getElementById('start-btn').classList.remove('hidden');
    document.getElementById('stop-btn').classList.add('hidden');
}

function init() {
    updatePreview();
    document.querySelectorAll('input, select').forEach(el => el.addEventListener('input', updatePreview));
    addLog("Studio Lite Place Service initialized");
    addLog("Template loaded successfully", "success");
}

window.onload = init;
