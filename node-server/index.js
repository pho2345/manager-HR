const express = require('express')
const app = express()
const port = 3000
var cors = require('cors');
const SSE = require('express-sse');
const sse = new SSE();
const { Kafka, CompressionTypes, logLevel } = require('kafkajs');
const bodyParser = require('body-parser');
const path = require('path');
const sgMail = require('@sendgrid/mail');
const Handlebars = require("handlebars");
sgMail.setApiKey('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');


const html = `<!DOCTYPE HTML
 PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>


    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">

    <title></title>

    <style type="text/css">
        @media only screen and (min-width: 620px) {
            .u-row {
                width: 600px !important;
            }
            .u-row .u-col {
                vertical-align: top;
            }
            .u-row .u-col-100 {
                width: 600px !important;
            }
        }
        
        @media (max-width: 620px) {
            .u-row-container {
                max-width: 100% !important;
                padding-left: 0px !important;
                padding-right: 0px !important;
            }
            .u-row .u-col {
                min-width: 320px !important;
                max-width: 100% !important;
                display: block !important;
            }
            .u-row {
                width: 100% !important;
            }
            .u-col {
                width: 100% !important;
            }
            .u-col>div {
                margin: 0 auto;
            }
        }
        
        body {
            margin: 0;
            padding: 0;
        }
        
        table,
        tr,
        td {
            vertical-align: top;
            border-collapse: collapse;
        }
        
        p {
            margin: 0;
        }
        
        .ie-container table,
        .mso-container table {
            table-layout: fixed;
        }
        
        * {
            line-height: inherit;
        }
        
        a[x-apple-data-detectors='true'] {
            color: inherit !important;
            text-decoration: none !important;
        }
        
        #u_body a {
            color: #0000ee;
            text-decoration: underline;
        }
        
        @media (max-width: 480px) {
            #u_content_heading_1 .v-font-size {
                font-size: 30px !important;
            }
            #u_content_text_5 .v-container-padding-padding {
                padding: 10px !important;
            }
            #u_content_button_1 .v-size-width {
                width: 65% !important;
            }
        }
    </style>





</head>

<body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;">


    <table id="u_body " style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;width:100% " cellpadding="0
    " cellspacing="0 ">
        <tbody>
            <tr style="vertical-align: top ">
                <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top ">





                    <table cellpadding="0 " cellspacing="0 " border="0 " style="margin: 0 auto;min-width: 320px;max-width: 600px; ">
                        <tr>
                            <td background="" valign="top " width="100% ">
                                <v:rect xmlns:v="urn:schemas-microsoft-com:vml " fill="true " stroke="false " style="width: 600px; ">
                                    <v:fill type="frame " src="https://cdn.templates.unlayer.com/assets/1715758294520-header.png " />
                                    <v:textbox style="mso-fit-shape-to-text:true " inset="0,0,0,0 ">


                                        <div class="u-row-container " style="padding: 0px;background-image: url( 'images/image-1.png');background-repeat: no-repeat;background-position: center top ">
                                            <div class="u-row " style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent; ">
                                                <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent; ">



                                                    <div class="u-col u-col-100 " style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top; ">
                                                        <div style="height: 100%;width: 100% !important; ">


                                                            <table id="u_content_heading_1 " style="font-family: 'Raleway',sans-serif; " role="presentation " cellpadding="0 " cellspacing="0 " width="100% " border="0 ">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="v-container-padding-padding " style="overflow-wrap:break-word;word-break:break-word;padding:120px 10px 0px;font-family: 'Raleway',sans-serif; " align="left ">


                                                                            <h1 class="v-font-size " style="margin: 0px; color: #000000; line-height: 110%; text-align: center; word-wrap: break-word; font-family: Federo; font-size: 36px; font-weight: 400; ">
                                                                                <strong>Mật khẩu mới của bạn
                     là:</strong>
                                                                            </h1>


                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>

                                                            <table id="u_content_text_5 " style="font-family: 'Raleway',sans-serif; " role="presentation " cellpadding="0 " cellspacing="0 " width="100% " border="0 ">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="v-container-padding-padding " style="overflow-wrap:break-word;word-break:break-word;padding:10px 50px;font-family: 'Raleway',sans-serif; " align="left ">

                                                                            <div class="v-font-size " style="color: red; line-height: 140%; text-align: center; word-wrap: break-word; ">
                                                                                <h1 class="v-font-size " style="margin: 0px; color: green; line-height: 110%; text-align: center; word-wrap: break-word; font-family: Federo; font-size: 36px; font-weight: 400; ">
                                                                                    <strong>{{password}}</strong>
                                                                                </h1>
                                                                            </div>

                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>

                                                            <table id="u_content_button_1 " style="font-family: 'Raleway',sans-serif; " role="presentation " cellpadding="0 " cellspacing="0 " width="100% " border="0 ">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="v-container-padding-padding " style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 120px;font-family: 'Raleway',sans-serif; " align="left ">


                                                                            <div align="center ">

                                                                                <a href="https://unlayer.com " target="_blank " class="v-button v-size-width v-font-size " style="box-sizing: border-box;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #000000; background-color:
    #139c63; border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; width:30%; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;border-top-color: #000000; border-top-style: solid;
    border-top-width: 1px; border-left-color: #000000; border-left-style: solid; border-left-width: 1px; border-right-color: #000000; border-right-style: solid; border-right-width: 1px; border-bottom-color: #000000; border-bottom-style: solid; border-bottom-width:
    1px;font-size: 14px; ">
                                                                                </a>

                                                                            </div>

                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>


                                                        </div>
                                                    </div>


                                                </div>
                                            </div>
                                        </div>


                                    </v:textbox>
                                </v:rect>
                            </td>
                        </tr>
                    </table>





                    <div class="u-row-container " style="padding: 0px;background-color: transparent ">
                        <div class="u-row " style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent; ">
                            <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent; ">


                                <div class="u-col u-col-100 " style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top; ">
                                    <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px; ">


                                        <table style="font-family: 'Raleway',sans-serif; " role="presentation " cellpadding="0 " cellspacing="0 " width="100% " border="0 ">
                                            <tbody>
                                                <tr>
                                                    <td class="v-container-padding-padding " style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family: 'Raleway',sans-serif; " align="left ">

                                                        <table height="0px " align="center " border="0 " cellpadding="0 " cellspacing="0 " width="100% " style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px
    solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100% ">
                                                            <tbody>
                                                                <tr style="vertical-align: top ">
                                                                    <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100% ">
                                                                        <span>&#160;</span>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>

                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>


                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>

                </td>
            </tr>
        </tbody>
    </table>


</body>

</html>`

