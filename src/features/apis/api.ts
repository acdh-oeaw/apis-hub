/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-namespace */

import { isNonEmptyString } from '@stefanprobst/is-nonempty-string'
import type { HttpError, RequestOptions } from '@stefanprobst/request'
import { createUrl, request } from '@stefanprobst/request'
import type { Key, SWRConfiguration } from 'swr'
import useQuery from 'swr'
import useImmutableQuery from 'swr/immutable'
import type { SWRInfiniteConfiguration } from 'swr/infinite'
import useInfiniteQuery from 'swr/infinite'
import type { SWRMutationConfiguration } from 'swr/mutation'
import useMutation from 'swr/mutation'

import { createAuthHeaders } from '@/features/apis/create-auth-headers'
import { sortEntityTypes } from '@/features/apis/sort-entity-types'
import type {
  ApisEntity,
  ApisEntityDetails,
  ApisEntitySuggestion,
  ApisEntityType,
  ApisRelation,
  ApisRelationType,
  PaginatedResponse,
} from '@/features/apis/types'
import { createBasicAuth } from '@/lib/create-basic-auth'
import type { ApisInstanceConfig } from '~/config/apis.config'
import { chunk, limit } from '~/config/apis.config'

namespace GetApisEntitySuggestionsByType {
  export type PathParams = {
    entityType: ApisEntityType
  }
  export type SearchParams = {
    searchTerm: string
    // Backend uses `page` not `offset` on autocomplete endpoints.
    page?: number
  }
  export type Params = PathParams & SearchParams
  // UPSTREAM: Only partial pagination info in response.
  export type Response = { results: Array<ApisEntitySuggestion>; pagination: { more: boolean } }
}

function getApisEntitySuggestionsByType(
  instance: ApisInstanceConfig,
  params: GetApisEntitySuggestionsByType.Params,
): Promise<GetApisEntitySuggestionsByType.Response> {
  const { entityType, searchTerm, page } = params

  const url = createUrl({
    baseUrl: instance.url,
    pathname: `/apis/api/entities/autocomplete-network/${entityType.toLowerCase()}/`,
    searchParams: {
      // UPSTREAM: Autocomplete endpoints currently default to a non-configurable page size of 20.
      // @see https://github.com/acdh-oeaw/apis-core/issues/280#issuecomment-1113396615
      // @see https://github.com/acdh-oeaw/apis-core/issues/323
      // limit,
      page,
      q: searchTerm,
    },
  })
  const options: RequestOptions = {
    headers: createAuthHeaders(instance),
    responseType: 'json',
  }

  return request(url, options)
}

export function useGetApisEntitySuggestionsByType(
  instance: ApisInstanceConfig,
  params: GetApisEntitySuggestionsByType.Params | null,
  options?: SWRConfiguration<GetApisEntitySuggestionsByType.Response, Error>,
) {
  return useImmutableQuery(
    createQueryCacheKey(instance.id, 'apis-entity-suggestions-by-type', params),
    ([, , params]) => {
      return getApisEntitySuggestionsByType(instance, params)
    },
    { keepPreviousData: true, ...options },
  )
}

export function useGetInfiniteApisEntitySuggestionsByType(
  instance: ApisInstanceConfig,
  params: GetApisEntitySuggestionsByType.Params | null,
  options?: SWRInfiniteConfiguration<GetApisEntitySuggestionsByType.Response, Error>,
) {
  return useInfiniteQuery(
    (
      index,
      previousPageData:
        | (GetApisEntitySuggestionsByType.Response & { pagination: { page: number } })
        | null,
    ) => {
      if (params == null) return null

      const page =
        previousPageData == null ? params.page ?? 1 : previousPageData.pagination.page + 1
      return createQueryCacheKey(instance.id, 'apis-infinite-entity-suggestions-by-type', {
        ...params,
        page,
      })
    },
    async ([, , params]) => {
      const results = await getApisEntitySuggestionsByType(instance, params)
      // UPSTREAM: The APIS autocomplete endpoint only returns a `more` boolean, but not additional pagination info like the current page.
      return { ...results, pagination: { ...results.pagination, page: params.page } }
    },
    { keepPreviousData: true, ...options },
  )
}

//

namespace GetApisEntityById {
  export type PathParams = {
    id: ApisEntity['id']
  }
  export type Params = PathParams
  export type Response = ApisEntityDetails
}

function getApisEntityById(
  instance: ApisInstanceConfig,
  params: GetApisEntityById.Params,
): Promise<GetApisEntityById.Response> {
  const { id } = params

  const url = createUrl({
    baseUrl: instance.url,
    pathname: `/apis/api2/entity/${id}/`,
    searchParams: {
      format: 'json',
    },
  })
  const options: RequestOptions = {
    headers: createAuthHeaders(instance),
    responseType: 'json',
  }

  return request(url, options)
}

