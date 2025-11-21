import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, ArrowLeft, Play, Square, RefreshCw } from 'lucide-react';
import { useSpeech } from '../../hooks/useSpeech';
import { interviewService } from '../../services/interviewService';

interface InterviewPageProps {
  onBack: () => void;
}

export default function InterviewPage({ onBack }: InterviewPageProps) {
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    speak, 
    isSpeaking, 
    cancelSpeech,
    hasRecognitionSupport 
  } = useSpeech();

  const [sessionStarted, setSessionStarted] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentTranscript]);

  // Handle transcript updates
  useEffect(() => {
    if (transcript) {
      setCurrentTranscript(transcript);
    }
  }, [transcript]);

  // When user stops speaking (or pauses long enough - simplified here by manual stop for now, 
  // but in a real app we'd use a silence timer), we send the message.
  // For this prototype, we'll use a manual "Send" or "Stop Listening" trigger to commit the answer.

  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = useState('');
  const [interviewerName, setInterviewerName] = useState('Ed');

  const handleStartSession = async () => {
    if (!topic.trim()) return;
    
    setIsProcessing(true);
    setError(null);
    
    const greeting = await interviewService.startSession(topic, interviewerName || "Ed");
    
    setIsProcessing(false);
    
    if (greeting.startsWith("Error:")) {
      setError(greeting);
      return;
    }

    setSessionStarted(true);
    setMessages([{ role: 'assistant', content: greeting }]);
    speak(greeting);
  };

  const handleStopListening = async () => {
    stopListening();
    if (currentTranscript.trim()) {
      await handleSendMessage(currentTranscript);
      setCurrentTranscript('');
    }
  };

  const handleSendMessage = async (text: string) => {
    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setIsProcessing(true);

    try {
      const response = await interviewService.processUserResponse(text);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      speak(response);
    } catch (error) {
      console.error("Error processing response:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      handleStopListening();
    } else {
      cancelSpeech(); // Stop AI from talking if we want to interrupt
      startListening();
    }
  };

  if (!hasRecognitionSupport) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#EAF4F1] text-[#1B3D2F]">
        <h2 className="text-2xl font-bold mb-4">Browser Not Supported</h2>
        <p>Your browser does not support speech recognition. Please use Chrome or Edge.</p>
        <button onClick={onBack} className="mt-6 px-6 py-2 bg-[#1B3D2F] text-white rounded-lg">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EAF4F1] flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <button 
          onClick={() => { cancelSpeech(); onBack(); }}
          className="flex items-center text-[#6B7280] hover:text-[#1B3D2F] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>
        <h1 className="text-xl font-bold text-[#1B3D2F]">Mock Interview Session</h1>
        <div className="w-24" /> {/* Spacer for centering */}
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-6 flex flex-col gap-6">
        
        {/* Visualizer / Status Area */}
        <div className="bg-white rounded-2xl shadow-lg p-8 min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden">
          {!sessionStarted ? (
            <div className="text-center z-10 w-full max-w-md mx-auto">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Volume2 className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#1B3D2F] mb-3">Mock Interview Setup</h2>
              <p className="text-[#6B7280] mb-6">
                What role or topic would you like to practice for today?
              </p>
              
              <div className="mb-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Interview Topic</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Junior React Developer"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1B3D2F] focus:ring-2 focus:ring-[#1B3D2F]/20 outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Interviewer Name</label>
                  <input
                    type="text"
                    value={interviewerName}
                    onChange={(e) => setInterviewerName(e.target.value)}
                    placeholder="e.g. Ed"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1B3D2F] focus:ring-2 focus:ring-[#1B3D2F]/20 outline-none transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && topic && handleStartSession()}
                  />
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error === "Error: INVALID_TOPIC" 
                    ? "That doesn't seem to be a valid interview topic. Please try a professional role or scenario."
                    : error}
                </div>
              )}

              <button 
                onClick={handleStartSession}
                disabled={!topic.trim() || isProcessing}
                className={`px-8 py-3 bg-[#1B3D2F] text-white rounded-full font-semibold transition-all transform hover:scale-105 flex items-center mx-auto ${
                  (!topic.trim() || isProcessing) ? 'opacity-50 cursor-not-allowed hover:scale-100' : 'hover:bg-[#152e24]'
                }`}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Start Interview
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center z-10">
              {/* Avatar / Visualizer */}
              <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 transition-all duration-500 ${
                isSpeaking ? 'bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.5)] scale-110' : 
                isListening ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)] scale-110' : 
                'bg-gray-200'
              }`}>
                {isSpeaking ? (
                  <Volume2 className="w-12 h-12 text-white animate-pulse" />
                ) : isListening ? (
                  <Mic className="w-12 h-12 text-white animate-pulse" />
                ) : (
                  <UserIcon className="w-12 h-12 text-gray-400" />
                )}
              </div>

              {/* Status Text */}
              <div className="text-center mb-8 h-8">
                {isSpeaking && <span className="text-blue-600 font-medium animate-pulse">AI is speaking...</span>}
                {isListening && <span className="text-red-500 font-medium animate-pulse">Listening...</span>}
                {isProcessing && <span className="text-gray-500 font-medium">Thinking...</span>}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-6">
                <button
                  onClick={toggleListening}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all transform hover:scale-105 ${
                    isListening 
                      ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg' 
                      : 'bg-[#1B3D2F] hover:bg-[#152e24] text-white shadow-lg'
                  }`}
                >
                  {isListening ? <Square className="w-6 h-6 fill-current" /> : <Mic className="w-8 h-8" />}
                </button>
              </div>
              {isListening && currentTranscript && (
                <div className="mt-6 max-w-lg w-full">
                  <p className="text-center text-gray-500 text-sm mb-2">Live Transcript:</p>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 min-h-[60px] flex items-center justify-center">
                    <p className="text-lg text-gray-700 text-center font-medium leading-relaxed">
                      "{currentTranscript}"
                    </p>
                  </div>
                </div>
              )}
              
              <p className="mt-4 text-sm text-gray-500">
                {isListening ? "Tap to stop speaking" : "Tap microphone to answer"}
              </p>
            </div>
          )}

          {/* Background decoration */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-500 rounded-full filter blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
          </div>
        </div>

        {/* Transcript / Chat History */}
        {sessionStarted && (
          <div className="bg-white rounded-2xl shadow-lg p-6 flex-1 min-h-[200px] max-h-[400px] overflow-y-auto">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Transcript</h3>
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-blue-50 text-blue-900 rounded-br-none' 
                      : 'bg-gray-50 text-gray-900 rounded-bl-none'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              {currentTranscript && (
                <div className="flex justify-end">
                  <div className="max-w-[80%] p-4 rounded-2xl bg-blue-50/50 text-blue-900/70 border-2 border-blue-100 border-dashed">
                    <p className="text-sm leading-relaxed">{currentTranscript}...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
