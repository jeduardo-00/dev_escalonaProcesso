from django.shortcuts import render, redirect
from django.urls import reverse
import json
from .escalonamento import simular_round_robin # Importe o arquivo aqui

def home(request):
    if request.method == 'POST':
        dadosStr = request.POST.get('simulation_data')
        dados = json.loads(dadosStr)
        
        # 1. Executamos a simulação com os dados recebidos
        resultados_calculados = simular_round_robin(dados)
        
        # 2. Passamos os RESULTADOS (convertidos em string JSON para o JS ler)
        contexto = {
            'resultados_json': json.dumps(resultados_calculados)
        }
        return render(request, 'resultado.html', contexto)

    return render(request, 'telaPrincipal.html')
