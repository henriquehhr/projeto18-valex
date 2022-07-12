import faker from "@faker-js/faker";
import Cryptr from "cryptr";
import bcrypt from "bcrypt";
import dayjs from 'dayjs';
import dotenv from "dotenv";
dotenv.config();

import * as cardRepository from "../repositories/cardRepository.js";
import { Company } from "../repositories/companyRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";

export async function newCard(employeeId: number, cardType: cardRepository.TransactionTypes, company: Company) {
    const employee = await employeeRepository.findById(employeeId);
    if(!employee)
        throw {type: "Not found", message: "Employee ID not found"};
    if(employee.companyId != company.id)
        throw {type: "Conflict", message: "Employee doesn't work for the company"}
    const employeeCardType = await cardRepository.findByTypeAndEmployeeId(cardType, employeeId);
    if(employeeCardType)
        throw {type: "Conflict", message: "Employee already has such a card"};
    
    const cardNumber = faker.faker.finance.creditCardNumber();
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
    const CVV = faker.faker.finance.creditCardCVV();
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
        isBlocked: true,
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
    if(dayjs().isAfter(dayjs(card.expirationDate, "MM/YY")))
        throw {type: "", message : "Card already expired"};
    if(!password.match(/^[0-9]{4}$/))
        throw {type: "", message: "Password must contain exactly 4 numbers"};
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