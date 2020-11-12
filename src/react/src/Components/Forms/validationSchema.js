import * as Yup from 'yup';

let validationSchema = Yup.object().shape({
    name: Yup.string()
        .min(5, 'Make the title longer than 5 characters.')
        .max(30, 'Make the title less than 30 characters.')
        .matches(/^[0-9a-z\_\-]+$/i, 'Remove any spaces or special characters.')
        .required(),

    startTime: Yup.number().required(),
    duration: Yup.string().required(),

    h0: Yup.number().required(),
    a0: Yup.number().required(),
    orbitTp: Yup.number().required(),
    signalFrequency: Yup.number().required(),
    psi: Yup.number().required(),
    cosi: Yup.number().required(),
    alpha: Yup.number().when('dataChoice', {
        is: 'simulated',
        then: Yup.number().required()
    }),
    delta: Yup.number().when('dataChoice', {
        is: 'simulated',
        then: Yup.number().required()
    }),
    orbitPeriod: Yup.number().required(),
    randSeed: Yup.number().required(),
    ifo: Yup.array().when('dataChoice', {
        is: 'simulated',
        then: Yup.array().required()
    }),
    noiseLevel: Yup.number().required(),

    frequency: Yup.number().required(),
    band: Yup.number().required(),
    a0Start: Yup.number().required(),
    a0End: Yup.number().required(),
    a0Bins: Yup.number().required(),
    orbitTpStart: Yup.number().required(),
    orbitTpEnd: Yup.number().required(),
    orbitTpBins: Yup.number().required(),
    alphaSearch: Yup.number().required(),
    deltaSearch: Yup.number().required(),
    orbitPeriodSearch: Yup.number().required(),
});

export default validationSchema;
