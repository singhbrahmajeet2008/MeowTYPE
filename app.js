// ==========================================================================
// meow-typing - Sleek Dark Cyber Gaming Typing Experience
// Clean Centered Lobby • Split 1/3 Judge Terminal Only While Typing • Bulletproof Input
// ==========================================================================

// Global XSS Sanitizer for safe DOM interpolation
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

class MeowTypingApp {
  constructor() {
    // Mode Configuration
    this.testType = 'time'; // 'time' or 'words'
    this.duration = 60; // 15, 30, 60, 120 or custom seconds
    this.targetWordCount = 25; // 10, 25, 50, 100 or custom words
    this.difficulty = 'medium'; // 'easy', 'medium', 'hard'
    this.genre = 'quotes'; // 'quotes', 'words', 'code', 'numbers', 'custom'
    this.customText = '';

    // Views: 'lobby', 'arena', 'results', 'analytics'
    this.currentView = 'lobby';

    // Runtime Engine State
    this.testActive = false;
    this.testFinished = false;
    this.timer = null;
    this.timeLeft = 60;
    this.startTime = null;
    this.timeElapsed = 0;

    // Word & Keystroke Tracking
    this.fullText = '';
    this.words = [];
    this.typedWords = [];
    this.currentWordIdx = 0;
    this.keystrokes = { correct: 0, errors: 0, total: 0 };
    this.streak = 0;
    this.maxStreak = 0;
    this.samples = [];
    this.missedWords = new Set();
    this.lastSampleSecond = -1;
    this.particles = [];
    this.consecutiveErrors = 0;
    this.judgeMemeState = 'normal';

    // Word-by-Word Telemetry & Performance Tracking
    this.currentWordStartTime = null;
    this.currentWordHadError = false;
    this.wordPerformanceStats = {}; // { [cleanWord]: { word, timesTyped, errorsCount, bestWpm, fastestMs, totalMs, lastTested } }
    this.analyticsWordFilter = 'all'; // 'all', 'mastered', 'proficient', 'weak'
    this.analyticsWordSort = 'bestWpm'; // 'bestWpm', 'fastestMs', 'accuracy', 'timesTyped', 'word'
    this.analyticsWordSearch = '';
    this.historyTypeFilter = 'all'; // 'all', 'time', 'words'

    // Cache Elements
    this.cacheDom();

    // Load Persistent Stats
    this.loadPersistentStats();

    // Setup FX Canvas
    this.initFxCanvas();

    // Bind Event Handlers
    this.bindEvents();

    // Supabase Backend & Google Auth
    this.initSupabaseAuth();

    // Start in Lobby View
    this.switchView('lobby');
  }

  // --- Cache Elements ---
  cacheDom() {
    this.dom = {
      // Views
      lobbyView: document.getElementById('lobbyView'),
      arenaView: document.getElementById('arenaView'),
      resultsView: document.getElementById('resultsView'),
      analyticsView: document.getElementById('analyticsView'),

      // Top Header & Nav Pills
      brandHomeBtn: document.getElementById('brandHomeBtn'),
      navPracticeBtn: document.getElementById('navPracticeBtn'),
      navAnalysisBtn: document.getElementById('navAnalysisBtn'),
      globalBestWpm: document.getElementById('globalBestWpm'),
      toggleMusicBtn: document.getElementById('toggleMusicBtn'),
      musicIcon: document.getElementById('musicIcon'),
      toggleAudioBtn: document.getElementById('toggleAudioBtn'),
      audioIcon: document.getElementById('audioIcon'),

      // Window Chrome
      windowTitleText: document.getElementById('windowTitleText'),
      arenaModeBadge: document.getElementById('arenaModeBadge'),

      // Supabase & Google Auth Header Elements
      authContainer: document.getElementById('authContainer'),
      googleLoginBtn: document.getElementById('googleLoginBtn'),
      userProfileChip: document.getElementById('userProfileChip'),
      userAvatarImg: document.getElementById('userAvatarImg'),
      userSyncDot: document.getElementById('userSyncDot'),
      userDisplayName: document.getElementById('userDisplayName'),
      userDropdownMenu: document.getElementById('userDropdownMenu'),
      dropdownUserName: document.getElementById('dropdownUserName'),
      dropdownUserEmail: document.getElementById('dropdownUserEmail'),
      openRecordsBtn: document.getElementById('openRecordsBtn'),
      menuAnalysisBtn: document.getElementById('menuAnalysisBtn'),
      openCloudSettingsBtn: document.getElementById('openCloudSettingsBtn'),
      logoutBtn: document.getElementById('logoutBtn'),

      // Lobby: Player Cumulative Stats Strip & Cloud Bar
      statTestsCount: document.getElementById('statTestsCount'),
      statHighestRecord: document.getElementById('statHighestRecord'),
      statTimeSpent: document.getElementById('statTimeSpent'),
      statAvgAccuracy: document.getElementById('statAvgAccuracy'),
      lobbyViewRecordsBtn: document.getElementById('lobbyViewRecordsBtn'),
      recordsBadgeCount: document.getElementById('recordsBadgeCount'),
      lobbyCloudStatusBtn: document.getElementById('lobbyCloudStatusBtn'),
      cloudLedDot: document.getElementById('cloudLedDot'),
      cloudStatusText: document.getElementById('cloudStatusText'),

      // Records Modal
      recordsModal: document.getElementById('recordsModal'),
      closeRecordsModalX: document.getElementById('closeRecordsModalX'),
      closeRecordsModalBtn: document.getElementById('closeRecordsModalBtn'),
      closeRecordsModalBottomBtn: document.getElementById('closeRecordsModalBottomBtn'),
      recordsModalAvatar: document.getElementById('recordsModalAvatar'),
      recordsModalUser: document.getElementById('recordsModalUser'),
      recordsModalEmail: document.getElementById('recordsModalEmail'),
      refreshRecordsBtn: document.getElementById('refreshRecordsBtn'),
      rssTotalTests: document.getElementById('rssTotalTests'),
      rssBestWpm: document.getElementById('rssBestWpm'),
      rssAvgAccuracy: document.getElementById('rssAvgAccuracy'),
      rssPracticeTime: document.getElementById('rssPracticeTime'),
      recordsListStatus: document.getElementById('recordsListStatus'),
      recordsFeed: document.getElementById('recordsFeed'),
      emptyRecordsNotice: document.getElementById('emptyRecordsNotice'),

      // Supabase Config Modal
      supabaseConfigModal: document.getElementById('supabaseConfigModal'),
      closeConfigModalX: document.getElementById('closeConfigModalX'),
      closeConfigModalBtn: document.getElementById('closeConfigModalBtn'),
      configStatusBanner: document.getElementById('configStatusBanner'),
      csbDot: document.getElementById('csbDot'),
      csbText: document.getElementById('csbText'),
      cfgSupabaseUrl: document.getElementById('cfgSupabaseUrl'),
      cfgSupabaseAnonKey: document.getElementById('cfgSupabaseAnonKey'),
      copySqlSchemaBtn: document.getElementById('copySqlSchemaBtn'),
      clearSupabaseConfigBtn: document.getElementById('clearSupabaseConfigBtn'),
      saveSupabaseConfigBtn: document.getElementById('saveSupabaseConfigBtn'),

      // Cyber Toast Notification
      cyberToast: document.getElementById('cyberToast'),
      toastIcon: document.getElementById('toastIcon'),
      toastMessage: document.getElementById('toastMessage'),

      // Lobby: Setup Card Controls
      testTypePicker: document.getElementById('testTypePicker'),
      durationPickerRow: document.getElementById('durationPickerRow'),
      durationPicker: document.getElementById('durationPicker'),
      customDurationBtn: document.getElementById('customDurationBtn'),
      customDurationInputArea: document.getElementById('customDurationInputArea'),
      customDurationInput: document.getElementById('customDurationInput'),
      applyCustomDurationBtn: document.getElementById('applyCustomDurationBtn'),
      currentDurationHint: document.getElementById('currentDurationHint'),

      wordCountPickerRow: document.getElementById('wordCountPickerRow'),
      wordCountPicker: document.getElementById('wordCountPicker'),
      customWordsBtn: document.getElementById('customWordsBtn'),
      customWordsInputArea: document.getElementById('customWordsInputArea'),
      customWordsInput: document.getElementById('customWordsInput'),
      applyCustomWordsBtn: document.getElementById('applyCustomWordsBtn'),
      currentWordCountHint: document.getElementById('currentWordCountHint'),

      genrePicker: document.getElementById('genrePicker'),
      customTextInputArea: document.getElementById('customTextInputArea'),
      customTextInput: document.getElementById('customTextInput'),
      difficultyPicker: document.getElementById('difficultyPicker'),
      startTestBtn: document.getElementById('startTestBtn'),

      // Left 1/3 Judge Terminal (Arena View)
      judgeStatusLabel: document.getElementById('judgeStatusLabel'),
      judgeVerdictText: document.getElementById('judgeVerdictText'),
      judgeVerdictSub: document.getElementById('judgeVerdictSub'),
      judgeMemeFeed: document.getElementById('judgeMemeFeed'),
      judgeMemeImg: document.getElementById('judgeMemeImg'),
      judgeMemeCaption: document.getElementById('judgeMemeCaption'),
      memeChamberStatus: document.getElementById('memeChamberStatus'),

      // Right 2/3 Typing Arena (Arena View)
      hudTimerLabel: document.getElementById('hudTimerLabel'),
      hudTimer: document.getElementById('hudTimer'),
      hudTimerSub: document.getElementById('hudTimerSub'),
      hudTimerBar: document.getElementById('hudTimerBar'),
      hudWpm: document.getElementById('hudWpm'),
      hudAccuracy: document.getElementById('hudAccuracy'),
      hudKeystrokes: document.getElementById('hudKeystrokes'),
      hudStreak: document.getElementById('hudStreak'),
      hudStreakBonus: document.getElementById('hudStreakBonus'),

      // Text Arena Box
      typingArenaBox: document.getElementById('typingArenaBox'),
      textDisplayCard: document.getElementById('textDisplayCard'),
      wordsContainer: document.getElementById('wordsContainer'),
      hiddenInput: document.getElementById('hiddenInput'),
      focusStatusText: document.getElementById('focusStatusText'),
      correctCharsCount: document.getElementById('correctCharsCount'),
      errorCharsCount: document.getElementById('errorCharsCount'),
      restartTestBtn: document.getElementById('restartTestBtn'),
      homeBtn: document.getElementById('homeBtn'),

      // Results View
      resultsCatImg: document.getElementById('resultsCatImg'),
      resultsMemeBadge: document.getElementById('resultsMemeBadge'),
      resultsBadge: document.getElementById('resultsBadge'),
      resultsTitle: document.getElementById('resultsTitle'),
      resultsSubtitle: document.getElementById('resultsSubtitle'),
      finalWpmValue: document.getElementById('finalWpmValue'),
      finalRankBadge: document.getElementById('finalRankBadge'),
      avgWpmValue: document.getElementById('avgWpmValue'),
      rawWpmValue: document.getElementById('rawWpmValue'),
      finalAccValue: document.getElementById('finalAccValue'),
      accDetail: document.getElementById('accDetail'),
      personalBestValue: document.getElementById('personalBestValue'),
      pbStatus: document.getElementById('pbStatus'),
      wpmChartCanvas: document.getElementById('wpmChartCanvas'),
      resultsAnalysisBtn: document.getElementById('resultsAnalysisBtn'),
      playAgainBtn: document.getElementById('playAgainBtn'),
      practiceMistakesBtn: document.getElementById('practiceMistakesBtn'),
      resultsHomeBtn: document.getElementById('resultsHomeBtn'),

      // Analytics Dashboard View
      analyticsExportBtn: document.getElementById('analyticsExportBtn'),
      analyticsBackBtn: document.getElementById('analyticsBackBtn'),
      akTotalTests: document.getElementById('akTotalTests'),
      akTestsSplit: document.getElementById('akTestsSplit'),
      akBestWpm: document.getElementById('akBestWpm'),
      akBestDetail: document.getElementById('akBestDetail'),
      akAvgWpm: document.getElementById('akAvgWpm'),
      akAvgRaw: document.getElementById('akAvgRaw'),
      akTotalWords: document.getElementById('akTotalWords'),
      akTotalChars: document.getElementById('akTotalChars'),
      akTotalTime: document.getElementById('akTotalTime'),
      akGlobalAccuracy: document.getElementById('akGlobalAccuracy'),
      akAccuracyErrors: document.getElementById('akAccuracyErrors'),

      timeBenchmarkTbody: document.getElementById('timeBenchmarkTbody'),
      wordsBenchmarkTbody: document.getElementById('wordsBenchmarkTbody'),

      practiceWeakWordsFromAnalyticsBtn: document.getElementById('practiceWeakWordsFromAnalyticsBtn'),
      wordSearchInput: document.getElementById('wordSearchInput'),
      wordFilterTabs: document.getElementById('wordFilterTabs'),
      wmCountAll: document.getElementById('wmCountAll'),
      wmCountMastered: document.getElementById('wmCountMastered'),
      wmCountProficient: document.getElementById('wmCountProficient'),
      wmCountWeak: document.getElementById('wmCountWeak'),
      wordSortSelect: document.getElementById('wordSortSelect'),
      wordMasteryTbody: document.getElementById('wordMasteryTbody'),
      emptyWordsNotice: document.getElementById('emptyWordsNotice'),

      historyLogCount: document.getElementById('historyLogCount'),
      historyTypeFilterGroup: document.getElementById('historyTypeFilterGroup'),
      historyLogTbody: document.getElementById('historyLogTbody'),

      // FX Canvas
      fxCanvas: document.getElementById('fxCanvas')
    };
  }

  // --- View Switcher ---
  switchView(viewName) {
    this.currentView = viewName;

    // Toggle panels
    if (this.dom.lobbyView) {
      if (viewName === 'lobby') {
        this.dom.lobbyView.classList.remove('hidden');
        this.dom.lobbyView.classList.add('active-view');
      } else {
        this.dom.lobbyView.classList.add('hidden');
        this.dom.lobbyView.classList.remove('active-view');
      }
    }

    if (this.dom.arenaView) {
      if (viewName === 'arena') {
        this.dom.arenaView.classList.remove('hidden');
        this.dom.arenaView.classList.add('active-view');
      } else {
        this.dom.arenaView.classList.add('hidden');
        this.dom.arenaView.classList.remove('active-view');
      }
    }

    if (this.dom.resultsView) {
      if (viewName === 'results') {
        this.dom.resultsView.classList.remove('hidden');
        this.dom.resultsView.classList.add('active-view');
      } else {
        this.dom.resultsView.classList.add('hidden');
        this.dom.resultsView.classList.remove('active-view');
      }
    }

    if (this.dom.analyticsView) {
      if (viewName === 'analytics') {
        this.dom.analyticsView.classList.remove('hidden');
        this.dom.analyticsView.classList.add('active-view');
      } else {
        this.dom.analyticsView.classList.add('hidden');
        this.dom.analyticsView.classList.remove('active-view');
      }
    }

    // Toggle header nav tabs active state
    if (this.dom.navPracticeBtn && this.dom.navAnalysisBtn) {
      if (viewName === 'analytics') {
        this.dom.navAnalysisBtn.classList.add('active');
        this.dom.navPracticeBtn.classList.remove('active');
      } else {
        this.dom.navPracticeBtn.classList.add('active');
        this.dom.navAnalysisBtn.classList.remove('active');
      }
    }

    // Update Window Titlebar & Trigger View Hooks
    if (viewName === 'lobby') {
      if (this.dom.windowTitleText) this.dom.windowTitleText.textContent = 'meow-typing — Setup';
      this.stopTest();
    } else if (viewName === 'arena') {
      if (this.dom.windowTitleText) this.dom.windowTitleText.textContent = 'meow-typing — Typing Arena';
      this.updateArenaModeBadge();
    } else if (viewName === 'results') {
      if (this.dom.windowTitleText) this.dom.windowTitleText.textContent = 'meow-typing — Performance Results';
      this.stopTest();
    } else if (viewName === 'analytics') {
      if (this.dom.windowTitleText) this.dom.windowTitleText.textContent = 'meow-typing — Analytics & Word Mastery';
      this.stopTest();
      this.renderAnalyticsDashboard();
    }
  }

