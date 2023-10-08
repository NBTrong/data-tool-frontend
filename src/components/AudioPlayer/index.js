import React, { useState, useRef, useEffect } from 'react';
import './AudioPlayer.scss';
import cn from "classnames"; // Import your CSS file

export function AudioPlayer({url,className}) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const percentageRef = useRef(null);
    const seekObjRef = useRef(null);
    const currentTimeRef = useRef(null);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const calculatePercentPlayed = () => {
        const percentage = ((audioRef.current.currentTime / audioRef.current.duration) * 100).toFixed(2);
        percentageRef.current.style.width = `${percentage}%`;
    };

    const calculateCurrentValue = (currentTime) => {
        const currentMinute = parseInt(currentTime / 60) % 60;
        const currentSecondsLong = currentTime % 60;
        const currentSeconds = currentSecondsLong.toFixed();
        const currentTimeFormatted = `${currentMinute < 10 ? `0${currentMinute}` : currentMinute}:${
            currentSeconds < 10 ? `0${currentSeconds}` : currentSeconds
        }`;

        return currentTimeFormatted;
    };

    const initProgressBar = () => {
        const currentTime = calculateCurrentValue(audioRef.current.currentTime);
        currentTimeRef.current.innerHTML = currentTime;

        audioRef.current.onended = () => {
            setIsPlaying(false);
            percentageRef.current.style.width = 0;
            currentTimeRef.current.innerHTML = '00:00';
        };

        calculatePercentPlayed();
    };

    const seek = (e) => {
        const percent = e.nativeEvent.offsetX / seekObjRef.current.offsetWidth;
        const newTime = percent * audioRef.current.duration;
        audioRef.current.currentTime = newTime;
        calculatePercentPlayed();
    };

    useEffect(() => {
        audioRef.current?.addEventListener('timeupdate', initProgressBar);

        return () => {
            audioRef.current?.removeEventListener('timeupdate', initProgressBar);
        };
    }, []);

    return (
        <div className={cn("audio-player",className)}>
            <audio ref={audioRef} id="audio">
                <source src={url} type="audio/mp3" />
            </audio>
            <div className="player-controls">
                <button
                    id="playAudio"
                    className={isPlaying ? 'pause' : ''}
                    onClick={togglePlay}
                ></button>
                <div
                    id="seekObjContainer"
                    ref={seekObjRef}
                    onClick={seek} // Add this onClick handler to the container
                >
                    <div id="seekObj">
                        <div id="percentage" ref={percentageRef}></div>
                    </div>
                </div>
                <p>
                    <small id="currentTime" ref={currentTimeRef}>
                        00:00
                    </small>
                </p>
            </div>
        </div>
    );
}

export default AudioPlayer;
