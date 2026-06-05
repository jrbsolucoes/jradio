# JRB Web Radio 📻

Este projeto é uma aplicação web (PWA - Progressive Web App) para transmissão e reprodução de rádio online. Por ser um PWA e utilizar um Service Worker (`sw.js`), ele requer um servidor local (HTTP) para funcionar corretamente durante os testes no navegador (requisito de segurança dos navegadores para Service Workers).

---

## 🚀 Como subir um Servidor de Teste Rápido

Aqui estão as formas mais fáceis e rápidas de iniciar um servidor local na pasta do projeto:

### Opção 1: Usando Python (Geralmente já instalado no sistema)
Se você tem o Python instalado, execute o comando abaixo no terminal da pasta do projeto:

**Python 3.x:**
```bash
python -m http.server 8000
```

*   **Acesse no navegador:** [http://localhost:8000](http://localhost:8000)

---

### Opção 2: Usando Node.js (npx)
Se você tem o Node.js instalado, pode subir um servidor sem precisar instalar nada permanentemente usando o `npx`:

```bash
npx serve
```
ou se quiser rodar na porta 8000:
```bash
npx serve -l 8000
```

*   **Acesse no navegador:** [http://localhost:8000](http://localhost:8000) ou a porta indicada no terminal.

---

### Opção 3: Usando PHP
Se você tem o PHP instalado e configurado no seu PATH:

```bash
php -S localhost:8000
```

*   **Acesse no navegador:** [http://localhost:8000](http://localhost:8000)

---

### Opção 4: VS Code (Extension Live Server)
Se estiver utilizando o VS Code, você pode:
1. Instalar a extensão **Live Server** (por Ritwick Dey).
2. Abrir o arquivo `index.html`.
3. Clicar no botão **"Go Live"** na barra de status inferior do VS Code.

---

## Git Cheat Sheet (Guia de Comandos Git)

Abaixo estão os comandos essenciais para versionar este projeto.

### 1. Iniciar ou Clonar
*   **Iniciar um repositório Git local na pasta atual:**
    ```bash
    git init
    ```
*   **Clonar um repositório existente:**
    ```bash
    git clone <URL_DO_REPOSITORIO>
    ```

### 2. Fluxo Diário de Trabalho
*   **Verificar o estado atual dos arquivos (alterados, novos, deletados):**
    ```bash
    git status
    ```
*   **Adicionar um arquivo específico para a área de preparação (staging):**
    ```bash
    git add index.html
    ```
*   **Adicionar todos os arquivos alterados e novos:**
    ```bash
    git add .
    ```
*   **Criar um commit (salvar as alterações localmente com uma mensagem descritiva):**
    ```bash
    git commit -m "Minha mensagem explicativa sobre a alteração"
    ```

### 3. Enviar e Receber Atualizações
*   **Vincular o repositório local a um repositório remoto (ex: GitHub) - feito apenas uma vez:**
    ```bash
    git remote add origin <URL_DO_REPOSITORIO>
    ```
*   **Enviar os commits locais para o repositório remoto (primeira vez na branch main):**
    ```bash
    git push -u origin main
    ```
*   **Enviar alterações posteriores:**
    ```bash
    git push
    ```
*   **Atualizar seu repositório local com as alterações do servidor remoto:**
    ```bash
    git pull
    ```

### 4. Gerenciamento de Branches (Ramificações)
*   **Listar todas as branches locais:**
    ```bash
    git branch
    ```
*   **Criar uma nova branch (ex: para testar uma nova funcionalidade):**
    ```bash
    git checkout -b minha-nova-funcionalidade
    ```
*   **Mudar para uma branch existente:**
    ```bash
    git checkout main
    ```
*   **Mesclar alterações de outra branch para a branch atual:**
    ```bash
    git merge minha-nova-funcionalidade
    ```

### 5. Desfazendo Alterações
*   **Descartar alterações locais não salvas em um arquivo:**
    ```bash
    git checkout -- index.html
    ```
*   **Desfazer o último commit mantendo as alterações nos arquivos (soft reset):**
    ```bash
    git reset --soft HEAD~1
    ```
*   **Descartar o último commit e TODAS as alterações nos arquivos (Cuidado! Apaga o trabalho não salvo):**
    ```bash
    git reset --hard HEAD~1
    ```
