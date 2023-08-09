import type {UserServiceReaderDrivenPorts} from "../ports/user-service-reader-driven.ports";
import {AxiosInstance} from "axios";
import {ApiEngine} from "../../../engines/api-engine";
import EventbusEngine from "../../../engines/eventbus-engine";
import {UserServiceResourceConstants} from "../core/constants/user-service-resource.constants";
import {UserServiceEventTypeConstants} from "../core/constants/user-service-event-type.constants";
import {UserServiceAuthConstants} from "../core/constants/user-service-auth.constants";
import type {ApiEngineConfigDTO} from "../../../engines/api-engine/api-engine-config.dto";
import type {ResponseTokenRefreshDTO} from "../../../server/business/token/core/dtos/response-token-refresh.dto";
import type {ResponseUserAuthDTO} from "../../../server/business/user/core/dtos/response-user-auth.dto";

export function UserServiceApiReaderAdapter(): UserServiceReaderDrivenPorts {

    const engine: AxiosInstance = ApiEngine(<ApiEngineConfigDTO>{
        baseURL: UserServiceResourceConstants.ROOT,
        startedServiceRequestEvent: UserServiceEventTypeConstants.USER_SERVICE_REQUEST_STARTED,
        endedServiceRequestEvent: UserServiceEventTypeConstants.USER_SERVICE_REQUEST_ENDED,
        errorServiceRequestEvent: UserServiceEventTypeConstants.USER_SERVICE_REQUEST_FAILED
    }, EventbusEngine);

    async function refresh(resource: string): Promise<ResponseTokenRefreshDTO | null> {

        try {
            const response = await engine.get(resource);
            const accessToken = response.data[`${UserServiceAuthConstants.ACCESS_TOKEN}`];
            engine.defaults.headers.common[`${UserServiceAuthConstants.AUTHORIZATION}`] = `${UserServiceAuthConstants.BEARER} ${accessToken}`;
            return response.data;
        } catch (error) {
            return null;
        }

    }

    async function getUserInfo(resource: string): Promise<ResponseUserAuthDTO | null> {
        try {
            const response = await engine.get(resource);
            return response.data;
        } catch (error) {
            return null;
        }
    }

    return {
      refresh,
      getUserInfo
    };
}
