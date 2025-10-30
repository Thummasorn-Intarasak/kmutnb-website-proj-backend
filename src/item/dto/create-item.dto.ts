export class CreateItemDto {
  game_name: string;
  game_description?: string;
  game_price: number;
  game_image?: string;
  game_tag?: string[];
}
