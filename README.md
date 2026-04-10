# Simulador de Escalonamento de Processos

## 1. Informações sobre o projeto

Este projeto consiste em uma aplicação web desenvolvida utilizando **Python** e o framework **Django** para simular o funcionamento do escalonamento de processos em sistemas operacionais.

O objetivo do sistema é permitir que o usuário visualize como processos competem pelo uso da CPU utilizando o algoritmo **Round Robin**, muito utilizado em sistemas operacionais para gerenciar múltiplos processos.

A aplicação permite configurar diversos parâmetros da simulação para observar como ocorre o escalonamento ao longo do tempo.

### Funcionalidades do sistema

O simulador permite configurar:

* Quantidade de processos
* Tempo de uso da CPU para cada processo
* Tempo de uso de disco (E/S)
* Quantidade de rodadas de execução
* Quantum da CPU
* Tempo total da simulação

Após a execução da simulação, o sistema deverá apresentar:

* Linha do tempo da execução dos processos
* Ordem de execução da CPU
* Processos finalizados
* Informações sobre o comportamento da CPU durante a simulação

Este projeto foi desenvolvido como atividade acadêmica para auxiliar no entendimento do funcionamento do escalonamento de processos em sistemas operacionais.

---

# 2. Tecnologias utilizadas

O projeto foi desenvolvido utilizando as seguintes tecnologias:

* Python
* Django
* HTML
* CSS
* JavaScript
* Git
* GitHub

---

# 3. Pré-requisitos

Antes de executar o projeto em sua máquina, é necessário ter instalado:

* Python 3.10 ou superior
* Git

Para verificar se estão instalados, execute no terminal:

```bash
python --version
git --version
```

Se algum deles não estiver instalado, será necessário instalá-los antes de continuar.

---

# 4. Tutorial para clonar o projeto

Caso você ainda **não tenha o projeto na sua máquina**, siga os passos abaixo.

### Passo 1 — Abrir o terminal

Abra o terminal ou prompt de comando.

### Passo 2 — Clonar o repositório

Execute o comando:

```bash
git clone URL_DO_REPOSITORIO
```

Exemplo:

```bash
git clone https://github.com/seu-usuario/nome-do-projeto.git
```

### Passo 3 — Entrar na pasta do projeto

Depois de clonar o projeto, entre na pasta criada:

```bash
cd nome-do-projeto
```

Agora você já possui o projeto na sua máquina.

---

# 5. Tutorial para atualizar o projeto (git pull)

Caso você **já tenha o projeto clonado**, mas deseja baixar as alterações feitas por outros integrantes do grupo, utilize o comando:

```bash
git pull
```

Esse comando irá atualizar seu projeto com as últimas alterações do repositório.

Sempre execute esse comando antes de começar a trabalhar no projeto para evitar conflitos.

---

# 6. Tutorial para criar um ambiente virtual (venv)

O ambiente virtual é utilizado para instalar as bibliotecas do projeto de forma isolada, sem afetar outras bibliotecas instaladas no sistema.

### Passo 1 — Criar o ambiente virtual

Dentro da pasta do projeto execute:

#### Linux ou Mac

```bash
python3 -m venv venv
```

#### Windows

```bash
python -m venv venv
```

Após executar esse comando, será criada uma pasta chamada:

```
venv
```

Essa pasta contém todas as bibliotecas do ambiente virtual.

---

# 7. Tutorial para ativar o ambiente virtual

Depois de criar o ambiente virtual, é necessário ativá-lo.

### Linux ou Mac

```bash
source venv/bin/activate
```

### Windows

```bash
venv\Scripts\activate
```

Após ativar o ambiente virtual, o terminal deverá mostrar algo parecido com:

```
(venv)
```

Isso indica que o ambiente virtual está ativo.

---

# 8. Instalar as bibliotecas do projeto

O projeto possui um arquivo chamado **requirements.txt** que contém todas as bibliotecas utilizadas.

Com o ambiente virtual ativado, execute:

```bash
pip install -r requirements.txt
```

Esse comando irá instalar automaticamente todas as bibliotecas necessárias para executar o projeto.

---

# 9. Rodar as migrações do banco de dados

Antes de executar o projeto pela primeira vez, é necessário rodar as migrações do banco de dados.

Execute:

```bash
python manage.py migrate
```

Isso criará automaticamente o banco de dados necessário para o funcionamento do Django.

---

# 10. Executar o servidor do Django

Depois de instalar todas as bibliotecas e executar as migrações, inicie o servidor com o comando:

```bash
python manage.py runserver
```

Após executar esse comando, o terminal mostrará algo semelhante a:

```
Starting development server at http://127.0.0.1:8000/
```

---

# 11. Acessar o sistema no navegador

Abra o navegador e acesse o endereço:

```
http://127.0.0.1:8000/
```

A aplicação estará rodando localmente em sua máquina.

---

# 12. Ordem recomendada para rodar o projeto

Sempre que for trabalhar no projeto siga estes passos:

### Passo 1

Entrar na pasta do projeto:

```bash
cd nome-do-projeto
```

### Passo 2

Ativar o ambiente virtual:

Windows

```bash
venv\Scripts\activate
```

Linux / Mac

```bash
source venv/bin/activate
```

### Passo 3

Atualizar o projeto:

```bash
git pull
```

### Passo 4

Rodar o servidor:

```bash
python manage.py runserver
```

---

# 13. Atualizando as bibliotecas do projeto

Caso novas bibliotecas sejam instaladas no projeto, é necessário atualizar o arquivo **requirements.txt**.

Execute o comando:

```bash
pip freeze > requirements.txt
```

Esse comando irá registrar todas as bibliotecas instaladas no ambiente virtual.

---

# 14. Estrutura básica do projeto

A estrutura principal do projeto segue o padrão do Django:

```
nome-do-projeto/

manage.py
requirements.txt
README.md

app/

templates/

static/

venv/
```

---

# 15. Observações importantes

Alguns arquivos não são enviados para o repositório por estarem no `.gitignore`, como por exemplo:

* venv
* arquivos temporários
* cache do Python

Por isso cada integrante do grupo precisa criar seu próprio ambiente virtual.

---

# 16. Projeto acadêmico

Este projeto foi desenvolvido como atividade da disciplina de **Sistemas Operacionais**, com o objetivo de simular o funcionamento do escalonamento de processos utilizando o algoritmo **Round Robin**.
