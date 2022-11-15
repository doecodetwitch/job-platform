import LoginBox from "@/src/components/LoginBox/LoginBox"
import { NextPage } from "next"
import { Provider } from "next-auth/providers"
import { getProviders } from "next-auth/react"
import styles from '@/src/styles/auth/signin.module.css'


interface SignInOptions {
  providers: Provider[]
}

const SignIn: NextPage<SignInOptions> = (options: SignInOptions)  => {
  return (
    <>
      <div className={styles.signinPage}>
        <LoginBox providers={options.providers} />
      </div>
    </>
  )
}

export async function getServerSideProps() {
  const providers = await getProviders()
  return {
    props: { providers },
  }
}

export default SignIn;