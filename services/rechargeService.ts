import dayjs from "dayjs";

import { Company } from "../repositories/companyRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";

export async function recharge(cardId: number, amount: number, company: Company) {
    const card = await cardRepository.findById(cardId);
    if(!card)
        throw {type: "Not Found", message: "Card ID not found"};
    if(!card.password)
        throw {type: "", message: "Card not activated yet"};
    if(dayjs().isAfter(dayjs(card.expirationDate, "MM/YY")))
        throw {type: "", message : "Card already expired"};
    
    const data = {cardId, amount};
    await rechargeRepository.insert(data);
}