export function useGetApisEntityById(
  instance: ApisInstanceConfig,
  params: GetApisEntityById.Params | null,
  options?: SWRConfiguration<GetApisEntityById.Response, Error>,
) {
  return useImmutableQuery(
    createQueryCacheKey(instance.id, 'apis-entity-by-id', params),
    ([, , params]) => {
      return getApisEntityById(instance, params)
    },
    { keepPreviousData: true, ...options },
  )
}

//

namespace GetApisEntitiesByType {
  export type PathParams = {
    entityType: ApisEntityType
  }
  export type SearchParams = {
    offset?: number
  }
  export type Params = PathParams & SearchParams
  export type Response = PaginatedResponse<ApisEntity>
}

function getApisEntitiesByType(
  instance: ApisInstanceConfig,
  params: GetApisEntitiesByType.Params,
): Promise<GetApisEntitiesByType.Response> {
  const { entityType, offset } = params

  const url = createUrl({
    baseUrl: instance.url,
    pathname: `/apis/api2/entities/${entityType.toLowerCase()}/`,
    searchParams: {
      limit,
      offset,
    },
  })
  const options: RequestOptions = {
    headers: createAuthHeaders(instance),
    responseType: 'json',
  }

  return request(url, options)
}

export function useGetApisEntitiesByType(
  instance: ApisInstanceConfig,
  params: GetApisEntitiesByType.Params | null,
  options?: SWRConfiguration<GetApisEntitiesByType.Response, Error>,
) {
  return useImmutableQuery(
    createQueryCacheKey(instance.id, 'apis-entities-by-type', params),
    ([, , params]) => {
      return getApisEntitiesByType(instance, params)
    },
    { keepPreviousData: true, ...options },
  )
}

//

namespace GetApisRelationTypes {
  export type PathParams = {
    sourceEntityType: ApisEntityType
    targetEntityType: ApisEntityType
  }
  export type SearchParams = {
    searchTerm: string
    offset?: number
  }
  export type Params = PathParams & SearchParams
  export type Response = PaginatedResponse<ApisRelationType>
}

function getApisRelationTypes(
  instance: ApisInstanceConfig,
  params: GetApisRelationTypes.Params,
): Promise<GetApisRelationTypes.Response> {
  const { sourceEntityType, targetEntityType, searchTerm, offset } = params

  const url = createUrl({
    baseUrl: instance.url,
    pathname: `/apis/api/vocabularies/${sortEntityTypes(sourceEntityType, targetEntityType)
      .join('')
      .toLowerCase()}relation/`,
    searchParams: {
      limit,
      name__icontains: searchTerm,
      /** Many relation types don't actually have a reverse label, so we always search both. */
      name_reverse__icontains: searchTerm,
      offset,
    },
  })
  const options: RequestOptions = {
    headers: createAuthHeaders(instance),
    responseType: 'json',
  }

  return request(url, options)
}

export function useGetApisRelationTypes(
  instance: ApisInstanceConfig,
  params: GetApisRelationTypes.Params | null,
  options?: SWRConfiguration<GetApisRelationTypes.Response, Error>,
) {
  return useImmutableQuery(
    createQueryCacheKey(instance.id, 'apis-relation-types', params),
    ([, , params]) => {
      return getApisRelationTypes(instance, params)
    },
    { keepPreviousData: true, ...options },
  )
}

export function useGetInfiniteApisRelationTypes(
  instance: ApisInstanceConfig,
  params: GetApisRelationTypes.Params | null,
  options?: SWRInfiniteConfiguration<GetApisRelationTypes.Response, Error>,
) {
  return useInfiniteQuery(
    (index, previousPageData) => {
      if (params == null) return null

      const offset = previousPageData == null ? 0 : previousPageData.offset * previousPageData.limit
      return createQueryCacheKey(instance.id, 'apis-infinite-relation-types', { ...params, offset })
    },
    ([, , params]) => {
      return getApisRelationTypes(instance, params)
    },
    { keepPreviousData: true, ...options },
  )
}

//

namespace GetApisRelationById {
  export type PathParams = {
    sourceEntityType: ApisEntityType
    targetEntityType: ApisEntityType
    id: ApisRelation['id']
  }
  export type Params = PathParams
  export type Response = ApisRelation
}

function getApisRelationById(
  instance: ApisInstanceConfig,
  params: GetApisRelationById.Params,
): Promise<GetApisRelationById.Response> {
  const { sourceEntityType, targetEntityType, id } = params

  const url = createUrl({
    baseUrl: instance.url,
    pathname: `/apis/api/relations/${sortEntityTypes(sourceEntityType, targetEntityType)
      .join('')
      .toLowerCase()}/${id}/`,
    searchParams: {
      format: 'json+net',
    },
  })
  const options: RequestOptions = {
    headers: createAuthHeaders(instance),
    responseType: 'json',
  }

  return request(url, options)
}

