const MAX_TARGET_COUNT = 10;
const LEADERBOARD_ENDPOINT = "/.netlify/functions/leaderboard";
const TRACKING_TONE_INTERVAL_MS = 180;
const RESTART_UNLOCK_DELAY_MS = 1500;
const NANO_FEEDBACK_MAX_SENTENCES = 4;
const NANO_FEEDBACK_MAX_CHARACTERS = 720;
const TRACKING_DIRECTION_CHANGE_SECONDS = [0.28, 0.95];
const TAU = Math.PI * 2;
const MAX_ABS_YAW = TAU * 1000;
const POINTER_LOCK_MOUSE_SETTLE_MS = 80;
const MOUSE_SPIKE_THRESHOLD = 2400;
const DEFAULT_RAD_PER_COUNT = 0.00215;
const DEFAULT_DPI = 800;
const CM_PER_INCH = 2.54;
const FOV_REFERENCE_ASPECT = 16 / 9;
const DEFAULT_HORIZONTAL_FOV = 103;
const CM360_AT_800_DPI = {
    valorant: 16.33791,
    overwatch: 173.18182,
    source: 51.95454,
    fortnite: 205.94594
};
const radPerCountFromCm360 = (cm360) => (Math.PI * 2 * CM_PER_INCH) / (cm360 * DEFAULT_DPI);
const SENSITIVITY_PROFILES = {
    valorant: {
        label: "Valorant",
        defaultValue: 0.35,
        radPerCount: (value) => value * radPerCountFromCm360(CM360_AT_800_DPI.valorant)
    },
    source: {
        label: "CS2 / Apex / Source",
        defaultValue: 1.25,
        radPerCount: (value) => value * radPerCountFromCm360(CM360_AT_800_DPI.source)
    },
    overwatch: {
        label: "Overwatch",
        defaultValue: 4.2,
        radPerCount: (value) => value * radPerCountFromCm360(CM360_AT_800_DPI.overwatch)
    },
    fortnite: {
        label: "Fortnite",
        defaultValue: 6,
        radPerCount: (value) => value * radPerCountFromCm360(CM360_AT_800_DPI.fortnite)
    }
};
const CROSSHAIR_CANVAS_SIZE = 160;
const CROSSHAIR_PRESETS = ["custom"];
const CROSSHAIR_PRESET_CLASSES = CROSSHAIR_PRESETS.map((preset) => `crosshair-${preset}`);
const CROSSHAIR_PRESET_SETTINGS = {
    custom: { shape: "custom", size: CROSSHAIR_CANVAS_SIZE, color: "#ffffff", thickness: 2, gap: 8, opacity: 0.95, outline: 1, dotSize: 6 }
};
const CROSSHAIR_PROFILE_STORAGE_KEY = "goatRangeCrosshairProfiles";
const CROSSHAIR_IMAGE_DB_NAME = "goatRangeCrosshairImages";
const CROSSHAIR_IMAGE_STORE_NAME = "images";
const CUSTOM_CROSSHAIR_IMAGE_KEY = "custom";
const CROSSHAIR_COMMON_KEYS = [
    "crosshairSize",
    "crosshairColor",
    "crosshairThickness",
    "crosshairGap",
    "crosshairOpacity",
    "crosshairOutline",
    "crosshairDotSize",
    "crosshairImage"
];
const CROSSHAIR_BUILDER_KEYS = [
    "builderDot",
    "builderLines",
    "builderRing",
    "builderBox",
    "builderImage",
    "builderDiagonal",
    "builderDotSize",
    "builderLineLength",
    "builderRingSize",
    "builderBoxSize",
    "builderImageSize",
    "builderImageOpacity",
    "builderRotation"
];
const CROSSHAIR_VALORANT_KEYS = [
    "valorantCenterDot",
    "valorantInnerLines",
    "valorantInnerOpacity",
    "valorantInnerLength",
    "valorantInnerVerticalLength",
    "valorantInnerThickness",
    "valorantInnerOffset",
    "valorantOuterLines",
    "valorantOuterOpacity",
    "valorantOuterLength",
    "valorantOuterVerticalLength",
    "valorantOuterThickness",
    "valorantOuterOffset"
];
const VALORANT_COLOR_MAP = {
    0: "#ffffff",
    1: "#00ff00",
    2: "#ffff00",
    3: "#00ff00",
    4: "#ff00ff",
    5: "#00ffff",
    6: "#ff0000",
    7: "#0000ff"
};
const DEFAULT_CROSSHAIR = {
    color: "#67e8f9",
    thickness: 2,
    gap: 8,
    opacity: 0.95,
    outline: 1,
    dotSize: 6
};
const DEFAULT_BALL_COLOR = "#67e8f9";
const SUPPORTED_LANGUAGES = ["ko", "en"];
const TRACKING_MOVEMENT_TYPES = ["horizontal", "random"];
const PRACTICE_SETTINGS_DEFAULTS = {
    precision: { radius: 0.18, targetCount: 3, duration: 40, color: DEFAULT_BALL_COLOR },
    reflex: { duration: 40, color: DEFAULT_BALL_COLOR },
    tracking: { speed: 1.25, radius: 0.18, duration: 40, movement: "random", color: DEFAULT_BALL_COLOR }
};
const LEADERBOARD_SETTING_KEYS = {
    precision: ["radius", "targetCount", "duration"],
    reflex: ["duration"],
    tracking: ["speed", "radius", "duration", "movement"]
};
const PRACTICE_MODES = {
    precision: {
        labelKey: "modePrecision",
        descKey: "modePrecisionDesc",
        duration: 40,
        targetCount: 3,
        radius: [0.14, 0.24],
        velocity: [0.25, 0.18, 0.16],
        scoreScale: 1.45,
        minRespawnDistance: 2.4
    },
    reflex: {
        labelKey: "modeReflex",
        descKey: "modeReflexDesc",
        duration: 40,
        targetCount: 1,
        radius: [0.28, 0.46],
        velocity: [0.08, 0.06, 0.05],
        scoreScale: 1.9,
        minRespawnDistance: 3.2
    },
    tracking: {
        labelKey: "modeTracking",
        descKey: "modeTrackingDesc",
        duration: 40,
        targetCount: 1,
        radius: [0.14, 0.24],
        velocity: [1.25, 0.78, 0],
        scoreScale: 1,
        minRespawnDistance: 2.6,
        aimOnly: true
    }
};
const DEFAULT_MODE = "precision";
const I18N = {
    en: {
        title: "GOAT Range - Aim Trainer",
        settings: "Settings",
        best: "Best",
        startDrill: "Start Drill",
        practiceMode: "Practice Mode",
        modeSettings: "Mode Settings",
        ballSize: "Ball Size",
        ballColor: "Ball Color",
        maxBallCount: "Max Ball Count",
        gameDuration: "Game Time",
        ballSpeed: "Ball Speed",
        movementType: "Movement",
        movementHorizontal: "Horizontal Random",
        movementRandom: "Horizontal + Vertical Random",
        resetModeSettings: "Reset Mode Settings",
        modePrecision: "Precision",
        modePrecisionDesc: "Small targets, slower pace, misses cost points.",
        modeReflex: "Reflex",
        modeReflexDesc: "One target at a time for fast flicks.",
        modeTracking: "Tracking",
        modeTrackingDesc: "Follow one small target with your aim. No clicks needed.",
        language: "Language",
        languageAuto: "Auto",
        general: "General",
        screen: "Screen",
        crosshair: "Crosshair",
        mouse: "Mouse",
        theme: "Theme",
        themeAuto: "Auto",
        themeDark: "Dark",
        themeLight: "Light",
        themePurpleOrangeDark: "Purple + Orange Dark",
        themePurpleOrangeLight: "Purple + Orange Light",
        soundEffects: "Sound Effects",
        fullscreenHint: "Press F11 to switch browser fullscreen on or off.",
        showFps: "Show FPS",
        fov: "FOV (16:9 Horizontal)",
        crosshairCircle: "Circle",
        crosshairCrosshair: "Crosshairs",
        crosshairCircleCrosshair: "Circle and Crosshairs",
        crosshairDot: "Dot",
        crosshairLine: "Lines",
        crosshairBox: "Box",
        crosshairTriwing: "Triwing",
        crosshairFalloff: "Falloff",
        crosshairSquare: "Square",
        crosshairValorant: "Valorant",
        crosshairCustom: "Basic",
        resetCrosshair: "Reset",
        valorantCode: "Valorant Code",
        importValorantCode: "Import Code",
        valorantCenterDot: "Center Dot",
        valorantInnerLines: "Inner Lines",
        valorantInnerOpacity: "Inner Opacity",
        valorantInnerLength: "Inner Length",
        valorantInnerVerticalLength: "Inner Vertical Length",
        valorantInnerThickness: "Inner Thickness",
        valorantInnerOffset: "Inner Offset",
        valorantOuterLines: "Outer Lines",
        valorantOuterOpacity: "Outer Opacity",
        valorantOuterLength: "Outer Length",
        valorantOuterVerticalLength: "Outer Vertical Length",
        valorantOuterThickness: "Outer Thickness",
        valorantOuterOffset: "Outer Offset",
        crosshairSize: "Size",
        crosshairColor: "Color",
        crosshairThickness: "Thickness",
        crosshairGapSize: "Gap",
        crosshairOpacity: "Opacity",
        crosshairOutline: "Outline",
        crosshairDotSize: "Dot Size",
        builderDot: "Center Dot",
        builderLines: "Cross Lines",
        builderRing: "Ring",
        builderBox: "Corner Box",
        builderImage: "Custom Image",
        builderDiagonal: "Diagonal",
        builderDotSize: "Dot Size",
        builderLineLength: "Line Length",
        builderRingSize: "Ring Size",
        builderBoxSize: "Box Size",
        builderImageSize: "Image Size",
        builderImageOpacity: "Image Opacity",
        builderRotation: "Rotation",
        customImage: "Custom Image",
        uploadImage: "Upload Image",
        clearImage: "Clear",
        noImage: "No image",
        imageReady: "Image ready",
        invalidCrosshairImage: "Could not read that image.",
        sensitivityScale: "Sensitivity Scale",
        gameSens: "Game Sens",
        separateAxisSensitivity: "Separate X/Y Sens",
        horizontalSens: "Horizontal Sens",
        verticalSens: "Vertical Sens",
        cm360: "cm/360",
        invertX: "Invert X",
        invertY: "Invert Y",
        done: "Done",
        score: "Score",
        accuracy: "Accuracy",
        time: "Time",
        streak: "Streak",
        pause: "ESC to Pause",
        paused: "PAUSED",
        pauseTitle: "Paused",
        pauseBody: "Press Resume to get back in.",
        resume: "Resume",
        backToMenu: "Back to Menu",
        drillComplete: "DRILL COMPLETE",
        runItBack: "Run It Back",
        leaderboard: "Leaderboard",
        leaderboardLoading: "Loading leaderboard...",
        leaderboardEmpty: "No scores have been submitted yet.",
        leaderboardUnavailable: "Could not connect to the leaderboard.",
        leaderboardAutoSubmit: "Auto Submit",
        leaderboardAutoSubmitOff: "This run will not be added to the leaderboard.",
        customSettingsLeaderboardBlocked: "Custom mode settings cannot be added to the leaderboard. Reset the mode settings to submit scores.",
        nickname: "Nickname",
        scoreSubmitting: "Submitting score...",
        scoreSubmitted: "Score submitted to the leaderboard.",
        invalidNickname: "Enter a nickname between 2 and 16 characters.",
        leaderboardApiMissing: "Leaderboard API was not found. Check the deployed site address.",
        leaderboardServerError: "The leaderboard server is not configured correctly.",
        leaderboardScoreRejected: "This score was rejected by the leaderboard validation.",
        scoreSubmitFailed: "Could not submit the score.",
        scoreRateLimited: "Too many scores were submitted. Please try again later.",
        nanoCoach: "Gemini Nano",
        nanoPreparing: "Preparing local feedback...",
        nanoDownloading: "Downloading Gemini Nano... {progress}",
        nanoAnalyzing: "Generating feedback...",
        nanoUnavailable: "Gemini Nano is not available in this Chrome profile yet.",
        nanoError: "Local feedback could not be generated. Try again after checking Chrome's built-in AI setup.",
        nanoRetry: "Try Nano Again",
        loadingWebGpu: "Loading...",
        webGpuUnsupported: "This browser cannot run the 3D renderer.",
        webGpuLost: "The graphics device was lost. Refresh the page.",
        live: "Live",
        pausedToast: "Paused",
        settingsToast: "Settings",
        clickToResume: "Click to resume",
        miss: "Miss"
    },
    ko: {
        title: "GOAT Range - \uc5d0\uc784 \ud2b8\ub808\uc774\ub108",
        settings: "\uc124\uc815",
        best: "\ucd5c\uace0 \uae30\ub85d",
        startDrill: "\ud6c8\ub828 \uc2dc\uc791",
        practiceMode: "\uc5f0\uc2b5 \ubaa8\ub4dc",
        modeSettings: "\ubaa8\ub4dc \uc138\ubd80 \uc124\uc815",
        ballSize: "\uacf5 \ud06c\uae30",
        ballColor: "\uacf5 \uc0c9\uc0c1",
        maxBallCount: "\ucd5c\ub300 \uacf5 \uac1c\uc218",
        gameDuration: "\uac8c\uc784 \uc2dc\uac04",
        ballSpeed: "\uacf5 \uc18d\ub3c4",
        movementType: "\uacf5 \uc774\ub3d9 \ubc29\uc2dd",
        movementHorizontal: "\uc88c\uc6b0 \ub79c\ub364",
        movementRandom: "\uc88c\uc6b0\uc0c1\ud558 \ub79c\ub364",
        resetModeSettings: "\ubaa8\ub4dc \uc124\uc815 \ucd08\uae30\ud654",
        modePrecision: "\uc815\ubc00",
        modePrecisionDesc: "\uc791\uc740 \ud0c0\uac9f\uc744 \ucc28\ubd84\ud558\uac8c \ub9de\ud788\uace0, \uc2e4\ud328\ud558\uba74 \uc810\uc218\uac00 \uae4e\uc785\ub2c8\ub2e4.",
        modeReflex: "\ubc18\uc751",
        modeReflexDesc: "\ud0c0\uac9f 1\uac1c\ub9cc \ub098\uc624\uba70 \ube60\ub978 \ud50c\ub9ad\uc744 \uc5f0\uc2b5\ud569\ub2c8\ub2e4.",
        modeTracking: "\ud2b8\ub798\ud0b9",
        modeTrackingDesc: "\uc791\uc740 \ud0c0\uac9f \ud558\ub098\ub97c \ud074\ub9ad \uc5c6\uc774 \uc870\uc900\uc120\uc73c\ub85c \ucd94\uc801\ud569\ub2c8\ub2e4.",
        language: "\uc5b8\uc5b4",
        languageAuto: "\uc790\ub3d9",
        general: "\uc77c\ubc18",
        screen: "\ud654\uba74",
        crosshair: "\uc870\uc900\uc120",
        mouse: "\ub9c8\uc6b0\uc2a4",
        theme: "\ud14c\ub9c8",
        themeAuto: "\uc790\ub3d9",
        themeDark: "\ub2e4\ud06c",
        themeLight: "\ub77c\uc774\ud2b8",
        themePurpleOrangeDark: "\ub0a8\ubcf4\ub77c\u00b7\uc8fc\ud669 \ub2e4\ud06c",
        themePurpleOrangeLight: "\ub0a8\ubcf4\ub77c\u00b7\uc8fc\ud669 \ub77c\uc774\ud2b8",
        soundEffects: "\ud6a8\uacfc\uc74c",
        fullscreenHint: "\uc804\uccb4\ud654\uba74\uc740 F11\ud0a4\ub85c \uc9c1\uc811 \ucf1c\uac70\ub098 \ub044\uc138\uc694.",
        showFps: "FPS \ud45c\uc2dc",
        fov: "FOV (16:9 \uac00\ub85c)",
        crosshairCircle: "\uc6d0",
        crosshairCrosshair: "\uc2ed\uc790\uc120",
        crosshairCircleCrosshair: "\uc6d0 \ubc0f \uc2ed\uc790\uc120",
        crosshairDot: "\uc810",
        crosshairLine: "\uc120",
        crosshairBox: "\ubc15\uc2a4",
        crosshairTriwing: "\ud2b8\ub77c\uc774\uc719",
        crosshairFalloff: "\uac10\uc18c",
        crosshairSquare: "\uc0ac\uac01",
        crosshairValorant: "\ubc1c\ub85c\ub780\ud2b8",
        crosshairCustom: "\uae30\ubcf8",
        resetCrosshair: "\ucd08\uae30\uac12",
        valorantCode: "\ubc1c\ub85c\ub780\ud2b8 \ucf54\ub4dc",
        importValorantCode: "\ucf54\ub4dc \ubd88\ub7ec\uc624\uae30",
        valorantCenterDot: "\uc911\uc559 \uc810",
        valorantInnerLines: "\uc548\ucabd \uc120",
        valorantInnerOpacity: "\uc548\ucabd \uc120 \ubd88\ud22c\uba85\ub3c4",
        valorantInnerLength: "\uc548\ucabd \uc120 \uae38\uc774",
        valorantInnerVerticalLength: "\uc548\ucabd \uc120 \uc138\ub85c \uae38\uc774",
        valorantInnerThickness: "\uc548\ucabd \uc120 \ub450\uaed8",
        valorantInnerOffset: "\uc548\ucabd \uc120 \ud3b8\ucc28",
        valorantOuterLines: "\ubc14\uae65\ucabd \uc120",
        valorantOuterOpacity: "\ubc14\uae65\ucabd \uc120 \ubd88\ud22c\uba85\ub3c4",
        valorantOuterLength: "\ubc14\uae65\ucabd \uc120 \uae38\uc774",
        valorantOuterVerticalLength: "\ubc14\uae65\ucabd \uc120 \uc138\ub85c \uae38\uc774",
        valorantOuterThickness: "\ubc14\uae65\ucabd \uc120 \ub450\uaed8",
        valorantOuterOffset: "\ubc14\uae65\ucabd \uc120 \ud3b8\ucc28",
        crosshairSize: "\ud06c\uae30",
        crosshairColor: "\uc0c9\uc0c1",
        crosshairThickness: "\ub450\uaed8",
        crosshairGapSize: "\uac04\uaca9",
        crosshairOpacity: "\ubd88\ud22c\uba85\ub3c4",
        crosshairOutline: "\uc678\uacfd\uc120",
        crosshairDotSize: "\uc810 \ud06c\uae30",
        builderDot: "\uc911\uc559 \uc810",
        builderLines: "\uc2ed\uc790\uc120",
        builderRing: "\uc6d0",
        builderBox: "\ucf54\ub108 \ubc15\uc2a4",
        builderImage: "\uc0ac\uc6a9\uc790 \uc9c0\uc815 \uc774\ubbf8\uc9c0",
        builderDiagonal: "\ub300\uac01\uc120",
        builderDotSize: "\uc911\uc559 \uc810 \ud06c\uae30",
        builderLineLength: "\uc120 \uae38\uc774",
        builderRingSize: "\uc6d0 \ud06c\uae30",
        builderBoxSize: "\ubc15\uc2a4 \ud06c\uae30",
        builderImageSize: "\uc774\ubbf8\uc9c0 \ud06c\uae30",
        builderImageOpacity: "\uc774\ubbf8\uc9c0 \ubd88\ud22c\uba85\ub3c4",
        builderRotation: "\ud68c\uc804",
        customImage: "\uc0ac\uc6a9\uc790 \uc774\ubbf8\uc9c0",
        uploadImage: "\uc774\ubbf8\uc9c0 \uc5c5\ub85c\ub4dc",
        clearImage: "\uc9c0\uc6b0\uae30",
        noImage: "\uc774\ubbf8\uc9c0 \uc5c6\uc74c",
        imageReady: "\uc774\ubbf8\uc9c0 \uc900\ube44\ub428",
        invalidCrosshairImage: "\uc774\ubbf8\uc9c0\ub97c \uc77d\uc744 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.",
        sensitivityScale: "\uac10\ub3c4 \uae30\uc900",
        gameSens: "\uac8c\uc784 \uac10\ub3c4",
        separateAxisSensitivity: "\uc88c\uc6b0/\uc0c1\ud558 \ub530\ub85c \uc124\uc815",
        horizontalSens: "\uc88c\uc6b0 \uac10\ub3c4",
        verticalSens: "\uc0c1\ud558 \uac10\ub3c4",
        cm360: "cm/360",
        invertX: "\uc88c\uc6b0 \ubc18\uc804",
        invertY: "\uc0c1\ud558 \ubc18\uc804",
        done: "\uc644\ub8cc",
        score: "\uc810\uc218",
        accuracy: "\uba85\uc911\ub960",
        time: "\uc2dc\uac04",
        streak: "\uc5f0\uc18d \uba85\uc911",
        pause: "ESC\ub85c \uc77c\uc2dc\uc815\uc9c0",
        paused: "\uc77c\uc2dc\uc815\uc9c0",
        pauseTitle: "\uc77c\uc2dc\uc815\uc9c0",
        pauseBody: "\uacc4\uc18d\ud558\uae30\ub97c \ub20c\ub7ec \ud6c8\ub828\uc73c\ub85c \ub3cc\uc544\uac00\uc138\uc694.",
        resume: "\uacc4\uc18d\ud558\uae30",
        backToMenu: "\uba54\ub274\ub85c \ub3cc\uc544\uac00\uae30",
        drillComplete: "\ud6c8\ub828 \uc885\ub8cc",
        runItBack: "\ub2e4\uc2dc \ud558\uae30",
        leaderboard: "\ub9ac\ub354\ubcf4\ub4dc",
        leaderboardLoading: "\ub9ac\ub354\ubcf4\ub4dc\ub97c \ubd88\ub7ec\uc624\ub294 \uc911...",
        leaderboardEmpty: "\uc544\uc9c1 \ub4f1\ub85d\ub41c \uae30\ub85d\uc774 \uc5c6\uc2b5\ub2c8\ub2e4.",
        leaderboardUnavailable: "\ub9ac\ub354\ubcf4\ub4dc\uc5d0 \uc5f0\uacb0\ud560 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.",
        leaderboardAutoSubmit: "\uc790\ub3d9 \ub4f1\ub85d",
        leaderboardAutoSubmitOff: "\uc774 \uae30\ub85d\uc740 \ub9ac\ub354\ubcf4\ub4dc\uc5d0 \uc62c\ub77c\uac00\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4.",
        customSettingsLeaderboardBlocked: "\ubaa8\ub4dc \uc138\ubd80 \uc124\uc815\uc744 \ubcc0\uacbd\ud558\uba74 \ub9ac\ub354\ubcf4\ub4dc\uc5d0 \uae30\ub85d\uc744 \ub4f1\ub85d\ud560 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4. \ub4f1\ub85d\ud558\ub824\uba74 \ubaa8\ub4dc \uc124\uc815\uc744 \ucd08\uae30\ud654\ud574 \uc8fc\uc138\uc694.",
        nickname: "\ub2c9\ub124\uc784",
        scoreSubmitting: "\uc810\uc218\ub97c \ub4f1\ub85d\ud558\ub294 \uc911...",
        scoreSubmitted: "\ub9ac\ub354\ubcf4\ub4dc\uc5d0 \ub4f1\ub85d\ud588\uc2b5\ub2c8\ub2e4.",
        invalidNickname: "\ub2c9\ub124\uc784\uc740 2~16\uc790\ub85c \uc785\ub825\ud574 \uc8fc\uc138\uc694.",
        leaderboardApiMissing: "\ub9ac\ub354\ubcf4\ub4dc API\ub97c \ucc3e\uc744 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4. \ubc30\ud3ec \uc8fc\uc18c\ub97c \ud655\uc778\ud574 \uc8fc\uc138\uc694.",
        leaderboardServerError: "\ub9ac\ub354\ubcf4\ub4dc \uc11c\ubc84 \uc124\uc815\uc774 \uc62c\ubc14\ub974\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4.",
        leaderboardScoreRejected: "\ub9ac\ub354\ubcf4\ub4dc \uac80\uc99d\uc5d0\uc11c \uc774 \uc810\uc218\uac00 \uac70\ubd80\ub418\uc5c8\uc2b5\ub2c8\ub2e4.",
        scoreSubmitFailed: "\uc810\uc218\ub97c \ub4f1\ub85d\ud558\uc9c0 \ubabb\ud588\uc2b5\ub2c8\ub2e4.",
        scoreRateLimited: "\uc810\uc218\ub97c \ub108\ubb34 \uc790\uc8fc \ub4f1\ub85d\ud588\uc2b5\ub2c8\ub2e4. \uc7a0\uc2dc \ud6c4 \ub2e4\uc2dc \uc2dc\ub3c4\ud574 \uc8fc\uc138\uc694.",
        nanoCoach: "Gemini Nano",
        nanoPreparing: "\ub85c\uceec \ud53c\ub4dc\ubc31\uc744 \uc900\ube44\ud558\ub294 \uc911...",
        nanoDownloading: "Gemini Nano\ub97c \ub2e4\uc6b4\ub85c\ub4dc\ud558\ub294 \uc911... {progress}",
        nanoAnalyzing: "\ud53c\ub4dc\ubc31\uc744 \ub9cc\ub4dc\ub294 \uc911...",
        nanoUnavailable: "\uc774 Chrome \ud504\ub85c\ud544\uc5d0\uc11c\ub294 \uc544\uc9c1 Gemini Nano\ub97c \uc0ac\uc6a9\ud560 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.",
        nanoError: "\ub85c\uceec \ud53c\ub4dc\ubc31\uc744 \ub9cc\ub4e4\uc9c0 \ubabb\ud588\uc2b5\ub2c8\ub2e4. Chrome \ub0b4\uc7a5 AI \uc124\uc815\uc744 \ud655\uc778\ud55c \ub4a4 \ub2e4\uc2dc \uc2dc\ub3c4\ud574 \ubcf4\uc138\uc694.",
        nanoRetry: "Nano \ub2e4\uc2dc \uc2dc\ub3c4",
        loadingWebGpu: "\ub85c\ub529 \uc911...",
        webGpuUnsupported: "\uc774 \ube0c\ub77c\uc6b0\uc800\uc5d0\uc11c\ub294 3D \ub80c\ub354\ub7ec\ub97c \uc2e4\ud589\ud560 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.",
        webGpuLost: "\uadf8\ub798\ud53d \uc7a5\uce58 \uc5f0\uacb0\uc774 \ub04a\uacbc\uc2b5\ub2c8\ub2e4. \ud398\uc774\uc9c0\ub97c \uc0c8\ub85c\uace0\uce68\ud574 \uc8fc\uc138\uc694.",
        live: "\uc9c4\ud589 \uc911",
        pausedToast: "\uc77c\uc2dc\uc815\uc9c0",
        settingsToast: "\uc124\uc815",
        clickToResume: "\ud074\ub9ad\ud574\uc11c \uc7ac\uac1c",
        miss: "\uc2e4\ud328"
    }
};

