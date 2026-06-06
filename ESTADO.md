# ESTADO.md — JRB Web Radio

Este é um **documento vivo** que descreve o estado atual do projeto, suas funcionalidades, a arquitetura de segurança, rotinas de desenvolvimento e erros comuns detectados que devem ser evitados. 

> [!IMPORTANT]
> **DIRETRIZ DE ATUALIZAÇÃO:**
> A cada nova implementação de funcionalidade, refatoração ou correção de bug, este documento **deve ser atualizado** para refletir as mudanças e listar novos aprendizados/erros a serem evitados.

---

## 1. Descrição do Projeto

O **JRB Web Radio** é um player de rádio web premium com uma interface moderna baseada em *glassmorphic design*, iluminação neon dinâmica (HSL Tailored) e um equalizador visual animado. Ele oferece suporte a múltiplas emissoras de rádio ao vivo com um mecanismo de reconexão resiliente e permite a exibição de comunicados em tempo real (texto, imagens, vídeos ou links do YouTube) sincronizados via Firebase Realtime Database.

---

## 2. Tecnologias Utilizadas

* **Frontend**: HTML5 semântico, CSS3 personalizado (sem frameworks utilitários como Tailwind para controle total de design) e Vanilla Javascript (ES6 Modules).
* **Banco de Dados em Tempo Real**: Firebase Realtime Database (sincronização instantânea de mídias).
* **Autenticação**: Firebase Authentication (provedor do Google).
* **Pipeline de Build**: Script customizado em Node.js (`build.js`) para minificação, remoção de comentários e ofuscação de chaves via Base64.

---

## 3. Funcionalidades Principais

* **Player Resiliente**: Alternância de emissoras (Rádio IPB, Rádio Pinheiros, Rádio Trans Mundial, Rádio Jaraguar FM), controle de volume com slider e mecanismo de reconexão automática com backoff exponencial se o sinal cair.
* **Comunicação ao Vivo**: Exibição dinâmica de mídias enviadas pelo painel admin (textos em cartões translúcidos, imagens/GIFs, vídeos em MP4 ou vídeos incorporados do YouTube).
* **Automação do YouTube no Player**:
  * Busca e exibe o título do vídeo do YouTube em tempo real usando a API oEmbed (`noembed.com`).
  * Executa um contador regressivo na tela (*"A programação retornará em X"*) com fechamento automático da mídia.
  * Silencia/pausa a rádio automaticamente no início do vídeo para evitar sobreposição de áudio e retoma a reprodução da rádio ao fim do tempo programado.
  * Bloqueia os controles do player e cliques de rádio durante a exibição do vídeo.
* **Suporte PWA**: Manifesto e Service Worker configurados para instalação nativa no Android e banner com instruções guiadas para iOS.

---

## 4. Segurança e Painel Administrativo

