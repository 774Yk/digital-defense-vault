import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, Shield, Globe, Database, ExternalLink, AlertTriangle, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ExploitDbResult {
  id: string;
  description: string;
  type: string;
  platform: string;
  date: string;
  author: string;
  verified: boolean;
  tags: string[];
}

interface ShodanResult {
  id: string;
  title: string;
  cve: string;
  summary: string;
  severity: string;
  published: string;
  references: string[];
}

interface SearchResults {
  exploitdb: ExploitDbResult[];
  shodan: ShodanResult[];
  error?: string;
}

export const ExternalVulnSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({ exploitdb: [], shodan: [] });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('exploitdb');

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('vulnerability-search', {
        body: { query: searchQuery }
      });

      if (error) throw error;
      
      setResults(data || { exploitdb: [], shodan: [] });
    } catch (error) {
      console.error('Search error:', error);
      setResults({
        exploitdb: [],
        shodan: [],
        error: 'Failed to fetch vulnerability data. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    const normalizedSeverity = severity?.toLowerCase();
    switch (normalizedSeverity) {
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-primary/20 text-primary border-primary/50';
    }
  };

  const renderExploitDbResults = () => (
    <div className="space-y-4">
      {loading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="border-primary/20 bg-card/60 backdrop-blur-md">
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))
      ) : results.exploitdb.length === 0 ? (
        <div className="text-center py-8">
          <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {searchQuery ? 'No exploits found for this query' : 'Enter a search term to find exploits'}
          </p>
        </div>
      ) : (
        results.exploitdb.map((exploit) => (
          <Card key={exploit.id} className="border-primary/20 bg-card/60 backdrop-blur-md hover:border-primary/50 transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  {exploit.description}
                </CardTitle>
                {exploit.verified && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                    Verified
                  </Badge>
                )}
              </div>
              <CardDescription className="flex items-center gap-2 text-sm">
                <Badge variant="outline">{exploit.type}</Badge>
                <Badge variant="outline">{exploit.platform}</Badge>
                <span className="text-muted-foreground">{exploit.date}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  {exploit.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    By {exploit.author}
                  </span>
                  {exploit.id ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => window.open(`https://www.exploit-db.com/exploits/${exploit.id}`, '_blank', 'noopener,noreferrer')}
                    >
                      <ExternalLink className="w-3 h-3" />
                      View Exploit
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="gap-2" disabled>
                      <ExternalLink className="w-3 h-3 opacity-50" />
                      Link Unavailable
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  const renderShodanResults = () => (
    <div className="space-y-4">
      {loading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="border-primary/20 bg-card/60 backdrop-blur-md">
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))
      ) : results.shodan.length === 0 ? (
        <div className="text-center py-8">
          <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {searchQuery ? 'No vulnerabilities found for this query' : 'Enter a search term to find vulnerabilities'}
          </p>
        </div>
      ) : (
        results.shodan.map((vuln) => (
          <Card key={vuln.id} className="border-primary/20 bg-card/60 backdrop-blur-md hover:border-primary/50 transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {vuln.title}
                </CardTitle>
                <Badge className={getSeverityColor(vuln.severity)}>
                  {vuln.severity}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-2 text-sm">
                {vuln.cve && <Badge variant="outline">{vuln.cve}</Badge>}
                <span className="text-muted-foreground">{vuln.published}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {vuln.summary}
                </p>
                {vuln.references.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {vuln.references.slice(0, 3).map((ref, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        Reference {i + 1}
                      </Badge>
                    ))}
                    {vuln.references.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{vuln.references.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
                <div className="flex justify-end">
                  {vuln.cve ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => window.open(`https://www.shodan.io/search?query=${encodeURIComponent(vuln.cve)}`, '_blank', 'noopener,noreferrer')}
                    >
                      <ExternalLink className="w-3 h-3" />
                      View Details
                    </Button>
                  ) : vuln.title ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => window.open(`https://www.shodan.io/search?query=${encodeURIComponent(vuln.title)}`, '_blank', 'noopener,noreferrer')}
                    >
                      <ExternalLink className="w-3 h-3" />
                      View Details
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="gap-2" disabled>
                      <ExternalLink className="w-3 h-3 opacity-50" />
                      Link Unavailable
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <Card className="border-primary/20 bg-card/60 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            External Vulnerability Search
          </CardTitle>
          <CardDescription>
            Search real-time vulnerability data from Exploit Database and Shodan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Search for vulnerabilities, CVEs, or exploits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading || !searchQuery.trim()}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Legal Notice */}
      <Alert className="border-destructive/20 bg-destructive/5">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Legal Notice:</strong> This information is provided for educational and defensive security purposes only. 
          Unauthorized testing against systems you don't own is illegal and unethical.
        </AlertDescription>
      </Alert>

      {/* Error Display */}
      {results.error && (
        <Alert className="border-destructive/50 bg-destructive/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{results.error}</AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {(searchQuery && (results.exploitdb.length > 0 || results.shodan.length > 0 || loading)) && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="exploitdb" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Exploit Database ({results.exploitdb.length})
            </TabsTrigger>
            <TabsTrigger value="shodan" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Shodan ({results.shodan.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="exploitdb" className="mt-6">
            {renderExploitDbResults()}
          </TabsContent>
          
          <TabsContent value="shodan" className="mt-6">
            {renderShodanResults()}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};