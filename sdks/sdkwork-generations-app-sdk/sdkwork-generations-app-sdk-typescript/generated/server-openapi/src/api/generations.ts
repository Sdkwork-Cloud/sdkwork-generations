import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { CreateGenerationCommandRequest, FavoriteGenerationRequest, GenerationActionRequest, GenerationCommandResponse, GenerationModality, GenerationRecord, GenerationRecordPage, GenerationResult, GenerationResultPage, GenerationStatus, GenerationTimelineEventPage, SaveGenerationResultToAssetsRequest } from '../types';


export interface GenerationsTimelineListParams {
  cursor?: string;
  pageSize?: number;
}

export class GenerationsTimelineApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


async list(generationId: string, params?: GenerationsTimelineListParams): Promise<GenerationTimelineEventPage> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<GenerationTimelineEventPage>(appendQueryString(appApiPath(`/generations/${serializePathParameter(generationId, { name: 'generationId', style: 'simple', explode: false })}/timeline`), query));
  }
}

export interface GenerationsResultsListParams {
  cursor?: string;
  pageSize?: number;
}

export interface GenerationsResultsSaveToAssetsParams {
  idempotencyKey?: string;
}

export class GenerationsResultsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


async list(generationId: string, params?: GenerationsResultsListParams): Promise<GenerationResultPage> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<GenerationResultPage>(appendQueryString(appApiPath(`/generations/${serializePathParameter(generationId, { name: 'generationId', style: 'simple', explode: false })}/results`), query));
  }

async saveToAssets(generationId: string, resultId: string, body: SaveGenerationResultToAssetsRequest, params?: GenerationsResultsSaveToAssetsParams): Promise<GenerationResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params?.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<GenerationResult>(appApiPath(`/generations/${serializePathParameter(generationId, { name: 'generationId', style: 'simple', explode: false })}/results/${serializePathParameter(resultId, { name: 'resultId', style: 'simple', explode: false })}/save_to_assets`), body, undefined, requestHeaders, 'application/json');
  }
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

export class GenerationsVoiceApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


async speech(body: CreateGenerationCommandRequest, params?: GenerationsVoiceSpeechParams): Promise<GenerationCommandResponse> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params?.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<GenerationCommandResponse>(appApiPath(`/generations/voice/speech`), body, undefined, requestHeaders, 'application/json');
  }

async transcription(body: CreateGenerationCommandRequest, params?: GenerationsVoiceTranscriptionParams): Promise<GenerationCommandResponse> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params?.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<GenerationCommandResponse>(appApiPath(`/generations/voice/transcription`), body, undefined, requestHeaders, 'application/json');
  }

async translation(body: CreateGenerationCommandRequest, params?: GenerationsVoiceTranslationParams): Promise<GenerationCommandResponse> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params?.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<GenerationCommandResponse>(appApiPath(`/generations/voice/translation`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface GenerationsSoundEffectsCreateParams {
  idempotencyKey?: string;
}

export class GenerationsSoundEffectsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


async create(body: CreateGenerationCommandRequest, params?: GenerationsSoundEffectsCreateParams): Promise<GenerationCommandResponse> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params?.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<GenerationCommandResponse>(appApiPath(`/generations/sound_effects`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface GenerationsMusicTextToMusicParams {
  idempotencyKey?: string;
}

export interface GenerationsMusicLyricsToMusicParams {
  idempotencyKey?: string;
}

export class GenerationsMusicApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


async textToMusic(body: CreateGenerationCommandRequest, params?: GenerationsMusicTextToMusicParams): Promise<GenerationCommandResponse> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params?.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<GenerationCommandResponse>(appApiPath(`/generations/music/text_to_music`), body, undefined, requestHeaders, 'application/json');
  }

async lyricsToMusic(body: CreateGenerationCommandRequest, params?: GenerationsMusicLyricsToMusicParams): Promise<GenerationCommandResponse> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params?.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<GenerationCommandResponse>(appApiPath(`/generations/music/lyrics_to_music`), body, undefined, requestHeaders, 'application/json');
  }
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

export class GenerationsVideosApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


async textToVideo(body: CreateGenerationCommandRequest, params?: GenerationsVideosTextToVideoParams): Promise<GenerationCommandResponse> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params?.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<GenerationCommandResponse>(appApiPath(`/generations/videos/text_to_video`), body, undefined, requestHeaders, 'application/json');
  }

async imageToVideo(body: CreateGenerationCommandRequest, params?: GenerationsVideosImageToVideoParams): Promise<GenerationCommandResponse> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params?.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<GenerationCommandResponse>(appApiPath(`/generations/videos/image_to_video`), body, undefined, requestHeaders, 'application/json');
  }

