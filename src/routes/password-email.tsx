import { Header } from '~/components/Header';
import style from './VerifyEmail.module.scss';

export default function PasswordEmail() {

    return (
        <>
        <Header />
        <main class={style['main']}>
          <h1 class="type-heading-1 text-sky-120">Check your email</h1>
          <p class="type-body-1">
            We just sent an email to the provided email address with a password reset link. 
          </p>
          <p class="type-body-1">
            Please check you email and click the provided link to change your password
          </p>
          <div></div>
          <div class={style['bubble-lg']} />
          <div class={style['bubble-sm']} />
        </main>
      </>

    )

}