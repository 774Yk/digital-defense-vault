import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Send, 
  Upload, 
  Image as ImageIcon, 
  Mic, 
  Camera, 
  Search, 
  Video,
  Bot,
  User,
  FileText,
  Paperclip,
  Loader2,
  Volume2,
  MicOff
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: any[];
}

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m MR.Yassen, your cybersecurity AI assistant. I can help you with cybersecurity questions, analyze files, generate content, and more. What would you like to do today?',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && selectedFiles.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      attachments: selectedFiles.length > 0 ? selectedFiles : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setSelectedFiles([]);
    setIsLoading(true);

    try {
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file
      const readFileAsBase64 = (file: File) => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const res = reader.result as string;
          resolve(res.includes(',') ? res.split(',')[1] : res);
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });

      let skipped = 0;
      const filesPayload = await Promise.all(
        selectedFiles.map(async (f) => {
          if (f.size > MAX_FILE_SIZE) { skipped++; return null; }
          const data = await readFileAsBase64(f);
          return { name: f.name, type: f.type, size: f.size, data };
        })
      );
      const filteredFiles = filesPayload.filter(Boolean);

      if (skipped > 0) {
        toast({
          title: 'File size limit',
          description: `تم تجاهل ${skipped} ملف(ات) تتجاوز ${Math.round(MAX_FILE_SIZE/1024/1024)}MB.`,
          variant: 'destructive',
        });
      }

      const response = await supabase.functions.invoke('ai-chat', {
        body: {
          message: inputMessage,
          files: filteredFiles,
          conversationHistory: messages.slice(-10).map(m => ({ type: m.type, content: m.content }))
        }
      });

      if (response.error) throw response.error;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.data?.response || 'I apologize, but I encountered an issue processing your request.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);

      // Auto-speak AI responses
      if (response.data?.response) {
        handleTextToSpeech(response.data.response);
      }
    } catch (error) {
      console.error('Error calling AI:', error);
      
      let errorMessage = "Failed to get AI response.";
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast({
        title: "AI Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (type: 'file' | 'image' | 'audio') => {
    const input = type === 'file' ? fileInputRef.current : 
                  type === 'image' ? imageInputRef.current : audioInputRef.current;
    input?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // This would open a camera interface - simplified for now
      toast({
        title: "Camera Access",
        description: "Camera feature will be implemented soon.",
      });
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera.",
        variant: "destructive",
      });
    }
  };

  const handleDeepSearch = () => {
    toast({
      title: "Deep Search",
      description: "Deep search feature will be implemented soon.",
    });
  };

  const handleVideoCreation = () => {
    toast({
      title: "Video Creation",
      description: "AI video generation feature will be implemented soon.",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextToSpeech = async (text: string) => {
    try {
      setIsSpeaking(true);
      const response = await supabase.functions.invoke('google-speech', {
        body: { action: 'text-to-speech', text }
      });

      if (response.error) throw response.error;

      const audioContent = response.data?.audioContent;
      if (audioContent) {
        const audioData = atob(audioContent);
        const audioArray = new Uint8Array(audioData.length);
        for (let i = 0; i < audioData.length; i++) {
          audioArray[i] = audioData.charCodeAt(i);
        }
        
        const audioBlob = new Blob([audioArray], { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };
        
        audio.play();
      }
    } catch (error) {
      console.error('Text-to-speech error:', error);
      setIsSpeaking(false);
      toast({
        title: "Speech Error",
        description: "Failed to convert text to speech",
        variant: "destructive",
      });
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleSpeechToText(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Recording Error",
        description: "Failed to access microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSpeechToText = async (audioBlob: Blob) => {
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        const response = await supabase.functions.invoke('google-speech', {
          body: { action: 'speech-to-text', audio: base64Audio }
        });

        if (response.error) throw response.error;

        const transcript = response.data?.transcript;
        if (transcript) {
          setInputMessage(transcript);
        }
      };
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Speech-to-text error:', error);
      toast({
        title: "Speech Recognition Error",
        description: "Failed to convert speech to text",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/20">
      <Navbar />
      
      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-5rem)] flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-cyber font-bold">
              <span className="bg-gradient-cyber bg-clip-text text-transparent">
                MR.Yassen - AI Assistant
              </span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Your cybersecurity AI companion for analysis, research, and content creation
            </p>
          </div>

          {/* Chat Area */}
          <Card className="flex-1 flex flex-col border-primary/20 bg-card/60 backdrop-blur-md">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                Chat with MR.Yassen
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <ScrollArea className="flex-1 px-6">
                <div className="space-y-4 pb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-3 ${
                        message.type === 'user' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                      </div>
                      
                      <div className={`flex-1 max-w-[80%] ${
                        message.type === 'user' ? 'items-end' : 'items-start'
                      } flex flex-col`}>
                        <div className={`rounded-lg p-3 ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground ml-auto'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          {message.attachments && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {message.attachments.map((file, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  <FileText className="w-3 h-3 mr-1" />
                                  {file.name || `File ${idx + 1}`}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* File Attachments Preview */}
              {selectedFiles.length > 0 && (
                <div className="px-6 py-3 border-t border-border">
                  <div className="flex flex-wrap gap-2">
                    {selectedFiles.map((file, index) => (
                      <Badge key={index} variant="outline" className="gap-2">
                        <FileText className="w-3 h-3" />
                        <span className="max-w-20 truncate">{file.name}</span>
                        <button
                          onClick={() => removeFile(index)}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-6 border-t border-border">
                {/* Toolbar */}
                <div className="flex items-center gap-2 mb-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFileSelect('file')}
                    className="gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Files
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFileSelect('image')}
                    className="gap-2"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Images
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFileSelect('audio')}
                    className="gap-2"
                  >
                    <Mic className="w-4 h-4" />
                    Audio
                  </Button>

                  <Button
                    variant={isRecording ? "destructive" : "outline"}
                    size="sm"
                    onClick={isRecording ? stopRecording : startRecording}
                    className="gap-2"
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    {isRecording ? 'Stop Recording' : 'Voice Input'}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => isSpeaking ? null : handleTextToSpeech(inputMessage)}
                    disabled={!inputMessage.trim() || isSpeaking}
                    className="gap-2"
                  >
                    <Volume2 className="w-4 h-4" />
                    {isSpeaking ? 'Speaking...' : 'Test Voice'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCamera}
                    className="gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Camera
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeepSearch}
                    className="gap-2"
                  >
                    <Search className="w-4 h-4" />
                    Deep Search
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleVideoCreation}
                    className="gap-2"
                  >
                    <Video className="w-4 h-4" />
                    Video
                  </Button>
                </div>

                {/* Message Input */}
                <div className="flex gap-2">
                  <Textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message... (Shift+Enter for new line)"
                    className="min-h-[44px] max-h-32 resize-none"
                    rows={1}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || (!inputMessage.trim() && selectedFiles.length === 0)}
                    className="px-3"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hidden File Inputs */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.md,.json,.xml,.csv"
            onChange={handleFileChange}
          />
          <input
            ref={imageInputRef}
            type="file"
            multiple
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <input
            ref={audioInputRef}
            type="file"
            multiple
            className="hidden"
            accept="audio/*"
            onChange={handleFileChange}
          />
        </div>
      </main>
    </div>
  );
};

export default AIChat;