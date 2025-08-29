import fetch from 'node-fetch';

interface FredObservation {
    realtime_start: string;
    realtime_end: string;
    date: string;
    value: string;
}

interface FredApiResponse {
    realtime_start: string;
    realtime_end: string;
    observation_start: string;
    observation_end: string;
    units: string;
    output_type: number;
    file_type: string;
    order_by: string;
    sort_order: string;
    count: number;
    offset: number;
    limit: number;
    observations: FredObservation[];
}

interface PrimeRateSuccess {
    rate: number;
    date: string;
    success: true;
}

interface PrimeRateError {
    rate: null;
    date: null;
    success: false;
    error: string;
}

type PrimeRateResponse = PrimeRateSuccess | PrimeRateError;

const getPrimeInterestRate = async (): Promise<PrimeRateResponse> => {
    try {
        const endpoint = `https://api.stlouisfed.org/fred/series/observations?series_id=DPRIME&api_key=${process.env.FEDERAL_RESERVE_API_KEY}&file_type=json&limit=1&sort_order=desc`;
        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: FredApiResponse =
            (await response.json()) as FredApiResponse;

        if (data.observations && data.observations.length > 0) {
            const observation = data.observations[0];
            return {
                rate: parseFloat(observation.value),
                date: observation.date,
                success: true,
            };
        } else {
            throw new Error('No prime rate data available');
        }
    } catch (error) {
        return {
            rate: null,
            date: null,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
};

export const federalReserveService = {
    getPrimeInterestRate,
};