const practiceSettings = {
    precision: {
        radius: readBoundedNumberSetting("goatRangePrecisionRadius", PRACTICE_SETTINGS_DEFAULTS.precision.radius, 0.08, 0.42),
        targetCount: Math.round(readBoundedNumberSetting("goatRangePrecisionTargetCount", PRACTICE_SETTINGS_DEFAULTS.precision.targetCount, 1, MAX_TARGET_COUNT)),
        duration: Math.round(readBoundedNumberSetting("goatRangePrecisionDuration", PRACTICE_SETTINGS_DEFAULTS.precision.duration, 15, 180)),
        color: readColorSetting("goatRangePrecisionColor", PRACTICE_SETTINGS_DEFAULTS.precision.color)
    },
    reflex: {
        duration: Math.round(readBoundedNumberSetting("goatRangeReflexDuration", PRACTICE_SETTINGS_DEFAULTS.reflex.duration, 15, 180)),
        color: readColorSetting("goatRangeReflexColor", PRACTICE_SETTINGS_DEFAULTS.reflex.color)
    },
    tracking: {
        speed: readBoundedNumberSetting("goatRangeTrackingSpeed", PRACTICE_SETTINGS_DEFAULTS.tracking.speed, 0.2, 3),
        radius: readBoundedNumberSetting("goatRangeTrackingRadius", PRACTICE_SETTINGS_DEFAULTS.tracking.radius, 0.08, 0.42),
        duration: Math.round(readBoundedNumberSetting("goatRangeTrackingDuration", PRACTICE_SETTINGS_DEFAULTS.tracking.duration, 15, 180)),
        movement: readTrackingMovementSetting(),
        color: readColorSetting("goatRangeTrackingColor", PRACTICE_SETTINGS_DEFAULTS.tracking.color)
    }
};

const TARGET_BOUNDS = {
    minX: -5.8,
    maxX: 5.8,
    minY: 0.75,
    maxY: 4.25,
    minZ: -15.5,
    maxZ: -7.5
};

const dom = {
    startScreen: document.getElementById("start-screen"),
    gameScreen: document.getElementById("game-screen"),
    resultScreen: document.getElementById("result-screen"),
    settingsBtn: document.getElementById("settings-btn"),
    leaderboardStatus: document.getElementById("leaderboard-status"),
    leaderboardList: document.getElementById("leaderboard-list"),
    leaderboardPlayerName: document.getElementById("leaderboard-player-name"),
    leaderboardAutoSubmit: document.getElementById("leaderboard-auto-submit"),
    leaderboardSubmitStatus: document.getElementById("leaderboard-submit-status"),
    settingsOverlay: document.getElementById("settings-overlay"),
    settingsCloseBtn: document.getElementById("settings-close-btn"),
    settingsGeneralTab: document.getElementById("settings-general-tab"),
    settingsScreenTab: document.getElementById("settings-screen-tab"),
    settingsCrosshairTab: document.getElementById("settings-crosshair-tab"),
    settingsMouseTab: document.getElementById("settings-mouse-tab"),
    settingsGeneralPanel: document.getElementById("settings-general-panel"),
    settingsScreenPanel: document.getElementById("settings-screen-panel"),
    settingsCrosshairPanel: document.getElementById("settings-crosshair-panel"),
    settingsMousePanel: document.getElementById("settings-mouse-panel"),
    languageSelect: document.getElementById("language-select"),
    themeSelect: document.getElementById("theme-select"),
    soundEffects: document.getElementById("sound-effects"),
    showFps: document.getElementById("show-fps"),
    fovValue: document.getElementById("fov-value"),
    fovRange: document.getElementById("fov-range"),
    crosshairPreview: document.getElementById("crosshair-settings-preview"),
    crosshairPresetButtons: document.querySelectorAll("[data-crosshair-preset]"),
    resetCrosshairPreset: document.getElementById("reset-crosshair-preset"),
    customCrosshairSettings: document.getElementById("custom-crosshair-settings"),
    builderDot: document.getElementById("builder-dot"),
    builderLines: document.getElementById("builder-lines"),
    builderRing: document.getElementById("builder-ring"),
    builderBox: document.getElementById("builder-box"),
    builderImage: document.getElementById("builder-image"),
    builderDiagonal: document.getElementById("builder-diagonal"),
    builderDotSizeValue: document.getElementById("builder-dot-size-value"),
    builderDotSizeRange: document.getElementById("builder-dot-size-range"),
    builderLineLengthValue: document.getElementById("builder-line-length-value"),
    builderLineLengthRange: document.getElementById("builder-line-length-range"),
    builderRingSizeValue: document.getElementById("builder-ring-size-value"),
    builderRingSizeRange: document.getElementById("builder-ring-size-range"),
    builderBoxSizeValue: document.getElementById("builder-box-size-value"),
    builderBoxSizeRange: document.getElementById("builder-box-size-range"),
    builderImageSizeValue: document.getElementById("builder-image-size-value"),
    builderImageSizeRange: document.getElementById("builder-image-size-range"),
    builderImageOpacityValue: document.getElementById("builder-image-opacity-value"),
    builderImageOpacityRange: document.getElementById("builder-image-opacity-range"),
    builderRotationValue: document.getElementById("builder-rotation-value"),
    builderRotationRange: document.getElementById("builder-rotation-range"),
    crosshairImageInput: document.getElementById("crosshair-image-input"),
    clearCrosshairImage: document.getElementById("clear-crosshair-image"),
    crosshairImageStatus: document.getElementById("crosshair-image-status"),
    crosshairSizeValue: document.getElementById("crosshair-size-value"),
    crosshairSizeRange: document.getElementById("crosshair-size-range"),
    crosshairColor: document.getElementById("crosshair-color"),
    crosshairThicknessValue: document.getElementById("crosshair-thickness-value"),
    crosshairThicknessRange: document.getElementById("crosshair-thickness-range"),
    crosshairGapValue: document.getElementById("crosshair-gap-value"),
    crosshairGapRange: document.getElementById("crosshair-gap-range"),
    crosshairOpacityValue: document.getElementById("crosshair-opacity-value"),
    crosshairOpacityRange: document.getElementById("crosshair-opacity-range"),
    crosshairOutlineValue: document.getElementById("crosshair-outline-value"),
    crosshairOutlineRange: document.getElementById("crosshair-outline-range"),
    crosshairDotSizeValue: document.getElementById("crosshair-dot-size-value"),
    crosshairDotSizeRange: document.getElementById("crosshair-dot-size-range"),
    valorantSettings: document.getElementById("valorant-settings"),
    valorantCodeInput: document.getElementById("valorant-code-input"),
    valorantCodeImport: document.getElementById("valorant-code-import"),
    valorantCenterDot: document.getElementById("valorant-center-dot"),
    valorantInnerLines: document.getElementById("valorant-inner-lines"),
    valorantInnerOpacityValue: document.getElementById("valorant-inner-opacity-value"),
    valorantInnerOpacityRange: document.getElementById("valorant-inner-opacity-range"),
    valorantInnerLengthValue: document.getElementById("valorant-inner-length-value"),
    valorantInnerLengthRange: document.getElementById("valorant-inner-length-range"),
    valorantInnerVerticalLengthValue: document.getElementById("valorant-inner-vertical-length-value"),
    valorantInnerVerticalLengthRange: document.getElementById("valorant-inner-vertical-length-range"),
    valorantInnerThicknessValue: document.getElementById("valorant-inner-thickness-value"),
    valorantInnerThicknessRange: document.getElementById("valorant-inner-thickness-range"),
    valorantInnerOffsetValue: document.getElementById("valorant-inner-offset-value"),
    valorantInnerOffsetRange: document.getElementById("valorant-inner-offset-range"),
    valorantOuterLines: document.getElementById("valorant-outer-lines"),
    valorantOuterOpacityValue: document.getElementById("valorant-outer-opacity-value"),
    valorantOuterOpacityRange: document.getElementById("valorant-outer-opacity-range"),
    valorantOuterLengthValue: document.getElementById("valorant-outer-length-value"),
    valorantOuterLengthRange: document.getElementById("valorant-outer-length-range"),
    valorantOuterVerticalLengthValue: document.getElementById("valorant-outer-vertical-length-value"),
    valorantOuterVerticalLengthRange: document.getElementById("valorant-outer-vertical-length-range"),
    valorantOuterThicknessValue: document.getElementById("valorant-outer-thickness-value"),
    valorantOuterThicknessRange: document.getElementById("valorant-outer-thickness-range"),
    valorantOuterOffsetValue: document.getElementById("valorant-outer-offset-value"),
    valorantOuterOffsetRange: document.getElementById("valorant-outer-offset-range"),
    modeButtons: document.querySelectorAll("[data-practice-mode]"),
    modeOptionPanels: document.querySelectorAll("[data-mode-options]"),
    modeOptionResetButtons: document.querySelectorAll("[data-reset-mode]"),
    precisionRadiusValue: document.getElementById("precision-radius-value"),
    precisionRadiusRange: document.getElementById("precision-radius-range"),
    precisionTargetCountValue: document.getElementById("precision-target-count-value"),
    precisionTargetCountRange: document.getElementById("precision-target-count-range"),
    precisionDurationValue: document.getElementById("precision-duration-value"),
    precisionDurationRange: document.getElementById("precision-duration-range"),
    precisionColor: document.getElementById("precision-color"),
    reflexDurationValue: document.getElementById("reflex-duration-value"),
    reflexDurationRange: document.getElementById("reflex-duration-range"),
    reflexColor: document.getElementById("reflex-color"),
    trackingSpeedValue: document.getElementById("tracking-speed-value"),
    trackingSpeedRange: document.getElementById("tracking-speed-range"),
    trackingRadiusValue: document.getElementById("tracking-radius-value"),
    trackingRadiusRange: document.getElementById("tracking-radius-range"),
    trackingDurationValue: document.getElementById("tracking-duration-value"),
    trackingDurationRange: document.getElementById("tracking-duration-range"),
    trackingMovement: document.getElementById("tracking-movement"),
    trackingColor: document.getElementById("tracking-color"),
    practiceSettingsWarning: document.getElementById("practice-settings-warning"),
    startBtn: document.getElementById("start-btn"),
    restartBtn: document.getElementById("restart-btn"),
    pauseBtn: document.getElementById("pause-btn"),
    pauseMenu: document.getElementById("pause-menu"),
    resumeBtn: document.getElementById("resume-btn"),
    pauseSettingsBtn: document.getElementById("pause-settings-btn"),
    backBtn: document.getElementById("back-btn"),
    sensitivityProfile: document.getElementById("sensitivity-profile"),
    sensitivityValue: document.getElementById("sensitivity-value"),
    baseSensitivityField: document.querySelector(".base-sensitivity-field"),
    separateAxisSensitivity: document.getElementById("separate-axis-sensitivity"),
    axisSensitivityFields: document.querySelectorAll(".axis-sensitivity-field"),
    sensitivityX: document.getElementById("sensitivity-x"),
    sensitivityY: document.getElementById("sensitivity-y"),
    cm360Output: document.getElementById("cm360-output"),
    invertX: document.getElementById("invert-x"),
    invertY: document.getElementById("invert-y"),
    supportMessage: document.getElementById("support-message"),
    canvas: document.getElementById("gpu-canvas"),
    score: document.getElementById("score"),
    accuracy: document.getElementById("accuracy"),
    time: document.getElementById("time"),
    streak: document.getElementById("streak"),
    highScore: document.getElementById("high-score"),
    finalScore: document.getElementById("final-score"),
    finalAccuracy: document.getElementById("final-accuracy"),
    finalHighScore: document.getElementById("final-high-score"),
    resultModeSettingsList: document.getElementById("result-mode-settings-list"),
    nanoFeedback: document.querySelector(".nano-feedback"),
    nanoFeedbackStatus: document.getElementById("nano-feedback-status"),
    nanoFeedbackText: document.getElementById("nano-feedback-text"),
    nanoFeedbackRetry: document.getElementById("nano-feedback-retry"),
    hitMarker: document.getElementById("hit-marker"),
    fpsCounter: document.getElementById("fps-counter"),
    reticle: document.getElementById("reticle"),
    toast: document.getElementById("toast")
};

const shaderCode = `
struct Uniforms {
    viewProj: mat4x4<f32>,
    model: mat4x4<f32>,
    color: vec4<f32>,
    lightDir: vec4<f32>,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

struct VertexInput {
    @location(0) position: vec3<f32>,
    @location(1) normal: vec3<f32>,
};

struct VertexOutput {
    @builtin(position) clipPosition: vec4<f32>,
    @location(0) normal: vec3<f32>,
    @location(1) worldPosition: vec3<f32>,
};

@vertex
fn vertexMain(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    let world = uniforms.model * vec4<f32>(input.position, 1.0);
    output.clipPosition = uniforms.viewProj * world;
    output.worldPosition = world.xyz;
    output.normal = normalize((uniforms.model * vec4<f32>(input.normal, 0.0)).xyz);
    return output;
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4<f32> {
    let light = max(dot(normalize(input.normal), normalize(-uniforms.lightDir.xyz)), 0.0);
    let fresnel = pow(1.0 - max(abs(input.normal.z), 0.0), 2.0);
    var rgb = uniforms.color.rgb * (0.32 + light * 0.74) + fresnel * 0.08;

    if (uniforms.color.a < 0.5) {
        let xGrid = abs(fract(input.worldPosition.x) - 0.5);
        let zGrid = abs(fract(input.worldPosition.z) - 0.5);
        let yGrid = abs(fract(input.worldPosition.y) - 0.5);
        let line = 1.0 - smoothstep(0.0, 0.025, min(min(xGrid, zGrid), yGrid));
        let theme = clamp(uniforms.lightDir.a, 0.0, 1.0);
        let gridBase = mix(vec3<f32>(0.025, 0.040, 0.070), vec3<f32>(0.640, 0.760, 0.800), theme);
        let gridLine = mix(vec3<f32>(0.120, 0.210, 0.240), vec3<f32>(0.160, 0.520, 0.640), theme);
        rgb = mix(gridBase, gridLine, line * 0.55);
        rgb += light * 0.06;
    }

    let fog = smoothstep(7.0, 21.0, length(input.worldPosition));
    let fogColor = mix(vec3<f32>(0.025, 0.030, 0.045), vec3<f32>(0.780, 0.880, 0.920), clamp(uniforms.lightDir.a, 0.0, 1.0));
    rgb = mix(rgb, fogColor, fog * 0.55);
    return vec4<f32>(rgb, 1.0);
}
`;

let gpu = null;
let audio = null;
let animationId = 0;
let lastFrame = performance.now();
let fpsSampleStart = performance.now();
let fpsFrameCount = 0;
let restartUnlockTimer = 0;
let activeLanguage = resolveLanguage(readLanguageSetting());

const settings = {
    practiceMode: readPracticeModeSetting(),
    languageMode: readLanguageSetting(),
    themeMode: readThemeSetting(),
    soundEffects: localStorage.getItem("goatRangeSoundEffects") !== "false",
    leaderboardAutoSubmit: localStorage.getItem("goatRangeLeaderboardAutoSubmit") === "true",
    showFps: localStorage.getItem("goatRangeShowFps") === "true",
    fov: readNumberSetting("goatRangeFov", DEFAULT_HORIZONTAL_FOV),
    crosshairPreset: readCrosshairPreset(),
    crosshairSize: readNumberSetting("goatRangeCrosshairSize", 46),
    crosshairColor: readColorSetting("goatRangeCrosshairColor", DEFAULT_CROSSHAIR.color),
    crosshairThickness: readBoundedNumberSetting("goatRangeCrosshairThickness", DEFAULT_CROSSHAIR.thickness, 1, 10),
    crosshairGap: readBoundedNumberSetting("goatRangeCrosshairGap", DEFAULT_CROSSHAIR.gap, 0, 36),
    crosshairOpacity: readBoundedNumberSetting("goatRangeCrosshairOpacity", DEFAULT_CROSSHAIR.opacity, 0.1, 1),
    crosshairOutline: readBoundedNumberSetting("goatRangeCrosshairOutline", DEFAULT_CROSSHAIR.outline, 0, 8),
    crosshairDotSize: readBoundedNumberSetting("goatRangeCrosshairDotSize", DEFAULT_CROSSHAIR.dotSize, 1, 24),
    valorantCenterDot: localStorage.getItem("goatRangeValorantCenterDot") !== "false",
    valorantInnerLines: localStorage.getItem("goatRangeValorantInnerLines") !== "false",
    valorantInnerOpacity: readBoundedNumberSetting("goatRangeValorantInnerOpacity", 1, 0, 1),
    valorantInnerLength: readBoundedNumberSetting("goatRangeValorantInnerLength", 4, 0, 20),
    valorantInnerVerticalLength: readBoundedNumberSetting("goatRangeValorantInnerVerticalLength", 4, 0, 20),
    valorantInnerThickness: readBoundedNumberSetting("goatRangeValorantInnerThickness", 2, 1, 10),
    valorantInnerOffset: readBoundedNumberSetting("goatRangeValorantInnerOffset", 2, 0, 20),
    valorantOuterLines: localStorage.getItem("goatRangeValorantOuterLines") === "true",
    valorantOuterOpacity: readBoundedNumberSetting("goatRangeValorantOuterOpacity", 0.35, 0, 1),
    valorantOuterLength: readBoundedNumberSetting("goatRangeValorantOuterLength", 2, 0, 20),
    valorantOuterVerticalLength: readBoundedNumberSetting("goatRangeValorantOuterVerticalLength", 2, 0, 20),
    valorantOuterThickness: readBoundedNumberSetting("goatRangeValorantOuterThickness", 2, 1, 10),
    valorantOuterOffset: readBoundedNumberSetting("goatRangeValorantOuterOffset", 10, 0, 40),
    crosshairImage: "",
    crosshairProfiles: readCrosshairProfiles(),
    sensitivityProfile: readProfileSetting(),
    sensitivityValue: readProfileValue(readProfileSetting()),
    separateAxisSensitivity: localStorage.getItem("goatRangeSeparateAxisSensitivity") === "true",
    sensitivityX: readProfileAxisValue(readProfileSetting(), "x", readProfileValue(readProfileSetting())),
    sensitivityY: readProfileAxisValue(readProfileSetting(), "y", readProfileValue(readProfileSetting())),
    invertX: localStorage.getItem("goatRangeInvertX") === "true",
    invertY: localStorage.getItem("goatRangeInvertY") === "true"
};

activateCrosshairProfile(settings.crosshairPreset);

