require('dotenv-safe').config()
const { MercadoBitcoin } = require('./api')

const infoApi = new MercadoBitcoin({ currency: 'BTC' })

setInterval (async () => {
    const response = await infoApi.ticker()
    console.log(response)
    if(response.ticker.sell > 339000) //valor colido após consulta
       return console.log('Está caro! Pore favor, aguardar!')
    else
        return console.log('Está barato!! Pode comprar!!')

}, process.env.CRAWLER_INTERVAL )