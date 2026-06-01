import { ContainerBuilder, SlashCommandBuilder } from "@discordjs/builders";
import {
    ChatInputCommandInteraction
} from "discord.js";

export interface Command {
    name: string;
    description: string;
    definition: SlashCommandBuilder;
    execute(data: CommandData): MessageData | undefined;
};

export interface CommandData {
    interaction: ChatInputCommandInteraction | null;
    args: string[];
};

export interface MessageData {
    content?: string;
    container: ContainerBuilder,
    ephemeral?: boolean
};

export enum ComponentColors {
    Normal = 0x187ae7,
    Error = 0xcc2024,
    Success = 0x4cbb17
};

// https://scryfall.com/docs/api/cards
export type Card = {
    id: string;
    resource_id?: string;
    layout: string;
    oracle_id?: string;
    prints_search_uri: string;
    rulings_uri: string;
    scryfall_uri: string;
    all_parts?: RelatedCard[];
    card_faces?: CardFace[];
    cmc: number;
    color_identity: string[];
    color_indicator: string[];
    colors?: string[];
    defense?: string;
    edhrec_rank?: number;
    game_changer?: boolean;
    hand_modifier?: string;
    keywords: string[];
    legalities: Object;
    life_modifier?: string;
    loyalty?: string;
    mana_cost?: string;
    name: string;
    oracle_text?: string;
    penny_rank?: number;
    power?: string;
    produced_mana?: string[];
    reserved: boolean;
    toughness?: string;
    type_line: string;
    artist?: string;
    artist_ids?: string[];
    booster: boolean;
    border_color: string;
    card_back_id: string;
    collector_number: string;
    content_warning?: boolean;
    digital: boolean;
    finishes: string[];
    flavor_name?: string;
    flavor_text?: string;
    frame_effects?: string[];
    frame: string;
    full_art: boolean;
    games: string[];
    highres_image: boolean;
    illustration_id?: string;
    image_status: string;
    image_uris?: ImageUris;
    oversized: boolean;
    prices: Object;
    printed_name?: string;
    printed_text?: string;
    printed_type_line?: string;
    promo: boolean;
    promo_types?: string[];
    purchase_uris?: Object;
    rarity: string;
    related_uris: Object;
    released_at: string;
    reprint: boolean;
    scryfall_set_uri: string;
    set_name: string;
    set_search_uri: string;
    set_type: string;
    set_uri: string;
    set: string;
    set_id: string;
    story_spotlight: boolean;
    textless: boolean;
    variation: boolean;
    variation_of?: string;
    security_stamp?: string;
    watermark?: string;
};

export type RelatedCard = {
    id: string;
    object: string;
    component: string;
    name: string;
    type_line: string;
    uri: string;
};

export type CardFace = {
    artist?: string;
    artist_id?: string;
    cmc: number;
    color_identity: string[];
    color_indicator?: string[];
    colors?: string[];
    defense?: string;
    edhrec_rank?: number;
    game_changer?: boolean;
    hand_modifier?: string;
    keywords: string[];
    legalities: Object;
    life_modifier?: string;
    loyalty?: string;
    mana_cost?: string;
    name: string;
    oracle_text?: string;
    penny_rank?: number;
    power?: string;
    produced_mana?: string[];
    reserved: boolean;
    toughness?: string;
    type_line: string;
};

export type ImageUris = {
    small: string;
    normal: string;
    large: string;
}
