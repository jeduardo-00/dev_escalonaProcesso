document.addEventListener("DOMContentLoaded", () => {
    const jsonStr = document.getElementById('dados-backend').textContent;
    const dados = JSON.parse(jsonStr);

    let tempoAtual = 0;
    let timerId = null;
    const tempoTotal = dados.tempo_total_decorrido;

    // Configuração de Zoom Dinâmico
    const zoomSlider = document.getElementById('zoom-slider');
    const trackCpu = document.getElementById('track-cpu');
    const trackDisco = document.getElementById('track-disco');

    function aplicarZoom() {
        const escala = parseFloat(zoomSlider.value);
        const novaLargura = Math.max(900, tempoTotal * escala * 30);
        trackCpu.style.minWidth = `${novaLargura}px`;
        trackDisco.style.minWidth = `${novaLargura}px`;
    }

    zoomSlider.addEventListener('input', aplicarZoom);
    document.getElementById('btn-zoom-in').onclick = () => { 
        zoomSlider.value = Math.min(10, parseFloat(zoomSlider.value) + 1); 
        aplicarZoom(); 
    };
    document.getElementById('btn-zoom-out').onclick = () => { 
        zoomSlider.value = Math.max(1, parseFloat(zoomSlider.value) - 1); 
        aplicarZoom(); 
    };

    // Estados da Simulação
    let cpuState = { proc: null, div: null, dur: 0, rodada: 0, textoNode: null };
    let discoState = { proc: null, div: null, dur: 0, rodada: 0, textoNode: null };
    let countRodadasCpu = {}; 
    let countRodadasDisco = {};
    
    let tabelaStatus = {};
    dados.detalhes_processos.forEach(p => tabelaStatus[p.id] = { espera: 0, finalizado: false });

    // Inicialização da Tela
    document.getElementById('max-time-display').textContent = tempoTotal;
    renderConfigTable();
    renderStatusTable();
    atualizarFilasVisualmente(0);
    atualizarExecucaoVisualmente("Ocioso", "Ocioso");
    aplicarZoom();

    // MOTOR DO ALGORITMO
    function tick() {
        if (tempoAtual >= tempoTotal) {
            finalizar();
            return;
        }

        const pCpu = dados.linha_tempo_cpu[tempoAtual];
        const pDisco = dados.linha_tempo_disco[tempoAtual];

        atualizarBarra('track-cpu', pCpu, cpuState, countRodadasCpu);
        atualizarBarra('track-disco', pDisco, discoState, countRodadasDisco);
        
        atualizarMetricas(pCpu, pDisco);
        atualizarFilasVisualmente(tempoAtual);
        atualizarExecucaoVisualmente(pCpu, pDisco); // <-- ATUALIZA QUEM ESTÁ A CORRER

        tempoAtual++;
        document.getElementById('clock-display').textContent = tempoAtual;
    }

    // --- NOVA FUNÇÃO: Atualiza a Caixa de Execução ---
    function atualizarExecucaoVisualmente(pCpu, pDisco) {
        const divCpu = document.getElementById('exec-cpu');
        const divDisco = document.getElementById('exec-disco');

        if (pCpu === "Ocioso") {
            divCpu.className = 'exec-indicator bg-ocioso';
            divCpu.textContent = 'Ocioso';
        } else {
            divCpu.className = `exec-indicator bg-p${pCpu} active-pulse`;
            divCpu.textContent = `P${pCpu}`;
        }

        if (pDisco === "Ocioso") {
            divDisco.className = 'exec-indicator bg-ocioso';
            divDisco.textContent = 'Ocioso';
        } else {
            divDisco.className = `exec-indicator bg-p${pDisco} active-pulse`;
            divDisco.textContent = `P${pDisco}`;
        }
    }

    function atualizarBarra(containerId, procId, state, contador) {
        if (state.proc === procId && state.div) {
            state.dur++;
            state.div.style.width = `${(state.dur / tempoTotal) * 100}%`;
            if (procId !== "Ocioso" && state.textoNode) {
                state.textoNode.textContent = `P${procId} (${state.dur}ut)`;
            }
            return;
        }

        if (state.div && tempoAtual > 0) {
            const flag = document.createElement('div');
            flag.className = 'time-marker';
            const rodadaTxt = state.proc !== "Ocioso" ? ` (R${state.rodada})` : "";
            flag.textContent = `t=${tempoAtual}${rodadaTxt}`;
            state.div.appendChild(flag);
        }

        const container = document.getElementById(containerId);
        const div = document.createElement('div');
        div.className = `time-block bg-${procId === "Ocioso" ? "ocioso" : "p" + procId}`;
        div.style.width = `${(1 / tempoTotal) * 100}%`;

        let txtNode = null;
        if (procId !== "Ocioso") {
            contador[procId] = (contador[procId] || 0) + 1;
            state.rodada = contador[procId];
            
            txtNode = document.createElement('span');
            txtNode.className = 'label-p';
            txtNode.textContent = `P${procId} (1ut)`;
            div.appendChild(txtNode);
        }

        container.appendChild(div);
        
        state.proc = procId; 
        state.div = div; 
        state.dur = 1;
        state.textoNode = txtNode;
    }

    function adicionarMarcadorFinal(state) {
        if (state.div && tempoAtual > 0) {
            const flag = document.createElement('div');
            flag.className = 'time-marker';
            const rodadaTxt = state.proc !== "Ocioso" ? ` (R${state.rodada})` : "";
            flag.textContent = `t=${tempoAtual}${rodadaTxt}`;
            state.div.appendChild(flag);
        }
    }

    function atualizarMetricas(pCpu, pDisco) {
        Object.keys(tabelaStatus).forEach(id => {
            const pid = parseInt(id);
            const p = tabelaStatus[id];
            if (p.finalizado) return;

            const emUso = (pCpu === pid || pDisco === pid);
            const aindaAparece = dados.linha_tempo_cpu.indexOf(pid, tempoAtual) !== -1 || 
                               dados.linha_tempo_disco.indexOf(pid, tempoAtual) !== -1;

            if (!emUso && aindaAparece) p.espera++;
            if (!aindaAparece && !emUso) p.finalizado = true;
        });
        renderStatusTable();
    }

    function atualizarFilasVisualmente(t) {
        const pCpu = dados.linha_tempo_cpu[t];
        const pDisco = dados.linha_tempo_disco[t];
        
        let filaEsperaCpu = [];
        let filaEsperaDisco = [];

        Object.keys(tabelaStatus).forEach(idStr => {
            const id = parseInt(idStr);
            const p = tabelaStatus[id];
            
            if (p.finalizado) return; 

            const estaNaCpu = (pCpu === id);
            const estaNoDisco = (pDisco === id);
            
            let nextCpu = dados.linha_tempo_cpu.indexOf(id, t);
            let nextDisco = dados.linha_tempo_disco.indexOf(id, t);
            
            if (nextCpu === -1) nextCpu = Infinity;
            if (nextDisco === -1) nextDisco = Infinity;

            const aindaAparece = (nextCpu !== Infinity || nextDisco !== Infinity);

            if (!estaNaCpu && !estaNoDisco && aindaAparece) {
                if (nextCpu < nextDisco) filaEsperaCpu.push({id: id, order: nextCpu});
                else filaEsperaDisco.push({id: id, order: nextDisco});
            }
        });

        filaEsperaCpu.sort((a, b) => a.order - b.order);
        filaEsperaDisco.sort((a, b) => a.order - b.order);

        renderizarFilas(filaEsperaCpu.map(i => i.id), filaEsperaDisco.map(i => i.id));
    }

    function renderizarFilas(filaCpuIds, filaDiscoIds) {
        const divCpu = document.getElementById('queue-cpu');
        const divDisco = document.getElementById('queue-disco');

        divCpu.innerHTML = filaCpuIds.length > 0 
            ? filaCpuIds.map(id => `<div class="queue-item bg-p${id}">P${id}</div>`).join('')
            : '<span class="empty-queue">Fila vazia</span>';

        divDisco.innerHTML = filaDiscoIds.length > 0 
            ? filaDiscoIds.map(id => `<div class="queue-item bg-p${id}">P${id}</div>`).join('')
            : '<span class="empty-queue">Fila vazia</span>';
    }

    function renderConfigTable() {
        const tb = document.getElementById('tabela-config');
        dados.config_inicial.processos.forEach(p => {
            tb.innerHTML += `<tr><td><strong>P${p.id}</strong></td><td><div class="color-dot bg-p${p.id}"></div></td>
                             <td>${p.cpu}</td><td>${p.disco}</td><td>${p.rodadas}</td>
                             <td><strong>${dados.config_inicial.quantum}</strong></td></tr>`;
        });
    }

    function renderStatusTable() {
        const tb = document.getElementById('tabela-processos');
        tb.innerHTML = '';
        dados.detalhes_processos.forEach(p => {
            const s = tabelaStatus[p.id];
            tb.innerHTML += `<tr><td><strong>P${p.id}</strong></td><td><div class="color-dot bg-p${p.id}"></div></td>
                             <td>${s.espera} ut</td><td>${s.finalizado ? 'Finalizado: ✅' : 'Finalizado: ❌'}</td></tr>`;
        });
    }

    function finalizar() {
        clearInterval(timerId);
        document.getElementById('btn-play').textContent = "Concluído";
        document.getElementById('btn-play').disabled = true;
        
        adicionarMarcadorFinal(cpuState);
        adicionarMarcadorFinal(discoState);
        
        renderizarFilas([], []);
        atualizarExecucaoVisualmente("Ocioso", "Ocioso");
    }

    // Controles e Botões
    document.getElementById('btn-play').onclick = () => { 
        timerId = setInterval(tick, document.getElementById('speed-select').value); 
        document.getElementById('btn-play').disabled = true; 
        document.getElementById('btn-pause').disabled = false; 
        document.getElementById('speed-select').disabled = true;
    };
    
    document.getElementById('btn-pause').onclick = () => { 
        clearInterval(timerId); 
        document.getElementById('btn-play').disabled = false; 
        document.getElementById('btn-pause').disabled = true; 
        document.getElementById('speed-select').disabled = false;
    };
    
    document.getElementById('btn-restart').onclick = () => {
        clearInterval(timerId);
        
        document.getElementById('track-cpu').innerHTML = '';
        document.getElementById('track-disco').innerHTML = '';
        document.getElementById('clock-display').textContent = '0';
        
        tempoAtual = 0;
        cpuState = { proc: null, div: null, dur: 0, rodada: 0, textoNode: null };
        discoState = { proc: null, div: null, dur: 0, rodada: 0, textoNode: null };
        countRodadasCpu = {}; 
        countRodadasDisco = {};
        
        Object.keys(tabelaStatus).forEach(id => {
            tabelaStatus[id].espera = 0;
            tabelaStatus[id].finalizado = false;
        });
        
        renderStatusTable();
        atualizarFilasVisualmente(0);
        atualizarExecucaoVisualmente("Ocioso", "Ocioso");
        
        document.getElementById('btn-play').textContent = "▶ Iniciar";
        document.getElementById('btn-play').disabled = false;
        document.getElementById('btn-pause').disabled = true;
        document.getElementById('speed-select').disabled = false;
    };
});