// hooks/gtag.ts
export const GA_TRACKING_ID = 'G-'

// Function to track pageviews
export const pageview = (url: string) => {
    window.gtag('config', GA_TRACKING_ID, {
        page_path: url,
    })
}

// Define the type for the event parameters
interface GTagEvent {
    action: string
    category: string
    label: string
    value?: number
}

// Function to track events
export const event = ({ action, category, label, value }: GTagEvent) => {
    window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
    })
}