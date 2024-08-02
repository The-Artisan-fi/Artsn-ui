import { getCustomErrorMessage } from '@solana-developers/helpers';

const protocolErrors = [
    "You are not authorized to perform this action",
    "You are already verified!",
    "You have a Non-Upgradable Membership Type!",
    "You used an invalid condition",
    "You used an invalid object type",
    "You already bought more than 500$ worth of fraction, to buy more you need to do KYC",
    "Listing is not Live yet, come back later!",
    "Overflow",
    "Underflow"
];

export function getErrorMessage(message:string) {
    try {
        const errorMessage = getCustomErrorMessage(protocolErrors, message);
        return errorMessage;
    }
    catch (error) {
        console.error('Error getting error message', error);
        return ("Can not determine error message");
    }
};   