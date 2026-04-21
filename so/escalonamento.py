class Processo:
    def __init__(self, pid, tempo_cpu, tempo_io, rodadas):
        self.id = pid
        
        self.tempo_cpu_base = tempo_cpu
        self.tempo_io_base = tempo_io
        
        self.cpu_restante = tempo_cpu
        self.io_restante = tempo_io
        self.rodadas_restantes = rodadas
        
        # NOVO: Guarda o total de rodadas para exibir na tabela inicial
        self.rodadas_total = rodadas 
        
        self.estado = "PRONTO"
        self.tempo_espera = 0
        self.tempo_resposta = -1

def simular_round_robin(dados):
    quantum = int(dados['geral']['quantum'])
    tempo_max = int(dados['geral']['tempoSimulacao'])
    
    processos = [
        Processo(int(p['id']), int(p['tempoCPU']), int(p['tempoIO']), int(p['rodadas'])) 
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

        if cpu_proc:
            if cpu_proc.cpu_restante == 0:
                cpu_proc.estado = "ESPERA_IO"
                fila_io.append(cpu_proc)
                cpu_proc = None
                quantum_atual = 0
            elif quantum_atual >= quantum:
                cpu_proc.estado = "PRONTO"
                fila_prontos.append(cpu_proc)
                cpu_proc = None
                quantum_atual = 0

        if not disco_proc and fila_io:
            disco_proc = fila_io.pop(0)
            
        if not cpu_proc and fila_prontos:
            cpu_proc = fila_prontos.pop(0)
            quantum_atual = 0
            if cpu_proc.tempo_resposta == -1:
                cpu_proc.tempo_resposta = tempo_atual

        linha_tempo_cpu.append(cpu_proc.id if cpu_proc else "Ocioso")
        linha_tempo_disco.append(disco_proc.id if disco_proc else "Ocioso")

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
        # NOVO: Devolvemos os dados de entrada para desenhar a tabela igual à da foto
        "config_inicial": {
            "quantum": quantum,
            "processos": [
                {
                    "id": p.id,
                    "cpu": p.tempo_cpu_base,
                    "disco": p.tempo_io_base,
                    "rodadas": p.rodadas_total
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