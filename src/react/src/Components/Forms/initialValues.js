const initialValues = {
    // Job Details
    name: 'Untitled',
    description: 'A good description is specific, unique, and memorable.',
    private: true,

    // Data Page
    dataChoice: 'real',
    sourceDataset: 'o1',

    // Data Parameters Page
    startTime: 1126259462.391,
    duration: '10m',
    h0: 8e-26,
    a0: 1.45,
    orbitTp: 2.56,
    signalFrequency: 150,
    psi: 0,
    cosi: 1,
    alpha: '',
    delta: '',
    orbitPeriod: 68023.84,
    randSeed: (Math.random()*4294967296)>>>0,
    ifo: [],
    noiseLevel: 4e-24,

    // Search Parameters Page
    frequency: 10.54,
    band: 10.54,
    a0Start: 10.54,
    a0End: 10.54,
    a0Bins: 500,
    orbitTpStart: 10.54,
    orbitTpEnd: 10.54,
    orbitTpBins: 500,
    alphaSearch: 7.54,
    deltaSearch: 7.54,
    orbitPeriodSearch: 10.54
};

export default initialValues;
