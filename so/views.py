from django.shortcuts import render
from django.http import HttpResponse

def painel(request):
    return HttpResponse('PAINEL DO SO')
