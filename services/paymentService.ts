import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
dayjs.extend(customParseFormat);
import bcrypt from "bcrypt";

import * as cardRepository from "../repositories/cardRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as businessRepository from "../repositories/businessRepository.js";

export async function payment(cardId: number, businessId: number, amount: number, password: string) {
    const card = await cardRepository.findById(cardId);
    if(!card)
        throw {type: "Not Found", message: "Card ID not found"};
    if(!card.password)
        throw {type: "", message: "Card not activated yet"};
    if(dayjs().isAfter(dayjs(card.expirationDate, "MM/YY").add(1, "month").subtract(1, "day")))
        throw {type: "", message : "Card already expired"};
    if(card.isBlocked)
        throw {type: "", message: "Card freezed"};
    if(!bcrypt.compareSync(password, card.password))
        throw {type: "", message : "Wrong ID or password"};
    const business = await businessRepository.findById(businessId);
    if(!business)
        throw {type: "Not Found", message: "Business ID not found"};
    if(business.type !== card.type)
        throw {type: "", message: "Card can't be used in this business"};
    const payments = await paymentRepository.findByCardId(cardId);
    const recharges = await rechargeRepository.findByCardId(cardId);
    let [totalPayments, totalRecharges, balance] = [0,0, 0];
    payments.forEach(p => totalPayments += p.amount);
    recharges.forEach(r => totalRecharges += r.amount);
    balance = totalRecharges - totalPayments;
    if(balance < amount)
        throw {type: "", message: "Not enough funds"};
    
    const data = {
        cardId,
        businessId,
        amount
    };
    await paymentRepository.insert(data);
}