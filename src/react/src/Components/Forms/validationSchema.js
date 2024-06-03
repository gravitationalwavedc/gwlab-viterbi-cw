import * as Yup from 'yup';

// Creating validation schema factory to allow checking field value against initial values
// https://stackoverflow.com/a/61802357
let validationSchema = (initialValues) => Yup.object().shape({
    name: Yup.string()
        .min(5, 'Make the title longer than 5 characters.')
        .max(30, 'Make the title less than 30 characters.')
        .matches(/^[0-9a-z\_\-]+$/i, 'Remove any spaces or special characters.')
        .test(
            'changeInitialName',
            'Name must be modified from default',
            (value) => value !== initialValues.name
        )
        .required(),

    description: Yup.string()
        .test(
            'changeInitialDescription',
            'Description must be modified from default',
            (value) => value !== initialValues.description
        ),

    startFrequencyBand: Yup.number().required(),
    minStartTime: Yup.number().required(),
    maxStartTime: Yup.number().required(),

    asini: Yup.number().required(),
    freqBand: Yup.number().required(),
    alpha: Yup.number().required(),
    delta: Yup.number().required(),
    orbitTp: Yup.number().required(),
    orbitPeriod: Yup.number().required(),
    driftTime: Yup.number().required(),
    dFreq: Yup.number().required(),

    searchStartTime: Yup.number().required(),
    searchTBlock: Yup.number().required(),
    searchCentralA0: Yup.number().required(),
    searchA0Band: Yup.number().required(),
    searchA0Bins: Yup.number().integer().positive().required(),
    searchCentralP: Yup.number().required(),
    searchPBand: Yup.number().required(),
    searchPBins: Yup.number().integer().positive().required(),
    searchCentralOrbitTp: Yup.number().required(),
    searchOrbitTpBand: Yup.number().required(),
    searchOrbitTpBins: Yup.number().integer().positive().required(),
    searchLLThreshold: Yup.number().required()
});

export default validationSchema;
