# Zabbix Houseti Webhook

Este projeto configura um webhook para integração de alertas do Zabbix com um serviço de e-mail personalizado usando Node.js.

---

## Índice

1. [Instalação](#instalação)
2. [Configuração do Servidor](#configuração-do-servidor)
   - [Configuração SMTP no `index.js`](#configuração-smtp-no-indexjs)
   - [Configuração de Envio de E-mail](#configuração-de-envio-de-e-mail)
3. [Configuração no Zabbix](#configuração-no-zabbix)
4. [Script do Webhook para o Zabbix](#script-do-webhook-para-o-zabbix)

---

## Instalação

1. Clone o repositório para uma pasta de sua preferência:
    ```bash
    git clone https://github.com/jeffersonalionco/zabbix-houseti-webhook.git
    ```

2. Acesse o diretório do projeto:
    ```bash
    cd zabbix-houseti-webhook
    ```

3. Instale as dependências do projeto:
    ```bash
    npm install
    ```

---

## Configuração do Servidor

### Configuração SMTP no `index.js`

Abra o arquivo `index.js` e edite o trecho de código para configurar o serviço de envio de e-mails conforme seu provedor SMTP:

```javascript
// Configuração do transportador SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp.exemplo.com', // Substitua pelo servidor SMTP correto
    port: 587, // Ou 465 para SSL
    secure: false, // true para 465, false para outras portas
    auth: {
        user: 'exemplo@dominio.com.br', // Seu e-mail
        pass: 'senha' // Sua senha
    }
});
```


### Configuração de Envio de E-mail

Edite o trecho no arquivo `index.js` para configurar os dados de envio do e-mail com base nos alertas recebidos do Zabbix:

```javascript
// Configuração dos dados do e-mail
const mailOptions = {
    from: 'exemplo@exemplo.com.br', // Seu e-mail de envio
    to: 'destinatario@exemplo.com.br', // O e-mail para onde o alerta será enviado
    subject: `Alerta Zabbix: ${data.trigger}`,
    text: `Alerta acionado: ${data.trigger}. Detalhes: ${JSON.stringify(req.body)}`,
    html: html // Conteúdo em HTML, substitua conforme necessário
};
```
## Configuração no Zabbix

Para configurar o envio de alertas via webhook, siga estas instruções no painel do Zabbix:

1. No menu de configuração do Zabbix, crie uma nova mídia do tipo webhook.
2. Preencha os parâmetros conforme a tabela abaixo:

| Parâmetro         | Valor                                                                                          |
|-------------------|------------------------------------------------------------------------------------------------|
| `dadosOperacional`| `{EVENT.OPDATA}`                                                                               |
| `dataHora`        | `{EVENT.TIME} em {EVENT.DATE}`                                                                 |
| `duration`        | `{EVENT.DURATION}`                                                                             |
| `hostname`        | `{HOST.NAME}`                                                                                  |
| `id`              | `{EVENT.ID}`                                                                                   |
| `item`            | `{ITEM.NAME1} is {ITEM.VALUE1}`                                                                |
| `link`            | `{$ZABBIX_URL}/tr_events.php?triggerid={TRIGGER.ID}&eventid={EVENT.ID}`                       |
| `severity`        | `{TRIGGER.SEVERITY}`                                                                           |
| `status`          | `{TRIGGER.STATUS}`                                                                             |
| `tempoDuration`   | `{EVENT.RECOVERY.TIME} em {EVENT.RECOVERY.DATE}`                                               |
| `trigger`         | `{TRIGGER.NAME}`                                                                               |

---

## Script do Webhook para o Zabbix

Insira o seguinte script no Zabbix para enviar os dados dos alertas para o servidor Node.js configurado:

```javascript
try {
    Zabbix.Log(4, 'email webhook script value=' + value);

    var result = {
        'tags': {
            'endpoint': 'email'
        }
    };

    // Faz o parse do valor recebido
    var params = JSON.parse(value);
    var req = new HttpRequest();
    var payload = {};
    var resp;

    // Define o cabeçalho para JSON
    req.addHeader('Content-Type: application/json');

    // Cria o payload para enviar ao seu servidor Node.js
    payload = {
        status: params.status,
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
    };

    // Defina o endpoint do seu servidor Node.js
    var email_endpoint = "http://172.16.24.219:3008/zabbix-webhook"; // Substitua pelo IP ou hostname do seu servidor

    // Envia a requisição POST para o endpoint
    resp = req.post(email_endpoint, JSON.stringify(payload));

    // Verifica se a resposta é bem-sucedida
    if (req.getStatus() !== 200) {
        throw 'Response code: ' + req.getStatus();
    }

    // Processa a resposta
    resp = JSON.parse(resp);
    result.tags.issue_id = resp.id; // Adapte conforme necessário
    result.tags.issue_key = resp.key; // Adapte conforme necessário

} catch (error) {
    Zabbix.Log(4, 'email issue creation failed json: ' + JSON.stringify(payload));
    Zabbix.Log(4, 'email issue creation failed: ' + error);
    result = {};
}

return JSON.stringify(result);
```