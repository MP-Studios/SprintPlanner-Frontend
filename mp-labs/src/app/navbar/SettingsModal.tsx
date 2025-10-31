'use client';
import { useState } from 'react';

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [displayOpen, setDisplayOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [colorPalette, setColorPalette] = useState('default');
  const [fontSize, setFontSize] = useState('medium');
  const [compactView, setCompactView] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);

  const handleClose = () => {
    setProfileOpen(false);
    setDisplayOpen(false);
    setPrivacyOpen(false);
    onClose();
  };


  if (!isOpen) return null;

  const handleDeleteAccount = () => {
    console.log('Account deleted');
    setShowDeleteConfirm(false);
    handleClose(); 
  };

  const buttonBase =
    'globalButton w-full text-left px-6 py-6 rounded-lg text-base border border-[#3a554c] hover:bg-[#e9f8eb] focus:outline-none transition-colors transform-none active:transform-none font-medium';

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="newAssignmentModal relative rounded-2xl w-[550px] max-h-[85vh] overflow-y-auto pointer-events-auto bg-white p-8 shadow-2xl flex flex-col items-center">
          {/* Close button*/}
          <button
            onClick={handleClose} 
            className="absolute top-5 right-5 text-gray-500 hover:text-gray-700 text-xl focus:outline-none transform-none active:transform-none" 
          >
            ✕
          </button>

          <h2 className="mb-8 text-2xl font-bold text-[#3a554c] text-center">Settings</h2>

          <div className="w-[92%] mx-auto space-y-6">
            {/* Profile Section */}
            <div className="border border-[#3a554c] rounded-xl bg-white overflow-hidden">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-full flex justify-between items-center px-8 py-5 hover:bg-[#e9f8eb] transition-colors focus:outline-none transform-none active:transform-none"
              >
                <h3
                  className="text-base font-semibold text-[#3a554c]"
                  style={{ transform: 'translateX(8px)' }}
                >
                  Profile
                </h3>

                <span
                  className="text-xl text-[#3a554c] select-none"
                  style={{ transform: 'translateX(-8px)' }}
                  aria-hidden="true"
                >
                  {profileOpen ? '−' : '+'}
                </span>
              </button>

              {profileOpen && (
                <div className="px-8 pb-10 pt-8 space-y-6 border-t border-[#3a554c]">
                  <div>
                    <label className="block text-[#3a554c] mb-3 text-base font-medium">Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="w-full border border-gray-300 rounded px-4 py-3 text-base focus:outline-none focus:ring-1 focus:ring-[#a2c9b8]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#3a554c] mb-3 text-base font-medium">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full border border-gray-300 rounded px-4 py-3 text-base focus:outline-none focus:ring-1 focus:ring-[#a2c9b8]"
                    />
                  </div>
                  <button className={buttonBase} style={{transform: "none"}}>Change Password</button>
                  <button className={buttonBase} style={{transform: "none"}}>Update Profile Picture</button>
                </div>
              )}
            </div>

            {/* Display Section */}
            <div className="border border-[#3a554c] rounded-xl bg-white overflow-hidden">
              <button
                onClick={() => setDisplayOpen(!displayOpen)}
                className="w-full flex justify-between items-center px-8 py-5 hover:bg-[#e9f8eb] transition-colors focus:outline-none transform-none active:transform-none"
              >
                <h3
                  className="text-base font-semibold text-[#3a554c]"
                  style={{ transform: 'translateX(8px)' }}
                >
                  Display
                </h3>

                <span
                  className="text-xl text-[#3a554c] select-none"
                  style={{ transform: 'translateX(-8px)' }}
                  aria-hidden="true"
                >
                  {displayOpen ? '−' : '+'}
                </span>
              </button>
              {displayOpen && (
                <div className="px-8 pb-10 pt-8 space-y-6 border-t border-[#3a554c]">
                  <div className="flex items-center justify-between py-3">
                    <label className="text-[#3a554c] text-base font-medium">Color Palette</label>
                    <select
                      value={colorPalette}
                      onChange={(e) => setColorPalette(e.target.value)}
                      className="border border-gray-300 rounded px-4 py-2 text-base focus:outline-none focus:ring-1 focus:ring-[#a2c9b8]"
                    >
                      <option value="default">Default (Green)</option>
                      <option value="pink">Pink</option>
                      <option value="blue">Blue</option>
                      <option value="purple">Purple</option>
                      <option value="sunset">Sunset</option>
                      <option value="blackwhite">Black & White</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <label className="text-[#3a554c] text-base font-medium">Font Size</label>
                    <select
                      value={fontSize}
                      onChange={(e) => setFontSize(e.target.value)}
                      className="border border-gray-300 rounded px-4 py-2 text-base focus:outline-none focus:ring-1 focus:ring-[#a2c9b8]"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <label className="text-[#3a554c] text-base font-medium">Compact View</label>
                    <input 
                      type="checkbox" 
                      checked={compactView}
                      onChange={(e) => setCompactView(e.target.checked)}
                      className="w-5 h-5 accent-[#a2c9b8] cursor-pointer" 
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Privacy Section */}
            <div className="border border-[#3a554c] rounded-xl bg-white overflow-hidden">
              <button
                onClick={() => setPrivacyOpen(!privacyOpen)}
                className="w-full flex justify-between items-center px-8 py-5 hover:bg-[#e9f8eb] transition-colors focus:outline-none transform-none active:transform-none"
              >
                <h3
                  className="text-base font-semibold text-[#3a554c]"
                  style={{ transform: 'translateX(8px)' }}
                >
                  Privacy
                </h3>

                <span
                  className="text-xl text-[#3a554c] select-none"
                  style={{ transform: 'translateX(-8px)' }}
                  aria-hidden="true"
                >
                  {privacyOpen ? '−' : '+'}
                </span>
              </button>
              {privacyOpen && (
                <div className="px-8 pb-10 pt-8 space-y-6 border-t border-[#3a554c]">
                  <div className="flex items-center justify-between py-3">
                    <label className="text-[#3a554c] text-base font-medium">Push Notifications</label>
                    <input
                      type="checkbox"
                      checked={notifications}
                      onChange={(e) => setNotifications(e.target.checked)}
                      className="w-5 h-5 accent-[#a2c9b8] cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <label className="text-[#3a554c] text-base font-medium">Data Sharing</label>
                    <input
                      type="checkbox"
                      checked={dataSharing}
                      onChange={(e) => setDataSharing(e.target.checked)}
                      className="w-5 h-5 accent-[#a2c9b8] cursor-pointer"
                    />
                  </div>
                  <button className={buttonBase} style={{transform: "none"}}>Privacy Policy</button>
                </div>
              )}
            </div>

            {/* Delete Account Section*/}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full px-6 py-4 bg-red-500 text-white font-medium rounded-lg hover:bg-red-500 transition-colors mt-2 text-base"
            >
              Delete My Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex justify-center items-center z-[60] bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-12 mx-4">
            <h3 className="text-xl font-bold text-[#3a554c] text-center mb-8">
              Are you sure?
            </h3>

            <p className="text-[#3a554c] mb-10 text-base text-center leading-relaxed">
              This action cannot be undone. This will permanently delete your account and remove all of your data from our servers.
            </p>

            <div className="flex gap-6 justify-center">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-10 py-4 rounded-lg border-2 border-[#3a554c] text-[#3a554c] font-semibold hover:bg-[#e9f8eb] transition-colors focus:outline-none text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-10 py-4 rounded-lg bg-[#3a554c] text-white font-semibold hover:bg-[#2f463e] transition-colors focus:outline-none text-base"
              >
                Yes, Delete My Account
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
