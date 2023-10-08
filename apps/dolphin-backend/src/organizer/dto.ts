import {
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
  ValidateIf,
} from 'class-validator';

export class EventDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @ValidateIf((o) => o.description != undefined)
  @IsString()
  description?: string;

  @IsISO8601()
  startDate: string;

  @IsISO8601()
  endDate: string;

  @ValidateIf((o) => o.link != undefined)
  @IsUrl()
  link?: string;

  @ValidateIf((o) => o.location != undefined)
  @IsString()
  location?: string;

  @ValidateIf((o) => o.maxParticipants != undefined)
  @IsNumber()
  @IsPositive()
  maxParticipants?: number;
}