async videoExtend(body: CreateGenerationCommandRequest, params?: GenerationsVideosVideoExtendParams): Promise<GenerationCommandResponse> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params?.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<GenerationCommandResponse>(appApiPath(`/generations/videos/video_extend`), body, undefined, requestHeaders, 'application/json');
  }
}

export interface GenerationsImagesTextToImageParams {
  idempotencyKey?: string;
}

export interface GenerationsImagesImageEditParams {
  idempotencyKey?: string;
}

export class GenerationsImagesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


async textToImage(body: CreateGenerationCommandRequest, params?: GenerationsImagesTextToImageParams): Promise<GenerationCommandResponse> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params?.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<GenerationCommandResponse>(appApiPath(`/generations/images/text_to_image`), body, undefined, requestHeaders, 'application/json');
  }

async imageEdit(body: CreateGenerationCommandRequest, params?: GenerationsImagesImageEditParams): Promise<GenerationCommandResponse> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params?.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<GenerationCommandResponse>(appApiPath(`/generations/images/image_edit`), body, undefined, requestHeaders, 'application/json');
  }
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

export class GenerationsApi {
  private client: HttpClient;
  public readonly images: GenerationsImagesApi;
  public readonly videos: GenerationsVideosApi;
  public readonly music: GenerationsMusicApi;
  public readonly soundEffects: GenerationsSoundEffectsApi;
  public readonly voice: GenerationsVoiceApi;
  public readonly results: GenerationsResultsApi;
  public readonly timeline: GenerationsTimelineApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.images = new GenerationsImagesApi(client);
    this.videos = new GenerationsVideosApi(client);
    this.music = new GenerationsMusicApi(client);
    this.soundEffects = new GenerationsSoundEffectsApi(client);
    this.voice = new GenerationsVoiceApi(client);
    this.results = new GenerationsResultsApi(client);
    this.timeline = new GenerationsTimelineApi(client);
  }


async list(params?: GenerationsListParams): Promise<GenerationRecordPage> {
    const query = buildQueryString([
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
      { name: 'modality', value: params?.modality, style: 'form', explode: true, allowReserved: false },
      { name: 'operation_type', value: params?.operationType, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<GenerationRecordPage>(appendQueryString(appApiPath(`/generations`), query));
  }

async get(generationId: string): Promise<GenerationRecord> {
    return this.client.get<GenerationRecord>(appApiPath(`/generations/${serializePathParameter(generationId, { name: 'generationId', style: 'simple', explode: false })}`));
  }

async cancel(generationId: string, body?: GenerationActionRequest, params?: GenerationsCancelParams): Promise<GenerationRecord> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params?.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<GenerationRecord>(appApiPath(`/generations/${serializePathParameter(generationId, { name: 'generationId', style: 'simple', explode: false })}/cancel`), body, undefined, requestHeaders, 'application/json');
  }

async retry(generationId: string, body?: GenerationActionRequest, params?: GenerationsRetryParams): Promise<GenerationCommandResponse> {
    const requestHeaders = buildRequestHeaders(
      {
        'Idempotency-Key': { value: params?.idempotencyKey, style: 'simple', explode: false },
      },
      {}
    );
    return this.client.post<GenerationCommandResponse>(appApiPath(`/generations/${serializePathParameter(generationId, { name: 'generationId', style: 'simple', explode: false })}/retry`), body, undefined, requestHeaders, 'application/json');
  }

async favorite(generationId: string, body: FavoriteGenerationRequest): Promise<GenerationRecord> {
    return this.client.post<GenerationRecord>(appApiPath(`/generations/${serializePathParameter(generationId, { name: 'generationId', style: 'simple', explode: false })}/favorite`), body, undefined, undefined, 'application/json');
  }
}

export function createGenerationsApi(client: HttpClient): GenerationsApi {
  return new GenerationsApi(client);
}

function appendQueryString(path: string, rawQueryString: string): string {
  const query = rawQueryString.replace(/^\?+/, '');
  if (!query) {
    return path;
  }
  return path.includes('?') ? `${path}&${query}` : `${path}?${query}`;
}

interface PathParameterSpec {
  name: string;
  style: string;
  explode: boolean;
}

function serializePathParameter(value: unknown, spec: PathParameterSpec): string {
  if (value === undefined || value === null) {
    return '';
  }

  const style = spec.style || 'simple';
  if (Array.isArray(value)) {
    return serializePathArray(spec.name, value, style, spec.explode);
  }
  if (typeof value === 'object') {
    return serializePathObject(spec.name, value as Record<string, unknown>, style, spec.explode);
  }
  return pathPrefix(spec.name, style, false) + encodePathValue(serializePathPrimitive(value));
}

function serializePathArray(name: string, values: unknown[], style: string, explode: boolean): string {
  const serialized = values
    .filter((item) => item !== undefined && item !== null)
    .map((item) => encodePathValue(serializePathPrimitive(item)));
  if (serialized.length === 0) {
    return pathPrefix(name, style, false);
  }
  if (style === 'matrix') {
    return explode
      ? serialized.map((item) => `;${name}=${item}`).join('')
      : `;${name}=${serialized.join(',')}`;
  }
  return pathPrefix(name, style, false) + serialized.join(explode ? '.' : ',');
}

function serializePathObject(name: string, value: Record<string, unknown>, style: string, explode: boolean): string {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== undefined && entryValue !== null);
  if (entries.length === 0) {
    return pathPrefix(name, style, true);
  }
  if (style === 'matrix') {
    return explode
      ? entries.map(([key, entryValue]) => `;${encodePathValue(key)}=${encodePathValue(serializePathPrimitive(entryValue))}`).join('')
      : `;${name}=${entries.flatMap(([key, entryValue]) => [encodePathValue(key), encodePathValue(serializePathPrimitive(entryValue))]).join(',')}`;
  }
  const serialized = explode
    ? entries.map(([key, entryValue]) => `${encodePathValue(key)}=${encodePathValue(serializePathPrimitive(entryValue))}`).join(style === 'label' ? '.' : ',')
    : entries.flatMap(([key, entryValue]) => [encodePathValue(key), encodePathValue(serializePathPrimitive(entryValue))]).join(',');
  return pathPrefix(name, style, true) + serialized;
}

