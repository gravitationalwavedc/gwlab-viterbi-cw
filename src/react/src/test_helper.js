// Helper object to fill Jobs on the public page.
// To use this import as data into any page that uses public viterbi jobStatus
// then replace the existing data with this object.
//
// Don't forget to switch back before creating a diff!


const testViterbiJobs = {
    publicViterbiJobs: {
        pageInfo: {
            hasNextPage: false,
            endCursor: 'YXJyYXljb25uZWN0aW9uOjEx'
        },
        edges: [
            {
                node: {
                    id: 'Vml0ZXJiaUpvYk5vZGU6NA==',
                    user: 'Lewis Lakerink',
                    name: 'LewisTest1',
                    description: 'A good description is specific, unique, and memorable.',
                    jobStatus: {
                        name: 'Completed'
                    },
                    labels: [],
                    __typename: 'ViterbiPublicJobNode'
                },
                cursor: 'YXJyYXljb25uZWN0aW9uOjA='
            },
            {
                node: {
                    id: 'Vml0ZXJiaUpvYk5vZGU6NQ==',
                    user: 'Lewis Lakerink',
                    name: 'LewisTest2',
                    description: 'Detailed description of a really nice job.',
                    jobStatus: {
                        name: 'Completed'
                    },
                    labels: [],
                    __typename: 'ViterbiPublicJobNode'
                },
                cursor: 'YXJyYXljb25uZWN0aW9uOjE='
            },
            {
                node: {
                    id: 'Vml0ZXJiaUpvYk5vZGU6Ng==',
                    user: 'Gregory Poole',
                    name: 'Just_the_Defaults',
                    description: 'This run just uses all the given defaults',
                    jobStatus: {
                        name: 'Completed'
                    },
                    labels: [],
                    __typename: 'ViterbiPublicJobNode'
                },
                cursor: 'YXJyYXljb25uZWN0aW9uOjI='
            },
            {
                node: {
                    id: 'Vml0ZXJiaUpvYk5vZGU6OA==',
                    user: 'Hannah Middleton',
                    name: 'DefaultExpectFreq',
                    description: 'Looking in a noisey band at 501 Hz',
                    jobStatus: {
                        name: 'Completed'
                    },
                    labels: [],
                    __typename: 'ViterbiPublicJobNode'
                },
                cursor: 'YXJyYXljb25uZWN0aW9uOjM='
            },
            {
                node: {
                    id: 'Vml0ZXJiaUpvYk5vZGU6MTY=',
                    user: 'Hannah Middleton',
                    name: 'defaultsTestRun',
                    description: 'Test run using default values',
                    jobStatus: {
                        name: 'Completed'
                    },
                    labels: [],
                    __typename: 'ViterbiPublicJobNode'
                },
                cursor: 'YXJyYXljb25uZWN0aW9uOjQ='
            },
            {
                node: {
                    id: 'Vml0ZXJiaUpvYk5vZGU6MTg=',
                    user: 'Hannah Middleton',
                    name: 'DefaultsExceptTemplateNos',
                    description: 'Only changing the number of templates',
                    jobStatus: {
                        name: 'Completed'
                    },
                    labels: [],
                    __typename: 'ViterbiPublicJobNode'
                },
                cursor: 'YXJyYXljb25uZWN0aW9uOjU='
            },
            {
                node: {
                    id: 'Vml0ZXJiaUpvYk5vZGU6MjU=',
                    user: 'Patrick Clearwater',
                    name: 'TestDupe210',
                    description: 'A duplicate of job 210 to see if it fails',
                    jobStatus: {
                        name: 'Completed'
                    },
                    labels: [],
                    __typename: 'ViterbiPublicJobNode'
                },
                cursor: 'YXJyYXljb25uZWN0aW9uOjY='
            },
            {
                node: {
                    id: 'Vml0ZXJiaUpvYk5vZGU6MjY=',
                    user: 'Hannah Middleton',
                    name: 'DuplicateForDefaultWithF700',
                    description: 'A duplicate job of Copy-of-DefaultWithF700. Original description: A good description is specific, unique, and memorable.',
                    jobStatus: {
                        name: 'Completed'
                    },
                    labels: [],
                    __typename: 'ViterbiPublicJobNode'
                },
                cursor: 'YXJyYXljb25uZWN0aW9uOjc='
            },
            {
                node: {
                    id: 'Vml0ZXJiaUpvYk5vZGU6Mjc=',
                    user: 'Patrick Clearwater',
                    name: 'TestDupe211',
                    description: 'Duplicate of 211',
                    jobStatus: {
                        name: 'Completed'
                    },
                    labels: [],
                    __typename: 'ViterbiPublicJobNode'
                },
                cursor: 'YXJyYXljb25uZWN0aW9uOjg='
            },
            {
                node: {
                    id: 'Vml0ZXJiaUpvYk5vZGU6MzY=',
                    user: 'Hannah Middleton',
                    name: 'defaultFreqTest',
                    description: 'Using default settings apart from template bins.',
                    jobStatus: {
                        name: 'Completed'
                    },
                    labels: [],
                    __typename: 'ViterbiPublicJobNode'
                },
                cursor: 'YXJyYXljb25uZWN0aW9uOjk='
            },
            {
                node: {
                    id: 'Vml0ZXJiaUpvYk5vZGU6Mzk=',
                    user: 'Thomas Reichardt',
                    name: 'OhBoy',
                    description: 'A good description is specific, unique, and memorable.',
                    jobStatus: {
                        name: 'Submitted'
                    },
                    labels: [],
                    __typename: 'ViterbiPublicJobNode'
                },
                cursor: 'YXJyYXljb25uZWN0aW9uOjEw'
            },
            {
                node: {
                    id: 'Vml0ZXJiaUpvYk5vZGU6NDU=',
                    user: 'Thomas Reichardt',
                    name: 'Untitled1',
                    description: 'A duplicate job of Untitled. Original description: A good description is specific, unique, and memorable.',
                    jobStatus: {
                        name: 'Completed'
                    },
                    labels: [],
                    __typename: 'ViterbiPublicJobNode'
                },
                cursor: 'YXJyYXljb25uZWN0aW9uOjEx'
            }
        ]
    }
};

