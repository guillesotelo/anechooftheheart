"use client"

import React, { useContext, useState } from 'react'
import { loginUser } from '../../services/user'
import { toast } from 'react-hot-toast';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import { TEXT } from '../../constants/lang';
import { AppContext } from '../context/AppContext';
import { onChangeEventType } from '../types';
import { useRouter } from 'next/navigation';

type Props = {}

export default function Login({ }: Props) {
    const [data, setData] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { lang, setIsLoggedIn } = useContext(AppContext)

    const updateData = (key: string, e: onChangeEventType) => {
        const value = e.target.value
        setData({ ...data, [key]: value })
    }

    const onLogin = async () => {
        setLoading(true)
        const loading = toast.loading('Logging in...')
        const logged = await loginUser(data)
        if (logged) {
            toast.success(`Welcome, ${logged.username ? logged.username.split(' ')[0] : 'Dany'}!`)
            setIsLoggedIn(true)
            setTimeout(() => router.push('/'), 1500)
        } else toast.error('Error logging in, try again later')
        setLoading(false)
        return toast.remove(loading)
    }

    return (
        <div className="login__container">
            <h4 className="page__header-title">LOGIN</h4>
            <div className="login__box">
                <InputField
                    name='email'
                    updateData={updateData}
                    placeholder={TEXT[lang]['email']}
                    type='email'
                />
                <InputField
                    name='password'
                    updateData={updateData}
                    placeholder={TEXT[lang]['password']}
                    type='password'
                />
                <Button
                    label={TEXT[lang]['login']}
                    handleClick={onLogin}
                    disabled={!data.email || !data.password || loading}
                    style={{ width: '100%' }}
                />
            </div>
        </div>
    )
}