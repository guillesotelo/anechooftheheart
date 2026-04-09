import { useMemo } from 'react'
import { cardType } from '../../app/types'

type Props = {
    title?: string
    caption?: string
    cards?: cardType[]
    style?: React.CSSProperties
    speed?: number
}

export default function Carousel({ title, caption, cards = [], style, speed = 100 }: Props) {
    const loopedCards = useMemo(() => [...cards, ...cards], [cards])

    return (
        <div className="carousel__container" style={style}>
            <h1 className="carousel__title">{title}</h1>
            <div className="carousel__list-wrapper">
                <div
                    className="carousel__list"
                    style={{ '--carousel-speed': `${speed}s`, ...style } as React.CSSProperties}>
                    {loopedCards.map((card, i) =>
                        <div key={i} className="carousel__card-container" style={style}>
                            <div className="carousel__card-img-container">
                                <img src={card.image} alt='Card Image' className="carousel__card-img" loading="lazy" />
                            </div>
                            <h1 className="carousel__card-title">{card.title}</h1>
                            <p className="carousel__card-text">{card.text}</p>
                        </div>
                    )}
                </div>
            </div>
            <h1 className="carousel__caption">{caption}</h1>
        </div>
    )
}
