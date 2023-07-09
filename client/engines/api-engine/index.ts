import axios, {AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from "axios";

export function ApiEngine(baseURL: string, emitter?: EventEmitterDriverPorts): AxiosInstance {

    const engine = axios.create({
        baseURL: baseURL,
        timeout: (60 * 1000),
        timeoutErrorMessage: 'Timeout error. Please verify service availability and network connection.', //TODO - change this I18n
        headers: {
            'Content-Type': 'application/json'
        }
    });

    engine.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        if(!startedServiceRequestEvent.trim()){
            emitter?.emit(startedServiceRequestEvent);
        }

        return config;

    },handleRejectError);

    engine.interceptors.response.use((response: AxiosResponse) => {

        if(!endedServiceRequestEvent.trim()){
            emitter?.emit(endedServiceRequestEvent);
        }

        return response;
    },handleRejectError);

    function handleRejectError(error: object): object {

        if(!errorServiceRequestEvent.trim()){
            emitter?.emit(errorServiceRequestEvent);
        }

        return Promise.reject(error);
    }

    return engine;
}
