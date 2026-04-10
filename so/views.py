from django.shortcuts import render
import json

def home(request):
    if request.method == 'POST':
        dadosStr = request.POST.get('simulation_data')
        dados = json.loads(dadosStr)
        print(dados)    
    return render(request, 'telaPrincipal.html')
