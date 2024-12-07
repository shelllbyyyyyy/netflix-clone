import { Inject, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Client, estypes } from '@elastic/elasticsearch';

import { ELASTIC_CONNECTION } from '../constant';
import { profileSchema_v1, userSchema_v1 } from './schema';

export class SearchService implements OnModuleInit, OnModuleDestroy {
  private readonly usersIndex = 'users';
  private readonly profilesIndex = 'profiles';

  constructor(@Inject(ELASTIC_CONNECTION) private readonly esService: Client) {}

  async onModuleInit() {
    try {
      const [userIndexExists, profileIndexExists] = await Promise.all([
        this.esService.indices.exists({
          index: `${this.usersIndex}_v1`,
        }),
        this.esService.indices.exists({
          index: `${this.profilesIndex}_v1`,
        }),
      ]);

      if (!userIndexExists) {
        const { acknowledged } = await this.esService.indices.create({
          index: `${this.usersIndex}_v1`,
        });

        if (acknowledged) {
          await Promise.all([
            this.esService.indices.putMapping(userSchema_v1),
            this.esService.indices.putAlias({
              index: `${this.usersIndex}_v1`,
              name: this.usersIndex,
            }),
          ]);
        }
      }

      if (!profileIndexExists) {
        const { acknowledged } = await this.esService.indices.create({
          index: `${this.profilesIndex}_v1`,
        });

        if (acknowledged) {
          await Promise.all([
            this.esService.indices.putMapping(profileSchema_v1),
            this.esService.indices.putAlias({
              index: `${this.profilesIndex}_v1`,
              name: this.profilesIndex,
            }),
          ]);
        }
      }
    } catch (error) {
      throw 'error';
    }
  }

  async onModuleDestroy() {
    await this.esService.close();
  }

  public async index<T>(
    index: string,
    id: string,
    document: T,
  ): Promise<estypes.IndexResponse> {
    try {
      const result = await this.esService.index({
        index,
        id,
        document,
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  public async bulkIndex(
    operations: estypes.BulkOperationContainer[],
  ): Promise<estypes.BulkResponse> {
    try {
      const { errors, items, took, ingest_took } = await this.esService.bulk({
        operations,
      });

      return {
        errors,
        items,
        took,
        ingest_took,
      };
    } catch (error) {
      throw error;
    }
  }

  public async searchExact<T>(
    index: string,
    query: estypes.QueryDslQueryContainer,
  ): Promise<estypes.SearchResponse<T>> {
    try {
      const result = await this.esService.search<T>({
        index,
        query,
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  public async search<T, D>(
    index: string,
    query: estypes.QueryDslQueryContainer,
    offset: number,
    limit: number,
    sort: estypes.Sort,
  ): Promise<D> {
    try {
      const result = await this.esService.search<T>({
        index,
        from: offset ? offset : 0,
        size: limit,
        query,
        sort,
      });

      const total =
        typeof result.hits.total === 'number'
          ? result.hits.total
          : result.hits.total?.value;

      const final = {
        data: result.hits.hits.map((d) => d._source),
        total,
        limit: +limit,
        page: Math.floor(offset / +limit) + 1,
        total_pages: Math.ceil(total / limit),
      };

      return final as D;
    } catch (error) {
      console.error('Elasticsearch search error:', error);
      throw error;
    }
  }

  public async delete(
    index: string,
    id: string,
  ): Promise<estypes.DeleteResponse> {
    try {
      const result = await this.esService.delete({ index, id });

      return result;
    } catch (error) {
      throw error;
    }
  }

  public async update(
    index: string,
    id: string,
    doc: Record<string, any>,
  ): Promise<estypes.UpdateResponse> {
    try {
      return await this.esService.update({ index, id, doc });
    } catch (error) {
      throw error;
    }
  }
}
