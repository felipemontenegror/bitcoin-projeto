require('dotenv-safe').config()
const { MercadoBitcoin, MercadoBitcoinTrade } = require('./api')

const infoApi = new MercadoBitcoin({ currency: 'BTC' })
const tradeApi = new MercadoBitcoinTrade({
    currency: 'BTC',
    key: process.env.KEY,
    secret: process.env.SECRET,
    pin: process.env.PIN,
})


setInterval (async () => {
    const response = await infoApi.ticker()
    console.log(response)
        if(response.ticker.sell > 339000) //valor colido após consulta
       return console.log('Está caro! Pore favor, aguardar!')
    //else
        //return console.log('Está barato!! Pode comprar!!')
        tradeApi.placeBuyOrder(1, response.ticker.sell)  // compro 1 BTC, pelo menor preço de venda que está retornando (o sell)
        
}, process.env.CRAWLER_INTERVAL ) //processo do node . ambiente . variável com valor de tempo de execução