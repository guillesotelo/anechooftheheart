import { useEffect, useState } from 'react'
import { cardType } from '../../types'

type Props = {
    title?: string
    caption?: string
    cards?: cardType[]
}

export default function Carousel({ title, caption, cards = [] }: Props) {
    const [allCards, setAllCards] = useState<any[]>(cards)
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [miliseconds, setMiliseconds] = useState<number>(0)
    const [intervalId, setIntervalId] = useState<any>()

    const nextSlide = () => {
        if (currentIndex < allCards.length - 1) {
            setCurrentIndex(currentIndex + 1)
            setAllCards((previous => previous.concat(previous[currentIndex])))
            setMiliseconds((n) => n + 1)
        }
        else {
            setCurrentIndex(0)
        }
    }

    useEffect(() => {
            const interval = runAnimation()
            return () => clearInterval(interval)
    }, [currentIndex])

    const stopAnimation = () => {
        if(intervalId) clearInterval(intervalId)
    }

    const runAnimation = () => {
        const interval = setInterval(nextSlide, 100)
        setIntervalId(interval)
        return interval
    }

    const restartAnimation = () => {
        nextSlide()
    }

    return (
        <div className="carousel__container">
            <h1 className="carousel__title"></h1>
            <div className="carousel__list-wrapper">
                <div
                    className="carousel__list"
                    style={{ transform: `translateX(-${(currentIndex * 5) - miliseconds}px)` }}
                    onMouseEnter={stopAnimation}
                    onMouseLeave={restartAnimation}>
                    {allCards.map((card, i) =>
                        <div key={i} className="carousel__card-container">
                            <div className="carousel__card-img-container">
                                <img src={card.image} alt='Card Image' className="carousel__card-img" />
                            </div>
                            <h1 className="carousel__card-title">{card.title}</h1>
                            <p className="carousel__card-text">{card.text}</p>
                        </div>
                    )}
                </div>
            </div>
            <h1 className="carousel__caption"></h1>
        </div>
    )
}