"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as faceapi from 'face-api.js';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanFace, CheckCircle2, AlertCircle, X, Loader2, Camera, ShieldCheck, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { employeeProfileService } from '@/services/employeeProtalServices/employee.profile.service';

type RegistrationStatus =
    | 'idle'
    | 'loading_models'
    | 'camera_ready'
    | 'face_detected'
    | 'registering'
    | 'success'
    | 'error'
    | 'no_camera';

interface FaceRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (registeredData?: any) => void;
}

export default function FaceRegistrationModal({
    isOpen,
    onClose,
    onSuccess,
}: FaceRegistrationModalProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const autoCaptureTimerRef = useRef<NodeJS.Timeout | null>(null);
    const isRegisteringRef = useRef<boolean>(false);
    const lastDescriptorRef = useRef<Float32Array | null>(null);

    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [status, setStatus] = useState<RegistrationStatus>('idle');
    const [faceConfidence, setFaceConfidence] = useState(0);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // 1. Teardown & Stop Media Tracks
    const stopCameraAndCleanup = useCallback(() => {
        if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
        if (autoCaptureTimerRef.current) clearInterval(autoCaptureTimerRef.current);

        if (videoRef.current?.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach((track) => track.stop());
            videoRef.current.srcObject = null;
        }

        setFaceConfidence(0);
        setCountdown(null);
        isRegisteringRef.current = false;
        lastDescriptorRef.current = null;
    }, []);

    // 2. Load Models
    useEffect(() => {
        const loadModels = async () => {
            if (modelsLoaded) return;
            setStatus('loading_models');
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
                ]);
                setModelsLoaded(true);
                if (isOpen) {
                    startCamera();
                }
            } catch (err) {
                console.error('Failed to load face detection models:', err);
                setStatus('error');
                setErrorMessage('Unable to load face detection models. Please refresh and try again.');
                toast.error('Failed to load face detection models');
            }
        };

        if (isOpen && !modelsLoaded) {
            loadModels();
        }
    }, [isOpen, modelsLoaded]);

    // 3. Start Camera
    const startCamera = async () => {
        setStatus('idle');
        setErrorMessage(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                },
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    setStatus('camera_ready');
                    startDetectionLoop();
                };
            }
        } catch (err) {
            console.error('Camera access error:', err);
            setStatus('no_camera');
            setErrorMessage('Camera access was denied or not found. Please allow camera permissions in your browser.');
            toast.error('Camera access denied or unavailable');
        }
    };

    // 4. Detection Loop
    const startDetectionLoop = () => {
        if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
        if (autoCaptureTimerRef.current) clearInterval(autoCaptureTimerRef.current);

        const options = new faceapi.TinyFaceDetectorOptions({
            inputSize: 224,
            scoreThreshold: 0.5,
        });

        detectionIntervalRef.current = setInterval(async () => {
            if (!videoRef.current || isRegisteringRef.current) return;

            try {
                const detection = await faceapi
                    .detectSingleFace(videoRef.current, options)
                    .withFaceLandmarks()
                    .withFaceDescriptor();

                if (detection) {
                    const score = Math.round(detection.detection.score * 100);
                    setFaceConfidence(score);
                    lastDescriptorRef.current = detection.descriptor;

                    if (!isRegisteringRef.current) {
                        setStatus('face_detected');

                        // Start short 2-second countdown for capture
                        if (!autoCaptureTimerRef.current) {
                            let count = 2;
                            setCountdown(count);

                            autoCaptureTimerRef.current = setInterval(() => {
                                count -= 1;
                                setCountdown(count);
                                if (count <= 0) {
                                    clearInterval(autoCaptureTimerRef.current!);
                                    autoCaptureTimerRef.current = null;
                                    setCountdown(null);
                                    handleCaptureAndRegister();
                                }
                            }, 1000);
                        }
                    }
                } else {
                    // Face not detected
                    setFaceConfidence(0);
                    lastDescriptorRef.current = null;
                    setStatus('camera_ready');
                    if (autoCaptureTimerRef.current) {
                        clearInterval(autoCaptureTimerRef.current);
                        autoCaptureTimerRef.current = null;
                        setCountdown(null);
                    }
                }
            } catch (e) {
                // Ignore transient frame errors
            }
        }, 400);
    };

    // 5. Capture Snapshot Canvas Helper
    const captureSnapshot = (): string => {
        if (!videoRef.current) return '';
        try {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth || 640;
            canvas.height = videoRef.current.videoHeight || 480;
            const ctx = canvas.getContext('2d');
            if (!ctx) return '';
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            return canvas.toDataURL('image/jpeg', 0.85);
        } catch {
            return '';
        }
    };

    // 6. Register Face via API
    const handleCaptureAndRegister = async () => {
        if (isRegisteringRef.current) return;
        if (!lastDescriptorRef.current) {
            toast.error('No face detected yet. Please look into the camera.');
            return;
        }

        isRegisteringRef.current = true;
        if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
        if (autoCaptureTimerRef.current) clearInterval(autoCaptureTimerRef.current);

        setStatus('registering');
        setErrorMessage(null);

        try {
            const descriptorArray = Array.from(lastDescriptorRef.current);
            const imageSnapshot = captureSnapshot();

            if (!imageSnapshot) {
                throw new Error('Unable to capture camera snapshot. Please try again.');
            }

            // Exactly as required:
            // body { faceDescriptors!: number[][], image!: string }
            const payload = {
                faceDescriptors: [descriptorArray],
                image: imageSnapshot,
            };

            const result = await employeeProfileService.registerFace(payload);

            // Update user in localStorage
            if (typeof window !== 'undefined') {
                const storedUserRaw = localStorage.getItem('user');
                const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : {};
                const updatedUser = {
                    ...storedUser,
                    faceDescriptors: [descriptorArray],
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }

            setStatus('success');
            toast.success('Face registered successfully! ✓');

            setTimeout(() => {
                stopCameraAndCleanup();
                onSuccess?.(result);
                onClose();
            }, 1200);
        } catch (err: any) {
            console.error('Face registration failed:', err);
            const msg = err.response?.data?.message || err.message || 'Face registration failed. Please try again.';
            setErrorMessage(msg);
            setStatus('error');
            toast.error(msg);
            isRegisteringRef.current = false;
        }
    };

    // 7. Watch isOpen prop
    useEffect(() => {
        if (isOpen) {
            if (modelsLoaded) {
                startCamera();
            }
        } else {
            stopCameraAndCleanup();
        }

        return () => {
            stopCameraAndCleanup();
        };
    }, [isOpen, modelsLoaded]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-brand-blue/10 dark:bg-brand-blue/20 flex items-center justify-center text-brand-blue">
                                <ScanFace size={22} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Face Registration</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Enroll your face for instant biometric attendance
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Camera Area */}
                    <div className="p-6">
                        <div className="relative aspect-[4/3] w-full rounded-2xl bg-black overflow-hidden flex items-center justify-center shadow-inner">
                            {/* Live Video Feed */}
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover -scale-x-100"
                            />

                            {/* Oval Face Guide Frame */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div
                                    className={`w-52 h-64 rounded-[48%] border-2 transition-all duration-300 ${
                                        status === 'face_detected'
                                            ? 'border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.5)] scale-105'
                                            : status === 'registering'
                                            ? 'border-brand-blue shadow-[0_0_25px_rgba(59,130,246,0.6)] animate-pulse'
                                            : status === 'success'
                                            ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.8)]'
                                            : 'border-white/40 border-dashed'
                                    }`}
                                />
                            </div>

                            {/* Loading State Overlay */}
                            {status === 'loading_models' && (
                                <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-3 z-20">
                                    <Loader2 size={36} className="animate-spin text-brand-blue" />
                                    <p className="text-sm font-semibold">Loading Face AI Models...</p>
                                    <p className="text-xs text-white/60">This only takes a few seconds</p>
                                </div>
                            )}

                            {/* Camera Denied Overlay */}
                            {status === 'no_camera' && (
                                <div className="absolute inset-0 bg-gray-950/90 flex flex-col items-center justify-center text-white p-6 text-center space-y-3 z-20">
                                    <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                                        <AlertCircle size={28} />
                                    </div>
                                    <p className="text-sm font-bold text-red-400">Camera Access Required</p>
                                    <p className="text-xs text-white/70 max-w-xs">{errorMessage}</p>
                                    <button
                                        onClick={startCamera}
                                        className="mt-2 px-4 py-2 bg-brand-blue hover:bg-blue-600 text-white rounded-xl text-xs font-semibold transition"
                                    >
                                        Allow & Retry
                                    </button>
                                </div>
                            )}

                            {/* Success Overlay */}
                            {status === 'success' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute inset-0 bg-emerald-950/90 flex flex-col items-center justify-center text-white z-20"
                                >
                                    <div className="w-16 h-16 rounded-full bg-emerald-500/30 border-2 border-emerald-400 flex items-center justify-center mb-3">
                                        <CheckCircle2 size={36} className="text-emerald-400" />
                                    </div>
                                    <p className="text-lg font-bold">Face Registered!</p>
                                    <p className="text-xs text-emerald-200 mt-1">Ready for biometric attendance</p>
                                </motion.div>
                            )}

                            {/* Registering Overlay */}
                            {status === 'registering' && (
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white space-y-3 z-20">
                                    <Loader2 size={40} className="animate-spin text-brand-orange" />
                                    <p className="text-sm font-bold">Registering Face Biometrics...</p>
                                    <p className="text-xs text-white/70">Connecting to secure server...</p>
                                </div>
                            )}

                            {/* Live Status Pill at Bottom */}
                            {status !== 'loading_models' && status !== 'no_camera' && status !== 'success' && (
                                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between px-4 py-2.5 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs border border-white/10 z-10">
                                    <div className="flex items-center gap-2">
                                        {status === 'face_detected' ? (
                                            <>
                                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                                                <span className="font-semibold text-emerald-300">
                                                    Face Detected ({faceConfidence}%)
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                                                <span className="text-white/80">Align your face inside the frame</span>
                                            </>
                                        )}
                                    </div>

                                    {countdown !== null && (
                                        <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white font-bold text-xs">
                                            Capturing in {countdown}s
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Error Message banner if registration failed */}
                        {status === 'error' && errorMessage && (
                            <div className="mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 flex items-start gap-2.5 text-xs text-red-600 dark:text-red-400">
                                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="font-semibold">{errorMessage}</p>
                                    <button
                                        onClick={() => {
                                            setStatus('idle');
                                            setErrorMessage(null);
                                            startCamera();
                                        }}
                                        className="mt-1 font-bold underline hover:no-underline cursor-pointer"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Tips */}
                        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] text-gray-500 dark:text-gray-400">
                            <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                                💡 Good lighting
                            </div>
                            <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                                👀 Look straight
                            </div>
                            <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                                🚫 No sunglasses
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={status === 'registering'}
                                className="px-5 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleCaptureAndRegister}
                                disabled={status !== 'face_detected' || isRegisteringRef.current}
                                className="px-6 py-2.5 bg-gradient-to-r from-brand-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                            >
                                <Camera size={15} />
                                {status === 'registering' ? 'Registering...' : 'Capture & Register'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
