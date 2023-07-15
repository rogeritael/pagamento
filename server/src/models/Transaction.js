import mongoose from "mongoose";

const schema = new mongoose.Schema({
    cartCode: {
        type: String,
        required: true,
        unique: true
    },
    //código da transação
    code: {
        type: String,
        required: true
    },
    //status da transação - iniciada, pendente, aprovada
    status: {
        type: String,
        enum: [ //para garantir que existam apenas esses tipos de status
            "started",
             "processing",
             "pending",
             "approved",
             "refused", //cartão recusado
             "refunded",
             "chargeback", //quando cancela na operadora
             "error"
        ],
        required: true,
    },
    paymentType: {
        type: String,
        enum: ["billet", "credit_card"],
        required: true
    },
    installments: { //parcelas
        type: Number,
    },
    total: {
        type: Number,
    },
    transactionId: {
        type: String,
    },
    processorResponse: { //resposta do adquirent [tid e nit]
        type: String,
    },
    customerEmail :{
        type: String,
    },
    customerName :{
        type: String,
    },
    customerMobile :{
        type: String,
    },
    customerDocument :{
        type: String,
    },
    billingAddress :{
        type: String,
    },
    billingNumber :{
        type: String,
    },
    billingNeighborhood :{
        type: String,
    },
    billingCity :{
        type: String,
    },
    billingState :{
        type: String,
    },
    billingZipCode :{
        type: String,
    },
},{
    timestamps: true,
});

export default mongoose.model("Transaction", schema)