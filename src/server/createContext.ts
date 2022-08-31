import { NextApiRequest, NextApiResponse } from "next";
import { verifyJWT } from "../utils/jwt";
import { prisma } from "../utils/prisma";

interface CtxUser {
    id: string;
    email: string
    name: string
    iat: string
    exp: number
}

function getUserFromRequest(req: NextApiRequest) {
    const token = req.cookies.token

    if (token) {
        try {
            const verified = verifyJWT<CtxUser>(token)
            return verified as CtxUser
        } catch (error) {
            return null
        }
    }
}


export function createContext({
    req, res
}: {
    req: NextApiRequest,
    res: NextApiResponse
}) {

    const user = getUserFromRequest(req)

    return { req, res, prisma, user };
}

export type Context = ReturnType<typeof createContext>;