const testViewJob = {
    viterbiJob: {
        id: 'Vml0ZXJiaUpvYk5vZGU6NA==',
        userId: 2,
        lastUpdated: '2020-12-10 20:46:02 UTC',
        start: {
            name: 'LewisTest1',
            description: 'A good description is specific, unique, and memorable.',
            private: false
        },
        jobStatus: {
            name: 'Completed',
            number: 500,
            date: '2020-12-10 21:29:48 UTC'
        },
        data: {
            startFrequencyBand: '188',
            minStartTime: '1238166483',
            maxStartTime: '1254582483',
            asini: '0.01844',
            freqBand: '1.2136296',
            alpha: '4.974817413935078',
            delta: '-0.4349442914295658',
            orbitTp: '1238161512.786',
            orbitPeriod: '4995.263',
            driftTime: '864000',
            dFreq: '5.78703704e-7',
            id: 'RGF0YVR5cGU6NA=='
        },
        search: {
            searchStartTime: '1238166483',
            searchTBlock: '864000',
            searchCentralA0: '0.01844',
            searchA0Band: '0.00012',
            searchA0Bins: '1',
            searchCentralP: '4995.263',
            searchPBand: '0.003',
            searchPBins: '1',
            searchCentralOrbitTp: '1238160263.9702501',
            searchOrbitTpBand: '260.8101737969591',
            searchOrbitTpBins: '9',
            searchLLThreshold: '296.27423',
            id: 'U2VhcmNoVHlwZTo0'
        },
        labels: []
    },
    allLabels: []
};

