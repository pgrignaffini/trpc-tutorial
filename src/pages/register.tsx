import Link from "next/link"
import { useForm } from "react-hook-form"
import { CreateUserInput } from "../schema/user.schema"
import { trpc } from "../utils/trpc"
import { useRouter } from "next/router"

function Register() {

    const { handleSubmit, register } = useForm<CreateUserInput>()
    const router = useRouter()

    const { mutate, error } = trpc.useMutation(['users.register-user'], {
        onSuccess: () => {
            router.push('/login')
        }
    })

    function onSubmit(data: CreateUserInput) {
        mutate(data)
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                {error && error.message}
                <h1>Register</h1>
                <input type="email" placeholder="test@email.com" {...register('email')} />
                <input type="text" placeholder="tom" {...register('name')} />
                <button type="submit">Register</button>
            </form>
            <Link href="/login">
                Login
            </Link>
        </div>
    )
}

export default Register
