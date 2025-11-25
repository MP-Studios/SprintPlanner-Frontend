'use client';
import * as React from 'react';
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import TextField from '@mui/material/TextField';
import { createClient } from '@/utils/supabase/client';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import {useClasses} from '@/app/context/ClassContext';
import Image from 'next/image';
import { useAssignments } from '@/app/context/AssignmentContext';

type SettingsDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SettingsDrawer({ isOpen, onClose }: SettingsDrawerProps) {
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [editUsernameOpen, setEditUsernameOpen] = React.useState(false);
  const [editEmailOpen, setEditEmailOpen] = React.useState(false);
  const [editPasswordOpen, setEditPasswordOpen] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [showDeleteCalendarConfirm, setShowDeleteCalendarConfirm] = React.useState(false);
  const [isDeletingCalendar, setIsDeletingCalendar] = React.useState(false);
  const [isDeletingClass, setIsDeletingClass] = React.useState(false);
  const [isImageLoaded, setIsImageLoaded] = React.useState(false);
  const [showZs, setShowZs] = React.useState(false);
  const {refreshAssignments} = useAssignments();

  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const {classes, deleteClass, refreshClasses} = useClasses();
  const [enrollmentOpen, setEnrollmentOpen] = React.useState(false);
  const [selectedClassId, setSelectedClassId] = React.useState('');

  const supabase = createClient();

  const textColor = '#3a554c';
  const backgroundColor = '#edf7f2';

  // Save username to backend
  const handleSaveUsername = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        alert('Not authenticated. Please log in.');
        return;
      }

      const res = await fetch('/api/updateUsername', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ newUsername: username }),
      });

      if (!res.ok) {
        alert('Failed to update username.');
        return;
      }

      alert('Username updated successfully!');
      setEditUsernameOpen(false);
    } catch (err) {
      console.error(err);
      alert('Error updating username.');
    }
  };

  // Save email to backend
  const handleSaveEmail = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        alert('Not authenticated. Please log in.');
        return;
      }

      const res = await fetch('/api/updateEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        alert('Failed to update email.');
        return;
      }

      alert('Email updated successfully!');
      setEditEmailOpen(false);
    } catch (err) {
      console.error(err);
      alert('Error updating email.');
    }
  };

  const handleChangePassword = async () => {
    try {
      // Check if passwords match
      if (newPassword !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }

      // Validate password requirements (same as login page)
      const valid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{15,}$/.test(newPassword);
      if (!valid) {
        alert('Password must include at least 15 characters, one upper-case, one lower-case, one number, and one special character.');
        return;
      }

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        alert('Not authenticated. Please log in.');
        return;
      }

      const res = await fetch('/api/changePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`Failed to change password: ${data.message || 'Unknown error'}`);
        return;
      }

      alert('Password changed successfully!');
      setEditPasswordOpen(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      alert('Error changing password.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        alert('Not authenticated. Please log in.');
        return;
      }
  
      console.log('Calling delete account API...');
  
      const res = await fetch('/api/deleteAccount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
      });
  
      console.log('API response status:', res.status);
  
      const data = await res.json();
      console.log('API response data:', data);
  
      // Check if response is OK (status 200-299) OR if data.success is true
      if (res.ok || data.success) {
        console.log('Account deletion successful, signing out...');
        
        // Sign out the user after successful deletion
        await supabase.auth.signOut();
        
        alert('Account deleted successfully. You will be redirected to the login page.');
        setShowDeleteConfirm(false);
        onClose();
        
        // Redirect to login page
        window.location.href = '/login';
      } else {
        console.error('Account deletion failed:', data);
        alert(`Failed to delete account: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error in handleDeleteAccount:', err);
      alert('Error deleting account.');
    }
  };

  useEffect(() => {
    const img = new window.Image();
    img.src = '/sleepy.png';
    img.onload = () => setIsImageLoaded(true);
  }, []);

  const handleDeleteCalendar = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        alert('Not authenticated. Please log in.');
        return;
      }
  
      console.log('Calling delete calendar API');
      setIsDeletingCalendar(true);
      setShowZs(false);

      const res = await fetch('/api/deleteCalendar', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
  
      console.log('API response status:', res.status);
  
      const data = await res.json();
      console.log('API response data:', data);
  
      // Check if response is OK (status 200-299) OR if data.success is true
      if (res.ok) {
        console.log('Calendar deletion successful...');
        await Promise.all([
          refreshAssignments(),
          refreshClasses()
        ]);
        localStorage.removeItem('app-classes');
        setShowDeleteCalendarConfirm(false);
        setIsDeletingCalendar(false);
        setShowZs(false);
        onClose();
      } else {
        console.error('Calendar deletion failed:', data);
        setIsDeletingCalendar(false);
        setShowZs(false)
        alert(`Failed to delete Calendar: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error in handleDeleteCalendar:', err);
      setIsDeletingCalendar(false);
      setShowZs(false)
      alert('Error deleting calendar.');
    }
  };
  
  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      <Box
        sx={{
          width: 350,
          p: 3,
          bgcolor: 'background.paper',
          color: textColor,
          '& .MuiListItemButton-root': { color: textColor },
          '& .MuiButton-root': {
            color: textColor,
            backgroundColor,
            borderColor: textColor,
          },
          '& .MuiTextField-root': {
            '& .MuiInputBase-input': { color: textColor },
            '& .MuiInputLabel-root': { color: textColor },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: textColor },
              '&:hover fieldset': { borderColor: textColor },
              '&.Mui-focused fieldset': { borderColor: textColor },
            },
            backgroundColor,
          },
        }}
        role="presentation"
      >
        <h2 className="text-2xl font-bold mb-6" style={{ color: textColor }}>
          Settings
        </h2>

        <List>
          <ListItemButton onClick={() => setProfileOpen(!profileOpen)}>
            <ListItemText primary="Profile" />
            <span>{profileOpen ? '−' : '+'}</span>
          </ListItemButton>

          <Collapse in={profileOpen} timeout="auto" unmountOnExit>
            <Box sx={{ pl: 3, pr: 3, pt: 2 }}>
              {/* Username */}
              <ListItemButton onClick={() => setEditUsernameOpen(!editUsernameOpen)}>
                <ListItemText primary="Edit Username" />
                <span>{editUsernameOpen ? '−' : '+'}</span>
              </ListItemButton>
              <Collapse in={editUsernameOpen} timeout="auto" unmountOnExit>
                <Box sx={{ pl: 3, pt: 2 }}>
                  <TextField
                    fullWidth
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    margin="normal"
                  />
                  <Button fullWidth variant="contained" sx={{ mt: 1 }} onClick={handleSaveUsername}>
                    Save changes
                  </Button>
                </Box>
              </Collapse>

              {/* Email */}
              <ListItemButton onClick={() => setEditEmailOpen(!editEmailOpen)}>
                <ListItemText primary="Edit Email" />
                <span>{editEmailOpen ? '−' : '+'}</span>
              </ListItemButton>
              <Collapse in={editEmailOpen} timeout="auto" unmountOnExit>
                <Box sx={{ pl: 3, pt: 2 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                  />
                  <Button fullWidth variant="contained" sx={{ mt: 1 }} onClick={handleSaveEmail}>
                    Save changes
                  </Button>
                </Box>
              </Collapse>

              <ListItemButton onClick={() => setEditPasswordOpen(!editPasswordOpen)}>
                <ListItemText primary="Change Password" />
                <span>{editPasswordOpen ? '−' : '+'}</span>
              </ListItemButton>
              <Collapse in={editPasswordOpen} timeout="auto" unmountOnExit>
                <Box sx={{ pl: 3, pt: 2 }}>
                  <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    margin="normal"
                    placeholder="At least 15 characters"
                  />
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    margin="normal"
                    placeholder="Re-enter new password"
                  />
                  <p style={{ 
                    fontSize: '0.75rem', 
                    color: textColor, 
                    marginTop: '8px',
                    marginBottom: '8px',
                    lineHeight: '1.2'
                  }}>
                    Password must include at least 15 characters, one upper-case, one lower-case, one number, and one special character.
                  </p>
                  <Button fullWidth variant="contained" sx={{ mt: 1 }} onClick={handleChangePassword}>
                    Change Password
                  </Button>
                </Box>
              </Collapse>

              {/* Delete Account */}
              <Button
                fullWidth
                variant="outlined"
                color="error"
                sx={{ mt: 2, '&:hover': { backgroundColor: '#dc2626' } }}
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete My Account
              </Button>

              {showDeleteConfirm && (
                <Box sx={{ 
                  mt: 3, 
                  p: 2, 
                  border: '2px solid #dc2626', 
                  borderRadius: 2, 
                  backgroundColor: '#fee',
                  color: '#991b1b'
                }}>
                  <h3 className="font-bold text-lg mb-2">⚠️ Warning: Permanent Deletion</h3>
                  <p className="mb-2">This action will permanently delete:</p>
                  <ul className="list-disc list-inside mb-4 text-sm">
                    <li>Your user account</li>
                    <li>All your assignments</li>
                    <li>All your classes</li>
                    <li>Your entire backlog</li>
                    <li>All associated data</li>
                  </ul>
                  <p className="font-bold mb-4">This action CANNOT be undone!</p>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button 
                      variant="contained" 
                      onClick={() => setShowDeleteConfirm(false)}
                      sx={{ 
                        backgroundColor: '#10b981',
                        '&:hover': { backgroundColor: '#059669' }
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="contained" 
                      color="error" 
                      sx={{ 
                        backgroundColor: '#dc2626',
                        '&:hover': { backgroundColor: '#991b1b' }
                      }} 
                      onClick={handleDeleteAccount}
                    >
                      Yes, Delete Everything
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          </Collapse>
        </List>
        
        <Divider sx={{ my: 2, borderColor: textColor }} />
          
          {/* Enrollment Section */}
          <List>
            <ListItemButton onClick={() => setEnrollmentOpen(!enrollmentOpen)}>
              <ListItemText primary="Enrollment" />
              <span>{enrollmentOpen ? '−' : '+'}</span>
            </ListItemButton>
            <Collapse in={enrollmentOpen} timeout="auto" unmountOnExit>
              <Box sx={{ pl: 3, pr: 3, pt: 2 }}>
              {classes.length === 0 ? (
                <p className="text-sm text-gray-500 mb-3">Please add your classes.</p>
              ) : (
                <>
                <TextField
                  select
                  fullWidth
                  label="Delete Class"
                  value={selectedClassId}
                  onChange={(e) => {
                    setSelectedClassId(e.target.value)}
                  }
                  margin="normal"
                >
                  {classes.map((cls) => (
                    <MenuItem key={cls.id} value={cls.id}>{cls.name}</MenuItem>
                  ))}
                </TextField>
                {selectedClassId && (
                  <Box sx={{ mt: 3, p: 2, border: '2px solid #dc2626', borderRadius: 2, backgroundColor: '#fee', color: '#991b1b' }}>
                    <p className="font-semibold mb-4">
                      Delete {classes.find(c => c.id === selectedClassId)?.name}?
                    </p>
                    <p className="mb-4">
                      This will permanently remove this class and all its assignments. This cannot be undone!
                    </p>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                      <Button 
                        variant="contained" 
                        onClick={() => setSelectedClassId('')}
                        sx={{ 
                          backgroundColor: backgroundColor,
                          '&:hover': { backgroundColor: '#d1e7dd' }
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="contained" 
                        sx={{
                          backgroundColor: backgroundColor,
                          color: 'white',
                          '&:hover': { backgroundColor: '#b91c1c' }
                        }} 
                        onClick={async () => {
                          setIsDeletingClass(true);
                          setShowZs(false);
                          
                          try {
                            const success = await deleteClass(selectedClassId);
                            
                            if (success) {
                              await refreshAssignments();
                              setSelectedClassId('');
                            } else {
                              alert('Failed to delete class');
                            }
                          } catch (error) {
                            console.error('Error deleting class:', error);
                            alert('Error deleting class');
                          } finally {
                            setIsDeletingClass(false);
                            setShowZs(false);
                          }
                        }}
                      >
                        Yes, Delete
                      </Button>
                    </Box>
                  </Box>
                  )}
                </>
              )}
              {/* delete calendar */}
              {classes.length > 0 && (
              <>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  sx={{ mt: 2, '&:hover': { backgroundColor: '#dc2626' } }}
                  onClick={() => setShowDeleteCalendarConfirm(true)}
                >
                  Delete My Calendar
                </Button>

                {showDeleteCalendarConfirm && (
                  <Box sx={{ 
                    mt: 3, 
                    p: 2, 
                    border: '2px solid #dc2626', 
                    borderRadius: 2, 
                    backgroundColor: '#fee',
                    color: '#991b1b'
                  }}>
                    <h3 className="font-bold text-lg mb-2">Warning: Permanent Deletion</h3>
                    <p className="mb-2">This action will permanently delete:</p>
                    <ul className="list-disc list-inside mb-4 text-sm">
                      <li>All your assignments</li>
                      <li>All your classes</li>
                    </ul>
                    <p className="font-bold mb-4">This action CANNOT be undone!</p>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                      <Button 
                        variant="contained" 
                        onClick={() => setShowDeleteCalendarConfirm(false)}
                        sx={{ 
                          backgroundColor: '#10b981',
                          '&:hover': { backgroundColor: '#059669' }
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="contained" 
                        color="error" 
                        sx={{ 
                          backgroundColor: '#dc2626',
                          '&:hover': { backgroundColor: '#991b1b' }
                        }} 
                        onClick={handleDeleteCalendar}
                      >
                        Yes, Delete Calendar
                      </Button>
                    </Box>
                  </Box>
                )}
              </>
              )}
            </Box>
          </Collapse>
        </List>
      </Box>
      {isDeletingCalendar && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <div className="loading-container">
            <Image 
              src="/sleepy.png" 
              alt="Deleting calendar..." 
              width={300} 
              height={300}
              priority
              onLoad={() => {
                setIsImageLoaded(true);
                setTimeout(() => setShowZs(true), 100);
              }}
            />
            {showZs && (
              <div className="z-container">
                <div className="z z-1">Z</div>
                <div className="z z-2">Z</div>
                <div className="z z-3">Z</div>
                <div className="z z-4">Z</div>
              </div>
            )}
          </div>
          <p style={{ 
            color: 'white', 
            marginTop: '20px', 
            fontSize: '18px',
            fontWeight: 'bold' 
          }}>
            Deleting your calendar...
          </p>
        </Box>
      )}
      {isDeletingClass && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <div className="loading-container">
            <Image 
              src="/sleepy.png" 
              alt="Deleting class..." 
              width={300} 
              height={300}
              priority
              onLoad={() => {
                setIsImageLoaded(true);
                setTimeout(() => setShowZs(true), 100);
              }}
            />
            {showZs && (
              <div className="z-container">
                <div className="z z-1">Z</div>
                <div className="z z-2">Z</div>
                <div className="z z-3">Z</div>
                <div className="z z-4">Z</div>
              </div>
            )}
          </div>
          <p style={{ 
            color: 'white', 
            marginTop: '20px', 
            fontSize: '18px',
            fontWeight: 'bold' 
          }}>
            Deleting your class...
          </p>
        </Box>
      )}
    </Drawer>
  );
}
