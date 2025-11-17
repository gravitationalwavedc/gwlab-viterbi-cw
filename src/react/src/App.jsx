import { createFarceRouter, createRender, makeRouteConfig, Route } from 'found';
import { BrowserProtocol, queryMiddleware } from 'farce';
import { Resolver } from 'found-relay';
import { graphql } from 'react-relay';
import environment from './environment';
import MyJobs from './Pages/MyJobs';
import PublicJobs from './Pages/PublicJobs';
import NewJob from './Pages/NewJob';
import DuplicateJobForm from './Components/Forms/DuplicateJobForm';
import ViewJob from './Pages/ViewJob';
import Layout from './Layout';
import HandleRender from './HandleRender';
import HandleLayoutRender from './HandleLayoutRender';
import APIToken from './Pages/APIToken';
import Error404 from './Error404';
import './assets/styles.scss';
import './assets/scss/theme.scss';

function App() {
    const Router = createFarceRouter({
        historyProtocol: new BrowserProtocol(),
        historyMiddlewares: [queryMiddleware],
        routeConfig: makeRouteConfig(
            <Route
                path="/"
                Component={Layout}
                render={HandleLayoutRender}
                query={graphql`
                    query App_Layout_Query {
                        ...Layout_sessionUser
                    }
                `}
            >
                <Route
                    Component={PublicJobs}
                    query={graphql`
                        query App_HomePage_Query(
                            $count: Int!,
                            $cursor: String,
                            $search: String,
                            $timeRange: String
                        ) {
                            gwclouduser {
                                username
                            }
                            ...PublicJobs_data
                        }
                    `}
                    prepareVariables={() => ({
                        timeRange: 'all',
                        count: 100
                    })}
                    render={HandleRender}
                />
                <Route
                    path="job-form"
                    Component={NewJob}
                    render={HandleRender}
                />
                <Route
                    path="job-form/duplicate/"
                    query={graphql`
                        query App_JobForm_Query($jobId: ID!) {
                            ...DuplicateJobForm_data @arguments(jobId: $jobId)
                        }
                    `}
                    prepareVariables={(params, { location }) => ({
                        jobId: location.state && location.state.jobId ? location.state.jobId : ''
                    })}
                    Component={DuplicateJobForm}
                    render={HandleRender}
                />
                <Route
                    path="job-list"
                    query={graphql`
                        query App_JobList_Query($count: Int!, $cursor: String, $orderBy: String) {
                            ...MyJobs_data
                        }
                    `}
                    prepareVariables={() => ({
                        count: 100,
                        timeRange: 'all',
                    })}
                    Component={MyJobs}
                    render={HandleRender}
                />
                <Route
                    path="job-results/:jobId/"
                    Component={ViewJob}
                    query={graphql`
                        query App_ViewJob_Query($jobId: ID!) {
                            ...ViewJob_data @arguments(jobId: $jobId)
                        }
                    `}
                    prepareVariables={(params) => ({
                        jobId: params.jobId,
                    })}
                    render={HandleRender}
                />
                <Route
                    Component={APIToken}
                    path="api-token"
                    query={graphql`
                        query App_APIToken_Query {
                            ...APIToken_data
                        }
                    `}
                    render={HandleRender}
                />
                <Route path="*" Component={Error404} />
            </Route>
        ),
        render: createRender({}),
    });
    return <Router resolver={new Resolver(environment)} />;
}

export default App;
