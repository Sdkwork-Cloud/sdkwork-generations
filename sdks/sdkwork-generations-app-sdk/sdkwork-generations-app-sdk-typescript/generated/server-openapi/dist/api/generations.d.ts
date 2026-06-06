import type { HttpClient } from '../http/client';
import type { CreateGenerationCommandRequest, FavoriteGenerationRequest, GenerationActionRequest, GenerationCommandResponse, GenerationModality, GenerationRecord, GenerationRecordPage, GenerationResult, GenerationResultPage, GenerationStatus, GenerationTimelineEventPage, SaveGenerationResultToAssetsRequest } from '../types';
export interface GenerationsTimelineListParams {
    cursor?: string;
    pageSize?: number;
}
export declare class GenerationsTimelineApi {
    private client;
    constructor(client: HttpClient);
    list(generationId: string, params?: GenerationsTimelineListParams): Promise<GenerationTimelineEventPage>;
}
export interface GenerationsResultsListParams {
    cursor?: string;
    pageSize?: number;
}
export interface GenerationsResultsSaveToAssetsParams {
    idempotencyKey?: string;
}
export declare class GenerationsResultsApi {
    private client;
    constructor(client: HttpClient);
    list(generationId: string, params?: GenerationsResultsListParams): Promise<GenerationResultPage>;
    saveToAssets(generationId: string, resultId: string, body: SaveGenerationResultToAssetsRequest, params?: GenerationsResultsSaveToAssetsParams): Promise<GenerationResult>;
}
export interface GenerationsVoiceSpeechParams {
    idempotencyKey?: string;
}
export interface GenerationsVoiceTranscriptionParams {
    idempotencyKey?: string;
}
export interface GenerationsVoiceTranslationParams {
    idempotencyKey?: string;
}
export declare class GenerationsVoiceApi {
    private client;
    constructor(client: HttpClient);
    speech(body: CreateGenerationCommandRequest, params?: GenerationsVoiceSpeechParams): Promise<GenerationCommandResponse>;
    transcription(body: CreateGenerationCommandRequest, params?: GenerationsVoiceTranscriptionParams): Promise<GenerationCommandResponse>;
    translation(body: CreateGenerationCommandRequest, params?: GenerationsVoiceTranslationParams): Promise<GenerationCommandResponse>;
}
export interface GenerationsMusicTextToMusicParams {
    idempotencyKey?: string;
}
export interface GenerationsMusicLyricsToMusicParams {
    idempotencyKey?: string;
}
export declare class GenerationsMusicApi {
    private client;
    constructor(client: HttpClient);
    textToMusic(body: CreateGenerationCommandRequest, params?: GenerationsMusicTextToMusicParams): Promise<GenerationCommandResponse>;
    lyricsToMusic(body: CreateGenerationCommandRequest, params?: GenerationsMusicLyricsToMusicParams): Promise<GenerationCommandResponse>;
}
export interface GenerationsVideosTextToVideoParams {
    idempotencyKey?: string;
}
export interface GenerationsVideosImageToVideoParams {
    idempotencyKey?: string;
}
export interface GenerationsVideosVideoExtendParams {
    idempotencyKey?: string;
}
export declare class GenerationsVideosApi {
    private client;
    constructor(client: HttpClient);
    textToVideo(body: CreateGenerationCommandRequest, params?: GenerationsVideosTextToVideoParams): Promise<GenerationCommandResponse>;
    imageToVideo(body: CreateGenerationCommandRequest, params?: GenerationsVideosImageToVideoParams): Promise<GenerationCommandResponse>;
    videoExtend(body: CreateGenerationCommandRequest, params?: GenerationsVideosVideoExtendParams): Promise<GenerationCommandResponse>;
}
export interface GenerationsImagesTextToImageParams {
    idempotencyKey?: string;
}
export interface GenerationsImagesImageEditParams {
    idempotencyKey?: string;
}
export declare class GenerationsImagesApi {
    private client;
    constructor(client: HttpClient);
    textToImage(body: CreateGenerationCommandRequest, params?: GenerationsImagesTextToImageParams): Promise<GenerationCommandResponse>;
    imageEdit(body: CreateGenerationCommandRequest, params?: GenerationsImagesImageEditParams): Promise<GenerationCommandResponse>;
}
export interface GenerationsListParams {
    cursor?: string;
    pageSize?: number;
    status?: GenerationStatus;
    modality?: GenerationModality;
    operationType?: string;
    q?: string;
}
export interface GenerationsCancelParams {
    idempotencyKey?: string;
}
export interface GenerationsRetryParams {
    idempotencyKey?: string;
}
export declare class GenerationsApi {
    private client;
    readonly images: GenerationsImagesApi;
    readonly videos: GenerationsVideosApi;
    readonly music: GenerationsMusicApi;
    readonly voice: GenerationsVoiceApi;
    readonly results: GenerationsResultsApi;
    readonly timeline: GenerationsTimelineApi;
    constructor(client: HttpClient);
    list(params?: GenerationsListParams): Promise<GenerationRecordPage>;
    get(generationId: string): Promise<GenerationRecord>;
    cancel(generationId: string, body?: GenerationActionRequest, params?: GenerationsCancelParams): Promise<GenerationRecord>;
    retry(generationId: string, body?: GenerationActionRequest, params?: GenerationsRetryParams): Promise<GenerationCommandResponse>;
    favorite(generationId: string, body: FavoriteGenerationRequest): Promise<GenerationRecord>;
}
export declare function createGenerationsApi(client: HttpClient): GenerationsApi;
//# sourceMappingURL=generations.d.ts.map