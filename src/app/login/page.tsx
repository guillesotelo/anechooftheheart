'use client'

import React, { useContext, useState } from 'react'
import { loginUser } from '../../services'
import { toast } from 'react-hot-toast';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import { AppContext } from '../context/AppContext';
import { onChangeEventType } from '../types';
import { useRouter } from 'next/navigation';

type Props = {}

export default function Login({ }: Props) {
    const [data, setData] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { setIsLoggedIn } = useContext(AppContext)

    const updateData = (key: string, e: onChangeEventType) => {
        const value = e.target.value
        setData({ ...data, [key]: value })
    }

    const onLogin = async () => {
        setLoading(true)
        const loading = toast.loading('Logging in...')
        const logged = await loginUser(data)
        if (logged) {
            toast.success(`Welcome, ${logged.username.split(' ')[0]!}`)
            setIsLoggedIn(true)
            localStorage.setItem('user', JSON.stringify({
                ...logged,
                login: new Date()
            }))
            setTimeout(() => router.push('/editor'), 1500)
        } else toast.error('Error logging in, try again later')
        setLoading(false)
        return toast.remove(loading)
    }

    return (
        <div className="login__container">
            <h1 className="page__title">Login</h1>
            <div className="login__box">
                <InputField
                    label='Email'
                    name='email'
                    updateData={updateData}
                    type='email'
                />
                <InputField
                    label='Password'
                    name='password'
                    updateData={updateData}
                    type='password'
                />
                <Button
                    label='Login'
                    handleClick={onLogin}
                    disabled={!data.email || !data.password || loading}
                    style={{ width: '100%' }}
                    textColor='white'
                    bgColor='#114b5f'
                />
            </div>
        </div>
    )
}