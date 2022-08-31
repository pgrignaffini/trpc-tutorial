import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";
import { serialize } from "cookie";
import { baseUrl } from "../../constants";
import { createUserSchema, requestOTPSchema, verifyOTPSchema } from "../../schema/user.schema";
import { decode, encode } from "../../utils/base64";
import { signJWT } from "../../utils/jwt";
import { sendLoginEmail } from "../../utils/mailer";
import { createRouter } from "../createRouter";

export const userRouter = createRouter()
    .mutation('register-user', {
        input: createUserSchema,
        async resolve({ ctx, input }) {
            const { email, name } = input;
            try {
                const user = await ctx.prisma.user.create({
                    data: {
                        email,
                        name
                    }
                })
                return user
            } catch (e) {
                if (e instanceof PrismaClientKnownRequestError) {
                    if (e.code === 'P2002') {
                        throw new TRPCError({
                            code: 'CONFLICT',
                            message: 'User already exists'
                        })
                    }
                }
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong'
                })
            }
        },
    })
    .mutation('request-otp', {
        input: requestOTPSchema,
        async resolve({ ctx, input }) {
            const { email, redirect } = input;
            const user = await ctx.prisma.user.findUnique({
                where: {
                    email
                }
            })
            if (!user) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'User not found'
                })
            }

            const token = await ctx.prisma.loginToken.create({
                data: {
                    redirect,
                    user: {
                        connect: {
                            id: user.id
                        },
                    },
                }
            })

            await sendLoginEmail({
                token: encode(`${token.id}:${user.email}`),
                url: baseUrl,
                email: user.email
            })
        }
    }).query('verify-otp', {
        input: verifyOTPSchema,
        async resolve({ ctx, input }) {
            const decoded = decode(input.hash).split(':')
            const [id, email] = decoded
            const token = await ctx.prisma.loginToken.findFirst({
                where: {
                    id,
                    user: {
                        email
                    },
                },
                include: {
                    user: true
                }
            })

            if (!token) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Token not found'
                })
            }

            const jwt = signJWT({
                id: token.user.id,
                email: token.user.email,
            })

            ctx.res.setHeader('Set-Cookie', serialize('token', jwt, { path: '/' }))

            return {
                redirect: token.redirect,
            }
        }
    }).query('me', {
        resolve({ ctx }) {
            return ctx.user
        }
    })