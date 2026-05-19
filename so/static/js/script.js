// Estrutura atualizada para suportar o algoritmo
let simulationData = {
    geral: {
        algoritmo: "RR", // NOVO
        numProcessos: 0,
        quantum: 0,
        tempoSimulacao: 0
    },
    processos: []
};

let currentProcessIndex = 1;

function goToScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// NOVO: Controla a exibição dinâmica dos campos com base no algoritmo
function toggleFields() {
    const alg = document.getElementById('algorithm').value;
    document.getElementById('quantum-group').style.display = (alg === 'RR') ? 'block' : 'none';
}

function startProcessConfig() {
    const alg = document.getElementById('algorithm').value;
    const num = parseInt(document.getElementById('num-processes').value);
    const simTime = parseInt(document.getElementById('sim-time').value);
    
    // Valida o Quantum apenas se for Round Robin
    let quantum = 0;
    if (alg === 'RR') {
        quantum = parseInt(document.getElementById('quantum').value);
        if (!quantum || quantum <= 0) {
            alert("Por favor, preencha o Quantum com um valor válido.");
            return;
        }
    }

    if (!num || !simTime || num <= 0 || simTime <= 0) {
        alert("Por favor, preencha todos os campos gerais com valores válidos.");
        return;
    }

    // Salva no estado
    simulationData.geral.algoritmo = alg;
    simulationData.geral.numProcessos = num;
    simulationData.geral.quantum = alg === 'RR' ? quantum : 0;
    simulationData.geral.tempoSimulacao = simTime;
    
    simulationData.processos = [];
    currentProcessIndex = 1;

    updateProcessUI();
    goToScreen('screen-process');
}

function updateProcessUI() {
    document.getElementById('process-title').innerText = `Processo ${currentProcessIndex} de ${simulationData.geral.numProcessos}`;
    
    // NOVO: Mostra o campo de Prioridade apenas se o algoritmo for PRIORIDADE
    document.getElementById('priority-group').style.display = (simulationData.geral.algoritmo === 'PRIORIDADE') ? 'block' : 'none';
    
    document.getElementById('priority').value = '';
    document.getElementById('cpu-time').value = '';
    document.getElementById('io-time').value = '';
    document.getElementById('rounds').value = '';

    const btnNext = document.getElementById('btn-next-process');
    if (currentProcessIndex === simulationData.geral.numProcessos) {
        btnNext.innerText = "Finalizar e Enviar";
    } else {
        btnNext.innerText = "Próximo Processo";
    }

    const btnBack = document.getElementById('btn-back-process');
    if (currentProcessIndex === 1) {
        btnBack.onclick = () => goToScreen('screen-general');
    } else {
        btnBack.onclick = previousProcess;
    }
}

function saveProcessAndNext() {
    const cpu = parseInt(document.getElementById('cpu-time').value);
    const io = parseInt(document.getElementById('io-time').value);
    const rounds = parseInt(document.getElementById('rounds').value);
    
    // Valida a Prioridade apenas se for o algoritmo de PRIORIDADE
    let prio = 0;
    if (simulationData.geral.algoritmo === 'PRIORIDADE') {
        prio = parseInt(document.getElementById('priority').value);
        if (isNaN(prio) || prio < 0) {
            alert("Preencha a Prioridade com um valor válido (>= 0).");
            return;
        }
    }

    if (!cpu || !io || !rounds || cpu <= 0 || io <= 0 || rounds <= 0) {
        alert("Preencha todos os campos do processo com valores válidos.");
        return;
    }

    simulationData.processos.push({
        id: currentProcessIndex,
        prioridade: prio, // NOVO
        tempoCPU: cpu,
        tempoIO: io,
        rodadas: rounds
    });

    if (currentProcessIndex < simulationData.geral.numProcessos) {
        currentProcessIndex++;
        updateProcessUI();
    } else {
        submitDataToDjango();
    }
}

function previousProcess() {
    simulationData.processos.pop(); 
    currentProcessIndex--;
    updateProcessUI();
}

function submitDataToDjango() {
    const jsonData = JSON.stringify(simulationData);
    document.getElementById('simulation-data-input').value = jsonData;
    document.getElementById('django-form').submit();
}