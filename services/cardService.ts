import {faker} from "@faker-js/faker";
import Cryptr from "cryptr";
import bcrypt from "bcrypt";
import dayjs from 'dayjs';
import customParseFormat from "dayjs/plugin/customParseFormat.js";
dayjs.extend(customParseFormat);
import dotenv from "dotenv";
dotenv.config();

import * as cardRepository from "../repositories/cardRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import { Company } from "../repositories/companyRepository.js";

export async function newCard(employeeId: number, cardType: cardRepository.TransactionTypes, company: Company) {
    const employee = await employeeRepository.findById(employeeId);
    if(!employee)
        throw {type: "Not found", message: "Employee ID not found"};
    if(employee.companyId != company.id)
        throw {type: "Conflict", message: "Employee doesn't work for the company"}
    const employeeCardType = await cardRepository.findByTypeAndEmployeeId(cardType, employeeId);
    if(employeeCardType)
        throw {type: "Conflict", message: "Employee already has such a card"};
    
    const cardNumber = faker.finance.creditCardNumber();
    const name = employee.fullName.toUpperCase().split(" ").filter(word => word.length > 2);
    let cardholderName = "";
    name.forEach((word, i) => {
        if(i == 0)
            cardholderName += word + " ";
        else if(i == name.length - 1)
            cardholderName += word;
        else cardholderName += word[0] + " ";
    });
    const today = dayjs();
    const expirationDate = dayjs(new Date(today.year() + 5, today.month())).format("MM/YY");
    const CVV = faker.finance.creditCardCVV();
    console.log(CVV);
    const cryptr = new Cryptr(process.env.CRYPTR_KEY);
    const CVVencrypted = cryptr.encrypt(CVV);
    const card: cardRepository.CardInsertData = {
        employeeId,
        number: cardNumber,
        cardholderName,
        securityCode: CVVencrypted,
        expirationDate,
        password: null,
        isVirtual: false,
        originalCardId: null,
        isBlocked: false,
        type: cardType
    };
    await cardRepository.insert(card);
}

export async function activateCard(cardId: number, CVV: string, password: string) {
    const card = await cardRepository.findById(cardId);
    if(!card)
        throw {type: "Not Found", message: "Card ID not found"};
    if(card.password)
        throw {type: "Conflict", message: "Card already activated"};
    if(dayjs().isAfter(dayjs(card.expirationDate, "MM/YY").add(1, "month").subtract(1, "day")))
        throw {type: "", message : "Card already expired"};
    const CVVencrypted = (await cardRepository.findById(cardId)).securityCode;
    const cryptr = new Cryptr(process.env.CRYPTR_KEY);
    const CVVdecrypted = cryptr.decrypt(CVVencrypted);
    if(CVV != CVVdecrypted)
        throw {type: "", message: "Incorrect CVV"};
    const passwordHash = bcrypt.hashSync(password, 10);
    const cardUpdate = {
        password: passwordHash
    };
    await cardRepository.update(cardId, cardUpdate);
}

export async function freezeCard(cardId: number, password: string) {
    const card = await cardRepository.findById(cardId);
    if(!card)
        throw {type: "Not Found", message: "Card ID not found"};
        if(dayjs().isAfter(dayjs(card.expirationDate, "MM/YY").add(1, "month").subtract(1, "day")))
        throw {type: "", message : "Card already expired"};
    if(card.isBlocked)
        throw {type: "", message : "Card already freezed"};
    if(!bcrypt.compareSync(password, card.password))
        throw {type: "", message : "Wrong ID or password"};
    const cardUpdate = {
        isBlocked: true
    };
    await cardRepository.update(cardId, cardUpdate);
}

export async function unfreezeCard(cardId: number, password: string) {
    const card = await cardRepository.findById(cardId);
    if(!card)
        throw {type: "Not Found", message: "Card ID not found"};
        if(dayjs().isAfter(dayjs(card.expirationDate, "MM/YY").add(1, "month").subtract(1, "day")))
        throw {type: "", message : "Card already expired"};
    if(!card.isBlocked)
        throw {type: "", message : "Card already unfreezed"};
    if(!bcrypt.compareSync(password, card.password))
        throw {type: "", message : "Wrong ID or password"};
    const cardUpdate = {
        isBlocked: false
    };
    await cardRepository.update(cardId, cardUpdate);
}

export async function balance(cardId: number) {
    const card = await cardRepository.findById(cardId);
    if(!card)
        throw {type: "Not Found", message: "Card ID not found"};

    const transactions = await paymentRepository.findByCardId(cardId);
    const recharges = await rechargeRepository.findByCardId(cardId);
    let [totalPayments, totalRecharges, balanceAmount] = [0,0, 0];
    transactions.forEach(p => totalPayments += p.amount);
    recharges.forEach(r => totalRecharges += r.amount);
    balanceAmount = totalRecharges - totalPayments;

    const totalBalance = {
        balance: balanceAmount,
        transactions,
        recharges
    }
    return totalBalance;
}