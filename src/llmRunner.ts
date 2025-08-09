import { spawn } from 'child_process';

const LLAMA_CPP_PATH = './llama.cpp/main';
const LLAMA_MODEL_PATH = './models/ggml-model-q4_0.bin';

export async function generateResponseWithLLM(prompt: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const args = [
            '-m', LLAMA_MODEL_PATH,
            '-p', prompt,
            '-n', '128',
            '--temp', '0.7',
            '--top-k', '40',
            '--top-p', '0.9',
            '--mirostat', '0',
            '--repeat-last-n', '64',
            '--repeat-penalty', '1.17647',
            // '--color',   // Optionnel à enlever pour parsing plus simple
            '--interactive-first',
            '-r', "User:",
            '--in-prefix', " ",
            '--in-suffix', "\n",
            '-t', '4',
            '--ctx-size', '2048'
        ];

        const llamaProcess = spawn(LLAMA_CPP_PATH, args);

        let output = '';
        let errorOutput = '';

        llamaProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        llamaProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
            console.error(`llama.cpp stderr: ${data}`);
        });

        llamaProcess.on('close', (code) => {
            if (code === 0) {
                // Nettoyer la sortie, enlever prompt
                const cleanedOutput = output.substring(prompt.length).trim();
                resolve(cleanedOutput);
            } else {
                reject(new Error(`llama.cpp exited with code ${code}: ${errorOutput}`));
            }
        });

        llamaProcess.on('error', (err) => {
            reject(err);
        });
    });
}
