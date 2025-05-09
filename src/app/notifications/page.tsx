import { useContext, useEffect, useState } from 'react'
import DataTable from '../../components/DataTable/DataTable'
import { subscriptionHeaders } from '../../constants/tableHeaders'
import { getAllEmails, sendNotification, updateSubscription } from '../../services/app'
import { getAllTemplates, createTemplate, updateTemplate } from '../../services/emailTemplate'
import { emailType, onChangeEventType, templateType } from '../types'
import Button from '../../components/Button/Button'
import Switch from '../../components/Switch/Switch'
import Dropdown from '../../components/Dropdown/Dropdown'
import InputField from '../../components/InputField/InputField'
import { AppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import Modal from '../../components/Modal/Modal'
import { subscribe } from '../../services/app'
import { useRouter } from 'next/navigation'

export default function Notifications() {
    const [data, setData] = useState<templateType>({})
    const [emailData, setEmailData] = useState<emailType>({})
    const [allEmails, setAllEmails] = useState<emailType[]>([])
    const [newEmail, setNewEmail] = useState(false)
    const [htmlViewer, setHtmlViewer] = useState(true)
    const [saveAsNew, setSaveAsNew] = useState(false)
    const [emailModal, setEmailModal] = useState(false)
    const [testModal, setTestModal] = useState(false)
    const [emailActive, setEmailActive] = useState(true)
    const [loading, setLoading] = useState(false)
    const [loadingTemplates, setLoadingTemplates] = useState(false)
    const [htmlContent, setHtmlContent] = useState('')
    const [selectedEmail, setSelectedEmail] = useState(-1)
    const [selectedTemplate, setSelectedTemplate] = useState<templateType>({})
    const [allTemplates, setAllTemplates] = useState<templateType[]>([])
    const { isMobile, isLoggedIn } = useContext(AppContext)
    const router = useRouter()

    useEffect(() => {
        if (isLoggedIn !== null && !isLoggedIn) return router.push('/')
        getEmails()
        getTemplates()
    }, [isLoggedIn])

    useEffect(() => {
        if (selectedEmail !== -1) {
            setEmailData({ ...allEmails[selectedEmail] })
            setEmailActive(allEmails[selectedEmail].isActive || false)
        }
    }, [selectedEmail])

    useEffect(() => {
        if (selectedTemplate._id) setHtmlContent(selectedTemplate.html || '')
        if (selectedTemplate.subject) setData({ ...data, subject: selectedTemplate.subject })
    }, [selectedTemplate])

    const getEmails = async () => {
        try {
            const emails = await getAllEmails()
            if (emails && Array.isArray(emails)) setAllEmails(emails)
        } catch (error) {
            console.error(error)
        }
    }

    const getTemplates = async () => {
        try {
            setLoadingTemplates(true)
            const templates = await getAllTemplates()
            if (templates && Array.isArray(templates)) setAllTemplates(templates)
            setLoadingTemplates(false)
        } catch (error) {
            setLoadingTemplates(false)
            console.error(error)
        }
    }

    const saveTemplate = async () => {
        try {
            setLoading(true)
            const saved = await createTemplate({ ...data, html: htmlContent })
            if (saved) {
                toast.success('Template saved!')
                setSaveAsNew(false)
                getTemplates()
            } else toast.error('Error saving template. Try again later.')
            setLoading(false)
        } catch (error) {
            setLoading(false)
            toast.error('Error saving template. Try again later.')
            console.error(error)
        }
    }

    const updateTemplateData = async () => {
        try {
            setLoading(true)
            if (!htmlContent) return toast.error('HTML content is empty')
            const saved = await updateTemplate({
                ...selectedTemplate,
                html: htmlContent,
                subject: data.subject
            })
            if (saved) {
                toast.success('Template saved!')
                getTemplates()
            } else toast.error('Error saving template. Try again later.')
            setLoading(false)
        } catch (error) {
            setLoading(false)
            toast.error('Error saving template. Try again later.')
            console.error(error)
        }
    }

    const sendNotifications = async () => {
        try {
            setLoading(true)
            const saved = await sendNotification({
                ...data,
                html: htmlContent,
                emailList: allEmails.map(data => data.email || '')
            })
            if (saved) {
                toast.success('Emails sent!')
                setEmailModal(false)
            } else toast.error('Error sending emails. Try again later.')
            setLoading(false)
        } catch (error) {
            setLoading(false)
            toast.error('Error sending emails. Try again later.')
            console.error(error)
        }
    }

    const sendTestEmail = async () => {
        try {
            if (!emailData.testEmails || !emailData.testEmails.includes('@')
                || !emailData.testEmails.includes('.')) return toast.error('Enter valid email(s)')
            setLoading(true)
            const saved = await sendNotification({
                ...data,
                html: htmlContent,
                emailList: emailData.testEmails?.replaceAll(' ', '').split(',')
            })
            if (saved) {
                toast.success('Test emails sent!')
                setEmailModal(false)
                setEmailModal(false)
            } else toast.error('Error sending emails. Try again later.')
            setLoading(false)
        } catch (error) {
            setLoading(false)
            toast.error('Error sending emails. Try again later.')
            console.error(error)
        }
    }

    const updateHtml = (name: string, e: onChangeEventType) => {
        setHtmlContent(e.target.value)
    }

    const updateData = (key: string, e: onChangeEventType) => {
        const value = e.target.value
        setData({ ...data, [key]: value })
    }

    const updateEmailData = (key: string, e: onChangeEventType) => {
        const value = e.target.value
        setEmailData({ ...emailData, [key]: value })
    }

    const discardEmail = () => {
        setNewEmail(false)
        setSelectedEmail(-1)
        setEmailData({})
    }

    const saveEmail = async () => {
        try {
            setLoading(true)
            const saved = newEmail ? await subscribe({ ...emailData, isActive: emailActive })
                : await updateSubscription({ ...emailData, isActive: emailActive })
            if (saved) {
                toast.success('Email saved')
                discardEmail()
                getEmails()
            } else toast.error('Error saving email. Try again later.')
            setLoading(false)
        } catch (error) {
            setLoading(false)
            toast.error('Error saving email. Try again later.')
            console.error(error)
        }
    }

    const clearTemplate = () => {
        setData({})
        setHtmlContent('')
        setSelectedTemplate({})
    }

    const modalFilter = () => emailModal || newEmail || selectedEmail !== -1 || testModal ? 'blur(3px)' : ''

    const renderDesktop = () => {
        return (
            <div className="notifications__container" >
                {emailModal ?
                    <Modal
                        title='Send Notifications'
                        onClose={() => setEmailModal(false)}>
                        <p style={{ textAlign: 'center' }}>You are about to send notifications to {allEmails.filter(email => email.isActive).length} active contacts.<br />Are you sure you want to proceed?</p>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Button
                                label='Cancel'
                                handleClick={() => setEmailModal(false)}
                                bgColor='transparent'
                                disabled={loading}
                            />
                            <Button
                                label='Confirm'
                                handleClick={sendNotifications}
                                disabled={loading}
                            />
                        </div>
                    </Modal>
                    : testModal ?
                        <Modal
                            title='Send Test Email'
                            onClose={() => setTestModal(false)}>
                            <div style={{ textAlign: 'center' }}>
                                <p >Enter the email recipients for the test, separated by comma.</p>
                                <InputField
                                    value={emailData.testEmails}
                                    updateData={updateEmailData}
                                    name='testEmails'
                                    placeholder='user@email.com, anotheruser@email.com, ...'
                                    style={{ width: '80%' }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '2rem' }}>
                                <Button
                                    label='Cancel'
                                    handleClick={() => setTestModal(false)}
                                    bgColor='transparent'
                                    disabled={loading}
                                />
                                <Button
                                    label='Send'
                                    handleClick={sendTestEmail}
                                    disabled={loading}
                                />
                            </div>
                        </Modal> : ''}
                {newEmail || selectedEmail !== -1 ?
                    <Modal
                        title={selectedEmail !== -1 ? 'New Email' : 'Email Details'}
                        onClose={discardEmail}>
                        <div className="notifications__col" style={{ gap: '1rem' }}>
                            <InputField
                                value={emailData.fullname}
                                updateData={updateEmailData}
                                name='fullname'
                                placeholder='Full Name'
                            />
                            <InputField
                                value={emailData.email}
                                updateData={updateEmailData}
                                name='email'
                                placeholder='Email'
                            />
                            <Switch
                                label='Is Active'
                                on='Yes'
                                off='No'
                                value={emailActive}
                                setValue={setEmailActive}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Button
                                label='Cancel'
                                handleClick={discardEmail}
                                bgColor='transparent'
                                disabled={loading}
                            />
                            <Button
                                label='Save'
                                handleClick={saveEmail}
                                disabled={loading}
                            />
                        </div>
                    </Modal> : ''}
                <div className="page__header" style={{ filter: modalFilter() }}>
                    <h4 className="page__header-title">EMAIL NOTIFICATIONS</h4>
                </div>
                <div className="notifications__row" style={{ filter: modalFilter() }}>
                    <div className="notifications__col" style={{ width: '45%' }}>
                        <h4 className="page__header-subtitle">TEMPLATE</h4>

                        <InputField
                            value={htmlContent}
                            updateData={updateHtml}
                            name=''
                            type='textarea'
                            style={{
                                width: '90%',
                                minHeight: '70vh'
                            }}
                            placeholder='Write or paste HTML here'
                        />
                    </div>
                    <div className="notifications__col" style={{ width: '10%', alignItems: 'center', marginTop: '4rem' }}>
                        <Switch
                            label='HTML Viewer'
                            on='ON'
                            off='OFF'
                            value={htmlViewer}
                            setValue={setHtmlViewer}
                        />
                        {saveAsNew ? '' :
                            <>
                                <Dropdown
                                    label='Template'
                                    options={allTemplates}
                                    selected={selectedTemplate}
                                    setSelected={setSelectedTemplate}
                                    objKey='name'
                                    style={{ marginTop: '1rem', width: '100%' }}
                                    loading={loadingTemplates}
                                />
                                <InputField
                                    name='subject'
                                    updateData={updateData}
                                    value={data.subject || ''}
                                    style={{ marginTop: '1rem', width: '92%' }}
                                    placeholder='Email Subject'
                                />
                                {selectedTemplate._id ?
                                    <Button
                                        label='Update Template'
                                        handleClick={updateTemplateData}
                                        style={{ marginTop: '1rem', width: '100%' }}
                                        disabled={loading}
                                    /> : ''}
                            </>}
                        {saveAsNew ?
                            <>
                                <InputField
                                    name='name'
                                    updateData={updateData}
                                    value={data.name || ''}
                                    style={{ marginTop: '2rem', width: '92%' }}
                                    placeholder='Template Name'
                                />
                                <InputField
                                    name='subject'
                                    updateData={updateData}
                                    value={data.subject || ''}
                                    style={{ marginTop: '2rem', width: '92%' }}
                                    placeholder='Email Subject'
                                />
                                <Button
                                    label='Save Template'
                                    handleClick={saveTemplate}
                                    style={{ marginTop: '1rem', width: '100%' }}
                                    disabled={!data.name || !htmlContent || loading}
                                />
                                <Button
                                    label='Cancel'
                                    handleClick={() => {
                                        setSaveAsNew(false)
                                        setData({ ...data, name: '' })
                                    }}
                                    style={{ marginTop: '1rem', width: '100%' }}
                                    bgColor='lightgray'
                                    disabled={loading}
                                />
                            </>
                            : <Button
                                label='Save As...'
                                handleClick={() => setSaveAsNew(true)}
                                style={{ marginTop: '1rem', width: '100%' }}
                                disabled={!htmlContent || loading}
                            />}
                        {!saveAsNew ?
                            <>
                                <Button
                                    label='Send Notification'
                                    handleClick={() => setEmailModal(true)}
                                    style={{ marginTop: '1rem', width: '100%' }}
                                    disabled={!allEmails.length || loading || !htmlContent}
                                />
                                <Button
                                    label='Send Test'
                                    handleClick={() => setTestModal(true)}
                                    style={{ marginTop: '1rem', width: '100%' }}
                                    disabled={loading || !htmlContent}
                                />
                                {htmlContent ?
                                    <Button
                                        label='Clear'
                                        handleClick={clearTemplate}
                                        style={{ marginTop: '2rem', width: '100%' }}
                                        bgColor='lightgray'
                                        disabled={loading}
                                    />
                                    : ''}
                            </>
                            : ''}
                    </div>
                    {htmlViewer ?
                        <div className="notifications__col" style={{ width: '45%' }}>
                            <h4 className="page__header-subtitle">HTML VIEWER</h4>
                            <div
                                className="notifications__html-viewer"
                                dangerouslySetInnerHTML={{ __html: htmlContent }}
                                style={{
                                    width: '90%',
                                    minHeight: '71.5vh'
                                }}
                            />
                        </div>
                        :
                        <div className="notifications__col" style={{ width: '45%' }}>
                            <h4 className="page__header-subtitle">EMAIL LIST</h4>
                            <Button
                                label='New Email'
                                handleClick={() => setNewEmail(true)}
                                style={{ margin: '0 2rem', alignSelf: 'center', width: '90%' }}
                                disabled={loading}
                            />
                            <DataTable
                                tableData={allEmails}
                                tableHeaders={subscriptionHeaders}
                                style={{ width: '90%', alignSelf: 'center' }}
                                selected={selectedEmail}
                                setSelected={setSelectedEmail}
                            />
                        </div>}
                </div>
            </div>
        )
    }

    const renderMobile = () => {
        return (
            <div className="notifications__container">
                {emailModal ?
                    <Modal
                        title='Send Notifications'
                        onClose={() => setEmailModal(false)}>
                        <p style={{ textAlign: 'center' }}>You are about to send notifications to {allEmails.filter(email => email.isActive).length} active contacts.<br />Are you sure you want to proceed?</p>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Button
                                label='Cancel'
                                handleClick={() => setEmailModal(false)}
                                bgColor='transparent'
                                disabled={loading}
                            />
                            <Button
                                label='Confirm'
                                handleClick={sendNotifications}
                                disabled={loading}
                            />
                        </div>
                    </Modal>
                    : testModal ?
                        <Modal
                            title='Send Test Email'
                            onClose={() => setTestModal(false)}>
                            <div style={{ textAlign: 'center' }}>
                                <p >Enter the email recipients for the test, separated by comma.</p>
                                <InputField
                                    value={emailData.testEmails}
                                    updateData={updateEmailData}
                                    name='testEmails'
                                    placeholder='user@email.com, anotheruser@email.com, ...'
                                    style={{ width: '80%' }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '2rem' }}>
                                <Button
                                    label='Cancel'
                                    handleClick={() => setTestModal(false)}
                                    bgColor='transparent'
                                    disabled={loading}
                                />
                                <Button
                                    label='Send'
                                    handleClick={sendTestEmail}
                                    disabled={loading}
                                />
                            </div>
                        </Modal> : ''}
                {newEmail || selectedEmail !== -1 ?
                    <Modal
                        title={selectedEmail !== -1 ? 'New Email' : 'Email Details'}
                        onClose={discardEmail}>
                        <div className="notifications__col" style={{ gap: '1rem' }}>
                            <InputField
                                value={emailData.fullname}
                                updateData={updateEmailData}
                                name='fullname'
                                placeholder='Full Name'
                            />
                            <InputField
                                value={emailData.email}
                                updateData={updateEmailData}
                                name='email'
                                placeholder='Email'
                            />
                            <Switch
                                label='Is Active'
                                on='Yes'
                                off='No'
                                value={emailActive}
                                setValue={setEmailActive}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Button
                                label='Cancel'
                                handleClick={discardEmail}
                                bgColor='transparent'
                                disabled={loading}
                            />
                            <Button
                                label='Save'
                                handleClick={saveEmail}
                                disabled={loading}
                            />
                        </div>
                    </Modal> : ''}
                <div className="page__header" style={{ filter: modalFilter() }}>
                    <h4 className="page__header-title">EMAIL NOTIFICATIONS</h4>
                </div>
                <div className="notifications__col" style={{ marginTop: '3rem', filter: modalFilter() }}>
                    <h4 className="page__header-subtitle">NEW NOTIFICATION</h4>
                    <InputField
                        value={htmlContent}
                        updateData={updateHtml}
                        name=''
                        type='textarea'
                        rows={20}
                        cols={29}
                        style={{ alignSelf: 'center' }}
                        placeholder='Write or paste HTML here'
                    />
                    {saveAsNew ? '' :
                        <>
                            <Dropdown
                                label='Template'
                                options={allTemplates}
                                selected={selectedTemplate}
                                setSelected={setSelectedTemplate}
                                objKey='name'
                                style={{ margin: '1rem 0', width: '80vw' }}
                            />
                            <InputField
                                name='subject'
                                updateData={updateData}
                                value={data.subject || ''}
                                style={{ marginBottom: '2rem', width: '75vw' }}
                                placeholder='Email Subject'
                            />
                            {selectedTemplate._id ?
                                <Button
                                    label='Update Template'
                                    handleClick={updateTemplateData}
                                    style={{ marginBottom: '1rem', width: '80vw' }}
                                    disabled={loading}
                                /> : ''}
                        </>}
                    {saveAsNew ?
                        <>
                            <InputField
                                name='name'
                                updateData={updateData}
                                value={data.name || ''}
                                style={{ marginTop: '2rem', width: '92%' }}
                                placeholder='Template Name'
                            />
                            <InputField
                                name='subject'
                                updateData={updateData}
                                value={data.subject || ''}
                                style={{ marginTop: '2rem', width: '92%' }}
                                placeholder='Email Subject'
                            />
                            <Button
                                label='Save Template'
                                handleClick={saveTemplate}
                                style={{ marginTop: '1rem', width: '100%' }}
                                disabled={!data.name || !htmlContent || loading}
                            />
                            <Button
                                label='Cancel'
                                handleClick={() => {
                                    setSaveAsNew(false)
                                    setData({ ...data, name: '' })
                                }}
                                style={{ marginTop: '1rem', width: '100%' }}
                                bgColor='lightgray'
                                disabled={loading}
                            />
                        </>
                        : <Button
                            label='Save As...'
                            handleClick={() => setSaveAsNew(true)}
                            style={{ marginBottom: '1rem', width: '80vw' }}
                            disabled={!htmlContent || loading}
                        />}
                    {!saveAsNew ?
                        <>
                            <Button
                                label='Send Notification'
                                handleClick={() => setEmailModal(true)}
                                style={{ marginBottom: '1rem', width: '80vw' }}
                                disabled={!allEmails.length || loading || !htmlContent}
                            />
                            <Button
                                label='Send Test'
                                handleClick={() => setTestModal(true)}
                                style={{ marginBottom: '1rem', width: '80vw' }}
                                disabled={loading || !htmlContent}
                            />
                            {htmlContent ?
                                <Button
                                    label='Clear'
                                    handleClick={clearTemplate}
                                    style={{ marginBottom: '1rem', width: '80vw' }}
                                    bgColor='lightgray'
                                    disabled={loading}
                                />
                                : ''}
                        </>
                        : ''}
                </div>
                <div
                    className="notifications__col"
                    style={{
                        marginTop: '3rem',
                        width: '90vw',
                        overflow: 'scroll',
                        border: '1px solid lightgray',
                        borderRadius: '1rem',
                        filter: modalFilter()
                    }}>
                    <h4 className="page__header-subtitle">HTML VIEWER</h4>
                    <div className="notifications__html-viewer" dangerouslySetInnerHTML={{ __html: htmlContent }} />
                </div>
                <div className="notifications__col" style={{ marginTop: '3rem', filter: modalFilter() }}>
                    <h4 className="page__header-subtitle">EMAIL LIST</h4>
                    <Button
                        label='New Email'
                        handleClick={() => setNewEmail(true)}
                        style={{ margin: '1rem 2rem', alignSelf: 'center', width: '90%' }}
                        disabled={loading}
                    />
                    <DataTable
                        tableData={allEmails}
                        tableHeaders={subscriptionHeaders}
                        style={{ width: '90vw', alignSelf: 'center' }}
                        selected={selectedEmail}
                        setSelected={setSelectedEmail}
                    />
                </div>
            </div>
        )
    }

    return isMobile ? renderMobile() : renderDesktop()
}