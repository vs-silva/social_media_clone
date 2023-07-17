import axios, {AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from "axios";
import type {ApiEngineConfigDTO} from "./api-engine-config.dto";
import type {ApiEngineEventEmitterDriverPorts} from "./api-engine-event-emitter-driver.ports";

export function ApiEngine(dto: ApiEngineConfigDTO, emitter?: ApiEngineEventEmitterDriverPorts): AxiosInstance {

    const engine = axios.create({
        baseURL: dto.baseURL,
        timeout: (60 * 1000),
        timeoutErrorMessage: 'api.message.error.timeout',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    engine.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        if(dto.startedServiceRequestEvent?.trim()){
            emitter?.emit(dto.startedServiceRequestEvent);
        }

        return config;

    },handleRejectError);

    engine.interceptors.response.use((response: AxiosResponse) => {

        if(dto.endedServiceRequestEvent?.trim()){
            emitter?.emit(dto.endedServiceRequestEvent);
        }

        return response;
    },handleRejectError);

    function handleRejectError(error: object): object {

        if(dto.errorServiceRequestEvent?.trim()){
            emitter?.emit(dto.errorServiceRequestEvent);
        }

        return Promise.reject(error);
    }

    return engine;
}
