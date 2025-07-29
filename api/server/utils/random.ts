export function reference(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; 
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length); 
        result += characters[randomIndex]; 
    }

    return result; 
}

export function password(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'; // All possible characters
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length); 
        result += characters[randomIndex]; 
    }
    console.log(result);
    return result; 
}

export function pin(length: number) {
    const characters = '0123456789'; // Digits
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length); 
        result += characters[randomIndex]; 
    }
    return result; 
}

export function otp(length: number) {
    const characters = '0123456789'; // Digits
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length); 
        result += characters[randomIndex]; 
    }
    return result; 
}


import crypto from 'crypto';


export function generateAccountNumber(name: string, phone: string): string {
    const data = `${name}${phone}`;
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    const accountNumber = parseInt(hash.slice(0, 2), 16); // Convert first 2 hex digits to an integer
    return accountNumber.toString().padStart(8, '0'); // Pad with zeros to make it 8 digits
}

// generate random 20 bit token with a split of 4 digit to look like 7728 3787 8731 8912 1912
export function generateRandomToken() {
    const characters = "0123456789";

    let result = '';
    for (let i = 0; i < 20; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length); 
        result += characters[randomIndex]; 
        if ((i + 1) % 4 === 0 && i !== 19) {
            result += ' ';
        }
    }
    return result; 
}
