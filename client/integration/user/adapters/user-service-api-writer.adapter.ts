import type {UserServiceWriterDrivenPorts} from "../ports/user-service-writer-driven.ports";
import type {RequestUserRegisterDTO} from "../../../../server/business/user/core/dtos/request-user-register.dto";
import type {ResponseUserRegisterDTO} from "../../../../server/business/user/core/dtos/response-user-register.dto";
import {AxiosInstance} from "axios";
import {ApiEngine} from "../../../engines/api-engine";
import {ApiEngineConfigDTO} from "../../../engines/api-engine/api-engine-config.dto";
import EventbusEngine from "../../../engines/eventbus-engine";
import {UserServiceResourceConstants} from "../core/constants/user-service-resource.constants";
import {UserServiceEventTypeConstants} from "../core/constants/user-service-event-type.constants";

export function UserServiceApiWriterAdapter(): UserServiceWriterDrivenPorts {

    const engine: AxiosInstance = ApiEngine(<ApiEngineConfigDTO>{
        baseURL: UserServiceResourceConstants.ROOT,
        startedServiceRequestEvent: UserServiceEventTypeConstants.USER_SERVICE_REQUEST_STARTED,
        endedServiceRequestEvent: UserServiceEventTypeConstants.USER_SERVICE_REQUEST_ENDED,
        errorServiceRequestEvent: UserServiceEventTypeConstants.USER_SERVICE_REQUEST_FAILED
    }, EventbusEngine);

    async function register(dto: RequestUserRegisterDTO, resource: string): Promise<ResponseUserRegisterDTO | null> {

        try {
            const response = await engine.post(resource, dto);
            return response.data as ResponseUserRegisterDTO;
        } catch (error) {
            return null
        }

    }

    return {
      register
    };
}
