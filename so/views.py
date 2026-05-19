from django.shortcuts import render
import json
from .escalonamento import simular_escalonamento

def home(request):
    if request.method == 'POST':
        dadosStr = request.POST.get('simulation_data')
        dados = json.loads(dadosStr)
        
        algoritmo_escolhido = dados['geral'].get('algoritmo', 'RR')
        
        resultados_calculados = simular_escalonamento(dados, algoritmo_escolhido)
        
        contexto = {
            'resultados_json': json.dumps(resultados_calculados)
        }
        return render(request, 'resultado.html', contexto)

    return render(request, 'telaPrincipal.html')