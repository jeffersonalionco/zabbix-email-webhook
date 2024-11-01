# Zabbix Email Webhook

Este projeto é um serviço de webhook desenvolvido para facilitar o envio de alertas do Zabbix via email ou outras integrações personalizadas, utilizando o Nodemailer para configurar e gerenciar os alertas enviados. Projetado com foco em simplicidade e adaptabilidade, o **Zabbix Email Webhook** é ideal para administradores de sistemas e equipes de TI que desejam integrar notificações de eventos críticos diretamente a seus fluxos de comunicação ou monitoramento.

---

## Índice
+ [`Introdução do Projeto`](#recursos-principais)

1. [Instalação](#instalação)
2. [Configuração do Servidor](#configuração-do-servidor)
   - [Configuração SMTP no `index.js`](#configuração-smtp-no-indexjs)
   - [Configuração de Envio de E-mail](#configuração-de-envio-de-e-mail)
3. [Configuração no Zabbix](#configuração-no-zabbix)
    - [Configurar macro](#3-configurar-macro)
4. [Script do Webhook para o Zabbix](#script-do-webhook-para-o-zabbix)

---

## Recursos Principais

- **Envio de Notificações por Email**: Configuração simples para envio de alertas de evento do Zabbix diretamente para emails específicos.
- **Personalização de Alertas**: Possibilita customizar mensagens de alerta, permitindo incluir informações detalhadas como hostname, severidade do evento, descrição e duração.
- **Webhook Flexível**: Integra-se facilmente com o Zabbix usando o sistema de mídia webhook. Pode ser adaptado para enviar dados a outros serviços através de requisições HTTP, além de email.
- **Compatibilidade com Nodemailer**: Integração pronta com o Nodemailer, permitindo que o serviço use SMTP configurável para envio seguro de emails.
- **Documentação Completa**: Passo a passo para instalação, configuração e uso, visando tornar a instalação e adaptação do projeto no Zabbix rápidas e intuitivas.

## Como Funciona

1. **Configuração do SMTP**: Personalize as configurações do SMTP em `index.js` para enviar alertas usando seu provedor de email preferido.
2. **Personalização do Template de Email**: Ajuste o conteúdo do alerta para incluir os dados mais relevantes de acordo com a necessidade de monitoramento.
3. **Integração no Zabbix**: Configure o webhook no painel do Zabbix para enviar automaticamente as informações dos eventos críticos para o servidor onde o serviço está executando.
4. **Recepção e Processamento de Dados**: O script no Zabbix envia dados como severidade, hostname, tempo de ocorrência e recuperação diretamente ao servidor Node.js, onde os dados são formatados e encaminhados para o email configurado ou outro serviço de sua preferência.

## Estrutura do Projeto

- **index.js**: Contém a lógica principal, com a configuração do SMTP e a definição de rotas.
- **Instalação do Projeto**: Documentação no `README.md` com passos para instalação, configuração do webhook e parâmetros detalhados.
- **Script Webhook Zabbix**: Um script configurado no Zabbix para enviar os dados do evento ao servidor Node.js, utilizando um endpoint HTTP para a comunicação.

## Pré-Requisitos

- **Node.js** e **npm** instalados.
- Configuração de um servidor SMTP válida para envio de emails.
- Acesso ao painel de configuração do Zabbix para criação de novas mídias e parametrização do webhook.

## Exemplos de Uso

1. **Monitoramento de Servidores Críticos**: Receba alertas de eventos críticos (como queda de serviços ou uso elevado de recursos) direto no seu email, com informações relevantes para facilitar a resposta rápida.
2. **Integração em Equipes de TI**: Envie notificações de alerta para um endereço de email de suporte, integrando o Zabbix diretamente com o sistema de comunicação da equipe.
3. **Automação de Notificações**: Use o script configurável para acionar respostas automáticas ou sistemas de gerenciamento de incidentes com base em eventos do Zabbix.

## Tecnologias Utilizadas

- **Node.js**
- **Express.js**
- **Nodemailer**
- **Zabbix** (Integração via webhook)


---

## Instalação

1. Clone o repositório para uma pasta de sua preferência:
    ```bash
    git clone https://github.com/jeffersonalionco/zabbix-email-webhook.git
    ```

2. Acesse o diretório do projeto:
    ```bash
    cd zabbix-email-webhook
    ```

3. Instale as dependências do projeto:
    ```bash
    npm install
    ```
4. Inicie o webhook
    ```bash
    node index.js
    ```
    > - Lembre-se de que antes de inicializar você precisa editar algumas informações do codigo em
    - [Configuração do Servidor](#configuração-do-servidor)
    - [Configuração SMTP no `index.js`](#configuração-smtp-no-indexjs)
    - [Configuração de Envio de E-mail](#configuração-de-envio-de-e-mail)


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


## 3. Configurar Macro
Em Macros, crie a seguinte entrada:

``` Macro
{$ZABBIX_URL} : http://IP-DO-SERVIDOR/ 
```

---


## Dicas Extras para Linux

### Inicialização Automática com Systemd

Para iniciar o serviço automaticamente em reinicializações e falhas, siga os passos abaixo para configurá-lo como um serviço do **systemd**:

1. **Criar Arquivo de Serviço**  
   Execute o comando abaixo para criar o arquivo de serviço no diretório `/etc/systemd/system/`:

    ```bash
    sudo nano /etc/systemd/system/zabbix-zulip-webhook.service
    ```

2. **Configurar o Arquivo de Serviço**  
   No editor, adicione o conteúdo abaixo ao arquivo:

    ```ini
    [Unit]
    Description=Zabbix-Zulip Webhook Service
    After=network.target

    [Service]
    ExecStart=/usr/bin/node /caminho/do/projeto/index.js
    WorkingDirectory=/caminho/do/projeto
    Restart=always
    User=seu_usuario
    Environment=NODE_ENV=production

    [Install]
    WantedBy=multi-user.target
    ```

    > **Nota**:
    > - Substitua `/caminho/do/projeto` pelo caminho completo onde o arquivo `index.js` está localizado.
    > - Substitua `seu_usuario` pelo nome do usuário que executará o serviço.

3. **Atualizar Permissões**  
   Após salvar o arquivo, atualize as permissões com o comando:

    ```bash
    sudo chmod 644 /etc/systemd/system/zabbix-zulip-webhook.service
    ```

4. **Iniciar e Habilitar o Serviço**

   Execute os seguintes comandos para iniciar o serviço e configurá-lo para iniciar automaticamente junto com o sistema:

    ```bash
    sudo systemctl start zabbix-zulip-webhook.service
    sudo systemctl enable zabbix-zulip-webhook.service
    ```

5. **Verificar Status do Serviço**

   Para verificar o status e garantir que o serviço esteja funcionando corretamente, utilize:

    ```bash
    sudo systemctl status zabbix-zulip-webhook.service
    ```

---




## Autor

<div align="center">
    <img src="https://github.com/jeffersonalionco.png" width="150" height="150" style="border-radius: 50%;" alt="Foto do Autor">
</div>

**Jefferson Alionco**  
Programador e entusiasta de tecnologias de integração e automação, com ampla experiência em Node.js, servidores e integração com ferramentas de monitoramento como Zabbix e Zulip.  

Entre em contato: [EMAIL: Jefferson L. Alionco](mailto:jeffersonalionco@gmail.com)
