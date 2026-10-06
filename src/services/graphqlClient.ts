import {
    ApolloClient,
    HttpLink,
    InMemoryCache,
    split,
} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import * as SecureStore from 'expo-secure-store';
import { createClient } from 'graphql-ws';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://13.48.136.159:5003/api';
const HTTP_GRAPHQL =
    process.env.EXPO_PUBLIC_GRAPHQL_URL || API_URL.replace(/\/api$/, '') + '/graphql';
const WS_URL =
    process.env.EXPO_PUBLIC_GRAPHQL_WS_URL || API_URL.replace(/^http/, 'ws').replace(/\/api$/, '') + '/graphql';

// HTTP link for queries and mutations
const httpLink = new HttpLink({
    uri: HTTP_GRAPHQL,
    headers: {
        'Content-Type': 'application/json',
    },
    fetch: async (uri, options) => {
        const token = await SecureStore.getItemAsync('authToken');
        const headers = new Headers(options?.headers);
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return fetch(uri, { ...options, headers });
    },
});

// Lazily create the WebSocket link only when first needed.
// This avoids "WebSocket implementation missing" during Expo Web's
// SSR / module-evaluation phase where globalThis.WebSocket may not
// yet be wired up by graphql-ws's environment detection.
let _wsLink: GraphQLWsLink | null = null;
function getWsLink(): GraphQLWsLink {
    if (!_wsLink) {
        _wsLink = new GraphQLWsLink(
            createClient({
                url: WS_URL,
                // Explicitly pass the platform WebSocket — works for both
                // React Native (built-in) and browser environments.
                webSocketImpl: globalThis.WebSocket,
                connectionParams: async () => {
                    const token = await SecureStore.getItemAsync('authToken');
                    return token ? { authorization: `Bearer ${token}` } : {};
                },
                lazy: true,
                retryAttempts: 5,
                shouldRetry: () => true,
                on: {
                    connected: () => console.log('[GraphQL WS] Connected'),
                    closed: (event) => console.log('[GraphQL WS] Closed', event?.code, event?.reason),
                    error: (err) => console.warn('[GraphQL WS] Error', err?.message),
                },
            })
        );
    }
    return _wsLink;
}

// Split: use WebSocket for subscriptions, HTTP for queries/mutations
const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    // Wrap in a lazy link so wsLink is only instantiated on first subscription
    (operation) => getWsLink().request(operation),
    httpLink
);

export const apolloClient = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
            errorPolicy: 'all',
        },
        query: {
            fetchPolicy: 'cache-first',
            errorPolicy: 'all',
        },
        mutate: {
            errorPolicy: 'all',
        },
    },
});

export const clearApolloCache = async () => {
    try {
        await apolloClient.clearStore();
    } catch (error) {
        console.warn('Error clearing Apollo cache:', error);
    }
};

export { WS_URL };
