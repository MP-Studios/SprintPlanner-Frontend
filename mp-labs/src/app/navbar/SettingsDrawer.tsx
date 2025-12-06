'use client';
import * as React from 'react';
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
import { useAssignments } from '@/app/context/AssignmentContext';
import { useLoading } from '@/app/context/LoadingContext';
import { getCurrentPalette, setPalette, getAvailablePalettes, saveCustomPalette, getCustomPalette, clearColorMap, removeClassColor, refreshClassColors, refreshColorAssignments, getAllClassColors, type CustomColor } from '@/app/colors/classColors';

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

  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const { classes, deleteClass, refreshClasses } = useClasses();
  const { refreshAssignments } = useAssignments();
  const { showLoading, hideLoading } = useLoading();
  const [enrollmentOpen, setEnrollmentOpen] = React.useState(false);
  const [selectedClassId, setSelectedClassId] = React.useState('');

  const [colorPaletteOpen, setColorPaletteOpen] = React.useState(false);
  const [selectedPalette, setSelectedPalette] = React.useState(getCurrentPalette());
  const [customPaletteOpen, setCustomPaletteOpen] = React.useState(false);
  const [customColors, setCustomColors] = React.useState<CustomColor[]>([]);
  const [forceRefresh, setForceRefresh] = React.useState(0);

  const supabase = createClient();

  const textColor = '#3a554c';
  const backgroundColor = '#edf7f2';
  
  React.useEffect(() => {
    const saved = getCustomPalette();
    if (saved) {
      setCustomColors(saved);
    } else {
      setCustomColors(Array(8).fill(null).map(() => ({
        background: '#F9FAFB',
        hover: '#D1D5DB',
        text: '#111827',
      })));
    }
  }, []);

  React.useEffect(() => {
    if (isOpen && classes.length > 0) {
      const classIds = classes.map(c => c.id);
      refreshColorAssignments(classIds);
    }

    if (isOpen && selectedPalette === 'custom') {
      setCustomPaletteOpen(true);
    }
  }, [isOpen, classes, selectedPalette]);

  const handlePaletteChange = async (paletteId: string) => {
    try {
      showLoading('Updating colors...');
  
      if (paletteId === 'custom') {
        setCustomPaletteOpen(true);
        setSelectedPalette('custom');
        setPalette('custom');
  
        await Promise.all([
          refreshAssignments(),
          refreshClasses(),
        ]);
  
        return;
      }
  
      setCustomPaletteOpen(false);
  
      const success = setPalette(paletteId);
      if (success) {
        setSelectedPalette(paletteId);
  
        await Promise.all([
          refreshAssignments(),
          refreshClasses(),
        ]);
      } else {
        alert('Failed to change palette');
      }
    } catch (err) {
      console.error('Error changing palette:', err);
      alert('Error changing palette. Please try again.');
    } finally {
      hideLoading();
    }
  };

  const handleCustomColorChange = (index: number, field: keyof CustomColor, value: string) => {
    const newColors = [...customColors];
    newColors[index] = { ...newColors[index], [field]: value };
    setCustomColors(newColors);
  };

  const handleAddCustomColor = () => {
    setCustomColors([...customColors, {
      background: '#F9FAFB',
      hover: '#D1D5DB',
      text: '#111827',
    }]);
  };

  const handleRemoveCustomColor = (index: number) => {
    if (customColors.length <= 1) {
      alert('You must have at least one color in your palette');
      return;
    }
    setCustomColors(customColors.filter((_, i) => i !== index));
  };

  const handleSaveCustomPalette = async () => {
    const success = saveCustomPalette(customColors);
    if (success) {
      setPalette('custom');
      setSelectedPalette('custom');
      
      await refreshClassColors(supabase);
      await Promise.all([
        refreshAssignments(),
        refreshClasses()
      ]);
      
      setForceRefresh(prev => prev + 1);
    } else {
      alert('Failed to save custom palette');
    }
  };

  const handleRevertCustomPalette = () => {
    const defaultCustomColors = Array(8).fill(null).map(() => ({
      background: '#F9FAFB',
      hover: '#D1D5DB',
      text: '#111827',
    }));
    setCustomColors(defaultCustomColors);
  };

  const getClassNameForColorIndex = (index: number): string => {
    const classWithColor = classes.find(cls => {
      const colorNum = getAllClassColors()[cls.id];
      return colorNum === index;
    });
    return classWithColor ? classWithColor.name : `Color ${index + 1}`;
  };

  // Save username to backend
  const handleSaveUsername = async () => {
    try {
      showLoading('Saving username...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        hideLoading();
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

      hideLoading();

      if (!res.ok) {
        alert('Failed to update username.');
        return;
      }

      setEditUsernameOpen(false);
    } catch (err) {
      console.error(err);
      hideLoading();
      alert('Error updating username.');
    }
  };

  // Save email to backend
  const handleSaveEmail = async () => {
    try {
      showLoading('Saving email...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        hideLoading();
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

      hideLoading();
      if (!res.ok) {
        alert('Failed to update email.');
        return;
      }

      setEditEmailOpen(false);
    } catch (err) {
      console.error(err);
      hideLoading();
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
      showLoading('Changing password...');

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        hideLoading();
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
      hideLoading();

      if (!res.ok) {
        alert(`Failed to change password: ${data.message || 'Unknown error'}`);
        return;
      }

      setEditPasswordOpen(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
        hideLoading();
        console.error(err);
        alert('Error changing password.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      showLoading('Deleting account...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        hideLoading();
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
        hideLoading();
        console.log('Account deletion successful, signing out...');
        
        // Sign out the user after successful deletion
        await supabase.auth.signOut();
        
        alert('Account deleted successfully. You will be redirected to the login page.');
        setShowDeleteConfirm(false);
        onClose();
        
        // Redirect to login page
        window.location.href = '/login';
      } else {
        hideLoading();
        console.error('Account deletion failed:', data);
        alert(`Failed to delete account: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      hideLoading();
      console.error('Error in handleDeleteAccount:', err);
      alert('Error deleting account.');
    }
  };

  const handleDeleteCalendar = async () => {
    try {
      showLoading('Deleting calendar...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        hideLoading();
        alert('Not authenticated. Please log in.');
        return;
      }
  
      console.log('Calling delete calendar API');

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
        clearColorMap();
        localStorage.removeItem('app-classes');
        await Promise.all([
          refreshAssignments(),
          refreshClasses()
        ]);
        refreshColorAssignments([]);
        hideLoading();
        setShowDeleteCalendarConfirm(false);
        onClose();
      } else {
        hideLoading();
        console.error('Calendar deletion failed:', data);
        alert(`Failed to delete Calendar: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error in handleDeleteCalendar:', err);
      hideLoading();
      alert('Error deleting calendar.');
    }
  };

  const handleDeleteClass = async () => {
    try {
      showLoading('Deleting class...');
      const success = await deleteClass(selectedClassId);                      
      if (success) {
        removeClassColor(selectedClassId);
        await Promise.all([
          refreshAssignments(),
          refreshClasses()
        ]);
        await refreshClassColors(supabase);
        setSelectedClassId('');
      } else {
        alert('Failed to delete class');
      }
      hideLoading();      
    } catch (error) {
      console.error('Error deleting class:', error);
      hideLoading();
      alert('Error deleting class');
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
        {/* custom color palette */}
        <List>
          <ListItemButton onClick={() => setColorPaletteOpen(!colorPaletteOpen)}>
            <ListItemText primary="Color Palette" />
            <span>{colorPaletteOpen ? '−' : '+'}</span>
          </ListItemButton>
          <Collapse in={colorPaletteOpen} timeout="auto" unmountOnExit>
            <Box sx={{ pl: 3, pr: 3, pt: 2 }}>
              <TextField
                select
                fullWidth
                label="Select Palette"
                value={selectedPalette}
                onChange={(e) => handlePaletteChange(e.target.value)}
                margin="normal"
              >
                {getAvailablePalettes().map((palette) => (
                  <MenuItem key={palette.id} value={palette.id}>
                    {palette.name}
                  </MenuItem>
                ))}
              </TextField>

              {/* Custom Palette Editor */}
              {customPaletteOpen && (
                <Box sx={{ mt: 2, p: 2, border: `1px solid ${textColor}`, borderRadius: 2 }}>
                  <h3 className="font-bold mb-3" style={{ color: textColor }}>
                    Custom Palette Editor
                  </h3>
                  <p className="text-sm mb-3" style={{ color: textColor }}>
                    Create your own color palette. Each class will be assigned one of these colors.
                  </p>
                  {classes.length === 0 && (
                    <p className="text-sm mb-3 italic" style={{ color: '#666' }}>
                      Add classes to see their names here. Colors will be assigned to classes as you create them.
                    </p>
                  )}
                  {customColors.map((color, index) => (
                    <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                      {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}> */}
                      <Box sx={{ mb: 2 }}>
                        <h4 className="font-semibold" style={{ color: textColor }}>{getClassNameForColorIndex(index)}</h4>
                      </Box>
                      <TextField
                        fullWidth
                        label="Background Color"
                        type="color"
                        value={color.background}
                        onChange={(e) => handleCustomColorChange(index, 'background', e.target.value)}
                        margin="dense"
                        size="small"
                      />
                      <TextField
                        fullWidth
                        label="Hover Color"
                        type="color"
                        value={color.hover}
                        onChange={(e) => handleCustomColorChange(index, 'hover', e.target.value)}
                        margin="dense"
                        size="small"
                      />
                      <TextField
                        fullWidth
                        label="Text Color"
                        type="color"
                        value={color.text}
                        onChange={(e) => handleCustomColorChange(index, 'text', e.target.value)}
                        margin="dense"
                        size="small"
                      />
                      {customColors.length > 1 && (
                        <Button
                          fullWidth
                          size="small"
                          color="error"
                          variant="outlined"
                          onClick={() => handleRemoveCustomColor(index)}
                          sx={{ mt: 1 }}
                        >
                          Remove
                        </Button>
                      )}
                    </Box>
                  ))}
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleSaveCustomPalette}
                    >
                      Save Custom Palette
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="warning"
                      onClick={handleRevertCustomPalette}
                    >
                      Reset Palette
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
                  onChange={(e) => {setSelectedClassId(e.target.value)}}
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
                        onClick={handleDeleteClass}
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
    </Drawer>
  );
}
