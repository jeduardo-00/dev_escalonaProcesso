from time import sleep

dados = {
    'geral': {'numProcessos': 1, 'quantum': 1, 'tempoSimulacao': 10}, 
    'processos': [{'id': 1, 'tempoCPU': 1, 'tempoIO': 1, 'rodadas': 1}]
    }

geral = dados.get('geral')
processos = dados.get('processos')


# Simulador geral
temp = 0
while  temp < geral['tempoSimulacao']:
    print(temp)
    sleep(1)
    temp+=1
