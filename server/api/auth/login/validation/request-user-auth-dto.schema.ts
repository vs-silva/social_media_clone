import ValidationEngine from "../../../../engines/validation-engine";

export const RequestUserAuthDTOSchema = ValidationEngine.object({
    username: ValidationEngine.string()
        .required()
        .min(3)
        .max(30)
        .required(),

    password: ValidationEngine.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required()
});