// app.use(bodyParser.raw());
// app.use(bodyParser.text());
const template = Handlebars.compile(html);


app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200
}));

const kafka = new Kafka({
    logLevel: logLevel.DEBUG,
    brokers: [`localhost:9092`],
    clientId: 'example-producer',
    sasl: {
        mechanism: 'plain',
        username: 'kafkabroker1',
        password: 'kafkabroker1-secret',
    },
})

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/abc', async (req, res) => {
    const topic = 'fbi'
    const producer = kafka.producer();
    await producer.connect()
    const data = {
        data: [{
            id: '1'
        },
        {
            id: '3'
        },
        {
            id: '4'
        },
        {
            id: '5'
        }
        ],
    };
    await producer
        .send({
            topic,
            messages: [{
                key: '1232',
                value: JSON.stringify(data)
            }],
        })
        .then(res => {
            console.log(res);
            producer.disconnect();
        })
        .catch(e => console.error(`[example/producer] ${e.message}`, e))
    res.send('Hello World!');

});


app.post('/kafka-data', (req, res) => {
    console.log('Nhận dữ liệu từ Kafka:fff', req.body);
    // Xử lý dữ liệu ở đây
    // Trả về một phản hồi HTTP nếu cần
    res.status(200).send(req.body);
});

app.get('/hello', async (req, res) => {
    const topic = 'players';
    const consumer = kafka.consumer({ groupId: 'test-group' })
    await consumer.connect()
    await consumer.subscribe({ topic, fromBeginning: true })
    await consumer.run({
        // eachBatch: async ({ batch }) => {
        //   console.log(batch)
        // },
        eachMessage: async ({ topic, partition, message }) => {
            console.log(message.value.toString())
        },
    })
    res.send('Hello World!')
})

app.get('/stream', (req, res) => {
    sse.init(req, res);
});

app.post('/send-mail', async (req, res) => {
    console.log('req.body: ', req.body);
    try {
        const data = req.body;
        if (data?.email !== 'null' && data.email.includes('@')) {
            const msg = {
                to: data.email,
                from: 'photran2206@gmail.com',
                subject: 'Mật khẩu mới',
                html: template(data),
            };
            const sendMail = await sgMail.send(msg);
            console.log(sendMail);
        }
        res.json('suceess');
    } catch (error) {
        console.log(error);
        res.status(500).send('sai')
    }
})


app.post('/receiveData2', async (req, res) => {
    console.log('req.body: ', req.body);
    console.log('req.body type: ', typeof req.body)
    try {
       
        res.json('UKI');
    } catch (error) {
        console.log(error);
        res.status(500).send('sai')
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


const config = {
    "connector.class": "io.aiven.kafka.connect.http.HttpSinkConnector",
    "http.authorization.type": "none",
    "http.url": "http://localhost:3000/send-mail",
    "http.headers.content.type": "application/json",
    "batching.enabled": true,
    "batch.max.size": 1,
    "tasks.max": "1",
    "key.converter": "org.apache.kafka.connect.storage.StringConverter",
    "value.converter": "org.apache.kafka.connect.json.JsonConverter",
    "topics": "send_mail",
    "key.converter.schemas.enable": false,
    "value.converter.schemas.enable": false
  }
