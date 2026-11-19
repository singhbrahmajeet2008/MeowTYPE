// ====================================================================
// MEOW-TYPING • SUPABASE CLIENT & GOOGLE AUTH MODULE
// ====================================================================

class SupabaseService {
  constructor() {
    this.client = null;
    this.user = null;
    this.profile = null;
    this.cachedRecords = [];
    this.listeners = [];
    this.isInitialized = false;

    this.init();
  }

  // --- Configuration Management ---
  getConfig() {
    // 1. Check localStorage first (user-entered via UI modal)
    const storedUrl = localStorage.getItem('meow_supabase_url');
    const storedKey = localStorage.getItem('meow_supabase_anon_key');
    if (storedUrl && storedKey) {
      return { url: storedUrl.trim(), anonKey: storedKey.trim(), source: 'localStorage' };
    }

    // 2. Fall back to window.MEOW_SUPABASE_CONFIG (file-based)
    if (window.MEOW_SUPABASE_CONFIG && window.MEOW_SUPABASE_CONFIG.url && window.MEOW_SUPABASE_CONFIG.anonKey) {
      const url = window.MEOW_SUPABASE_CONFIG.url.trim();
      const anonKey = window.MEOW_SUPABASE_CONFIG.anonKey.trim();
      if (url && anonKey) {
        return { url, anonKey, source: 'configFile' };
      }
    }

    return { url: '', anonKey: '', source: 'none' };
  }

  isConfigured() {
    const config = this.getConfig();
    return Boolean(config.url && config.anonKey && config.url.startsWith('http'));
  }

  saveConfig(url, anonKey) {
    if (!url || !anonKey) {
      throw new Error('Both Supabase URL and Anon Key are required.');
    }
    const cleanUrl = url.trim().replace(/\/+$/, '');
    const cleanKey = anonKey.trim();

    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      throw new Error('Supabase URL must start with https:// or http://');
    }

    localStorage.setItem('meow_supabase_url', cleanUrl);
    localStorage.setItem('meow_supabase_anon_key', cleanKey);

