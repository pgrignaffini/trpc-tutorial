import z from 'zod'

export const createUserSchema = z.object({
    name: z.string(),
    email: z.string().email()
})

export const createUserOutputSchema = z.object({
    name: z.string(),
    email: z.string().email()
})

export type CreateUserInput = z.TypeOf<typeof createUserSchema>

export const requestOTPSchema = z.object({
    email: z.string().email(),
    redirect: z.string().default('/')
})

export type requestOTPInput = z.TypeOf<typeof requestOTPSchema>

export const verifyOTPSchema = z.object({
    hash: z.string(),
})