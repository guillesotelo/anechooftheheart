"use client"

import React, { useContext, useEffect, useState } from 'react'
const PlayTrack = '/assets/icons/play-track.svg'
const PauseTrack = '/assets/icons/pause-track.svg'
const ChangeTrack = '/assets/icons/next-track.svg'
import { AppContext } from '../../app/context/AppContext'

type Props = {
    filePath?: string | string[]
    setShowPlayer?: (value: boolean) => void
    titles?: string[]
    autoplay?: boolean
}

export default function Player({ filePath, setShowPlayer, titles }: Props) {
    const [playing, setPlaying] = useState(false)
    const [audioFile, setAudioFile] = useState<HTMLAudioElement | null>(null)
    const [fileName, setFileName] = useState<string | null>(null)
    const [pathIndex, setPathIndex] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [autoplayTrigger, setAutoplayTrigger] = useState(false)
    const { isMobile } = useContext(AppContext)

    useEffect(() => {
        if (filePath) {
            const audio = new Audio(Array.isArray(filePath) ? filePath[pathIndex] : filePath)
            setFileName(titles ? titles[0] : getFileNameFromURL(audio.src))
            setAudioFile(audio)
        }
    }, [filePath])

    useEffect(() => {
        if (audioFile) {
            const handleLoadedMetadata = () => {
                setDuration(audioFile.duration)
            }

            const handleTimeUpdate = () => {
                setCurrentTime(audioFile.currentTime)
            }
            audioFile.addEventListener('loadedmetadata', handleLoadedMetadata)
            audioFile.addEventListener('timeupdate', handleTimeUpdate)
            return () => {
                audioFile.removeEventListener('loadedmetadata', handleLoadedMetadata)
                audioFile.removeEventListener('timeupdate', handleTimeUpdate)
            }
        }
    }, [audioFile])

    useEffect(() => {
        if (audioFile && currentTime >= duration) nextTrack()
    }, [currentTime])

    const getFileNameFromURL = (url: string): string => {
        const parts = url.split('/')
        return parts[parts.length - 1].split('.')[0].replaceAll('-', ' ').replaceAll('_', ' - ')
    }

    const prevTrack = () => {
        setPlaying(false)
        if (filePath) {
            const index = pathIndex > 0 ? pathIndex - 1 : filePath.length - 1
            setPathIndex(index)
            if (audioFile) {
                audioFile.pause()
                audioFile.currentTime = 0
                const audio = new Audio(Array.isArray(filePath) ? filePath[index] : filePath)
                setFileName(titles ? titles[index] : getFileNameFromURL(audio.src))
                audio.play()
                setAudioFile(audio)
                setPlaying(true)
            }
        }
    }

    const nextTrack = () => {
        setPlaying(false)
        if (filePath) {
            const index = pathIndex < filePath.length - 1 ? pathIndex + 1 : 0
            setPathIndex(index)
            if (audioFile) {
                audioFile.pause()
                audioFile.currentTime = 0
                const audio = new Audio(Array.isArray(filePath) ? filePath[index] : filePath)
                setFileName(titles ? titles[index] : getFileNameFromURL(audio.src))
                setAudioFile(audio)
                audio.play()
                setPlaying(true)
            }
        }
    }

    const playTrack = () => {
        if (audioFile) {
            if (playing) audioFile.pause()
            else audioFile.play()
            setPlaying(!playing)
        }
    }

    const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (audioFile) {
            const newTime = parseFloat(event.target.value)
            audioFile.currentTime = newTime
            setCurrentTime(newTime)
        }
    }

    const closePlayer = () => {
        if (audioFile) {
            if (playing) audioFile.pause()
            audioFile.currentTime = 0
        }
        if (setShowPlayer) setShowPlayer(false)
    }

    return (
        <div
            className="player__container"
            style={{
                width: isMobile ? '91vw' : '',
                bottom: isMobile ? '1rem' : '',
                right: isMobile ? '1rem' : '',
            }}>
            <div className="player__track-name">
                <p className="player__track-name-label">{fileName || 'Track Name - Artist Name'}</p>
                <button className='player__close' onClick={closePlayer}>X</button>
            </div>
            <div className="player__track-path">
                <input
                    type="range"
                    min={0}
                    max={duration}
                    value={currentTime}
                    onChange={handleSeek}
                />
            </div>
            <div className="player__buttons">
                <button className="player__btn" onClick={prevTrack}>
                    <img src={ChangeTrack} alt="Previous track" className="player__btn-svg-previous" draggable={false} />
                </button>

                <button className="player__btn" onClick={playTrack}>
                    <img src={playing ? PauseTrack : PlayTrack} alt="Play / Pause track" className="player__btn-svg" draggable={false} />
                </button>

                <button className="player__btn" onClick={nextTrack}>
                    <img src={ChangeTrack} alt="Next track" className="player__btn-svg-next" draggable={false} />
                </button>
            </div>
        </div>
    )
}