type Autocomplete<T, U> = T & {
    __autocomplete?: U;
};
/** Sup Message App API V2 */
export declare class Sup {
    #private;
    /** ID of this Message App */
    id: string;
    /** Whether this is a reply to another message */
    isReply: boolean;
    /** The user invoking this Message App */
    user: SupUser;
    /** Multi-modal user input from (1) invocation message (2) replyTo app output (3) replyTo message body */
    input: SupInput;
    /** The message that invoked this Message App */
    message: SupMessage | undefined;
    /** The chat this app was invoked in */
    chat: SupChat | undefined;
    /** The message being replied to, if any */
    reply: SupMessage | undefined;
    /** @passthrough */
    ai: SupAI;
    /** @passthrough */
    vc: SupVC;
    /** @passthrough */
    media: SupMediaCommands;
    /** @passthrough */
    random: SupRandom;
    /** @hidden */
    constructor(supV1: any);
    /** Make an HTTP request */
    fetch(url: Autocomplete<string, "'url'">, options?: RequestInit | undefined): Response;
    /** Store value in object store (global scope) */
    set(key: Autocomplete<string, "'key'">, value: JSONObject): any;
    /** Get value from object store (global scope) */
    get(key: Autocomplete<string, "'key">): JSONObject;
    /** Return asset uploaded on Message App creation screen */
    asset(filename: Autocomplete<string, "'file.jpg'">): SupAudio | SupImage | SupVideo | SupFile;
    /** Return secret value defined on Message App creation screen */
    secret(key: Autocomplete<string, "'key'">): string;
    /** Display an audio player */
    audio(urlOrBlob: Autocomplete<string | Blob, "'url'">): SupAudio;
    /** Display an image */
    image(url: Autocomplete<string, "'url'">): SupImage;
    /** Display a video */
    video(url: Autocomplete<string, "'url'">): SupVideo;
    /** Display HTML content */
    html(html: string, size: 'sm' | 'md' | 'lg' | undefined): SupHTML;
    /** Render an SVG */
    svg(content: Autocomplete<string, "''">): SupSVG;
    getApp(appID: Autocomplete<string, "'appid'">): SupApp;
    makePublic(...props: (string | Function)[]): void;
}
declare class SupChat {
    #private;
    /** ID of the chat */
    id: string;
    /** Current title of the chat  */
    title: string;
    constructor(supV1: any, id: string, title: string);
    toString: () => string;
    get(key: string): JSONObject;
    set(key: string, value: JSONObject): any;
}
declare class SupRandom {
    /** Get a random integer between min and max (inclusive) */
    integer(min: Autocomplete<number, '0'>, max: Autocomplete<number, '10'>): number;
    /** Get a random float between min and max (inclusive) */
    float(min: Autocomplete<number, '0.1'>, max: Autocomplete<number, '0.2'>): number;
    /** 50/50 true or false */
    boolean(): boolean;
    /** Choose a random element from the given array */
    choice<T>(arr: Autocomplete<T[], '[]'>): T;
    /** Shuffle an array in place */
    shuffle<T>(arr: Autocomplete<T[], '[]'>): void;
}
declare class SupUser {
    #private;
    /** User ID */
    id: string;
    username: string;
    pfp: SupImage | undefined;
    constructor(id: string, username: string, pfp: SupImage | undefined, supV1: any);
    /** Store value in object store (user scope) */
    get(key: Autocomplete<string, "'key'">): JSONObject;
    /** Get value from object store (user scope) */
    set(key: Autocomplete<string, "'key'">, value: JSONObject): any;
    /** @hidden */
    toString: () => string;
}
declare class SupInput {
    texts: string[];
    images: SupImage[];
    audios: SupAudio[];
    videos: SupVideo[];
    /** Files that aren't audio, video or image */
    files: SupFile[];
    constructor(texts: string[], images: SupImage[], audios: SupAudio[], videos: SupVideo[], files: SupFile[]);
    get text(): string | undefined;
    get image(): SupImage | undefined;
    get audio(): SupAudio | undefined;
    get video(): SupVideo | undefined;
    /** Array with all text, audio, video and images. Can be used as input to sup.ai.prompt() */
    get combined(): (string | SupAudio | SupImage | SupVideo)[];
}
declare class SupMessage {
    #private;
    /** Message ID */
    id: string;
    /** Message body */
    body: string;
    /** Author of this message */
    author: SupUser;
    /** Input that came specifically from this message */
    input: SupInput;
    /** Result of Message App invocation, if this message ran one */
    result: SupInput | undefined;
    constructor(id: string, body: string, author: SupUser, input: SupInput, result: SupInput | undefined, supV1: any);
    get(key: Autocomplete<string, "'key'">): JSONObject;
    set(key: Autocomplete<string, "'key'">, value: JSONObject): any;
}
declare class SupAudio {
    #private;
    constructor(key: Symbol, url: string | undefined, blob: Blob | undefined);
    static fromUrl(url: Autocomplete<string, "'url'">): SupAudio;
    static fromBlob(blob: Blob): SupAudio;
    get url(): string;
    toString: () => string;
}
declare class SupVideo {
    #private;
    constructor(key: Symbol, url: string);
    static fromUrl(url: string): SupVideo;
    get url(): string;
    toString: () => string;
}
declare class SupImage {
    #private;
    constructor(key: Symbol, url: string);
    static fromUrl(url: string): SupImage;
    get url(): string;
    toString: () => string;
}
declare class SupHTML {
    html: string;
    size: string | undefined;
    constructor(html: Autocomplete<string, "''">, size?: 'sm' | 'md' | 'lg');
    toString: () => string;
}
declare class SupSVG {
    content: string;
    constructor(content: string);
}
type JSONObject = string | number | boolean | null | JSONObject[] | {
    [key: string]: JSONObject;
};
/** File attachment that's neither audio, video or image */
declare class SupFile {
    #private;
    mimeType: string;
    constructor(key: Symbol, url: string, mimeType: string);
    static fromUrl(url: string, mimeType: string): SupFile;
    get url(): string;
    get blob(): Blob;
    get text(): string;
    toString: () => string;
}
declare class SupAI {
    #private;
    /** @passthrough */
    image: SupAIImage;
    constructor(supV1: any);
    /** Generates an AI chat response given text as the input prompt */
    prompt(...args: Autocomplete<(string | SupImage | SupInput)[], "'prompt'">): any;
}
declare class SupAIImage {
    #private;
    constructor(supV1: any);
    /** Create an image using AI */
    create(prompt: Autocomplete<string, "'prompt'">): SupImage;
    /** AI image to text */
    interpret(image: SupImage, prompt: Autocomplete<string, "'prompt'">): string;
}
declare class SupVC {
    #private;
    /** @passthrough */
    queue: SupVCQueue;
    constructor(supV1: any);
    get participants(): SupUser[];
    /** Start recording the voice call to an audio file. Returns a recording ID
     * that can be used with `finishRecording()` to retrieve the audio file    */
    beginRecording(): string;
    endRecording(recordingId: string): SupAudio;
}
declare class SupVCQueue {
    #private;
    constructor(supV1: any);
    add(mediaOrURL: string | SupVideo | SupImage | SupAudio, title?: string): void;
}
declare class Blob {
    #private;
    type: string;
    constructor(arrayBuffer: ArrayBuffer, mimeType: string);
    get size(): number;
    arrayBuffer(): ArrayBuffer;
    bytes(): Uint8Array;
    slice(start: number, end: number): Blob;
    text(): string;
}
declare class Response {
    #private;
    ok: boolean;
    redirected: boolean;
    status: number;
    statusText: string;
    url: string;
    headers: Headers;
    constructor(ok: boolean, redirected: boolean, status: number, statusText: string, headers: Headers, url: string, blob: Blob);
    arrayBuffer(): ArrayBuffer;
    json(): JSONObject;
    blob(): Blob;
}
declare class FormData {
    constructor();
    append(key: string, value: string | Blob, filename?: string): void;
    toArrayBuffer(): (string | ArrayBuffer)[];
    private readonly data;
}
type Headers = {
    [key: string]: string;
};
interface RequestInit {
    method?: string;
    headers?: Headers;
    body?: string | FormData | ArrayBuffer;
}
declare class SupApp {
    #private;
    id: string;
    [key: string]: JSONObject | Function;
    constructor(id: string, supV1: any, functionNames: string[], dataNames: string[]);
    property(name: string): JSONObject;
    function(name: string): Function;
}
declare class SupMediaCommands {
    #private;
    constructor(supV1: any);
    beginEditing(audio: SupAudio): SupAudioEditCursor;
    finishEditing(cursor: SupAudioEditCursor): SupAudio;
}
declare class SupAudioEditCursor {
    #private;
    audio: SupAudio;
    constructor(audio: SupAudio);
    reverse(): void;
    changeSpeed(factor: number): void;
    changeTempo(factor: number): void;
    changePitch(change: number): void;
    changeVolume(gain: number): void;
    trimStart(seconds: number): void;
    trimEnd(seconds: number): void;
    padStart(seconds: number): void;
    padEnd(seconds: number): void;
    fadeIn(seconds: number): void;
    fadeOut(seconds: number): void;
    normalize(): void;
    reverb(reverberance: number, options: {
        hfDamping?: number;
        roomScale?: number;
        stereoDepth?: number;
        preDelay?: number;
        wetGain?: number;
    }): void;
    echo(gainIn: number, gainOut: number, options: {
        delay?: number;
        decay?: number;
    }): void;
    chorus(gainIn: number, gainOut: number, options: {
        delay?: number;
        decay?: number;
        speed?: number;
        depth?: number;
    }): void;
    mixWith(...audios: SupAudio[]): void;
    combineWith(...audios: SupAudio[]): void;
    /** @hidden */
    toJSON(): {
        name: string;
    }[];
}
export {};
