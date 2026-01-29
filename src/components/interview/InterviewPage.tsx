import { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, ArrowLeft, Play, Square, RefreshCw, Settings2, X } from 'lucide-react';
import defaultSystemPrompt from '../../prompts/interview-system-prompt.txt?raw';
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

  // Simplification: Generic defaults
  const [error, setError] = useState<string | null>(null);
  const [topic] = useState('Behavioral Interview');  
  const [interviewerName] = useState('Interviewer'); 
  
  // Prompt Editor State
  const [showPromptEditor, setShowPromptEditor] = useState(false);
  const [customPrompt, setCustomPrompt] = useState(defaultSystemPrompt);

  const handleStartSession = async () => {
    if (!topic.trim()) return;
    
    setIsProcessing(true);
    setError(null);
    setShowPromptEditor(false); // Close editor if open
    
    const greeting = await interviewService.startSession(topic, interviewerName, customPrompt);
    
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
      const response = await interviewService.processUserResponse(text, customPrompt);
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
        <div className="flex items-center gap-2">
           <h1 className="text-xl font-bold text-[#1B3D2F]">Mock Interview Session</h1>
           <button 
             onClick={() => setShowPromptEditor(!showPromptEditor)}
             className="p-1 text-gray-300 hover:text-[#1B3D2F] transition-colors rounded-full hover:bg-gray-100"
             title="Tune System Prompt"
           >
             <Settings2 className="w-4 h-4" />
           </button>
        </div>
        <div className="w-24" /> {/* Spacer for centering */}
      </div>

      {/* Prompt Editor Modal */}
      {showPromptEditor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-[#1B3D2F]">System Prompt Editor</h3>
                <p className="text-sm text-gray-500">Edit the instructions given to the AI interviewer.</p>
              </div>
              <button 
                onClick={() => setShowPromptEditor(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 flex-1 flex flex-col gap-4">
               <textarea
                 value={customPrompt}
                 onChange={(e) => setCustomPrompt(e.target.value)}
                 className="w-full h-[300px] p-4 rounded-xl border border-gray-200 font-mono text-sm leading-relaxed focus:border-[#1B3D2F] focus:ring-2 focus:ring-[#1B3D2F]/20 outline-none resize-none"
                 placeholder="Enter system prompt..."
               />
            </div>
            
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => setCustomPrompt(defaultSystemPrompt)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-[#1B3D2F] font-medium"
              >
                Reset to Default
              </button>
              <button 
                onClick={() => setShowPromptEditor(false)}
                className="px-6 py-2 bg-[#1B3D2F] text-white rounded-lg font-medium hover:bg-[#152e24] transition-colors"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-6 flex flex-col gap-6">
        
        {/* Visualizer / Status Area */}
        <div className="bg-white rounded-2xl shadow-lg p-8 min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden">
          {!sessionStarted ? (
            <div className="text-center z-10 w-full max-w-2xl mx-auto py-12">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm border border-blue-100/50 transform rotate-3 transition-transform hover:rotate-0">
                <Volume2 className="w-12 h-12 text-[#1B3D2F]" />
              </div>
              
              <h1 className="text-4xl font-serif text-[#1B3D2F] mb-4 tracking-tight">
                Practice Your Interview Skills
              </h1>
              
              <p className="text-[#6B7280] text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                Connect with our AI interviewer for a realistic behavioral interview session. 
                Receive instant feedback and improve your confidence.
              </p>

              {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center justify-center">
                   <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                   {error}
                </div>
              )}

              <button 
                onClick={handleStartSession}
                disabled={isProcessing}
                className={`group relative px-8 py-4 bg-[#1B3D2F] text-white rounded-xl font-medium text-lg transition-all transform hover:-translate-y-1 hover:shadow-xl shadow-lg shadow-[#1B3D2F]/20 flex items-center justify-center mx-auto min-w-[200px] overflow-hidden ${
                  isProcessing ? 'opacity-80 cursor-wait' : ''
                }`}
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-3 fill-current" />
                    Start Session
                  </>
                )}
              </button>
              
              <p className="mt-6 text-sm text-gray-400">
                Microphone access required
              </p>
            </div>
          ) : (
            <div className="w-full flex flex-col h-full">
              {/* Header / Status */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`} />
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {isListening ? 'Listening' : isSpeaking ? 'AI Speaking' : 'Idle'}
                  </span>
                </div>
                {isProcessing && (
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-medium animate-pulse">
                    Processing Response...
                  </span>
                )}
              </div>

              {/* Main Visualizer Area */}
              <div className="flex-1 flex flex-col items-center justify-center min-h-[200px] relative mb-8">
                {/* Background Rings */}
                <div className={`absolute w-64 h-64 border-4 rounded-full transition-all duration-1000 ${
                  isSpeaking ? 'border-blue-100 scale-110 opacity-100' : 
                  isListening ? 'border-red-100 scale-125 opacity-100' : 'border-gray-100/50 scale-90 opacity-50'
                }`} />
                <div className={`absolute w-48 h-48 border-4 rounded-full transition-all duration-1000 delay-100 ${
                  isSpeaking ? 'border-blue-200 scale-110 opacity-100' : 
                  isListening ? 'border-red-200 scale-125 opacity-100' : 'border-gray-100/50 scale-95 opacity-50'
                }`} />
                
                {/* Central Avatar */}
                <div className={`w-32 h-32 rounded-full flex items-center justify-center z-10 transition-all duration-500 shadow-2xl ${
                  isSpeaking ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/30 scale-110' : 
                  isListening ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/30 scale-110' : 
                  'bg-white border-4 border-gray-50 shadow-gray-200'
                }`}>
                  {isSpeaking ? (
                     <Volume2 className="w-14 h-14 text-white animate-bounce" />
                  ) : isListening ? (
                    <Mic className="w-14 h-14 text-white animate-pulse" />
                  ) : (
                    <UserIcon className="w-14 h-14 text-gray-300" />
                  )}
                </div>
              </div>

              {/* Live Transcript Warning / Preview */}
              <div className="h-20 mb-6 flex items-center justify-center">
                 {isListening ? (
                    currentTranscript ? (
                      <p className="text-xl text-gray-800 font-medium text-center animate-in fade-in slide-in-from-bottom-2">
                        "{currentTranscript}"
                      </p>
                    ) : (
                      <p className="text-gray-400 text-sm animate-pulse">Listening for your answer...</p>
                    )
                 ) : (
                    <p className="text-gray-400 text-sm">
                      Tap microphone to speak
                    </p>
                 )}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-6 pb-6 border-b border-gray-100 mb-6">
                <button
                  onClick={toggleListening}
                  className={`relative group w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isListening 
                      ? 'bg-red-500 text-white shadow-xl shadow-red-500/20 hover:scale-105 hover:bg-red-600' 
                      : 'bg-[#1B3D2F] text-white shadow-xl shadow-[#1B3D2F]/20 hover:scale-105 hover:bg-[#152e24]'
                  }`}
                >
                  <div className={`absolute inset-0 rounded-full border-2 border-white/20 scale-110 ${isListening ? 'animate-ping opacity-20' : 'opacity-0'}`} />
                  {isListening ? <Square className="w-8 h-8 fill-current" /> : <Mic className="w-8 h-8" />}
                </button>
              </div>

              {/* Chat History View (Inline) */}
              <div className="flex-1 overflow-y-auto px-2 space-y-4 max-h-[300px] scrollbar-thin scrollbar-thumb-gray-200">
                  {messages.length === 0 && (
                    <p className="text-center text-gray-300 text-sm py-4">Conversation history will appear here</p>
                  )}
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                      <div className={`max-w-[85%] p-4 rounded-2xl ${
                        msg.role === 'user' 
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10 rounded-br-sm' 
                          : 'bg-white border border-gray-100 text-gray-800 shadow-sm rounded-bl-sm'
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {/* Ghost bubble for processing */}
                  {isProcessing && (
                     <div className="flex justify-start animate-in fade-in">
                        <div className="bg-gray-50 rounded-2xl p-4 flex gap-2 items-center">
                           <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                           <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                           <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                        </div>
                     </div>
                  )}
                  <div ref={messagesEndRef} />
              </div>

            </div>
          )}

          {/* Background decoration */}
          <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden rounded-2xl">
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500 rounded-full filter blur-3xl transform translate-x-1/2 translate-y-1/2 opacity-50"></div>
          </div>
        </div>
        
        {/* Removed separate transcript block - merged into main card for unified view */}
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