const state = {
    active: false,
    paused: false,
    score: 0,
    shots: 0,
    hits: 0,
    streak: 0,
    bestStreak: 0,
    elapsedMs: 0,
    trackingMs: 0,
    trackingStreakMs: 0,
    bestTrackingStreakMs: 0,
    trackingScoreRemainder: 0,
    trackingToneElapsedMs: TRACKING_TONE_INTERVAL_MS,
    targets: [],
    yaw: 0,
    pitch: 0,
    lockFallback: false,
    settingsOpen: false,
    pauseMenuOpen: false,
    resumePending: false,
    resumeClickRequired: false,
    resumeAttemptId: 0,
    resumeIgnorePointerUnlockUntil: 0,
    ignoreMouseUntil: 0,
    suppressShootUntil: 0,
    returnToPauseFromSettings: false,
    camera: [0, 1.72, 2.9],
    forward: [0, 0, -1]
};

let highScore = getHighScore(settings.practiceMode);
let nanoCoachSession = null;
let nanoCoachSessionPromise = null;
let nanoCoachAvailability = "unknown";
let nanoCoachRequestId = 0;
let nanoFeedbackStatusKey = "nanoPreparing";
let nanoFeedbackStatusValue = "";
let lastNanoFeedback = null;
let lastDrillSummary = null;
let lastCompletedDrillSummary = null;
let leaderboardMode = settings.practiceMode;
let leaderboardRequestId = 0;
let leaderboardStatusKey = "leaderboardLoading";
let leaderboardSubmitStatusKey = "";
const leaderboardScoresByMode = new Map();
syncModeUi(false);
dom.leaderboardPlayerName.value = localStorage.getItem("goatRangeLeaderboardName") || "";
dom.leaderboardAutoSubmit.checked = settings.leaderboardAutoSubmit;
syncLeaderboardAutoSubmitAvailability();
dom.languageSelect.value = settings.languageMode;
dom.themeSelect.value = settings.themeMode;
dom.soundEffects.checked = settings.soundEffects;
dom.showFps.checked = settings.showFps;
dom.fovValue.value = String(settings.fov);
dom.fovRange.value = String(settings.fov);
dom.crosshairSizeValue.value = String(settings.crosshairSize);
dom.crosshairSizeRange.value = String(settings.crosshairSize);
dom.crosshairColor.value = settings.crosshairColor;
dom.crosshairThicknessValue.value = String(settings.crosshairThickness);
dom.crosshairThicknessRange.value = String(settings.crosshairThickness);
dom.crosshairGapValue.value = String(settings.crosshairGap);
dom.crosshairGapRange.value = String(settings.crosshairGap);
dom.crosshairOpacityValue.value = settings.crosshairOpacity.toFixed(2);
dom.crosshairOpacityRange.value = String(settings.crosshairOpacity);
dom.crosshairOutlineValue.value = String(settings.crosshairOutline);
dom.crosshairOutlineRange.value = String(settings.crosshairOutline);
dom.crosshairDotSizeValue.value = String(settings.crosshairDotSize);
dom.crosshairDotSizeRange.value = String(settings.crosshairDotSize);
dom.sensitivityProfile.value = settings.sensitivityProfile;
dom.sensitivityValue.value = formatSensitivityValue(settings.sensitivityValue);
dom.separateAxisSensitivity.checked = settings.separateAxisSensitivity;
dom.sensitivityX.value = formatSensitivityValue(settings.sensitivityX);
dom.sensitivityY.value = formatSensitivityValue(settings.sensitivityY);
dom.invertX.checked = settings.invertX;
dom.invertY.checked = settings.invertY;
applyLanguage();
applyTheme();
syncFpsUi(false);
syncFovUi(false);
syncCrosshairUi(false);
syncSensitivityUi(false);
void loadPersistedCrosshairImage();
void loadLeaderboard(settings.practiceMode);

init();
void checkNanoCoachAvailability();

async function init() {
    dom.startBtn.disabled = true;
    dom.supportMessage.textContent = t("loadingWebGpu");

    try {
        gpu = await initWebGPU(dom.canvas);
        dom.supportMessage.textContent = "";
        dom.startBtn.disabled = false;
        startRenderLoop();
    } catch (error) {
        console.error(error);
        dom.supportMessage.textContent = t("webGpuUnsupported");
    }
}

async function initWebGPU(canvas) {
    if (!navigator.gpu) {
        throw new Error("navigator.gpu is not available");
    }

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
        throw new Error("No WebGPU adapter found");
    }

    const device = await adapter.requestDevice();
    const context = canvas.getContext("webgpu");
    const format = navigator.gpu.getPreferredCanvasFormat();

    const shaderModule = device.createShaderModule({ code: shaderCode });

    const pipeline = device.createRenderPipeline({
        layout: "auto",
        vertex: {
            module: shaderModule,
            entryPoint: "vertexMain",
            buffers: [{
                arrayStride: 24,
                attributes: [
                    { shaderLocation: 0, offset: 0, format: "float32x3" },
                    { shaderLocation: 1, offset: 12, format: "float32x3" }
                ]
            }]
        },
        fragment: {
            module: shaderModule,
            entryPoint: "fragmentMain",
            targets: [{ format }]
        },
        primitive: {
            topology: "triangle-list",
            cullMode: "back"
        },
        depthStencil: {
            format: "depth24plus",
            depthWriteEnabled: true,
            depthCompare: "less"
        },
        multisample: {
            count: 1
        }
    });

    const uniformSlots = Array.from({ length: 1 + MAX_TARGET_COUNT }, () => {
        const buffer = device.createBuffer({
            size: 160,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        const bindGroup = device.createBindGroup({
            layout: pipeline.getBindGroupLayout(0),
            entries: [{ binding: 0, resource: { buffer } }]
        });
        return { buffer, bindGroup };
    });

    const sphere = createGpuMesh(device, createSphereMesh(32, 18));
    const arena = createGpuMesh(device, createArenaMesh());

    device.lost.then((info) => {
        console.error("WebGPU device lost:", info.message);
        dom.supportMessage.textContent = t("webGpuLost");
        stopGame();
    });

    return {
        device,
        context,
        format,
        pipeline,
        uniformSlots,
        sphere,
        arena,
        depthTexture: null,
        canvasWidth: 0,
        canvasHeight: 0
    };
}

function startRenderLoop() {
    lastFrame = performance.now();
    fpsSampleStart = lastFrame;
    fpsFrameCount = 0;
    const frame = (now) => {
        const delta = Math.min((now - lastFrame) / 1000, 0.05);
        lastFrame = now;
        updateFpsCounter(now);
        update(delta);
        render();
        animationId = requestAnimationFrame(frame);
    };
    animationId = requestAnimationFrame(frame);
}

function updateFpsCounter(now) {
    if (!settings.showFps) {
        return;
    }

    fpsFrameCount += 1;
    const elapsed = now - fpsSampleStart;
    if (elapsed < 500) {
        return;
    }

    const fps = Math.round((fpsFrameCount * 1000) / elapsed);
    dom.fpsCounter.textContent = `${fps} FPS`;
    fpsSampleStart = now;
    fpsFrameCount = 0;
}

function startGame() {
    const mode = getPracticeMode();
    ensureAudio();
    state.active = true;
    state.paused = false;
    state.score = 0;
    state.shots = 0;
    state.hits = 0;
    state.streak = 0;
    state.bestStreak = 0;
    state.elapsedMs = 0;
    state.trackingMs = 0;
    state.trackingStreakMs = 0;
    state.bestTrackingStreakMs = 0;
    state.trackingScoreRemainder = 0;
    state.trackingToneElapsedMs = TRACKING_TONE_INTERVAL_MS;
    state.yaw = 0;
    state.pitch = 0;
    state.lockFallback = false;
    state.pauseMenuOpen = false;
    state.settingsOpen = false;
    state.resumePending = false;
    state.resumeClickRequired = false;
    state.resumeAttemptId += 1;
    state.returnToPauseFromSettings = false;
    state.resumeIgnorePointerUnlockUntil = 0;
    state.ignoreMouseUntil = 0;
    state.suppressShootUntil = 0;
    state.targets = Array.from({ length: mode.targetCount }, () => createTarget());
    lastCompletedDrillSummary = null;
    syncLeaderboardAutoSubmitAvailability();
    setLeaderboardSubmitStatus();
    resetNanoFeedbackUi();
    updateForward();
    updateHud();

    dom.startScreen.classList.add("hidden");
    dom.resultScreen.classList.add("hidden");
    dom.gameScreen.classList.remove("hidden");
    dom.pauseMenu.classList.add("hidden");
    dom.settingsOverlay.classList.add("hidden");
    dom.settingsBtn.classList.add("hidden");
    showToast(t("live"));
    requestAimLock();
}

function stopGame() {
    state.active = false;
    state.paused = false;
    state.pauseMenuOpen = false;
    state.settingsOpen = false;
    state.resumePending = false;
    state.resumeClickRequired = false;
    state.resumeAttemptId += 1;
    state.returnToPauseFromSettings = false;
    state.resumeIgnorePointerUnlockUntil = 0;
    state.ignoreMouseUntil = 0;
    state.suppressShootUntil = 0;
    dom.pauseMenu.classList.add("hidden");
    dom.settingsOverlay.classList.add("hidden");
    dom.settingsBtn.classList.remove("hidden");
    if (document.pointerLockElement === dom.canvas) {
        document.exitPointerLock();
    }
}

function endGame() {
    stopGame();
    const drillSummary = getDrillSummary();
    lastCompletedDrillSummary = drillSummary;
    highScore = Math.max(highScore, state.score);
    localStorage.setItem(getHighScoreKey(settings.practiceMode), String(highScore));

    dom.finalScore.textContent = state.score;
    dom.finalAccuracy.textContent = `${getAccuracy()}%`;
    dom.finalHighScore.textContent = highScore;
    dom.highScore.textContent = highScore;
    renderResultModeSettings(drillSummary);
    syncLeaderboardAutoSubmitAvailability(drillSummary);
    dom.gameScreen.classList.add("hidden");
    dom.resultScreen.classList.remove("hidden");
    window.clearTimeout(restartUnlockTimer);
    dom.restartBtn.disabled = true;
    restartUnlockTimer = window.setTimeout(() => {
        dom.restartBtn.disabled = false;
    }, RESTART_UNLOCK_DELAY_MS);
    if (!isLeaderboardEligibleSummary(drillSummary)) {
        setLeaderboardSubmitStatus("customSettingsLeaderboardBlocked");
    } else if (settings.leaderboardAutoSubmit) {
        void submitLeaderboardScore(drillSummary);
    } else {
        setLeaderboardSubmitStatus("leaderboardAutoSubmitOff");
    }
    void generateNanoFeedback(drillSummary);
}

function update(delta) {
    const mode = getPracticeMode();
    if (state.active && !state.paused) {
        state.elapsedMs += delta * 1000;
        updateTargets(delta);
        if (mode.aimOnly) {
            updateTrackingAim(delta);
        }
        if (state.elapsedMs >= mode.duration * 1000) {
            endGame();
        }
    }
    updateHud();
}

function updateHud() {
    const mode = getPracticeMode();
    const remaining = Math.max(0, Math.ceil(mode.duration - state.elapsedMs / 1000));
    dom.score.textContent = state.score;
    dom.accuracy.textContent = `${getAccuracy()}%`;
    dom.time.textContent = remaining;
    dom.streak.textContent = state.streak;
}

function getAccuracy() {
    if (getPracticeMode().aimOnly) {
        if (state.elapsedMs === 0) {
            return 0;
        }
        return Math.round((state.trackingMs / state.elapsedMs) * 100);
    }
    if (state.shots === 0) {
        return 100;
    }
    return Math.round((state.hits / state.shots) * 100);
}

function getDrillSummary() {
    const mode = getPracticeMode();
    return {
        mode: settings.practiceMode,
        options: { ...practiceSettings[settings.practiceMode] },
        score: state.score,
        accuracy: getAccuracy(),
        hits: state.hits,
        shots: state.shots,
        bestStreak: state.bestStreak,
        trackingSeconds: Number((state.trackingMs / 1000).toFixed(1)),
        bestTrackingStreakSeconds: Number((state.bestTrackingStreakMs / 1000).toFixed(1)),
        durationSeconds: mode.duration
    };
}

function renderResultModeSettings(summary) {
    const mode = PRACTICE_MODES[summary?.mode] || PRACTICE_MODES[DEFAULT_MODE];
    const options = summary?.options || {};
    const entries = [[t("practiceMode"), t(mode.labelKey)]];

    if (summary?.mode === "precision") {
        entries.push(
            [t("ballSize"), String(options.radius)],
            [t("maxBallCount"), String(options.targetCount)],
            [t("gameDuration"), `${options.duration}s`]
        );
    } else if (summary?.mode === "reflex") {
        entries.push(
            [t("gameDuration"), `${options.duration}s`]
        );
    } else {
        entries.push(
            [t("ballSpeed"), String(options.speed)],
            [t("ballSize"), String(options.radius)],
            [t("gameDuration"), `${options.duration}s`],
            [t("movementType"), t(options.movement === "horizontal" ? "movementHorizontal" : "movementRandom")]
        );
    }

    dom.resultModeSettingsList.replaceChildren();
    entries.forEach(([labelText, valueText]) => {
        const item = document.createElement("div");
        const label = document.createElement("span");
        const value = document.createElement("strong");
        label.textContent = labelText;
        value.textContent = valueText;
        item.append(label, value);
        dom.resultModeSettingsList.append(item);
    });
}

function setLeaderboardStatus(key = "") {
    leaderboardStatusKey = key;
    dom.leaderboardStatus.textContent = key ? t(key) : "";
    dom.leaderboardStatus.classList.toggle("hidden", !key);
}

function setLeaderboardSubmitStatus(key = "") {
    leaderboardSubmitStatusKey = key;
    dom.leaderboardSubmitStatus.textContent = key ? t(key) : "";
}

function renderLeaderboardScores(scores = leaderboardScoresByMode.get(leaderboardMode) || []) {
    dom.leaderboardList.replaceChildren();

    if (scores.length === 0) {
        setLeaderboardStatus("leaderboardEmpty");
        return;
    }

    setLeaderboardStatus();
    scores.forEach((entry) => {
        const item = document.createElement("li");
        const player = document.createElement("span");
        const score = document.createElement("strong");
        player.className = "leaderboard-player";
        player.textContent = entry.player_name;
        score.className = "leaderboard-score";
        score.textContent = Number(entry.score).toLocaleString();
        item.append(player, score);
        dom.leaderboardList.append(item);
    });
}

async function loadLeaderboard(mode = leaderboardMode) {
    if (!PRACTICE_MODES[mode]) {
        return;
    }

    const requestId = ++leaderboardRequestId;
    leaderboardMode = mode;
    setLeaderboardStatus("leaderboardLoading");

    try {
        const response = await fetch(`${LEADERBOARD_ENDPOINT}?mode=${encodeURIComponent(mode)}`);
        if (!response.ok) {
            throw new Error(`Leaderboard request failed with ${response.status}.`);
        }
        const data = await response.json();
        if (requestId !== leaderboardRequestId || leaderboardMode !== mode) {
            return;
        }
        const scores = Array.isArray(data.scores) ? data.scores : [];
        leaderboardScoresByMode.set(mode, scores);
        renderLeaderboardScores(scores);
    } catch (error) {
        console.warn("Leaderboard could not be loaded:", error);
        if (requestId === leaderboardRequestId) {
            dom.leaderboardList.replaceChildren();
            setLeaderboardStatus("leaderboardUnavailable");
        }
    }
}

async function submitLeaderboardScore(summary = lastCompletedDrillSummary) {
    const playerName = getLeaderboardPlayerName();

    if (!isLeaderboardEligibleSummary(summary)) {
        setLeaderboardSubmitStatus("customSettingsLeaderboardBlocked");
        return;
    }

    if (!summary || !isValidLeaderboardPlayerName(playerName)) {
        setLeaderboardSubmitStatus("invalidNickname");
        return;
    }

    localStorage.setItem("goatRangeLeaderboardName", playerName);
    dom.leaderboardPlayerName.value = playerName;
    setLeaderboardSubmitStatus("scoreSubmitting");

    try {
        const response = await fetch(LEADERBOARD_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ playerName, ...summary })
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            if (data.error === "rate_limited") {
                setLeaderboardSubmitStatus("scoreRateLimited");
                return;
            }
            if (response.status === 404) {
                setLeaderboardSubmitStatus("leaderboardApiMissing");
                return;
            }
            if (data.error === "invalid_score") {
                setLeaderboardSubmitStatus("leaderboardScoreRejected");
                return;
            }
            if (data.error === "server_error" || response.status >= 500) {
                setLeaderboardSubmitStatus("leaderboardServerError");
                return;
            }
            throw new Error(`Leaderboard submission failed with ${response.status}.`);
        }

        leaderboardMode = summary.mode;
        leaderboardScoresByMode.set(leaderboardMode, Array.isArray(data.scores) ? data.scores : []);
        setLeaderboardSubmitStatus();
    } catch (error) {
        console.warn("Leaderboard score could not be submitted:", error);
        setLeaderboardSubmitStatus("scoreSubmitFailed");
    }
}

function getLeaderboardPlayerName() {
    return dom.leaderboardPlayerName.value.trim().replace(/\s+/g, " ");
}

function isValidLeaderboardPlayerName(playerName = getLeaderboardPlayerName()) {
    const playerNameLength = Array.from(playerName).length;
    return playerNameLength >= 2 && playerNameLength <= 16;
}

function saveLeaderboardNickname() {
    const playerName = getLeaderboardPlayerName();
    const playerNameLength = Array.from(playerName).length;
    if (playerNameLength === 0) {
        dom.leaderboardPlayerName.value = "";
        localStorage.removeItem("goatRangeLeaderboardName");
        syncLeaderboardAutoSubmitAvailability(lastCompletedDrillSummary);
        setLeaderboardSubmitStatus("invalidNickname");
        return;
    }
    if (playerNameLength < 2 || playerNameLength > 16) {
        syncLeaderboardAutoSubmitAvailability(lastCompletedDrillSummary);
        setLeaderboardSubmitStatus("invalidNickname");
        return;
    }

    dom.leaderboardPlayerName.value = playerName;
    localStorage.setItem("goatRangeLeaderboardName", playerName);
    syncLeaderboardAutoSubmitAvailability(lastCompletedDrillSummary);
    setLeaderboardSubmitStatus(getLeaderboardIdleSubmitStatusKey());
}

function syncLeaderboardAutoSubmit() {
    if (dom.leaderboardAutoSubmit.disabled) {
        syncLeaderboardAutoSubmitAvailability(lastCompletedDrillSummary);
        setLeaderboardSubmitStatus(isValidLeaderboardPlayerName() ? "customSettingsLeaderboardBlocked" : "invalidNickname");
        return;
    }
    settings.leaderboardAutoSubmit = dom.leaderboardAutoSubmit.checked;
    localStorage.setItem("goatRangeLeaderboardAutoSubmit", String(settings.leaderboardAutoSubmit));
    setLeaderboardSubmitStatus(getLeaderboardIdleSubmitStatusKey());
}

function setNanoFeedbackStatus(key, value = "") {
    nanoFeedbackStatusKey = key;
    nanoFeedbackStatusValue = value;
    const message = t(key).replace("{progress}", value);
    dom.nanoFeedbackStatus.textContent = message;
    dom.nanoFeedbackStatus.classList.toggle("hidden", !message);
    dom.nanoFeedback.classList.toggle(
        "is-generating",
        key === "nanoPreparing" || key === "nanoDownloading" || key === "nanoAnalyzing"
    );
    dom.nanoFeedback.classList.remove("is-ready", "is-streaming");
}

function clearNanoFeedbackStatus() {
    nanoFeedbackStatusKey = "";
    nanoFeedbackStatusValue = "";
    dom.nanoFeedbackStatus.textContent = "";
    dom.nanoFeedbackStatus.classList.add("hidden");
    dom.nanoFeedback.classList.remove("is-generating");
}

function resetNanoFeedbackUi() {
    nanoCoachRequestId += 1;
    lastNanoFeedback = null;
    lastDrillSummary = null;
    dom.nanoFeedbackText.textContent = "";
    dom.nanoFeedbackText.classList.add("hidden");
    dom.nanoFeedbackRetry.classList.add("hidden");
    dom.nanoFeedback.classList.remove("is-ready", "is-streaming");
    setNanoFeedbackStatus("nanoPreparing");
}

function showNanoFeedbackFailure(key, canRetry = true) {
    setNanoFeedbackStatus(key);
    dom.nanoFeedbackText.textContent = "";
    dom.nanoFeedbackText.classList.add("hidden");
    dom.nanoFeedbackRetry.classList.toggle("hidden", !canRetry);
    dom.nanoFeedback.classList.remove("is-generating", "is-ready", "is-streaming");
}

async function checkNanoCoachAvailability() {
    if (!globalThis.LanguageModel) {
        nanoCoachAvailability = "unavailable";
        return nanoCoachAvailability;
    }

    try {
        nanoCoachAvailability = await globalThis.LanguageModel.availability();
    } catch (error) {
        console.warn("Gemini Nano availability could not be checked:", error);
        nanoCoachAvailability = "unknown";
    }
    return nanoCoachAvailability;
}

function prepareNanoCoach() {
    if (!globalThis.LanguageModel) {
        showNanoFeedbackFailure("nanoUnavailable", false);
        return Promise.resolve(null);
    }
    if (nanoCoachAvailability === "unavailable") {
        showNanoFeedbackFailure("nanoUnavailable", false);
        return Promise.resolve(null);
    }
    if (nanoCoachSession) {
        return Promise.resolve(nanoCoachSession);
    }
    if (nanoCoachSessionPromise) {
        return nanoCoachSessionPromise;
    }

    setNanoFeedbackStatus("nanoPreparing");
    nanoCoachSessionPromise = globalThis.LanguageModel.create({
        monitor(monitor) {
            monitor.addEventListener("downloadprogress", (event) => {
                const progress = `${Math.round(event.loaded * 100)}%`;
                setNanoFeedbackStatus("nanoDownloading", progress);
            });
        }
    }).then((session) => {
        nanoCoachSession = session;
        return session;
    }).catch((error) => {
        console.warn("Gemini Nano session could not be created:", error);
        nanoCoachSessionPromise = null;
        showNanoFeedbackFailure("nanoError");
        return null;
    });

    return nanoCoachSessionPromise;
}

