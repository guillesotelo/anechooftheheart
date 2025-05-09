import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../app/context/AppContext'
import { APP_COLORS } from '../../constants/app'

type Props = {
    label?: string
    className?: string
    bgColor?: string
    textColor?: string
    handleClick: () => any
    disabled?: boolean
    showTip?: boolean
    svg?: string
    style?: React.CSSProperties
    tooltip?: string
}

export default function Button({ label, handleClick, className, bgColor, textColor, disabled, svg, style, tooltip, showTip }: Props) {
    const [buttonStyle, setButtonStyle] = useState<React.CSSProperties>({ ...style })
    const [showTooltip, setShowTooltip] = useState<boolean | null>(showTip || false)
    const { darkMode } = useContext(AppContext)

    useEffect(() => {
        setButtonStyle({
            ...buttonStyle,
            backgroundColor: bgColor || APP_COLORS.BLUEGREEN,
            color: textColor || '#fff',
        })
    }, [darkMode])

    useEffect(() => {
        if (showTip === null || showTip === false) setShowTooltip(showTip)
    }, [showTip])

    const clickButton = () => {
        setShowTooltip(null)
        handleClick()
    }

    const renderButton = () => {
        return svg ?
            <div
                className="button__icon"
                onClick={clickButton}
                style={{
                    backgroundColor: bgColor || APP_COLORS.BLUEGREEN,
                    border: `1px solid ${bgColor || APP_COLORS.BLUEGREEN}`,
                    color: textColor || '#fff',
                    opacity: disabled ? '.3' : '',
                    cursor: disabled ? 'not-allowed' : '',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '.5rem',
                    paddingInline: label ? '.5rem' : 0,
                    ...buttonStyle
                }}
                onMouseEnter={() => setButtonStyle({
                    ...style,
                    backgroundColor: 'transparent',
                    color: !darkMode ? bgColor : APP_COLORS.BLUEGREEN
                })}
                onMouseLeave={() => setButtonStyle({
                    ...style,
                    backgroundColor: bgColor || APP_COLORS.BLUEGREEN,
                    color: textColor || '#fff',
                })}
            >
                <img src={svg} style={{ filter: darkMode ? 'invert(1) brightness(.7)' : '' }} alt="Button" className='button__svg' />
                {label || ''}
            </div>
            :
            <button
                className={className || 'button__default'}
                onClick={clickButton}
                style={{
                    backgroundColor: bgColor || APP_COLORS.BLUEGREEN,
                    border: `1px solid ${bgColor || APP_COLORS.BLUEGREEN}`,
                    color: textColor || '#fff',
                    opacity: disabled ? '.3' : '',
                    cursor: disabled ? 'not-allowed' : '',
                    ...buttonStyle
                }}
                disabled={disabled}
                onMouseEnter={() => setButtonStyle({
                    ...style,
                    backgroundColor: 'transparent',
                    color: bgColor || APP_COLORS.BLUEGREEN
                })}
                onMouseLeave={() => setButtonStyle({
                    ...style,
                    backgroundColor: bgColor || APP_COLORS.BLUEGREEN,
                    color: textColor || '#fff',
                })}
            >
                {label || ''}
            </button>
    }

    return renderButton()
}