import { v4 as uuidv4 } from "uuid"

import Cart from "../models/Cart";
import Transaction from "../models/Transaction";

import PagarMeProvider from "../providers/PagarMeProvider";

class TransactionService {
    paymentProvider; // no ts -> private paymentProvider

    constructor(paymentProvider){
        this.paymentProvider = paymentProvider || new PagarMeProvider();
    }

    async process({
        cartCode,
        paymentType,
        installments,
        customer,
        billing,
        creditCard
    }){

        const cart = await Cart.findOne({ code: cartCode });
        if(!cart){
            throw `Cart ${cartCode} was not found.`;
        }

        const transaction = await Transaction.create({
            cartCode: cart.code,
            code: await uuidv4(), 
            total: cart.price,
            paymentType,
            installments,
            status: "started",
            customerName: customer.name,
            customerEmail: customer.email,
            customerMobile: customer.mobile,
            customerDocument: customer.document,
            billingAddress: billing.address,
            billingNumber: billing.number,
            billingNeighborhood: billing.neighborhood,
            billingCity: billing.city,
            billingState: billing.state,
            billingZipCode: billing.zipcode,
        });

        //pegando o método paymentProvider declarado lá em cima
        this.paymentProvider.process({
            transactionCode: transaction.code,
            paymentType,
            total: transaction.total,
            installments,
            creditCard,
            billing,
            customer
        })

        return transaction;
    } 
}

export default TransactionService;