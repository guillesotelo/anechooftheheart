"use client"

import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import DataTable from '../../../components/DataTable/DataTable'
import { productHeaders } from '../../../constants/tableHeaders'
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct, updateProductOrder } from '../../../services/product'
import { productType } from '../../types'
import Modal from '../../../components/Modal/Modal'
import InputField from '../../../components/InputField/InputField'
import Button from '../../../components/Button/Button'
import toast from 'react-hot-toast'
import Switch from '../../../components/Switch/Switch'
import Dropdown from '../../../components/Dropdown/Dropdown'
import { HashLoader, RingLoader } from 'react-spinners'
import Tooltip from '../../../components/Tooltip/Tooltip'
import { useRouter } from 'next/navigation'
import { getUser } from 'src/helpers'

type Props = {}

export default function EditStore({ }: Props) {
    const [products, setProducts] = useState<productType[]>([])
    const [selectedProduct, setSelectedProduct] = useState(-1)
    const [product, setProduct] = useState<productType>({ active: true })
    const [openModal, setOpenModal] = useState(false)
    const [isNew, setIsNew] = useState(false)
    const [loading, setLoading] = useState(false)
    const [removeProduct, setRemoveProduct] = useState(false)
    const [loadingImages, setLoadingImages] = useState(false)
    const [changeOrder, setChangeOrder] = useState(false)
    const [compress, setCompress] = useState(false)
    const { isLoggedIn, isMobile } = useContext(AppContext)
    const router = useRouter()

    useEffect(() => {
        getProducts()
    }, [])

    useEffect(() => {
        if (selectedProduct !== -1) getProduct(products[selectedProduct]._id || '')
        else setProduct({ active: true })
    }, [selectedProduct])

    useEffect(() => {
        const body = document.querySelector('body')
        if (selectedProduct !== -1) {
            if (body) body.style.overflowY = 'hidden'
        } else {
            if (body) body.style.overflowY = 'auto'
        }
    }, [selectedProduct])

    const getProduct = async (id: string) => {
        try {
            setLoadingImages(true)
            const _product = await getProductById(id)
            if (_product && _product._id) {
                setProduct(_product)
                setOpenModal(true)
            }
            setLoadingImages(false)
        } catch (error) {
            setLoadingImages(false)
            console.error(error)
        }
    }

    const getProducts = async () => {
        try {
            const _products = await getAllProducts(getUser())
            if (_products && Array.isArray(_products)) setProducts(_products)
        } catch (error) {
            console.error(error)
        }
    }

    const updateData = (key: string, e: any) => {
        const value = e.target.value
        setProduct({ ...product, [key]: value })
    }

    const saveNewProduct = async () => {
        try {
            if (checkData()) return toast.error('Check required fields.')
            setLoading(true)
            const saved = await createProduct(product, getUser())
            if (saved) {
                toast.success('Product saved successfully!')
                setSelectedProduct(-1)
                setOpenModal(false)
                setIsNew(false)
                getProducts()
                setProduct({ active: true })
            } else toast.error('Error saving product. Please try again.')
            setLoading(false)
        } catch (error) {
            setLoading(false)
            toast.error('Error saving product. Please try again.')
            console.error(error)
        }
    }

    const updateProductData = async () => {
        try {
            if (checkData()) return toast.error('Check required fields.')
            setLoading(true)
            const saved = await updateProduct({ ...product, compress }, getUser())
            if (saved) {
                toast.success('Product updated successfully!')
                setSelectedProduct(-1)
                setOpenModal(false)
                getProducts()
                setProduct({ active: true })
            } else toast.error('Error saving product. Please try again.')
            setLoading(false)
        } catch (error) {
            setLoading(false)
            toast.error('Error saving product. Please try again.')
            console.error(error)
        }
    }

    const saveTableDataOrder = async (items: productType[]) => {
        try {
            setLoading(true)
            const updatedProducts = await updateProductOrder(items.map((item, i) => { return { ...item, order: i } }), getUser())
            if (updatedProducts && updatedProducts.length) {
                setProducts(updatedProducts)
                toast.success('Order updated successfully')
            }
            else toast.error('Error updating order')
            setLoading(false)
        } catch (error) {
            setLoading(false)
            toast.error('Error updating order')
            console.error(error)
        }
    }

    const checkData = () => {
        if (!product.title || (product.price && !product.currency)) return true
    }

    const cancel = () => {
        setOpenModal(false)
        setSelectedProduct(-1)
        setIsNew(false)
        setRemoveProduct(false)
    }

    const deleteSelectedProduct = async () => {
        try {
            setLoading(true)
            const deleted = await deleteProduct(product, getUser())
            if (deleted) {
                toast.success('Product deleted successfully!')
                setSelectedProduct(-1)
                setOpenModal(false)
                setRemoveProduct(false)
                getProducts()
            } else toast.error('Error deleting product. Please try again.')
            setLoading(false)
        } catch (error) {
            setLoading(false)
            toast.error('Error deleting product. Please try again.')
            console.error(error)
        }
    }

    const getImages = (imgStr?: string) => {
        return JSON.parse(imgStr || '[]')
    }

    const reorderImages = (images: string | undefined, index: number) => {
        const copyImages = [...getImages(images)]
        const [item] = copyImages.splice(index, 1)
        copyImages.unshift(item)
        setProduct(prev => ({ ...prev, images: JSON.stringify(copyImages) }))
    }

    return isLoggedIn ?
        <div className="editstore__container">
            <h1 className='editstore__title' style={{ filter: openModal ? 'blur(4px)' : '' }}>Edit Store</h1>
            {removeProduct ?
                <Modal title='Are you sure you want to remove this product?' onClose={cancel}>
                    <p>Title: {product.title}</p>
                    <p>Price: {product.price}</p>
                    <div className="editstore__modal-buttons">
                        <Button
                            label='Cancel'
                            handleClick={cancel}
                            bgColor='lightgray'
                            disabled={loading}
                            style={{ width: '100%' }}
                        />
                        <Button
                            label='Confirm deletion'
                            handleClick={deleteSelectedProduct}
                            disabled={loading}
                            style={{ width: '100%' }}
                        />
                    </div>
                </Modal>
                :
                openModal &&
                <Modal
                    title={isNew ? 'Create Product' : 'Edit Product'}
                    subtitle={isNew ? '' : product.title}
                    style={{ width: isMobile ? '90vw' : '40vw' }}
                    onClose={cancel}>
                    <div className="editstore__modal">
                        <div className="editstore__row">
                            <InputField
                                label='Title'
                                name='title'
                                updateData={updateData}
                                disabled={loading || loadingImages}
                                value={product.title}
                            />
                            <Dropdown
                                label='Categories'
                                options={['Handmade Crowns', 'Gifts', 'Jewelry']}
                                selected={JSON.parse(product.category || '[]')}
                                value={JSON.parse(product.category || '[]')}
                                setSelected={value => updateData('category', { target: { value: JSON.stringify(value) } })}
                                multiselect
                                style={{ width: '14rem' }}
                            />
                        </div>
                        <div className="editstore__row">
                            <InputField
                                label='Price'
                                name='price'
                                updateData={updateData}
                                disabled={loading || loadingImages}
                                value={product.price}
                            />
                            <Dropdown
                                label='Currency'
                                options={['SEK', '€', '$', '£', 'ARS', 'COP']}
                                selected={product.currency}
                                value={product.currency}
                                setSelected={value => updateData('currency', { target: { value } })}
                                maxHeight='9rem'
                            />
                            <Dropdown
                                label='Stock'
                                options={Array.from({ length: 30 }).map((_, i) => i + 1)}
                                selected={product.stock}
                                value={product.stock}
                                setSelected={value => updateData('stock', { target: { value } })}
                                maxHeight='9rem'
                            />
                            <Switch
                                label='Active'
                                on='Yes'
                                off='No'
                                value={product.active}
                                setValue={value => updateData('active', { target: { value } })}
                            />
                        </div>
                        {loadingImages ? <div className="editstore__row" style={{ alignItems: 'center' }}>
                            <RingLoader size={10} /><p> Uploading images...</p>
                        </div> :
                            <div className="editstore__row">
                                <InputField
                                    label='Image upload'
                                    name='image'
                                    type='file'
                                    images={getImages(product.images)}
                                    setImages={images => {
                                        setCompress(true)
                                        updateData('images', { target: { value: JSON.stringify(images) } })
                                    }}
                                    disabled={loading || loadingImages}
                                    multiple={true}
                                    setLoadingImages={setLoadingImages}
                                />
                            </div>}
                        {getImages(product.images).length ?
                            <div className="editstore__row" style={{ margin: '.5rem 0', overflowX: 'scroll' }}>
                                {getImages(product.images).map((image: string, i: number) =>
                                    <img
                                        key={i}
                                        src={image}
                                        alt={product.title}
                                        style={{ borderColor: i === 0 ? '#38a3c5' : '' }}
                                        onClick={() => reorderImages(product.images, i)}
                                        className="editstore__modal-image" />
                                )}
                            </div> : ''}
                        <InputField
                            label='Description'
                            name='description'
                            type='textarea'
                            rows={6}
                            updateData={updateData}
                            disabled={loading || loadingImages}
                            value={product.description}
                        />
                        <div className="editstore__modal-buttons">
                            <Button
                                label='Cancel'
                                handleClick={cancel}
                                bgColor='lightgray'
                                disabled={loading}
                                style={{ width: '100%' }}
                            />
                            <Button
                                label='Save changes'
                                handleClick={isNew ? saveNewProduct : updateProductData}
                                disabled={loading || loadingImages}
                                style={{ width: '100%' }}
                            />
                        </div>
                        {!isNew && <Button
                            label='Delete'
                            handleClick={() => setRemoveProduct(true)}
                            bgColor='#ffb7b7'
                            disabled={loading}
                            style={{ width: '100%', marginTop: '1rem' }}
                        />}
                    </div>
                </Modal>}
            <div className="editstore__row" style={{ filter: openModal ? 'blur(4px)' : '' }}>
                <Button
                    label='View store'
                    handleClick={() => {
                        router.push('/store')
                    }}
                    disabled={loading}
                    style={{ margin: '1rem 0 2rem', filter: openModal ? 'blur(4px)' : '' }}
                />
                <Button
                    label='+ &nbsp;Create new product'
                    handleClick={() => {
                        setIsNew(true)
                        setOpenModal(true)
                    }}
                    style={{ margin: '1rem 1rem 2rem', filter: openModal ? 'blur(4px)' : '' }}
                    disabled={loading}
                />
                <Tooltip tooltip='Change product order with D&D'>
                    <Switch
                        label='Change order'
                        on='Yes'
                        off='No'
                        value={changeOrder}
                        setValue={() => setChangeOrder(v => !v)}
                    />
                </Tooltip>
            </div>
            {changeOrder && <p className='editstore__tooltip'>👇 Drag & Drop products to set the order in Store & Home</p>}
            <DataTable
                title='Products'
                name='products'
                tableData={products}
                setTableData={setProducts}
                tableHeaders={productHeaders}
                selected={selectedProduct}
                setSelected={setSelectedProduct}
                style={{ width: '70vw', filter: openModal ? 'blur(4px)' : '' }}
                draggable={changeOrder}
                saveTableDataOrder={saveTableDataOrder}
                loading={loading} />
        </div>
        : <div className="editstore__container" style={{ alignItems: 'center' }}>
            <div className='store__loader'><HashLoader size={15} /><p>{isLoggedIn === null ? 'Loading Store...' : 'Permission denied.'}</p></div>
        </div>
}