function buildNanoCoachPrompt(summary, language) {
    const outputLanguage = language === "ko" ? "Korean" : "English";
    const languageInstructions = language === "ko" ? [
        "Write fluent, natural Korean used by a Korean aim-training coach. Avoid literal translations from English.",
        "This data is from one completed aim-training game session, not running exercise and not a daily report.",
        "Refer to the completed session as '\uc774\ubc88 \ud310' or '\uc774\ubc88 \uc5f0\uc2b5'. Refer to the next session as '\ub2e4\uc74c \ud310' or '\ub2e4\uc74c \uc5f0\uc2b5'.",
        "Use these Korean gaming terms when relevant: score = '\uc810\uc218', accuracy = '\uba85\uc911\ub960', hits = '\uba85\uc911 \ud69f\uc218', shots = '\ubc1c\uc0ac \ud69f\uc218', bestStreak = '\ucd5c\uace0 \uc5f0\uc18d \uba85\uc911', tracking accuracy = '\uc870\uc900 \uc720\uc9c0\uc728'.",
        "Never use these awkward phrases: '\uc624\ub298\uc758 \ub4dc\ub9b4', '\uc624\ub298\uc758 \ub2ec\ub9ac\uae30', '\ub2ec\ub9ac\uae30 \uc810\uc218', '\ub7f0 \uc810\uc218', '\uc0f7 \uc131\uacf5\ub960', '\uc20f \uc131\uacf5\ub960'."
    ] : [
        "Use natural aim-training vocabulary.",
        "This data is from one completed aim-training game session, not running exercise and not a daily report.",
        "Refer to it as this session or this attempt. Refer to the next one as the next session."
    ];
    return [
        "Act as an encouraging but practical aim-training coach running locally in a browser.",
        `Write the final feedback directly in ${outputLanguage}.`,
        ...languageInstructions,
        "Return only the natural-language feedback. Do not return JSON, markdown, headings, or labels.",
        "Write one compact paragraph of exactly 4 sentences.",
        "Sentence 1: summarize the result using the single most relevant metric.",
        "Sentence 2: mention one strength.",
        "Sentence 3: identify one improvement area.",
        "Sentence 4: give one concrete action for the next run.",
        "Do not repeat a metric, observation, compliment, or recommendation.",
        "Do not restate the result after sentence 1.",
        "Never restart the paragraph or repeat an earlier sentence.",
        "Keep the whole answer under 420 characters.",
        "Stop immediately after sentence 4.",
        `Drill data: ${JSON.stringify(summary)}`
    ].join("\n");
}

function normalizeNanoFeedbackText(text) {
    return String(text || "").replace(/\s+/g, " ").trim();
}

function splitNanoFeedbackSentences(text) {
    const sentences = [];
    let sentenceStart = 0;

    for (let index = 0; index < text.length; index += 1) {
        const character = text[index];
        if (!".!?\u3002\uff01\uff1f".includes(character)) {
            continue;
        }
        if (character === "." && /\d/.test(text[index - 1] || "") && /\d/.test(text[index + 1] || "")) {
            continue;
        }

        while (text[index + 1] && ".!?\u3002\uff01\uff1f".includes(text[index + 1])) {
            index += 1;
        }
        const sentence = text.slice(sentenceStart, index + 1).trim();
        if (sentence) {
            sentences.push(sentence);
        }
        sentenceStart = index + 1;
    }

    return {
        sentences,
        remainder: text.slice(sentenceStart).trim()
    };
}

function sanitizeNanoFeedbackText(text) {
    const normalizedText = normalizeNanoFeedbackText(text);
    const { sentences: parsedSentences, remainder } = splitNanoFeedbackSentences(normalizedText);
    const seenSentences = new Set();
    const sentences = [];

    for (const sentence of parsedSentences) {
        const sentenceKey = sentence.toLocaleLowerCase();
        if (seenSentences.has(sentenceKey) || sentences.length >= NANO_FEEDBACK_MAX_SENTENCES) {
            return sentences.join(" ");
        }
        seenSentences.add(sentenceKey);
        sentences.push(sentence);
        if (sentences.length >= NANO_FEEDBACK_MAX_SENTENCES) {
            return sentences.join(" ");
        }
    }

    const sanitizedText = [...sentences, remainder].filter(Boolean).join(" ");
    return sanitizedText.slice(0, NANO_FEEDBACK_MAX_CHARACTERS).trim();
}

function appendNanoFeedbackStreamChunk(text, chunk) {
    const chunkText = String(chunk || "");
    return chunkText.startsWith(text) ? chunkText : `${text}${chunkText}`;
}

function hasCompleteNanoFeedback(text) {
    return splitNanoFeedbackSentences(normalizeNanoFeedbackText(text)).sentences.length >= NANO_FEEDBACK_MAX_SENTENCES;
}

function hasRepeatedNanoFeedback(rawText, sanitizedText) {
    return normalizeNanoFeedbackText(rawText).length > normalizeNanoFeedbackText(sanitizedText).length + 48;
}

function renderNanoFeedback(feedback) {
    dom.nanoFeedback.classList.remove("is-ready", "is-streaming");
    dom.nanoFeedbackText.textContent = feedback.text;
    dom.nanoFeedbackText.classList.remove("hidden");
    dom.nanoFeedbackRetry.classList.add("hidden");
    clearNanoFeedbackStatus();
    void dom.nanoFeedback.offsetWidth;
    dom.nanoFeedback.classList.add("is-ready");
}

function beginNanoFeedbackStream() {
    clearNanoFeedbackStatus();
    dom.nanoFeedback.classList.remove("is-ready");
    dom.nanoFeedback.classList.add("is-streaming");
    dom.nanoFeedbackText.textContent = "";
    dom.nanoFeedbackText.classList.remove("hidden");
}

async function generateNanoFeedback(summary) {
    const requestId = ++nanoCoachRequestId;
    const language = activeLanguage;
    lastDrillSummary = summary;
    dom.nanoFeedbackText.textContent = "";
    dom.nanoFeedbackText.classList.add("hidden");
    dom.nanoFeedbackRetry.classList.add("hidden");
    dom.nanoFeedback.classList.remove("is-ready", "is-streaming");

    const session = await prepareNanoCoach();
    if (requestId !== nanoCoachRequestId || !session) {
        return;
    }

    setNanoFeedbackStatus("nanoAnalyzing");
    try {
        const stream = session.promptStreaming(buildNanoCoachPrompt(summary, language));
        let rawText = "";
        let text = "";
        for await (const chunk of stream) {
            if (requestId !== nanoCoachRequestId || language !== activeLanguage) {
                return;
            }
            if (!rawText) {
                beginNanoFeedbackStream();
            }
            rawText = appendNanoFeedbackStreamChunk(rawText, chunk);
            text = sanitizeNanoFeedbackText(rawText);
            dom.nanoFeedbackText.textContent = text;
            if (hasCompleteNanoFeedback(text) || hasRepeatedNanoFeedback(rawText, text)) {
                break;
            }
        }
        if (requestId !== nanoCoachRequestId || language !== activeLanguage) {
            return;
        }
        text = sanitizeNanoFeedbackText(text);
        if (!text) {
            throw new Error("Gemini Nano returned empty feedback.");
        }
        lastNanoFeedback = { text, language };
        renderNanoFeedback(lastNanoFeedback);
    } catch (error) {
        console.warn("Gemini Nano feedback could not be generated:", error);
        if (requestId === nanoCoachRequestId) {
            showNanoFeedbackFailure("nanoError");
        }
    }
}

function updateTrackingAim(delta) {
    if (!pickTarget()) {
        state.trackingStreakMs = 0;
        state.trackingToneElapsedMs = TRACKING_TONE_INTERVAL_MS;
        state.streak = 0;
        return;
    }

    const trackedMs = delta * 1000;
    state.trackingMs += trackedMs;
    state.trackingStreakMs += trackedMs;
    state.bestTrackingStreakMs = Math.max(state.bestTrackingStreakMs, state.trackingStreakMs);
    state.trackingToneElapsedMs += trackedMs;
    state.trackingScoreRemainder += delta * 100;
    if (state.trackingToneElapsedMs >= TRACKING_TONE_INTERVAL_MS) {
        state.trackingToneElapsedMs %= TRACKING_TONE_INTERVAL_MS;
        playTone(620, 0.035, "triangle", 0.032);
    }
    const points = Math.floor(state.trackingScoreRemainder);
    if (points > 0) {
        state.score += points;
        state.trackingScoreRemainder -= points;
    }
    state.streak = (state.trackingStreakMs / 1000).toFixed(1);
}

function updateTargets(delta) {
    const mode = getPracticeMode();
    for (const target of state.targets) {
        if (mode.aimOnly) {
            updateTrackingTargetVelocity(target, mode, delta);
        }
        target.age += delta;
        target.position[0] += target.velocity[0] * delta;
        target.position[1] += target.velocity[1] * delta;
        target.position[2] += target.velocity[2] * delta;

        if (target.position[0] < TARGET_BOUNDS.minX || target.position[0] > TARGET_BOUNDS.maxX) {
            target.velocity[0] *= -1;
        }
        if (target.position[1] < TARGET_BOUNDS.minY || target.position[1] > TARGET_BOUNDS.maxY) {
            target.velocity[1] *= -1;
        }
        if (target.position[2] < TARGET_BOUNDS.minZ || target.position[2] > TARGET_BOUNDS.maxZ) {
            target.velocity[2] *= -1;
        }

        target.position[0] = clamp(target.position[0], TARGET_BOUNDS.minX, TARGET_BOUNDS.maxX);
        target.position[1] = clamp(target.position[1], TARGET_BOUNDS.minY, TARGET_BOUNDS.maxY);
        target.position[2] = clamp(target.position[2], TARGET_BOUNDS.minZ, TARGET_BOUNDS.maxZ);
    }
}

function updateTrackingTargetVelocity(target, mode, delta) {
    target.directionChangeIn -= delta;
    if (target.directionChangeIn > 0) {
        return;
    }

    target.velocity = createTrackingVelocity(mode);
    target.directionChangeIn = randomRange(
        TRACKING_DIRECTION_CHANGE_SECONDS[0],
        TRACKING_DIRECTION_CHANGE_SECONDS[1]
    );
}

function shoot() {
    if (!state.active || state.paused) {
        return;
    }

    const mode = getPracticeMode();
    if (mode.aimOnly) {
        return;
    }
    state.shots += 1;
    const hit = pickTarget();

    if (hit) {
        state.hits += 1;
        state.streak += 1;
        state.bestStreak = Math.max(state.bestStreak, state.streak);
        const points = getTargetPoints(hit.target, mode, state.streak);
        state.score += points;
        state.targets[hit.index] = createTarget(hit.target.position);
        showHitMarker();
        showToast(`+${points}`);
        playTone(720 + Math.min(state.streak, 18) * 22, 0.045, "triangle", 0.08);
    } else {
        const penaltyTarget = state.targets[0];
        const penalty = penaltyTarget ? getTargetPoints(penaltyTarget, mode, state.streak + 1) : 0;
        state.streak = 0;
        if (penalty > 0) {
            state.score = Math.max(0, state.score - penalty);
            showToast(`${t("miss")} -${penalty}`);
        } else {
            showToast(t("miss"));
        }
        playTone(130, 0.07, "sawtooth", 0.045);
    }

    updateHud();
}

function getTargetPoints(target, mode, streak) {
    const bonus = Math.min(90, streak * 6);
    return Math.round((85 / target.baseRadius + bonus) * mode.scoreScale);
}

function pickTarget() {
    let best = null;
    for (let i = 0; i < state.targets.length; i += 1) {
        const target = state.targets[i];
        const t = raySphere(state.camera, state.forward, target.position, target.radius);
        if (t !== null && (!best || t < best.t)) {
            best = { target, index: i, t };
        }
    }
    return best;
}

function createTarget(previousPosition = null) {
    const mode = getPracticeMode();
    const isTracking = mode.aimOnly;
    let position = [
        randomRange(TARGET_BOUNDS.minX, TARGET_BOUNDS.maxX),
        randomRange(TARGET_BOUNDS.minY, TARGET_BOUNDS.maxY),
        isTracking ? -11.5 : randomRange(TARGET_BOUNDS.minZ, TARGET_BOUNDS.maxZ)
    ];

    if (previousPosition) {
        for (let i = 0; i < 8 && distance(position, previousPosition) < mode.minRespawnDistance; i += 1) {
            position = [
                randomRange(TARGET_BOUNDS.minX, TARGET_BOUNDS.maxX),
                randomRange(TARGET_BOUNDS.minY, TARGET_BOUNDS.maxY),
                randomRange(TARGET_BOUNDS.minZ, TARGET_BOUNDS.maxZ)
            ];
        }
    }

    const baseRadius = randomRange(mode.radius[0], mode.radius[1]);
    return {
        position,
        velocity: isTracking
            ? createTrackingVelocity(mode)
            : [
                randomRange(-mode.velocity[0], mode.velocity[0]),
                randomRange(-mode.velocity[1], mode.velocity[1]),
                randomRange(-mode.velocity[2], mode.velocity[2])
            ],
        baseRadius,
        radius: baseRadius,
        color: hexToGpuColor(mode.color),
        age: Math.random() * 10,
        directionChangeIn: isTracking
            ? randomRange(TRACKING_DIRECTION_CHANGE_SECONDS[0], TRACKING_DIRECTION_CHANGE_SECONDS[1])
            : Infinity
    };
}

function createTrackingVelocity(mode) {
    return [
        randomSignedRange(mode.velocity[0] * 0.18, mode.velocity[0]),
        mode.velocity[1] > 0 ? randomSignedRange(mode.velocity[1] * 0.18, mode.velocity[1]) : 0,
        0
    ];
}

function updateForward() {
    const cosPitch = Math.cos(state.pitch);
    state.forward = normalize([
        Math.sin(state.yaw) * cosPitch,
        Math.sin(state.pitch),
        -Math.cos(state.yaw) * cosPitch
    ]);
}

function getThemeRenderColors() {
    if (document.documentElement.dataset.theme?.endsWith("light")) {
        return {
            clear: { r: 0.84, g: 0.92, b: 0.95, a: 1 },
            arena: [0.72, 0.84, 0.88, 0],
            theme: 1
        };
    }

    return {
        clear: { r: 0.015, g: 0.019, b: 0.032, a: 1 },
        arena: [0.04, 0.06, 0.11, 0],
        theme: 0
    };
}

function render() {
    if (!gpu) {
        return;
    }

    resizeCanvas();
    const { device, context, pipeline, arena, sphere } = gpu;
    const textureView = context.getCurrentTexture().createView();
    const depthView = gpu.depthTexture.createView();
    const themeColors = getThemeRenderColors();
    const encoder = device.createCommandEncoder();
    const pass = encoder.beginRenderPass({
        colorAttachments: [{
            view: textureView,
            clearValue: themeColors.clear,
            loadOp: "clear",
            storeOp: "store"
        }],
        depthStencilAttachment: {
            view: depthView,
            depthClearValue: 1,
            depthLoadOp: "clear",
            depthStoreOp: "store"
        }
    });

    const aspect = Math.max(1, gpu.canvasWidth) / Math.max(1, gpu.canvasHeight);
    const projection = mat4Perspective(horizontalFovToVerticalRadians(settings.fov), aspect, 0.05, 60);
    const view = mat4LookAt(state.camera, add(state.camera, state.forward), [0, 1, 0]);
    const viewProj = mat4Multiply(projection, view);

    pass.setPipeline(pipeline);

    let drawSlot = 0;
    drawMesh(pass, drawSlot, arena, viewProj, mat4Identity(), themeColors.arena, [-0.35, -0.85, -0.45, themeColors.theme]);

    for (const target of state.targets) {
        drawSlot += 1;
        const pulse = 1 + Math.sin(target.age * 5.2) * 0.045;
        target.radius = target.baseRadius * pulse;
        const model = mat4Compose(target.position, [target.radius, target.radius, target.radius]);
        drawMesh(pass, drawSlot, sphere, viewProj, model, target.color, [-0.25, -0.75, -0.55, themeColors.theme]);
    }

    pass.end();
    device.queue.submit([encoder.finish()]);
}

function drawMesh(pass, slotIndex, mesh, viewProj, model, color, lightDir) {
    const uniforms = new Float32Array(40);
    uniforms.set(viewProj, 0);
    uniforms.set(model, 16);
    uniforms.set(color, 32);
    uniforms.set(lightDir, 36);
    const slot = gpu.uniformSlots[slotIndex];
    gpu.device.queue.writeBuffer(slot.buffer, 0, uniforms);
    pass.setBindGroup(0, slot.bindGroup);
    pass.setVertexBuffer(0, mesh.vertexBuffer);
    pass.setIndexBuffer(mesh.indexBuffer, "uint32");
    pass.drawIndexed(mesh.indexCount);
}

function resizeCanvas() {
    const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.floor(dom.canvas.clientWidth * devicePixelRatio));
    const height = Math.max(1, Math.floor(dom.canvas.clientHeight * devicePixelRatio));

    if (gpu.canvasWidth === width && gpu.canvasHeight === height) {
        return;
    }

    gpu.canvasWidth = width;
    gpu.canvasHeight = height;
    dom.canvas.width = width;
    dom.canvas.height = height;
    gpu.context.configure({
        device: gpu.device,
        format: gpu.format,
        alphaMode: "opaque"
    });
    gpu.depthTexture?.destroy();
    gpu.depthTexture = gpu.device.createTexture({
        size: [width, height],
        format: "depth24plus",
        usage: GPUTextureUsage.RENDER_ATTACHMENT
    });
}

function createGpuMesh(device, mesh) {
    const vertexBuffer = device.createBuffer({
        size: mesh.vertices.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    });
    const indexBuffer = device.createBuffer({
        size: mesh.indices.byteLength,
        usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
    });
    device.queue.writeBuffer(vertexBuffer, 0, mesh.vertices);
    device.queue.writeBuffer(indexBuffer, 0, mesh.indices);
    return { vertexBuffer, indexBuffer, indexCount: mesh.indices.length };
}

function createSphereMesh(segments, rings) {
    const vertices = [];
    const indices = [];

    for (let y = 0; y <= rings; y += 1) {
        const v = y / rings;
        const theta = v * Math.PI;
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

        for (let x = 0; x <= segments; x += 1) {
            const u = x / segments;
            const phi = u * Math.PI * 2;
            const sinPhi = Math.sin(phi);
            const cosPhi = Math.cos(phi);
            const nx = cosPhi * sinTheta;
            const ny = cosTheta;
            const nz = sinPhi * sinTheta;
            vertices.push(nx, ny, nz, nx, ny, nz);
        }
    }

    for (let y = 0; y < rings; y += 1) {
        for (let x = 0; x < segments; x += 1) {
            const a = y * (segments + 1) + x;
            const b = a + segments + 1;
            indices.push(a, b, a + 1);
            indices.push(b, b + 1, a + 1);
        }
    }

    return {
        vertices: new Float32Array(vertices),
        indices: new Uint32Array(indices)
    };
}

function createArenaMesh() {
    const vertices = [];
    const indices = [];

    const addQuad = (points, normal) => {
        const offset = vertices.length / 6;
        for (const point of points) {
            vertices.push(point[0], point[1], point[2], normal[0], normal[1], normal[2]);
        }
        indices.push(offset, offset + 1, offset + 2, offset, offset + 2, offset + 3);
    };

    addQuad([[-10, 0, 4], [10, 0, 4], [10, 0, -18], [-10, 0, -18]], [0, 1, 0]);
    addQuad([[-10, 0, -18], [10, 0, -18], [10, 6, -18], [-10, 6, -18]], [0, 0, 1]);
    addQuad([[-10, 0, 4], [-10, 0, -18], [-10, 6, -18], [-10, 6, 4]], [1, 0, 0]);
    addQuad([[10, 0, -18], [10, 0, 4], [10, 6, 4], [10, 6, -18]], [-1, 0, 0]);
    addQuad([[-10, 6, -18], [10, 6, -18], [10, 6, 4], [-10, 6, 4]], [0, -1, 0]);

    return {
        vertices: new Float32Array(vertices),
        indices: new Uint32Array(indices)
    };
}

function mat4Identity() {
    return new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
}

function mat4Compose(position, scale) {
    return new Float32Array([
        scale[0], 0, 0, 0,
        0, scale[1], 0, 0,
        0, 0, scale[2], 0,
        position[0], position[1], position[2], 1
    ]);
}

function mat4Perspective(fovy, aspect, near, far) {
    const f = 1 / Math.tan(fovy / 2);
    const nf = 1 / (near - far);
    return new Float32Array([
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, far * nf, -1,
        0, 0, far * near * nf, 0
    ]);
}

function mat4LookAt(eye, center, up) {
    const z = normalize(subtract(eye, center));
    const x = normalize(cross(up, z));
    const y = cross(z, x);

    return new Float32Array([
        x[0], y[0], z[0], 0,
        x[1], y[1], z[1], 0,
        x[2], y[2], z[2], 0,
        -dot(x, eye), -dot(y, eye), -dot(z, eye), 1
    ]);
}

function mat4Multiply(a, b) {
    const out = new Float32Array(16);
    for (let col = 0; col < 4; col += 1) {
        for (let row = 0; row < 4; row += 1) {
            out[col * 4 + row] =
                a[0 * 4 + row] * b[col * 4 + 0] +
                a[1 * 4 + row] * b[col * 4 + 1] +
                a[2 * 4 + row] * b[col * 4 + 2] +
                a[3 * 4 + row] * b[col * 4 + 3];
        }
    }
    return out;
}

function raySphere(origin, direction, center, radius) {
    const oc = subtract(origin, center);
    const b = dot(oc, direction);
    const c = dot(oc, oc) - radius * radius;
    const h = b * b - c;
    if (h < 0) {
        return null;
    }
    const t = -b - Math.sqrt(h);
    return t > 0 ? t : null;
}

