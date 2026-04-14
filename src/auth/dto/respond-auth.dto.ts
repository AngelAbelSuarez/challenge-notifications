import { ApiProperty } from '@nestjs/swagger';

export class RespondAuthDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'The JWT authentication token',
  })
  token: string;

  @ApiProperty({
    example: '44fa7970-b9aa-439f-b760-bb96dd120a0d',
    description: 'The id of the user',
  })
  id: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the logged-in user',
  })
  email: string;

  constructor(data: { token: string; id: string; email: string }) {
    this.token = data.token;
    this.id = data.id;
    this.email = data.email;
  }
}
