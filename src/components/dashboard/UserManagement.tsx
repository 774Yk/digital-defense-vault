import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Users, UserPlus, Edit, Trash2, Shield } from 'lucide-react'

interface UserProfile {
  id: string
  user_id: string
  name: string | null
  role: string
  is_active: boolean
  created_at: string
  updated_at: string
  email?: string
}

export function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [editUser, setEditUser] = useState<UserProfile | null>(null)
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserRole, setNewUserRole] = useState('User')
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      // Show demo users since we don't have user management tables yet
      setUsers([
        {
          id: '1',
          user_id: '1', 
          name: 'Demo Admin',
          role: 'Admin',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          email: 'admin@demo.com'
        }
      ])
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      toast({
        title: "Info",
        description: "User management will be available once user system is implemented"
      })
    } catch (error) {
      console.error('Error updating user role:', error)
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive"
      })
    }
  }

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      toast({
        title: "Info", 
        description: "User management will be available once user system is implemented"
      })
    } catch (error) {
      console.error('Error toggling user status:', error)
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive"
      })
    }
  }

  const promoteUserByEmail = async () => {
    if (!newUserEmail || !newUserRole) return

    try {
      toast({
        title: "Info",
        description: "User role management will be available once user system is implemented"
      })
      setNewUserEmail('')
      setNewUserRole('User')
    } catch (error) {
      console.error('Error promoting user:', error)
      toast({
        title: "Error",
        description: "Failed to update user role. Make sure the email exists.",
        variant: "destructive"
      })
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'SuperAdmin': return 'destructive'
      case 'Admin': return 'default'
      case 'Editor': return 'secondary'
      default: return 'outline'
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading users...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage user roles and permissions
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <UserPlus className="w-4 h-4" />
                  Promote User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Promote User Role</DialogTitle>
                  <DialogDescription>
                    Enter the email of an existing user to change their role
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">User Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@example.com"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select value={newUserRole} onValueChange={setNewUserRole}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="User">User</SelectItem>
                        <SelectItem value="Editor">Editor</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="SuperAdmin">SuperAdmin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={promoteUserByEmail}>Update Role</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name || 'N/A'}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.is_active ? "default" : "secondary"}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditUser(user)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit User Role</DialogTitle>
                            <DialogDescription>
                              Change the role for {user.name || user.email}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Label>Role</Label>
                            <Select
                              defaultValue={user.role}
                              onValueChange={(value) => updateUserRole(user.user_id, value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="User">User</SelectItem>
                                <SelectItem value="Editor">Editor</SelectItem>
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="SuperAdmin">SuperAdmin</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                          >
                            <Shield className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {user.is_active ? 'Deactivate' : 'Activate'} User
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to {user.is_active ? 'deactivate' : 'activate'} this user?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => toggleUserStatus(user.user_id, user.is_active)}
                            >
                              {user.is_active ? 'Deactivate' : 'Activate'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}