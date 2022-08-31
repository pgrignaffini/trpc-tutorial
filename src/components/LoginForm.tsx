import Link from "next/link"
import { useForm } from "react-hook-form"
import { CreateUserInput } from "../schema/user.schema"
import { trpc } from "../utils/trpc"
import { useState } from "react"
import { useRouter } from "next/router"
import { redirect } from "next/dist/server/api-utils"

function VerifyToken({ hash }: { hash: string }) {
    const router = useRouter()
    const { data, isLoading } = trpc.useQuery(['users.verify-otp', {
        hash
    }])

    if (isLoading) {
        return <p>Verifying...</p>
    }

    router.push(data?.redirect.includes('login') ? '/' : data?.redirect || '/')
    return <p>Redirecting...</p>
}

function LoginForm() {

    const { handleSubmit, register } = useForm<CreateUserInput>()
    const [success, setSuccess] = useState(false)
    const router = useRouter()

    const { mutate, error } = trpc.useMutation(['users.request-otp'], {
        onSuccess: () => {
            setSuccess(true)
        }
    })

    function onSubmit(data: CreateUserInput) {
        mutate({ ...data, redirect: router.asPath })
    }

    const hash = router.asPath.split('#token=')[1]

    if (hash) {
        return <VerifyToken hash={hash} />
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                {error && error.message}
                <h1>Login</h1>
                {success && <p>Check your email</p>}
                <input type="email" placeholder="test@email.com" {...register('email')} />
                <button type="submit">Login</button>
            </form>
            <Link href="/register">
                Register
            </Link>
        </div>
    )
}

export default LoginForm
