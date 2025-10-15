import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CardUpdateDto {
  // @ApiProperty({
  //   example: '4111111111111111',
  //   description: 'Credit or debit card number',
  // })
  // @IsString()
  // @IsNotEmpty()
  // cardNumber: string;

  // @ApiProperty({
  //   example: '12/27',
  //   description: 'Expiration date of the card (MM/YY)',
  // })
  // @IsString()
  // @IsNotEmpty()
  // expiryDate: string;

  // @ApiProperty({
  //   example: 'John Doe',
  //   description: 'Name printed on the card',
  // })
  // @IsString()
  // @IsNotEmpty()
  // cardHolderName: string;

  // @ApiProperty({
  //   example: true,
  //   description: 'Indicates if the card should be set as default',
  //   required: false,
  // })
  // @IsOptional()
  // @IsBoolean()
  // setAsDefault?: boolean;

  @ApiProperty({
    example: '4242',
    description: 'Last 4 digits of the card number',
  })
  @IsString()
  @IsNotEmpty()
  cardLast4: string;

  @ApiProperty({
    example: '12',
    description: 'Card expiration month (MM)',
  })
  @IsString()
  @IsNotEmpty()
  expiryMonth: string;

  @ApiProperty({
    example: '2027',
    description: 'Card expiration year (YYYY)',
  })
  @IsString()
  @IsNotEmpty()
  expiryYear: string;
}