export function useGetApisRelationById(
  instance: ApisInstanceConfig,
  params: GetApisRelationById.Params | null,
  options?: SWRConfiguration<GetApisRelationById.Response, Error>,
) {
  return useQuery(
    createQueryCacheKey(instance.id, 'apis-relation-by-id', params),
    ([, , params]) => {
      return getApisRelationById(instance, params)
    },
    { keepPreviousData: true, ...options },
  )
}

//

namespace GetApisRelations {
  export type PathParams = {
    sourceEntityType: ApisEntityType
    targetEntityType: ApisEntityType
  }
  export type SearchParams = {
    relationType?: string
    sourceEntity?: string
    targetEntity?: string
    offset?: number
  }
  export type Params = PathParams & SearchParams
  export type Response = PaginatedResponse<ApisRelation>
}

function getApisRelations(
  instance: ApisInstanceConfig,
  params: GetApisRelations.Params,
): Promise<GetApisRelations.Response> {
  const { sourceEntityType, targetEntityType, relationType, sourceEntity, targetEntity, offset } =
    params

  const url = createUrl({
    baseUrl: instance.url,
    pathname: `/apis/api/relations/${sortEntityTypes(sourceEntityType, targetEntityType)
      .join('')
      .toLowerCase()}/`,
    searchParams: {
      format: 'json+net',
      limit: chunk,
      offset,
      relation_type__id: relationType,
      [`related_${
        sourceEntityType.toLowerCase() + (sourceEntityType === targetEntityType ? 'A' : '')
      }__id`]: sourceEntity,
      [`related_${
        targetEntityType.toLowerCase() + (sourceEntityType === targetEntityType ? 'B' : '')
      }__id`]: targetEntity,
    },
  })
  const options: RequestOptions = {
    headers: createAuthHeaders(instance),
    responseType: 'json',
  }

  return request(url, options)
}

export function useGetApisRelations(
  instance: ApisInstanceConfig,
  params: GetApisRelations.Params | null,
  options?: SWRConfiguration<GetApisRelations.Response, Error>,
) {
  return useQuery(
    createQueryCacheKey(instance.id, 'apis-relations', params),
    ([, , params]) => {
      return getApisRelations(instance, params)
    },
    {
      /**
       * When a query has previously been aborted by navigating away, we want to ensure all pages
       * are refetched. Otherwise, missing pages would never be requested when the first page has been cached.
       */
      dedupingInterval: 0,
      keepPreviousData: true,
      ...options,
    },
  )
}

//

namespace SignInWithBasicAuth {
  export type Body = { username: string; password: string }
  /** We don't care about the response payload. */
  export type Response = unknown
}

/**
 * We don't actually sign a user in. APIS instances support Basic Auth, so we just check if
 * the instance returns 401 for the provided username and password.
 */
function signInWithBasicAuth(
  instance: ApisInstanceConfig,
  data: SignInWithBasicAuth.Body,
): Promise<SignInWithBasicAuth.Response> {
  const url = createUrl({
    baseUrl: instance.url,
    pathname: '/apis/api',
  })
  const options: RequestOptions = {
    headers: { authorization: createBasicAuth(data.username, data.password) },
    responseType: 'json',
  }

  return request(url, options)
}

export function useSignInWithBasicAuth(
  instance: ApisInstanceConfig,
  options: SWRMutationConfiguration<SignInWithBasicAuth.Response, Error>,
) {
  return useMutation(
    [instance.id, 'apis-auth'],
    (_: Key, { arg: data }: { arg: SignInWithBasicAuth.Body }) => {
      return signInWithBasicAuth(instance, data)
    },
    options,
  )
}

//

export async function getApisErrorMessage(error: HttpError): Promise<string> {
  if (error.response.headers.get('content-type') === 'application/json') {
    const data = await error.response.json()
    const message = data.detail
    if (isNonEmptyString(message)) {
      return message
    }
  }
  return error.response.statusText
}

//

function createParamsCacheKey<T extends object>(params: T): T {
  /**
   * Sort entity types for cache key to avoid unnecessary fetches.
   * We also want this for relation types, since we always query on both
   * `name` and `name_reverse` because the latter may be `null`.
   */
  if ('sourceEntityType' in params && 'targetEntityType' in params) {
    const [sourceEntityType, targetEntityType] = sortEntityTypes(
      // @ts-expect-error Not sure why type narrowing does not work here.
      params.sourceEntityType,
      // @ts-expect-error Not sure why type narrowing does not work here.
      params.targetEntityType,
    )

    return { ...params, sourceEntityType, targetEntityType }
  }

  return params
}

function createQueryCacheKey<T extends object>(
  id: ApisInstanceConfig['id'],
  key: string,
  params: T | null,
) {
  if (params == null) return null
  const cacheKey = [id, key, createParamsCacheKey(params)] as const
  return cacheKey
}
