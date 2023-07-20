import {ref} from "@vue/runtime-core";
import User from "../../integration/user";
import type {ResponseUserRegisterDTO} from "../../../server/business/user/core/dtos/response-user-register.dto";
import type {RequestUserRegisterDTO} from "../../../server/business/user/core/dtos/request-user-register.dto";
import type {RequestUserAuthDTO} from "../../../server/business/user/core/dtos/request-user-auth.dto";
import type {ResponseUserAuthDTO} from "../../../server/business/user/core/dtos/response-user-auth.dto";


export const UserStoreIdentifier = 'user-store';

export function UserStore() {

    const user = ref<ResponseUserRegisterDTO | ResponseUserAuthDTO  | null>(null);

    async function signup(dto: RequestUserRegisterDTO): Promise<void> {
        user.value = await User.signup(dto) as ResponseUserRegisterDTO;
    }

    async function login(dto: RequestUserAuthDTO): Promise<void> {
        user.value = await User.login(dto) as ResponseUserAuthDTO;
        await renewAccessToken();
    }

    async function renewAccessToken(): Promise<void> {

        if(!user.value || !(user.value as ResponseUserAuthDTO).accessToken?.trim()) {
            return;
        }

        const result = await User.decodeAccessToken((user.value as ResponseUserAuthDTO).accessToken);

        setTimeout(async () => {
            await refreshToken((user.value as ResponseUserAuthDTO).accessToken);
        }, result?.renewCountTimer);
    }

    async function getUser(accessToken: string): Promise<void> {
        user.value = await User.getUser(accessToken) as ResponseUserAuthDTO;
    }

    async function refreshToken(accessToken: string): Promise<void> {
        const result = await User.refreshToken(accessToken);

        if(!result) {
            return;
        }

        (user.value as ResponseUserAuthDTO).accessToken = result.accessToken;
        await getUser(accessToken);
        await renewAccessToken();

    }

    return {
        user,
        signup,
        login,
        renewAccessToken,
        refreshToken,
        getUser
    };
}
