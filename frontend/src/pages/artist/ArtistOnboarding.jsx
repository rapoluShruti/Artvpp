import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const styles = {
  container: { maxWidth: 700, margin: '0 auto', padding: 30, fontFamily: 'Arial, sans-serif' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  stepIndicator: { fontSize: 14, color: '#666', marginBottom: 20 },
  formGroup: { marginBottom: 20 },
  label: { display: 'block', fontWeight: 'bold', marginBottom: 8, color: '#333' },
  input: { width: '100%', padding: 10, fontSize: 14, border: '1px solid #ddd', borderRadius: 4, boxSizing: 'border-box' },
  textarea: { width: '100%', padding: 10, fontSize: 14, border: '1px solid #ddd', borderRadius: 4, boxSizing: 'border-box', minHeight: 100 },
  button: { padding: '10px 16px', fontSize: 14, marginRight: 8, marginTop: 12, cursor: 'pointer', borderRadius: 4, border: 'none', backgroundColor: '#007bff', color: 'white' },
  buttonSecondary: { padding: '10px 16px', fontSize: 14, marginRight: 8, marginTop: 12, cursor: 'pointer', borderRadius: 4, border: 'none', backgroundColor: '#6c757d', color: 'white' },
  itemList: { marginTop: 12, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 },
  item: { padding: 8, marginBottom: 8, backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: 4 },
  error: { color: 'red', marginTop: 8 },
  success: { color: 'green', marginTop: 8 }
};

export default function ArtistOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({});
  const [items, setItems] = useState([]);
  const [file, setFile] = useState(null);
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/artist-profile/me');
        if (res.data) setProfile(res.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const saveStep = async (data) => {
    try {
      const payload = { ...profile, ...data };
      const res = await api.post('/artist-profile/me', payload);
      setProfile(res.data);
      setMessage('✓ Saved successfully');
      setTimeout(() => { setStep(step + 1); setMessage(''); }, 1000);
    } catch (err) {
      setMessage('✗ ' + (err.response?.data?.error || err.message));
    }
  };

  const uploadPortfolioFile = async () => {
    if (!file) return setMessage('Choose a file first');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post('/uploads/portfolio', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setItems(prev => [...prev, res.data]);
      setFile(null);
      setMessage('✓ Portfolio item added');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage('✗ ' + (err.response?.data?.error || err.message));
    }
  };

  const addPortfolioUrl = async () => {
    if (!portfolioUrl) return setMessage('Enter a URL');
    try {
      const res = await api.post('/artist-profile/me/portfolio', { media_url: portfolioUrl, media_type: 'image' });
      setItems(prev => [...prev, res.data]);
      setPortfolioUrl('');
      setMessage('✓ Portfolio item added');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage('✗ ' + (err.response?.data?.error || err.message));
    }
  };

  const completePortfolio = async () => {
    if (items.length < 3) return setMessage('✗ Add at least 3 portfolio items');
    try {
      await api.post('/artist-profile/me/portfolio/complete');
      setMessage('✓ Portfolio completed! Redirecting...');
      setTimeout(() => navigate('/artist/manage-products'), 1500);
    } catch (err) {
      setMessage('✗ ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>Artist Onboarding</div>
      <div style={styles.stepIndicator}>Step {step} of 5</div>

      {step === 1 && (
        <div>
          <div style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Step 1: Basic Information</div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Display Name</label>
            <input 
              style={styles.input}
              placeholder="e.g., Alex the Artist"
              value={profile.display_name || ''} 
              onChange={(e) => setProfile({...profile, display_name: e.target.value})} 
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Country</label>
            <input 
              style={styles.input}
              placeholder="e.g., India"
              value={profile.country || ''} 
              onChange={(e) => setProfile({...profile, country: e.target.value})} 
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Languages</label>
            <input 
              style={styles.input}
              placeholder="e.g., English, Hindi"
              value={profile.languages || ''} 
              onChange={(e) => setProfile({...profile, languages: e.target.value})} 
            />
          </div>

          {message && <div style={styles.error}>{message}</div>}
          
          <button style={styles.button} onClick={() => saveStep({})}>Save & Continue</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <div style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Step 2: Bio & Experience</div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Bio (About You)</label>
            <textarea 
              style={styles.textarea}
              placeholder="Tell us about your art, style, and experience..."
              value={profile.bio || ''} 
              onChange={(e) => setProfile({...profile, bio: e.target.value})} 
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Years of Experience</label>
            <input 
              style={styles.input}
              type="number" 
              placeholder="e.g., 5"
              value={profile.years_experience || ''} 
              onChange={(e) => setProfile({...profile, years_experience: Number(e.target.value)})} 
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Art Styles (comma separated)</label>
            <input 
              style={styles.input}
              placeholder="e.g., Digital, Traditional, Watercolor"
              value={profile.styles || ''} 
              onChange={(e) => setProfile({...profile, styles: e.target.value})} 
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Mediums (comma separated)</label>
            <input 
              style={styles.input}
              placeholder="e.g., Oil, Acrylic, Pencil"
              value={profile.mediums || ''} 
              onChange={(e) => setProfile({...profile, mediums: e.target.value})} 
            />
          </div>

          {message && <div style={styles.error}>{message}</div>}
          
          <button style={styles.button} onClick={() => saveStep({})}>Save & Continue</button>
        </div>
      )}

      {step === 3 && (
        <div>
          <div style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Step 3: Portfolio (Minimum 3 items)</div>
          
          <div style={{ padding: 12, backgroundColor: '#e7f3ff', borderRadius: 4, marginBottom: 20 }}>
            <strong>Portfolio items: {items.length} / 3</strong>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Upload Image or Video</label>
            <input 
              type="file" 
              accept="image/*,video/*"
              onChange={(e) => setFile(e.target.files[0])} 
            />
            <button style={styles.button} onClick={uploadPortfolioFile}>Upload & Add</button>
          </div>

          <div style={{ textAlign: 'center', margin: '16px 0', color: '#666' }}>— OR —</div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Add from URL</label>
            <input 
              style={styles.input}
              placeholder="Paste image URL (e.g., https://...)"
              value={portfolioUrl} 
              onChange={(e) => setPortfolioUrl(e.target.value)} 
            />
            <button style={styles.button} onClick={addPortfolioUrl}>Add from URL</button>
          </div>

          {items.length > 0 && (
            <div style={styles.itemList}>
              <strong>Added Items:</strong>
              {items.map((it, idx) => (
                <div key={idx} style={styles.item}>
                  <a href={it.media_url || it.url} target="_blank" rel="noreferrer" style={{ color: '#007bff', textDecoration: 'none' }}>
                    Item {idx + 1} → View
                  </a>
                </div>
              ))}
            </div>
          )}

          {message && <div style={styles.error}>{message}</div>}
          
          {items.length >= 3 && (
            <button style={styles.button} onClick={completePortfolio}>Portfolio Complete & Continue</button>
          )}
        </div>
      )}

      {step === 4 && (
        <div>
          <div style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Step 4: Service Preferences</div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Typical Delivery Days</label>
            <input 
              style={styles.input}
              type="number" 
              placeholder="e.g., 7"
              value={profile.typical_delivery_days || ''} 
              onChange={(e) => setProfile({...profile, typical_delivery_days: Number(e.target.value)})} 
            />
          </div>

          <div style={styles.formGroup}>
            <label style={{ ...styles.label, marginBottom: 12 }}>
              <input 
                type="checkbox" 
                checked={profile.accepts_custom_requests !== false}
                onChange={(e) => setProfile({...profile, accepts_custom_requests: e.target.checked})}
              />
              {' '}Accept Custom Requests
            </label>
          </div>

          <div style={styles.formGroup}>
            <label style={{ ...styles.label, marginBottom: 12 }}>
              <input 
                type="checkbox" 
                checked={profile.accepts_rush || false}
                onChange={(e) => setProfile({...profile, accepts_rush: e.target.checked})}
              />
              {' '}Accept Rush Orders (Higher Price)
            </label>
          </div>

          {message && <div style={styles.error}>{message}</div>}
          
          <button style={styles.button} onClick={() => saveStep({})}>Save & Continue</button>
        </div>
      )}

      {step === 5 && (
        <div>
          <div style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Step 5: Review & Complete</div>
          
          <div style={styles.itemList}>
            <div style={{ marginBottom: 12 }}>
              <strong>Display Name:</strong> {profile.display_name || '—'}
            </div>
            <div style={{ marginBottom: 12 }}>
              <strong>Country:</strong> {profile.country || '—'}
            </div>
            <div style={{ marginBottom: 12 }}>
              <strong>Portfolio Items:</strong> {items.length}
            </div>
            <div style={{ marginBottom: 12 }}>
              <strong>Experience:</strong> {profile.years_experience || '—'} years
            </div>
          </div>

          <p style={{ marginTop: 20, color: '#666' }}>Your profile is now complete and ready for review by admin.</p>

          {message && <div style={styles.error}>{message}</div>}
          
          <button style={styles.button} onClick={() => { 
            saveStep({ status: 'active' }); 
            setTimeout(() => navigate('/artist/manage-products'), 1500);
          }}>Complete Onboarding</button>
        </div>
      )}

      <div style={{ marginTop: 30, borderTop: '1px solid #ddd', paddingTop: 20 }}>
        {step > 1 && (
          <button style={styles.buttonSecondary} onClick={() => setStep(step - 1)}>← Back</button>
        )}
      </div>
    </div>
  );
}
