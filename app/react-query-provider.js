"use client"

import {
    QueryClient,
    QueryClientProvider
} from "@tanstack/react-query";

import { getQueryClient } from "./query-client-function";


const QueryProvider = ({ children }) => {
    const queryClient = getQueryClient();
    return <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
};
export default QueryProvider;