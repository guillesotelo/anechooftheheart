"use client"

import { useContext, useEffect, useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import InputField from '../../components/InputField/InputField'
import Button from '../../components/Button/Button'
import { createPost, updatePost } from '../../services/post'
import { toast } from 'react-hot-toast'
import { getPostById } from '../../services/post'
import { AppContext } from '../context/AppContext'
import { TEXT } from '../../constants/lang'
import Slider from '../../components/Slider/Slider'
import { dataObj, onChangeEventType, postType } from '../types'
import Switch from '../../components/Switch/Switch'
import Dropdown from '../../components/Dropdown/Dropdown'
import { clearDB, getAllRecordsFromDB, saveItemToDB } from '../../indexedDB'
import imageCompression from 'browser-image-compression';
import { convertToBase64, createSlug, getUser } from '../../helpers'
import Tooltip from '../../components/Tooltip/Tooltip'
import { usePathname, useRouter } from 'next/navigation'

type Props = {}
const voidData = {
    title: '',
    subtitle: '',
    tags: '',
    category: '',
    description: '',
    imageUrl: '',
    overlap: '',
    sideImage: '',
    spaTitle: '',
    spaSubtitle: '',
    spaDescription: '',
    spaOverlap: '',
    video: '',
    imageUrlTitle: ''
}

export default function PostEditor({ }: Props) {
    const [data, setData] = useState(voidData)
    const [isEdited, setIsEdited] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)
    const [spaSelected, setSpaSelected] = useState(false)
    const [published, setPublished] = useState(false)
    const [postId, setPostId] = useState('')
    const [sideImages, setSideImages] = useState<string[]>([])
    const [sideImgStyles, setSideImgStyles] = useState<dataObj[]>([])
    const [html, setHtml] = useState('')
    const [spaHtml, setSpaHtml] = useState('')
    const [hasAutosave, setHasAutosave] = useState(false)
    const [showSide, setShowSide] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(['Inspiration'])
    const router = useRouter()
    const pathname = usePathname()
    const { lang, isMobile, isLoggedIn } = useContext(AppContext)
    const imageUrlRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        if (isLoggedIn !== null && !isLoggedIn) return router.push('/')
        activateRenderEffects()
    }, [isLoggedIn])

    useEffect(() => {
        const isNew = new URLSearchParams(document.location.search).get('new')
        const id = new URLSearchParams(document.location.search).get('id')

        if (isNew) {
            setData(voidData)
            setHtml('')
            setSpaHtml('')
            setIsEdited(false)
            setPostId('')
        }
        else if (id) {
            getPost(id)
            setPostId(id)
        }

        processAutosave(id, isNew)
    }, [pathname])

    // useEffect(() => {
    //     if (postId && !html && !spaHtml) getPost(postId)
    // }, [postId])

    useEffect(() => {
        const statusBar = document.querySelector('.tox-statusbar')
        if (statusBar) statusBar.remove()
        if (isEdited) saveLocalPost()
    }, [data, html, spaHtml])

    const processAutosave = async (id: string | null, isNew: string | null) => {
        try {
            const items = await getAllRecordsFromDB()

            if (Object.keys(items).length) {
                const autosavedHtml = items[id || 'new']?.html
                const autosavedSpaHtml = items[id || 'new']?.spaHtml

                const autosavedId = localStorage.getItem('autosavedId')
                if ((autosavedId === id || (isNew && autosavedId === 'new')) && (autosavedHtml || autosavedSpaHtml)) setHasAutosave(true)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const saveLocalPost = async () => {
        try {
            if (html && !spaHtml) await saveItemToDB({ html, id: postId || 'new' })
            else if (!html && spaHtml) await saveItemToDB({ spaHtml, id: postId || 'new' })
            else if (html && spaHtml) await saveItemToDB({ html, spaHtml, id: postId || 'new' })
            localStorage.setItem('autosavedData', JSON.stringify(data))
            localStorage.setItem('autosavedId', postId || 'new')
        } catch (error) {
            toast(
                'Error running autosave. Write with caution.',
                {
                    duration: 4000,
                }
            )
        }
    }

    const activateRenderEffects = () => {
        let position = 0
        window.addEventListener('scroll', function () {
            const item = document.querySelector('.tox-editor-header') as HTMLElement
            if (item) {
                const itemPosition = item.getBoundingClientRect().top
                const scrollTop = document.documentElement.scrollTop

                if (itemPosition < 40 && !item.classList.contains('tox-editor-header--fixed')) {
                    position = scrollTop
                    item.classList.add('tox-editor-header--fixed')
                } else {
                    if (item.classList.contains('tox-editor-header--fixed') && position >= scrollTop) {
                        item.classList.remove('tox-editor-header--fixed')
                    }
                }
            }
        })
    }

    const loadAutoSave = async () => {
        const items = await getAllRecordsFromDB()

        const autosavedHtml = items[postId || 'new'].html
        const autosavedSpaHtml = items[postId || 'new'].spaHtml

        const autosaveData = JSON.parse(localStorage.getItem('autosavedData') || '{}') || {}
        setData(autosaveData)
        setHtml(autosavedHtml || '')
        setSpaHtml(autosavedSpaHtml || '')

        toast.success('Autosave loaded')
        await clearDB()
    }

    const getPost = async (id: string) => {
        try {
            const _post = await getPostById(id)
            if (_post && _post._id) {
                setData(_post)
                setIsUpdate(true)
                if (_post.html) {
                    setHtml(_post.html)
                }
                if (_post.spaHtml) {
                    setSpaHtml(_post.spaHtml)
                }
                if (_post.sideImgs) {
                    const sideImgs = JSON.parse(_post.sideImgs)
                    setSideImages(sideImgs)
                }
                if (_post.sideStyles) {
                    const sideStyles = JSON.parse(_post.sideStyles)
                    setSideImgStyles(sideStyles)
                }
                setPublished(_post.published || false)
                setSelectedCategory(_post.category.includes('[') ? JSON.parse(_post.category || '[]') : [_post.category])
                // This is a horrible fix, but lets stay with this for now:
                setTimeout(() => handleEditorChange(spaSelected && _post.spaHtml ? _post.spaHtml : _post.html || ''), 200)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const updateData = (key: string, e: onChangeEventType) => {
        if (!isEdited) setIsEdited(true)
        const value = e.target.value
        setData({ ...data, [key]: value })
    }

    const handleEditorChange = (state: string) => {
        if (spaSelected) setSpaHtml(state)
        else setHtml(state)
        setIsEdited(true)
    }

    const handleSave = async () => {
        try {
            const loading = toast.loading(isUpdate ? TEXT[lang]['updating'] : TEXT[lang]['saving'])
            const sideImgs = JSON.stringify(sideImages)
            const sideStyles = JSON.stringify(sideImgStyles)

            if (!data.title && !data.spaTitle) {
                toast.remove(loading)
                return toast.error('Please enter a title')
            }

            if (isUpdate) {
                const title = data.title.trim() || data.spaTitle.trim() || `New Post [${(Math.random() * 10000).toFixed(0)}]`
                const updatedPost: postType = {
                    ...data,
                    title,
                    spaTitle: data.spaTitle.trim(),
                    sideImgs,
                    sideStyles,
                    html,
                    spaHtml,
                    published,
                    category: JSON.stringify(selectedCategory),
                    slug: createSlug(title)
                }
                const updated = await updatePost(updatedPost, getUser())
                if (updated && updated._id) {
                    localStorage.removeItem('posts')
                    toast.success(TEXT[lang]['saving_ok'])
                    setTimeout(() => router.push(`/post/${updated.slug}`), 1500)
                }
                else {
                    toast.error(TEXT[lang]['error_saving'])
                    return toast.remove(loading)
                }
                getPost(postId)
            } else {
                const postData = {
                    ...data,
                    title: data.title.trim(),
                    spaTitle: data.spaTitle.trim(),
                    sideImgs,
                    sideStyles,
                    html,
                    spaHtml,
                    published,
                    category: JSON.stringify(selectedCategory),
                    slug: createSlug(data.title.trim() || data.spaTitle.trim())
                }
                const saved = await createPost(postData, getUser())
                if (saved && saved._id) {
                    localStorage.removeItem('posts')
                    toast.success(TEXT[lang]['saving_ok'])
                    setTimeout(() => router.push(`/post/${saved.slug}`), 1500)
                } else {
                    toast.error(TEXT[lang]['error_saving'])
                    return toast.remove(loading)
                }
            }
            setHtml('')
            setSpaHtml('')
            setData(voidData)
            localStorage.removeItem('posts')
            setIsEdited(false)
            return toast.remove(loading)
        } catch (error) {
            toast.error('Error saving post. Please try again')
        }
    }

    const addSideImage = () => {
        if (data.sideImage) {
            setSideImages(sideImages.concat(data.sideImage))
        } else toast.error(TEXT[lang]['invalid_image_url'])
        setData({ ...data, sideImage: '' })
    }

    const removeSideImage = (index: number) => {
        const _sideImages = [...sideImages]
        _sideImages.splice(index, 1)
        setSideImages(_sideImages)
    }

    const updateImgStyles = (prop: string, newValue: string | number, index: number) => {
        const imgStyles = [...sideImgStyles]
        imgStyles[index] = { ...imgStyles[index], [prop]: newValue }
        setSideImgStyles(imgStyles)
    }

    const getImageProp = (prop: string, index: number) => {
        return sideImgStyles[index] && sideImgStyles[index][prop] ? sideImgStyles[index][prop] : 0
    }

    const uploadImage = async (e: any) => {
        if (e.target.files) {
            const file = e.target.files[0]
            const compressOptions = {
                maxSizeMB: 0.45,
                maxWidthOrHeight: 1000,
                useWebWorker: true
            }

            const compressedFile = await imageCompression(file, compressOptions)
            const base64 = await convertToBase64(compressedFile)
            const title = file.name

            setData(data => ({
                ...data,
                imageUrl: String(base64),
                imageUrlTitle: title
            }))
        }
    }

    const filePickerCallback = (callback: any) => {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/*')

        input.onchange = async () => {
            if (input.files) {
                const file = input.files[0]
                const compressOptions = {
                    maxSizeMB: 0.45,
                    maxWidthOrHeight: 1000,
                    useWebWorker: true
                }

                const compressedFile = await imageCompression(file, compressOptions)
                const base64 = await convertToBase64(compressedFile)

                callback(base64, { title: file.name })
            }
        }
        input.click()
    }

    const openFilePicker = () => {
        if (imageUrlRef.current) {
            imageUrlRef.current.click()
        }
    }


    return isLoggedIn ?
        <div className='editor__container'>
            <div className="editor__left-col">
                <h1 className="page__title">{postId && data.title ? `Editing: ${data.title}` : 'New Post'}</h1>
                <div
                    className="editor__tab-row"
                    style={{
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: isMobile ? '1rem' : ''
                    }}>
                    <div className="editor__tab-container">
                        <h4 className={`editor__tab-item ${!spaSelected ? 'editor__tab--selected' : ''}`} onClick={() => setSpaSelected(false)}>English (default)</h4>
                        <h4 className={`editor__tab-item ${spaSelected ? 'editor__tab--selected' : ''}`} onClick={() => setSpaSelected(true)}>Español</h4>
                    </div>
                    <div className='editor__switch-btns'>
                        <Dropdown
                            label='Categories'
                            options={['Career Insights', 'Inspiration', 'Life Abroad', 'Motherhood']}
                            selected={selectedCategory}
                            value={selectedCategory}
                            setSelected={setSelectedCategory}
                            style={{ maxWidth: '12rem' }}
                            multiselect
                        />
                        <Switch
                            label='Published'
                            on='Yes'
                            off='No'
                            value={published}
                            setValue={setPublished}
                        />
                        <Switch
                            label='Side images'
                            on='Yes'
                            off='No'
                            value={showSide}
                            setValue={setShowSide}
                        />
                    </div>
                </div>
                <div className="editor__tab-row">
                    {hasAutosave ?
                        <Button
                            label='Load autosave'
                            handleClick={loadAutoSave}
                            style={{ margin: '1rem 0' }}
                        /> : ''}
                </div>
                <div className="editor__data-input">
                    <div className="editor__input-col">
                        <InputField
                            name={spaSelected ? 'spaTitle' : 'title'}
                            value={spaSelected ? data.spaTitle : data.title}
                            updateData={updateData}
                            placeholder='Title'
                        />
                        <InputField
                            name={spaSelected ? 'spaSubtitle' : 'subtitle'}
                            value={spaSelected ? data.spaSubtitle : data.subtitle}
                            updateData={updateData}
                            placeholder='Sub-title'
                        />
                        <InputField
                            name='tags'
                            value={data.tags}
                            updateData={updateData}
                            placeholder='Tags (e.g experience, study, worship)'
                        />
                    </div>
                    <div className="editor__input-col">
                        <div className='editor__input-image'>
                            <InputField
                                name='imageUrl'
                                value={data.imageUrlTitle || data.imageUrl}
                                updateData={updateData}
                                placeholder='Image URL (https://example.com/image.png)'
                                style={{ width: '90%' }}
                                disabled={Boolean(data.imageUrlTitle)}
                            />
                            {data.imageUrl ? <img src={data.imageUrl} alt='Image URL' className='editor__image-url' /> : ''}
                            <Tooltip tooltip='Upload image'>
                                <Button
                                    svg={'/assets/icons/upload.svg'}
                                    handleClick={openFilePicker}
                                    bgColor='transparent'
                                    textColor='#fff'
                                />
                            </Tooltip>
                            <input ref={imageUrlRef} type='file' accept='image/*' onChange={uploadImage} style={{ display: 'none' }} />
                        </div>
                        <InputField
                            name={spaSelected ? 'spaOverlap' : 'overlap'}
                            value={spaSelected ? data.spaOverlap : data.overlap}
                            updateData={updateData}
                            placeholder='Overlap (title over image)'
                        />
                        <InputField
                            name={spaSelected ? 'spaDescription' : 'description'}
                            value={spaSelected ? data.spaDescription : data.description}
                            updateData={updateData}
                            placeholder='Description (short text)'
                        />
                    </div>
                </div>
                <div className="editor__data-input">
                    <InputField
                        name='video'
                        value={data.video}
                        updateData={updateData}
                        placeholder='Video URL'
                        style={{ width: '100%' }}
                    />
                </div>
                <Editor
                    initialValue=''
                    value={spaSelected ? spaHtml : html}
                    onEditorChange={handleEditorChange}
                    apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                    init={{
                        height: 1000,
                        width: 750,
                        menubar: true,
                        plugins: 'link image lists wordcount emoticons',
                        statusbar: false,
                        toolbar:
                            'undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons wordcount',
                        file_picker_callback: filePickerCallback
                    }}
                />
                {!isMobile ?
                    <div className="editor__btns">
                        <Button
                            label='Discard'
                            handleClick={() => isUpdate ? router.back() : router.refresh()}
                            bgColor='lightgray'
                            disabled={!isEdited && !isUpdate}
                            style={{ width: '45%' }}
                        />
                        <Button
                            label={isUpdate ? 'Update' : 'Save'}
                            handleClick={handleSave}
                            disabled={!isEdited && !isUpdate}
                            style={{ width: '45%' }}
                        />
                    </div>
                    : ''}
            </div>
            {showSide ?
                <div className="editor__right-col">
                    <h1 className="editor__side-images-title">Side Images</h1>
                    <div className="editor__side-images-list">
                        {sideImages.map((image, i) =>
                            <div key={i}>
                                <Slider
                                    name=''
                                    type=''
                                    label='Image Size'
                                    sign='px'
                                    value={getImageProp('width', i) || 500}
                                    setValue={value => updateImgStyles('width', value, i)}
                                    min={1}
                                    max={1000}
                                />
                                <div key={i} className="editor__side-images-item-wrapper" style={{ maxWidth: getImageProp('width', i) || '100%' }}>
                                    <img
                                        className='editor__side-images-item'
                                        src={image}
                                        alt='Post Image'
                                        loading='lazy'
                                        style={sideImgStyles[i] || {}}
                                    />
                                    <h4 className="editor__side-images-item-remove" onClick={() => removeSideImage(i)}>X</h4>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="editor__side-images-input">
                        <InputField
                            name='sideImage'
                            value={data.sideImage}
                            updateData={updateData}
                            placeholder='Add new image (https://example.com/image.png)'
                        />
                        <Button
                            label='Add'
                            handleClick={addSideImage}
                            disabled={!isEdited && !isUpdate}
                        />
                    </div>
                </div> : ''}
            {isMobile ?
                <div className="editor__btns">
                    <Button
                        label='Discard changes'
                        handleClick={() => isUpdate ? router.back() : router.refresh()}
                        bgColor='lightgray'
                        disabled={!isEdited && !isUpdate}
                    />
                    <Button
                        label={isUpdate ? 'Update post' : 'Save post'}
                        handleClick={handleSave}
                        disabled={!isEdited && !isUpdate}
                    />
                </div> : ''}
        </div >
        : <div></div>
}
