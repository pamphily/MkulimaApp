import pkcs12 from "./certificate";
const callbackURL = "https://majiapi.gov.go.tz/api/pre/prepaid/third-party/token";
// const callbackURL = "http://192.168.100.105:5000/callback"

export async function processDuplicateTranction(paymentReceipt: string, token: string, sys_id: string){

    const body = {
        status: "MS",
        message: "Success",
        token,
        paymentReceipt,
    };

    console.log(body)

    const reqSignature = pkcs12.sign(body);

    const response = await fetch(callbackURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "sys-id": sys_id,
            "req-signature": reqSignature,
        },
        body: JSON.stringify(body),
    });

    return response.json();
}

// Send callback to MAJI-IS
export async function sendTokenCallback(paymentReceipt: string, token: string, sys_id: string) {
    const body = {
        status: "MS",
        message: "Success",
        token,
        paymentReceipt,
    };
    
    const reqSignature = pkcs12.sign(body);

    const response = await fetch(callbackURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "sys-id": sys_id,
            "req-signature": reqSignature,
        },
        body: JSON.stringify(body),
    });

    return response.json();
}

export async function getToken(signature:string, serial: string, units: number) {
    const response = await fetch(`${process.env.MANUFACTURER_BASE_URL}/transaction/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "signature": signature
        },
        body: JSON.stringify({
            serialNumber: parseInt(serial),
            units: units
        })
    });
    console.log(response)

    const data = await response.json();
    return data
}