import { Injectable } from '@nestjs/common';
import { format, FormatterOptionsArgs, FormatterRowHashArray } from 'fast-csv';
import { Writable } from 'stream';

@Injectable()
export class CsvService {
  async writeToStream<T extends FormatterRowHashArray>(
    stream: Writable,
    data: T[],
    headers: string[] | boolean = true,
    options: Partial<FormatterOptionsArgs<T, T>> = {},
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const csvStream = format<T, T>({ headers, ...options });

      csvStream.on('error', reject).on('finish', resolve);
      csvStream.pipe(stream);

      for (const row of data) {
        csvStream.write(row);
      }

      csvStream.end();
    });
  }
}