function add(a, b) {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function subtract(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function cross(a, b) {
    return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
    ];
}

function normalize(value) {
    const length = Math.hypot(value[0], value[1], value[2]) || 1;
    return [value[0] / length, value[1] / length, value[2] / length];
}

function distance(a, b) {
    return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function horizontalFovToVerticalRadians(horizontalDegrees) {
    const horizontalRadians = clamp(horizontalDegrees, 50, 110) * Math.PI / 180;
    return 2 * Math.atan(Math.tan(horizontalRadians / 2) / FOV_REFERENCE_ASPECT);
}

function randomRange(min, max) {
    return min + Math.random() * (max - min);
}

function randomSignedRange(min, max) {
    return randomRange(min, max) * (Math.random() < 0.5 ? -1 : 1);
}

function showHitMarker() {
    dom.hitMarker.classList.remove("active");
    void dom.hitMarker.offsetWidth;
    dom.hitMarker.classList.add("active");
}

let toastTimer = 0;
function showToast(text, persistent = false) {
    dom.toast.textContent = text;
    dom.toast.classList.add("visible");
    clearTimeout(toastTimer);
    if (persistent) {
        return;
    }
    toastTimer = window.setTimeout(() => {
        dom.toast.classList.remove("visible");
    }, 620);
}

function ensureAudio() {
    if (!settings.soundEffects || audio) {
        return;
    }
    audio = new AudioContext();
}

function playTone(frequency, duration, type, volume) {
    if (!settings.soundEffects || !audio) {
        return;
    }
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(volume, audio.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start();
    oscillator.stop(audio.currentTime + duration + 0.02);
}

function playButtonClickSound(event) {
    const button = event.target.closest?.("button");
    if (!button || button.disabled || !settings.soundEffects) {
        return;
    }

    ensureAudio();
    if (!audio) {
        return;
    }

    const play = () => playTone(420, 0.045, "triangle", 0.035);
    if (audio.state === "suspended") {
        void audio.resume().then(play).catch(() => {});
        return;
    }
    play();
}

function openPauseMenu() {
    if (!state.active) {
        return;
    }

    state.paused = true;
    state.pauseMenuOpen = true;
    state.resumePending = false;
    state.resumeClickRequired = false;
    state.resumeAttemptId += 1;
    state.lockFallback = false;
    dom.pauseMenu.classList.remove("hidden");

    if (document.pointerLockElement === dom.canvas) {
        document.exitPointerLock();
    }

    showToast(t("pausedToast"));
}

function resumeGame() {
    if (!state.active) {
        return;
    }
    if (state.resumePending) {
        requestAimLock();
        return;
    }

    state.paused = true;
    state.pauseMenuOpen = false;
    state.settingsOpen = false;
    state.resumePending = true;
    state.resumeClickRequired = false;
    const resumeAttemptId = ++state.resumeAttemptId;
    state.returnToPauseFromSettings = false;
    state.resumeIgnorePointerUnlockUntil = performance.now() + 350;
    state.suppressShootUntil = performance.now() + 450;
    dom.pauseMenu.classList.add("hidden");
    dom.settingsOverlay.classList.add("hidden");
    requestAimLock();
    showToast(t("clickToResume"), true);
    if (document.pointerLockElement === dom.canvas) {
        finishResume();
        return;
    }

    window.setTimeout(() => {
        if (!state.active || !state.resumePending || state.resumeAttemptId !== resumeAttemptId) {
            return;
        }
        if (document.pointerLockElement === dom.canvas) {
            finishResume();
            return;
        }
        state.resumePending = false;
        state.resumeClickRequired = true;
        state.pauseMenuOpen = false;
        showToast(t("clickToResume"), true);
    }, 450);
}

function finishResume() {
    if (!state.active) {
        return;
    }
    if (document.pointerLockElement !== dom.canvas) {
        requestAimLock();
        return;
    }

    state.paused = false;
    state.resumePending = false;
    state.resumeClickRequired = false;
    state.resumeAttemptId += 1;
    state.pauseMenuOpen = false;
    state.settingsOpen = false;
    state.returnToPauseFromSettings = false;
    state.suppressShootUntil = performance.now() + 450;
    dom.pauseMenu.classList.add("hidden");
    dom.settingsOverlay.classList.add("hidden");
    showToast(t("live"));
}

function returnToStart() {
    stopGame();
    dom.gameScreen.classList.add("hidden");
    dom.resultScreen.classList.add("hidden");
    dom.startScreen.classList.remove("hidden");
    void loadLeaderboard(settings.practiceMode);
}

function requestAimLock() {
    if (document.pointerLockElement === dom.canvas) {
        if (state.active && state.resumePending) {
            finishResume();
        }
        return;
    }
    if (document.pointerLockElement !== dom.canvas) {
        dom.canvas.focus({ preventScroll: true });
        const handleLockRequest = (lockRequest, triedRawInput = false) => {
            lockRequest?.then?.(() => {
                if (state.active && state.resumePending && document.pointerLockElement === dom.canvas) {
                    finishResume();
                }
            }).catch?.(() => {
                if (triedRawInput && document.pointerLockElement !== dom.canvas) {
                    requestPointerLockFallback();
                }
            });
        };
        const requestPointerLockFallback = () => {
            try {
                handleLockRequest(dom.canvas.requestPointerLock?.());
            } catch {
            }
        };

        try {
            handleLockRequest(dom.canvas.requestPointerLock?.({ unadjustedMovement: true }), true);
        } catch {
            requestPointerLockFallback();
        }
    }
}

function getPracticeMode() {
    const modeKey = PRACTICE_MODES[settings.practiceMode] ? settings.practiceMode : DEFAULT_MODE;
    const mode = PRACTICE_MODES[modeKey];
    const options = practiceSettings[modeKey];

    if (modeKey === "precision") {
        return {
            ...mode,
            duration: options.duration,
            targetCount: options.targetCount,
            radius: [options.radius, options.radius],
            color: options.color
        };
    }
    if (modeKey === "reflex") {
        return { ...mode, duration: options.duration, color: options.color };
    }

    return {
        ...mode,
        duration: options.duration,
        radius: [options.radius, options.radius],
        color: options.color,
        velocity: options.movement === "horizontal"
            ? [options.speed, 0, 0]
            : [options.speed, options.speed * 0.62, 0]
    };
}

function getHighScoreKey(modeKey) {
    return `goatRangeHighScore_${PRACTICE_MODES[modeKey] ? modeKey : DEFAULT_MODE}`;
}

function getHighScore(modeKey) {
    const score = Number(localStorage.getItem(getHighScoreKey(modeKey)));
    if (Number.isFinite(score) && score >= 0) {
        return score;
    }
    return 0;
}

function syncModeUi(shouldStore = true) {
    const modeKey = PRACTICE_MODES[settings.practiceMode] ? settings.practiceMode : DEFAULT_MODE;
    settings.practiceMode = modeKey;
    highScore = getHighScore(modeKey);
    dom.highScore.textContent = highScore;
    dom.finalHighScore.textContent = highScore;
    dom.modeButtons.forEach((button) => {
        const isActive = button.dataset.practiceMode === modeKey;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
    syncPracticeSettingsUi(shouldStore);

    if (shouldStore) {
        localStorage.setItem("goatRangePracticeMode", modeKey);
    }
}

function syncPracticeSettingsUi(shouldStore = true) {
    dom.modeOptionPanels.forEach((panel) => {
        panel.classList.toggle("hidden", panel.dataset.modeOptions !== settings.practiceMode);
    });
    dom.precisionRadiusValue.value = String(practiceSettings.precision.radius);
    dom.precisionRadiusRange.value = String(practiceSettings.precision.radius);
    dom.precisionTargetCountValue.value = String(practiceSettings.precision.targetCount);
    dom.precisionTargetCountRange.value = String(practiceSettings.precision.targetCount);
    dom.precisionDurationValue.value = String(practiceSettings.precision.duration);
    dom.precisionDurationRange.value = String(practiceSettings.precision.duration);
    dom.precisionColor.value = practiceSettings.precision.color;
    dom.reflexDurationValue.value = String(practiceSettings.reflex.duration);
    dom.reflexDurationRange.value = String(practiceSettings.reflex.duration);
    dom.reflexColor.value = practiceSettings.reflex.color;
    dom.trackingSpeedValue.value = String(practiceSettings.tracking.speed);
    dom.trackingSpeedRange.value = String(practiceSettings.tracking.speed);
    dom.trackingRadiusValue.value = String(practiceSettings.tracking.radius);
    dom.trackingRadiusRange.value = String(practiceSettings.tracking.radius);
    dom.trackingDurationValue.value = String(practiceSettings.tracking.duration);
    dom.trackingDurationRange.value = String(practiceSettings.tracking.duration);
    dom.trackingMovement.value = practiceSettings.tracking.movement;
    dom.trackingColor.value = practiceSettings.tracking.color;
    syncPracticeSettingsWarning();

    if (!shouldStore) {
        return;
    }

    localStorage.setItem("goatRangePrecisionRadius", String(practiceSettings.precision.radius));
    localStorage.setItem("goatRangePrecisionTargetCount", String(practiceSettings.precision.targetCount));
    localStorage.setItem("goatRangePrecisionDuration", String(practiceSettings.precision.duration));
    localStorage.setItem("goatRangePrecisionColor", practiceSettings.precision.color);
    localStorage.setItem("goatRangeReflexDuration", String(practiceSettings.reflex.duration));
    localStorage.setItem("goatRangeReflexColor", practiceSettings.reflex.color);
    localStorage.setItem("goatRangeTrackingSpeed", String(practiceSettings.tracking.speed));
    localStorage.setItem("goatRangeTrackingRadius", String(practiceSettings.tracking.radius));
    localStorage.setItem("goatRangeTrackingDuration", String(practiceSettings.tracking.duration));
    localStorage.setItem("goatRangeTrackingMovement", practiceSettings.tracking.movement);
    localStorage.setItem("goatRangeTrackingColor", practiceSettings.tracking.color);
}

function arePracticeSettingValuesEqual(value, defaultValue) {
    if (typeof defaultValue === "string") {
        return String(value).toLowerCase() === defaultValue.toLowerCase();
    }
    return value === defaultValue;
}

function isPracticeSettingsDefault(modeKey, options = practiceSettings[modeKey]) {
    const defaults = PRACTICE_SETTINGS_DEFAULTS[modeKey];
    const leaderboardSettingKeys = LEADERBOARD_SETTING_KEYS[modeKey];
    return Boolean(
        defaults
        && options
        && leaderboardSettingKeys
        && leaderboardSettingKeys.every((key) => (
            arePracticeSettingValuesEqual(options[key], defaults[key])
        ))
    );
}

function isLeaderboardEligibleSummary(summary) {
    return Boolean(summary && isPracticeSettingsDefault(summary.mode, summary.options));
}

function getLeaderboardIdleSubmitStatusKey() {
    if (lastCompletedDrillSummary && !isLeaderboardEligibleSummary(lastCompletedDrillSummary)) {
        return "customSettingsLeaderboardBlocked";
    }
    if (!isValidLeaderboardPlayerName()) {
        return "invalidNickname";
    }
    return settings.leaderboardAutoSubmit ? "" : "leaderboardAutoSubmitOff";
}

function syncLeaderboardAutoSubmitAvailability(summary = lastCompletedDrillSummary) {
    const isBlocked = !isValidLeaderboardPlayerName() || Boolean(summary && !isLeaderboardEligibleSummary(summary));
    if (isBlocked && settings.leaderboardAutoSubmit) {
        settings.leaderboardAutoSubmit = false;
        localStorage.setItem("goatRangeLeaderboardAutoSubmit", "false");
    }
    dom.leaderboardAutoSubmit.disabled = isBlocked;
    dom.leaderboardAutoSubmit.checked = isBlocked ? false : settings.leaderboardAutoSubmit;
    dom.leaderboardAutoSubmit.closest(".leaderboard-auto-submit-row")?.classList.toggle("is-disabled", isBlocked);
}

function syncPracticeSettingsWarning() {
    const isDefault = isPracticeSettingsDefault(settings.practiceMode);
    dom.practiceSettingsWarning.textContent = isDefault ? "" : t("customSettingsLeaderboardBlocked");
    dom.practiceSettingsWarning.classList.toggle("hidden", isDefault);
}

function resetPracticeSettings(modeKey) {
    if (!PRACTICE_SETTINGS_DEFAULTS[modeKey] || !practiceSettings[modeKey]) {
        return;
    }
    const color = practiceSettings[modeKey].color;
    Object.assign(practiceSettings[modeKey], PRACTICE_SETTINGS_DEFAULTS[modeKey], { color });
    syncPracticeSettingsUi();
}

function readPracticeModeSetting() {
    const mode = localStorage.getItem("goatRangePracticeMode");
    return PRACTICE_MODES[mode] ? mode : DEFAULT_MODE;
}

function readTrackingMovementSetting() {
    const movement = localStorage.getItem("goatRangeTrackingMovement");
    return TRACKING_MOVEMENT_TYPES.includes(movement) ? movement : "random";
}

function bindPracticeRange(valueInput, rangeInput, modeKey, optionKey, min, max, shouldRound = false) {
    const update = (rawValue, shouldClamp = true) => {
        const fallback = practiceSettings[modeKey][optionKey];
        const parsedValue = Number(rawValue);
        if (!shouldClamp && (!Number.isFinite(parsedValue) || parsedValue < min || parsedValue > max)) {
            return;
        }
        const boundedValue = clamp(Number.isFinite(parsedValue) ? parsedValue : fallback, min, max);
        practiceSettings[modeKey][optionKey] = shouldRound ? Math.round(boundedValue) : boundedValue;
        syncPracticeSettingsUi();
    };
    valueInput.addEventListener("input", () => update(valueInput.value, false));
    valueInput.addEventListener("change", () => update(valueInput.value));
    rangeInput.addEventListener("input", () => update(rangeInput.value));
}

function bindPracticeColor(colorInput, modeKey) {
    colorInput.addEventListener("input", () => {
        practiceSettings[modeKey].color = /^#[0-9a-f]{6}$/i.test(colorInput.value)
            ? colorInput.value
            : PRACTICE_SETTINGS_DEFAULTS[modeKey].color;
        syncPracticeSettingsUi();
    });
}

function readLanguageSetting() {
    const language = localStorage.getItem("goatRangeLanguage");
    return language === "ko" || language === "en" || language === "auto" ? language : "auto";
}

function readThemeSetting() {
    const theme = localStorage.getItem("goatRangeTheme");
    const migratedTheme = {
        "purple-dark": "purple-orange-dark",
        "orange-dark": "purple-orange-dark",
        "purple-light": "purple-orange-light",
        "orange-light": "purple-orange-light"
    }[theme] || theme;
    return ["auto", "dark", "light", "purple-orange-dark", "purple-orange-light"].includes(migratedTheme)
        ? migratedTheme
        : "auto";
}

function resolveLanguage(languageMode) {
    if (SUPPORTED_LANGUAGES.includes(languageMode)) {
        return languageMode;
    }

    const languages = navigator.languages?.length ? navigator.languages : [navigator.language || "en"];
    return languages.some((language) => language.toLowerCase().startsWith("ko")) ? "ko" : "en";
}

function t(key) {
    return I18N[activeLanguage]?.[key] || I18N.en[key] || key;
}

function applyLanguage() {
    activeLanguage = resolveLanguage(settings.languageMode);
    document.documentElement.lang = activeLanguage;
    document.title = t("title");
    dom.languageSelect.value = settings.languageMode;

    document.querySelectorAll("[data-i18n]").forEach((element) => {
        element.textContent = t(element.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
        element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
    });
    setLeaderboardStatus(leaderboardStatusKey);
    setLeaderboardSubmitStatus(leaderboardSubmitStatusKey);
    syncPracticeSettingsWarning();
    if (lastCompletedDrillSummary) {
        renderResultModeSettings(lastCompletedDrillSummary);
    }
    setNanoFeedbackStatus(nanoFeedbackStatusKey, nanoFeedbackStatusValue);
    if (lastNanoFeedback?.language === activeLanguage) {
        renderNanoFeedback(lastNanoFeedback);
    } else if (lastDrillSummary && !dom.resultScreen.classList.contains("hidden")) {
        void generateNanoFeedback(lastDrillSummary);
    }

    dom.settingsBtn.setAttribute("aria-label", t("settings"));
    dom.canvas.setAttribute("aria-label", activeLanguage === "ko" ? "3D \uc5d0\uc784 \ud6c8\ub828\uc7a5" : "3D aim training arena");
    dom.gameScreen.querySelector(".hud-panel")?.setAttribute(
        "aria-label",
        activeLanguage === "ko" ? "\ud6c8\ub828 \uae30\ub85d" : "match stats"
    );
    dom.settingsOverlay.querySelector(".settings-panel")?.setAttribute("aria-label", t("settings"));
    dom.settingsOverlay.querySelector("#crosshair-preset-grid")?.setAttribute(
        "aria-label",
        activeLanguage === "ko" ? "\uc870\uc900\uc120 \ud504\ub9ac\uc14b" : "crosshair presets"
    );
    syncModeUi(false);
    syncCrosshairUi(false);
    syncSensitivityUi(false);
}
function readProfileSetting() {
    const profile = localStorage.getItem("goatRangeSensitivityProfile");
    return SENSITIVITY_PROFILES[profile] ? profile : "overwatch";
}

function readNumberSetting(key, fallback) {
    const value = Number(localStorage.getItem(key));
    return Number.isFinite(value) && value > 0 ? value : fallback;
}

function readBoundedNumberSetting(key, fallback, min, max) {
    const rawValue = localStorage.getItem(key);
    if (rawValue === null) {
        return fallback;
    }

    const value = Number(rawValue);
    return Number.isFinite(value) ? clamp(value, min, max) : fallback;
}

function readColorSetting(key, fallback) {
    const value = localStorage.getItem(key);
    return /^#[0-9a-f]{6}$/i.test(value || "") ? value : fallback;
}

function hexToRgba(hex, alpha = 1) {
    const value = /^#[0-9a-f]{6}$/i.test(hex) ? hex.slice(1) : DEFAULT_CROSSHAIR.color.slice(1);
    const red = parseInt(value.slice(0, 2), 16);
    const green = parseInt(value.slice(2, 4), 16);
    const blue = parseInt(value.slice(4, 6), 16);
    return `rgba(${red}, ${green}, ${blue}, ${clamp(alpha, 0, 1)})`;
}

function hexToGpuColor(hex) {
    const value = /^#[0-9a-f]{6}$/i.test(hex) ? hex.slice(1) : DEFAULT_BALL_COLOR.slice(1);
    return [
        parseInt(value.slice(0, 2), 16) / 255,
        parseInt(value.slice(2, 4), 16) / 255,
        parseInt(value.slice(4, 6), 16) / 255,
        1
    ];
}

function getSettingsCrosshairProfile() {
    const profile = {};
    CROSSHAIR_COMMON_KEYS.forEach((key) => {
        profile[key] = settings[key];
    });
    CROSSHAIR_BUILDER_KEYS.forEach((key) => {
        profile[key] = settings[key];
    });
    CROSSHAIR_VALORANT_KEYS.forEach((key) => {
        profile[key] = settings[key];
    });
    return normalizeCrosshairProfile(settings.crosshairPreset, profile);
}

function saveActiveCrosshairProfile() {
    if (!settings.crosshairProfiles || !CROSSHAIR_PRESETS.includes(settings.crosshairPreset)) {
        return;
    }
    settings.crosshairProfiles[settings.crosshairPreset] = getSettingsCrosshairProfile();
}

function applyCrosshairProfileToSettings(preset) {
    const profile = normalizeCrosshairProfile(preset, settings.crosshairProfiles?.[preset]);
    settings.crosshairProfiles[preset] = profile;
    CROSSHAIR_COMMON_KEYS.forEach((key) => {
        settings[key] = profile[key];
    });
    CROSSHAIR_BUILDER_KEYS.forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(profile, key)) {
            settings[key] = profile[key];
        }
    });
    CROSSHAIR_VALORANT_KEYS.forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(profile, key)) {
            settings[key] = profile[key];
        }
    });
}

function activateCrosshairProfile(preset) {
    if (!CROSSHAIR_PRESETS.includes(preset)) {
        return;
    }
    settings.crosshairPreset = preset;
    applyCrosshairProfileToSettings(preset);
}

function resetActiveCrosshairPreset() {
    const preset = settings.crosshairPreset;
    settings.crosshairProfiles[preset] = createDefaultCrosshairProfile(preset);
    activateCrosshairProfile(preset);
    syncCrosshairUi();
    void deletePersistedCrosshairImage().catch(() => {});
}

function readCrosshairPreset() {
    const preset = localStorage.getItem("goatRangeCrosshairPreset");
    return CROSSHAIR_PRESETS.includes(preset) ? preset : "custom";
}

function readCrosshairImage() {
    try {
        const image = localStorage.getItem("goatRangeCrosshairImage") || "";
        return image.startsWith("data:image/") ? image : "";
    } catch {
        return "";
    }
}

function openCrosshairImageDb() {
    return new Promise((resolve, reject) => {
        if (!("indexedDB" in window)) {
            reject(new Error("IndexedDB unavailable"));
            return;
        }

        const request = indexedDB.open(CROSSHAIR_IMAGE_DB_NAME, 1);
        request.addEventListener("upgradeneeded", () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(CROSSHAIR_IMAGE_STORE_NAME)) {
                db.createObjectStore(CROSSHAIR_IMAGE_STORE_NAME);
            }
        });
        request.addEventListener("success", () => resolve(request.result));
        request.addEventListener("error", () => reject(request.error || new Error("IndexedDB open failed")));
    });
}

function readPersistedCrosshairImage() {
    return openCrosshairImageDb().then((db) => new Promise((resolve, reject) => {
        const transaction = db.transaction(CROSSHAIR_IMAGE_STORE_NAME, "readonly");
        const store = transaction.objectStore(CROSSHAIR_IMAGE_STORE_NAME);
        const request = store.get(CUSTOM_CROSSHAIR_IMAGE_KEY);
        request.addEventListener("success", () => {
            const image = typeof request.result === "string" && request.result.startsWith("data:image/")
                ? request.result
                : "";
            db.close();
            resolve(image);
        });
        request.addEventListener("error", () => {
            db.close();
            reject(request.error || new Error("Image read failed"));
        });
    }));
}

function writePersistedCrosshairImage(image) {
    return openCrosshairImageDb().then((db) => new Promise((resolve, reject) => {
        const transaction = db.transaction(CROSSHAIR_IMAGE_STORE_NAME, "readwrite");
        const store = transaction.objectStore(CROSSHAIR_IMAGE_STORE_NAME);
        const request = store.put(image, CUSTOM_CROSSHAIR_IMAGE_KEY);
        request.addEventListener("success", () => {
            db.close();
            resolve();
        });
        request.addEventListener("error", () => {
            db.close();
            reject(request.error || new Error("Image write failed"));
        });
    }));
}

function deletePersistedCrosshairImage() {
    return openCrosshairImageDb().then((db) => new Promise((resolve, reject) => {
        const transaction = db.transaction(CROSSHAIR_IMAGE_STORE_NAME, "readwrite");
        const store = transaction.objectStore(CROSSHAIR_IMAGE_STORE_NAME);
        const request = store.delete(CUSTOM_CROSSHAIR_IMAGE_KEY);
        request.addEventListener("success", () => {
            db.close();
            resolve();
        });
        request.addEventListener("error", () => {
            db.close();
            reject(request.error || new Error("Image delete failed"));
        });
    }));
}

async function loadPersistedCrosshairImage() {
    try {
        const image = await readPersistedCrosshairImage();
        if (!image || settings.crosshairProfiles.custom?.crosshairImage) {
            return;
        }
        settings.crosshairProfiles.custom = normalizeCrosshairProfile("custom", {
            ...settings.crosshairProfiles.custom,
            crosshairImage: image
        });
        if (settings.crosshairPreset === "custom") {
            activateCrosshairProfile("custom");
        }
        syncCrosshairUi(false);
    } catch {
        // Uploaded images still work for the current session if persistent storage is unavailable.
    }
}

