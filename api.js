const axios = require('axios')
const qs = require('querystring')
const crypto = require('crypto')

const ENDPOINT_API = 'https://www.mercadobitcoin.net/api/'  //API de consulta de dados
const ENDPOINT_TRADE_PATH = '/tapi/v3/'
const ENDPOINT_TRADE_API = 'https://www.mercadobitcoin.net' + ENDPOINT_TRADE_PATH    //Api de Trader

class MercadoBitcoinTrade {

    constructor(config){
        this.config = {
            KEY: config.key,   //chaves secretas de API para Trade
            SECRET: config.secret,
            PIN: config.pin,
            CURRENCY: config.currency
        }
    }

    getAccountInfo(){
        return this.call('get_account_info', {}) // função para retornar o saldo em conta
    }

    placeBuyOrder(qty, limit_price) {
        return this.call('place_buy_order', {    //Ordem de compra -> R$ p/ BTC
            coin_pair: `BRL${this.config.CURRENCY}`,
            quantity: `${qty}`.substring(0, 10),   //no máximo 10 números, incluindo depois da vírgula (BTC fracionado)
            limit_price: `${limit_price}`
        })

    }


        async call(method, parameters) {

            const now = new Date().getTime()
            let queryString = qs.stringify({ tapi_method: method, tapi_nonce: now})  // nonce -  número arbitrário que só pode ser usado uma vez
                if(parameters) queryString += `&${qs.stringify(parameters)}`  //concatenar o vlaor em formato querystring
            
            const signature = crypto.createHmac('sha512', this.config.SECRET)
                .update(`${ENDPOINT_TRADE_PATH}?${queryString}`)  // Criptografando o path completo da requisição com osecret usando algoritmo de Hash sha512
                .digest('hex')

            const config = {
                headers: {
                    'TAPI-ID': this.config.KEY,
                    'TAPI-MAC': signature   // criptografa a assinatura

                }
            }

            const response = await axios.post(ENDPOINT_TRADE_API, queryString, config)
                if (response.data.error_message) throw new Error(response.data.error_message)
                    return response.data.response_data
    }
}

class MercadoBitcoin {

    constructor(config) {
        this.config = {
            CURRENCY: config.currency
        }
    }

    ticker() {
        return this.call('ticker')
    }

    async call(method) {

        const config = {   //pega dados na Api Bitcoin
            headers: {
                'Accept': 'application/json',

            }
        }

    try {
        const response = await axios.get(ENDPOINT_API + this.config.CURRENCY + '/' + method, config)  
        return response.data 
    }
    catch(error){
        console.error(error)
        return false
    }
    }
}

module.exports = {
    MercadoBitcoin,
    MercadoBitcoinTrade
}