"use client"

import { useContext, useState } from 'react'
import InputField from '../../components/InputField/InputField'
import Button from '../../components/Button/Button'
import { toast } from 'react-hot-toast'
import { subscribe } from '../../services/app'
import { TEXT } from '../../constants/lang'
import { AppContext } from '../context/AppContext'
import { onChangeEventType } from '../types'
import { useRouter } from 'next/navigation'

type Props = {}

export default function Subscribe({ }: Props) {
    const [data, setData] = useState({ email: '', fullname: '' })
    const router = useRouter()
    const { lang, isMobile } = useContext(AppContext)

    const updateData = (key: string, e: onChangeEventType) => {
        const value = e.target.value
        setData({ ...data, [key]: value })
    }

    const onSubscribe = async () => {
        try {
            const loading = toast.loading(TEXT[lang]['subscribing'])
            if (!data.fullname.includes(' ') || !data.email.includes('@') || !data.email.includes('.')) {
                toast.error(lang === 'es' ? 'Checkea los campos' : 'Check the fields')
                return toast.remove(loading)
            }
            const logged = await subscribe(data)
            if (logged) {
                toast.success(TEXT[lang]['subscribe_ok'])
                setTimeout(() => router.push('/'), 1500)
            } else toast.error(TEXT[lang]['subscribe_error'])

            return toast.remove(loading)
        } catch (error) {
            toast.error(TEXT[lang]['subscribe_error'])
        }
    }

    return (
        <div className='subscribe__container'>
            <h2 style={{ fontFamily: 'var(--font-madelyn), sans-serif', fontSize: '3rem', margin: '2rem 0 0 0' }}>{lang === 'es' ? 'Únete a mi Comunidad' : 'Join my Mail Community'}</h2>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 'normal' }}>{lang === 'es' ? 'Únete y recibe cartas mensuales 🖤' : 'Sign up for monthly letters 🖤'}</h3>
            <div className="postviewer__subscribe-row">
                <InputField
                    name='fullname'
                    updateData={updateData}
                    placeholder='Your full name'
                />
                <InputField
                    name='email'
                    updateData={updateData}
                    placeholder='Your email'
                    type='email'
                />
                <Button
                    label={lang === 'es' ? 'Únete' : 'Join'}
                    handleClick={onSubscribe}
                    disabled={!data.email || !data.fullname}
                    style={{ width: isMobile ? '100%' : '' }}
                />
            </div>
        </div >
    )
}