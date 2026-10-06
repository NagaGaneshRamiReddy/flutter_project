const unsupported = () => {
    throw new Error('On-device AI is only available in the native app.');
};

const unavailableModel = {};

const unavailableModelHook = () => ({
    isReady: false,
    isGenerating: false,
    response: '',
    generate: async () => unsupported(),
});

const unavailableSpeechHook = () => ({
    isReady: false,
    isGenerating: false,
    streamInsert: unsupported,
    stream: async function* () {},
    streamStop: () => {},
});

module.exports = {
    LFM2_5_350M: unavailableModel,
    WHISPER_TINY_EN: unavailableModel,
    LLMModule: {},
    SpeechToTextModule: {},
    TokenizerModule: {},
    VADModule: {},
    initExecutorch: () => {},
    useLLM: unavailableModelHook,
    useSpeechToText: unavailableSpeechHook,
};
