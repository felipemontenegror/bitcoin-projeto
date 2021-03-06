require('dotenv-safe').config()
const { MercadoBitcoin, MercadoBitcoinTrade } = require('./api')

const infoApi = new MercadoBitcoin({ currency: 'BTC' })
const tradeApi = new MercadoBitcoinTrade({
    currency: 'BTC',
    key: process.env.KEY,
    secret: process.env.SECRET,
    pin: process.env.PIN,
})

async function getQuantity(coin, price, isBuy){  //parametros moeda, preço, e se é uma compra
    price = parseFloat(price)
    coin = isBuy ? 'brl' : coin.toLowerCase()

    const data = await tradeApi.getAccountInfo()
    const balance = parseFloat(data.balance[coin].available.toFixed(5))  //balance é um array, pegar coin de reais

        if (isBuy && balance < 100)  //mínimo possível de compra é 100 reais
            return false
            //return close.log('saldo insuficiente para comprar')
            console.log(`saldo disponível de ${coin}: ${balance}`)

    let qty = 0
        if(isBuy) qty = parseFloat((balance / price).toFixed(5))
        return qty - 0.00001  // tirar diferença do arredondamento do balance / price

}


setInterval (async () => {
    const response = await infoApi.ticker()
    console.log(response)

        if(response.ticker.sell > 343000) //valor colido após consulta
       return console.log('Está caro! Pore favor, aguardar!')
    //else
        //return console.log('Está barato!! Pode comprar!!')

        //lógica da ordem de compra
        try {
            const qty = await getQuantity('BRL', response.ticker.sell, true)  // tipo de moeda, menor preço do mercado, se é compra
                if(!qty) return console.log('saldo insuficiente para comprar')
                
            const data = await tradeApi.placeBuyOrder(qty, response.ticker.sell) 
            console.log(`ordem inserida no livro!`, data)

        
        const buyPrice = parseFloat(response.ticker.sell)
        const profitability = parseFloat(process.env.PROFITABILITY) //1.1
        const data2 = await tradeApi.placeSellOrder(data.quantity, buyPrice * profitability) // vender tudo q tem de BTC a 10% mais q pagou (preço de compra * %)
        console.log('ordem inserida no livro', data2)
        }catch (error){
            console.error(error)
        } // Dessa forma, vai comprar 100 reais em Bitcoins, caso esteja desvalorizado e continuar a operação repetidamente.


}, process.env.CRAWLER_INTERVAL ) //processo do node . ambiente . variável com valor de tempo de execução