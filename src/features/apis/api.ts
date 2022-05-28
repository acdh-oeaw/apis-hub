/* eslint-disable @typescript-eslint/no-namespace */

import { assert } from '@stefanprobst/assert'
import { isNonEmptyString } from '@stefanprobst/is-nonempty-string'
import type { HttpError, RequestOptions } from '@stefanprobst/request'
import { createUrl, request } from '@stefanprobst/request'
import type { UseInfiniteQueryOptions, UseMutationOptions, UseQueryOptions } from 'react-query'
import { useInfiniteQuery, useMutation, useQuery } from 'react-query'

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

export function useGetApisEntitySuggestionsByType<TData = GetApisEntitySuggestionsByType.Response>(
  instance: ApisInstanceConfig,
  params: GetApisEntitySuggestionsByType.Params | null,
  options?: UseQueryOptions<GetApisEntitySuggestionsByType.Response, Error, TData, any>,
) {
  return useQuery(
    createQueryCacheKey(instance.id, 'apis-entity-suggestions-by-type', params),
    () => {
      assert(params != null)
      return getApisEntitySuggestionsByType(instance, params)
    },
    { keepPreviousData: true, ...options },
  )
}

export function useGetInfiniteApisEntitySuggestionsByType<
  TData = GetApisEntitySuggestionsByType.Response,
>(
  instance: ApisInstanceConfig,
  params: GetApisEntitySuggestionsByType.Params | null,
  options?: UseInfiniteQueryOptions<
    GetApisEntitySuggestionsByType.Response,
    Error,
    TData,
    GetApisEntitySuggestionsByType.Response,
    any
  >,
) {
  return useInfiniteQuery(
    createQueryCacheKey(instance.id, 'apis-infinite-entity-suggestions-by-type', params),
    async ({ pageParam }) => {
      assert(params != null)
      const page = pageParam ?? params.page ?? 1
      const results = await getApisEntitySuggestionsByType(instance, { ...params, page })
      // UPSTREAM: The APIS autocomplete endpoint only returns a `more` boolean, but not additional pagination info like the current page.
      return { ...results, pagination: { ...results.pagination, page } }
    },
    {
      keepPreviousData: true,
      ...options,
      getNextPageParam(lastPage, _allPages) {
        if (lastPage.pagination.more) {
          const pagination = lastPage.pagination as typeof lastPage.pagination & { page: number }
          return pagination.page + 1
        }
        return undefined
      },
    },
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

export function useGetApisEntityById<TData = GetApisEntityById.Response>(
  instance: ApisInstanceConfig,
  params: GetApisEntityById.Params | null,
  options?: UseQueryOptions<GetApisEntityById.Response, Error, TData, any>,
) {
  return useQuery(
    createQueryCacheKey(instance.id, 'apis-entity-by-id', params),
    () => {
      assert(params != null)
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

export function useGetApisEntitiesByType<TData = GetApisEntitiesByType.Response>(
  instance: ApisInstanceConfig,
  params: GetApisEntitiesByType.Params | null,
  options?: UseQueryOptions<GetApisEntitiesByType.Response, Error, TData, any>,
) {
  return useQuery(
    createQueryCacheKey(instance.id, 'apis-entities-by-type', params),
    () => {
      assert(params != null)
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

export function useGetApisRelationTypes<TData = GetApisRelationTypes.Response>(
  instance: ApisInstanceConfig,
  params: GetApisRelationTypes.Params | null,
  options?: UseQueryOptions<GetApisRelationTypes.Response, Error, TData, any>,
) {
  return useQuery(
    createQueryCacheKey(instance.id, 'apis-relation-types', params),
    () => {
      assert(params != null)
      return getApisRelationTypes(instance, params)
    },
    { keepPreviousData: true, ...options },
  )
}

export function useGetInfiniteApisRelationTypes<TData = GetApisRelationTypes.Response>(
  instance: ApisInstanceConfig,
  params: GetApisRelationTypes.Params | null,
  options?: UseInfiniteQueryOptions<
    GetApisRelationTypes.Response,
    Error,
    TData,
    GetApisRelationTypes.Response,
    any
  >,
) {
  return useInfiniteQuery(
    createQueryCacheKey(instance.id, 'apis-infinite-relation-types', params),
    ({ pageParam }) => {
      assert(params != null)
      const offset = pageParam ?? params.offset ?? 0
      return getApisRelationTypes(instance, { ...params, offset })
    },
    {
      keepPreviousData: true,
      ...options,
      getNextPageParam(lastPage, _allPages) {
        if (lastPage.next != null) {
          return lastPage.offset + lastPage.limit
        }
        return undefined
      },
    },
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

export function useGetApisRelationById<TData = GetApisRelationById.Response>(
  instance: ApisInstanceConfig,
  params: GetApisRelationById.Params | null,
  options?: UseQueryOptions<GetApisRelationById.Response, Error, TData, any>,
) {
  return useQuery(
    createQueryCacheKey(instance.id, 'apis-relation-by-id', params),
    () => {
      assert(params != null)
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

export function useGetApisRelations<TData = GetApisRelations.Response>(
  instance: ApisInstanceConfig,
  params: GetApisRelations.Params | null,
  options?: UseQueryOptions<GetApisRelations.Response, Error, TData, any>,
) {
  return useQuery(
    createQueryCacheKey(instance.id, 'apis-relations', params),
    () => {
      assert(params != null)
      return getApisRelations(instance, params)
    },
    { keepPreviousData: true, ...options },
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
  options?: UseMutationOptions<SignInWithBasicAuth.Response, Error, SignInWithBasicAuth.Body>,
) {
  return useMutation((data) => {
    return signInWithBasicAuth(instance, data)
  }, options)
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

function createParamsCacheKey<T extends object>(params: T | null): T | null {
  if (params == null) return null

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
  const cacheKey = [id, key, createParamsCacheKey(params)] as const
  return cacheKey
}
