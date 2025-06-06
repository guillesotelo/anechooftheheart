import { useRouter } from "next/navigation"
import { imagePlaceholder } from "src/constants/app"

type Props = {
    images?: string[]
    title?: string
    subtitle?: string
    delay?: string
    category: string
    count?: string
}

export default function CategoryCard({ images, title, subtitle, category, count }: Props) {
    const router = useRouter()

    return (
        <div className="category-card__container" onClick={() => router.push(`/blog/${category}`)}>
            <div className="category-card__images">
                <img src={images && images[0] ? images[0] : imagePlaceholder} style={{ width: images && !images[1] ? '100%' : '50%' }} className='category-card__image-large' loading='lazy' />
                <div className="category-card__images-col">
                    {images?.map((image: string, i: number) =>
                        i > 0 && i < 3 ?
                            <img
                                key={i}
                                src={image || imagePlaceholder}
                                className='category-card__image'
                                style={{
                                    height: !images[2] ? '100%' : '50%',
                                    marginBottom: i === 2 || !images[2] ? '0' : '3px'
                                }}
                                loading='lazy'
                            />
                            : ''
                    )}
                </div>
            </div>
            <h3 className='category-card__title'>{title}</h3>
            <h4 className='category-card__subtitle'>{subtitle}</h4>
            <h4 className='category-card__subtitle' style={{ color: 'gray' }}>{count}</h4>
        </div>
    )
}