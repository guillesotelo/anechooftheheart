"use client"

import { commentType, onChangeEventType } from '../../app/types'
import { useContext, useState } from 'react'
import { AppContext } from '../../app/context/AppContext'
import { deleteComment, updateComment } from '../../services/comment'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { getUser } from 'src/helpers'

type Props = {
    comment?: commentType
}

export default function ReplyComment({ comment }: Props) {
    const [liked, setLiked] = useState(false)
    const [likes, setLikes] = useState(comment?.likes || 0)
    const { lang, isLoggedIn } = useContext(AppContext)
    const router = useRouter()

    const getCommentDate = (comment?: commentType) => {
        if (!comment || !comment.createdAt) return ''
        const now = new Date().getTime()
        const commentDate = new Date(comment?.createdAt || new Date()).getTime()
        const minutesPassed = (now - commentDate) / 60000
        const daysPassed = (now - commentDate) / (60000 * 60 * 24)
        let timePassed
        if (minutesPassed >= 60) {
            if (daysPassed >= 365) {
                const years = (daysPassed / 365).toFixed(0)
                timePassed = `${years} ${lang === 'es' ? 'año' : 'year'}${Number(years) > 1 ? 's' : ''}`
            }
            else if (daysPassed >= 30) {
                const months = (daysPassed / 30).toFixed(0)
                timePassed = `${months} ${lang === 'es' ? 'mes' : 'month'}${Number(months) > 1 ? 's' : ''}`
            }
            else if (daysPassed >= 1) {
                const days = (minutesPassed / 60 / 24).toFixed(0)
                timePassed = `${days} ${lang === 'es' ? 'día' : 'day'}${Number(days) > 1 ? 's' : ''}`
            }
            else {
                const hours = (minutesPassed / 60).toFixed(0)
                timePassed = `${hours}h`
            }
        } else timePassed = `${minutesPassed.toFixed(0)} min${Number(minutesPassed.toFixed(0)) > 1 ? 's' : ''}`
        return lang === 'es' ? `Hace ${timePassed}` : `${timePassed} ago`
    }


    const likeComment = async () => {
        try {
            if (comment) {
                let _likes = likes + (liked ? -1 : 1)
                const updated = await updateComment({ ...comment, likes: _likes }, getUser())
                if (updated) {
                    setLiked(!liked)
                    setLikes(_likes)
                }
            }
        } catch (error) {
            console.error(error)
        }
    }

    const removeComment = async (comment: commentType) => {
        try {
            const deleted = await deleteComment(comment, getUser())
            if (deleted) {
                toast.success('Comment deleted')
                setTimeout(() => router.refresh(), 1000)
            }
            else toast.error(lang === 'es' ? 'Error al enviar comentario. Intenta nuevamente.' : 'Error while sending comment. Please try again.')
        } catch (error) {
            console.error(error)
        }
    }

    const getProfile = (comment?: commentType) => {
        if (comment && comment.fullname) {
            if (comment.fullname.length > 1) {
                const firstLetter = comment.fullname.split(' ')[0][0]
                const secondLetter = comment.fullname.split(' ')[1] ? comment.fullname.split(' ')[1][0] : ''
                return firstLetter.toUpperCase() + secondLetter.toUpperCase()
            } else return comment.fullname.toUpperCase()
        }
    }

    return (
        <div className="comment__row" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid lightgray' }}>
            <div className="comment__col">
                <img src={'/assets/icons/reply.svg'} alt="Reply" className="comment__reply-image" draggable={false} />
            </div>
            <div className="comment__col" >
                {comment?.isDany ?
                    <img src={'/assets/images/dany-comment-profile.png'} alt="Comment Profile Image" className="comment__image" draggable={false} />
                    :
                    <p className="comment__profile">{getProfile(comment)}</p>
                }            </div>
            <div className="comment__col">
                <p className="comment__name">{comment?.isDany ? 'Dany' : comment?.fullname ? comment.fullname.split(' ')[0] : ''}</p>
                <p className="comment__date">{getCommentDate(comment)}</p>
                <p className="comment__message">{comment?.comment}</p>
                <div className="comment__btns">
                    <div className="comment__likes">
                        <img src={liked ? '/assets/icons/like-filled.svg' : '/assets/icons/like.svg'} onClick={likeComment} alt="Like this comment" className="comment__likes-img" draggable={false} />
                        {likes ? <p className="comment__likes-count">{likes}</p> : ''}
                        {isLoggedIn ? <p className='comment__reply-btn' onClick={() => removeComment(comment || {})} style={{ margin: '0 1rem' }}>Delete</p> : ''}
                    </div>
                </div>
            </div>
        </div>

    )
}