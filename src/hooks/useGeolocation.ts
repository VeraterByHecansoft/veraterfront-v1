import { useState, useEffect, useCallback } from 'react';

export interface DataCoordsType {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: number;
}
interface GeolocationState {
    coords: DataCoordsType | null;
    error: string | null;
    loading: boolean;
    permission: PermissionState | 'unsupported';
}

export function useGeolocation() {
    const [coords, setCoords] = useState<GeolocationState['coords']>(null);
    const [error, setError] = useState<GeolocationState['error']>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [permission, setPermission] = useState<GeolocationState['permission']>('unsupported');

    const onSuccess = useCallback((position: GeolocationPosition) => {
        setCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().getTime(),
        });
        setLoading(false);
        setError(null);
    }, []);

    const onError = useCallback((err: GeolocationPositionError) => {
        setError(err.message);
        setLoading(false);
    }, []);

    const requestPermission = useCallback(async () => {
        if (!('permissions' in navigator)) {
            setPermission('unsupported');
            return;
        }
        try {
            const status = await navigator.permissions.query({ name: 'geolocation' });
            setPermission(status.state);
            status.onchange = () => setPermission(status.state);
        } catch {
            setPermission('unsupported');
        }
    }, []);

    const requestLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setError('Geolocalización no soportada en este navegador');
            return;
        }
        setLoading(true);
        navigator.geolocation.getCurrentPosition(onSuccess, onError, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
        });
    }, [onSuccess, onError]);

    useEffect(() => {
        requestPermission();
    }, [requestPermission]);

    return {
        coords,
        error,
        loading,
        permission,
        requestLocation,
        requestPermission
    };
}
