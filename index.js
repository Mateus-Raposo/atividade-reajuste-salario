import express from 'express';
const app = express();
const port = 3000;

app.get('/', (req, res) => {

    const { idade, sexo, salario_base, anoContratacao, matricula } = req.query;

    let html = `
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Sistema de RH</title>
            <style> 
                body { background-color: darkblue; display: flex; justify-content: center; font-family: sans-serif; } 
                h1 { text-align: center; color: #333; } 
                .container { background-color: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); max-width: 600px; margin-top: 40px;} 
                .erro { color: mediumvioletred; font-weight: bold; } 
            </style>
        </head>
        <body>
        <div class="container">
            <h1>Atividade de Reajuste de Salário</h1>
    `;

 
    if (!idade || !sexo || !salario_base || !anoContratacao || !matricula) {
        html += `
            <p style="text-align: center;">Bem-vindo(a) ao sistema!</p>
            <p>Por favor, informe na URL os seguintes dados: <strong>idade, sexo, salario_base, anoContratacao e matricula</strong>.</p>
            <p><strong>Exemplo de uso:</strong></p>
           <a href="/?idade=23&sexo=M&salario_base=3000&anoContratacao=2020&matricula=889353">
                Clique aqui para testar com um exemplo
            </a>
            </div></body></html>
        `;
        return res.send(html);
    }


    const idadenum = Number(idade);
    const floatsal = Number(salario_base);
    const anonumero = Number(anoContratacao);
    const matnumero = Number(matricula);
    const sexoUpper = sexo.toUpperCase();


    let erros = [];
    if (idadenum <= 16) erros.push("A idade deve ser maior que 16 anos!");
    if (sexoUpper !== 'F' && sexoUpper !== 'M') erros.push("O sexo tem que ser M ou F!");
    if (floatsal <= 0 || isNaN(floatsal)) erros.push("O salário base deve ser um número válido e positivo!");
    if (anonumero <= 1960) erros.push("O ano de contratação tem que ser maior que 1960!");
    if (matnumero <= 0 || !Number.isInteger(matnumero)) erros.push("A matrícula tem que ser um número inteiro e positivo!");


    if (erros.length > 0) {
        html += `<p class="erro">Não foi possível realizar o cálculo devido aos seguintes erros:</p><ul>`;
        erros.forEach(erro => html += `<li class="erro">${erro}</li>`);
        html += `</ul></div></body></html>`;
        return res.send(html);
    }


    const tempotrabalhado = 2026 - anonumero; 
    let reajuste = 0;
    let salarioajustado = 0;

    if (idadenum >= 18 && idadenum <= 39) {
        if (sexoUpper === 'M') {
            reajuste = (floatsal * 10) / 100;
            salarioajustado = tempotrabalhado <= 10 ? floatsal + reajuste - 10 : floatsal + reajuste + 17;
        } else if (sexoUpper === 'F') {
            reajuste = (floatsal * 8) / 100;
            salarioajustado = tempotrabalhado <= 10 ? floatsal + reajuste - 11 : floatsal + reajuste + 16;
        }
    } 
    else if (idadenum >= 40 && idadenum <= 69) {
        if (sexoUpper === 'M') {
            reajuste = (floatsal * 8) / 100;
            salarioajustado = tempotrabalhado <= 10 ? floatsal + reajuste - 5 : floatsal + reajuste + 15;
        } else if (sexoUpper === 'F') {
            reajuste = (floatsal * 10) / 100;
            salarioajustado = tempotrabalhado <= 10 ? floatsal + reajuste - 7 : floatsal + reajuste + 14;
        }
    } 
    else if (idadenum >= 70 && idadenum <= 99) {
        if (sexoUpper === 'M') {
            reajuste = (floatsal * 15) / 100;
            salarioajustado = tempotrabalhado <= 10 ? floatsal + reajuste - 15 : floatsal + reajuste + 13;
        } else if (sexoUpper === 'F') {
            reajuste = (floatsal * 17) / 100;
            salarioajustado = tempotrabalhado <= 10 ? floatsal + reajuste - 17 : floatsal + reajuste + 12;
        }
    }


    html += `
        <h3>Dados processados com sucesso:</h3>
        <ul>
            <li><strong>Matrícula:</strong> ${matnumero}</li>
            <li><strong>Idade:</strong> ${idadenum}</li>
            <li><strong>Sexo:</strong> ${sexoUpper === 'M' ? 'Masculino' : 'Feminino'}</li>
            <li><strong>Ano de Contratação:</strong> ${anonumero} (${tempotrabalhado} anos de empresa)</li>
            <li><strong>Salário base original:</strong> R$ ${floatsal.toFixed(2)}</li>
        </ul>
        <hr>
        <h2 style="color: green; text-align: center;">Seu novo salário é: R$ ${salarioajustado.toFixed(2)}</h2>
        </div></body></html>
    `;

    res.send(html);
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});