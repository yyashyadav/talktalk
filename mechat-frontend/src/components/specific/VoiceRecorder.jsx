import React, { useState, useRef, useEffect } from 'react';
import { IconButton, Box, Typography } from '@mui/material';
import { Mic as MicIcon, Stop as StopIcon, Send as SendIcon } from '@mui/icons-material';
import { orange } from '../../constants/color';

const VoiceRecorder = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
        audioBitsPerSecond: 128000
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: 'audio/webm;codecs=opus' 
        });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleSend = () => {
    if (audioBlob) {
      // Create a URL for the audio blob
      const audioUrl = URL.createObjectURL(audioBlob);
      onRecordingComplete(audioBlob, audioUrl, recordingTime);
      setAudioBlob(null);
      setRecordingTime(0);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center',
      gap: 1,
      bgcolor: 'rgba(105, 152, 246, 0.8)',
      borderRadius: '20px',
      // px: 0.5,
      // py: 0.5,
      ml:1
      
    }}>
      {isRecording ? (
        <>
          <IconButton 
            onClick={stopRecording}
            sx={{ 
              color: orange,
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            <StopIcon />
          </IconButton>
          <Typography sx={{ color: 'white', minWidth: '50px' }}>
            {formatTime(recordingTime)}
          </Typography>
        </>
      ) : audioBlob ? (
        <>
          <IconButton 
            onClick={handleSend}
            sx={{ 
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            <SendIcon />
          </IconButton>
          <Typography sx={{ color: 'white' }}>
            {formatTime(recordingTime)}
          </Typography>
        </>
      ) : (
        <IconButton 
          onClick={startRecording}
          sx={{ 
            color: 'white',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
          }}
        >
          <MicIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default VoiceRecorder; 