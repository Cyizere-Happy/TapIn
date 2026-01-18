import { apiClient } from './apiClient';

class PortalService {
    /**
     * Fetches the current mode of the portal (check-in or attendance)
     */
    async getPortalMode() {
        try {
            return await apiClient.get('/portal/mode');
        } catch (error) {
            console.error('Error fetching portal mode:', error);
            throw error;
        }
    }

    /**
     * Submits a check-in or attendance entry
     * @param {Object} data - Entry data (name, mode, compliance flags, etc.)
     */
    async submitEntry(data) {
        try {
            // Basic input sanitization/cleaning before submission
            const payload = {
                name: data.name?.trim(),
                mode: data.mode,
                hasBankSlip: !!data.hasBankSlip,
                hasDocuments: !!data.hasDocuments,
                hasCable: !!data.hasCable,
                // IP and MAC will ideally be captured by the backend or injected if available via specialized APIs
                ipAddress: data.ipAddress || 'unknown',
                macAddress: data.macAddress || 'unknown'
            };

            return await apiClient.post('/portal/submit', payload);
        } catch (error) {
            console.error('Error submitting entry:', error);
            throw error;
        }
    }
}

export const portalService = new PortalService();
