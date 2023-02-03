import * as vision from '@google-cloud/vision';

// const CONFIG= {
//     credentials: {
//         private_key: JSON.parse(process.env.GCV_PRIVATE_KEY!),
//         client_email: JSON.parse(process.env.GCV_CLIENT_EMAIL!),
//     }
// }

const credentilsNew = JSON.parse(JSON.stringify({"type": "service_account",
"project_id": "bamboo-century-376510",
"private_key_id": "60f280b497d5dab4e828dfe14443fed9bfeb95d4",
"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDGlje9ULggO14Q\ng/XGh3f5pB3ztyESZhgXx64/IlG10YGRwrm566niTuuEmMpZkySZ0THwEQ5pCjXS\nPGCXEdFx8zd1ALjtttvsXzc9d8P2LNNl3aya/0mYIP7qrYc8GM3DsM7wLgQKvVMg\nhzXZ7KLDyCrdPMXAtUkuO2dyhmGO1Wt3KoIvZcuANVz63NMf9eDByf7h9BzABDPl\n270l4bmZ50BM4sbHwTd4SuOwphAyO08arm+0v4DbG7kWtG5OxQjaoS5ONQJcSSd2\n7vAvDhSf5XNeGBMo80ncPAVUCev+UnG8Q3H84SzgvRR+dq3N21OMdBBhvu0JB6M8\nlaE939r9AgMBAAECggEAD0SVXH926I4n7pUhXEt7XzzNoLiVA65zGRZHwKA0MApq\nL863gM0sQ94AIDMEZlv4axW5BSq1NOuNX8Xh7JDOIuNULDFgsRtnT9uyNOOfCVpA\n6+AIg+eEvPwscoE3mIM/rqqf/mSgou1owA4lMcVjw4cBj1OQ0Kl0yufTouvPVwUm\nsCSYaZyvOEdlhkgbk2EN4auptgViOVKLqr2UEi5qL/+/8hIKUmTvE4M683uzKAxB\nNFtcb2k4P/EEFCGhzp8fplVTqxrL4b5nwteffd5ElbYCor4IAuJr9KJmRsbDU68q\nfIYAR55QahKurEyJ6DHR3Ua4rjkJaY9e+VeGO4xVAQKBgQD7zvoLlPZRyxuCPf3b\n488tibWbyApmrU6Uv3gpF1MEk3l7RpjeGxi0UHcPhEPwde9k/kp3rFW0AxuzPzJT\nSCxjvHLJ1cELSxj8+/hvZ4NNK1T9pOi7qyJhtgMdxqB6d3Wuxfxd2Cco6zrJksdV\nBwfGHt1MR61mRRLEE9Hlk+GbcQKBgQDJ5HL1X5Q3rVApB+ovN3Hl9JjbDk6islcR\n+fRFA2OankcGCGxeumFOxIjqZAA8rK2JNSfXPXCGIQe+lftVnEKzEQ6npkHjDjoM\nNCKe2WeQUFNWl1jucZEEPia8reAoTtkPmEsrkWPG+IkYxmYSjtElA76z3QNAUQZj\n1MWmx1S6TQKBgQDZA2MJ0kKK8XFuyMBc3rNxuonyjO8x2FCt72m+eCSLABIlRQ1/\n9XhQBjzl+YaX2PwNXP6Ors5Zyof37hIQJlZjSkjfW8H4WqtZdEqCsII/YoXn51TQ\nUEfcUAHVipZJlWSt0GGT+zKcmEXc7QuvYtS3UWhFUkzFo+ftZmtx4QYBcQKBgHaT\nKP16PFgS/4CJuH4wx0Fyzg/iMEcYDVFuh4u8+NQH39joO5XLS3lyrqNTRlxcYrOy\nN4sP97WfUqgZ+HqIgxgejYfjetD7OxaNzEOVlmDI/Jlf3Ih2xOBEDIZGbN/fp1ak\ncInPI1XqBMM7SxndLXLa5zdGODGfJOyfO9K/QcEFAoGAHbQlZQrS1E2yy4MYcgjt\neQaxfJm5h3XOF96kbJMqQ2c5fNbXXwymBMBYUMlCD/Iq4b59ffq2hwKyJuwJOxYB\nxLy3tBZ7xdTKTTiKzNDFpG8Uxhl/GtGXa2/KyJxtyctQi0bj0BSoewxLNneDUlqW\nKoYMhVtbHi/GiYgGchmgl4Q=\n-----END PRIVATE KEY-----\n",
"client_email": "jk-backend@bamboo-century-376510.iam.gserviceaccount.com",
"client_id": "107044988980394359934",
"auth_uri": "https://accounts.google.com/o/oauth2/auth",
"token_uri": "https://oauth2.googleapis.com/token",
"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
"client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/jk-backend%40bamboo-century-376510.iam.gserviceaccount.com"}));

const CONFIGX = {
    credentials: {
        private_key: credentilsNew.private_key,
        client_email: credentilsNew.client_email,
    }
}
const client = new vision.ImageAnnotatorClient(CONFIGX);


const detectText = async(filePath: any) => {
    const result = await client.textDetection(filePath);
    console.log(result.length);
    return result;
}



export default detectText;
