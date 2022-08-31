import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import LoginForm from '../components/LoginForm'
import { useUserContext } from '../context/user.context'

const Home: NextPage = () => {

  const user = useUserContext()

  if (!user) {
    return <LoginForm />
  }

  return (
    <div>
      <Link href='/posts/new'>
        <a>Create Post</a>
      </Link>
    </div>
  )
}

export default Home