function createDefaultCrosshairProfile(preset) {
    const presetSettings = CROSSHAIR_PRESET_SETTINGS[preset] || CROSSHAIR_PRESET_SETTINGS.custom;
    const profile = {
        crosshairSize: presetSettings.size,
        crosshairColor: presetSettings.color,
        crosshairThickness: presetSettings.thickness,
        crosshairGap: presetSettings.gap,
        crosshairOpacity: presetSettings.opacity,
        crosshairOutline: presetSettings.outline,
        crosshairDotSize: presetSettings.dotSize,
        crosshairImage: ""
    };

    if (preset === "custom") {
        profile.crosshairSize = CROSSHAIR_CANVAS_SIZE;
        profile.crosshairColor = "#ffffff";
        profile.crosshairThickness = DEFAULT_CROSSHAIR.thickness;
        profile.crosshairGap = DEFAULT_CROSSHAIR.gap;
        profile.crosshairOpacity = DEFAULT_CROSSHAIR.opacity;
        profile.crosshairOutline = DEFAULT_CROSSHAIR.outline;
        profile.crosshairDotSize = DEFAULT_CROSSHAIR.dotSize;
        Object.assign(profile, {
            builderDot: true,
            builderLines: true,
            builderRing: false,
            builderBox: false,
            builderImage: false,
            builderDiagonal: false,
            builderDotSize: 6,
            builderLineLength: 18,
            builderRingSize: 28,
            builderBoxSize: 34,
            builderImageSize: 48,
            builderImageOpacity: 1,
            builderRotation: 0
        });
    }

    if (preset === "valorant") {
        Object.assign(profile, {
            valorantCenterDot: true,
            valorantInnerLines: true,
            valorantInnerOpacity: 1,
            valorantInnerLength: 4,
            valorantInnerVerticalLength: 4,
            valorantInnerThickness: 2,
            valorantInnerOffset: 2,
            valorantOuterLines: false,
            valorantOuterOpacity: 0.35,
            valorantOuterLength: 2,
            valorantOuterVerticalLength: 2,
            valorantOuterThickness: 2,
            valorantOuterOffset: 10
        });
    }

    return profile;
}

function normalizeCrosshairProfile(preset, profile = {}) {
    const defaults = createDefaultCrosshairProfile(preset);
    const normalized = {
        crosshairSize: CROSSHAIR_CANVAS_SIZE,
        crosshairColor: /^#[0-9a-f]{6}$/i.test(profile.crosshairColor || "")
            ? profile.crosshairColor
            : defaults.crosshairColor,
        crosshairThickness: defaults.crosshairThickness,
        crosshairGap: defaults.crosshairGap,
        crosshairOpacity: defaults.crosshairOpacity,
        crosshairOutline: defaults.crosshairOutline,
        crosshairDotSize: defaults.crosshairDotSize,
        crosshairImage: typeof profile.crosshairImage === "string" && profile.crosshairImage.startsWith("data:image/")
            ? profile.crosshairImage
            : defaults.crosshairImage
    };

    if (preset === "valorant") {
        Object.assign(normalized, {
            valorantCenterDot: Boolean(profile.valorantCenterDot ?? defaults.valorantCenterDot),
            valorantInnerLines: Boolean(profile.valorantInnerLines ?? defaults.valorantInnerLines),
            valorantInnerOpacity: clamp(Number(profile.valorantInnerOpacity ?? defaults.valorantInnerOpacity) || 0, 0, 1),
            valorantInnerLength: Math.round(clamp(Number(profile.valorantInnerLength ?? defaults.valorantInnerLength) || 0, 0, 20)),
            valorantInnerVerticalLength: Math.round(clamp(Number(profile.valorantInnerVerticalLength ?? defaults.valorantInnerVerticalLength) || 0, 0, 20)),
            valorantInnerThickness: Math.round(clamp(Number(profile.valorantInnerThickness ?? defaults.valorantInnerThickness) || 1, 1, 10)),
            valorantInnerOffset: Math.round(clamp(Number(profile.valorantInnerOffset ?? defaults.valorantInnerOffset) || 0, 0, 20)),
            valorantOuterLines: Boolean(profile.valorantOuterLines ?? defaults.valorantOuterLines),
            valorantOuterOpacity: clamp(Number(profile.valorantOuterOpacity ?? defaults.valorantOuterOpacity) || 0, 0, 1),
            valorantOuterLength: Math.round(clamp(Number(profile.valorantOuterLength ?? defaults.valorantOuterLength) || 0, 0, 20)),
            valorantOuterVerticalLength: Math.round(clamp(Number(profile.valorantOuterVerticalLength ?? defaults.valorantOuterVerticalLength) || 0, 0, 20)),
            valorantOuterThickness: Math.round(clamp(Number(profile.valorantOuterThickness ?? defaults.valorantOuterThickness) || 1, 1, 10)),
            valorantOuterOffset: Math.round(clamp(Number(profile.valorantOuterOffset ?? defaults.valorantOuterOffset) || 0, 0, 40))
        });
    }

    if (preset === "custom") {
        Object.assign(normalized, {
            builderDot: Boolean(profile.builderDot ?? defaults.builderDot),
            builderLines: Boolean(profile.builderLines ?? defaults.builderLines),
            builderRing: Boolean(profile.builderRing ?? defaults.builderRing),
            builderBox: Boolean(profile.builderBox ?? defaults.builderBox),
            builderImage: Boolean(profile.builderImage ?? defaults.builderImage),
            builderDiagonal: false,
            builderDotSize: Math.round(clamp(Number(profile.builderDotSize ?? defaults.builderDotSize) || defaults.builderDotSize, 1, 24)),
            builderLineLength: Math.round(clamp(Number(profile.builderLineLength ?? defaults.builderLineLength) || defaults.builderLineLength, 0, 48)),
            builderRingSize: Math.round(clamp(Number(profile.builderRingSize ?? defaults.builderRingSize) || defaults.builderRingSize, 8, 96)),
            builderBoxSize: Math.round(clamp(Number(profile.builderBoxSize ?? defaults.builderBoxSize) || defaults.builderBoxSize, 8, 96)),
            builderImageSize: Math.round(clamp(Number(profile.builderImageSize ?? defaults.builderImageSize) || defaults.builderImageSize, 8, 160)),
            builderImageOpacity: clamp(Number(profile.builderImageOpacity ?? defaults.builderImageOpacity) || defaults.builderImageOpacity, 0.05, 1),
            builderRotation: 0
        });
    }

    return normalized;
}

function readLegacyCrosshairProfile(preset) {
    const legacy = {
        crosshairSize: readNumberSetting("goatRangeCrosshairSize", CROSSHAIR_PRESET_SETTINGS[preset]?.size || 46),
        crosshairColor: readColorSetting("goatRangeCrosshairColor", CROSSHAIR_PRESET_SETTINGS[preset]?.color || DEFAULT_CROSSHAIR.color),
        crosshairThickness: readBoundedNumberSetting("goatRangeCrosshairThickness", DEFAULT_CROSSHAIR.thickness, 1, 10),
        crosshairGap: readBoundedNumberSetting("goatRangeCrosshairGap", DEFAULT_CROSSHAIR.gap, 0, 36),
        crosshairOpacity: readBoundedNumberSetting("goatRangeCrosshairOpacity", DEFAULT_CROSSHAIR.opacity, 0.1, 1),
        crosshairOutline: readBoundedNumberSetting("goatRangeCrosshairOutline", DEFAULT_CROSSHAIR.outline, 0, 8),
        crosshairDotSize: readBoundedNumberSetting("goatRangeCrosshairDotSize", DEFAULT_CROSSHAIR.dotSize, 1, 24),
        crosshairImage: ""
    };

    if (preset === "valorant") {
        Object.assign(legacy, {
            valorantCenterDot: localStorage.getItem("goatRangeValorantCenterDot") !== "false",
            valorantInnerLines: localStorage.getItem("goatRangeValorantInnerLines") !== "false",
            valorantInnerOpacity: readBoundedNumberSetting("goatRangeValorantInnerOpacity", 1, 0, 1),
            valorantInnerLength: readBoundedNumberSetting("goatRangeValorantInnerLength", 4, 0, 20),
            valorantInnerVerticalLength: readBoundedNumberSetting("goatRangeValorantInnerVerticalLength", 4, 0, 20),
            valorantInnerThickness: readBoundedNumberSetting("goatRangeValorantInnerThickness", 2, 1, 10),
            valorantInnerOffset: readBoundedNumberSetting("goatRangeValorantInnerOffset", 2, 0, 20),
            valorantOuterLines: localStorage.getItem("goatRangeValorantOuterLines") === "true",
            valorantOuterOpacity: readBoundedNumberSetting("goatRangeValorantOuterOpacity", 0.35, 0, 1),
            valorantOuterLength: readBoundedNumberSetting("goatRangeValorantOuterLength", 2, 0, 20),
            valorantOuterVerticalLength: readBoundedNumberSetting("goatRangeValorantOuterVerticalLength", 2, 0, 20),
            valorantOuterThickness: readBoundedNumberSetting("goatRangeValorantOuterThickness", 2, 1, 10),
            valorantOuterOffset: readBoundedNumberSetting("goatRangeValorantOuterOffset", 10, 0, 40)
        });
    }

    return legacy;
}

function readCrosshairProfiles() {
    let savedProfiles = {};
    try {
        const rawProfiles = localStorage.getItem(CROSSHAIR_PROFILE_STORAGE_KEY);
        savedProfiles = rawProfiles ? JSON.parse(rawProfiles) : {};
    } catch {
        savedProfiles = {};
    }

    const profiles = {};
    const activePreset = readCrosshairPreset();
    CROSSHAIR_PRESETS.forEach((preset) => {
        const savedProfile = savedProfiles && typeof savedProfiles === "object" ? savedProfiles[preset] : null;
        profiles[preset] = normalizeCrosshairProfile(
            preset,
            savedProfile || (preset === activePreset ? readLegacyCrosshairProfile(preset) : createDefaultCrosshairProfile(preset))
        );
    });

    return profiles;
}

function serializeCrosshairProfilesForStorage(profiles) {
    const serializedProfiles = {};
    CROSSHAIR_PRESETS.forEach((preset) => {
        serializedProfiles[preset] = {
            ...normalizeCrosshairProfile(preset, profiles[preset]),
            crosshairImage: ""
        };
    });
    return serializedProfiles;
}

function readProfileValue(profileKey) {
    const profile = SENSITIVITY_PROFILES[profileKey] || SENSITIVITY_PROFILES.overwatch;
    return readNumberSetting(`goatRangeSensitivityValue_${profileKey}`, profile.defaultValue);
}

function readProfileAxisValue(profileKey, axis, fallback) {
    return readNumberSetting(`goatRangeSensitivityValue_${profileKey}_${axis}`, fallback);
}

function formatSensitivityValue(value) {
    return Number(value).toFixed(5);
}

function applyCrosshairStyle(element) {
    if (!element) {
        return;
    }

    const preset = settings.crosshairPreset;
    element.classList.remove(
        ...CROSSHAIR_PRESET_CLASSES,
        "crosshair-classic",
        "crosshair-cross",
        "crosshair-gap"
    );
    element.classList.add(`crosshair-${preset}`);
    element.style.setProperty("--crosshair-size", `${settings.crosshairSize}px`);
    element.style.setProperty("--crosshair-thickness", `${settings.crosshairThickness}px`);
    element.style.setProperty("--crosshair-gap", `${settings.crosshairGap}px`);
    element.style.setProperty("--crosshair-line-length", `${Math.max(2, (settings.crosshairSize - settings.crosshairGap) / 2)}px`);
    element.style.setProperty("--crosshair-dot-size", `${settings.crosshairDotSize}px`);
    element.style.setProperty("--crosshair-color", hexToRgba(settings.crosshairColor, settings.crosshairOpacity));
    element.style.setProperty("--crosshair-dot-color", hexToRgba(settings.crosshairColor, settings.crosshairOpacity));
    element.style.setProperty("--crosshair-glow", hexToRgba(settings.crosshairColor, 0.45));
    element.style.setProperty("--crosshair-outline-width", `${settings.crosshairOutline}px`);
    element.style.setProperty("--crosshair-outline-color", `rgba(0, 0, 0, ${settings.crosshairOutline > 0 ? 0.7 : 0})`);
    element.style.setProperty(
        "--crosshair-image",
        "none"
    );
    element.style.opacity = "";
    renderCrosshairParts(element, preset);
}

function createCrosshairPart(className, styles = {}) {
    const part = document.createElement("i");
    part.className = className;
    Object.assign(part.style, styles);
    return part;
}

function addCrosshairLine(fragment, direction, length, thickness, offset, angle = 0, opacity = 1) {
    const center = settings.crosshairSize / 2;
    const line = createCrosshairPart("reticle-part reticle-line");
    line.style.width = `${length}px`;
    line.style.height = `${thickness}px`;
    line.style.opacity = String(opacity);

    if (direction === "right") {
        line.style.left = `${center + offset}px`;
        line.style.top = `${center - thickness / 2}px`;
    } else if (direction === "left") {
        line.style.left = `${center - offset - length}px`;
        line.style.top = `${center - thickness / 2}px`;
    } else if (direction === "down") {
        line.style.left = `${center - thickness / 2}px`;
        line.style.top = `${center + offset}px`;
        line.style.width = `${thickness}px`;
        line.style.height = `${length}px`;
    } else if (direction === "up") {
        line.style.left = `${center - thickness / 2}px`;
        line.style.top = `${center - offset - length}px`;
        line.style.width = `${thickness}px`;
        line.style.height = `${length}px`;
    }

    if (angle) {
        line.style.transform = `rotate(${angle}deg)`;
        line.style.transformOrigin = "center";
    }
    fragment.append(line);
}

function addCrosshairDot(fragment, size = settings.crosshairDotSize) {
    const center = settings.crosshairSize / 2;
    fragment.append(createCrosshairPart("reticle-part reticle-dot", {
        left: `${center - size / 2}px`,
        top: `${center - size / 2}px`,
        width: `${size}px`,
        height: `${size}px`
    }));
}

function addCrosshairRing(fragment, className, size, radius) {
    const center = settings.crosshairSize / 2;
    fragment.append(createCrosshairPart(`reticle-part ${className}`, {
        left: `${center - size / 2}px`,
        top: `${center - size / 2}px`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: radius
    }));
}

function addCrosshairImage(fragment) {
    if (!settings.crosshairImage) {
        return;
    }
    const center = settings.crosshairSize / 2;
    const image = document.createElement("img");
    image.className = "reticle-part reticle-image";
    image.alt = "";
    image.src = settings.crosshairImage;
    image.style.left = `${center - settings.builderImageSize / 2}px`;
    image.style.top = `${center - settings.builderImageSize / 2}px`;
    image.style.width = `${settings.builderImageSize}px`;
    image.style.height = `${settings.builderImageSize}px`;
    image.style.opacity = String(settings.builderImageOpacity);
    fragment.append(image);
}

function addCrosshairFourLines(fragment, length, thickness, offset, opacity = 1) {
    addCrosshairLine(fragment, "left", length, thickness, offset, 0, opacity);
    addCrosshairLine(fragment, "right", length, thickness, offset, 0, opacity);
    addCrosshairLine(fragment, "up", length, thickness, offset, 0, opacity);
    addCrosshairLine(fragment, "down", length, thickness, offset, 0, opacity);
}

function renderCrosshairParts(element, preset) {
    element.classList.add("is-rendered");
    element.replaceChildren();

    const config = CROSSHAIR_PRESET_SETTINGS[preset] || {};
    const shape = config.shape || preset;
    const fragment = document.createDocumentFragment();
    const length = Math.max(3, (settings.crosshairSize - settings.crosshairGap) / 2);
    const shortLength = Math.max(4, length * 0.58);
    const thickness = settings.crosshairThickness;
    const offset = Math.max(0, settings.crosshairGap / 2);

    if (shape === "custom") {
        const rotation = settings.builderRotation || 0;
        const layer = document.createElement("div");
        layer.className = "reticle-layer";
        layer.style.transform = `rotate(${rotation}deg)`;
        if (settings.builderImage) {
            addCrosshairImage(layer);
        }
        if (settings.builderRing) {
            addCrosshairRing(layer, "reticle-ring", settings.builderRingSize, "50%");
        }
        if (settings.builderBox) {
            addCrosshairRing(layer, "reticle-square", settings.builderBoxSize, "3px");
        }
        if (settings.builderLines) {
            addCrosshairFourLines(layer, settings.builderLineLength, thickness, offset);
        }
        if (settings.builderDiagonal) {
            addCrosshairLine(layer, "left", settings.builderLineLength, thickness, offset, -45);
            addCrosshairLine(layer, "right", settings.builderLineLength, thickness, offset, -45);
            addCrosshairLine(layer, "up", settings.builderLineLength, thickness, offset, 45);
            addCrosshairLine(layer, "down", settings.builderLineLength, thickness, offset, 45);
        }
        if (settings.builderDot) {
            addCrosshairDot(layer, settings.builderDotSize);
        }
        fragment.append(layer);
        element.append(fragment);
        return;
    }

    if (shape === "circle" || shape === "circle-crosshair") {
        addCrosshairRing(fragment, "reticle-ring", settings.crosshairSize * 0.58, "50%");
    }
    if (shape === "square") {
        addCrosshairRing(fragment, "reticle-square", settings.crosshairSize * 0.56, "3px");
    }
    if (shape === "crosshair" || shape === "circle-crosshair") {
        addCrosshairFourLines(fragment, length, thickness, offset);
    }
    if (shape === "line") {
        addCrosshairLine(fragment, "left", length, thickness, offset);
        addCrosshairLine(fragment, "right", length, thickness, offset);
    }
    if (shape === "box") {
        addCrosshairLine(fragment, "left", shortLength, thickness, settings.crosshairGap / 2 + shortLength * 0.45);
        addCrosshairLine(fragment, "right", shortLength, thickness, settings.crosshairGap / 2 + shortLength * 0.45);
        addCrosshairLine(fragment, "up", shortLength, thickness, settings.crosshairGap / 2 + shortLength * 0.45);
        addCrosshairLine(fragment, "down", shortLength, thickness, settings.crosshairGap / 2 + shortLength * 0.45);
    }
    if (shape === "triwing") {
        addCrosshairLine(fragment, "down", length * 0.75, thickness, offset);
        addCrosshairLine(fragment, "left", length * 0.55, thickness, offset + length * 0.25, -45);
        addCrosshairLine(fragment, "right", length * 0.55, thickness, offset + length * 0.25, 45);
    }
    if (shape === "falloff") {
        addCrosshairLine(fragment, "left", shortLength, thickness, offset);
        addCrosshairLine(fragment, "right", shortLength, thickness, offset);
        addCrosshairLine(fragment, "down", shortLength, thickness, offset + 5, 0, 0.72);
        addCrosshairLine(fragment, "down", shortLength * 0.66, thickness, offset + 11, 0, 0.42);
    }
    if (shape === "valorant") {
        if (settings.valorantInnerLines) {
            addCrosshairLine(fragment, "left", settings.valorantInnerLength * 4, settings.valorantInnerThickness, settings.valorantInnerOffset * 2, 0, settings.valorantInnerOpacity);
            addCrosshairLine(fragment, "right", settings.valorantInnerLength * 4, settings.valorantInnerThickness, settings.valorantInnerOffset * 2, 0, settings.valorantInnerOpacity);
            addCrosshairLine(fragment, "up", settings.valorantInnerVerticalLength * 4, settings.valorantInnerThickness, settings.valorantInnerOffset * 2, 0, settings.valorantInnerOpacity);
            addCrosshairLine(fragment, "down", settings.valorantInnerVerticalLength * 4, settings.valorantInnerThickness, settings.valorantInnerOffset * 2, 0, settings.valorantInnerOpacity);
        }
        if (settings.valorantOuterLines) {
            addCrosshairLine(fragment, "left", settings.valorantOuterLength * 4, settings.valorantOuterThickness, settings.valorantOuterOffset * 2, 0, settings.valorantOuterOpacity);
            addCrosshairLine(fragment, "right", settings.valorantOuterLength * 4, settings.valorantOuterThickness, settings.valorantOuterOffset * 2, 0, settings.valorantOuterOpacity);
            addCrosshairLine(fragment, "up", settings.valorantOuterVerticalLength * 4, settings.valorantOuterThickness, settings.valorantOuterOffset * 2, 0, settings.valorantOuterOpacity);
            addCrosshairLine(fragment, "down", settings.valorantOuterVerticalLength * 4, settings.valorantOuterThickness, settings.valorantOuterOffset * 2, 0, settings.valorantOuterOpacity);
        }
        if (settings.valorantCenterDot) {
            addCrosshairDot(fragment);
        }
        element.append(fragment);
        return;
    }
    if (shape !== "circle" && shape !== "square" || shape === "dot") {
        addCrosshairDot(fragment);
    }
    if (shape === "circle" || shape === "square") {
        addCrosshairDot(fragment);
    }

    element.append(fragment);
}

function applyCrosshairPresetDefaults(preset) {
    if (!CROSSHAIR_PRESETS.includes(preset)) {
        return;
    }
    settings.crosshairProfiles[preset] = createDefaultCrosshairProfile(preset);
    activateCrosshairProfile(preset);
}

