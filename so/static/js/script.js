// Estrutura central para armazenar todos os dados antes de enviar ao Django
let simulationData = {
    geral: {
        numProcessos: 0,
        quantum: 0,
        tempoSimulacao: 0
    },
    processos: [] // Array que guardará os objetos de cada processo
};

let currentProcessIndex = 1;

// Função genérica para navegar entre as telas
function goToScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Valida a tela geral e prepara a tela de processos
function startProcessConfig() {
    const num = parseInt(document.getElementById('num-processes').value);
    const quantum = parseInt(document.getElementById('quantum').value);
    const simTime = parseInt(document.getElementById('sim-time').value);

    // Validação básica
    if (!num || !quantum || !simTime || num <= 0 || quantum <= 0 || simTime <= 0) {
        alert("Por favor, preencha todos os campos gerais com valores maiores que zero.");
        return;
    }

    // Salva no estado
    simulationData.geral.numProcessos = num;
    simulationData.geral.quantum = quantum;
    simulationData.geral.tempoSimulacao = simTime;
    
    // Reseta array e índice caso o usuário tenha ido e voltado
    simulationData.processos = [];
    currentProcessIndex = 1;

    updateProcessUI();
    goToScreen('screen-process');
}

// Atualiza os textos e botões da tela de processo atual
function updateProcessUI() {
    document.getElementById('process-title').innerText = `Processo ${currentProcessIndex} de ${simulationData.geral.numProcessos}`;
    
    // Limpa os campos para o próximo processo
    document.getElementById('cpu-time').value = '';
    document.getElementById('io-time').value = '';
    document.getElementById('rounds').value = '';

    // Se for o último processo, muda o botão para "Finalizar"
    const btnNext = document.getElementById('btn-next-process');
    if (currentProcessIndex === simulationData.geral.numProcessos) {
        btnNext.innerText = "Finalizar e Enviar";
        btnNext.classList.replace('primary', 'primary'); // Mantém a cor, mas você poderia criar uma classe .success
    } else {
        btnNext.innerText = "Próximo Processo";
    }

    // Gerencia o botão Voltar
    const btnBack = document.getElementById('btn-back-process');
    if (currentProcessIndex === 1) {
        btnBack.onclick = () => goToScreen('screen-general');
    } else {
        btnBack.onclick = previousProcess;
    }
}

// Salva o processo atual e avança ou finaliza
function saveProcessAndNext() {
    const cpu = parseInt(document.getElementById('cpu-time').value);
    const io = parseInt(document.getElementById('io-time').value);
    const rounds = parseInt(document.getElementById('rounds').value);

    if (!cpu || !io || !rounds || cpu <= 0 || io <= 0 || rounds <= 0) {
        alert("Preencha todos os campos do processo com valores válidos.");
        return;
    }

    // Adiciona o processo ao array
    simulationData.processos.push({
        id: currentProcessIndex,
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

// Permite voltar refazendo a lógica (remove o último salvo)
function previousProcess() {
    simulationData.processos.pop(); // Remove o último salvo
    currentProcessIndex--;
    updateProcessUI();
}

// Empacota os dados e envia para a View do Django
function submitDataToDjango() {
    // Transforma o objeto JS em uma string JSON
    const jsonData = JSON.stringify(simulationData);
    
    // Coloca a string dentro do input hidden
    document.getElementById('simulation-data-input').value = jsonData;
    
    // Força o envio do formulário padrão do HTML
    document.getElementById('django-form').submit();
}