function pathPrefix(name: string, style: string, _objectValue: boolean): string {
  if (style === 'label') return '.';
  if (style === 'matrix') return `;${name}`;
  return '';
}

function encodePathValue(value: string): string {
  return encodeURIComponent(value);
}

function serializePathPrimitive(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}
interface QueryParameterSpec {
  name: string;
  value: unknown;
  style: string;
  explode: boolean;
  allowReserved: boolean;
  contentType?: string;
}

function buildQueryString(parameters: QueryParameterSpec[]): string {
  const pairs: string[] = [];
  for (const parameter of parameters) {
    appendSerializedParameter(pairs, parameter);
  }
  return pairs.join('&');
}

function appendSerializedParameter(pairs: string[], parameter: QueryParameterSpec): void {
  if (parameter.value === undefined || parameter.value === null) {
    return;
  }

  if (parameter.contentType) {
    pairs.push(`${encodeQueryComponent(parameter.name)}=${encodeQueryValue(JSON.stringify(parameter.value), parameter.allowReserved)}`);
    return;
  }

  const style = parameter.style || 'form';
  if (style === 'deepObject') {
    appendDeepObjectParameter(pairs, parameter.name, parameter.value, parameter.allowReserved);
    return;
  }

  if (Array.isArray(parameter.value)) {
    appendArrayParameter(pairs, parameter.name, parameter.value, style, parameter.explode, parameter.allowReserved);
    return;
  }

  if (typeof parameter.value === 'object') {
    appendObjectParameter(pairs, parameter.name, parameter.value as Record<string, unknown>, style, parameter.explode, parameter.allowReserved);
    return;
  }

  pairs.push(`${encodeQueryComponent(parameter.name)}=${encodeQueryValue(serializePrimitive(parameter.value), parameter.allowReserved)}`);
}

function appendArrayParameter(
  pairs: string[],
  name: string,
  value: unknown[],
  style: string,
  explode: boolean,
  allowReserved: boolean,
): void {
  const values = value
    .filter((item) => item !== undefined && item !== null)
    .map((item) => serializePrimitive(item));
  if (values.length === 0) {
    return;
  }

  if (style === 'form' && explode) {
    for (const item of values) {
      pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(item, allowReserved)}`);
    }
    return;
  }

  pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(values.join(','), allowReserved)}`);
}

