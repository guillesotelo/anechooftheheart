"use client"

import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../app/context/AppContext'
import { onChangeEventType } from '../../app/types'
import toast from 'react-hot-toast'
import imageCompression from 'browser-image-compression';

type Props = {
    name: string
    updateData?: (name: string, e: onChangeEventType) => void
    className?: string
    type?: string
    label?: string
    placeholder?: string
    value?: string | number | null
    cols?: number
    rows?: number
    style?: React.CSSProperties
    disabled?: boolean
    onSubmit?: () => void
    images?: string[]
    setImages?: (value: string[]) => void
    multiple?: boolean
    setLoadingImages?: (value: boolean) => void
}

export default function InputField(props: Props) {
    const { darkMode } = useContext(AppContext)
    let isEnterKeyListenerAdded = false

    const {
        value,
        name,
        label,
        updateData,
        className,
        type,
        placeholder,
        cols,
        rows,
        style,
        disabled,
        onSubmit,
        images,
        setImages,
        multiple,
        setLoadingImages
    } = props

    useEffect(() => {
        if (onSubmit) {
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Enter') onSubmit()
            }
            if (!isEnterKeyListenerAdded) {
                document.addEventListener('keydown', handleKeyDown)
                isEnterKeyListenerAdded = true
            }
            return () => {
                document.removeEventListener('keydown', handleKeyDown)
                isEnterKeyListenerAdded = false
            }
        }
    }, [onSubmit])

    const convertToBase64 = (file: any) => {
        try {
            return new Promise((resolve, reject) => {
                const fileReader = new FileReader()
                fileReader.readAsDataURL(file)
                fileReader.onload = () => {
                    resolve(fileReader.result)
                }
                fileReader.onerror = (error) => {
                    reject(error)
                }
            })
        } catch (err) {
            console.error(err)
            toast.error('Error loading file. Please try again')
        }
    }

    const uploadFile = async (e: any) => {
        try {
            if (setLoadingImages) setLoadingImages(true)
            const files = e.target.files
            if (files && files.length) {
                let imgArray = []
                for (let i = 0; i < files.length; i++) {
                    const compressOptions = {
                        maxSizeMB: 0.3,
                        maxWidthOrHeight: 800,
                        useWebWorker: true
                    }

                    const compressedFile = await imageCompression(files[i], compressOptions)
                    const base64 = await convertToBase64(compressedFile)
                    imgArray.push(String(base64))
                }
                if (setImages) setImages(imgArray)
            }
            if (setLoadingImages) setLoadingImages(false)
        } catch (err) {
            if (setLoadingImages) setLoadingImages(false)
            console.error(err)
        }
    }


    return type === 'textarea' ?
        <div className='inputfield__container' style={style}>
            {label ? <h2 className={`inputfield__label${darkMode ? '--dark' : ''}`}>{label}</h2> : ''}
            <textarea
                className={className || `textarea__default${darkMode ? '--dark' : ''}`}
                placeholder={placeholder || ''}
                onChange={e => updateData ? updateData(name, e) : null}
                value={value || undefined}
                cols={cols}
                rows={rows}
                disabled={disabled}
            />
        </div>
        :
        <div className='inputfield__container' style={style}>
            {label ? <h2 className={`inputfield__label${darkMode ? '--dark' : ''}`}>{label}</h2> : ''}
            <input
                type={type || 'text'}
                className={className || `inputfield__default${darkMode ? '--dark' : ''}`}
                placeholder={placeholder || ''}
                accept={type === 'file' ? '.png, .jpg, .jpeg, .webp' : ''}
                onChange={e => type === 'file' ? uploadFile(e) : updateData ? updateData(name, e) : null}
                value={value || undefined}
                disabled={disabled}
                multiple={multiple}
            />
        </div>
}