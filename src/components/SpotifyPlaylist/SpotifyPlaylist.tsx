
type Props = {
    playlist: string
}
export default function SpotifyPlaylist({ playlist }: Props) {
    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            width:'350px',
            maxWidth: '90vw',
            height: '80px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            borderRadius: '1rem',
            background: 'transparent',
            opacity: 0,
            animationDelay: '2s',
            animation: 'fade-in 2s forwards'
        }}>
            <iframe
                data-testid="embed-iframe"
                style={{ borderRadius: 12 }}
                src={playlist}
                width="100%"
                height="110px"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy">
            </iframe>
        </div>
    )
}
