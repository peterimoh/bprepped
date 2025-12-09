'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  ArrowLeft,
  Send,
  User,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { Path } from '@/lib/path';

export default function Session() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Media states
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<
    Array<{ role: 'interviewer' | 'user'; content: string; timestamp: Date }>
  >([]);
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  // Refs for media elements
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const jobTitle = searchParams.get('job') || 'Senior Software Engineer';
  const interviewerId = searchParams.get('interviewer') || 'sarah';

  const interviewers = {
    sarah: {
      name: 'Sarah Chen',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      title: 'Senior Technical Recruiter',
    },
    michael: {
      name: 'Michael Rodriguez',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      title: 'Product Lead',
    },
    emily: {
      name: 'Emily Johnson',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      title: 'Marketing Director',
    },
  };

  const currentInterviewer =
    interviewers[interviewerId as keyof typeof interviewers] ||
    interviewers.sarah;

  // Initialize media streams
  const initializeMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Set initial states
      setIsMuted(false);
      setIsVideoOff(false);

      toast({
        title: 'Camera and microphone enabled',
        description: 'Your video and audio are now active.',
      });
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast({
        title: 'Media access denied',
        description:
          'Please allow camera and microphone access to use this feature.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  // Toggle microphone
  const toggleMicrophone = useCallback(() => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !isMuted;
      });
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !isVideoOff;
      });
      setIsVideoOff(!isVideoOff);
    }
  }, [isVideoOff]);

  // Format time
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Format message time
  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handle message sending
  const handleSendMessage = () => {
    if (!message.trim()) return;

    const userMessage = {
      role: 'user' as const,
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage('');

    // Simulate interviewer response
    setTimeout(() => {
      const responses = [
        "That's interesting! Could you elaborate on how you handled technical challenges in that project?",
        'Great example. How did you measure the success of that initiative?',
        'I see. What was the most challenging aspect of that experience?',
        'Thank you for sharing. How do you approach learning new technologies?',
        "That's impressive. Can you tell me about a time you had to work with a difficult team member?",
        'Could you provide more details about your role in that project?',
        'What specific technologies did you use for that solution?',
        'How did you collaborate with your team on this initiative?',
      ];

      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      setMessages((prev) => [
        ...prev,
        {
          role: 'interviewer',
          content: randomResponse,
          timestamp: new Date(),
        },
      ]);
    }, 2000);
  };

  // Handle keyboard input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // End session
  const handleEndSession = () => {
    setIsSessionActive(false);

    // Stop media streams
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    // Clear duration interval
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
    }

    toast({
      title: 'Interview session ended',
      description: 'Your session has been saved. Redirecting to results...',
    });

    setTimeout(() => {
      router.push(Path.Client.Protected.Interview.Root);
    }, 2000);
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Initialize on mount
  useEffect(() => {
    initializeMedia();

    // Start call duration timer
    durationIntervalRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    // Simulate interviewer starting conversation
    setTimeout(() => {
      const welcomeMessage = `Hi! I'm ${currentInterviewer.name}, ${currentInterviewer.title}. Thanks for joining me today to interview for the ${jobTitle} position. Let's start with a brief introduction - could you tell me about yourself and your experience relevant to this role?`;
      setMessages([
        {
          role: 'interviewer',
          content: welcomeMessage,
          timestamp: new Date(),
        },
      ]);
    }, 1000);

    // Cleanup on unmount
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (remoteStreamRef.current) {
        remoteStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, [
    initializeMedia,
    currentInterviewer.name,
    currentInterviewer.title,
    jobTitle,
  ]);

  // Auto-scroll messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      {/* Header with Call Duration */}
      <div className="glass flex items-center justify-between border-b border-border/30 p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push(Path.Client.Protected.Interview.Root)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Leave Session
          </Button>
          <div>
            <h2 className="font-semibold text-foreground">
              {jobTitle} Interview
            </h2>
            <p className="text-sm text-muted-foreground">
              with {currentInterviewer.name}
            </p>
          </div>
        </div>

        {/* Call Duration */}
        <div className="flex items-center gap-4">
          <div className="rounded-full border border-border/30 bg-muted/60 px-4 py-2 backdrop-blur-sm">
            <span className="font-mono text-sm text-foreground">
              {formatTime(callDuration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleMicrophone}
              className={
                isMuted
                  ? 'border-destructive/30 bg-destructive/10 text-destructive'
                  : ''
              }
            >
              {isMuted ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleVideo}
              className={
                isVideoOff
                  ? 'border-destructive/30 bg-destructive/10 text-destructive'
                  : ''
              }
            >
              {isVideoOff ? (
                <VideoOff className="h-4 w-4" />
              ) : (
                <Video className="h-4 w-4" />
              )}
            </Button>
            <Button variant="destructive" size="sm" onClick={handleEndSession}>
              <Phone className="mr-2 h-4 w-4" />
              End Session
            </Button>
          </div>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex flex-1">
        {/* Interviewer Video */}
        <div className="relative flex-1 bg-gradient-to-br from-amber-50/30 via-orange-50/20 to-primary/10">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Remote Video */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="h-full w-full rounded-3xl object-cover"
              style={{ display: 'none' }}
            />

            {/* Interviewer Profile Image (shown when video is off or as placeholder) */}
            <div className="text-center">
              <div className="relative">
                <img
                  src={currentInterviewer.avatar}
                  alt={currentInterviewer.name}
                  className="animate-float mx-auto mb-6 h-48 w-48 rounded-full border-4 border-white/40 object-cover shadow-2xl"
                />
                <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 transform items-center gap-1 rounded-full bg-success px-3 py-1 text-xs font-medium text-white">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-white"></div>
                  Active
                </div>
              </div>
              <p className="mb-2 text-2xl font-semibold text-foreground">
                {currentInterviewer.name}
              </p>
              <p className="mb-4 text-lg text-muted-foreground">
                {currentInterviewer.title}
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <div className="h-3 w-3 animate-pulse rounded-full bg-success"></div>
                <span>Ready to help you succeed</span>
              </div>
            </div>
          </div>

          {/* Interviewer Status Overlay */}
          <div className="glass absolute left-4 top-4 rounded-2xl px-4 py-2 text-sm font-medium text-foreground">
            {currentInterviewer.name}
          </div>

          {/* Call Duration Overlay */}
          <div className="glass absolute right-4 top-4 rounded-2xl px-4 py-2 font-mono text-sm text-foreground">
            {formatTime(callDuration)}
          </div>
        </div>

        {/* User Video */}
        <div className="relative w-80 border-l border-border/30 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Local Video */}
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
              style={{ display: isVideoOff ? 'none' : 'block' }}
            />

            {/* User Profile Image (shown when video is off) */}
            {isVideoOff && (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border-2 border-muted-foreground/20 bg-muted/60">
                  <User className="h-12 w-12 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Camera is off</p>
              </div>
            )}
          </div>

          {/* User Status Overlay */}
          <div className="glass absolute left-4 top-4 rounded-2xl px-3 py-2 text-sm font-medium text-foreground">
            You
          </div>

          {/* Muted Indicator */}
          {isMuted && (
            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-2xl bg-destructive/90 px-3 py-2 text-sm text-white backdrop-blur-sm">
              <MicOff className="h-4 w-4" />
              Muted
            </div>
          )}

          {/* Video Off Indicator */}
          {isVideoOff && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-2xl bg-destructive/90 px-3 py-2 text-sm text-white backdrop-blur-sm">
              <VideoOff className="h-4 w-4" />
              Camera Off
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="glass h-80 border-t border-border/30">
        <div className="h-60 space-y-3 overflow-y-auto p-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-md rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md'
                    : 'border border-border/30 bg-muted/60 text-foreground backdrop-blur-sm'
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <p
                  className={`mt-2 text-xs ${
                    msg.role === 'user'
                      ? 'text-primary-foreground/70'
                      : 'text-muted-foreground'
                  }`}
                >
                  {formatMessageTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-border/30 p-4">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your response..."
              disabled={!isSessionActive}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || !isSessionActive}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
