import { useState } from 'react';
import { Row, Col, Button, Container, Card, Form, Alert } from 'react-bootstrap';
import { graphql, createFragmentContainer, commitMutation } from 'react-relay';
import FormCard from '../Components/Forms/FormCard';
import { CopyButton, CheckButton } from '../Components/CustomButtons';
import moment from 'moment';
import Environment from '../environment.jsx';

const APIToken = ({ data }) => {
    const [tokens, setTokens] = useState(data.listApiTokens || []);
    const [isCreatingToken, setIsCreatingToken] = useState(false);
    const [tokenName, setTokenName] = useState('');
    const [tokenCreationError, setTokenCreationError] = useState('');
    const [newlyCreatedToken, setNewlyCreatedToken] = useState(null);

    function revoke(id) {
        commitMutation(Environment, {
            mutation: graphql`
                mutation APITokenRevokeMutation($id: ID!) {
                    deleteApiToken(id: $id) {
                        success
                    }
                }
            `,
            variables: { id },
            onCompleted: (response) => {
                if (response && response.deleteApiToken.success === true) {
                    setTokens(tokens.filter((e) => e.id !== id));
                }
            },
        });
    }

    function createToken(name) {
        setTokenCreationError('');
        commitMutation(Environment, {
            mutation: graphql`
                mutation APITokenCreateMutation($name: String) {
                    createApiToken(name: $name) {
                        id
                        token
                        expiry
                        shortcode
                    }
                }
            `,
            variables: { name },
            onCompleted: (response) => {
                if (response && response.createApiToken.token) {
                    const { createApiToken: newToken } = response;
                    setTokens([...tokens, newToken]);
                    setNewlyCreatedToken(newToken);
                    setTokenName('');
                    setIsCreatingToken(false);
                }
            },
            onError: (error) => {
                setTokenCreationError(error.message);
            },
        });
    }

    return (
        <Container>
            <Row>
                <Col>
                    <h1>API Tokens</h1>
                    <p>
                        API tokens are used to authenticate with the GW Lab APIs when using scripts or external tools.
                        Keep your tokens secure and do not share them with others.
                    </p>
                </Col>
            </Row>

            {tokens.length === 0 && !isCreatingToken && (
                <Row>
                    <Col>
                        <Alert variant="info">
                            <p>You do not have any API tokens associated with your account.</p>
                        </Alert>
                    </Col>
                </Row>
            )}

            {tokens.map((token) => (
                <Row key={token.id} className="mb-3">
                    <Col>
                        <Card>
                            <Card.Body>
                                <Row>
                                    <Col md={8}>
                                        <h5>{token.name || 'Unnamed Token'}</h5>
                                        <p className="text-muted small">
                                            Created: {moment(token.created).format('MMMM Do YYYY, h:mm:ss a')}
                                            {token.expiry && (
                                                <> | Expires: {moment(token.expiry).format('MMMM Do YYYY, h:mm:ss a')}</>
                                            )}
                                        </p>
                                    </Col>
                                    <Col md={4} className="text-end">
                                        <CheckButton
                                            content="Revoke"
                                            cancelContent="Are you sure you want to revoke this token? This action cannot be undone."
                                            onClick={() => revoke(token.id)}
                                            variant="outline-danger"
                                            size="sm"
                                            className="me-2"
                                        />
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            ))}

            {newlyCreatedToken && (
                <Row className="mb-3">
                    <Col>
                        <Alert variant="success" dismissible onClose={() => setNewlyCreatedToken(null)}>
                            <Alert.Heading>Token Created Successfully!</Alert.Heading>
                            <p>
                                Your new API token has been created. Copy it now as it will not be shown again.
                            </p>
                            <div className="d-flex align-items-center">
                                <code className="me-2 flex-grow-1">{newlyCreatedToken.token}</code>
                                <CopyButton content="Copy" copyContent={newlyCreatedToken.token} />
                            </div>
                            <hr />
                            <p className="mb-0">
                                <strong>Token ID:</strong> {newlyCreatedToken.shortcode}
                                {newlyCreatedToken.expiry && (
                                    <>
                                        <br />
                                        <strong>Expires:</strong> {moment(newlyCreatedToken.expiry).format('MMMM Do YYYY, h:mm:ss a')}
                                    </>
                                )}
                            </p>
                        </Alert>
                    </Col>
                </Row>
            )}

            <Row className="mb-3">
                <Col>
                    {!isCreatingToken ? (
                        <Button variant="primary" onClick={() => setIsCreatingToken(true)}>
                            Create New Token
                        </Button>
                    ) : (
                        <FormCard title="Create New API Token">
                            {tokenCreationError && (
                                <Alert variant="danger">{tokenCreationError}</Alert>
                            )}
                            <Form.Group className="mb-3">
                                <Form.Label>Token Name (Optional)</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter a name for your token"
                                    value={tokenName}
                                    onChange={(e) => setTokenName(e.target.value)}
                                />
                                <Form.Text className="text-muted">
                                    Give your token a descriptive name to help you remember its purpose.
                                </Form.Text>
                            </Form.Group>
                            <Button
                                variant="primary"
                                onClick={() => createToken(tokenName)}
                                disabled={!tokenName.trim()}
                            >
                                Create Token
                            </Button>
                            <Button
                                variant="outline-secondary"
                                className="ms-2"
                                onClick={() => {
                                    setIsCreatingToken(false);
                                    setTokenName('');
                                    setTokenCreationError('');
                                }}
                            >
                                Cancel
                            </Button>
                        </FormCard>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default createFragmentContainer(APIToken, {
    data: graphql`
        fragment APIToken_data on Query {
            listApiTokens {
                id
                name
                created
                expiry
                shortcode
            }
        }
    `,
});
