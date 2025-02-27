import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { GeneratorDto } from '@common/dtos/generator/generator.dto';

@Injectable()
export class GeneratorService {
  private apiKey: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('OPEN_AI_API_KEY');
  }

  async generate(rbody: GeneratorDto): Promise<string> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    };
    const body = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `
          Generate a cover letter of 400 to 500 words for a person applying to the company ${rbody.company}
          for the position of ${rbody.title} which requires ${rbody.experience} years of experience and the given skills
          ${rbody.skills}.
        `,
        },
      ],
      n: 1,
    };
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `https://api.openai.com/v1/chat/completions`,
          body,
          { headers },
        ),
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error(error);
      return '';
    }
  }
}
