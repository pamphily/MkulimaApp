
export interface createUserPayload {
    id: string,
    email: string,
    full_name: string,
    phone: string,
    role: string,
    password: string,
}

export interface LoginPayload {
    email: string,
    password: string,
}
