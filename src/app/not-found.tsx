import PageNotFound from './404/PageNotFound'

export async function generateMetadata() {
    const title = 'Nothing to see here...'
    const description = 'The page you are looking for has not been found. Check the URL is correct or go back home.'

    return {
        title,
        description,
        openGraph: {
            title,
            description,
        },
    }
}

export default function NotFound() {
    return <PageNotFound />
}