function appendObjectParameter(
  pairs: string[],
  name: string,
  value: Record<string, unknown>,
  style: string,
  explode: boolean,
  allowReserved: boolean,
): void {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== undefined && entryValue !== null);
  if (entries.length === 0) {
    return;
  }

  if (style === 'form' && explode) {
    for (const [key, entryValue] of entries) {
      pairs.push(`${encodeQueryComponent(key)}=${encodeQueryValue(serializePrimitive(entryValue), allowReserved)}`);
    }
    return;
  }

  const serialized = entries.flatMap(([key, entryValue]) => [key, serializePrimitive(entryValue)]).join(',');
  pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(serialized, allowReserved)}`);
}

function appendDeepObjectParameter(
  pairs: string[],
  name: string,
  value: unknown,
  allowReserved: boolean,
): void {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(serializePrimitive(value), allowReserved)}`);
    return;
  }

  for (const [key, entryValue] of Object.entries(value as Record<string, unknown>)) {
    if (entryValue === undefined || entryValue === null) {
      continue;
    }
    pairs.push(`${encodeQueryComponent(`${name}[${key}]`)}=${encodeQueryValue(serializePrimitive(entryValue), allowReserved)}`);
  }
}

function serializePrimitive(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

function encodeQueryComponent(value: string): string {
  return encodeURIComponent(value);
}

function encodeQueryValue(value: string, allowReserved: boolean): string {
  const encoded = encodeURIComponent(value);
  if (!allowReserved) {
    return encoded;
  }
  return encoded.replace(/%3A/gi, ':')
    .replace(/%2F/gi, '/')
    .replace(/%3F/gi, '?')
    .replace(/%23/gi, '#')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
    .replace(/%40/gi, '@')
    .replace(/%21/gi, '!')
    .replace(/%24/gi, '$')
    .replace(/%26/gi, '&')
    .replace(/%27/gi, "'")
    .replace(/%28/gi, '(')
    .replace(/%29/gi, ')')
    .replace(/%2A/gi, '*')
    .replace(/%2B/gi, '+')
    .replace(/%2C/gi, ',')
    .replace(/%3B/gi, ';')
    .replace(/%3D/gi, '=');
}
function buildRequestHeaders(
  headers: Record<string, HeaderParameterSpec | undefined>,
  cookies: Record<string, HeaderParameterSpec | undefined> = {},
): Record<string, string> | undefined {
  const requestHeaders: Record<string, string> = {};

  for (const [name, parameter] of Object.entries(headers)) {
    const serialized = serializeParameterValue(parameter);
    if (serialized !== undefined) {
      requestHeaders[name] = serialized;
    }
  }

  const cookieHeader = buildCookieHeader(cookies);
  if (cookieHeader) {
    requestHeaders.Cookie = requestHeaders.Cookie
      ? `${requestHeaders.Cookie}; ${cookieHeader}`
      : cookieHeader;
  }

  return Object.keys(requestHeaders).length > 0 ? requestHeaders : undefined;
}

interface HeaderParameterSpec {
  value: unknown;
  style: string;
  explode: boolean;
  contentType?: string;
}

function buildCookieHeader(cookies: Record<string, HeaderParameterSpec | undefined>): string | undefined {
  const pairs: string[] = [];
  for (const [name, parameter] of Object.entries(cookies)) {
    const serialized = serializeParameterValue(parameter);
    if (serialized !== undefined) {
      pairs.push(`${encodeURIComponent(name)}=${encodeURIComponent(serialized)}`);
    }
  }
  return pairs.length > 0 ? pairs.join('; ') : undefined;
}

function serializeParameterValue(parameter: HeaderParameterSpec | undefined): string | undefined {
  const value = parameter?.value;
  if (value === undefined || value === null) {
    return undefined;
  }
  if (parameter?.contentType) {
    return JSON.stringify(value);
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (Array.isArray(value)) {
    return value.map((item) => serializeHeaderPrimitive(item)).join(',');
  }
  if (typeof value === 'object' && value !== null) {
    return serializeHeaderObject(value as Record<string, unknown>, parameter?.explode === true);
  }
  return serializeHeaderPrimitive(value);
}

function serializeHeaderObject(value: Record<string, unknown>, explode: boolean): string {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== undefined && entryValue !== null);
  if (explode) {
    return entries.map(([key, entryValue]) => `${key}=${serializeHeaderPrimitive(entryValue)}`).join(',');
  }
  return entries.flatMap(([key, entryValue]) => [key, serializeHeaderPrimitive(entryValue)]).join(',');
}

function serializeHeaderPrimitive(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return String(value);
}
