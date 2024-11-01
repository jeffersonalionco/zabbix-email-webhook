# zabbix-houseti-webhook




# No Zabbix


Em script cole este arquivo


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


