'use client'

import Button from "src/components/Button/Button"
import { useRouter } from "next/navigation"

export default function PageNotFound() {
  const router = useRouter()

  const goHome = () => {
    router.push('/')
  }

  return (
    <div className="notfound__container">
      <div className="notfound__col">
        <h1 className="notfound__404">404</h1>
        <h1 className="notfound__header">Nothing to see here...</h1>
        <h2 className="notfound__text">The page you are looking for has not been found. Check the URL is correct or go back home.</h2>
        <Button
          label="Go back home"
          handleClick={goHome}
          bgColor="#5d8c8c"
          textColor="white"
          style={{ width: 'fit-content' }}
        />
      </div>
      <img className="notfound__image" src="/assets/illustrations/not-found.jpg" alt="404 - Page Not Found" draggable={false} />
    </div>
  )
}