function syncValorantUi(shouldStore = true) {
    settings.valorantCenterDot = Boolean(settings.valorantCenterDot);
    settings.valorantInnerLines = Boolean(settings.valorantInnerLines);
    settings.valorantInnerOpacity = clamp(Number(settings.valorantInnerOpacity) || 0, 0, 1);
    settings.valorantInnerLength = Math.round(clamp(Number(settings.valorantInnerLength) || 0, 0, 20));
    settings.valorantInnerVerticalLength = Math.round(clamp(Number(settings.valorantInnerVerticalLength) || 0, 0, 20));
    settings.valorantInnerThickness = Math.round(clamp(Number(settings.valorantInnerThickness) || 1, 1, 10));
    settings.valorantInnerOffset = Math.round(clamp(Number(settings.valorantInnerOffset) || 0, 0, 20));
    settings.valorantOuterLines = Boolean(settings.valorantOuterLines);
    settings.valorantOuterOpacity = clamp(Number(settings.valorantOuterOpacity) || 0, 0, 1);
    settings.valorantOuterLength = Math.round(clamp(Number(settings.valorantOuterLength) || 0, 0, 20));
    settings.valorantOuterVerticalLength = Math.round(clamp(Number(settings.valorantOuterVerticalLength) || 0, 0, 20));
    settings.valorantOuterThickness = Math.round(clamp(Number(settings.valorantOuterThickness) || 1, 1, 10));
    settings.valorantOuterOffset = Math.round(clamp(Number(settings.valorantOuterOffset) || 0, 0, 40));

    dom.valorantCenterDot.checked = settings.valorantCenterDot;
    dom.valorantInnerLines.checked = settings.valorantInnerLines;
    dom.valorantInnerOpacityValue.value = settings.valorantInnerOpacity.toFixed(2);
    dom.valorantInnerOpacityRange.value = String(settings.valorantInnerOpacity);
    dom.valorantInnerLengthValue.value = String(settings.valorantInnerLength);
    dom.valorantInnerLengthRange.value = String(settings.valorantInnerLength);
    dom.valorantInnerVerticalLengthValue.value = String(settings.valorantInnerVerticalLength);
    dom.valorantInnerVerticalLengthRange.value = String(settings.valorantInnerVerticalLength);
    dom.valorantInnerThicknessValue.value = String(settings.valorantInnerThickness);
    dom.valorantInnerThicknessRange.value = String(settings.valorantInnerThickness);
    dom.valorantInnerOffsetValue.value = String(settings.valorantInnerOffset);
    dom.valorantInnerOffsetRange.value = String(settings.valorantInnerOffset);
    dom.valorantOuterLines.checked = settings.valorantOuterLines;
    dom.valorantOuterOpacityValue.value = settings.valorantOuterOpacity.toFixed(2);
    dom.valorantOuterOpacityRange.value = String(settings.valorantOuterOpacity);
    dom.valorantOuterLengthValue.value = String(settings.valorantOuterLength);
    dom.valorantOuterLengthRange.value = String(settings.valorantOuterLength);
    dom.valorantOuterVerticalLengthValue.value = String(settings.valorantOuterVerticalLength);
    dom.valorantOuterVerticalLengthRange.value = String(settings.valorantOuterVerticalLength);
    dom.valorantOuterThicknessValue.value = String(settings.valorantOuterThickness);
    dom.valorantOuterThicknessRange.value = String(settings.valorantOuterThickness);
    dom.valorantOuterOffsetValue.value = String(settings.valorantOuterOffset);
    dom.valorantOuterOffsetRange.value = String(settings.valorantOuterOffset);

    if (!shouldStore) {
        return;
    }

    localStorage.setItem("goatRangeValorantCenterDot", String(settings.valorantCenterDot));
    localStorage.setItem("goatRangeValorantInnerLines", String(settings.valorantInnerLines));
    localStorage.setItem("goatRangeValorantInnerOpacity", String(settings.valorantInnerOpacity));
    localStorage.setItem("goatRangeValorantInnerLength", String(settings.valorantInnerLength));
    localStorage.setItem("goatRangeValorantInnerVerticalLength", String(settings.valorantInnerVerticalLength));
    localStorage.setItem("goatRangeValorantInnerThickness", String(settings.valorantInnerThickness));
    localStorage.setItem("goatRangeValorantInnerOffset", String(settings.valorantInnerOffset));
    localStorage.setItem("goatRangeValorantOuterLines", String(settings.valorantOuterLines));
    localStorage.setItem("goatRangeValorantOuterOpacity", String(settings.valorantOuterOpacity));
    localStorage.setItem("goatRangeValorantOuterLength", String(settings.valorantOuterLength));
    localStorage.setItem("goatRangeValorantOuterVerticalLength", String(settings.valorantOuterVerticalLength));
    localStorage.setItem("goatRangeValorantOuterThickness", String(settings.valorantOuterThickness));
    localStorage.setItem("goatRangeValorantOuterOffset", String(settings.valorantOuterOffset));
}

function applyValorantCrosshairCode(code) {
    if (settings.crosshairPreset !== "valorant") {
        saveActiveCrosshairProfile();
        activateCrosshairProfile("valorant");
    }

    const parts = code.trim().split(";").filter(Boolean);
    let section = "";
    let touchedInner = false;
    let touchedOuter = false;

    for (let index = 0; index < parts.length - 1; index += 2) {
        const key = parts[index];
        const value = parts[index + 1];
        if (key === "P" || key === "S" || key === "A") {
            section = key;
            index -= 1;
            continue;
        }
        if (section && section !== "P") {
            continue;
        }

        const numeric = Number(value);
        if (key === "c" && VALORANT_COLOR_MAP[value]) {
            settings.crosshairColor = VALORANT_COLOR_MAP[value];
        } else if (key === "u" && /^[0-9a-f]{8}$/i.test(value)) {
            settings.crosshairColor = `#${value.slice(2, 8)}`;
        } else if (key === "h") {
            settings.crosshairOutline = value === "0" ? 0 : 1;
        } else if (key === "d") {
            settings.valorantCenterDot = value !== "0";
        } else if (key === "z" && Number.isFinite(numeric)) {
            settings.crosshairDotSize = clamp(numeric, 1, 24);
        } else if (key === "0b") {
            settings.valorantInnerLines = value !== "0";
            touchedInner = true;
        } else if (key === "0a" && Number.isFinite(numeric)) {
            settings.valorantInnerOpacity = clamp(numeric, 0, 1);
            touchedInner = true;
        } else if (key === "0l" && Number.isFinite(numeric)) {
            settings.valorantInnerLength = clamp(numeric, 0, 20);
            touchedInner = true;
        } else if (key === "0v" && Number.isFinite(numeric)) {
            settings.valorantInnerVerticalLength = clamp(numeric, 0, 20);
            touchedInner = true;
        } else if (key === "0t" && Number.isFinite(numeric)) {
            settings.valorantInnerThickness = clamp(numeric, 1, 10);
            touchedInner = true;
        } else if (key === "0o" && Number.isFinite(numeric)) {
            settings.valorantInnerOffset = clamp(numeric, 0, 20);
            touchedInner = true;
        } else if (key === "1b") {
            settings.valorantOuterLines = value !== "0";
            touchedOuter = true;
        } else if (key === "1a" && Number.isFinite(numeric)) {
            settings.valorantOuterOpacity = clamp(numeric, 0, 1);
            touchedOuter = true;
        } else if (key === "1l" && Number.isFinite(numeric)) {
            settings.valorantOuterLength = clamp(numeric, 0, 20);
            touchedOuter = true;
        } else if (key === "1v" && Number.isFinite(numeric)) {
            settings.valorantOuterVerticalLength = clamp(numeric, 0, 20);
            touchedOuter = true;
        } else if (key === "1t" && Number.isFinite(numeric)) {
            settings.valorantOuterThickness = clamp(numeric, 1, 10);
            touchedOuter = true;
        } else if (key === "1o" && Number.isFinite(numeric)) {
            settings.valorantOuterOffset = clamp(numeric, 0, 40);
            touchedOuter = true;
        }
    }

    settings.crosshairPreset = "valorant";
    settings.valorantInnerLines = touchedInner ? settings.valorantInnerLines : true;
    settings.valorantOuterLines = touchedOuter ? settings.valorantOuterLines : false;
    syncCrosshairUi();
}

function syncCrosshairUi(shouldStore = true) {
    settings.crosshairPreset = "custom";
    settings.crosshairSize = CROSSHAIR_CANVAS_SIZE;
    settings.crosshairColor = /^#[0-9a-f]{6}$/i.test(settings.crosshairColor)
        ? settings.crosshairColor
        : DEFAULT_CROSSHAIR.color;
    settings.crosshairThickness = Math.round(clamp(Number(settings.crosshairThickness) || DEFAULT_CROSSHAIR.thickness, 1, 10));
    settings.crosshairGap = Math.round(clamp(Number(settings.crosshairGap) || 0, 0, 36));
    settings.crosshairOpacity = clamp(Number(settings.crosshairOpacity) || DEFAULT_CROSSHAIR.opacity, 0.1, 1);
    settings.crosshairOutline = Math.round(clamp(Number(settings.crosshairOutline) || 0, 0, 8));
    settings.crosshairDotSize = Math.round(clamp(Number(settings.crosshairDotSize) || DEFAULT_CROSSHAIR.dotSize, 1, 24));
    const builderDefaults = createDefaultCrosshairProfile("custom");
    settings.builderDot = Boolean(settings.builderDot ?? builderDefaults.builderDot);
    settings.builderLines = Boolean(settings.builderLines ?? builderDefaults.builderLines);
    settings.builderRing = Boolean(settings.builderRing ?? builderDefaults.builderRing);
    settings.builderBox = Boolean(settings.builderBox ?? builderDefaults.builderBox);
    settings.builderImage = Boolean(settings.builderImage ?? builderDefaults.builderImage);
    settings.builderDiagonal = Boolean(settings.builderDiagonal ?? builderDefaults.builderDiagonal);
    settings.builderDotSize = Math.round(clamp(Number(settings.builderDotSize ?? builderDefaults.builderDotSize) || builderDefaults.builderDotSize, 1, 24));
    settings.builderLineLength = Math.round(clamp(Number(settings.builderLineLength ?? builderDefaults.builderLineLength) || 0, 0, 48));
    settings.builderRingSize = Math.round(clamp(Number(settings.builderRingSize ?? builderDefaults.builderRingSize) || builderDefaults.builderRingSize, 8, 96));
    settings.builderBoxSize = Math.round(clamp(Number(settings.builderBoxSize ?? builderDefaults.builderBoxSize) || builderDefaults.builderBoxSize, 8, 96));
    settings.builderImageSize = Math.round(clamp(Number(settings.builderImageSize ?? builderDefaults.builderImageSize) || builderDefaults.builderImageSize, 8, 160));
    settings.builderImageOpacity = clamp(Number(settings.builderImageOpacity ?? builderDefaults.builderImageOpacity) || builderDefaults.builderImageOpacity, 0.05, 1);
    settings.builderRotation = Math.round(clamp(Number(settings.builderRotation ?? builderDefaults.builderRotation) || 0, -45, 45));

    dom.crosshairPresetButtons.forEach((button) => {
        const isActive = button.dataset.crosshairPreset === settings.crosshairPreset;
        button.classList.toggle("active", isActive);
        button.classList.remove("is-unavailable");
        button.setAttribute("aria-pressed", String(isActive));
        button.setAttribute("aria-disabled", "false");
    });

    dom.crosshairSizeValue.value = String(settings.crosshairSize);
    dom.crosshairSizeRange.value = String(settings.crosshairSize);
    dom.crosshairColor.value = settings.crosshairColor;
    dom.crosshairThicknessValue.value = String(settings.crosshairThickness);
    dom.crosshairThicknessRange.value = String(settings.crosshairThickness);
    dom.crosshairGapValue.value = String(settings.crosshairGap);
    dom.crosshairGapRange.value = String(settings.crosshairGap);
    dom.crosshairOpacityValue.value = settings.crosshairOpacity.toFixed(2);
    dom.crosshairOpacityRange.value = String(settings.crosshairOpacity);
    dom.crosshairOutlineValue.value = String(settings.crosshairOutline);
    dom.crosshairOutlineRange.value = String(settings.crosshairOutline);
    dom.crosshairDotSizeValue.value = String(settings.crosshairDotSize);
    dom.crosshairDotSizeRange.value = String(settings.crosshairDotSize);
    dom.builderDot.checked = Boolean(settings.builderDot);
    dom.builderLines.checked = Boolean(settings.builderLines);
    dom.builderRing.checked = Boolean(settings.builderRing);
    dom.builderBox.checked = Boolean(settings.builderBox);
    dom.builderImage.checked = Boolean(settings.builderImage);
    dom.builderDiagonal.checked = Boolean(settings.builderDiagonal);
    dom.builderDotSizeValue.value = String(settings.builderDotSize);
    dom.builderDotSizeRange.value = String(settings.builderDotSize);
    dom.builderLineLengthValue.value = String(settings.builderLineLength);
    dom.builderLineLengthRange.value = String(settings.builderLineLength);
    dom.builderRingSizeValue.value = String(settings.builderRingSize);
    dom.builderRingSizeRange.value = String(settings.builderRingSize);
    dom.builderBoxSizeValue.value = String(settings.builderBoxSize);
    dom.builderBoxSizeRange.value = String(settings.builderBoxSize);
    dom.builderImageSizeValue.value = String(settings.builderImageSize);
    dom.builderImageSizeRange.value = String(settings.builderImageSize);
    dom.builderImageOpacityValue.value = settings.builderImageOpacity.toFixed(2);
    dom.builderImageOpacityRange.value = String(settings.builderImageOpacity);
    dom.builderRotationValue.value = String(settings.builderRotation);
    dom.builderRotationRange.value = String(settings.builderRotation);
    dom.crosshairImageStatus.textContent = t(settings.crosshairImage ? "imageReady" : "noImage");
    syncValorantUi(false);
    dom.valorantSettings.classList.toggle("hidden", settings.crosshairPreset !== "valorant");
    dom.customCrosshairSettings.classList.toggle("hidden", settings.crosshairPreset !== "custom");
    document.querySelectorAll(".crosshair-custom-preview").forEach((preview) => {
        preview.style.backgroundImage = "";
    });
    applyCrosshairStyle(dom.reticle);
    applyCrosshairStyle(dom.crosshairPreview);

    if (!shouldStore) {
        return;
    }

    saveActiveCrosshairProfile();
    localStorage.setItem("goatRangeCrosshairPreset", settings.crosshairPreset);
    localStorage.setItem("goatRangeCrosshairSize", String(settings.crosshairSize));
    localStorage.setItem("goatRangeCrosshairColor", settings.crosshairColor);
    localStorage.setItem("goatRangeCrosshairThickness", String(settings.crosshairThickness));
    localStorage.setItem("goatRangeCrosshairGap", String(settings.crosshairGap));
    localStorage.setItem("goatRangeCrosshairOpacity", String(settings.crosshairOpacity));
    localStorage.setItem("goatRangeCrosshairOutline", String(settings.crosshairOutline));
    localStorage.setItem("goatRangeCrosshairDotSize", String(settings.crosshairDotSize));
    try {
        localStorage.removeItem("goatRangeCrosshairImage");
        localStorage.setItem(CROSSHAIR_PROFILE_STORAGE_KEY, JSON.stringify(serializeCrosshairProfilesForStorage(settings.crosshairProfiles)));
    } catch {
        showToast(t("invalidCrosshairImage"));
    }
}

function getRadPerCount(axis = "base") {
    const profile = SENSITIVITY_PROFILES[settings.sensitivityProfile] || SENSITIVITY_PROFILES.overwatch;
    const value = settings.separateAxisSensitivity && axis === "x"
        ? settings.sensitivityX
        : settings.separateAxisSensitivity && axis === "y"
            ? settings.sensitivityY
            : settings.sensitivityValue;
    return profile.radPerCount(value);
}

function wrapRadians(value) {
    return ((value + Math.PI) % TAU + TAU) % TAU - Math.PI;
}

function syncSensitivityUi(shouldStore = true) {
    const profile = SENSITIVITY_PROFILES[settings.sensitivityProfile] || SENSITIVITY_PROFILES.overwatch;
    const getCm360 = (axis) => {
        const countsFor360 = (Math.PI * 2) / Math.max(getRadPerCount(axis), 0.000001);
        return (countsFor360 / DEFAULT_DPI) * CM_PER_INCH;
    };

    dom.sensitivityProfile.value = settings.sensitivityProfile;
    dom.sensitivityValue.value = formatSensitivityValue(settings.sensitivityValue);
    dom.separateAxisSensitivity.checked = settings.separateAxisSensitivity;
    dom.sensitivityX.value = formatSensitivityValue(settings.sensitivityX);
    dom.sensitivityY.value = formatSensitivityValue(settings.sensitivityY);
    dom.baseSensitivityField.classList.toggle("is-collapsed", settings.separateAxisSensitivity);
    dom.axisSensitivityFields.forEach((field) => {
        field.classList.toggle("is-collapsed", !settings.separateAxisSensitivity);
    });
    dom.cm360Output.textContent = settings.separateAxisSensitivity
        ? `X ${getCm360("x").toFixed(2)} cm / Y ${getCm360("y").toFixed(2)} cm @ ${DEFAULT_DPI} DPI`
        : `${getCm360("base").toFixed(2)} cm @ ${DEFAULT_DPI} DPI`;
    dom.sensitivityValue.setAttribute("aria-label", `${profile.label} sensitivity`);
    dom.sensitivityX.setAttribute("aria-label", `${profile.label} horizontal sensitivity`);
    dom.sensitivityY.setAttribute("aria-label", `${profile.label} vertical sensitivity`);

    if (!shouldStore) {
        return;
    }

    localStorage.setItem("goatRangeSensitivityProfile", settings.sensitivityProfile);
    localStorage.setItem(`goatRangeSensitivityValue_${settings.sensitivityProfile}`, String(settings.sensitivityValue));
    localStorage.setItem("goatRangeSeparateAxisSensitivity", String(settings.separateAxisSensitivity));
    localStorage.setItem(`goatRangeSensitivityValue_${settings.sensitivityProfile}_x`, String(settings.sensitivityX));
    localStorage.setItem(`goatRangeSensitivityValue_${settings.sensitivityProfile}_y`, String(settings.sensitivityY));
}

function syncSettings() {
    settings.invertX = dom.invertX.checked;
    settings.invertY = dom.invertY.checked;
    localStorage.setItem("goatRangeInvertX", String(settings.invertX));
    localStorage.setItem("goatRangeInvertY", String(settings.invertY));
}

function syncLanguage() {
    settings.languageMode = dom.languageSelect.value;
    localStorage.setItem("goatRangeLanguage", settings.languageMode);
    applyLanguage();
}

function applyTheme() {
    const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)")?.matches;
    const resolvedTheme = settings.themeMode === "auto" ? (prefersLight ? "light" : "dark") : settings.themeMode;
    document.documentElement.dataset.theme = resolvedTheme;
    dom.themeSelect.value = settings.themeMode;
}

function syncTheme() {
    settings.themeMode = dom.themeSelect.value;
    localStorage.setItem("goatRangeTheme", settings.themeMode);
    applyTheme();
}

function syncSoundEffects() {
    settings.soundEffects = dom.soundEffects.checked;
    localStorage.setItem("goatRangeSoundEffects", String(settings.soundEffects));
    ensureAudio();
}

function syncFpsUi(shouldStore = true) {
    dom.showFps.checked = settings.showFps;
    dom.fpsCounter.classList.toggle("hidden", !settings.showFps);
    if (settings.showFps && dom.fpsCounter.textContent === "-- FPS") {
        fpsSampleStart = performance.now();
        fpsFrameCount = 0;
    }

    if (shouldStore) {
        localStorage.setItem("goatRangeShowFps", String(settings.showFps));
    }
}

function setSettingsTab(tabName) {
    const tabs = [
        ["general", dom.settingsGeneralTab, dom.settingsGeneralPanel],
        ["screen", dom.settingsScreenTab, dom.settingsScreenPanel],
        ["crosshair", dom.settingsCrosshairTab, dom.settingsCrosshairPanel],
        ["mouse", dom.settingsMouseTab, dom.settingsMousePanel]
    ];

    tabs.forEach(([name, tab, panel]) => {
        const isActive = tabName === name;
        tab.classList.toggle("active", isActive);
        tab.setAttribute("aria-selected", String(isActive));
        panel.classList.toggle("hidden", !isActive);
    });
}

function syncFovUi(shouldStore = true) {
    settings.fov = clamp(Number(settings.fov) || DEFAULT_HORIZONTAL_FOV, 50, 110);
    dom.fovValue.value = String(Math.round(settings.fov));
    dom.fovRange.value = String(Math.round(settings.fov));

    if (shouldStore) {
        localStorage.setItem("goatRangeFov", String(settings.fov));
    }
}

function handleCrosshairImageUpload(file) {
    if (!file) {
        return;
    }
    if (!file.type.startsWith("image/")) {
        showToast(t("invalidCrosshairImage"));
        dom.crosshairImageInput.value = "";
        return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
        if (typeof reader.result !== "string" || !reader.result.startsWith("data:image/")) {
            showToast(t("invalidCrosshairImage"));
            return;
        }
        saveActiveCrosshairProfile();
        settings.crosshairProfiles.custom = normalizeCrosshairProfile("custom", {
            ...settings.crosshairProfiles.custom,
            builderImage: true,
            crosshairImage: reader.result
        });
        activateCrosshairProfile("custom");
        syncCrosshairUi();
        void writePersistedCrosshairImage(reader.result).catch(() => {});
        dom.crosshairImageInput.value = "";
    });
    reader.addEventListener("error", () => {
        showToast(t("invalidCrosshairImage"));
        dom.crosshairImageInput.value = "";
    });
    reader.readAsDataURL(file);
}

function clearCrosshairImage() {
    settings.crosshairImage = "";
    settings.builderImage = false;
    settings.crosshairProfiles.custom = normalizeCrosshairProfile("custom", {
        ...settings.crosshairProfiles.custom,
        builderImage: false,
        crosshairImage: ""
    });
    activateCrosshairProfile("custom");
    syncCrosshairUi();
    void deletePersistedCrosshairImage().catch(() => {});
}

function openSettings(fromPause = false) {
    state.settingsOpen = true;
    setSettingsTab("general");
    if (state.active) {
        state.paused = true;
        state.returnToPauseFromSettings = fromPause || state.pauseMenuOpen;
        state.pauseMenuOpen = false;
        dom.pauseMenu.classList.add("hidden");
        if (document.pointerLockElement === dom.canvas) {
            document.exitPointerLock();
        }
        showToast(t("settingsToast"));
    }
    dom.settingsOverlay.classList.remove("hidden");
}

function closeSettings() {
    state.settingsOpen = false;
    dom.settingsOverlay.classList.add("hidden");
    if (state.active) {
        state.paused = true;
        if (state.returnToPauseFromSettings) {
            state.pauseMenuOpen = true;
            state.returnToPauseFromSettings = false;
            dom.pauseMenu.classList.remove("hidden");
            showToast(t("pausedToast"));
        } else {
            showToast(t("clickToResume"), true);
        }
    }
}

