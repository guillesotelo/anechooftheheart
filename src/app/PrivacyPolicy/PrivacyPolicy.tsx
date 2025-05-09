import React, { useContext } from 'react'
import { TEXT } from '../../constants/lang'
import { AppContext } from '../../AppContext'

type Props = {}

export default function PrivacyPolicy({ }: Props) {
    const { lang, isMobile } = useContext(AppContext)
    return (
        <div className="privacy__container" dangerouslySetInnerHTML={{ __html: TEXT[lang]['privacy_policies'] }}/>
    )
}