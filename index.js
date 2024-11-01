const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3008;

// Middleware para ler o corpo das requisições
app.use(bodyParser.json());

// Configuração do transportador SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp.emailexchangeonline.com', // Substitua pelo servidor SMTP correto
    port: 587, // Ou 465 para SSL
    secure: false, // true para 465, false para outras portas
    auth: {
        user: 'zabbix@grupoirani.com.br', // Seu e-mail
        pass: 'zbbx#GI2024' // Sua senha
    }
});

// Rota para receber webhooks do Zabbix
app.post('/zabbix-webhook', (req, res) => {
    const params = req.body;
    
    
   const data = { status: params.status,
        severity: params.severity,
        hostname: params.hostname,
        item: params.item,
        trigger: params.trigger,
        link: params.link,
        dataHora: params.dataHora,
        dadosOperacional: params.dadosOperacional,
        id: params.id,
        duration: params.duration,
        tempoDuration: params.tempoDuration
    
    }
    // Aqui você pode processar os dados do alerta conforme necessário
    console.log('Alerta recebido:', req.body);


    let html 
    
    let templateProblema = `<!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <style>
            body {
                font-family: Arial, sans-serif;
                color: #333333;
                line-height: 1.6;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                border: 1px solid #e0e0e0;
                border-radius: 5px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background-color: #0D47A1;
                color: #ffffff;
                padding: 15px;
                text-align: center;
            }
            .header h2 {
                margin: 0;
                font-size: 1.5em;
            }
            .content {
                padding: 20px;
                background-color: #ffffff;
            }
            .content table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }
            .content th, .content td {
                padding: 10px;
                border: 1px solid #e0e0e0;
            }
            .content th {
                background-color: #f5f5f5;
                font-weight: bold;
                color: #333;
                text-align: left;
            }
            .content td {
                color: #555;
            }
            .footer {
                text-align: center;
                padding: 15px;
                background-color: #f5f5f5;
                font-size: 0.9em;
                color: #777;
            }
            a {
                color: #0D47A1;
                text-decoration: none;
            }
            .severity {
                font-weight: bold;
                color: #D32F2F;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>🚨 Notificação de Alerta do Zabbix 🚨</h2>
            </div>
            <div class="content">
                <table>
                    <tr>
                        <th>Início do Problema</th>
                        <td>${data.dataHora}</td>
                    </tr>
                    <tr>
                        <th>Nome do Problema</th>
                        <td>${data.item}</td>
                    </tr>
                    <tr>
                        <th>Host</th>
                        <td>${data.hostname}</td>
                    </tr>
                    <tr>
                        <th>Gravidade</th>
                        <td class="severity">${data.severity}</td>
                    </tr>
                    <tr>
                        <th>Dados Operacionais</th>
                        <td>${data.dadosOperacional}</td>
                    </tr>
                    <tr>
                        <th>ID do Problema</th>
                        <td>${data.id}</td>
                    </tr>
                    <tr>
                        <th>URL do Trigger</th>
                        <td><a href="${data.link}" target="_blank">Ver Detalhes do Trigger</a></td>
                    </tr>
                </table>
            </div>
            <div class="footer">
                Esta é uma mensagem automática enviada pelo Sistema de Monitoramento Zabbix. Favor não responder.
            </div>
        </div>
    </body>
    </html>
    `
    
    let templateResolucao = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <style>
            body {
                font-family: Arial, sans-serif;
                color: #333333;
                line-height: 1.6;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                border: 1px solid #e0e0e0;
                border-radius: 5px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background-color: #4CAF50;
                color: #ffffff;
                padding: 15px;
                text-align: center;
            }
            .header h2 {
                margin: 0;
                font-size: 1.5em;
            }
            .content {
                padding: 20px;
                background-color: #ffffff;
            }
            .content table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }
            .content th, .content td {
                padding: 10px;
                border: 1px solid #e0e0e0;
            }
            .content th {
                background-color: #f5f5f5;
                font-weight: bold;
                color: #333;
                text-align: left;
            }
            .content td {
                color: #555;
            }
            .footer {
                text-align: center;
                padding: 15px;
                background-color: #f5f5f5;
                font-size: 0.9em;
                color: #777;
            }
            a {
                color: #4CAF50;
                text-decoration: none;
            }
            .severity {
                font-weight: bold;
                color: #D32F2F;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>✅ Notificação de Resolução do Zabbix ✅</h2>
            </div>
            <div class="content">
                <table>
                    <tr>
                        <th>Problema Resolvido</th>
                        <td>${data.tempoDuration}</td>
                    </tr>
                    <tr>
                        <th>Nome do Problema</th>
                        <td>${data.item}</td>
                    </tr>
                    <tr>
                        <th>Duração do Problema</th>
                        <td>${data.duration}</td>
                    </tr>
                    <tr>
                        <th>Host</th>
                        <td>${data.hostname}</td>
                    </tr>
                    <tr>
                        <th>Gravidade</th>
                        <td class="severity">${data.severity}</td>
                    </tr>
                    <tr>
                        <th>ID do Problema Original</th>
                        <td>${data.id}</td>
                    </tr>
                    <tr>
                        <th>URL do Trigger</th>
                        <td><a href="${data.link}" target="_blank">Ver Detalhes do Trigger</a></td>
                    </tr>
                </table>
            </div>
            <div class="footer">
                Esta é uma mensagem automática enviada pelo Sistema de Monitoramento Zabbix. Favor não responder.
            </div>
        </div>
    </body>
    </html>
    `

    

    if(data.status == 'PROBLEM'){ html = templateProblema}else{ html = templateResolucao}

    // Configurar os dados do e-mail
    const mailOptions = {
        from: 'zabbix@grupoirani.com.br',
        to: 'ti1@superirani.com.br', // O e-mail para onde enviar o alerta
        subject: `Alerta Zabbix: ${data.trigger}`,
        text: `Alerta acionado: ${data.trigger}. Detalhes: ${JSON.stringify(req.body)}`,
        html: html 
    };

    // Enviar o e-mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erro ao enviar e-mail:', error);
            return res.status(500).send('Erro ao enviar e-mail');
        }
        console.log('E-mail enviado:', info.response);
        res.status(200).send('Alerta recebido e e-mail enviado');
    });




    


});



app.get('/zabbix', (req, res) => {

    const params = req.body;
// Configurar os dados do e-mail
const mailOptions = {
    from: 'zabbix@grupoirani.com.br',
    to: 'ti1@superirani.com.br', // O e-mail para onde enviar o alerta
    subject: `Alerta Zabbix: `,
    text: `Alerta acionado: . Detalhes: `
};

// Enviar o e-mail
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Erro ao enviar e-mail:', error);
        return res.status(500).send('Erro ao enviar e-mail' + error);
    }
    console.log('E-mail enviado:', info.response);
    res.status(200).send('Alerta recebido e e-mail enviado');
});


});




app.listen(PORT, () => {
    console.log(`Servidor escutando na porta ${PORT}`);
});