    return this.init();
  }

  clearConfig() {
    localStorage.removeItem('meow_supabase_url');
    localStorage.removeItem('meow_supabase_anon_key');
    this.client = null;
    this.user = null;
    this.profile = null;
    this.notifyAuthStateChange(null, null);
  }

  // --- Initialize Supabase Client ---
  init() {
    try {
      if (typeof window.supabase === 'undefined' || typeof window.supabase.createClient !== 'function') {
        console.warn('⚠️ Supabase JS SDK not loaded yet. Retrying...');
        return false;
      }

      const config = this.getConfig();
      if (!config.url || !config.anonKey || !config.url.startsWith('http')) {
        console.log('ℹ️ Supabase not yet configured. Local storage / guest mode active.');
        return false;
      }

      this.client = window.supabase.createClient(config.url, config.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: 'pkce'
        }
      });

      this.isInitialized = true;
      console.log('✅ Supabase client initialized from', config.source);

      // Listen for authentication changes (login, logout, token refresh, OAuth redirect)
      this.client.auth.onAuthStateChange(async (event, session) => {
        console.log('⚡ Supabase Auth Event:', event, session?.user?.email || 'No user');

        if (session && session.user) {
          this.user = session.user;
          await this.loadUserProfile();
          this.notifyAuthStateChange(this.user, session);

          // Clean up URL hash / search params after OAuth redirect callback
          if (window.location.hash.includes('access_token=') || window.location.search.includes('code=')) {
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
          }
        } else {
          this.user = null;
          this.profile = null;
          this.notifyAuthStateChange(null, null);
        }
      });

      // Check current session
      this.checkCurrentSession();
      return true;
    } catch (err) {
      console.error('❌ Failed to initialize Supabase client:', err);
      return false;
    }
  }

  async checkCurrentSession() {
    if (!this.client) return;
    try {
      const { data: { session }, error } = await this.client.auth.getSession();
      if (error) {
        console.warn('Session check error:', error.message);
        return;
      }
      if (session?.user) {
        this.user = session.user;
        await this.loadUserProfile();
        this.notifyAuthStateChange(this.user, session);
      }
    } catch (err) {
      console.warn('Could not retrieve existing Supabase session:', err);
    }
  }

  // --- Auth State Subscription ---
  onAuthStateChange(callback) {
    if (typeof callback === 'function') {
      this.listeners.push(callback);
      // Immediately notify if already authenticated
      if (this.user) {
        callback(this.user, this.profile);
      }
    }
  }

  notifyAuthStateChange(user, session) {
    this.listeners.forEach(cb => {
      try {
        cb(user, this.profile, session);
      } catch (e) {
        console.error('Auth state listener error:', e);
      }
    });
  }

  // --- Google OAuth Sign In ---
  async signInWithGoogle() {
    if (!this.isConfigured()) {
      throw new Error('CONFIG_REQUIRED');
    }

    if (!this.client) {
      this.init();
      if (!this.client) {
        throw new Error('Supabase client is not ready. Please verify your URL and Anon Key.');
      }
    }

    // Prepare redirect URL matching current browser location
    const redirectUrl = window.location.origin + window.location.pathname;
    console.log('Initiating Google OAuth redirect to:', redirectUrl);

    const { data, error } = await this.client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account'
        }
      }
    });

    if (error) {
      console.error('Google Sign In Error:', error);
      throw error;
    }

    return data;
  }

  // --- Sign Out ---
  async signOut() {
    if (!this.client) return;
    try {
      const { error } = await this.client.auth.signOut();
      if (error) console.warn('Sign out warning:', error.message);
    } catch (e) {
      console.warn('Sign out exception:', e);
    } finally {
      this.user = null;
      this.profile = null;
      this.cachedRecords = [];
      this.notifyAuthStateChange(null, null);
    }
  }

  // --- User Profile Handling ---
  async loadUserProfile() {
    if (!this.client || !this.user) return null;

    try {
      // Query profiles table
      const { data, error } = await this.client
        .from('profiles')
        .select('*')
        .eq('id', this.user.id)
        .maybeSingle();

      if (error) {
        console.warn('Could not fetch profile from table:', error.message);
      }

      if (data) {
        this.profile = data;
        return data;
      }

      // If profile record does not exist yet (e.g. trigger wasn't run), create one
      const rawMeta = this.user.user_metadata || {};
      const newProfile = {
        id: this.user.id,
        email: this.user.email,
        display_name: rawMeta.full_name || rawMeta.name || (this.user.email ? this.user.email.split('@')[0] : 'Cyber Typist'),
        avatar_url: rawMeta.avatar_url || rawMeta.picture || '',
        highest_wpm: 0,
        total_tests: 0,
        total_practice_seconds: 0,
        total_chars: 0,
        total_correct: 0,
        avg_accuracy: 100,
        updated_at: new Date().toISOString()
      };

      const { data: inserted, error: insertErr } = await this.client
        .from('profiles')
        .upsert(newProfile)
        .select()
        .single();

      if (!insertErr && inserted) {
        this.profile = inserted;
        return inserted;
      }

      this.profile = newProfile;
      return newProfile;
    } catch (err) {
      console.warn('Error in loadUserProfile:', err);
      return null;
    }
  }

  // --- Typing Test Records Persistence ---
  async saveTypingRecord(record) {
    if (!this.client || !this.user) {
      console.log('Offline/guest test - saving to local storage only.');
      return null;
    }

    try {
      const dbRecord = {
        user_id: this.user.id,
        wpm: Number(record.wpm) || 0,
        raw_wpm: Number(record.rawWpm || record.raw_wpm) || 0,
        accuracy: Number(record.accuracy) || 0,
        duration_seconds: Number(record.durationSeconds || record.duration_seconds) || 60,
        mode: record.mode || 'quotes',
        difficulty: record.difficulty || 'normal',
        errors_count: Number(record.errorsCount || record.errors_count) || 0,
        total_chars: Number(record.totalChars || record.total_chars) || 0,
        correct_chars: Number(record.correctChars || record.correct_chars) || 0,
        is_new_record: Boolean(record.isNewRecord || record.is_new_record)
      };

      if (record.test_type) dbRecord.test_type = record.test_type;
      if (record.target_value !== undefined) dbRecord.target_value = Number(record.target_value);
      if (record.words_typed !== undefined) dbRecord.words_typed = Number(record.words_typed);

      // 1. Insert record into typing_records table with graceful backward-compatibility fallback
      let { data: savedRecord, error: recordErr } = await this.client
        .from('typing_records')
        .insert([dbRecord])
        .select()
        .single();

      if (recordErr && recordErr.message && (recordErr.message.includes('column') || recordErr.message.includes('test_type'))) {
        console.warn('Retrying insert without extra schema columns:', recordErr.message);
        const legacyRecord = { ...dbRecord };
        delete legacyRecord.test_type;
        delete legacyRecord.target_value;
        delete legacyRecord.words_typed;
        const retryRes = await this.client
          .from('typing_records')
          .insert([legacyRecord])
          .select()
          .single();
        savedRecord = retryRes.data;
        recordErr = retryRes.error;
      }

      if (recordErr) {
        console.error('❌ Failed to insert typing record:', recordErr);
        throw recordErr;
      }

      console.log('✅ Typing record saved to Supabase:', savedRecord.id);

      // Prepend to cached list
      if (this.cachedRecords) {
        this.cachedRecords.unshift(savedRecord);
      }

      // 2. Update user profile aggregates
      await this.updateProfileAggregates(dbRecord);

      return savedRecord;
    } catch (err) {
      console.error('Error saving record to Supabase:', err);
      throw err;
    }
  }

  async updateProfileAggregates(record) {
    if (!this.client || !this.user) return;

    try {
      const currentHighest = this.profile?.highest_wpm || 0;
      const newHighest = Math.max(currentHighest, record.wpm);
      const newTests = (this.profile?.total_tests || 0) + 1;
      const newSeconds = (this.profile?.total_practice_seconds || 0) + record.duration_seconds;
      const newChars = (this.profile?.total_chars || 0) + record.total_chars;
      const newCorrect = (this.profile?.total_correct || 0) + record.correct_chars;
      const newAvgAcc = newChars > 0 ? Math.round((newCorrect / newChars) * 100) : 100;

      const updates = {
        highest_wpm: newHighest,
        total_tests: newTests,
        total_practice_seconds: newSeconds,
        total_chars: newChars,
        total_correct: newCorrect,
        avg_accuracy: newAvgAcc,
        updated_at: new Date().toISOString()
      };

      const { data: updatedProfile, error } = await this.client
        .from('profiles')
        .update(updates)
        .eq('id', this.user.id)
        .select()
        .single();

      if (!error && updatedProfile) {
        this.profile = updatedProfile;
      } else {
        // Fallback update in-memory
        this.profile = { ...(this.profile || {}), ...updates };
      }
    } catch (e) {
      console.warn('Could not update profile aggregates:', e);
    }
  }

  // --- Fetch Historical Records ---
  async fetchUserRecords(limit = 50) {
    if (!this.client || !this.user) {
      return [];
    }

    try {
      const { data, error } = await this.client
        .from('typing_records')
        .select('*')
        .eq('user_id', this.user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching records:', error);
        return [];
      }

      this.cachedRecords = data || [];
      return this.cachedRecords;
    } catch (err) {
      console.error('Exception fetching records:', err);
      return [];
    }
  }

  // --- Delete a Specific Record ---
  async deleteRecord(recordId) {
    if (!this.client || !this.user || !recordId) return false;

    try {
      const { error } = await this.client
        .from('typing_records')
        .delete()
        .eq('id', recordId)
        .eq('user_id', this.user.id);

      if (error) throw error;

      this.cachedRecords = this.cachedRecords.filter(r => r.id !== recordId);
      return true;
    } catch (e) {
      console.error('Failed to delete record:', e);
      return false;
    }
  }

  // --- Sync Offline/Local Stats into Supabase ---
  async syncLocalStats(localStats) {
    if (!this.client || !this.user || !localStats) return;

    try {
      const profile = this.profile || {};
      const highestWpm = Math.max(profile.highest_wpm || 0, localStats.highestRecord || 0);
      const totalTests = Math.max(profile.total_tests || 0, localStats.testsCount || 0);
      const totalSeconds = Math.max(profile.total_practice_seconds || 0, localStats.totalPracticeSeconds || 0);
      const totalChars = (profile.total_chars || 0) + (localStats.totalChars || 0);
      const totalCorrect = (profile.total_correct || 0) + (localStats.totalCorrect || 0);
      const avgAcc = totalChars > 0 ? Math.round((totalCorrect / totalChars) * 100) : 100;

      await this.client.from('profiles').update({
        highest_wpm: highestWpm,
        total_tests: totalTests,
        total_practice_seconds: totalSeconds,
        total_chars: totalChars,
        total_correct: totalCorrect,
        avg_accuracy: avgAcc,
        updated_at: new Date().toISOString()
      }).eq('id', this.user.id);

      await this.loadUserProfile();
    } catch (e) {
      console.warn('Failed to sync local stats:', e);
    }
  }
}

// Global Supabase singleton instance
window.supabaseService = new SupabaseService();
