import { PollStatus } from '../types';

const BASE_URL = (import.meta.env && import.meta.env.DEV) ? '/api' : 'https://whatef-production.up.railway.app/api';

const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || error.message || 'API request failed');
    }
    return response.json();
};

// --- Users ---
export const login = async (email, password) => {
    const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
};

export const guestLogin = async (name, email, country) => {
    const response = await fetch(`${BASE_URL}/guest-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, country }),
    });
    return handleResponse(response);
};

export const registerUser = async (name, email, password, country) => {
    const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, country }),
    });
    return handleResponse(response);
}

// --- Comics ---
export const getComics = async () => {
    const response = await fetch(`${BASE_URL}/comics`);
    return handleResponse(response);
};

// --- Polls ---
export const getPolls = async (userId) => {
    const url = userId ? `${BASE_URL}/polls?userId=${userId}` : `${BASE_URL}/polls`;
    const response = await fetch(url);
    return handleResponse(response);
};

export const submitVote = async (pollId, optionId, userId) => {
    const response = await fetch(`${BASE_URL}/polls/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pollId, optionId, userId }),
    });
    return handleResponse(response);
};

// --- Bundles ---
export const getBundles = async () => {
    const response = await fetch(`${BASE_URL}/bundles`);
    return handleResponse(response);
};

export const getBundleById = async (id) => {
    const response = await fetch(`${BASE_URL}/bundles/${id}`);
    return handleResponse(response);
};

export const getComicsByBundleId = async (bundleId) => {
    const response = await fetch(`${BASE_URL}/bundles/${bundleId}/comics`);
    return handleResponse(response);
}

// --- Custom Editions ---
export const getCustomEditions = async (userId) => {
    const response = await fetch(`${BASE_URL}/custom-editions?userId=${userId}`);
    return handleResponse(response);
};

export const createCustomEdition = async (
    userId,
    comicId,
    customName,
    avatarReference
) => {
    const response = await fetch(`${BASE_URL}/custom-editions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, comicId, customName, avatarReference }),
    });
    return handleResponse(response);
};

// --- Admin Helpers ---
const getAdminHeaders = (adminId) => ({
    'Content-Type': 'application/json',
    'x-user-id': adminId.toString()
});

// --- Admin: Users ---
export const getUsers = async (adminId) => {
    const response = await fetch(`${BASE_URL}/admin/users`, {
        headers: getAdminHeaders(adminId)
    });
    return handleResponse(response);
};

export const deleteUser = async (adminId, userId) => {
    const response = await fetch(`${BASE_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: getAdminHeaders(adminId)
    });
    return handleResponse(response);
};

export const updateUserRole = async (adminId, userId, role) => {
    const response = await fetch(`${BASE_URL}/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: getAdminHeaders(adminId),
        body: JSON.stringify({ role })
    });
    return handleResponse(response);
};

// --- Admin: Comics ---
export const createComic = async (adminId, comicData) => {
    const response = await fetch(`${BASE_URL}/comics`, {
        method: 'POST',
        headers: getAdminHeaders(adminId),
        body: JSON.stringify(comicData)
    });
    return handleResponse(response);
};

export const updateComic = async (adminId, comicId, comicData) => {
    const response = await fetch(`${BASE_URL}/comics/${comicId}`, {
        method: 'PUT',
        headers: getAdminHeaders(adminId),
        body: JSON.stringify(comicData)
    });
    return handleResponse(response);
};

export const deleteComic = async (adminId, comicId) => {
    const response = await fetch(`${BASE_URL}/comics/${comicId}`, {
        method: 'DELETE',
        headers: getAdminHeaders(adminId)
    });
    return handleResponse(response);
};

// --- Admin: Polls ---
export const createPoll = async (adminId, pollData) => {
    const response = await fetch(`${BASE_URL}/polls`, {
        method: 'POST',
        headers: getAdminHeaders(adminId),
        body: JSON.stringify(pollData)
    });
    return handleResponse(response);
};

export const updatePollStatus = async (adminId, pollId, status) => {
    const response = await fetch(`${BASE_URL}/polls/${pollId}`, {
        method: 'PUT',
        headers: getAdminHeaders(adminId),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
};

export const deletePoll = async (adminId, pollId) => {
    const response = await fetch(`${BASE_URL}/polls/${pollId}`, {
        method: 'DELETE',
        headers: getAdminHeaders(adminId)
    });
    return handleResponse(response);
};

// --- Admin: Bundles ---
export const createBundle = async (adminId, bundleData) => {
    const response = await fetch(`${BASE_URL}/bundles`, {
        method: 'POST',
        headers: getAdminHeaders(adminId),
        body: JSON.stringify(bundleData)
    });
    return handleResponse(response);
};

export const updateBundle = async (adminId, bundleId, bundleData) => {
    const response = await fetch(`${BASE_URL}/bundles/${bundleId}`, {
        method: 'PUT',
        headers: getAdminHeaders(adminId),
        body: JSON.stringify(bundleData)
    });
    return handleResponse(response);
};

export const deleteBundle = async (adminId, bundleId) => {
    const response = await fetch(`${BASE_URL}/bundles/${bundleId}`, {
        method: 'DELETE',
        headers: getAdminHeaders(adminId)
    });
    return handleResponse(response);
};

// --- Admin: Custom Editions ---
export const getAdminCustomEditions = async (adminId) => {
    const response = await fetch(`${BASE_URL}/admin/custom-editions`, {
        headers: getAdminHeaders(adminId)
    });
    return handleResponse(response);
};

export const updateCustomEditionStatus = async (adminId, editionId, delivery_status) => {
    const response = await fetch(`${BASE_URL}/admin/custom-editions/${editionId}`, {
        method: 'PUT',
        headers: getAdminHeaders(adminId),
        body: JSON.stringify({ delivery_status })
    });
    return handleResponse(response);
};

// --- Subscribers ---
export const subscribeToNewsletter = async (email) => {
    const response = await fetch(`${BASE_URL}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
    return handleResponse(response);
};

// Mock purchase API
export const purchaseBundle = async (bundleId, userId) => {
    console.log(`Purchasing bundle ${bundleId} for user ${userId}`);
    return new Promise(resolve => setTimeout(() => resolve(true), 500));
};
