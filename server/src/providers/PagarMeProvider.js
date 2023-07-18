import { cpf } from "cpf-cnpj-validator";

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
        const customerParams = {
            customer: {
                external_id: customer.email,
                name: customer.name,
                email: customer.email,
                type: cpf.isValid(customer.document) ? "individual" : "corporation",
                country: "br",
                phone_numbers: [ customer.mobile ],
                documents: [
                    {
                        type: cpf.isValid(customer.document) ? "cpf" : "cnpj",
                        number: customer.document.replace(/[^?0-9]/g,""),
                    }
                ]
            }
        }

        //se for ecommerce, precisa das informações
        const billingParams = billing?.zipcode ? {
            billing: {
                name: "Billing Address",
                address: {
                    country: "br",
                    state: billing.state,
                    city: billing.city,
                    neighborhood: billing.neighborhood,
                    street: billing.address,
                    street_number: billing.number,
                    zipcode: billing.zipcode,
                },
            }
        } : { }

        const itemsParams = items && items.length > 0 ? {
            items: items.map((item) => ({
                id: item?.id.toString(),
                title: item?.title,
                unit_price: item?.amount * 100,
                quantity: item?.quantity || 1,
                tangible: false,
            }))

        } : { 
            items: [
                {
                    id: "1",
                    title: `t-${transactionCode}`,
                    unit_price: total * 100,
                    quantity: 1,
                    tangible: false,
                }
            ]
         }
        
        //Aqui é tudo que você quiser guardar no metadata do pagarME
        const metadataParams = {
            metadata: {
                transaction_code: transactionCode,
            }
        }

        const transactionParams = {
            async: false, //quero enviar para o processamento e esperar a resposta
            // postback_url: '',
            ...paymentParams,
            ...customerParams,
            ...billingParams,
            ...itemsParams,
            ...metadataParams,
        }

        console.debug(transactionParams)
    }
}

export default PagarMeProvider;