const testResultFiles = {
    viterbiResultFiles: {
        id: 'Vml0ZXJiaVJlc3VsdEZpbGVzOk5vbmU=',
        files: [
            {
                path: '/archive.tar.gz',
                isDir: false,
                fileSize: 985630720,
                downloadId: '86a7f874-15ac-4a70-8b6f-ba40e5e9a6ab'
            },
            {
                path: '/atoms',
                isDir: true,
                fileSize: 33280,
                downloadId: ''
            },
            {
                path: '/atoms/188-0',
                isDir: true,
                fileSize: 33280,
                downloadId: ''
            },
            {
                path: '/atoms/188-0/atoms-0',
                isDir: false,
                fileSize: 50695729,
                downloadId: 'b992625a-e23e-4159-9813-c7a56905c603'
            },
            {
                path: '/atoms/188-0/atoms-1',
                isDir: false,
                fileSize: 50695729,
                downloadId: '71db6f59-2f73-433e-951c-553a0917629a'
            },
            {
                path: '/atoms/188-0/atoms-10',
                isDir: false,
                fileSize: 50695729,
                downloadId: 'eebcddaf-2b30-483c-b2f8-a4141ef3206e'
            },
            {
                path: '/atoms/188-0/atoms-11',
                isDir: false,
                fileSize: 50695729,
                downloadId: 'e0f8a927-6863-475d-b9a5-6723e43a09a5'
            },
            {
                path: '/atoms/188-0/atoms-12',
                isDir: false,
                fileSize: 50695729,
                downloadId: '45de9cb8-5ccd-4f5c-94e1-c97485fad7c4'
            },
            {
                path: '/atoms/188-0/atoms-13',
                isDir: false,
                fileSize: 50695729,
                downloadId: 'b56c5780-e51e-4753-bc0f-2e2ba44d114f'
            },
            {
                path: '/atoms/188-0/atoms-14',
                isDir: false,
                fileSize: 50695729,
                downloadId: 'f78f16db-020d-4634-a3f6-64aa69217617'
            },
            {
                path: '/atoms/188-0/atoms-15',
                isDir: false,
                fileSize: 50695729,
                downloadId: '50cafbc4-9413-4f7e-9846-1e43ef3273c1'
            },
            {
                path: '/atoms/188-0/atoms-16',
                isDir: false,
                fileSize: 50695729,
                downloadId: 'dcbd8bc8-8164-4499-b3f2-c5546eae5a42'
            },
            {
                path: '/atoms/188-0/atoms-17',
                isDir: false,
                fileSize: 50695729,
                downloadId: '0792ee08-e02f-4a71-9d4e-e80db62e4256'
            },
            {
                path: '/atoms/188-0/atoms-18',
                isDir: false,
                fileSize: 50695729,
                downloadId: '04d1a58d-7dae-4ced-b811-6132429cfdd8'
            },
            {
                path: '/atoms/188-0/atoms-2',
                isDir: false,
                fileSize: 50695729,
                downloadId: '4a5817dd-aadf-43ea-a70a-603894cd2794'
            },
            {
                path: '/atoms/188-0/atoms-3',
                isDir: false,
                fileSize: 50695729,
                downloadId: '5206ac4a-6f4c-414c-bdd8-974f2199aedd'
            },
            {
                path: '/atoms/188-0/atoms-4',
                isDir: false,
                fileSize: 50695729,
                downloadId: 'c0c0d228-5ae7-4824-8a68-986224ba6320'
            },
            {
                path: '/atoms/188-0/atoms-5',
                isDir: false,
                fileSize: 50695729,
                downloadId: 'f582746d-764a-49e5-b6ce-747c27717a07'
            },
            {
                path: '/atoms/188-0/atoms-6',
                isDir: false,
                fileSize: 50695729,
                downloadId: 'f04ae928-5667-4e14-99c0-4387cdc83f0d'
            },
            {
                path: '/atoms/188-0/atoms-7',
                isDir: false,
                fileSize: 50695729,
                downloadId: '9eb431c3-58eb-470b-9f75-623e847af5fb'
            },
            {
                path: '/atoms/188-0/atoms-8',
                isDir: false,
                fileSize: 50695729,
                downloadId: '7278e3c5-2cb9-4b58-b737-5e89c70380ec'
            },
            {
                path: '/atoms/188-0/atoms-9',
                isDir: false,
                fileSize: 50695729,
                downloadId: 'ab6b0ae4-f128-4669-93f9-e27e6f09675d'
            },
            {
                path: '/atoms/188-0/sfts_used.txt',
                isDir: false,
                fileSize: 1591100,
                downloadId: '90429f4e-5c17-44f2-a7e5-55ef7b90dcd6'
            },
            {
                path: '/atoms/LewisTest1_atoms.err',
                isDir: false,
                fileSize: 962,
                downloadId: '478a9527-2759-4a9b-9725-4fe6b1d715a1'
            },
            {
                path: '/atoms/LewisTest1_atoms.out',
                isDir: false,
                fileSize: 9373,
                downloadId: 'b1e5dedc-c083-41ee-aa05-29d01f8f7318'
            },
            {
                path: '/LewisTest1_atoms.ini',
                isDir: false,
                fileSize: 397,
                downloadId: '1a0dfb87-2d70-49fb-84e0-47e4b59ce753'
            },
            {
                path: '/LewisTest1_viterbi.ini',
                isDir: false,
                fileSize: 544,
                downloadId: 'f2528b8e-7e42-4b0b-aca1-849c4b9364b2'
            },
            {
                path: '/submit',
                isDir: true,
                fileSize: 33280,
                downloadId: ''
            },
            {
                path: '/submit/LewisTest1_atoms.sh',
                isDir: false,
                fileSize: 816,
                downloadId: '403d5ce6-397f-43f4-807f-43fc751ba5a5'
            },
            {
                path: '/submit/LewisTest1_master_slurm.err',
                isDir: false,
                fileSize: 0,
                downloadId: '634a3641-0ae3-424f-949a-1e3b43d76c2f'
            },
            {
                path: '/submit/LewisTest1_master_slurm.out',
                isDir: false,
                fileSize: 0,
                downloadId: 'cce23dac-c4be-4a65-a774-f16f091c3f54'
            },
            {
                path: '/submit/LewisTest1_master_slurm.sh',
                isDir: false,
                fileSize: 527,
                downloadId: 'a1d42e2d-231b-41ef-9568-2338cdbea759'
            },
            {
                path: '/submit/LewisTest1_viterbi.sh',
                isDir: false,
                fileSize: 910,
                downloadId: 'fc900eb1-490b-440a-89a8-ed4ce345827f'
            },
            {
                path: '/submit/slurm_ids',
                isDir: false,
                fileSize: 28,
                downloadId: 'eeefdf24-05ab-46c1-9b28-b92e0fc31446'
            },
            {
                path: '/viterbi',
                isDir: true,
                fileSize: 33280,
                downloadId: ''
            },
            {
                path: '/viterbi/LewisTest1_viterbi.err',
                isDir: false,
                fileSize: 0,
                downloadId: '176fc61d-ac4a-4674-a9dd-5b0097dbf493'
            },
            {
                path: '/viterbi/LewisTest1_viterbi.out',
                isDir: false,
                fileSize: 2605,
                downloadId: '96ae8363-5aec-45a8-8323-f62ca7de63e9'
            },
            {
                path: '/viterbi/results_a0_phase_loglikes_scores.dat',
                isDir: false,
                fileSize: 1170,
                downloadId: 'f35d3d4d-cd89-4895-8049-e4b787c9761f'
            },
            {
                path: '/viterbi/results_path.dat',
                isDir: false,
                fileSize: 399,
                downloadId: 'e2f8ce82-2b0a-4f62-97ce-cb168ae8ab1a'
            },
            {
                path: '/viterbi/results_scores.dat',
                isDir: false,
                fileSize: 20767607,
                downloadId: 'fb04180f-48ef-4aa4-b69a-69181e312102'
            }
        ],
    }
};

export {
    testViterbiJobs,
    testViewJob,
    testResultFiles
};