dom.modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
        if (!PRACTICE_MODES[button.dataset.practiceMode]) {
            return;
        }
        settings.practiceMode = button.dataset.practiceMode;
        syncModeUi();
        void loadLeaderboard(settings.practiceMode);
    });
});
document.addEventListener("click", playButtonClickSound, true);
dom.modeOptionResetButtons.forEach((button) => {
    button.addEventListener("click", () => resetPracticeSettings(button.dataset.resetMode));
});
bindPracticeRange(dom.precisionRadiusValue, dom.precisionRadiusRange, "precision", "radius", 0.08, 0.42);
bindPracticeRange(dom.precisionTargetCountValue, dom.precisionTargetCountRange, "precision", "targetCount", 1, MAX_TARGET_COUNT, true);
bindPracticeRange(dom.precisionDurationValue, dom.precisionDurationRange, "precision", "duration", 15, 180, true);
bindPracticeRange(dom.reflexDurationValue, dom.reflexDurationRange, "reflex", "duration", 15, 180, true);
bindPracticeRange(dom.trackingSpeedValue, dom.trackingSpeedRange, "tracking", "speed", 0.2, 3);
bindPracticeRange(dom.trackingRadiusValue, dom.trackingRadiusRange, "tracking", "radius", 0.08, 0.42);
bindPracticeRange(dom.trackingDurationValue, dom.trackingDurationRange, "tracking", "duration", 15, 180, true);
bindPracticeColor(dom.precisionColor, "precision");
bindPracticeColor(dom.reflexColor, "reflex");
bindPracticeColor(dom.trackingColor, "tracking");
dom.trackingMovement.addEventListener("change", () => {
    practiceSettings.tracking.movement = TRACKING_MOVEMENT_TYPES.includes(dom.trackingMovement.value)
        ? dom.trackingMovement.value
        : "random";
    syncPracticeSettingsUi();
});
dom.startBtn.addEventListener("click", () => {
    startGame();
    void prepareNanoCoach();
});
dom.nanoFeedbackRetry.addEventListener("click", () => {
    if (lastDrillSummary) {
        void generateNanoFeedback(lastDrillSummary);
    }
});
dom.leaderboardAutoSubmit.addEventListener("change", syncLeaderboardAutoSubmit);
dom.leaderboardPlayerName.addEventListener("input", saveLeaderboardNickname);
dom.settingsBtn.addEventListener("click", () => openSettings(false));
dom.settingsCloseBtn.addEventListener("click", closeSettings);
dom.settingsGeneralTab.addEventListener("click", () => setSettingsTab("general"));
dom.settingsScreenTab.addEventListener("click", () => setSettingsTab("screen"));
dom.settingsCrosshairTab.addEventListener("click", () => setSettingsTab("crosshair"));
dom.settingsMouseTab.addEventListener("click", () => setSettingsTab("mouse"));
dom.settingsOverlay.addEventListener("click", (event) => {
    if (event.target === dom.settingsOverlay) {
        closeSettings();
    }
});
dom.languageSelect.addEventListener("change", syncLanguage);
dom.themeSelect.addEventListener("change", syncTheme);
dom.soundEffects.addEventListener("change", syncSoundEffects);
dom.showFps.addEventListener("change", () => {
    settings.showFps = dom.showFps.checked;
    syncFpsUi();
});
dom.fovRange.addEventListener("input", () => {
    settings.fov = clamp(Number(dom.fovRange.value) || DEFAULT_HORIZONTAL_FOV, 50, 110);
    syncFovUi();
});
dom.fovValue.addEventListener("change", () => {
    settings.fov = clamp(Number(dom.fovValue.value) || DEFAULT_HORIZONTAL_FOV, 50, 110);
    syncFovUi();
});
dom.crosshairPresetButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const preset = button.dataset.crosshairPreset;
        if (CROSSHAIR_PRESETS.includes(preset)) {
            saveActiveCrosshairProfile();
            activateCrosshairProfile(preset);
            syncCrosshairUi();
        }
    });
});
dom.resetCrosshairPreset.addEventListener("click", resetActiveCrosshairPreset);
dom.crosshairSizeValue.addEventListener("input", () => {
    settings.crosshairSize = clamp(Number(dom.crosshairSizeValue.value) || 46, 18, 96);
    syncCrosshairUi();
});
dom.crosshairSizeRange.addEventListener("input", () => {
    settings.crosshairSize = clamp(Number(dom.crosshairSizeRange.value) || 46, 18, 96);
    syncCrosshairUi();
});
dom.crosshairSizeValue.addEventListener("change", () => {
    settings.crosshairSize = clamp(Number(dom.crosshairSizeValue.value) || 46, 18, 96);
    syncCrosshairUi();
});
dom.crosshairColor.addEventListener("input", () => {
    settings.crosshairColor = dom.crosshairColor.value;
    syncCrosshairUi();
});
dom.crosshairThicknessValue.addEventListener("input", () => {
    settings.crosshairThickness = clamp(Number(dom.crosshairThicknessValue.value) || DEFAULT_CROSSHAIR.thickness, 1, 10);
    syncCrosshairUi();
});
dom.crosshairThicknessRange.addEventListener("input", () => {
    settings.crosshairThickness = clamp(Number(dom.crosshairThicknessRange.value) || DEFAULT_CROSSHAIR.thickness, 1, 10);
    syncCrosshairUi();
});
dom.crosshairThicknessValue.addEventListener("change", () => {
    settings.crosshairThickness = clamp(Number(dom.crosshairThicknessValue.value) || DEFAULT_CROSSHAIR.thickness, 1, 10);
    syncCrosshairUi();
});
dom.crosshairGapValue.addEventListener("input", () => {
    settings.crosshairGap = clamp(Number(dom.crosshairGapValue.value) || 0, 0, 36);
    syncCrosshairUi();
});
dom.crosshairGapRange.addEventListener("input", () => {
    settings.crosshairGap = clamp(Number(dom.crosshairGapRange.value) || 0, 0, 36);
    syncCrosshairUi();
});
dom.crosshairGapValue.addEventListener("change", () => {
    settings.crosshairGap = clamp(Number(dom.crosshairGapValue.value) || 0, 0, 36);
    syncCrosshairUi();
});
dom.crosshairOpacityValue.addEventListener("input", () => {
    settings.crosshairOpacity = clamp(Number(dom.crosshairOpacityValue.value) || DEFAULT_CROSSHAIR.opacity, 0.1, 1);
    syncCrosshairUi();
});
dom.crosshairOpacityRange.addEventListener("input", () => {
    settings.crosshairOpacity = clamp(Number(dom.crosshairOpacityRange.value) || DEFAULT_CROSSHAIR.opacity, 0.1, 1);
    syncCrosshairUi();
});
dom.crosshairOpacityValue.addEventListener("change", () => {
    settings.crosshairOpacity = clamp(Number(dom.crosshairOpacityValue.value) || DEFAULT_CROSSHAIR.opacity, 0.1, 1);
    syncCrosshairUi();
});
dom.crosshairOutlineValue.addEventListener("input", () => {
    settings.crosshairOutline = clamp(Number(dom.crosshairOutlineValue.value) || 0, 0, 8);
    syncCrosshairUi();
});
dom.crosshairOutlineRange.addEventListener("input", () => {
    settings.crosshairOutline = clamp(Number(dom.crosshairOutlineRange.value) || 0, 0, 8);
    syncCrosshairUi();
});
dom.crosshairOutlineValue.addEventListener("change", () => {
    settings.crosshairOutline = clamp(Number(dom.crosshairOutlineValue.value) || 0, 0, 8);
    syncCrosshairUi();
});
dom.crosshairDotSizeValue.addEventListener("input", () => {
    settings.crosshairDotSize = clamp(Number(dom.crosshairDotSizeValue.value) || DEFAULT_CROSSHAIR.dotSize, 1, 24);
    syncCrosshairUi();
});
dom.crosshairDotSizeRange.addEventListener("input", () => {
    settings.crosshairDotSize = clamp(Number(dom.crosshairDotSizeRange.value) || DEFAULT_CROSSHAIR.dotSize, 1, 24);
    syncCrosshairUi();
});
dom.crosshairDotSizeValue.addEventListener("change", () => {
    settings.crosshairDotSize = clamp(Number(dom.crosshairDotSizeValue.value) || DEFAULT_CROSSHAIR.dotSize, 1, 24);
    syncCrosshairUi();
});
dom.builderDot.addEventListener("change", () => {
    settings.builderDot = dom.builderDot.checked;
    syncCrosshairUi();
});
dom.builderLines.addEventListener("change", () => {
    settings.builderLines = dom.builderLines.checked;
    syncCrosshairUi();
});
dom.builderRing.addEventListener("change", () => {
    settings.builderRing = dom.builderRing.checked;
    syncCrosshairUi();
});
dom.builderBox.addEventListener("change", () => {
    settings.builderBox = dom.builderBox.checked;
    syncCrosshairUi();
});
dom.builderImage.addEventListener("change", () => {
    settings.builderImage = dom.builderImage.checked;
    syncCrosshairUi();
});
dom.builderDiagonal.addEventListener("change", () => {
    settings.builderDiagonal = dom.builderDiagonal.checked;
    syncCrosshairUi();
});
dom.builderDotSizeValue.addEventListener("input", () => {
    settings.builderDotSize = clamp(Number(dom.builderDotSizeValue.value) || 6, 1, 24);
    syncCrosshairUi();
});
dom.builderDotSizeRange.addEventListener("input", () => {
    settings.builderDotSize = clamp(Number(dom.builderDotSizeRange.value) || 6, 1, 24);
    syncCrosshairUi();
});
dom.builderLineLengthValue.addEventListener("input", () => {
    settings.builderLineLength = clamp(Number(dom.builderLineLengthValue.value) || 0, 0, 48);
    syncCrosshairUi();
});
dom.builderLineLengthRange.addEventListener("input", () => {
    settings.builderLineLength = clamp(Number(dom.builderLineLengthRange.value) || 0, 0, 48);
    syncCrosshairUi();
});
dom.builderRingSizeValue.addEventListener("input", () => {
    settings.builderRingSize = clamp(Number(dom.builderRingSizeValue.value) || 28, 8, 96);
    syncCrosshairUi();
});
dom.builderRingSizeRange.addEventListener("input", () => {
    settings.builderRingSize = clamp(Number(dom.builderRingSizeRange.value) || 28, 8, 96);
    syncCrosshairUi();
});
dom.builderBoxSizeValue.addEventListener("input", () => {
    settings.builderBoxSize = clamp(Number(dom.builderBoxSizeValue.value) || 34, 8, 96);
    syncCrosshairUi();
});
dom.builderBoxSizeRange.addEventListener("input", () => {
    settings.builderBoxSize = clamp(Number(dom.builderBoxSizeRange.value) || 34, 8, 96);
    syncCrosshairUi();
});
dom.builderImageSizeValue.addEventListener("input", () => {
    settings.builderImageSize = clamp(Number(dom.builderImageSizeValue.value) || 48, 8, 160);
    syncCrosshairUi();
});
dom.builderImageSizeRange.addEventListener("input", () => {
    settings.builderImageSize = clamp(Number(dom.builderImageSizeRange.value) || 48, 8, 160);
    syncCrosshairUi();
});
dom.builderImageOpacityValue.addEventListener("input", () => {
    settings.builderImageOpacity = clamp(Number(dom.builderImageOpacityValue.value) || 1, 0.05, 1);
    syncCrosshairUi();
});
dom.builderImageOpacityRange.addEventListener("input", () => {
    settings.builderImageOpacity = clamp(Number(dom.builderImageOpacityRange.value) || 1, 0.05, 1);
    syncCrosshairUi();
});
dom.crosshairImageInput.addEventListener("change", () => {
    handleCrosshairImageUpload(dom.crosshairImageInput.files?.[0]);
});
dom.clearCrosshairImage.addEventListener("click", clearCrosshairImage);
dom.builderRotationValue.addEventListener("input", () => {
    settings.builderRotation = clamp(Number(dom.builderRotationValue.value) || 0, -45, 45);
    syncCrosshairUi();
});
dom.builderRotationRange.addEventListener("input", () => {
    settings.builderRotation = clamp(Number(dom.builderRotationRange.value) || 0, -45, 45);
    syncCrosshairUi();
});
dom.valorantCodeImport.addEventListener("click", () => {
    applyValorantCrosshairCode(dom.valorantCodeInput.value);
});
dom.valorantCodeInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        applyValorantCrosshairCode(dom.valorantCodeInput.value);
    }
});
dom.valorantCenterDot.addEventListener("change", () => {
    settings.valorantCenterDot = dom.valorantCenterDot.checked;
    syncCrosshairUi();
});
dom.valorantInnerLines.addEventListener("change", () => {
    settings.valorantInnerLines = dom.valorantInnerLines.checked;
    syncCrosshairUi();
});
dom.valorantInnerOpacityRange.addEventListener("input", () => {
    settings.valorantInnerOpacity = clamp(Number(dom.valorantInnerOpacityRange.value) || 0, 0, 1);
    syncCrosshairUi();
});
dom.valorantInnerOpacityValue.addEventListener("change", () => {
    settings.valorantInnerOpacity = clamp(Number(dom.valorantInnerOpacityValue.value) || 0, 0, 1);
    syncCrosshairUi();
});
dom.valorantInnerLengthRange.addEventListener("input", () => {
    settings.valorantInnerLength = clamp(Number(dom.valorantInnerLengthRange.value) || 0, 0, 20);
    syncCrosshairUi();
});
dom.valorantInnerLengthValue.addEventListener("change", () => {
    settings.valorantInnerLength = clamp(Number(dom.valorantInnerLengthValue.value) || 0, 0, 20);
    syncCrosshairUi();
});
dom.valorantInnerVerticalLengthRange.addEventListener("input", () => {
    settings.valorantInnerVerticalLength = clamp(Number(dom.valorantInnerVerticalLengthRange.value) || 0, 0, 20);
    syncCrosshairUi();
});
dom.valorantInnerVerticalLengthValue.addEventListener("change", () => {
    settings.valorantInnerVerticalLength = clamp(Number(dom.valorantInnerVerticalLengthValue.value) || 0, 0, 20);
    syncCrosshairUi();
});
dom.valorantInnerThicknessRange.addEventListener("input", () => {
    settings.valorantInnerThickness = clamp(Number(dom.valorantInnerThicknessRange.value) || 1, 1, 10);
    syncCrosshairUi();
});
dom.valorantInnerThicknessValue.addEventListener("change", () => {
    settings.valorantInnerThickness = clamp(Number(dom.valorantInnerThicknessValue.value) || 1, 1, 10);
    syncCrosshairUi();
});
dom.valorantInnerOffsetRange.addEventListener("input", () => {
    settings.valorantInnerOffset = clamp(Number(dom.valorantInnerOffsetRange.value) || 0, 0, 20);
    syncCrosshairUi();
});
dom.valorantInnerOffsetValue.addEventListener("change", () => {
    settings.valorantInnerOffset = clamp(Number(dom.valorantInnerOffsetValue.value) || 0, 0, 20);
    syncCrosshairUi();
});
dom.valorantOuterLines.addEventListener("change", () => {
    settings.valorantOuterLines = dom.valorantOuterLines.checked;
    syncCrosshairUi();
});
dom.valorantOuterOpacityRange.addEventListener("input", () => {
    settings.valorantOuterOpacity = clamp(Number(dom.valorantOuterOpacityRange.value) || 0, 0, 1);
    syncCrosshairUi();
});
dom.valorantOuterOpacityValue.addEventListener("change", () => {
    settings.valorantOuterOpacity = clamp(Number(dom.valorantOuterOpacityValue.value) || 0, 0, 1);
    syncCrosshairUi();
});
dom.valorantOuterLengthRange.addEventListener("input", () => {
    settings.valorantOuterLength = clamp(Number(dom.valorantOuterLengthRange.value) || 0, 0, 20);
    syncCrosshairUi();
});
dom.valorantOuterLengthValue.addEventListener("change", () => {
    settings.valorantOuterLength = clamp(Number(dom.valorantOuterLengthValue.value) || 0, 0, 20);
    syncCrosshairUi();
});
dom.valorantOuterVerticalLengthRange.addEventListener("input", () => {
    settings.valorantOuterVerticalLength = clamp(Number(dom.valorantOuterVerticalLengthRange.value) || 0, 0, 20);
    syncCrosshairUi();
});
dom.valorantOuterVerticalLengthValue.addEventListener("change", () => {
    settings.valorantOuterVerticalLength = clamp(Number(dom.valorantOuterVerticalLengthValue.value) || 0, 0, 20);
    syncCrosshairUi();
});
dom.valorantOuterThicknessRange.addEventListener("input", () => {
    settings.valorantOuterThickness = clamp(Number(dom.valorantOuterThicknessRange.value) || 1, 1, 10);
    syncCrosshairUi();
});
dom.valorantOuterThicknessValue.addEventListener("change", () => {
    settings.valorantOuterThickness = clamp(Number(dom.valorantOuterThicknessValue.value) || 1, 1, 10);
    syncCrosshairUi();
});
dom.valorantOuterOffsetRange.addEventListener("input", () => {
    settings.valorantOuterOffset = clamp(Number(dom.valorantOuterOffsetRange.value) || 0, 0, 40);
    syncCrosshairUi();
});
dom.valorantOuterOffsetValue.addEventListener("change", () => {
    settings.valorantOuterOffset = clamp(Number(dom.valorantOuterOffsetValue.value) || 0, 0, 40);
    syncCrosshairUi();
});
dom.sensitivityProfile.addEventListener("change", () => {
    settings.sensitivityProfile = dom.sensitivityProfile.value;
    settings.sensitivityValue = readProfileValue(settings.sensitivityProfile);
    settings.sensitivityX = readProfileAxisValue(settings.sensitivityProfile, "x", settings.sensitivityValue);
    settings.sensitivityY = readProfileAxisValue(settings.sensitivityProfile, "y", settings.sensitivityValue);
    syncSensitivityUi();
});
dom.sensitivityValue.addEventListener("change", () => {
    settings.sensitivityValue = clamp(Number(dom.sensitivityValue.value) || 0.00001, 0.00001, 100);
    if (!settings.separateAxisSensitivity) {
        settings.sensitivityX = settings.sensitivityValue;
        settings.sensitivityY = settings.sensitivityValue;
    }
    syncSensitivityUi();
});
dom.separateAxisSensitivity.addEventListener("change", () => {
    settings.separateAxisSensitivity = dom.separateAxisSensitivity.checked;
    if (settings.separateAxisSensitivity) {
        settings.sensitivityX = readProfileAxisValue(settings.sensitivityProfile, "x", settings.sensitivityValue);
        settings.sensitivityY = readProfileAxisValue(settings.sensitivityProfile, "y", settings.sensitivityValue);
    }
    syncSensitivityUi();
});
dom.sensitivityX.addEventListener("change", () => {
    settings.sensitivityX = clamp(Number(dom.sensitivityX.value) || 0.00001, 0.00001, 100);
    syncSensitivityUi();
});
dom.sensitivityY.addEventListener("change", () => {
    settings.sensitivityY = clamp(Number(dom.sensitivityY.value) || 0.00001, 0.00001, 100);
    syncSensitivityUi();
});
dom.invertX.addEventListener("change", syncSettings);
dom.invertY.addEventListener("change", syncSettings);
dom.restartBtn.addEventListener("click", () => {
    if (dom.restartBtn.disabled) {
        return;
    }
    window.clearTimeout(restartUnlockTimer);
    dom.resultScreen.classList.add("hidden");
    dom.startScreen.classList.remove("hidden");
    dom.settingsBtn.classList.remove("hidden");
    void loadLeaderboard(settings.practiceMode);
});

dom.pauseBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    openPauseMenu();
});
dom.resumeBtn.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopPropagation();
    resumeGame();
});
dom.resumeBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.detail === 0) {
        resumeGame();
    }
});
dom.pauseSettingsBtn.addEventListener("click", () => openSettings(true));
dom.backBtn.addEventListener("click", returnToStart);

dom.canvas.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) {
        return;
    }
    if (!state.active) {
        return;
    }
    if (state.paused) {
        if (!state.pauseMenuOpen) {
            resumeGame();
        }
        return;
    }
    if (performance.now() < state.suppressShootUntil) {
        return;
    }
    if (document.pointerLockElement !== dom.canvas && !state.lockFallback) {
        state.lockFallback = true;
        requestAimLock();
        showToast(t("live"));
        return;
    }
    if (document.pointerLockElement !== dom.canvas) {
        requestAimLock();
        showToast(t("clickToResume"), true);
        return;
    }
    shoot();
});

document.addEventListener("pointerlockchange", () => {
    if (!state.active) {
        return;
    }
    state.lockFallback = false;

    if (document.pointerLockElement === dom.canvas) {
        state.ignoreMouseUntil = performance.now() + POINTER_LOCK_MOUSE_SETTLE_MS;
        if (state.resumePending || (!state.pauseMenuOpen && !state.settingsOpen)) {
            finishResume();
        }
        return;
    }

    if (state.resumePending || state.resumeClickRequired) {
        return;
    }

    if (!state.pauseMenuOpen && !state.settingsOpen) {
        const pauseDelay = state.resumeIgnorePointerUnlockUntil - performance.now();
        if (pauseDelay > 0) {
            window.setTimeout(() => {
                if (
                    state.active
                    && !state.resumePending
                    && !state.resumeClickRequired
                    && !state.pauseMenuOpen
                    && !state.settingsOpen
                    && document.pointerLockElement !== dom.canvas
                ) {
                    openPauseMenu();
                }
            }, pauseDelay + 20);
            return;
        }
        openPauseMenu();
    }
});

document.addEventListener("pointerlockerror", () => {
    if (!state.active || !state.resumePending) {
        return;
    }
    window.setTimeout(() => {
        if (state.active && state.resumePending && document.pointerLockElement !== dom.canvas) {
            showToast(t("clickToResume"), true);
        }
    }, 120);
});

document.addEventListener("mousemove", (event) => {
    if (!state.active || state.paused || document.pointerLockElement !== dom.canvas) {
        return;
    }
    if (performance.now() < state.ignoreMouseUntil) {
        return;
    }
    if (
        Math.abs(event.movementX) > MOUSE_SPIKE_THRESHOLD
        || Math.abs(event.movementY) > MOUSE_SPIKE_THRESHOLD
    ) {
        return;
    }
    const xSign = settings.invertX ? -1 : 1;
    const ySign = settings.invertY ? 1 : -1;
    state.yaw += event.movementX * getRadPerCount("x") * xSign;
    if (Math.abs(state.yaw) > MAX_ABS_YAW) {
        state.yaw = wrapRadians(state.yaw);
    }
    state.pitch = clamp(state.pitch + event.movementY * getRadPerCount("y") * ySign, -1.18, 1.05);
    updateForward();
});

document.addEventListener("keydown", (event) => {
    if (
        event.code === "Tab"
        && state.active
        && state.paused
        && state.pauseMenuOpen
        && dom.settingsOverlay.classList.contains("hidden")
    ) {
        event.preventDefault();
        resumeGame();
        return;
    }
    if (event.code === "Escape") {
        event.preventDefault();
        if (!dom.settingsOverlay.classList.contains("hidden")) {
            closeSettings();
            return;
        }
        if (state.active) {
            if (state.pauseMenuOpen) {
                showToast(t("pausedToast"));
            } else {
                openPauseMenu();
            }
            return;
        }
        if (!dom.startScreen.classList.contains("hidden")) {
            openSettings(false);
        }
    }
    if (event.code === "Space" && state.active && !state.paused) {
        event.preventDefault();
        shoot();
    }
});

window.addEventListener("beforeunload", () => {
    cancelAnimationFrame(animationId);
});

window.matchMedia?.("(prefers-color-scheme: light)")?.addEventListener("change", () => {
    if (settings.themeMode === "auto") {
        applyTheme();
    }
});
