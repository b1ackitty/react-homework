import Copyright from './copyright'
import LoginForm from './login-form'
import Logo from './logo'

export default function Login() {
  return (
    <section className="flex flex-col items-center gap-12">
      <Logo />
      <LoginForm />
      <Copyright className="text-[#555] text-sm" />
    </section>
  )
}
