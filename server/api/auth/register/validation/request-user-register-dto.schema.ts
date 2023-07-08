import ValidationEngine from "../../../../engines/validation-engine";

export const RequestUserRegisterDTOSchema = ValidationEngine.object({
    email: ValidationEngine.string().email().required(),

    password: ValidationEngine.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),

    repeatPassword: ValidationEngine.ref('password'),

    username: ValidationEngine.string()
        .required()
        .min(3)
        .max(30)
        .required(),

    name: ValidationEngine.string()
        .min(3)
        .max(30)
        .optional()
});

