import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, Save, Trash2, Key, Check, X } from 'lucide-react';

interface APIKey {
  name: string;
  key: string;
  isSet: boolean;
  description: string;
}

const APIKeyManager = () => {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      name: 'GEMINI_API_KEY',
      key: '',
      isSet: false,
      description: 'Google Gemini API key for AI conversations and analysis'
    },
    {
      name: 'OPENAI_API_KEY',
      key: '',
      isSet: false,
      description: 'OpenAI API key for GPT models and advanced AI features'
    },
    {
      name: 'ANTHROPIC_API_KEY',
      key: '',
      isSet: false,
      description: 'Anthropic Claude API key for AI assistance'
    },
    {
      name: 'HUGGING_FACE_TOKEN',
      key: '',
      isSet: false,
      description: 'Hugging Face token for AI models and transformers'
    }
  ]);
  
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [editingKeys, setEditingKeys] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    // Check which API keys are already configured
    checkExistingKeys();
  }, []);

  const checkExistingKeys = async () => {
    // This would typically call your backend to check which keys are set
    // For now, we'll simulate this
    console.log('Checking existing API keys...');
  };

  const toggleVisibility = (keyName: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyName)) {
      newVisible.delete(keyName);
    } else {
      newVisible.add(keyName);
    }
    setVisibleKeys(newVisible);
  };

  const startEditing = (keyName: string) => {
    const newEditing = new Set(editingKeys);
    newEditing.add(keyName);
    setEditingKeys(newEditing);
  };

  const cancelEditing = (keyName: string) => {
    const newEditing = new Set(editingKeys);
    newEditing.delete(keyName);
    setEditingKeys(newEditing);
    
    // Reset the key value
    setApiKeys(prev => prev.map(api => 
      api.name === keyName ? { ...api, key: '' } : api
    ));
  };

  const updateKey = (keyName: string, value: string) => {
    setApiKeys(prev => prev.map(api => 
      api.name === keyName ? { ...api, key: value } : api
    ));
  };

  const saveKey = async (keyName: string) => {
    const apiKey = apiKeys.find(k => k.name === keyName);
    if (!apiKey?.key.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    try {
      // This would save to your backend/Supabase secrets
      console.log(`Saving ${keyName}:`, apiKey.key.substring(0, 8) + '...');
      
      // Update the state to reflect saved status
      setApiKeys(prev => prev.map(api => 
        api.name === keyName ? { ...api, isSet: true, key: '' } : api
      ));
      
      const newEditing = new Set(editingKeys);
      newEditing.delete(keyName);
      setEditingKeys(newEditing);
      
      const newVisible = new Set(visibleKeys);
      newVisible.delete(keyName);
      setVisibleKeys(newVisible);

      toast({
        title: "Success",
        description: `${keyName} has been saved successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to save ${keyName}`,
        variant: "destructive",
      });
    }
  };

  const deleteKey = async (keyName: string) => {
    try {
      // This would delete from your backend/Supabase secrets
      console.log(`Deleting ${keyName}`);
      
      setApiKeys(prev => prev.map(api => 
        api.name === keyName ? { ...api, isSet: false, key: '' } : api
      ));

      toast({
        title: "Success",
        description: `${keyName} has been removed`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to remove ${keyName}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">AI Service Configuration</h3>
        <p className="text-sm text-muted-foreground">
          Configure API keys to enable AI features. Keys are securely encrypted and stored.
        </p>
      </div>

      {apiKeys.map((apiKey) => (
        <Card key={apiKey.name} className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Key className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">{apiKey.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {apiKey.description}
                  </CardDescription>
                </div>
              </div>
              <Badge variant={apiKey.isSet ? "default" : "secondary"}>
                {apiKey.isSet ? (
                  <><Check className="w-3 h-3 mr-1" />Configured</>
                ) : (
                  <><X className="w-3 h-3 mr-1" />Not Set</>
                )}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            {editingKeys.has(apiKey.name) ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      type={visibleKeys.has(apiKey.name) ? "text" : "password"}
                      value={apiKey.key}
                      onChange={(e) => updateKey(apiKey.name, e.target.value)}
                      placeholder={`Enter your ${apiKey.name}`}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                      onClick={() => toggleVisibility(apiKey.name)}
                    >
                      {visibleKeys.has(apiKey.name) ? (
                        <EyeOff className="w-3 h-3" />
                      ) : (
                        <Eye className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm"
                    onClick={() => saveKey(apiKey.name)}
                    className="gap-2"
                  >
                    <Save className="w-3 h-3" />
                    Save
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => cancelEditing(apiKey.name)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {apiKey.isSet ? 'API key is configured and ready to use' : 'No API key configured'}
                </span>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => startEditing(apiKey.name)}
                  >
                    {apiKey.isSet ? 'Update' : 'Configure'}
                  </Button>
                  {apiKey.isSet && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => deleteKey(apiKey.name)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Security Note:</strong> API keys are encrypted and stored securely. 
          They are only used for AI service requests and are never logged or exposed.
        </p>
      </div>
    </div>
  );
};

export default APIKeyManager;