const fs = require('fs');
const path = require('path');

// Caminhos dos arquivos
const devConfigPath = path.join(__dirname, 'firebase-config.dev.js');
const prodConfigPath = path.join(__dirname, 'firebase-config.js');
const devAdminPath = path.join(__dirname, 'admin.dev.html');
const prodAdminPath = path.join(__dirname, 'admin.html');

console.log('Iniciando o build e ofuscação...');

// 1. Função para minificar JS básico (remove comentários e espaços extras)
function basicMinifyJS(code) {
    // Remove comentários de linha (// ...) mas preserva URLs HTTP/HTTPS
    // Um truque seguro: remove comentários que não fazem parte de uma string ou URL
    let minified = code
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comentários de bloco /* */
        .replace(/(^|[^:])\/\/.*/g, '$1') // Remove comentários de linha // (evita remover https://)
        .replace(/\s+/g, ' ')            // Remove múltiplos espaços e novas linhas
        .replace(/\s*([\{\}\(\)\=\+\-\*\/\[\]\,\;\:\>\<\!])\s*/g, '$1') // Remove espaços ao redor de operadores
        .trim();
    return minified;
}

// 2. Ofuscar e construir o firebase-config.js
try {
    if (!fs.existsSync(devConfigPath)) {
        throw new Error('Arquivo firebase-config.dev.js não encontrado.');
    }

    let configContent = fs.readFileSync(devConfigPath, 'utf8');

    // Encontra o objeto firebaseConfig
    const configRegex = /const\s+firebaseConfig\s*=\s*\{([\s\S]*?)\};/;
    const match = configContent.match(configRegex);

    if (match) {
        const originalObjectText = match[1];
        
        // Vamos extrair as chaves e valores e codificar cada valor em Base64
        const lines = originalObjectText.split(',');
        const obfuscatedLines = [];

        lines.forEach(line => {
            if (!line.trim()) return;
            const parts = line.split(':');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                let val = parts.slice(1).join(':').trim();
                
                // Remove aspas simples/duplas das pontas do valor
                val = val.replace(/^['"]|['"]$/g, '');

                // Codifica o valor em Base64
                const base64Val = Buffer.from(val).toString('base64');
                obfuscatedLines.push(`  ${key}: atob("${base64Val}")`);
            }
        });

        const newConfigObjectText = `const firebaseConfig = {\n${obfuscatedLines.join(',\n')}\n};`;
        configContent = configContent.replace(configRegex, newConfigObjectText);
    }

    // Minifica o firebase-config.js
    const minifiedConfig = basicMinifyJS(configContent);
    fs.writeFileSync(prodConfigPath, minifiedConfig, 'utf8');
    console.log('✓ firebase-config.js gerado e ofuscado com sucesso!');

} catch (err) {
    console.error('Erro ao processar firebase-config.dev.js:', err.message);
    process.exit(1);
}

// 3. Ofuscar e construir o admin.html
try {
    if (!fs.existsSync(devAdminPath)) {
        throw new Error('Arquivo admin.dev.html não encontrado.');
    }

    let adminContent = fs.readFileSync(devAdminPath, 'utf8');

    // Regex para encontrar o bloco de script no admin.dev.html
    const scriptRegex = /<script type="module">([\s\S]*?)<\/script>/;
    const match = adminContent.match(scriptRegex);

    if (match) {
        let scriptCode = match[1];

        // Corrige a importação de firebase-config.dev.js para a versão oficial de produção
        scriptCode = scriptCode.replace(/'\.\/firebase-config\.dev\.js'/g, "'./firebase-config.js'");
        scriptCode = scriptCode.replace(/"\.\/firebase-config\.dev\.js"/g, '"./firebase-config.js"');

        // Minifica o código JavaScript do admin
        const minifiedScript = basicMinifyJS(scriptCode);

        // Substitui o script original pelo minificado no HTML
        adminContent = adminContent.replace(scriptRegex, `<script type="module">${minifiedScript}</script>`);
    }

    // Minifica também partes básicas do HTML (remove quebras de linha redundantes)
    adminContent = adminContent.replace(/\r?\n\s*\r?\n/g, '\n');

    fs.writeFileSync(prodAdminPath, adminContent, 'utf8');
    console.log('✓ admin.html gerado e compilado com sucesso!');
    console.log('Processo concluído com êxito!');

} catch (err) {
    console.error('Erro ao processar admin.dev.html:', err.message);
    process.exit(1);
}
