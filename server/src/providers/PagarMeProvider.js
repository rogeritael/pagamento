class PagarMeProvider {
    async process({
        transactionCode,
        paymentType,
        total,
        installments,
        creditCard,
        customer,
        billing,
        items
    }){

        //Parâmetos de meios de pagamento
        const billetParams = {
            payment_method: "boleto",
            amout: total * 100, //pagarMe nao trabalha com centavos, desloca os 0's para a esquerda
            installments: 1,
        }

        const creditCardParams = {
            payment_method: "credit_card",
            amount: total * 100,
            installments,
            card_number: creditCard.number.replace(/[^?0-9]/g, ""), //nao pode vir no formato 4111.4111, essa expressão regular transforma tudo que não é um numero de 0 a 9 em vazio
            card_expiration_date: creditCard.expiration.replace(/[^?0-9]/g, ""), //formato MMAA
            card_cvv: creditCard.cvv,
            capture: true, //deixa o valor pendurado para já fazer a cobrança
        }

        let paymentParams;
        switch(paymentType){
            case "credit_card":
                paymentParams = creditCardParams
                break;
            case "billet":
                paymentParams = billetParams
                break;
            default:
                throw `PaymentType ${paymentType} not found.`;
        }

        //parametros de usuário

        const transactionParams = {

        }

    }
}

export default PagarMeProvider;