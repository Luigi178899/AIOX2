const fs = require('fs');
const path = require('path');
const https = require('https');
const readline = require('readline');

// Caminhos dos ficheiros do Squad
const configPath = path.join(__dirname, 'agent.json');
const promptPath = path.join(__dirname, 'prompt.md');

// Função para procurar a chave API localmente no ficheiro .env
function getLocalApiKey() {
    try {
        const rootDir = path.resolve(__dirname, '..', '..');
        const envPath = path.join(rootDir, '.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            const match = envContent.match(/GEMINI_API_KEY\s*=\s*(.*)/);
            if (match && match[1]) {
                // Remove aspas, espaços extras ou quebras de linha
                return match[1].trim().replace(/['"]/g, '');
            }
        }
    } catch (e) {
        // Ignora silenciosamente se houver falha de leitura
    }
    return "";
}

const activeApiKey = getLocalApiKey();

console.log("🚀 [AIOX] A inicializar o Agente: checklist-helper...");

if (!fs.existsSync(configPath) || !fs.existsSync(promptPath)) {
    console.error("❌ Erro: Ficheiros 'agent.json' ou 'prompt.md' não foram encontrados na pasta do Squad!");
    process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const promptContent = fs.readFileSync(promptPath, 'utf8');

console.log(`\n✅ Agente '${config.name}' (v${config.version}) carregado com sucesso!`);
console.log(`📋 Função: ${config.role}`);
console.log(`🧠 Carregando Heurística de ${config.system_instructions_file}...\n`);
console.log("----------------------------------------------------------------");
console.log("💡 Agente pronto! Escreva o seu objetivo de dev para gerar o seu checklist.");
console.log("💡 Digite 'sair' para encerrar a sessão do chat.\n");

// Interface de leitura do terminal para manter o programa aberto
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion() {
    rl.question('\n👤 Tu: ', (userInput) => {
        const cleanInput = userInput.trim();
        
        if (cleanInput.toLowerCase() === 'sair') {
            console.log("\n👋 Até à próxima! Bons desenvolvimentos com o AIOX.");
            rl.close();
            process.exit(0);
        }

        if (!cleanInput) {
            askQuestion();
            return;
        }

        if (!activeApiKey) {
            console.log("\n🤖 checklist-helper (Modo Simulação - Nenhuma API Key detectada no seu .env):");
            console.log(`\n# 📋 Checklist para: ${cleanInput}`);
            console.log("- [ ] Criar estrutura base do componente no projeto");
            console.log("- [ ] Implementar a lógica de estados e eventos com LocalStorage");
            console.log("- [ ] Estilizar interface com Tailwind CSS");
            console.log("- [ ] Validar campos de entrada vazios");
            console.log("\n💡 *Dica:* Configure seu GEMINI_API_KEY no arquivo .env para obter respostas reais!");
            askQuestion();
            return;
        }

        console.log("\n🤖 A processar o teu checklist com inteligência artificial...");

        // Payload da chamada da API do Gemini
        const payload = JSON.stringify({
            contents: [{ parts: [{ text: `Gera um checklist para a seguinte tarefa: ${cleanInput}` }] }],
            systemInstruction: { parts: [{ text: promptContent }] }
        });

        const options = {
            hostname: 'generativelanguage.googleapis.com',
            path: `/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${activeApiKey}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const responseJson = JSON.parse(data);
                    
                    if (res.statusCode !== 200) {
                        console.log(`\n❌ Erro da API (Status ${res.statusCode}): ${responseJson.error?.message || 'Erro desconhecido'}`);
                        askQuestion();
                        return;
                    }

                    const generatedText = responseJson.candidates?.[0]?.content?.parts?.[0]?.text;
                    
                    if (generatedText) {
                        console.log("\n🤖 Resposta do checklist-helper:");
                        console.log(generatedText);
                    } else {
                        console.log("\n❌ Não foi possível extrair a resposta. Verifique os logs.");
                    }
                } catch (e) {
                    console.log("\n❌ Erro ao analisar a resposta do servidor do Gemini.");
                }
                askQuestion();
            });
        });

        req.on('error', (e) => {
            console.error(`\n❌ Falha na ligação com o servidor do Gemini: ${e.message}`);
            askQuestion();
        });

        req.write(payload);
        req.end();
    });
}

// Iniciar loop de perguntas no terminal
askQuestion();