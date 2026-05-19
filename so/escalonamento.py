class Processo:
    def __init__(self, pid, tempo_cpu, tempo_io, rodadas, prioridade=0):
        self.id = pid
        
        self.tempo_cpu_base = tempo_cpu
        self.tempo_io_base = tempo_io
        
        self.cpu_restante = tempo_cpu
        self.io_restante = tempo_io
        self.rodadas_restantes = rodadas
        
        self.rodadas_total = rodadas 
        # NOVO: Atributo de prioridade (padrão 0 para não quebrar testes antigos)
        self.prioridade = prioridade 
        
        self.estado = "PRONTO"
        self.tempo_espera = 0
        self.tempo_resposta = -1

def simular_escalonamento(dados, algoritmo="RR"):

    quantum = int(dados['geral'].get('quantum', 0))
    tempo_max = int(dados['geral'].get('tempoSimulacao', 100))
    
    processos = [
        Processo(
            int(p['id']), 
            int(p['tempoCPU']), 
            int(p['tempoIO']), 
            int(p['rodadas']),
            int(p.get('prioridade', 0)) # Busca a prioridade, ou usa 0
        ) 
        for p in dados['processos']
    ]
    
    fila_prontos = processos.copy() 
    fila_io = [] 
    
    cpu_proc = None 
    disco_proc = None 
    
    quantum_atual = 0
    ocupacao_cpu = 0
    tempo_atual = 0
    
    linha_tempo_cpu = []
    linha_tempo_disco = []

    while tempo_atual < tempo_max:
        # LÓGICA DE DISCO (I/O)
        if disco_proc and disco_proc.io_restante == 0:
            disco_proc.rodadas_restantes -= 1
            if disco_proc.rodadas_restantes > 0:
                disco_proc.cpu_restante = disco_proc.tempo_cpu_base
                disco_proc.io_restante = disco_proc.tempo_io_base
                disco_proc.estado = "PRONTO"
                fila_prontos.append(disco_proc)
            else:
                disco_proc.estado = "CONCLUIDO"
            disco_proc = None

        # LÓGICA DE PREEMPÇÃO (SAÍDA DA CPU)
        if cpu_proc:
            if cpu_proc.cpu_restante == 0:
                cpu_proc.estado = "ESPERA_IO"
                fila_io.append(cpu_proc)
                cpu_proc = None
                quantum_atual = 0
            # Preempção ocorre apenas no Round Robin
            elif algoritmo == "RR" and quantum_atual >= quantum:
                cpu_proc.estado = "PRONTO"
                fila_prontos.append(cpu_proc)
                cpu_proc = None
                quantum_atual = 0

        # SELEÇÃO DE PROCESSOS PARA DISCO E CPU
        if not disco_proc and fila_io:
            disco_proc = fila_io.pop(0) # Disco geralmente segue FCFS
            
        if not cpu_proc and fila_prontos:
            # É AQUI QUE OS ALGORITMOS SE DIFERENCIAM!
            if algoritmo == "SJF":
                # Ordena pelo menor tempo de CPU base (Menor Job Primeiro)
                fila_prontos.sort(key=lambda p: p.tempo_cpu_base)
            elif algoritmo == "PRIORIDADE":
                # Ordena pela prioridade (assumindo que números menores = maior prioridade)
                fila_prontos.sort(key=lambda p: p.prioridade)
            # Para FCFS e RR, não precisamos ordenar, basta pegar o primeiro da fila (pop(0))

            cpu_proc = fila_prontos.pop(0)
            quantum_atual = 0
            
            if cpu_proc.tempo_resposta == -1:
                cpu_proc.tempo_resposta = tempo_atual

        # REGISTRO NA LINHA DO TEMPO
        linha_tempo_cpu.append(cpu_proc.id if cpu_proc else "Ocioso")
        linha_tempo_disco.append(disco_proc.id if disco_proc else "Ocioso")

        # DECREMENTO DE TEMPOS
        if cpu_proc:
            cpu_proc.cpu_restante -= 1
            quantum_atual += 1
            ocupacao_cpu += 1
            
        if disco_proc:
            disco_proc.io_restante -= 1

        for p in fila_prontos:
            p.tempo_espera += 1

        tempo_atual += 1

        if all(p.estado == "CONCLUIDO" for p in processos):
            break

    # MÉTRICAS FINAIS
    processos_finalizados = sum(1 for p in processos if p.estado == "CONCLUIDO")
    tempo_medio_espera = sum(p.tempo_espera for p in processos) / len(processos) if processos else 0
    uso_cpu_perc = (ocupacao_cpu / tempo_atual) * 100 if tempo_atual > 0 else 0

    return {
        "linha_tempo_cpu": linha_tempo_cpu,
        "linha_tempo_disco": linha_tempo_disco,
        "uso_cpu_percentual": round(uso_cpu_perc, 2),
        "processos_finalizados": processos_finalizados,
        "tempo_medio_espera": round(tempo_medio_espera, 2),
        "tempo_total_decorrido": tempo_atual,
        "config_inicial": {
            "algoritmo": algoritmo,
            "quantum": quantum if algoritmo == "RR" else "-",
            "processos": [
                {
                    "id": p.id,
                    "cpu": p.tempo_cpu_base,
                    "disco": p.tempo_io_base,
                    "rodadas": p.rodadas_total,
                    "prioridade": p.prioridade
                } for p in processos
            ]
        },
        "detalhes_processos": [
            {
                "id": p.id,
                "espera": p.tempo_espera,
                "resposta": p.tempo_resposta if p.tempo_resposta != -1 else 0,
                "concluido": p.estado == "CONCLUIDO"
            } for p in processos
        ]
    }