  updateArenaModeBadge() {
    if (!this.dom.arenaModeBadge) return;
    const diffLabel = this.difficulty === 'easy' ? 'Easy' : this.difficulty === 'hard' ? 'Expert' : 'Normal';
    const genreLabel = this.genre.charAt(0).toUpperCase() + this.genre.slice(1);
    const targetLabel = this.testType === 'words' ? `${this.targetWordCount} Words` : `${this.duration}s`;
    this.dom.arenaModeBadge.textContent = `${targetLabel} • ${diffLabel} • ${genreLabel}`;
  }

  // --- Bind Event Listeners ---
  bindEvents() {
    // 1. Bulletproof Global Keyboard Interception
    window.addEventListener('keydown', (e) => this.handleGlobalKeyDown(e));

    // 2. Header Brand click -> Return to Lobby
    if (this.dom.brandHomeBtn) {
      this.dom.brandHomeBtn.addEventListener('click', () => this.switchView('lobby'));
      this.dom.brandHomeBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.switchView('lobby');
        }
      });
    }

    // 2b. Navigation Tabs (Practice vs Analysis)
    if (this.dom.navPracticeBtn) {
      this.dom.navPracticeBtn.addEventListener('click', () => this.switchView('lobby'));
    }
    if (this.dom.navAnalysisBtn) {
      this.dom.navAnalysisBtn.addEventListener('click', () => this.switchView('analytics'));
    }
    if (this.dom.analyticsBackBtn) {
      this.dom.analyticsBackBtn.addEventListener('click', () => this.switchView('lobby'));
    }
    if (this.dom.resultsAnalysisBtn) {
      this.dom.resultsAnalysisBtn.addEventListener('click', () => this.switchView('analytics'));
    }
    if (this.dom.menuAnalysisBtn) {
      this.dom.menuAnalysisBtn.addEventListener('click', () => {
        if (this.dom.userDropdownMenu) this.dom.userDropdownMenu.classList.add('hidden');
        this.switchView('analytics');
      });
    }
    if (this.dom.analyticsExportBtn) {
      this.dom.analyticsExportBtn.addEventListener('click', () => this.exportAnalyticsData());
    }

    // 3. Music & Audio Toggles
    if (this.dom.toggleMusicBtn) {
      this.dom.toggleMusicBtn.addEventListener('click', () => {
        if (window.soundEngine) {
          const enabled = window.soundEngine.toggleMusic();
          if (this.dom.musicIcon) {
            this.dom.musicIcon.textContent = enabled ? '🎵' : '🔇';
          }
          if (this.dom.toggleMusicBtn) {
            this.dom.toggleMusicBtn.title = enabled ? 'Mute Typing Music' : 'Unmute Typing Music';
          }
        }
      });
    }

    if (this.dom.toggleAudioBtn) {
      this.dom.toggleAudioBtn.addEventListener('click', () => {
        if (window.soundEngine) {
          window.soundEngine.enabled = !window.soundEngine.enabled;
          if (this.dom.audioIcon) {
            this.dom.audioIcon.textContent = window.soundEngine.enabled ? '🎧' : '🔇';
          }
        }
      });
    }

    // 4. Lobby: Test Type Picker (Time vs Words)
    if (this.dom.testTypePicker) {
      this.dom.testTypePicker.addEventListener('click', (e) => {
        const btn = e.target.closest('.pill-btn');
        if (!btn) return;
        this.dom.testTypePicker.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.testType = btn.dataset.testType || btn.dataset.type || 'time';

        if (this.testType === 'words') {
          if (this.dom.durationPickerRow) this.dom.durationPickerRow.classList.add('hidden');
          if (this.dom.wordCountPickerRow) this.dom.wordCountPickerRow.classList.remove('hidden');
        } else {
          if (this.dom.durationPickerRow) this.dom.durationPickerRow.classList.remove('hidden');
          if (this.dom.wordCountPickerRow) this.dom.wordCountPickerRow.classList.add('hidden');
        }
        this.updateArenaModeBadge();
      });
    }

    // 5. Lobby: Duration Picker & Custom Duration
    if (this.dom.durationPicker) {
      this.dom.durationPicker.addEventListener('click', (e) => {
        const btn = e.target.closest('.pill-btn');
        if (!btn || btn.id === 'customDurationBtn') return;
        this.dom.durationPicker.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (this.dom.customDurationBtn) {
          this.dom.customDurationBtn.classList.remove('active');
          this.dom.customDurationBtn.textContent = 'Custom...';
        }
        if (this.dom.customDurationInputArea) this.dom.customDurationInputArea.classList.add('hidden');

        this.duration = parseInt(btn.dataset.duration, 10) || 60;
        if (this.dom.currentDurationHint) {
          this.dom.currentDurationHint.textContent = `Target: ${this.duration} seconds`;
        }
        this.updateArenaModeBadge();
      });
    }

    if (this.dom.customDurationBtn) {
      this.dom.customDurationBtn.addEventListener('click', () => {
        if (!this.dom.customDurationInputArea) return;
        const isHidden = this.dom.customDurationInputArea.classList.contains('hidden');
        if (isHidden) {
          this.dom.customDurationInputArea.classList.remove('hidden');
          if (this.dom.customDurationInput) {
            this.dom.customDurationInput.value = this.duration || 45;
            this.dom.customDurationInput.focus();
            this.dom.customDurationInput.select();
          }
        } else {
          this.dom.customDurationInputArea.classList.add('hidden');
        }
      });
    }

    const applyCustomDuration = () => {
      const val = parseInt(this.dom.customDurationInput?.value, 10);
      if (isNaN(val) || val < 5 || val > 3600) {
        this.showToast('Please enter duration between 5s and 3600s', '⚠️');
        return;
      }
      this.duration = val;
      if (this.dom.durationPicker) {
        this.dom.durationPicker.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
      }
      if (this.dom.customDurationBtn) {
        this.dom.customDurationBtn.classList.add('active');
        this.dom.customDurationBtn.textContent = `${val}s`;
      }
      if (this.dom.customDurationInputArea) {
        this.dom.customDurationInputArea.classList.add('hidden');
      }
      if (this.dom.currentDurationHint) {
        this.dom.currentDurationHint.textContent = `Custom: ${val} seconds`;
      }
      this.updateArenaModeBadge();
      this.showToast(`Test duration set to ${val}s`, '⏱️');
    };

    if (this.dom.applyCustomDurationBtn) {
      this.dom.applyCustomDurationBtn.addEventListener('click', applyCustomDuration);
    }
    if (this.dom.customDurationInput) {
      this.dom.customDurationInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          applyCustomDuration();
        }
      });
    }

    // 6. Lobby: Word Count Picker & Custom Words
    if (this.dom.wordCountPicker) {
      this.dom.wordCountPicker.addEventListener('click', (e) => {
        const btn = e.target.closest('.pill-btn');
        if (!btn || btn.id === 'customWordsBtn') return;
        this.dom.wordCountPicker.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (this.dom.customWordsBtn) {
          this.dom.customWordsBtn.classList.remove('active');
          this.dom.customWordsBtn.textContent = 'Custom...';
        }
        if (this.dom.customWordsInputArea) this.dom.customWordsInputArea.classList.add('hidden');

        this.targetWordCount = parseInt(btn.dataset.words, 10) || 25;
        if (this.dom.currentWordCountHint) {
          this.dom.currentWordCountHint.textContent = `Target: ${this.targetWordCount} words`;
        }
        this.updateArenaModeBadge();
      });
    }

    if (this.dom.customWordsBtn) {
      this.dom.customWordsBtn.addEventListener('click', () => {
        if (!this.dom.customWordsInputArea) return;
        const isHidden = this.dom.customWordsInputArea.classList.contains('hidden');
        if (isHidden) {
          this.dom.customWordsInputArea.classList.remove('hidden');
          if (this.dom.customWordsInput) {
            this.dom.customWordsInput.value = this.targetWordCount || 30;
            this.dom.customWordsInput.focus();
            this.dom.customWordsInput.select();
          }
        } else {
          this.dom.customWordsInputArea.classList.add('hidden');
        }
      });
    }

    const applyCustomWords = () => {
      const val = parseInt(this.dom.customWordsInput?.value, 10);
      if (isNaN(val) || val < 5 || val > 1000) {
        this.showToast('Please enter word count between 5 and 1000 words', '⚠️');
        return;
      }
      this.targetWordCount = val;
      if (this.dom.wordCountPicker) {
        this.dom.wordCountPicker.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
      }
      if (this.dom.customWordsBtn) {
        this.dom.customWordsBtn.classList.add('active');
        this.dom.customWordsBtn.textContent = `${val}w`;
      }
      if (this.dom.customWordsInputArea) {
        this.dom.customWordsInputArea.classList.add('hidden');
      }
      if (this.dom.currentWordCountHint) {
        this.dom.currentWordCountHint.textContent = `Custom: ${val} words`;
      }
      this.updateArenaModeBadge();
      this.showToast(`Target set to ${val} words`, '📝');
    };

    if (this.dom.applyCustomWordsBtn) {
      this.dom.applyCustomWordsBtn.addEventListener('click', applyCustomWords);
    }
    if (this.dom.customWordsInput) {
      this.dom.customWordsInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          applyCustomWords();
        }
      });
    }

    // 7. Lobby: Genre Picker
    if (this.dom.genrePicker) {
      this.dom.genrePicker.addEventListener('click', (e) => {
        const btn = e.target.closest('.pill-btn');
        if (!btn) return;
        this.dom.genrePicker.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.genre = btn.dataset.genre || 'quotes';

        if (this.genre === 'custom') {
          if (this.dom.customTextInputArea) this.dom.customTextInputArea.classList.remove('hidden');
          if (this.dom.customTextInput) this.dom.customTextInput.focus();
        } else {
          if (this.dom.customTextInputArea) this.dom.customTextInputArea.classList.add('hidden');
        }
        this.updateArenaModeBadge();
      });
    }

    // 8. Lobby: Difficulty Picker
    if (this.dom.difficultyPicker) {
      this.dom.difficultyPicker.addEventListener('click', (e) => {
        const btn = e.target.closest('.pill-btn');
        if (!btn) return;
        this.dom.difficultyPicker.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.difficulty = btn.dataset.difficulty || 'medium';
        this.updateArenaModeBadge();
      });
    }

    // 9. Lobby: Start Test Button
    if (this.dom.startTestBtn) {
      this.dom.startTestBtn.addEventListener('click', () => {
        this.startArenaSession();
      });
    }

    // 10. Arena: Restart & Home Buttons
    if (this.dom.restartTestBtn) {
      this.dom.restartTestBtn.addEventListener('click', () => this.restartTest());
    }
    if (this.dom.homeBtn) {
      this.dom.homeBtn.addEventListener('click', () => this.switchView('lobby'));
    }

    // 11. Arena: Refocus typing on click anywhere on text display
    if (this.dom.textDisplayCard) {
      this.dom.textDisplayCard.addEventListener('click', () => this.focusTypingInput());
    }
    if (this.dom.hiddenInput) {
      this.dom.hiddenInput.addEventListener('click', () => this.focusTypingInput());
    }

    // 12. Results View Actions
    if (this.dom.playAgainBtn) {
      this.dom.playAgainBtn.addEventListener('click', () => {
        this.startArenaSession();
      });
    }
    if (this.dom.practiceMistakesBtn) {
      this.dom.practiceMistakesBtn.addEventListener('click', () => {
        this.practiceMissedWords();
      });
    }
    if (this.dom.resultsHomeBtn) {
      this.dom.resultsHomeBtn.addEventListener('click', () => {
        this.switchView('lobby');
      });
    }

    // 13. Word Mastery & Analytics Controls
    if (this.dom.wordSearchInput) {
      this.dom.wordSearchInput.addEventListener('input', (e) => {
        this.analyticsWordSearch = (e.target.value || '').trim().toLowerCase();
        this.renderWordMasteryTable();
      });
    }

    if (this.dom.wordFilterTabs) {
      this.dom.wordFilterTabs.addEventListener('click', (e) => {
        const tab = e.target.closest('.wm-tab-btn, .filter-tab');
        if (!tab) return;
        this.dom.wordFilterTabs.querySelectorAll('.wm-tab-btn, .filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.analyticsWordFilter = tab.dataset.filter || 'all';
        this.renderWordMasteryTable();
      });
    }

    if (this.dom.wordSortSelect) {
      this.dom.wordSortSelect.addEventListener('change', (e) => {
        this.analyticsWordSort = e.target.value || 'bestWpm';
        this.renderWordMasteryTable();
      });
    }

    if (this.dom.practiceWeakWordsFromAnalyticsBtn) {
      this.dom.practiceWeakWordsFromAnalyticsBtn.addEventListener('click', () => {
        this.practiceWeakWordsDrill();
      });
    }

    if (this.dom.wordMasteryTbody) {
      this.dom.wordMasteryTbody.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-practice-word]');
        if (btn) {
          const targetWord = btn.dataset.practiceWord;
          if (targetWord) {
            this.practiceSingleWordDrill(targetWord);
          }
        }
      });
    }

    if (this.dom.historyTypeFilterGroup) {
      this.dom.historyTypeFilterGroup.addEventListener('click', (e) => {
        const btn = e.target.closest('.hl-filter-btn, .pill-btn');
        if (!btn) return;
        this.dom.historyTypeFilterGroup.querySelectorAll('.hl-filter-btn, .pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.historyTypeFilter = btn.dataset.typeFilter || btn.dataset.filter || 'all';
        this.renderHistoryLog();
      });
    }
  }

  // --- Supabase & Google OAuth Backend Management ---
  initSupabaseAuth() {
    this.setupAuthEventListeners();
    this.updateRecordsBadge();

    if (window.supabaseService) {
      window.supabaseService.onAuthStateChange((user, profile) => {
        this.handleAuthState(user, profile);
      });
    } else {
      console.log('Supabase service pending initialization...');
    }
  }

  handleAuthState(user, profile) {
    const isConfigured = window.supabaseService ? window.supabaseService.isConfigured() : false;

    if (user) {
      // User is logged in with Google
      if (this.dom.googleLoginBtn) this.dom.googleLoginBtn.classList.add('hidden');
      if (this.dom.userProfileChip) this.dom.userProfileChip.classList.remove('hidden');

      const avatar = profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture || 'assets/cat-logo.png';
      const name = profile?.display_name || user.user_metadata?.full_name || user.user_metadata?.name || (user.email ? user.email.split('@')[0] : 'Typist');
      const email = user.email || 'typist@gmail.com';

      if (this.dom.userAvatarImg) this.dom.userAvatarImg.src = avatar;
      if (this.dom.userDisplayName) this.dom.userDisplayName.textContent = name;
      if (this.dom.dropdownUserName) this.dom.dropdownUserName.textContent = name;
      if (this.dom.dropdownUserEmail) this.dom.dropdownUserEmail.textContent = email;

      if (this.dom.cloudLedDot) {
        this.dom.cloudLedDot.className = 'cloud-status-indicator connected';
      }
      if (this.dom.cloudStatusText) {
        this.dom.cloudStatusText.textContent = 'Supabase: Connected';
      }

      // Sync cloud profile stats with local stats
      if (profile) {
        this.stats.highestRecord = Math.max(this.stats.highestRecord || 0, profile.highest_wpm || 0);
        this.stats.testsCount = Math.max(this.stats.testsCount || 0, profile.total_tests || 0);
        this.stats.totalPracticeSeconds = Math.max(this.stats.totalPracticeSeconds || 0, profile.total_practice_seconds || 0);
        this.stats.totalChars = Math.max(this.stats.totalChars || 0, profile.total_chars || 0);
        this.stats.totalCorrect = Math.max(this.stats.totalCorrect || 0, profile.total_correct || 0);
        this.savePersistentStats();
      }

      this.showToast(`Welcome back, ${name}! Cloud synced ⚡`, '👋');
    } else {
      // User is logged out / guest mode
      if (this.dom.googleLoginBtn) this.dom.googleLoginBtn.classList.remove('hidden');
      if (this.dom.userProfileChip) this.dom.userProfileChip.classList.add('hidden');
      if (this.dom.userDropdownMenu) this.dom.userDropdownMenu.classList.add('hidden');

      if (this.dom.cloudLedDot) {
        this.dom.cloudLedDot.className = isConfigured ? 'cloud-status-indicator' : 'cloud-status-indicator offline';
      }
      if (this.dom.cloudStatusText) {
        this.dom.cloudStatusText.textContent = isConfigured ? 'Supabase: Ready' : 'Supabase: Setup';
      }
    }

    this.updateRecordsBadge();
  }

  setupAuthEventListeners() {
    // 1. Google Login Button
    if (this.dom.googleLoginBtn) {
      this.dom.googleLoginBtn.addEventListener('click', async () => {
        if (!window.supabaseService || !window.supabaseService.isConfigured()) {
          this.openSupabaseConfigModal();
          return;
        }

        try {
          this.showToast('Redirecting to Google Sign-In...', '⚡');
          await window.supabaseService.signInWithGoogle();
        } catch (err) {
          console.error('Google Sign-In failed:', err);
          if (err.message === 'CONFIG_REQUIRED') {
            this.openSupabaseConfigModal();
          } else {
            this.showToast(`Login failed: ${err.message || 'Error'}`, '⚠️', 4000);
          }
        }
      });
    }

    // 2. User Profile Chip & Dropdown
    if (this.dom.userProfileChip) {
      this.dom.userProfileChip.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.dom.userDropdownMenu) {
          this.dom.userDropdownMenu.classList.toggle('hidden');
        }
      });
    }

    // Click outside closes dropdown
    document.addEventListener('click', (e) => {
      if (this.dom.userDropdownMenu && !this.dom.userDropdownMenu.classList.contains('hidden')) {
        if (this.dom.authContainer && !this.dom.authContainer.contains(e.target)) {
          this.dom.userDropdownMenu.classList.add('hidden');
        }
      }
    });

    // 3. User Dropdown Actions
    if (this.dom.openRecordsBtn) {
      this.dom.openRecordsBtn.addEventListener('click', () => {
        if (this.dom.userDropdownMenu) this.dom.userDropdownMenu.classList.add('hidden');
        this.loadRecordsModal();
      });
    }

    if (this.dom.openCloudSettingsBtn) {
      this.dom.openCloudSettingsBtn.addEventListener('click', () => {
        if (this.dom.userDropdownMenu) this.dom.userDropdownMenu.classList.add('hidden');
        this.openSupabaseConfigModal();
      });
    }

    if (this.dom.logoutBtn) {
      this.dom.logoutBtn.addEventListener('click', async () => {
        if (this.dom.userDropdownMenu) this.dom.userDropdownMenu.classList.add('hidden');
        if (window.supabaseService) {
          await window.supabaseService.signOut();
          this.showToast('Signed out of Supabase.', '🚪');
        }
      });
    }

    // 4. Lobby Quick Bar
    if (this.dom.lobbyViewRecordsBtn) {
      this.dom.lobbyViewRecordsBtn.addEventListener('click', () => {
        this.loadRecordsModal();
      });
    }

    if (this.dom.lobbyCloudStatusBtn) {
      this.dom.lobbyCloudStatusBtn.addEventListener('click', () => {
        this.openSupabaseConfigModal();
      });
    }

    // 5. Records Modal Controls
    const closeRecordsModal = () => {
      if (this.dom.recordsModal) this.dom.recordsModal.classList.add('hidden');
    };
    if (this.dom.closeRecordsModalX) this.dom.closeRecordsModalX.addEventListener('click', closeRecordsModal);
    if (this.dom.closeRecordsModalBtn) this.dom.closeRecordsModalBtn.addEventListener('click', closeRecordsModal);
    if (this.dom.closeRecordsModalBottomBtn) this.dom.closeRecordsModalBottomBtn.addEventListener('click', closeRecordsModal);

    if (this.dom.refreshRecordsBtn) {
      this.dom.refreshRecordsBtn.addEventListener('click', () => {
        this.loadRecordsModal();
      });
    }

    // 6. Config Modal Controls
    const closeConfigModal = () => {
      if (this.dom.supabaseConfigModal) this.dom.supabaseConfigModal.classList.add('hidden');
    };
    if (this.dom.closeConfigModalX) this.dom.closeConfigModalX.addEventListener('click', closeConfigModal);
    if (this.dom.closeConfigModalBtn) this.dom.closeConfigModalBtn.addEventListener('click', closeConfigModal);

    if (this.dom.saveSupabaseConfigBtn) {
      this.dom.saveSupabaseConfigBtn.addEventListener('click', () => {
        const url = (this.dom.cfgSupabaseUrl?.value || '').trim();
        const key = (this.dom.cfgSupabaseAnonKey?.value || '').trim();

        if (!url || !key) {
          this.showToast('Please enter both Supabase URL and Anon Key', '⚠️');
          return;
        }

        try {
          if (window.supabaseService) {
            window.supabaseService.saveConfig(url, key);
            this.showToast('Supabase configured successfully! ⚡', '✅');
            closeConfigModal();
            this.handleAuthState(window.supabaseService.user, window.supabaseService.profile);
          }
        } catch (err) {
          this.showToast(err.message, '⚠️');
        }
      });
    }

    if (this.dom.clearSupabaseConfigBtn) {
      this.dom.clearSupabaseConfigBtn.addEventListener('click', () => {
        if (confirm('Disconnect Supabase and switch back to local guest storage?')) {
          if (window.supabaseService) {
            window.supabaseService.clearConfig();
          }
          if (this.dom.cfgSupabaseUrl) this.dom.cfgSupabaseUrl.value = '';
          if (this.dom.cfgSupabaseAnonKey) this.dom.cfgSupabaseAnonKey.value = '';
          this.showToast('Switched to local guest mode', '💾');
          closeConfigModal();
        }
      });
    }

    if (this.dom.copySqlSchemaBtn) {
      this.dom.copySqlSchemaBtn.addEventListener('click', () => {
        this.copySqlSchema();
      });
    }

    // Keyboard ESC closes active modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeRecordsModal();
        closeConfigModal();
      }
    });
  }

  openSupabaseConfigModal() {
    if (!this.dom.supabaseConfigModal) return;
    this.dom.supabaseConfigModal.classList.remove('hidden');

    if (window.supabaseService) {
      const cfg = window.supabaseService.getConfig();
      if (this.dom.cfgSupabaseUrl) this.dom.cfgSupabaseUrl.value = cfg.url || '';
      if (this.dom.cfgSupabaseAnonKey) this.dom.cfgSupabaseAnonKey.value = cfg.anonKey || '';

      const isConfigured = window.supabaseService.isConfigured();
      if (this.dom.csbDot) {
        this.dom.csbDot.className = isConfigured ? 'csb-dot connected' : 'csb-dot';
      }
      if (this.dom.csbText) {
        this.dom.csbText.textContent = isConfigured
          ? `Status: Connected to ${cfg.url.replace(/^https?:\/\//, '').split('.')[0]}.supabase.co`
          : 'Status: Not configured (Local storage active)';
      }
    }
  }

  showToast(msg, icon = '⚡', duration = 3200) {
    if (!this.dom.cyberToast) return;
    if (this.dom.toastIcon) this.dom.toastIcon.textContent = icon;
    if (this.dom.toastMessage) this.dom.toastMessage.textContent = msg;

    this.dom.cyberToast.classList.remove('hidden');
    this.dom.cyberToast.classList.add('show');

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.dom.cyberToast.classList.remove('show');
      setTimeout(() => {
        this.dom.cyberToast.classList.add('hidden');
      }, 300);
    }, duration);
  }

  updateRecordsBadge() {
    let count = 0;
    if (window.supabaseService && window.supabaseService.user && window.supabaseService.cachedRecords?.length) {
      count = window.supabaseService.cachedRecords.length;
    } else {
      try {
        const local = JSON.parse(localStorage.getItem('meow_typing_records') || '[]');
        count = local.length;
      } catch (e) {
        count = 0;
      }
    }
    if (this.dom.recordsBadgeCount) {
      this.dom.recordsBadgeCount.textContent = `${count} saved`;
    }
  }

  // --- Save Completed Test to Local Storage & Supabase ---
  saveTestRecord(record) {
    // 1. Save to local storage
    try {
      const local = JSON.parse(localStorage.getItem('meow_typing_records') || '[]');
      const localEntry = {
        ...record,
        id: 'local_' + Date.now(),
        created_at: new Date().toISOString()
      };
      local.unshift(localEntry);
      if (local.length > 100) local.pop();
      localStorage.setItem('meow_typing_records', JSON.stringify(local));
      this.updateRecordsBadge();
    } catch (e) {
      console.warn('Could not save test locally:', e);
    }

    // 2. Save to Supabase Cloud if authenticated
    if (window.supabaseService && window.supabaseService.user) {
      window.supabaseService.saveTypingRecord(record)
        .then(() => {
          this.showToast('Saved to Supabase Cloud! ☁️', '✅');
          this.updateRecordsBadge();
          if (window.supabaseService.profile) {
            this.handleAuthState(window.supabaseService.user, window.supabaseService.profile);
          }
        })
        .catch(err => {
          console.error('Failed to sync to Supabase:', err);
          this.showToast('Saved locally (Supabase sync failed)', '⚠️');
        });
    } else {
      this.showToast('Test saved locally! Sign in with Google to sync ☁️', '💾');
    }
  }

  // --- Load Records Modal ---
  async loadRecordsModal() {
    if (!this.dom.recordsModal) return;
    this.dom.recordsModal.classList.remove('hidden');

    const isUserLoggedIn = Boolean(window.supabaseService && window.supabaseService.user);

    if (isUserLoggedIn) {
      const user = window.supabaseService.user;
      const profile = window.supabaseService.profile;
      const avatar = profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture || 'assets/cat-logo.png';
      const name = profile?.display_name || user.user_metadata?.full_name || user.user_metadata?.name || (user.email ? user.email.split('@')[0] : 'Typist');

      if (this.dom.recordsModalAvatar) this.dom.recordsModalAvatar.src = avatar;
      if (this.dom.recordsModalUser) this.dom.recordsModalUser.textContent = name;
      if (this.dom.recordsModalEmail) this.dom.recordsModalEmail.textContent = user.email || 'Supabase Synchronized';
    } else {
      if (this.dom.recordsModalAvatar) this.dom.recordsModalAvatar.src = 'assets/cat-logo.png';
      if (this.dom.recordsModalUser) this.dom.recordsModalUser.textContent = 'Guest Typist';
      if (this.dom.recordsModalEmail) this.dom.recordsModalEmail.textContent = 'Local Browser Storage (Sign in with Google to sync)';
    }

    if (this.dom.recordsListStatus) this.dom.recordsListStatus.textContent = 'Fetching records...';

    let records = [];
    if (isUserLoggedIn) {
      try {
        records = await window.supabaseService.fetchUserRecords(100);
      } catch (e) {
        console.warn('Fallback to local storage records:', e);
        records = JSON.parse(localStorage.getItem('meow_typing_records') || '[]');
      }
    } else {
      records = JSON.parse(localStorage.getItem('meow_typing_records') || '[]');
    }

    this.renderRecordsList(records);
  }

  renderRecordsList(records) {
    if (!this.dom.recordsFeed) return;
    this.dom.recordsFeed.innerHTML = '';

    const total = records.length;
    if (this.dom.recordsListStatus) {
      this.dom.recordsListStatus.textContent = `${total} saved tests`;
    }
    if (this.dom.rssTotalTests) {
      this.dom.rssTotalTests.textContent = total;
    }

    if (total === 0) {
      if (this.dom.emptyRecordsNotice) {
        this.dom.recordsFeed.appendChild(this.dom.emptyRecordsNotice);
        this.dom.emptyRecordsNotice.style.display = 'block';
      }
      return;
    }

    let highestWpm = 0;
    let totalPracticeSeconds = 0;
    let totalChars = 0;
    let totalCorrect = 0;

    records.forEach(r => {
      highestWpm = Math.max(highestWpm, r.wpm || 0);
      totalPracticeSeconds += (r.duration_seconds || r.durationSeconds || 60);
      totalChars += (r.total_chars || r.totalChars || 0);
      totalCorrect += (r.correct_chars || r.correctChars || 0);
    });

    const avgAcc = totalChars > 0 ? Math.round((totalCorrect / totalChars) * 100) : 100;
    const mins = Math.floor(totalPracticeSeconds / 60);
    const secs = totalPracticeSeconds % 60;

    if (this.dom.rssBestWpm) this.dom.rssBestWpm.textContent = `${highestWpm} WPM`;
    if (this.dom.rssAvgAccuracy) this.dom.rssAvgAccuracy.textContent = `${avgAcc}%`;
    if (this.dom.rssPracticeTime) this.dom.rssPracticeTime.textContent = `${mins}m ${secs}s`;

    records.forEach(rec => {
      const row = document.createElement('div');
      row.className = 'record-card-row';

      const wpm = rec.wpm || 0;
      const rawWpm = rec.raw_wpm || rec.rawWpm || wpm;
      const accuracy = rec.accuracy || 100;
      const mode = rec.mode || 'quotes';
      const difficulty = rec.difficulty || 'normal';
      const duration = rec.duration_seconds || rec.durationSeconds || 60;
      const isPb = rec.is_new_record || rec.isNewRecord || (wpm === highestWpm && highestWpm > 0);

      const dateStr = rec.created_at
        ? new Date(rec.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        : 'Recent';

      const isWords = rec.test_type === 'words';
      const targetLabel = isWords ? `${rec.target_value || rec.words_typed || 25} Words` : `${duration}s`;

      row.innerHTML = `
        <div class="rcr-wpm">
          <span>${escapeHtml(wpm)}</span>
          <small style="font-size:0.65rem;color:var(--text-muted)">WPM</small>
          ${isPb ? '<span class="rcr-pb-badge">🏆 PB</span>' : ''}
        </div>
        <div class="rcr-raw">Raw: ${escapeHtml(rawWpm)}</div>
        <div class="rcr-acc">${escapeHtml(accuracy)}% Acc</div>
        <div class="rcr-meta">
          <span class="rcr-badge-pill">${escapeHtml(targetLabel)} • ${escapeHtml(mode)} • ${escapeHtml(difficulty)}</span>
          <span class="rcr-date">${escapeHtml(dateStr)}</span>
        </div>
        <button class="rcr-del-btn" title="Delete record" data-id="${escapeHtml(rec.id)}">✕</button>
      `;

      const delBtn = row.querySelector('.rcr-del-btn');
      if (delBtn) {
        delBtn.addEventListener('click', async (e) => {
          e.stopPropagation();
          await this.deleteTypingRecord(rec.id);
        });
      }

      this.dom.recordsFeed.appendChild(row);
    });
  }

  async deleteTypingRecord(id) {
    if (!confirm('Are you sure you want to delete this test record?')) return;

    if (window.supabaseService && window.supabaseService.user && !String(id).startsWith('local_')) {
      await window.supabaseService.deleteRecord(id);
    }

    try {
      let local = JSON.parse(localStorage.getItem('meow_typing_records') || '[]');
      local = local.filter(r => r.id !== id);
      localStorage.setItem('meow_typing_records', JSON.stringify(local));
    } catch (e) { }

    this.showToast('Record deleted', '🗑️');
    this.loadRecordsModal();
    this.updateRecordsBadge();
  }

  copySqlSchema() {
    const schemaText = `-- ====================================================================
-- MEOW-TYPING • SUPABASE PRODUCTION DATABASE SCHEMA
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  highest_wpm INTEGER DEFAULT 0,
  total_tests INTEGER DEFAULT 0,
  total_practice_seconds INTEGER DEFAULT 0,
  total_chars INTEGER DEFAULT 0,
  total_correct INTEGER DEFAULT 0,
  avg_accuracy INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.typing_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  wpm INTEGER NOT NULL,
  raw_wpm INTEGER NOT NULL,
  accuracy INTEGER NOT NULL,
  duration_seconds INTEGER NOT NULL,
  mode TEXT DEFAULT 'quotes',
  difficulty TEXT DEFAULT 'normal',
  errors_count INTEGER DEFAULT 0,
  total_chars INTEGER DEFAULT 0,
  correct_chars INTEGER DEFAULT 0,
  is_new_record BOOLEAN DEFAULT FALSE,
  test_type TEXT DEFAULT 'time',
  target_value INTEGER DEFAULT 60,
  words_typed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.typing_records ADD COLUMN IF NOT EXISTS test_type TEXT DEFAULT 'time';
ALTER TABLE public.typing_records ADD COLUMN IF NOT EXISTS target_value INTEGER DEFAULT 60;
ALTER TABLE public.typing_records ADD COLUMN IF NOT EXISTS words_typed INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_typing_records_user_id ON public.typing_records(user_id);
CREATE INDEX IF NOT EXISTS idx_typing_records_created_at ON public.typing_records(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_typing_records_wpm ON public.typing_records(wpm DESC);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.typing_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view their own records" ON public.typing_records;
CREATE POLICY "Users can view their own records" ON public.typing_records FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own records" ON public.typing_records;
CREATE POLICY "Users can insert their own records" ON public.typing_records FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own records" ON public.typing_records;
CREATE POLICY "Users can delete their own records" ON public.typing_records FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1), 'Cyber Typist'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    display_name = COALESCE(NULLIF(EXCLUDED.display_name, ''), public.profiles.display_name),
    avatar_url = COALESCE(NULLIF(EXCLUDED.avatar_url, ''), public.profiles.avatar_url),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(schemaText)
        .then(() => {
          this.showToast('SQL schema copied to clipboard! 📋', '✅');
        })
        .catch(() => {
          this.showToast('Check supabase-schema.sql for SQL code', '📄');
        });
    } else {
      this.showToast('Check supabase-schema.sql for SQL code', '📄');
    }
  }

  // --- Cumulative Player Stats (Tests taken, Record, Time Practiced) ---
  loadPersistentStats() {
    try {
      this.stats = JSON.parse(localStorage.getItem('meow_typing_stats')) || {
        testsCount: 0,
        highestRecord: 0,
        totalPracticeSeconds: 0,
        totalChars: 0,
        totalCorrect: 0
      };

      // Load Word Performance Mastery Matrix
      this.wordPerformanceStats = JSON.parse(localStorage.getItem('meow_word_stats') || '{}');
      this.seedInitialWordStatsIfEmpty();

      // Load saved user meme if any
      const savedMeme = localStorage.getItem('meow_user_meme');
      if (savedMeme && this.dom.judgeMemeImg) {
        this.dom.judgeMemeImg.src = savedMeme;
        if (this.dom.memeChamberStatus) this.dom.memeChamberStatus.textContent = 'USER MEME LOADED';
      }

      this.updateStatsUI();
    } catch (e) {
      console.warn('Could not load persistent stats:', e);
    }
  }

  savePersistentStats() {
    try {
      localStorage.setItem('meow_typing_stats', JSON.stringify(this.stats));
      localStorage.setItem('meow_word_stats', JSON.stringify(this.wordPerformanceStats));
      this.updateStatsUI();
    } catch (e) {
      console.warn('Could not save persistent stats:', e);
    }
  }

  saveWordStats() {
    try {
      localStorage.setItem('meow_word_stats', JSON.stringify(this.wordPerformanceStats));
    } catch (e) {
      console.warn('Could not save word stats:', e);
    }
  }

  seedInitialWordStatsIfEmpty() {
    if (Object.keys(this.wordPerformanceStats).length >= 5) return;

    // Seed realistic starter word telemetry for immediate analytics preview
    const sampleWords = [
      { word: 'algorithm', bestWpm: 92, fastestMs: 195, timesTyped: 14, errors: 0 },
      { word: 'cyberpunk', bestWpm: 88, fastestMs: 205, timesTyped: 12, errors: 0 },
      { word: 'keystroke', bestWpm: 85, fastestMs: 212, timesTyped: 10, errors: 0 },
      { word: 'velocity', bestWpm: 81, fastestMs: 222, timesTyped: 15, errors: 1 },
      { word: 'frequency', bestWpm: 76, fastestMs: 236, timesTyped: 8, errors: 0 },
      { word: 'symphony', bestWpm: 72, fastestMs: 250, timesTyped: 9, errors: 0 },
      { word: 'precision', bestWpm: 68, fastestMs: 265, timesTyped: 11, errors: 1 },
      { word: 'terminal', bestWpm: 64, fastestMs: 280, timesTyped: 16, errors: 1 },
      { word: 'database', bestWpm: 58, fastestMs: 310, timesTyped: 7, errors: 1 },
      { word: 'cadence', bestWpm: 52, fastestMs: 345, timesTyped: 6, errors: 1 },
      { word: 'rhythm', bestWpm: 46, fastestMs: 390, timesTyped: 8, errors: 2 },
      { word: 'keyboard', bestWpm: 42, fastestMs: 420, timesTyped: 13, errors: 2 },
      { word: 'debugging', bestWpm: 38, fastestMs: 480, timesTyped: 5, errors: 2 },
      { word: 'quarantine', bestWpm: 35, fastestMs: 514, timesTyped: 4, errors: 2 },
      { word: 'asynchronous', bestWpm: 31, fastestMs: 580, timesTyped: 4, errors: 3 }
    ];

    sampleWords.forEach(sw => {
      if (!this.wordPerformanceStats[sw.word]) {
        this.wordPerformanceStats[sw.word] = {
          word: sw.word,
          timesTyped: sw.timesTyped,
          errorsCount: sw.errors,
          bestWpm: sw.bestWpm,
          fastestMs: sw.fastestMs,
          totalMs: sw.fastestMs * sw.timesTyped,
          lastTested: Date.now() - Math.floor(Math.random() * 86400000 * 3)
        };
      }
    });

    this.saveWordStats();
  }

  recordWordTelemetry(word, durationMs, hadError) {
    if (!word) return;
    const cleanWord = word.toLowerCase().replace(/[^a-z0-9'-]/g, '');
    if (!cleanWord || cleanWord.length < 1) return;

    const safeMs = Math.max(50, durationMs);
    const wordWpm = Math.max(1, Math.round((cleanWord.length / 5) / (safeMs / 60000)));

    if (!this.wordPerformanceStats[cleanWord]) {
      this.wordPerformanceStats[cleanWord] = {
        word: cleanWord,
        timesTyped: 0,
        errorsCount: 0,
        bestWpm: wordWpm,
        fastestMs: safeMs,
        totalMs: 0,
        lastTested: Date.now()
      };
    }

    const stat = this.wordPerformanceStats[cleanWord];
    stat.timesTyped++;
    if (hadError) stat.errorsCount++;
    stat.bestWpm = Math.max(stat.bestWpm, wordWpm);
    stat.fastestMs = Math.min(stat.fastestMs, safeMs);
    stat.totalMs += safeMs;
    stat.lastTested = Date.now();

    this.saveWordStats();
  }

  updateStatsUI() {
    const tests = this.stats.testsCount || 0;
    const bestWpm = this.stats.highestRecord || 0;
    const totalSecs = this.stats.totalPracticeSeconds || 0;
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    const acc = this.stats.totalChars > 0
      ? Math.round((this.stats.totalCorrect / this.stats.totalChars) * 100)
      : 100;

    // Header Best WPM
    if (this.dom.globalBestWpm) {
      this.dom.globalBestWpm.textContent = `${bestWpm} WPM`;
    }

    // Lobby Stats Strip
    if (this.dom.statTestsCount) this.dom.statTestsCount.textContent = tests;
    if (this.dom.statHighestRecord) this.dom.statHighestRecord.textContent = `${bestWpm} WPM`;
    if (this.dom.statTimeSpent) this.dom.statTimeSpent.textContent = `${mins}m ${secs}s`;
    if (this.dom.statAvgAccuracy) this.dom.statAvgAccuracy.textContent = `${acc}%`;
  }

  // --- Judge Terminal Meme & Reaction Controller ---
  setJudgeMeme(state, customTitle = null, customCaption = null) {
    if (!this.dom.judgeMemeImg) return;
    this.judgeMemeState = state;
    this.dom.judgeMemeImg.classList.remove(
      'worst-performance', 'gamer-mode', 'error-mode', 'facepalm-mode', 'disappointed-mode',
      'impressed-mode', 'clock-mode', 'thuglife-mode', 'standing-mode', 'warning-mode',
      'sink-mode', 'mocking-mode', 'sideeye-mode', 'buff-mode'
    );

    if (state === 'worst') {
      this.dom.judgeMemeImg.src = 'assets/meme-coughing.jpg';
      this.dom.judgeMemeImg.classList.add('worst-performance');
      if (this.dom.memeChamberStatus) {
        this.dom.memeChamberStatus.textContent = 'CHOKING ON TYPOS 💀';
        this.dom.memeChamberStatus.style.color = '#ff2a5f';
      }
      if (this.dom.judgeStatusLabel) {
        this.dom.judgeStatusLabel.textContent = 'DISGUSTED';
        this.dom.judgeStatusLabel.style.color = '#ff2a5f';
      }
      if (this.dom.judgeMemeCaption) {
        const title = customTitle || 'Coughing Cat';
        const caption = customCaption || 'Bro is literally coughing from your typos 💀';
        this.dom.judgeMemeCaption.innerHTML = `<strong>${title}</strong><span>${caption}</span>`;
      }
      this.updateJudgeVerdict('WORST_PERFORMANCE', 'Heavy typo cadence • Precision collapsed');
    } else if (state === 'good' || state === 'gamer') {
      this.dom.judgeMemeImg.src = 'assets/meme-gamer.jpg';
      this.dom.judgeMemeImg.classList.add('gamer-mode');
      if (this.dom.memeChamberStatus) {
        this.dom.memeChamberStatus.textContent = 'LOCKED IN 🎧';
        this.dom.memeChamberStatus.style.color = '#e2b714';
      }
      if (this.dom.judgeStatusLabel) {
        this.dom.judgeStatusLabel.textContent = 'IN THE ZONE';
        this.dom.judgeStatusLabel.style.color = '#e2b714';
      }
      if (this.dom.judgeMemeCaption) {
        const title = customTitle || 'Gamer Cat • In The Zone';
        const caption = customCaption || 'Sipping Coke with zero sweat. Pro gamer flow! 🎧';
        this.dom.judgeMemeCaption.innerHTML = `<strong>${title}</strong><span>${caption}</span>`;
      }
      this.updateJudgeVerdict('PRO_GAMER_FLOW', `Streak x${this.streak} // Velocity high • Cadence locked`);
    } else if (state === 'streak') {
      this.dom.judgeMemeImg.src = 'assets/meme-gamer.jpg';
      this.dom.judgeMemeImg.classList.add('gamer-mode');
      if (this.dom.memeChamberStatus) {
        this.dom.memeChamberStatus.textContent = 'ON FIRE 🔥';
        this.dom.memeChamberStatus.style.color = '#ffb703';
      }
      if (this.dom.judgeStatusLabel) {
        this.dom.judgeStatusLabel.textContent = 'IMPRESSED';
        this.dom.judgeStatusLabel.style.color = '#ffb703';
      }
      if (this.dom.judgeMemeCaption) {
        this.dom.judgeMemeCaption.innerHTML = `<strong>High Velocity</strong><span>Streak x${this.streak}! Smooth precision cadence.</span>`;
      }
      this.updateJudgeVerdict('VELOCITY_NOMINAL', `Streak x${this.streak} // Jitter 0.00ms`);
    } else if (state === 'error' || state === 'loading') {
      this.dom.judgeMemeImg.src = 'assets/meme-loading.jpg';
      this.dom.judgeMemeImg.classList.add('error-mode');
      if (this.dom.memeChamberStatus) {
        this.dom.memeChamberStatus.textContent = 'BUFFERING... 🔄';
        this.dom.memeChamberStatus.style.color = '#f59e0b';
      }
      if (this.dom.judgeStatusLabel) {
        this.dom.judgeStatusLabel.textContent = 'TYPO DETECTED';
        this.dom.judgeStatusLabel.style.color = '#f59e0b';
      }
      if (this.dom.judgeMemeCaption) {
        const title = customTitle || 'Buffering Cat • 404 Brain';
        const caption = customCaption || 'Typo detected! Recalibrating fingers...';
        this.dom.judgeMemeCaption.innerHTML = `<strong>${title}</strong><span>${caption}</span>`;
      }
      this.updateJudgeVerdict('ERROR_LOGGED', 'Keystroke mismatch • Buffering next key...');
    } else if (state === 'shaka' || state === 'finish') {
      this.dom.judgeMemeImg.src = 'assets/meme-shaka.jpg';
      if (this.dom.memeChamberStatus) {
        this.dom.memeChamberStatus.textContent = 'COMPLETED 🤙';
        this.dom.memeChamberStatus.style.color = '#10b981';
      }
      if (this.dom.judgeStatusLabel) {
        this.dom.judgeStatusLabel.textContent = 'VALIDATED 🤙';
        this.dom.judgeStatusLabel.style.color = '#10b981';
      }
      if (this.dom.judgeMemeCaption) {
        const title = customTitle || 'Test Finished 🤙';
        const caption = customCaption || 'Purr-fect run completed! Check your breakdown.';
        this.dom.judgeMemeCaption.innerHTML = `<strong>${title}</strong><span>${caption}</span>`;
      }
      this.updateJudgeVerdict('BENCHMARK_VALIDATED', 'Test run validated • Data logged');
    } else if (state === 'facepalm' || state === 'low_accuracy') {
      this.dom.judgeMemeImg.src = 'assets/meme-facepalm.jpg';
      this.dom.judgeMemeImg.classList.add('facepalm-mode');
      if (this.dom.memeChamberStatus) {
        this.dom.memeChamberStatus.textContent = 'ACCURACY < 85% 🤦';
        this.dom.memeChamberStatus.style.color = '#f97316';
      }
      if (this.dom.judgeStatusLabel) {
        this.dom.judgeStatusLabel.textContent = 'FACEPALM 🤦';
        this.dom.judgeStatusLabel.style.color = '#f97316';
      }
      if (this.dom.judgeMemeCaption) {
        const title = customTitle || 'Facepalm Cat • Accuracy < 85%';
        const caption = customCaption || 'The judge has a headache from all those typos! Practice accuracy.';
        this.dom.judgeMemeCaption.innerHTML = `<strong>${title}</strong><span>${caption}</span>`;
      }
      this.updateJudgeVerdict('ACCURACY_SUBPAR', 'Accuracy dropped below 85% threshold • Focus on precision');
    } else if (state === 'disappointed') {
      this.dom.judgeMemeImg.src = 'assets/meme-disappointed.jpg';
      this.dom.judgeMemeImg.classList.add('disappointed-mode');
      if (this.dom.memeChamberStatus) {
        this.dom.memeChamberStatus.textContent = 'DISAPPOINTED 🌧️';
        this.dom.memeChamberStatus.style.color = '#94a3b8';
      }
      if (this.dom.judgeStatusLabel) {
        this.dom.judgeStatusLabel.textContent = 'DISAPPOINTING 🌧️';
        this.dom.judgeStatusLabel.style.color = '#94a3b8';
      }
      if (this.dom.judgeMemeCaption) {
        const title = customTitle || 'Disappointed Drenched Cat';
        const caption = customCaption || 'The judge is standing under the shower contemplating life... Speed was too low.';
        this.dom.judgeMemeCaption.innerHTML = `<strong>${title}</strong><span>${caption}</span>`;
      }
      this.updateJudgeVerdict('DISAPPOINTED', 'Performance fell short of expectations • Velocity sluggish');
    } else if (state === 'impressed') {
      this.dom.judgeMemeImg.src = 'assets/meme-impressed.jpg';
      this.dom.judgeMemeImg.classList.add('impressed-mode');
      if (this.dom.memeChamberStatus) {
        this.dom.memeChamberStatus.textContent = 'JAW DROPPED 🙀';
        this.dom.memeChamberStatus.style.color = '#f59e0b';
      }
      if (this.dom.judgeStatusLabel) {
        this.dom.judgeStatusLabel.textContent = 'IMPRESSED 🙀';
        this.dom.judgeStatusLabel.style.color = '#f59e0b';
      }
      if (this.dom.judgeMemeCaption) {
        const title = customTitle || 'Jaw-Dropped Cat • Impressive!';
        const caption = customCaption || 'The judge is speechless! Jaw dropped at your blistering performance 🙀';
        this.dom.judgeMemeCaption.innerHTML = `<strong>${title}</strong><span>${caption}</span>`;
      }
      this.updateJudgeVerdict('GODLIKE_CADENCE', `Streak x${this.streak} // Velocity unbelievable • Blistering pace`);
    } else if (state === 'buff' || state === 'power') {
      this.dom.judgeMemeImg.src = 'assets/meme-buff.jpg';
      this.dom.judgeMemeImg.classList.add('buff-mode');
      if (this.dom.memeChamberStatus) {
        this.dom.memeChamberStatus.textContent = 'POWER STREAK 💪';
        this.dom.memeChamberStatus.style.color = '#10b981';
      }
      if (this.dom.judgeStatusLabel) {
        this.dom.judgeStatusLabel.textContent = 'CHAD CAT 💪';
        this.dom.judgeStatusLabel.style.color = '#10b981';
      }
      if (this.dom.judgeMemeCaption) {
        const title = customTitle || 'Buff Chad Cat 💪';
        const caption = customCaption || `Heavy duty typing power! Streak x${this.streak}. The judge gives a big thumbs up!`;
        this.dom.judgeMemeCaption.innerHTML = `<strong>${title}</strong><span>${caption}</span>`;
      }
      this.updateJudgeVerdict('POWER_CADENCE', `Streak x${this.streak} // High impact typing flow`);
    } else if (state === 'thuglife') {
      this.dom.judgeMemeImg.src = 'assets/meme-thuglife.jpg';
      this.dom.judgeMemeImg.classList.add('thuglife-mode');
      if (this.dom.memeChamberStatus) {
        this.dom.memeChamberStatus.textContent = 'DEAL WITH IT 😎';
        this.dom.memeChamberStatus.style.color = '#e2b714';
      }
      if (this.dom.judgeStatusLabel) {
        this.dom.judgeStatusLabel.textContent = 'THUG LIFE 😎';
        this.dom.judgeStatusLabel.style.color = '#e2b714';
      }
      if (this.dom.judgeMemeCaption) {
        const title = customTitle || 'Thug Life Cat 😎';
        const caption = customCaption || '100% Pure Swag! Flawless cadence with zero hesitation. Deal with it.';
        this.dom.judgeMemeCaption.innerHTML = `<strong>${title}</strong><span>${caption}</span>`;
      }
      this.updateJudgeVerdict('FLAWLESS_SWAG', `Streak x${this.streak} // Godlike flow • Deal with it`);
    } else if (state === 'warning') {
      this.dom.judgeMemeImg.src = 'assets/meme-warning.jpg';
      this.dom.judgeMemeImg.classList.add('warning-mode');
      if (this.dom.memeChamberStatus) {
        this.dom.memeChamberStatus.textContent = 'LAST WARNING ⚠️';
        this.dom.memeChamberStatus.style.color = '#eab308';
      }
      if (this.dom.judgeStatusLabel) {
        this.dom.judgeStatusLabel.textContent = 'LAST WARNING ⚠️';
        this.dom.judgeStatusLabel.style.color = '#eab308';
      }
      if (this.dom.judgeMemeCaption) {
        const title = customTitle || 'Last Warning Ok ⚠️';
        const caption = customCaption || 'Two typos in a row! The judge says: last warning ok. Focus on precision!';
        this.dom.judgeMemeCaption.innerHTML = `<strong>${title}</strong><span>${caption}</span>`;
      }
      this.updateJudgeVerdict('WARNING_ISSUED', 'Consecutive errors detected • One more will cause coughing meltdown!');
    } else if (state === 'mocking') {
      this.dom.judgeMemeImg.src = 'assets/meme-mocking.jpg';
      this.dom.judgeMemeImg.classList.add('mocking-mode');
      if (this.dom.memeChamberStatus) {
        this.dom.memeChamberStatus.textContent = 'POINT & LAUGH 🫵😂';
        this.dom.memeChamberStatus.style.color = '#ff2a5f';
      }
      if (this.dom.judgeStatusLabel) {
        this.dom.judgeStatusLabel.textContent = 'MOCKING 🫵😂';
        this.dom.judgeStatusLabel.style.color = '#ff2a5f';
      }
      if (this.dom.judgeMemeCaption) {
        const title = customTitle || 'Pointing & Laughing Cat 🫵😂';
        const caption = customCaption || 'The judge is pointing and laughing at that keyboard smash! Backspacing won\'t hide it!';
        this.dom.judgeMemeCaption.innerHTML = `<strong>${title}</strong><span>${caption}</span>`;
      }
      this.updateJudgeVerdict('MOCKING_ERRORS', 'Heavy backspace spam detected 🫵😂');
    } else if (state === 'sideeye' || state === 'suspicious') {
      this.dom.judgeMemeImg.src = 'assets/meme-sideeye.jpg';
      this.dom.judgeMemeImg.classList.add('sideeye-mode');
      if (this.dom.memeChamberStatus) {
        this.dom.memeChamberStatus.textContent = 'SUSPICIOUS 🤨';
        this.dom.memeChamberStatus.style.color = '#f97316';
      }
      if (this.dom.judgeStatusLabel) {
        this.dom.judgeStatusLabel.textContent = 'BOMBASTIC SIDE-EYE 🤨';
        this.dom.judgeStatusLabel.style.color = '#f97316';
      }
      if (this.dom.judgeMemeCaption) {
        const title = customTitle || 'Bombastic Side-Eye 🤨';
        const caption = customCaption || 'The judge is watching through the bowl. Suspicious pause / rhythm jitter detected!';
        this.dom.judgeMemeCaption.innerHTML = `<strong>${title}</strong><span>${caption}</span>`;
      }
      this.updateJudgeVerdict('RHYTHM_JITTER', 'Jitter or hesitation spike detected • Cadence inconsistent');
    } else if (state === 'clock' || state === 'hurry') {
      this.dom.judgeMemeImg.src = 'assets/meme-clock.jpg';
      this.dom.judgeMemeImg.classList.add('clock-mode');
      if (this.dom.memeChamberStatus) {
        this.dom.memeChamberStatus.textContent = 'TICK TOCK ⌚';
        this.dom.memeChamberStatus.style.color = '#ef4444';
      }
      if (this.dom.judgeStatusLabel) {
        this.dom.judgeStatusLabel.textContent = 'HURRY UP ⌚';
        this.dom.judgeStatusLabel.style.color = '#ef4444';
      }
      if (this.dom.judgeMemeCaption) {
        const title = customTitle || 'Hurry Up Cat ⌚';
        const caption = customCaption || 'Tick tock! The judge is tapping the watch. Where did your typing speed go?!';
        this.dom.judgeMemeCaption.innerHTML = `<strong>${title}</strong><span>${caption}</span>`;
      }
      this.updateJudgeVerdict('TIME_CRITICAL', 'Cadence stalled or clock draining • Accelerate keystrokes!');
    } else if (state === 'sink' || state === 'chill') {
      this.dom.judgeMemeImg.src = 'assets/meme-sink.jpg';
      this.dom.judgeMemeImg.classList.add('sink-mode');
      if (this.dom.memeChamberStatus) {
        this.dom.memeChamberStatus.textContent = 'CHILL OBSERVING 🛁';
        this.dom.memeChamberStatus.style.color = '#06b6d4';
      }
      if (this.dom.judgeStatusLabel) {
        this.dom.judgeStatusLabel.textContent = 'CRUISING 🛁';
        this.dom.judgeStatusLabel.style.color = '#06b6d4';
      }
      if (this.dom.judgeMemeCaption) {
        const title = customTitle || 'Chill Sink Cat 🛁';
        const caption = customCaption || 'Lounging comfortably in the sink. Smooth, relaxed cruising cadence.';
        this.dom.judgeMemeCaption.innerHTML = `<strong>${title}</strong><span>${caption}</span>`;
      }
      this.updateJudgeVerdict('CRUISING_STEADY', 'Rhythm stable • Cruising in relaxed flow');
    } else if (state === 'standing' || state === 'ready') {
      this.dom.judgeMemeImg.src = 'assets/meme-standing.jpg';
      this.dom.judgeMemeImg.classList.add('standing-mode');
      if (this.dom.memeChamberStatus) {
        this.dom.memeChamberStatus.textContent = 'WAITING POLITELY 🥺';
        this.dom.memeChamberStatus.style.color = '#38bdf8';
      }
      if (this.dom.judgeStatusLabel) {
        this.dom.judgeStatusLabel.textContent = 'AWAITING KEYSTROKE 🐾';
        this.dom.judgeStatusLabel.style.color = '#38bdf8';
      }
      if (this.dom.judgeMemeCaption) {
        const title = customTitle || 'Standing Munchkin Kitten 🥺';
        const caption = customCaption || 'Standing politely waiting for your first keystroke. Begin whenever ready!';
        this.dom.judgeMemeCaption.innerHTML = `<strong>${title}</strong><span>${caption}</span>`;
      }
      this.updateJudgeVerdict('READY_WHEN_YOU_ARE', 'Awaiting first keystroke sequence...');
    } else {
      // Normal observing state
      this.dom.judgeMemeImg.src = 'assets/meme-sink.jpg';
      this.dom.judgeMemeImg.classList.add('sink-mode');
      if (this.dom.memeChamberStatus) {
        this.dom.memeChamberStatus.textContent = 'OBSERVING 🛁';
        this.dom.memeChamberStatus.style.color = 'var(--text-muted)';
      }
      if (this.dom.judgeStatusLabel) {
        this.dom.judgeStatusLabel.textContent = 'OBSERVING';
        this.dom.judgeStatusLabel.style.color = 'var(--accent-cyan)';
      }
      if (this.dom.judgeMemeCaption) {
        this.dom.judgeMemeCaption.innerHTML = `<strong>Chill Sink Cat</strong><span>Lounging in the sink observing your cadence</span>`;
      }
      this.updateJudgeVerdict('AWAITING_INPUT', 'Ready for keystroke sequence...');
    }
  }

  appendJudgeLog(msg) {
    // Telemetry stream removed as requested
  }

  updateJudgeVerdict(status, sub) {
    if (this.dom.judgeVerdictText) this.dom.judgeVerdictText.textContent = status;
    if (this.dom.judgeVerdictSub) this.dom.judgeVerdictSub.textContent = sub;
  }

  // --- Global Keyboard Interception ---
  handleGlobalKeyDown(e) {
    // If not in arena view, ignore typing except Enter in results
    if (this.currentView === 'results') {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.startArenaSession();
      }
      return;
    }

    if (this.currentView !== 'arena') {
      // In lobby, pressing Enter triggers start
      if (e.key === 'Enter' && e.target !== this.dom.customTextInput) {
        e.preventDefault();
        this.startArenaSession();
      }
      return;
    }

    // Ignore if typing inside custom text input
    if (e.target && e.target === this.dom.customTextInput) {
      return;
    }

    // Tab key = Instant test restart
    if (e.key === 'Tab') {
      e.preventDefault();
      this.restartTest();
      return;
    }

    // Process typing keystroke
    this.processKeystroke(e);
  }

  processKeystroke(e) {
    if (this.testFinished) return;

    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Escape', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key)) {
      return;
    }

    if (e.key === ' ' || e.key === 'Backspace') {
      e.preventDefault();
    }

    // First keypress clocks in
    if (!this.testActive) {
      this.startCountdown();
    }

    if (this.currentWordStartTime === null) {
      this.currentWordStartTime = performance.now();
      this.currentWordHadError = false;
    }

    if (window.soundEngine) {
      window.soundEngine.playKey(e.key);
    }

    const currentTargetWord = this.words[this.currentWordIdx] || '';
    let currentTyped = this.typedWords[this.currentWordIdx] || '';

    // A. Backspace Handling
    if (e.key === 'Backspace') {
      this.lastKeystrokeTime = Date.now();
      this.consecutiveBackspaces = (this.consecutiveBackspaces || 0) + 1;
      if (this.consecutiveBackspaces >= 3) {
        this.setJudgeMeme('mocking');
      } else if (this.consecutiveBackspaces === 2) {
        this.setJudgeMeme('facepalm');
      }

      if (currentTyped.length > 0) {
        currentTyped = currentTyped.slice(0, -1);
        this.typedWords[this.currentWordIdx] = currentTyped;
        this.renderWordCharacters(this.currentWordIdx);
        this.updateCaretPosition();
      } else if (this.currentWordIdx > 0) {
        this.currentWordIdx--;
        this.highlightActiveWord();
        this.updateCaretPosition();
      }
      return;
    }

    // B. Space Handling (Word completion)
    if (e.key === ' ') {
      this.lastKeystrokeTime = Date.now();
      this.consecutiveBackspaces = 0;
      if (currentTyped.length > 0) {
        // Space counts towards total keystrokes
        this.keystrokes.total++;
        this.stats.totalChars++;

        const wordDurationMs = Math.round(performance.now() - (this.currentWordStartTime || performance.now()));
        const isWordCorrect = (currentTyped === currentTargetWord);
        const hadError = this.currentWordHadError || !isWordCorrect;

        if (isWordCorrect) {
          this.keystrokes.correct++;
          this.stats.totalCorrect++;
          this.streak++;
          this.maxStreak = Math.max(this.maxStreak, this.streak);
          this.consecutiveErrors = 0;
        } else {
          this.keystrokes.errors++;
          this.streak = 0;
          this.consecutiveErrors++;
          this.missedWords.add(currentTargetWord);
        }

        // Record word-by-word telemetry
        this.recordWordTelemetry(currentTargetWord, wordDurationMs, hadError);

        this.currentWordIdx++;
        this.currentWordStartTime = performance.now();
        this.currentWordHadError = false;

        if (this.currentWordIdx >= this.words.length) {
          if (this.testType === 'words') {
            this.finishTest();
            return;
          } else {
            this.appendMoreWordsToArena();
          }
        } else if (this.testType === 'time' && (this.words.length - this.currentWordIdx < 35)) {
          this.appendMoreWordsToArena();
        }

        this.highlightActiveWord();
        this.updateCaretPosition();
        this.updateHud();
      }
      return;
    }

    // C. Normal Printable Character
    if (e.key.length === 1) {
      e.preventDefault();
      this.lastKeystrokeTime = Date.now();
      this.consecutiveBackspaces = 0;
      this.keystrokes.total++;
      this.stats.totalChars++;

      const expectedChar = currentTargetWord[currentTyped.length];

      if (e.key === expectedChar) {
        this.keystrokes.correct++;
        this.stats.totalCorrect++;
        this.streak++;
        this.maxStreak = Math.max(this.maxStreak, this.streak);
        this.consecutiveErrors = 0;

        // Spawn particles
        this.spawnKeyParticles();

        if (this.streak >= 35 && this.judgeMemeState !== 'thuglife') {
          this.setJudgeMeme('thuglife');
        } else if (this.streak >= 20 && this.judgeMemeState !== 'impressed') {
          this.setJudgeMeme('impressed');
        } else if (this.streak >= 12 && this.judgeMemeState !== 'buff' && this.judgeMemeState !== 'impressed' && this.judgeMemeState !== 'thuglife') {
          this.setJudgeMeme('buff');
        } else if (this.streak >= 6 && this.judgeMemeState !== 'good' && this.judgeMemeState !== 'buff' && this.judgeMemeState !== 'impressed' && this.judgeMemeState !== 'thuglife') {
          this.setJudgeMeme('good');
        } else {
          const negativeStates = ['worst', 'error', 'loading', 'disappointed', 'warning', 'mocking', 'facepalm', 'sideeye', 'clock'];
          if (negativeStates.includes(this.judgeMemeState) && this.streak >= 2) {
            this.setJudgeMeme('sink');
          } else if (this.judgeMemeState === 'normal' || this.judgeMemeState === 'standing') {
            this.setJudgeMeme('sink');
          }
        }
      } else {
        this.keystrokes.errors++;
        this.streak = 0;
        this.consecutiveErrors++;
        this.currentWordHadError = true;
        this.missedWords.add(currentTargetWord);
        if (window.soundEngine) window.soundEngine.playError();

        if (this.consecutiveErrors >= 3) {
          // 3 consecutive errors: Pointing & Laughing Cat roasts you!
          this.setJudgeMeme('mocking');
        } else if (this.consecutiveErrors === 2) {
          // 2 consecutive errors: Facepalm Cat!
          this.setJudgeMeme('facepalm');
        } else {
          // 1st error: Buffering Cat (Loading wheel on forehead)!
          this.setJudgeMeme('loading');
        }
      }

      currentTyped += e.key;
      this.typedWords[this.currentWordIdx] = currentTyped;

      this.renderWordCharacters(this.currentWordIdx);
      this.updateCaretPosition();
      this.updateHud();

      // Check if finished
      if (this.currentWordIdx === this.words.length - 1 && currentTyped === currentTargetWord) {
        const wordDurationMs = Math.round(performance.now() - (this.currentWordStartTime || performance.now()));
        this.recordWordTelemetry(currentTargetWord, wordDurationMs, this.currentWordHadError);
        if (this.testType === 'words') {
          this.finishTest();
        } else {
          this.appendMoreWordsToArena();
        }
      }
    }
  }

  // --- Arena Session Start ---
  startArenaSession(overrideText = null) {
    this.switchView('arena');

    if (overrideText) {
      this.fullText = overrideText;
      this.words = this.fullText.trim().split(/\s+/).filter(w => w.length > 0);
    } else if (this.testType === 'words') {
      // In Words mode: Exactly targetWordCount words
      const targetCount = Math.max(1, parseInt(this.targetWordCount, 10) || 25);
      if (this.genre === 'custom') {
        const val = this.dom.customTextInput ? this.dom.customTextInput.value.trim() : '';
        this.fullText = val.length > 5 ? val : getWordsCollection('quotes', this.difficulty, targetCount);
      } else {
        this.fullText = getWordsCollection(this.genre, this.difficulty, targetCount);
      }

      let allWords = this.fullText.trim().split(/\s+/).filter(w => w.length > 0);
      if (allWords.length > targetCount) {
        allWords = allWords.slice(0, targetCount);
      } else if (allWords.length < targetCount) {
        const needed = targetCount - allWords.length;
        const extraWords = getWordsCollection(this.genre, this.difficulty, needed).trim().split(/\s+/).filter(w => w.length > 0);
        allWords.push(...extraWords.slice(0, needed));
      }
      this.words = allWords;
      this.fullText = this.words.join(' ');
    } else {
      // In Timer mode: Limitless long paragraph (starts with generous buffer and streams continuously)
      const initialWordTarget = Math.max(250, Math.ceil(this.duration * 3.5));
      if (this.genre === 'custom') {
        const val = this.dom.customTextInput ? this.dom.customTextInput.value.trim() : '';
        this.fullText = val.length > 5 ? val : getRandomText('quotes', this.difficulty, initialWordTarget);
      } else {
        this.fullText = getRandomText(this.genre, this.difficulty, initialWordTarget);
      }
      this.words = this.fullText.trim().split(/\s+/).filter(w => w.length > 0);
    }

    this.typedWords = new Array(this.words.length).fill('');
    this.currentWordIdx = 0;
    this.currentWordStartTime = null;
    this.currentWordHadError = false;

    this.stopTest();
    this.timeLeft = this.testType === 'words' ? null : this.duration;
    this.startTime = null;
    this.timeElapsed = 0;
    this.keystrokes = { correct: 0, errors: 0, total: 0 };
    this.streak = 0;
    this.maxStreak = 0;
    this.consecutiveErrors = 0;
    this.samples = [];
    this.missedWords.clear();
    this.lastSampleSecond = -1;

    this.updateArenaModeBadge();
    this.setJudgeMeme('standing');

    this.buildWordsDom();
    this.updateHud();
    this.focusTypingInput();
  }

  restartTest() {
    this.startArenaSession();
  }

  practiceMissedWords() {
    if (this.missedWords.size === 0) {
      this.startArenaSession();
      return;
    }
    const missedList = Array.from(this.missedWords);
    let drillText = missedList.join(' ');
    while (drillText.split(' ').length < 25) {
      drillText += ' ' + missedList.join(' ');
    }
    this.startArenaSession(drillText);
  }

  stopTest() {
    this.testActive = false;
    this.testFinished = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (window.soundEngine) {
      window.soundEngine.stopBgm();
    }
  }

  focusTypingInput() {
    if (this.dom.hiddenInput) this.dom.hiddenInput.focus();
    if (this.dom.textDisplayCard) this.dom.textDisplayCard.focus();
  }

  // --- Words Rendering & Caret ---
  buildWordsDom() {
    const container = this.dom.wordsContainer;
    if (!container) return;
    container.innerHTML = '';

    this.words.forEach((wordStr, wIdx) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'word' + (wIdx === 0 ? ' current-word' : '');
      wordSpan.dataset.wordIndex = wIdx;

      for (let cIdx = 0; cIdx < wordStr.length; cIdx++) {
        const charSpan = document.createElement('span');
        charSpan.className = 'char char-pending';
        charSpan.dataset.charIndex = cIdx;
        charSpan.textContent = wordStr[cIdx];
        wordSpan.appendChild(charSpan);
      }

      container.appendChild(wordSpan);
    });

    this.caret = document.createElement('span');
    this.caret.className = 'cursor-caret';
    container.appendChild(this.caret);

    requestAnimationFrame(() => this.updateCaretPosition());
  }

  appendMoreWordsToArena() {
    if (this.testType !== 'time') return;
    try {
      const addonText = getRandomText(this.genre, this.difficulty, 60);
      const newWords = addonText.trim().split(/\s+/).filter(w => w.length > 0);
      if (!newWords.length) return;

      const container = this.dom.wordsContainer;
      if (!container) return;

      const startIdx = this.words.length;
      newWords.forEach((wordStr, offset) => {
        const wIdx = startIdx + offset;
        this.words.push(wordStr);
        this.typedWords.push('');

        const wordSpan = document.createElement('span');
        wordSpan.className = 'word';
        wordSpan.dataset.wordIndex = wIdx;

        for (let cIdx = 0; cIdx < wordStr.length; cIdx++) {
          const charSpan = document.createElement('span');
          charSpan.className = 'char char-pending';
          charSpan.dataset.charIndex = cIdx;
          charSpan.textContent = wordStr[cIdx];
          wordSpan.appendChild(charSpan);
        }

        if (this.caret && this.caret.parentNode === container) {
          container.insertBefore(wordSpan, this.caret);
        } else {
          container.appendChild(wordSpan);
        }
      });
    } catch (e) {
      console.warn('Could not append more words:', e);
    }
  }

  highlightActiveWord() {
    if (!this.dom.wordsContainer) return;
    const allWords = this.dom.wordsContainer.querySelectorAll('.word');
    allWords.forEach((w, idx) => {
      if (idx === this.currentWordIdx) {
        w.classList.add('current-word');
      } else {
        w.classList.remove('current-word');
      }
    });
  }

  renderWordCharacters(wIdx) {
    if (!this.dom.wordsContainer) return;
    const wordEl = this.dom.wordsContainer.querySelector(`[data-word-index="${wIdx}"]`);
    if (!wordEl) return;

    const targetWord = this.words[wIdx] || '';
    const typed = this.typedWords[wIdx] || '';

    wordEl.querySelectorAll('.char-extra').forEach(el => el.remove());
    const charEls = wordEl.querySelectorAll('.char:not(.char-extra)');

    for (let i = 0; i < targetWord.length; i++) {
      const charEl = charEls[i];
      if (!charEl) continue;

      if (i < typed.length) {
        if (typed[i] === targetWord[i]) {
          charEl.className = 'char char-correct';
        } else {
          charEl.className = 'char char-incorrect';
        }
      } else {
        charEl.className = 'char char-pending';
      }
    }

    if (typed.length > targetWord.length) {
      for (let i = targetWord.length; i < typed.length; i++) {
        const extraCharSpan = document.createElement('span');
        extraCharSpan.className = 'char char-extra char-incorrect';
        extraCharSpan.textContent = typed[i];
        wordEl.appendChild(extraCharSpan);
      }
    }
  }

  updateCaretPosition() {
    if (!this.caret || !this.dom.wordsContainer) return;
    const currentWordEl = this.dom.wordsContainer.querySelector(`[data-word-index="${this.currentWordIdx}"]`);
    if (!currentWordEl) return;

    const typed = this.typedWords[this.currentWordIdx] || '';
    const allCharEls = currentWordEl.querySelectorAll('.char');
    const parentRect = this.dom.wordsContainer.getBoundingClientRect();

    let targetLeft = 0;
    let targetTop = 0;
    let targetHeight = 28;

    if (typed.length < allCharEls.length) {
      const activeChar = allCharEls[typed.length];
      const charRect = activeChar.getBoundingClientRect();
      targetLeft = charRect.left - parentRect.left;
      targetTop = charRect.top - parentRect.top;
      targetHeight = Math.max(22, charRect.height);
    } else if (allCharEls.length > 0) {
      const lastChar = allCharEls[allCharEls.length - 1];
      const charRect = lastChar.getBoundingClientRect();
      targetLeft = charRect.right - parentRect.left;
      targetTop = charRect.top - parentRect.top;
      targetHeight = Math.max(22, charRect.height);
    } else {
      const wordRect = currentWordEl.getBoundingClientRect();
      targetLeft = wordRect.left - parentRect.left;
      targetTop = wordRect.top - parentRect.top;
    }

    this.caret.style.left = `${targetLeft}px`;
    this.caret.style.top = `${targetTop}px`;
    this.caret.style.height = `${targetHeight}px`;

    // Smooth auto-scroll
    const card = this.dom.textDisplayCard;
    if (card) {
      const cardRect = card.getBoundingClientRect();
      const wordRect = currentWordEl.getBoundingClientRect();

      if (wordRect.bottom > cardRect.bottom - 30) {
        card.scrollTop += 40;
      } else if (wordRect.top < cardRect.top + 30) {
        card.scrollTop = Math.max(0, card.scrollTop - 40);
      }
    }
  }

  // --- Countdown & Cumulative Practice Timer ---
  startCountdown() {
    this.testActive = true;
    this.startTime = Date.now();
    this.timeElapsed = 0;
    this.lastSampleSecond = 0;
    this.samples = [{ second: 0, wpm: 0 }];

    if (window.soundEngine) {
      window.soundEngine.startBgm();
    }

    if (this.dom.judgeStatusLabel) this.dom.judgeStatusLabel.textContent = 'ACTIVE_INSPECTION';
    this.appendJudgeLog(`[SESSION_START] Payload clock initiated.`);

    this.timer = setInterval(() => {
      this.timeElapsed = Math.floor((Date.now() - this.startTime) / 1000);
      if (this.testType === 'time') {
        this.timeLeft = Math.max(0, this.duration - this.timeElapsed);
      } else {
        this.timeLeft = null;
      }

      if (this.timeElapsed > this.lastSampleSecond) {
        this.lastSampleSecond = this.timeElapsed;
        this.stats.totalPracticeSeconds++;
        this.updateStatsUI();

        const liveWpm = this.calculateLiveWpm();
        this.samples.push({
          second: this.timeElapsed,
          wpm: liveWpm
        });

        if (this.timeElapsed % 5 === 0) {
          const progressLabel = this.testType === 'words' ? `Words: ${this.currentWordIdx}/${this.targetWordCount}` : `Time: ${this.timeLeft}s`;
          this.appendJudgeLog(`[TELEMETRY] Velocity: ${liveWpm} WPM | ${progressLabel}.`);
        }

        // Sluggish pace detection during typing (disappointed meme)
        if (this.timeElapsed >= 15 && liveWpm < 25 && this.judgeMemeState === 'normal') {
          this.setJudgeMeme('disappointed', 'Disappointed Drenched Cat', `Sluggish pace detected (${liveWpm} WPM) • Velocity underwhelming`);
        }

        // Impressive pace detection during typing (impressed meme)
        if (this.timeElapsed >= 8 && liveWpm >= 75 && this.streak >= 12 && this.judgeMemeState !== 'impressed') {
          this.setJudgeMeme('impressed', 'Jaw-Dropped Cat • Impressive!', `Godlike cadence detected (${liveWpm} WPM)! The judge is stunned 🙀`);
        }
      }

      // Real-time idle, clock ticking, and hesitation checks
      if (this.testActive) {
        const timeSinceLastKey = Date.now() - (this.lastKeystrokeTime || this.startTime || Date.now());
        if (this.testType === 'time' && this.timeLeft !== null && this.timeLeft <= 5 && this.timeLeft > 0 && this.judgeMemeState !== 'clock') {
          this.setJudgeMeme('clock', 'Hurry Up Cat ⌚', 'Final 5 seconds! Sprint to the finish line!');
        } else if (this.testType === 'words' && (this.words.length - this.currentWordIdx <= 2) && (this.words.length - this.currentWordIdx > 0) && this.judgeMemeState === 'normal') {
          this.setJudgeMeme('impressed', 'Home Stretch! 🐾', 'Final words remaining! Sprint to the finish line!');
        } else if (timeSinceLastKey >= 2500 && this.judgeMemeState !== 'clock') {
          this.setJudgeMeme('clock', 'Hurry Up Cat ⌚', 'Tick tock! The judge is tapping the watch. Where did you go?!');
        } else if (timeSinceLastKey >= 1500 && timeSinceLastKey < 2500 && this.judgeMemeState !== 'loading' && this.judgeMemeState !== 'clock') {
          this.setJudgeMeme('loading', 'Buffering Cat • 404 Brain 🔄', 'Suspicious pause detected! Brain buffering the next word...');
        }
      }

      this.updateHud();

      if (this.testType === 'time' && this.timeLeft !== null && this.timeLeft <= 0) {
        this.finishTest();
      }
    }, 250);
  }

  calculateLiveWpm() {
    const elapsedMs = Math.max(500, Date.now() - (this.startTime || (Date.now() - 500)));
    const elapsedMinutes = elapsedMs / 60000;
    const standardWords = this.keystrokes.correct / 5;
    return Math.max(0, Math.round(standardWords / elapsedMinutes));
  }

  calculateAccuracy() {
    if (this.keystrokes.total === 0) return 100;
    return Math.max(0, Math.min(100, Math.round((this.keystrokes.correct / this.keystrokes.total) * 100)));
  }

  updateHud() {
    if (this.testType === 'words') {
      if (this.dom.hudTimerLabel) this.dom.hudTimerLabel.textContent = 'WORDS TYPED';
      const wordsCompleted = Math.min(this.targetWordCount, this.currentWordIdx);
      if (this.dom.hudTimer) this.dom.hudTimer.textContent = `${wordsCompleted} / ${this.targetWordCount}`;
      const wordsLeft = Math.max(0, this.targetWordCount - this.currentWordIdx);
      if (this.dom.hudTimerSub) this.dom.hudTimerSub.textContent = wordsLeft > 0 ? `${wordsLeft} words left` : 'Completed!';

      const pct = Math.min(100, Math.round((wordsCompleted / Math.max(1, this.targetWordCount)) * 100));
      if (this.dom.hudTimerBar) this.dom.hudTimerBar.style.width = `${pct}%`;
    } else {
      if (this.dom.hudTimerLabel) this.dom.hudTimerLabel.textContent = 'TIME REMAINING';
      const mins = Math.floor((this.timeLeft || 0) / 60);
      const secs = (this.timeLeft || 0) % 60;
      if (this.dom.hudTimer) this.dom.hudTimer.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

      const pct = ((this.timeLeft || 0) / this.duration) * 100;
      if (this.dom.hudTimerBar) this.dom.hudTimerBar.style.width = `${pct}%`;
      if (this.dom.hudTimerSub) this.dom.hudTimerSub.textContent = `${this.duration}s test • Limitless words`;
    }

    const liveWpm = this.calculateLiveWpm();
    if (this.dom.hudWpm) this.dom.hudWpm.textContent = liveWpm;
    if (this.dom.hudAccuracy) this.dom.hudAccuracy.textContent = `${this.calculateAccuracy()}%`;
    if (this.dom.hudKeystrokes) this.dom.hudKeystrokes.textContent = `${this.keystrokes.total} chars`;

    if (this.dom.hudStreak) this.dom.hudStreak.textContent = `${this.streak} 🔥`;
    const multiplier = this.streak >= 40 ? 'x4' : this.streak >= 25 ? 'x3' : this.streak >= 10 ? 'x2' : 'x1';
    if (this.dom.hudStreakBonus) this.dom.hudStreakBonus.textContent = `${multiplier} Multiplier`;

    if (this.dom.correctCharsCount) this.dom.correctCharsCount.textContent = this.keystrokes.correct;
    if (this.dom.errorCharsCount) this.dom.errorCharsCount.textContent = this.keystrokes.errors;
  }

  // --- Test Finish & Performance Results ---
  finishTest() {
    this.stopTest();
    this.testFinished = true;

    // High-precision timing calculation
    const now = Date.now();
    const elapsedMs = Math.max(500, now - (this.startTime || (now - 1000)));
    let exactDurationSeconds = elapsedMs / 1000;

    // In time mode, if stopped because time expired, use official duration
    if (this.testType === 'time' && this.timeLeft !== null && this.timeLeft <= 0) {
      exactDurationSeconds = this.duration;
    }

    const actualDurationSeconds = Math.max(1, Math.round(exactDurationSeconds));
    const actualMinutes = exactDurationSeconds / 60;

    // Standard Typing Metric: 5 correct keystrokes = 1 standard word
    const standardWords = this.keystrokes.correct / 5;
    const finalWpm = Math.max(0, Math.round(standardWords / actualMinutes));

    // Raw WPM: 5 total keystrokes = 1 standard word
    const rawWpm = Math.max(0, Math.round((this.keystrokes.total / 5) / actualMinutes));
    const accuracy = this.calculateAccuracy();

    // Actual completed dictionary words count for records
    const wordsTypedCount = this.testType === 'words' ? this.targetWordCount : Math.max(1, this.currentWordIdx);

    if (window.soundEngine) {
      window.soundEngine.playVictoryFanfare();
    }

    // Cumulative stats
    this.stats.testsCount++;
    const oldPb = this.stats.highestRecord || 0;
    const isNewRecord = finalWpm > oldPb;
    if (isNewRecord) {
      this.stats.highestRecord = finalWpm;
    }
    this.savePersistentStats();

    // Persist full telemetry record (Local Storage + Supabase Cloud)
    const recordPayload = {
      test_type: this.testType,
      target_value: this.testType === 'words' ? this.targetWordCount : this.duration,
      words_typed: wordsTypedCount,
      wpm: finalWpm,
      raw_wpm: rawWpm,
      accuracy: accuracy,
      duration_seconds: actualDurationSeconds,
      mode: this.genre,
      difficulty: this.difficulty,
      errors_count: this.keystrokes.errors,
      total_chars: this.keystrokes.total,
      correct_chars: this.keystrokes.correct,
      is_new_record: isNewRecord
    };
    this.saveTestRecord(recordPayload);

    // Judge Verdict Output & Meme Reaction
    const isLowAccuracy = accuracy < 85;
    const isDisappointing = !isLowAccuracy && (finalWpm < 30 || this.keystrokes.total < 15);
    const isFlawless = !isLowAccuracy && !isDisappointing && accuracy === 100 && finalWpm >= 40 && this.keystrokes.total >= 25;
    const isImpressive = !isLowAccuracy && !isDisappointing && !isFlawless && (finalWpm >= 70 || (isNewRecord && finalWpm >= 50));

    // Results View Hero Meme:
    if (this.dom.resultsCatImg) {
      if (isLowAccuracy) {
        this.dom.resultsCatImg.src = 'assets/meme-facepalm.jpg';
        if (this.dom.resultsMemeBadge) {
          this.dom.resultsMemeBadge.textContent = '🤦 ACCURACY < 85% • FACEPALM';
          this.dom.resultsMemeBadge.style.background = 'linear-gradient(135deg, #f97316, #ea580c)';
          this.dom.resultsMemeBadge.style.color = '#ffffff';
        }
      } else if (this.keystrokes.errors >= 4 || (this.consecutiveBackspaces && this.consecutiveBackspaces >= 3)) {
        this.dom.resultsCatImg.src = 'assets/meme-mocking.jpg';
        if (this.dom.resultsMemeBadge) {
          this.dom.resultsMemeBadge.textContent = '🫵😂 ROASTED BY JUDGE';
          this.dom.resultsMemeBadge.style.background = 'linear-gradient(135deg, #ef4444, #b91c1c)';
          this.dom.resultsMemeBadge.style.color = '#ffffff';
        }
      } else if (isDisappointing) {
        this.dom.resultsCatImg.src = 'assets/meme-disappointed.jpg';
        if (this.dom.resultsMemeBadge) {
          this.dom.resultsMemeBadge.textContent = '🌧️ DISAPPOINTING RUN';
          this.dom.resultsMemeBadge.style.background = 'linear-gradient(135deg, #64748b, #334155)';
          this.dom.resultsMemeBadge.style.color = '#f8fafc';
        }
      } else if (isFlawless) {
        this.dom.resultsCatImg.src = 'assets/meme-thuglife.jpg';
        if (this.dom.resultsMemeBadge) {
          this.dom.resultsMemeBadge.textContent = '😎 100% ACCURACY • THUG LIFE';
          this.dom.resultsMemeBadge.style.background = 'linear-gradient(135deg, #e2b714, #f59e0b)';
          this.dom.resultsMemeBadge.style.color = '#0e1117';
        }
      } else if (isImpressive) {
        this.dom.resultsCatImg.src = 'assets/meme-impressed.jpg';
        if (this.dom.resultsMemeBadge) {
          this.dom.resultsMemeBadge.textContent = isNewRecord ? '🏆 NEW RECORD 🙀' : '🙀 IMPRESSIVE RUN';
          this.dom.resultsMemeBadge.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
          this.dom.resultsMemeBadge.style.color = '#0e1117';
        }
      } else {
        this.dom.resultsCatImg.src = 'assets/meme-sink.jpg';
        if (this.dom.resultsMemeBadge) {
          this.dom.resultsMemeBadge.textContent = '🛁 CHILL CRUISING RUN';
          this.dom.resultsMemeBadge.style.background = '#1a1f2c';
          this.dom.resultsMemeBadge.style.color = '#06b6d4';
        }
      }
    }

    if (isLowAccuracy) {
      // Show Facepalm Cat in terminal after test when user accuracy is less than 85%!
      this.setJudgeMeme('facepalm', 'Facepalm Cat • Accuracy < 85%', `The judge has a headache from those typos! Accuracy was ${accuracy}%.`);
      if (this.dom.resultsBadge) this.dom.resultsBadge.textContent = '🤦 LOW ACCURACY';
      if (this.dom.resultsTitle) this.dom.resultsTitle.textContent = 'Facepalm Moment!';
      if (this.dom.resultsSubtitle) this.dom.resultsSubtitle.textContent = `Accuracy dropped to ${accuracy}%. Slow down slightly and focus on accuracy next time!`;
      if (this.dom.finalRankBadge) this.dom.finalRankBadge.textContent = 'Careless Typist 🐾';
    } else if (this.keystrokes.errors >= 4 || (this.consecutiveBackspaces && this.consecutiveBackspaces >= 3)) {
      this.setJudgeMeme('mocking', 'Roasting Cat 🫵😂', 'The judge is pointing and laughing at those backspaces and typos!');
      if (this.dom.resultsBadge) this.dom.resultsBadge.textContent = '🫵😂 ROASTED BY JUDGE';
      if (this.dom.resultsTitle) this.dom.resultsTitle.textContent = 'Backspace Smashing!';
      if (this.dom.resultsSubtitle) this.dom.resultsSubtitle.textContent = `The judge noticed frequent typos and backspacing. Focus on clean key strikes next time!`;
      if (this.dom.finalRankBadge) this.dom.finalRankBadge.textContent = 'Keyboard Masher 💥';
    } else if (isDisappointing) {
      // Show Disappointed Drenched Cat when user performance is disappointing!
      this.setJudgeMeme('disappointed', 'Disappointed Drenched Cat', `Velocity only ${finalWpm} WPM. The judge stands under the shower pondering your sluggish pace...`);
      if (this.dom.resultsBadge) this.dom.resultsBadge.textContent = '🌧️ UNDERWHELMING SPEED';
      if (this.dom.resultsTitle) this.dom.resultsTitle.textContent = 'The Judge is Disappointed!';
      if (this.dom.resultsSubtitle) this.dom.resultsSubtitle.textContent = `Speed reached only ${finalWpm} WPM. Even under the shower, the cat expected higher velocity!`;
      if (this.dom.finalRankBadge) this.dom.finalRankBadge.textContent = 'Sluggish Snail 🐌';
    } else if (isFlawless) {
      // Show Thug Life Cat on 100% flawless accuracy run!
      this.setJudgeMeme('thuglife', 'Thug Life Cat • 100% Accuracy', 'Flawless 100% precision run with zero typos. Absolute cyber mastery! Deal with it 😎');
      if (this.dom.resultsBadge) this.dom.resultsBadge.textContent = '😎 100% FLAWLESS!';
      if (this.dom.resultsTitle) this.dom.resultsTitle.textContent = 'Flawless Cyber Master!';
      if (this.dom.resultsSubtitle) this.dom.resultsSubtitle.textContent = `100% precision with ${finalWpm} WPM velocity. True cyber mastery • Deal with it.`;
      if (this.dom.finalRankBadge) this.dom.finalRankBadge.textContent = 'Cyber Chad 🕶️';
    } else if (isImpressive) {
      // Show Jaw-Dropped Impressed Cat when user performance is impressive!
      this.setJudgeMeme('impressed', 'Jaw-Dropped Cat • Impressive!', isNewRecord ? `UNBELIEVABLE! New Personal Best of ${finalWpm} WPM! The judge is stunned 🙀` : `Jaw dropped at ${finalWpm} WPM with ${accuracy}% precision! Incredible performance!`);
      if (this.dom.resultsBadge) this.dom.resultsBadge.textContent = isNewRecord ? '🏆 NEW RECORD!' : '⚡ IMPRESSIVE RUN!';
      if (this.dom.resultsTitle) this.dom.resultsTitle.textContent = isNewRecord ? 'Unbelievable New Record!' : 'The Judge is Stunned!';
      if (this.dom.resultsSubtitle) this.dom.resultsSubtitle.textContent = `Mind-blowing speed of ${finalWpm} WPM with ${accuracy}% accuracy! The cat is in utter disbelief!`;

      let rankTitle = 'Speed Demon 🎧';
      if (finalWpm >= 110) rankTitle = 'Godlike Overclock ⚡';
      else if (finalWpm >= 90) rankTitle = 'Jaw-Dropping Prodigy 👑';
      else if (finalWpm >= 70) rankTitle = 'Velocity Phantom 🔥';
      else if (finalWpm >= 50) rankTitle = 'Cyber Panther 🐾';
      if (this.dom.finalRankBadge) this.dom.finalRankBadge.textContent = rankTitle;
    } else {
      // Test finished cleanly: Chill Sink Cat!
      this.setJudgeMeme('sink', 'Chill Sink Cat 🛁', 'Purr-fect run completed! Lounging in the sink approving your flow.');
      if (this.dom.resultsBadge) this.dom.resultsBadge.textContent = '🎉 TEST COMPLETE!';
      if (this.dom.resultsTitle) this.dom.resultsTitle.textContent = 'Outstanding Performance!';
      if (this.dom.resultsSubtitle) this.dom.resultsSubtitle.textContent = `Cruising with ${finalWpm} WPM and ${accuracy}% precision. The sink cat approves!`;
      if (this.dom.finalRankBadge) this.dom.finalRankBadge.textContent = 'Chill Cruising Typist 🛁';
    }

    // Populate Results View Elements
    if (this.dom.finalWpmValue) this.dom.finalWpmValue.textContent = finalWpm;
    if (this.dom.avgWpmValue) this.dom.avgWpmValue.textContent = finalWpm;
    if (this.dom.rawWpmValue) this.dom.rawWpmValue.textContent = `Raw: ${rawWpm} WPM`;
    if (this.dom.finalAccValue) this.dom.finalAccValue.textContent = `${accuracy}%`;
    if (this.dom.accDetail) this.dom.accDetail.textContent = `${this.keystrokes.errors} errors / ${this.keystrokes.total} chars`;

    if (this.dom.personalBestValue) this.dom.personalBestValue.textContent = this.stats.highestRecord;
    if (this.dom.pbStatus) this.dom.pbStatus.textContent = isNewRecord ? '🏆 NEW RECORD!' : `Record: ${oldPb} WPM`;

    // Switch to Results View & render chart
    this.switchView('results');
    this.renderWpmChart(finalWpm, actualDurationSeconds);
  }

  // --- Spline Chart on Results Canvas ---
  renderWpmChart(finalWpm, durationSeconds = null) {
    if (!this.dom.wpmChartCanvas || !this.dom.wpmChartCanvas.getContext) return;
    const canvas = this.dom.wpmChartCanvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    const totalSec = durationSeconds || (this.testType === 'words' ? Math.max(1, this.timeElapsed || 1) : this.duration);

    if (this.samples.length < 2) {
      this.samples = [
        { second: 0, wpm: 0 },
        { second: Math.round(totalSec / 2), wpm: Math.round(finalWpm * 0.95) },
        { second: totalSec, wpm: finalWpm }
      ];
    }

    const padding = { top: 20, right: 30, bottom: 30, left: 45 };
    const chartW = W - padding.left - padding.right;
    const chartH = H - padding.top - padding.bottom;

    const maxWpm = Math.max(80, Math.ceil((Math.max(...this.samples.map(s => s.wpm), finalWpm) + 15) / 20) * 20);
    const maxSec = Math.max(1, totalSec);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748b';
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';

    for (let i = 0; i <= 4; i++) {
      const val = Math.round((maxWpm / 4) * i);
      const y = padding.top + chartH - (val / maxWpm) * chartH;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(W - padding.right, y);
      ctx.stroke();
      ctx.fillText(`${val}`, padding.left - 8, y + 4);
    }

    const points = this.samples.map(s => ({
      x: padding.left + (Math.min(s.second, maxSec) / maxSec) * chartW,
      y: padding.top + chartH - (s.wpm / maxWpm) * chartH
    }));

    if (points.length > 0) {
      // Shaded Area
      const grad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
      grad.addColorStop(0, 'rgba(226, 183, 20, 0.2)');
      grad.addColorStop(1, 'rgba(226, 183, 20, 0.0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(points[0].x, padding.top + chartH);
      points.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(points[points.length - 1].x, padding.top + chartH);
      ctx.closePath();
      ctx.fill();

      // Line
      ctx.strokeStyle = '#e2b714';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      points.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.stroke();
    }

    // X Axis Labels
    ctx.textAlign = 'center';
    ctx.fillStyle = '#64748b';
    const xInterval = totalSec <= 15 ? 3 : totalSec <= 30 ? 5 : totalSec <= 60 ? 10 : 20;
    for (let sec = 0; sec <= totalSec; sec += xInterval) {
      const x = padding.left + (sec / maxSec) * chartW;
      ctx.fillText(`${sec}s`, x, H - 8);
    }
  }

  // --- Micro-Particles FX Canvas ---
  initFxCanvas() {
    if (!this.dom.fxCanvas || !this.dom.fxCanvas.getContext) return;
    this.particles = [];
    const canvas = this.dom.fxCanvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.size *= 0.96;

        if (p.alpha <= 0 || p.size <= 0.2) {
          this.particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color.replace('ALPHA', p.alpha.toFixed(2));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  spawnKeyParticles() {
    if (!this.particles || !this.caret || !this.dom.fxCanvas || !this.caret.getBoundingClientRect) return;
    const rect = this.caret.getBoundingClientRect();
    const colors = [
      'rgba(226, 183, 20, ALPHA)',
      'rgba(148, 163, 184, ALPHA)',
      'rgba(203, 213, 225, ALPHA)'
    ];

    for (let i = 0; i < 2; i++) {
      const angle = (Math.random() * Math.PI) - Math.PI / 2;
      const speed = 1.0 + Math.random() * 1.5;
      this.particles.push({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
        vy: -Math.abs(Math.sin(angle) * speed) - 0.3,
        size: 1.5 + Math.random() * 1.5,
        alpha: 0.7,
        decay: 0.04 + Math.random() * 0.03,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  // ========================================================================
  // COMPREHENSIVE ANALYTICS, BENCHMARKS & WORD MASTERY CONTROLLER
  // ========================================================================

  async getLatestRecords() {
    let records = [];
    if (window.supabaseService && window.supabaseService.user) {
      try {
        records = await window.supabaseService.fetchUserRecords(200);
      } catch (e) {
        console.warn('Fallback to local storage records for analytics:', e);
        records = JSON.parse(localStorage.getItem('meow_typing_records') || '[]');
      }
    } else {
      records = JSON.parse(localStorage.getItem('meow_typing_records') || '[]');
    }
    return records || [];
  }

  formatDateStr(dateStr) {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '-';
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return '-';
    }
  }

  formatTimeStr(dateStr) {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  }

  async renderAnalyticsDashboard() {
    const records = await this.getLatestRecords();
    this.cachedAnalyticsRecords = records;

    // 1. Calculate Comprehensive Career KPIs
    const totalTests = records.length;
    let timeTestsCount = 0;
    let wordTestsCount = 0;
    let highestWpm = 0;
    let highestRecordRef = null;
    let totalWpmSum = 0;
    let totalRawSum = 0;
    let totalWords = 0;
    let totalChars = 0;
    let totalCorrect = 0;
    let totalErrors = 0;
    let totalSeconds = 0;

    records.forEach(r => {
      const isWords = r.test_type === 'words';
      if (isWords) wordTestsCount++;
      else timeTestsCount++;

      const wpm = r.wpm || 0;
      if (wpm >= highestWpm) {
        highestWpm = wpm;
        highestRecordRef = r;
      }
      totalWpmSum += wpm;
      totalRawSum += (r.raw_wpm || r.rawWpm || wpm);

      const wordsTyped = r.words_typed || (isWords ? (r.target_value || 25) : Math.round((r.correct_chars || 0) / 5));
      totalWords += wordsTyped;
      totalChars += (r.total_chars || 0);
      totalCorrect += (r.correct_chars || 0);
      totalErrors += (r.errors_count || 0);
      totalSeconds += (r.duration_seconds || 60);
    });

    const avgWpm = totalTests > 0 ? Math.round(totalWpmSum / totalTests) : 0;
    const avgRawWpm = totalTests > 0 ? Math.round(totalRawSum / totalTests) : 0;
    const globalAcc = totalChars > 0 ? Math.round((totalCorrect / totalChars) * 100) : 100;
    const totalPracticeMins = Math.floor(totalSeconds / 60);
    const totalPracticeSecs = totalSeconds % 60;

    // Populate KPI Elements
    if (this.dom.akTotalTests) this.dom.akTotalTests.textContent = totalTests;
    if (this.dom.akTestsSplit) this.dom.akTestsSplit.textContent = `${timeTestsCount} Time • ${wordTestsCount} Words`;

    if (this.dom.akBestWpm) this.dom.akBestWpm.textContent = `${Math.max(highestWpm, this.stats.highestRecord || 0)} WPM`;
    if (this.dom.akBestDetail) {
      if (highestRecordRef) {
        const modeLabel = highestRecordRef.test_type === 'words' ? `${highestRecordRef.target_value || 25} Words` : `${highestRecordRef.duration_seconds || 60}s Time`;
        this.dom.akBestDetail.textContent = `${modeLabel} • ${this.formatDateStr(highestRecordRef.created_at)}`;
      } else {
        this.dom.akBestDetail.textContent = 'All-Time Record';
      }
    }

    if (this.dom.akAvgWpm) this.dom.akAvgWpm.textContent = `${avgWpm} WPM`;
    if (this.dom.akAvgRaw) this.dom.akAvgRaw.textContent = `Raw Avg: ${avgRawWpm} WPM`;

    if (this.dom.akTotalWords) this.dom.akTotalWords.textContent = totalWords.toLocaleString();
    if (this.dom.akTotalChars) this.dom.akTotalChars.textContent = `${totalChars.toLocaleString()} keystrokes`;

    if (this.dom.akTotalTime) this.dom.akTotalTime.textContent = `${totalPracticeMins}m ${totalPracticeSecs}s`;

    if (this.dom.akGlobalAccuracy) this.dom.akGlobalAccuracy.textContent = `${globalAcc}%`;
    if (this.dom.akAccuracyErrors) this.dom.akAccuracyErrors.textContent = `${totalErrors} total typos logged`;

    // 2. Render Dual Benchmark Tables
    this.renderTimeBenchmarks(records);
    this.renderWordBenchmarks(records);

    // 3. Render Word-by-Word Mastery Matrix
    this.renderWordMasteryTable();

    // 4. Render Complete Test History Log
    this.renderHistoryLog(records);
  }

  // --- Render Time Benchmarks Table ---
  renderTimeBenchmarks(records = null) {
    if (!this.dom.timeBenchmarkTbody) return;
    records = records || this.cachedAnalyticsRecords || [];
    this.dom.timeBenchmarkTbody.innerHTML = '';

    const timeTargets = [
      { label: '15 Seconds', match: (r) => (r.test_type === 'time' || !r.test_type) && (r.duration_seconds === 15 || r.target_value === 15) },
      { label: '30 Seconds', match: (r) => (r.test_type === 'time' || !r.test_type) && (r.duration_seconds === 30 || r.target_value === 30) },
      { label: '60 Seconds', match: (r) => (r.test_type === 'time' || !r.test_type) && (r.duration_seconds === 60 || r.target_value === 60 || (!r.duration_seconds && !r.test_type)) },
      { label: '120 Seconds', match: (r) => (r.test_type === 'time' || !r.test_type) && (r.duration_seconds === 120 || r.target_value === 120) },
      { label: 'Custom Time', match: (r) => (r.test_type === 'time') && ![15, 30, 60, 120].includes(r.duration_seconds) && ![15, 30, 60, 120].includes(r.target_value) }
    ];

    timeTargets.forEach(tgt => {
      const matching = records.filter(tgt.match);
      const count = matching.length;
      let bestWpm = '-';
      let avgWpm = '-';
      let avgAcc = '-';
      let bestDate = '-';

      if (count > 0) {
        let maxW = 0;
        let maxRef = null;
        let sumW = 0;
        let sumA = 0;

        matching.forEach(r => {
          const w = r.wpm || 0;
          if (w >= maxW) {
            maxW = w;
            maxRef = r;
          }
          sumW += w;
          sumA += (r.accuracy || 100);
        });

        bestWpm = `${maxW} WPM`;
        avgWpm = `${Math.round(sumW / count)} WPM`;
        avgAcc = `${Math.round(sumA / count)}%`;
        bestDate = maxRef ? this.formatDateStr(maxRef.created_at) : '-';
      }

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="font-bold text-main">${escapeHtml(tgt.label)}</td>
        <td><span class="benchmark-cell">${escapeHtml(count)}</span></td>
        <td><span class="benchmark-cell highlight">${escapeHtml(bestWpm)}</span></td>
        <td><span class="benchmark-cell">${escapeHtml(avgWpm)}</span></td>
        <td><span class="benchmark-cell">${escapeHtml(avgAcc)}</span></td>
        <td class="benchmark-date">${escapeHtml(bestDate)}</td>
      `;
      this.dom.timeBenchmarkTbody.appendChild(tr);
    });
  }

  // --- Render Words Benchmarks Table ---
  renderWordBenchmarks(records = null) {
    if (!this.dom.wordsBenchmarkTbody) return;
    records = records || this.cachedAnalyticsRecords || [];
    this.dom.wordsBenchmarkTbody.innerHTML = '';

    const wordTargets = [
      { label: '10 Words', match: (r) => r.test_type === 'words' && (r.target_value === 10 || r.words_typed === 10) },
      { label: '25 Words', match: (r) => r.test_type === 'words' && (r.target_value === 25 || r.words_typed === 25) },
      { label: '50 Words', match: (r) => r.test_type === 'words' && (r.target_value === 50 || r.words_typed === 50) },
      { label: '100 Words', match: (r) => r.test_type === 'words' && (r.target_value === 100 || r.words_typed === 100) },
      { label: 'Custom Words', match: (r) => r.test_type === 'words' && ![10, 25, 50, 100].includes(r.target_value) && ![10, 25, 50, 100].includes(r.words_typed) }
    ];

    wordTargets.forEach(tgt => {
      const matching = records.filter(tgt.match);
      const count = matching.length;
      let bestWpm = '-';
      let avgWpm = '-';
      let avgAcc = '-';
      let bestDate = '-';

      if (count > 0) {
        let maxW = 0;
        let maxRef = null;
        let sumW = 0;
        let sumA = 0;

        matching.forEach(r => {
          const w = r.wpm || 0;
          if (w >= maxW) {
            maxW = w;
            maxRef = r;
          }
          sumW += w;
          sumA += (r.accuracy || 100);
        });

        bestWpm = `${maxW} WPM`;
        avgWpm = `${Math.round(sumW / count)} WPM`;
        avgAcc = `${Math.round(sumA / count)}%`;
        bestDate = maxRef ? this.formatDateStr(maxRef.created_at) : '-';
      }

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="font-bold text-main">${escapeHtml(tgt.label)}</td>
        <td><span class="benchmark-cell">${escapeHtml(count)}</span></td>
        <td><span class="benchmark-cell highlight">${escapeHtml(bestWpm)}</span></td>
        <td><span class="benchmark-cell">${escapeHtml(avgWpm)}</span></td>
        <td><span class="benchmark-cell">${escapeHtml(avgAcc)}</span></td>
        <td class="benchmark-date">${escapeHtml(bestDate)}</td>
      `;
      this.dom.wordsBenchmarkTbody.appendChild(tr);
    });
  }

  // --- Render Word-by-Word Mastery & Performance Matrix ---
  renderWordMasteryTable() {
    if (!this.dom.wordMasteryTbody) return;
    this.dom.wordMasteryTbody.innerHTML = '';

    const wordList = Object.values(this.wordPerformanceStats || {});

    // Compute category counts
    const counts = { all: wordList.length, mastered: 0, proficient: 0, weak: 0 };
    wordList.forEach(w => {
      const acc = w.timesTyped > 0 ? Math.max(0, Math.round(((w.timesTyped - (w.errorsCount || 0)) / w.timesTyped) * 100)) : 100;
      if (w.bestWpm >= 70 && (!w.errorsCount || w.errorsCount === 0)) {
        w.status = 'mastered';
        counts.mastered++;
      } else if (w.bestWpm >= 40 && acc >= 85) {
        w.status = 'proficient';
        counts.proficient++;
      } else {
        w.status = 'weak';
        counts.weak++;
      }
      w.accuracy = acc;
    });

    if (this.dom.wmCountAll) this.dom.wmCountAll.textContent = counts.all;
    if (this.dom.wmCountMastered) this.dom.wmCountMastered.textContent = counts.mastered;
    if (this.dom.wmCountProficient) this.dom.wmCountProficient.textContent = counts.proficient;
    if (this.dom.wmCountWeak) this.dom.wmCountWeak.textContent = counts.weak;

    // Filter words
    let filtered = wordList.filter(w => {
      if (this.analyticsWordFilter !== 'all' && w.status !== this.analyticsWordFilter) return false;
      if (this.analyticsWordSearch && !w.word.toLowerCase().includes(this.analyticsWordSearch)) return false;
      return true;
    });

    // Flexible Sort (supports both naming patterns)
    filtered.sort((a, b) => {
      if (this.analyticsWordSort === 'bestWpm' || this.analyticsWordSort === 'bestWpmDesc') return (b.bestWpm || 0) - (a.bestWpm || 0);
      if (this.analyticsWordSort === 'fastestMs') return (a.fastestMs || 9999) - (b.fastestMs || 9999);
      if (this.analyticsWordSort === 'accuracy') return (b.accuracy || 0) - (a.accuracy || 0);
      if (this.analyticsWordSort === 'timesTyped' || this.analyticsWordSort === 'timesTypedDesc') return (b.timesTyped || 0) - (a.timesTyped || 0);
      if (this.analyticsWordSort === 'errors' || this.analyticsWordSort === 'errorsDesc') return (b.errorsCount || 0) - (a.errorsCount || 0);
      if (this.analyticsWordSort === 'word' || this.analyticsWordSort === 'alphabetical') return a.word.localeCompare(b.word);
      return (b.bestWpm || 0) - (a.bestWpm || 0);
    });

    if (filtered.length === 0) {
      if (this.dom.emptyWordsNotice) {
        this.dom.emptyWordsNotice.style.display = 'block';
        this.dom.wordMasteryTbody.appendChild(this.dom.emptyWordsNotice);
      }
      return;
    }

    if (this.dom.emptyWordsNotice) {
      this.dom.emptyWordsNotice.style.display = 'none';
    }

    filtered.forEach(stat => {
      const tr = document.createElement('tr');
      const statusLabel = stat.status === 'mastered' ? 'Mastered 🌟' : stat.status === 'proficient' ? 'Proficient ⚡' : 'Needs Work 🎯';
      tr.innerHTML = `
        <td class="word-cell">${escapeHtml(stat.word)}</td>
        <td><span class="status-pill ${escapeHtml(stat.status)}">${escapeHtml(statusLabel)}</span></td>
        <td><span class="benchmark-cell highlight">${escapeHtml(stat.bestWpm)} WPM</span></td>
        <td><span class="benchmark-cell">${escapeHtml(stat.fastestMs)} ms</span></td>
        <td><span class="benchmark-cell">${escapeHtml(stat.accuracy)}%</span></td>
        <td><span class="benchmark-cell">${escapeHtml(stat.timesTyped)}x</span></td>
        <td>
          <button class="pill-btn mini-btn" data-practice-word="${escapeHtml(stat.word)}">🎯 Drill</button>
        </td>
      `;
      this.dom.wordMasteryTbody.appendChild(tr);
    });
  }

  // --- Practice Weak Words Drill ---
  practiceWeakWordsDrill() {
    const wordList = Object.values(this.wordPerformanceStats || {});
    let targets = wordList.filter(w => w.status === 'weak' || (w.errorsCount && w.errorsCount > 0) || w.bestWpm < 45);

    if (targets.length === 0) {
      targets = wordList.slice(-6);
    }

    if (targets.length === 0) {
      this.showToast('No weak words identified yet! Complete a test first.', '💡');
      return;
    }

    const wordsArr = targets.map(t => t.word);
    let drillText = wordsArr.join(' ');
    while (drillText.split(' ').length < 25) {
      drillText += ' ' + wordsArr.sort(() => 0.5 - Math.random()).join(' ');
    }

    this.showToast(`Drilling ${targets.length} weak words in Arena! 🎯`, '⚡');
    this.startArenaSession(drillText);
  }

  // --- Practice Single Word Drill ---
  practiceSingleWordDrill(word) {
    if (!word) return;
    const cleanWord = word.trim().toLowerCase();
    const fillers = ['the', 'focus', 'flow', 'quick', 'pulse', 'steady', 'rhythm', 'clear', 'speed'];
    let tokens = [];

    for (let i = 0; i < 12; i++) {
      tokens.push(cleanWord);
      tokens.push(fillers[Math.floor(Math.random() * fillers.length)]);
    }

    const drillText = tokens.join(' ');
    this.showToast(`Targeted drill for "${cleanWord}" 🎯`, '⚡');
    this.startArenaSession(drillText);
  }

  // --- Render Complete Test History Log ---
  renderHistoryLog(records = null) {
    if (!this.dom.historyLogTbody) return;
    this.dom.historyLogTbody.innerHTML = '';

    const list = records || this.cachedAnalyticsRecords || [];
    const filter = this.historyTypeFilter || 'all';

    const filtered = list.filter(r => {
      if (filter === 'time') return r.test_type === 'time' || !r.test_type;
      if (filter === 'words') return r.test_type === 'words';
      return true;
    });

    if (this.dom.historyLogCount) {
      this.dom.historyLogCount.textContent = `${filtered.length} tests logged`;
    }

    if (filtered.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="8" style="text-align:center; padding: 24px; color: var(--text-dim);">No tests matching selected filter. Complete a practice test in Arena!</td>`;
      this.dom.historyLogTbody.appendChild(tr);
      return;
    }

    filtered.forEach(r => {
      const isWords = r.test_type === 'words';
      const targetLabel = isWords ? `${r.target_value || r.words_typed || 25} Words` : `${r.duration_seconds || 60}s Time`;
      const badgeClass = isWords ? 'mode-pill words' : 'mode-pill time';
      const dateText = this.formatDateStr(r.created_at);
      const timeText = this.formatTimeStr(r.created_at);
      const genre = (r.mode || 'quotes').charAt(0).toUpperCase() + (r.mode || 'quotes').slice(1);
      const diff = (r.difficulty || 'normal').charAt(0).toUpperCase() + (r.difficulty || 'normal').slice(1);

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="${escapeHtml(badgeClass)}">${escapeHtml(targetLabel)}</span></td>
        <td class="history-date">${escapeHtml(dateText)} <span class="history-time">${escapeHtml(timeText)}</span></td>
        <td><span class="benchmark-cell highlight">${escapeHtml(r.wpm)} WPM</span></td>
        <td><span class="benchmark-cell">${escapeHtml(r.raw_wpm || r.rawWpm || r.wpm)}</span></td>
        <td><span class="benchmark-cell">${escapeHtml(r.accuracy)}%</span></td>
        <td><span class="benchmark-cell">${escapeHtml(r.duration_seconds || 60)}s</span></td>
        <td class="text-dim" style="font-size:0.8rem;">${escapeHtml(genre)} • ${escapeHtml(diff)}</td>
        <td>
          <button class="pill-btn mini-btn danger" data-history-delete-id="${escapeHtml(r.id)}" title="Delete Record">✕</button>
        </td>
      `;

      const delBtn = tr.querySelector('[data-history-delete-id]');
      if (delBtn) {
        delBtn.addEventListener('click', () => {
          this.deleteTypingRecord(r.id);
          this.renderAnalyticsDashboard();
        });
      }

      this.dom.historyLogTbody.appendChild(tr);
    });
  }

  // --- Export Analytics & Mastery Data as JSON ---
  exportAnalyticsData() {
    const records = this.cachedAnalyticsRecords || [];
    const payload = {
      app: 'meow-typing',
      exportDate: new Date().toISOString(),
      user: window.supabaseService?.user?.email || 'Guest',
      careerStats: this.stats,
      wordPerformanceMatrix: this.wordPerformanceStats,
      historyRecordsCount: records.length,
      historyRecords: records
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `meow-typing-analytics-${Date.now()}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();

    this.showToast('Analytics & telemetry exported! 📊', '✅');
  }
}

// Instantiate on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.meowApp = new MeowTypingApp();
});