O painel de controle administrativo (`admin.html`) foi blindado utilizando **Google Sign-In**:
* Apenas contas do Google cadastradas na constante `ALLOWED_EMAILS` em [admin.dev.html](file:///d:/NOVOS_PROJETOS/JRB_Web_Radio/admin.dev.html) podem acessar a interface administrativa.
* O Firebase Realtime Database deve ser configurado com regras restritas para impedir gravações não autorizadas de pessoas fora da whitelist.

---

## 5. Rotina de Desenvolvimento e Build

Os arquivos oficiais de produção são ofuscados e minificados para impedir a leitura direta das chaves de configuração e códigos lógicos na aba *Sources (F12)* do navegador.

### Fluxo de trabalho:
1. **Sempre edite** os arquivos de desenvolvimento na raiz do projeto:
   * [firebase-config.dev.js](file:///d:/NOVOS_PROJETOS/JRB_Web_Radio/firebase-config.dev.js) (Configurações do Firebase e Auth)
   * [admin.dev.html](file:///d:/NOVOS_PROJETOS/JRB_Web_Radio/admin.dev.html) (HTML e Javascript legível do Painel Admin)
2. Após realizar as alterações nos arquivos `.dev`, abra o terminal na pasta raiz e execute o build:
   ```powershell
   node build.js
   ```
3. O script irá ler as origens de desenvolvimento, converter as credenciais em Base64, minificar os blocos de código e atualizar os arquivos oficiais de produção:
   * [firebase-config.js](file:///d:/NOVOS_PROJETOS/JRB_Web_Radio/firebase-config.js)
   * [admin.html](file:///d:/NOVOS_PROJETOS/JRB_Web_Radio/admin.html)

---

## 6. Erros Comuns e Como Evitá-los

Esta seção lista falhas mapeadas durante o desenvolvimento e como preveni-las:

* ### Erro de CORS ao abrir arquivos diretamente (`file:///`)
  * **Sintoma**: A tela fica travada em *"Verificando conexão segura..."* e o console F12 exibe erro de CORS ao importar `firebase-config.js`.
  * **Causa**: Navegadores bloqueiam importação de módulos ES6 em arquivos abertos diretamente do disco.
  * **Solução**: Sempre rode a aplicação através de um servidor local. Use a extensão *Live Server* do VS Code ou rode no terminal:
    ```powershell
    npx http-server -p 3000
    ```

* ### Erro de Permissão na Porta (`EACCES: permission denied 0.0.0.0:8080`)
  * **Sintoma**: O terminal gera erro ao tentar iniciar o servidor local na porta 8080.
  * **Causa**: A porta padrão 8080 já está em uso por outro serviço (Apache, IIS, etc.) ou está reservada pelo sistema.
  * **Solução**: Mude a porta no comando, utilizando a porta 3000 ou 8082:
    ```powershell
    npx http-server -p 3000
    ```

* ### Fechamento Imediato do Popup de Login (Domínio Não Autorizado)
  * **Sintoma**: A janela de login do Google abre e fecha rapidamente, gerando erro de conexão.
  * **Causa**: O endereço usado para acessar a página (ex: `http://127.0.0.1:3000`) não está cadastrado nos "Domínios Autorizados" no Firebase Console.
  * **Solução**: Acesse sempre por `http://localhost:3000/admin.html` (que já é pré-autorizado) ou adicione o IP `127.0.0.1` ou o domínio do GitHub Pages (`jrbsolucoes.github.io`) nas configurações do console do Firebase (*Authentication -> Configurações -> Domínios Autorizados*).

* ### Cadastro Incompleto do Provedor de Login (Sem E-mail de Suporte)
  * **Sintoma**: O popup do Google falha ao conectar gerando erro de autenticação.
  * **Causa**: A opção "Google" foi marcada como ativa no console, mas o formulário com o "E-mail de suporte do projeto" não foi salvo.
  * **Solução**: No console do Firebase, edite o provedor Google, selecione o e-mail de suporte do projeto e clique em **Salvar**.

* ### Sobrescrita de Classes Dinâmicas (Perda do Bloqueio de Controles)
  * **Sintoma**: O vídeo do YouTube é exibido, mas os botões de rádio e a lista continuam clicáveis.
  * **Causa**: A função `setPlaybackState` atualiza o estado e redefine a propriedade `className` inteira do elemento (`playerCard.className = ...`), apagando a classe de bloqueio `.media-active` se ela for adicionada antes da mudança de estado.
  * **Solução**: Chame as mudanças de estado da rádio (`pausePlayback` / `setPlaybackState`) **antes** de adicionar a classe `.media-active` à lista de classes.

---

## 7. Próximos Passos

1. **Hospedagem de Produção**: Realizar o deploy dos arquivos oficiais de produção (`index.html`, `admin.html`, `firebase-config.js`, `sw.js` e assets) no Firebase Hosting ou provedor de escolha.
2. **Atualização Permanente das Regras de Escrita**: Garantir que as regras de segurança do Realtime Database reflitam exatamente os e-mails autorizados que foram adicionados à whitelist do código.
