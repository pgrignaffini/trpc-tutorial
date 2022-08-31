import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { CreatePostInput } from "../../schema/post.schema"
import { trpc } from "../../utils/trpc"

function CreatePostPage() {

    const router = useRouter()
    const { handleSubmit, register } = useForm<CreatePostInput>()
    const { mutate, error } = trpc.useMutation(['posts.create-post'], {
        onSuccess({ id }) {
            router.push(`/posts/${id}`)
        }
    })


    function onSubmit(values: CreatePostInput) {
        mutate(values)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {error && error.message}
            <h1>Create post</h1>
            <br />
            <input type="text"
                placeholder="title"
                {...register('title')} />
            <br />
            <textarea placeholder="content" {...register("body")} />
            <button type="submit">Create post</button>
        </form>
    )
}

export default CreatePostPage
