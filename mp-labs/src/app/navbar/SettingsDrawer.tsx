'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

type SettingsDrawerProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function SettingsDrawer({ isOpen, onClose }: SettingsDrawerProps) {
    const [profileOpen, setProfileOpen] = React.useState(false);
    const [displayOpen, setDisplayOpen] = React.useState(false);
    const [privacyOpen, setPrivacyOpen] = React.useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [colorPalette, setColorPalette] = React.useState('default');
    const [fontSize, setFontSize] = React.useState('medium');
    const [compactView, setCompactView] = React.useState(false);
    const [notifications, setNotifications] = React.useState(true);
    const [dataSharing, setDataSharing] = React.useState(false);

    const handleDeleteAccount = () => {
      console.log('Account deleted');
      setShowDeleteConfirm(false);
      onClose();
    };

    const textColor = '#3a554c';
    const backgroundColor = '#edf7f2';

    return (
      <Drawer anchor="right" open={isOpen} onClose={onClose}>
        <Box
          sx={{
            width: 350,
            p: 3,
            bgcolor: 'background.paper',
            color: textColor,
            '& .MuiListItemButton-root': {
              color: textColor
            },
            '& .MuiButton-root': {
              color: textColor,
              backgroundColor: backgroundColor,
              borderColor: textColor
            },
            '& .MuiTextField-root': {
              '& .MuiInputBase-input': { color: textColor },
              '& .MuiInputLabel-root': { color: textColor },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: textColor },
                '&:hover fieldset': { borderColor: textColor },
                '&.Mui-focused fieldset': { borderColor: textColor }
              },
              backgroundColor: backgroundColor
            }
          }}
          role="presentation"
        >
          <h2 className="text-2xl font-bold mb-6" style={{ color: textColor }}>
            Settings
          </h2>

          {/* Profile Section */}
          <List>
            <ListItemButton onClick={() => setProfileOpen(!profileOpen)}>
              <ListItemText primary="Profile" />
              <span>{profileOpen ? '−' : '+'}</span>
            </ListItemButton>
            <Collapse in={profileOpen} timeout="auto" unmountOnExit>
              <Box sx={{ pl: 3, pr: 3, pt: 2 }}>
                <TextField
                  fullWidth
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                />
                <Button fullWidth variant="contained" sx={{ mt: 2 }}>
                  Change Password
                </Button>
                <Button fullWidth variant="contained" sx={{ mt: 1 }}>
                  Update Profile Picture
                </Button>
                {/* Delete Account */}
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  sx={{
                    mt: 1,
                    '&:hover': { backgroundColor: '#dc2626' } // Tailwind red-600
                  }}
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete My Account
                </Button>

                {showDeleteConfirm && (
                  <Box sx={{ mt: 3, p: 2, border: '1px solid #ccc', borderRadius: 2, backgroundColor: backgroundColor }}>
                    <p className="mb-4">This action cannot be undone. Are you sure?</p>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                      <Button variant="contained" onClick={() => setShowDeleteConfirm(false)}>
                        Cancel
                      </Button>
                      <Button variant="contained" color="error" sx={{
                            '&:hover': { backgroundColor: '#dc2626' } // Tailwind red-600
                        }} onClick={handleDeleteAccount}>
                        Yes, Delete
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            </Collapse>
          </List>

          <Divider sx={{ my: 2, borderColor: textColor }} />

          {/* Display Section */}
          <List>
            <ListItemButton onClick={() => setDisplayOpen(!displayOpen)}>
              <ListItemText primary="Display" />
              <span>{displayOpen ? '−' : '+'}</span>
            </ListItemButton>
            <Collapse in={displayOpen} timeout="auto" unmountOnExit>
              <Box sx={{ pl: 3, pr: 3, pt: 2 }}>
                <TextField
                  select
                  fullWidth
                  label="Color Palette"
                  value={colorPalette}
                  onChange={(e) => setColorPalette(e.target.value)}
                  margin="normal"
                >
                  <MenuItem value="default">Default (Green)</MenuItem>
                  <MenuItem value="pink">Pink</MenuItem>
                  <MenuItem value="blue">Blue</MenuItem>
                  <MenuItem value="purple">Purple</MenuItem>
                  <MenuItem value="sunset">Sunset</MenuItem>
                  <MenuItem value="blackwhite">Black & White</MenuItem>
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Font Size"
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  margin="normal"
                >
                  <MenuItem value="small">Small</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="large">Large</MenuItem>
                </TextField>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <span>Compact View</span>
                  <input
                    type="checkbox"
                    checked={compactView}
                    onChange={(e) => setCompactView(e.target.checked)}
                  />
                </Box>
              </Box>
            </Collapse>
          </List>

          <Divider sx={{ my: 2, borderColor: textColor }} />

          {/* Privacy Section */}
          <List>
            <ListItemButton onClick={() => setPrivacyOpen(!privacyOpen)}>
              <ListItemText primary="Privacy" />
              <span>{privacyOpen ? '−' : '+'}</span>
            </ListItemButton>
            <Collapse in={privacyOpen} timeout="auto" unmountOnExit>
              <Box sx={{ pl: 3, pr: 3, pt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                  <span>Push Notifications</span>
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                  <span>Data Sharing</span>
                  <input
                    type="checkbox"
                    checked={dataSharing}
                    onChange={(e) => setDataSharing(e.target.checked)}
                  />
                </Box>

                <Button fullWidth variant="outlined" sx={{ mt: 2 }}>
                  Privacy Policy
                </Button>
              </Box>
            </Collapse>
          </List>
        </Box>
      </Drawer>
    );
}
