export interface MediaFileCloudEntity {
    id: string;
    publicId: string;
    version: number;
    signature: string;
    width: number;
    height: number;
    format: string,
    resourceType: string;
    createdAt: Date;
    bytes: number;
    type: string;
    url: string;
    secureUrl: string;
}
