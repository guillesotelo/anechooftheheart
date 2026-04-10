
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
            width:'500px',
            maxWidth: '90vw',
            height: '150px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }}>
            <iframe
                data-testid="embed-iframe"
                style={{ borderRadius: 12 }}
                src={playlist}
                width="100%"
                height="160px"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy">
            </iframe>
        </div>
    )
}
