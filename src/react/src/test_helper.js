// Helper object to fill Jobs on the public page.
// To use this import as data into any page that uses public viterbi jobStatus
// then replace the existing data with this object.
//
// Don't forget to switch back before creating a diff!


const testData = {
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

export default testData;
