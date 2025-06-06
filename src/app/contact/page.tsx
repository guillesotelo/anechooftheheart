"use client"

import { useContext, useState } from 'react'
import InputField from '../../components/InputField/InputField'
import Button from '../../components/Button/Button'
import { AppContext } from '../../app/context/AppContext'
import { TEXT } from '../../constants/lang'
import { sendContactEmail } from '../../services/app'
import { onChangeEventType } from '../../app/types'

type Props = {}

export default function Contact({ }: Props) {
    const [data, setData] = useState({ email: '', name: '', message: '' })
    const [messageSent, setMessageSent] = useState(false)
    const [loading, setLoading] = useState(false)
    const { lang } = useContext(AppContext)

    const updateData = (key: string, e: onChangeEventType) => {
        const value = e.target.value
        setData({ ...data, [key]: value })
    }

    const sendEmail = async () => {
        try {
            setLoading(true)
            const sent = await sendContactEmail(data)
            if(sent) setMessageSent(true)
            setLoading(false)
        } catch (err) {
            console.error(err)
            setLoading(false)
        }
    }

    return messageSent ?
        <div className="contact__container">
            <h1 className="contact__title" > {TEXT[lang]['thank_you_msg']}</h1>
            <p className="contact__text">{TEXT[lang]['will_respond']}</p>
        </div >
        :
        <div className="contact__container">
            <div className="contact__row-container">
                <div className="contact__info">
                    <h1>{TEXT[lang]['contact_me']}</h1>
                    <p>{TEXT[lang]['have_a_question']}</p>
                </div>
                <div className="contact__box">
                    <InputField
                        name='name'
                        updateData={updateData}
                        placeholder={TEXT[lang]['your_name']}
                        type='text'
                    />
                    <InputField
                        name='email'
                        updateData={updateData}
                        placeholder={TEXT[lang]['your_email']}
                        type='email'
                    />
                    <InputField
                        name='message'
                        updateData={updateData}
                        placeholder={TEXT[lang]['your_message']}
                        type='textarea'
                        rows={7}
                    />
                    <Button
                        label={TEXT[lang]['sent']}
                        handleClick={sendEmail}
                        disabled={!data.email || !data.name || !data.message || loading}
                        style={{ width: '100%' }}
                    />
                </div>
            </div>
        </div>
}

