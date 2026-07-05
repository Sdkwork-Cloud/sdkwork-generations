export type Modality = 'agent' | 'chat' | 'image' | 'video' | 'music' | 'audio' | 'sfx' | 'package' | 'assets';
export type GenerationModality = Exclude<Modality, 'chat' | 'assets'>;

export const PLAYGROUND_MODALITY_ROUTES = {
  agent: '/playground/agent',
  chat: '/playground/chat',
  image: '/playground/image',
  video: '/playground/video',
  music: '/playground/music',
  audio: '/playground/audio',
  sfx: '/playground/sfx',
  assets: '/playground/assets',
} as const satisfies Record<Exclude<Modality, 'package'>, string>;
